"""Exercise workbook ingestion and evidence-backed image preservation."""
import hashlib
import json
from pathlib import Path
import sys
import unittest
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from consolidate_inventory import consolidate, SOURCE, OUTPUT, read_sheets

class ConsolidationTests(unittest.TestCase):
    def test_rebuild_matches_committed_catalog_and_original_hash(self):
        self.assertEqual(consolidate(), json.loads(OUTPUT.read_text(encoding='utf-8')))
        self.assertEqual(hashlib.sha256(SOURCE.read_bytes()).hexdigest(), '3fa0d1c8fe767964b278d91756fdf4679aca897cc3ffb827d24ac65614c463c4')
        sheets = read_sheets(SOURCE)
        self.assertEqual(len(sheets), 5)
        self.assertIn('Uncut Gem V2', [name for name, _ in sheets])

    def test_approved_footprints_are_not_replaced_by_old_illustrations(self):
        items = {i['tag']: i for i in consolidate()['items']}
        for number in range(2, 8):
            item = items[f'UG-V1-B{number:03d}']
            self.assertEqual(item['imageStatus'], 'CHECK')
            self.assertIn(f'UgV1B{number:03d}.png', item['imageUrl'])
            self.assertEqual(item['face'], 'Frente')
            self.assertIn('não fotografia', item['imageNotes'].lower())
            self.assertTrue(item['legacyTag'])

    def test_group_quantities_are_not_assigned_to_individual_children(self):
        data = consolidate()
        fills = data['consolidation']['filledFields']
        self.assertTrue(all(row['field'] in ('source', 'datasheet') for row in fills if row['tag'] != row['from']))
