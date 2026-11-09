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
        digest = hashlib.sha256(SOURCE.read_bytes()).hexdigest()
        source_readme = (SOURCE.parent / "README.md").read_text(encoding="utf-8")
        self.assertIn(digest, source_readme)
        self.assertEqual(digest, consolidate()["sourceSha256"])
        sheets = read_sheets(SOURCE)
        self.assertEqual(len(sheets), 4)
        self.assertNotIn("Uncut Gem V1", [name for name, _ in sheets])
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
        self.assertEqual(fills, [])
        self.assertEqual(data['consolidation']['differences'], [])
        self.assertNotIn('legacyItems', data)
        self.assertNotIn('legacyOnlyTags', data)

    def test_rebuild_without_legacy_tab_and_canonical_board_faces(self):
        data = consolidate()
        self.assertEqual(len(data['items']), 79)
        rows = {i['tag']: i for i in data['items']}
        self.assertEqual(rows['UG-V1-B041']['name'], 'Face frontal da PCB')
        self.assertEqual(rows['UG-V1-B042']['name'], 'Face traseira da PCB')
        self.assertEqual(rows['UG-V1-B041']['face'], 'Frente')
        self.assertEqual(rows['UG-V1-B042']['face'], 'Verso')
        from migrate_inventory_workbook import EXPECTED
        for tag, url in EXPECTED.items():
            self.assertEqual(rows[tag]['datasheet'], url)

