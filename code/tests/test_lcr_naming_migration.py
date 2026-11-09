"""Verificações da migração LCR_NAMING dos recortes e inventário."""
import json
import unittest
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ENHANCED = ROOT / "code/public/assets/official/v1/enhanced"
ILLUSTRATIVE = ROOT / "assets/components/illustrative"


class LcrNamingMigrationTests(unittest.TestCase):
    def test_manifest_and_eleven_pngs(self):
        manifest = json.loads((ENHANCED / "EnhancedCropsManifest.json").read_text(encoding="utf-8"))
        files = [item["filename"] for item in manifest["crops"]]
        self.assertEqual(len(files), 11)
        self.assertEqual(len(set(files)), 11)
        for name in files:
            self.assertRegex(name, r"^UgV1[A-Za-z0-9]+Enhanced\.png$")
            path = ENHANCED / name
            self.assertTrue(path.is_file(), name)
            with path.open("rb") as stream:
                self.assertEqual(stream.read(8), bytes([137, 80, 78, 71, 13, 10, 26, 10]))

    def test_zip_archive_contains_renamed_files(self):
        manifest = json.loads((ENHANCED / "EnhancedCropsManifest.json").read_text(encoding="utf-8"))
        archive_path = ENHANCED / "UgV1RecortesAprimorados.zip"
        self.assertTrue(archive_path.is_file())
        with zipfile.ZipFile(archive_path) as archive:
            members = set(archive.namelist())
            self.assertTrue(archive.testzip() is None)
        expected = {item["filename"] for item in manifest["crops"]}
        expected.update({"EnhancedCropsManifest.json", "README.md"})
        self.assertEqual(members, expected)

    def test_inventory_images_reference_existing_files(self):
        data = json.loads((ROOT / "code/source/InventoryV1.json").read_text(encoding="utf-8"))
        found = 0
        for item in data["items"]:
            url = item.get("imageUrl", "")
            marker = "/assets/components/illustrative/"
            if marker not in url:
                continue
            found += 1
            name = url.rsplit("/", 1)[-1]
            self.assertTrue((ILLUSTRATIVE / name).is_file(), name)
            self.assertRegex(name, r"^UgV1[A-Za-z0-9]+\.png$")
        self.assertGreater(found, 0)

    def test_generators_use_new_paths(self):
        source = (ROOT / "code/scripts/enhance_uncut_gem_v1.py").read_text(encoding="utf-8")
        self.assertIn("EnhancedCropsManifest.json", source)
        self.assertIn("UgV1RecortesAprimorados.zip", source)
        self.assertTrue((ENHANCED / "UgV1RecortesAprimorados.zip").is_file())
        self.assertTrue((ROOT / "code/scripts/build_layer_b_component_images.py").is_file())
        self.assertTrue((ROOT / "code/scripts/build_uncut_gem_v1_subsystems.py").is_file())
        self.assertFalse((ROOT / "code/scripts/BuildLayerBComponentImages.py").exists())
        self.assertFalse((ROOT / "code/scripts/BuildUncutGemV1Subsystems.py").exists())


if __name__ == "__main__":
    unittest.main()
