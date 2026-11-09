#!/usr/bin/env python3
"""Import an authorized V1 CSV export; never fetch private Sheets or store credentials."""
from __future__ import annotations
import argparse
import csv
import hashlib
import io
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

COLUMNS = {
    'Tag única': 'tag', 'Componente': 'name', 'Ref. PCB': 'pcb',
    'Subsistema': 'subsystem', 'Qtde': 'quantity', 'Modelo / valor': 'model',
    'Função / descrição': 'function', 'Localização / montagem': 'location',
    'Preço BR (referência histórica)': 'price', 'Tipo de imagem': 'imageType',
    'URL da imagem': 'imageUrl', 'Fonte técnica': 'source', 'Datasheet': 'datasheet',
    'Pendências / compatibilidade': 'notes',
}
SOURCE = 'https://docs.google.com/spreadsheets/d/158OGccBdF5Hf6qdWIH2-Tmt_-gU8sO8pz3CvyTpycXU/edit?gid=1346018179#gid=1346018179'

def validate_url(value: str) -> bool:
    if not value:
        return True
    parsed = urlparse(value)
    return (parsed.scheme == 'https' and bool(parsed.hostname)
            and not parsed.username and not parsed.password)

def parse_csv(text: str) -> list[dict[str, str]]:
    if not text.strip():
        raise ValueError('CSV vazio')
    delimiter = ';' if text.splitlines()[0].count(';') > text.splitlines()[0].count(',') else ','
    reader = csv.DictReader(io.StringIO(text.lstrip('\ufeff')), delimiter=delimiter)
    headers = reader.fieldnames or []
    if len(headers) != len(set(headers)):
        raise ValueError('Cabeçalhos duplicados')
    missing = set(COLUMNS) - set(headers)
    if missing:
        raise ValueError('Cabeçalhos ausentes: ' + ', '.join(sorted(missing)))
    items = []
    for row in reader:
        if not any(value for value in row.values()):
            continue
        item = {key: (row.get(label) or '').strip() for label, key in COLUMNS.items()}
        if not re.fullmatch(r'UG-V1-\d{4}', item['tag']) or not item['name'] or not item['subsystem']:
            raise ValueError('Tag V1, componente e subsistema são obrigatórios')
        if any('<' in value or '>' in value or re.match(r'^\s*[=+@]', value) for value in item.values()):
            raise ValueError('Conteúdo HTML ou fórmula não permitido no snapshot')
        for key in ('imageUrl', 'source', 'datasheet'):
            if not validate_url(item[key]):
                raise ValueError(f'URL HTTPS inválida: {item["tag"]} / {key}')
        items.append(item)
    expected = {f'UG-V1-{n:04d}' for n in range(1, 34)}
    if len(items) != 33 or {item['tag'] for item in items} != expected:
        raise ValueError('Exigidos exatamente 33 registros únicos: UG-V1-0001 a UG-V1-0033')
    return sorted(items, key=lambda item: item['tag'])

def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('csv', type=Path)
    parser.add_argument('--output', type=Path, default=Path(__file__).resolve().parents[1] / 'public/data/InventoryV1.json')
    parser.add_argument('--allow-public-snapshot', action='store_true', help='Confirmar autorização para publicar os campos aprovados desta exportação')
    args = parser.parse_args()
    if not args.allow_public_snapshot:
        parser.error('Confirme a autorização de publicação com --allow-public-snapshot')
    raw = args.csv.read_bytes()
    items = parse_csv(raw.decode('utf-8-sig'))
    snapshot = {'schemaVersion': 1, 'status': 'validated', 'source': 'Google Sheets — Uncut Gem V1 (exportação CSV autorizada)', 'sourceUrl': SOURCE,
                'snapshotAt': datetime.now(timezone.utc).isoformat(), 'sourceSha256': hashlib.sha256(raw).hexdigest(), 'items': items}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    temporary = args.output.with_suffix('.tmp')
    temporary.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    temporary.replace(args.output)
    print(f'Snapshot validado: {len(items)} itens → {args.output}')

if __name__ == '__main__':
    main()
