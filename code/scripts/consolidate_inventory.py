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
    legacy_rows = next(rows for name, rows in sheets if name == 'Uncut Gem V1')
    tree_name, tree_rows = next((name, rows) for name, rows in sheets if name.startswith('Árvore Uncut Gem V1'))
    legacy = [{key: row.get(label, '') for label, key in COLUMNS.items()} for row in legacy_rows if row.get('Tag única')]
    by_tag = {item['tag']: item for item in legacy}
    if len(legacy) != 33 or len(by_tag) != 33: raise ValueError('Inventário legado deve preservar 33 tags únicas')
    result, differences, fills = [], [], []
    for row in tree_rows:
        if not row.get('Tag única'): continue
        mapping = {**COLUMNS, **EXTRA}
        mapping.pop('Componente')
        mapping['Componente / Subsistema'] = 'name'
        item = {key: row.get(label, '') for label, key in mapping.items()}
        item['imageFormula'] = row.get('Imagem', '')
        old = by_tag.get(item['legacyTag'] or item['tag'])
        if old:
            for key, value in old.items():
                if key == 'tag': continue
                if value and not item[key]:
                    item[key] = value
                    fills.append({'tag': item['tag'], 'field': key, 'from': old['tag']})
                elif value and item[key] != value:
                    differences.append({'tag': item['tag'], 'field': key, 'canonical': item[key], 'legacy': value, 'legacyTag': old['tag']})
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
    linked = {i['legacyTag'] or i['tag'] for i in result}
    return {'schemaVersion': 2, 'status': 'validated', 'source': 'XLSX autorizado — Uncut Gem V1, árvore canônica e legado preservado',
            'sourceUrl': 'https://docs.google.com/spreadsheets/d/158OGccBdF5Hf6qdWIH2-Tmt_-gU8sO8pz3CvyTpycXU/edit?gid=2026110901#gid=2026110901',
            'sourceFile': SOURCE.name, 'sourceSheet': tree_name, 'snapshotAt': '2026-11-09',
            'snapshotDateNote': 'Data de recebimento do arquivo; horário de sincronização online não verificado.',
            'sourceSha256': hashlib.sha256(path.read_bytes()).hexdigest(), 'items': result, 'legacyItems': legacy,
            'legacyOnlyTags': [i['tag'] for i in legacy if i['tag'] not in linked],
            'consolidation': {'filledFields': fills, 'differences': differences, 'policy': 'Árvore prevalece; preencher lacunas com legado vinculado; preservar valores divergentes neste relatório.'}}

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    output = json.dumps(consolidate(), ensure_ascii=False, indent=2) + '\n'
    if args.check:
        if OUTPUT.read_text(encoding='utf-8') != output: raise SystemExit('Catálogo diverge do XLSX: reconsolide antes de publicar')
    else: OUTPUT.write_text(output, encoding='utf-8')
    print('Catálogo verificado: 10 subsistemas + 69 componentes; 33 registros legados preservados')
