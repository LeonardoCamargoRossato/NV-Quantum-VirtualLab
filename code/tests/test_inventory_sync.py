import csv
import io
import sys
import unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from sync_uncut_gem_inventory import COLUMNS, parse_csv

class InventorySyncTests(unittest.TestCase):
    def export(self, change=None):
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=list(reversed(COLUMNS)))
        writer.writeheader()
        for n in range(1, 34):
            row = {key: '' for key in COLUMNS}
            row.update({'Tag única': f'UG-V1-{n:04d}', 'Componente': 'Peça de teste', 'Subsistema': 'Teste'})
            if change:
                change(row, n)
            writer.writerow(row)
        return output.getvalue()

    def test_headers_mapped_by_name(self):
        items = parse_csv(self.export())
        self.assertEqual(len(items), 33)
        self.assertEqual(items[0]['tag'], 'UG-V1-0001')
        self.assertEqual(items[0]['name'], 'Peça de teste')

    def test_duplicates_and_v2_rejected(self):
        for tag in ('UG-V1-0001', 'UG-V2-0033'):
            with self.assertRaises(ValueError):
                parse_csv(self.export(lambda row, n: row.update({'Tag única': tag}) if n == 33 else None))

    def test_formula_html_and_unsafe_url_rejected(self):
        for key, value in [('Componente', '=IMPORTXML("url")'), ('Componente', '<script>'), ('URL da imagem', 'javascript:alert(1)')]:
            with self.assertRaises(ValueError):
                parse_csv(self.export(lambda row, n: row.update({key: value}) if n == 1 else None))

    def test_missing_header_rejected(self):
        with self.assertRaises(ValueError):
            parse_csv('Tag única,Componente\nUG-V1-0001,Teste\n')
