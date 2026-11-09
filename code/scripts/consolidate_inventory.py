#!/usr/bin/env python3
"""Rebuild the canonical V1 catalog from the retained XLSX, without Google access.
Uses only the standard library; does not evaluate spreadsheet formulas.
"""
import argparse
import hashlib
import json
from pathlib import Path
import re
import zipfile
import xml.etree.ElementTree as ET
from sync_uncut_gem_inventory import COLUMNS, validate_url

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'source/UncutGemInventoryV1V2.xlsx'
OUTPUT = ROOT / 'source/InventoryV1.json'
NS = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
EXTRA = {'Categoria': 'category', 'Pertence a': 'parent', 'Tag inventário V1': 'legacyTag', 'Face da PCB': 'face'}

def read_sheets(path):
    with zipfile.ZipFile(path) as archive:
        strings = []
        if 'xl/sharedStrings.xml' in archive.namelist():
            strings = [''.join(n.itertext()) for n in ET.fromstring(archive.read('xl/sharedStrings.xml')).findall('s:si', NS)]
        relationships = {r.attrib['Id']: r.attrib['Target'] for r in ET.fromstring(archive.read('xl/_rels/workbook.xml.rels'))}
        sheets = []
        for sheet in ET.fromstring(archive.read('xl/workbook.xml')).findall('s:sheets/s:sheet', NS):
            rel = sheet.attrib['{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id']
            target = relationships[rel]
            filename = target.lstrip('/') if target.startswith('/') else 'xl/' + target
            rows = []
            for row in ET.fromstring(archive.read(filename)).findall('s:sheetData/s:row', NS):
                cells = {}
                for c in row.findall('s:c', NS):
                    col = re.match('[A-Z]+', c.attrib['r'])[0]
                    v = c.find('s:v', NS)
                    value = v.text or '' if v is not None else ''
                    if c.attrib.get('t') == 's': value = strings[int(value)]
                    if c.attrib.get('t') == 'inlineStr': value = ''.join(c.find('s:is', NS).itertext())
                    # Preserve IMAGE formulas as evidence; never execute them.
                    if c.find('s:f', NS) is not None: value = '=' + (c.find('s:f', NS).text or '')
                    cells[col] = value.strip()
                rows.append(cells)
            headers = rows[0]
            sheets.append((sheet.attrib['name'], [{headers[k]: v for k, v in row.items() if k in headers} for row in rows[1:]]))
        return sheets

def consolidate(path=SOURCE):
    sheets = read_sheets(path)
    names = [name for name, _ in sheets]
    if len(names) != 4 or any(name == 'Uncut Gem V1' for name in names):
        raise ValueError('XLSX operacional deve conter exatamente quatro abas, sem a aba V1 histórica')
    matches = [(name, rows) for name, rows in sheets if name.startswith('Árvore Uncut Gem V1')]
    if len(matches) != 1: raise ValueError('Fonte canônica não identificada unicamente')
    tree_name, tree_rows = matches[0]
    result = []
    for row in tree_rows:
        if not row.get('Tag única'): continue
        mapping = {**COLUMNS, **EXTRA}
        mapping.pop('Componente')
        mapping['Componente / Subsistema'] = 'name'
        item = {key: row.get(label, '') for label, key in mapping.items()}
        item['imageFormula'] = row.get('Imagem', '')
        if item['category'] not in ('subsistema', 'componente'): raise ValueError('Categoria inválida')
        item['layer'] = 'A' if item['category'] == 'subsistema' else 'B'
        result.append(item)
    parents = {i['name']: i['tag'] for i in result if i['layer'] == 'A'}
    for item in result:
        item['parentTag'] = parents.get(item['parent'], '')
        if item['layer'] == 'B' and not item['parentTag']: raise ValueError('Componente sem subsistema: ' + item['tag'])
        if not item['name'] or not item['subsystem']: raise ValueError('Registro incompleto')
        for field in ('imageUrl', 'datasheet'):
            if not validate_url(item[field]): raise ValueError('URL inválida: ' + item['tag'])
    if len(result) != 79 or len({i['tag'] for i in result}) != 79 or sum(i['layer'] == 'A' for i in result) != 10:
        raise ValueError('Exigidos 79 registros únicos, 10 subsistemas e 69 componentes')
    # Approved image/face evidence from the Builder supplements the workbook,
    # retained with full provenance instead of a competing runtime catalog.
    evidence_root = ROOT / 'source/evidence'
    plans = json.loads((evidence_root / 'LayerBComponentImagePlan.json').read_text(encoding='utf-8'))
    faces = json.loads((evidence_root / 'LayerBBoardFaceIndex.json').read_text(encoding='utf-8'))
    images = {i['tag']: i for i in plans['components']}
    board_faces = {i['tag']: i['face'] for i in faces['items']}
    for item in result:
        evidence = images.get(item['tag'], {})
        item['imageStatus'] = evidence.get('status', '')
        item['imageClass'] = evidence.get('class', '')
        item['imageNotes'] = evidence.get('notes', '')
        item['imageSource'] = evidence.get('source_technical', '')
        if item['tag'] in board_faces:
            item['face'] = board_faces[item['tag']]
        if evidence.get('status') == 'CHECK' and evidence.get('filename'):
            item['imageUrl'] = 'https://raw.githubusercontent.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/main/code/public/assets/official/v1/components/' + evidence['filename']
            item['imageType'] = evidence.get('image_type') or item['imageType']
        elif evidence.get('existing_image_url'):
            item['imageUrl'] = evidence['existing_image_url']
            item['imageType'] = evidence.get('existing_image_type') or item['imageType']
        # Follow the upstream naming migration while preserving original values in the XLSX.
        for key in ('imageUrl',):
            url = item[key]
            if '/assets/components/illustrative/ug-v1-' in url:
                stem = url.rsplit('/',1)[-1].removesuffix('.png')
                item[key] = url.rsplit('/',1)[0] + '/' + ''.join(w.title() for w in stem.split('-')) + '.png'
        if item['imageUrl'] and not validate_url(item['imageUrl']): raise ValueError('Imagem inválida')
    presentation_path = ROOT / 'source/ImagePresentation.json'
    if presentation_path.is_file():
        presentation = json.loads(presentation_path.read_text(encoding='utf-8'))
        for item in result:
            visual = presentation['items'][item['tag']]
            item['imageUrl'] = 'https://raw.githubusercontent.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/main/code/public/' + visual['image']
            item['imageNotes'] += (' ' if item['imageNotes'] else '') + visual['note']
            if visual['lowNativeResolution']:
                item['imageNotes'] += ' Fonte com poucos pixels nativos; ampliação não recupera inscrições ou detalhes.'
    return {'schemaVersion': 3, 'status': 'validated', 'source': 'XLSX autorizado — Árvore Uncut Gem V1, única fonte operacional V1',
            'sourceUrl': 'https://docs.google.com/spreadsheets/d/158OGccBdF5Hf6qdWIH2-Tmt_-gU8sO8pz3CvyTpycXU/edit?gid=2026110901#gid=2026110901',
            'sourceFile': SOURCE.name, 'sourceSheet': tree_name, 'snapshotAt': '2026-11-09',
            'snapshotDateNote': 'Data de recebimento do arquivo; horário de sincronização online não verificado.',
            'sourceSha256': hashlib.sha256(path.read_bytes()).hexdigest(), 'evidenceSha256': {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(evidence_root.glob('*.json'))}, 'items': result,
            'consolidation': {'filledFields': [], 'differences': [], 'policy': 'Árvore canônica como única fonte; nenhum preenchimento automático proveniente dos 33 registros históricos.'}}

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    output = json.dumps(consolidate(), ensure_ascii=False, indent=2) + '\n'
    if args.check:
        if OUTPUT.read_text(encoding='utf-8') != output: raise SystemExit('Catálogo diverge do XLSX: reconsolide antes de publicar')
    else: OUTPUT.write_text(output, encoding='utf-8')
    print('Catálogo verificado: 10 subsistemas + 69 componentes; zero dependências operacionais do legado')
