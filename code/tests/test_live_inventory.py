import json
import re
import unittest
from pathlib import Path

SNAPSHOT = Path(__file__).resolve().parents[1] / "source/InventoryV1.json"

class LiveInventoryTest(unittest.TestCase):
    def test_real_v1_snapshot_integrity(self):
        data = json.loads(SNAPSHOT.read_text(encoding="utf-8"))
        self.assertEqual(data["status"], "validated")
        self.assertEqual(len(data["items"]), 79)
        self.assertEqual(data["schemaVersion"], 3)
        self.assertNotIn("legacyItems", data)
        self.assertNotIn("legacyOnlyTags", data)
        self.assertRegex(data["sourceSha256"], r"^[0-9a-f]{64}$")
        self.assertRegex(data["snapshotAt"], r"^\d{4}-\d{2}-\d{2}$")
        self.assertIn("XLSX", data["source"])
        for item in data["items"]:
            self.assertTrue(item["name"])
            self.assertTrue(item["subsystem"])
            for key in ("imageUrl", "datasheet"):
                self.assertTrue(not item[key] or item[key].startswith("https://"))
            self.assertEqual(set(item.keys()), {
                "tag", "name", "pcb", "subsystem", "quantity", "model", "function",
                "location", "price", "imageType", "imageUrl", "source", "datasheet", "notes",
                "category", "layer", "parent", "parentTag", "legacyTag", "face", "imageFormula", "imageStatus", "imageClass", "imageNotes", "imageSource"
            })
    def test_hierarchy_and_canonical_pcb_views(self):
        data = json.loads(SNAPSHOT.read_text(encoding="utf-8"))
        parents = {i["tag"] for i in data["items"] if i["layer"] == "A"}
        children = [i for i in data["items"] if i["layer"] == "B"]
        self.assertEqual(len(parents), 10)
        self.assertEqual(len(children), 69)
        self.assertTrue(all(i["parentTag"] in parents for i in children))
        tags = {item["tag"] for item in data["items"]}
        self.assertIn("UG-V1-B041", tags)
        self.assertIn("UG-V1-B042", tags)
        self.assertEqual(data["consolidation"]["filledFields"], [])

    def test_optical_safety_mapping(self):
        data = json.loads(SNAPSHOT.read_text(encoding="utf-8"))
        by_id = {item["tag"]: item for item in data["items"]}
        self.assertIn("BPW34", by_id["UG-V1-0028"]["name"])
        self.assertIn("PHOTODIODE1", by_id["UG-V1-0016"]["pcb"])
        self.assertIn("BPW34", by_id["UG-V1-B028"]["name"])

if __name__ == "__main__":
    unittest.main()
