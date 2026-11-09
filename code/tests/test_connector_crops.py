"""Check exact approved crop assets and their reproducible provenance."""
from pathlib import Path
import hashlib
import json
import struct
import subprocess
import unittest
ROOT=Path(__file__).resolve().parents[2]
class ConnectorCropTests(unittest.TestCase):
    def test_six_crops_have_source_coordinates_and_matching_hashes(self):
        plan=json.loads((ROOT/'code/source/evidence/LayerBComponentImagePlan.json').read_text())
        items={i['tag']:i for i in plan['components']}
        for tag in ['UG-V1-0013','UG-V1-0014','UG-V1-0016','UG-V1-0017','UG-V1-B044','UG-V1-B045']:
            item=items[tag]
            path=ROOT/'code/public/assets/official/v1/components'/item['filename']
            raw=path.read_bytes()
            self.assertEqual(hashlib.sha256(raw).hexdigest(),item['approved_asset_sha256'])
            x,y,right,bottom=item['region']['px_original']
            self.assertEqual(struct.unpack('>II',raw[16:24]),(right-x,bottom-y))
            self.assertLess((right-x)*(bottom-y),3022*1952/4)
            self.assertIn('não mostra',item['notes'])
            source=ROOT/('code/public/assets/official/v1/components/sources/DiamondGeezerBackV1.png' if tag=='UG-V1-0017' else 'code/public/assets/official/v1/subsystems/sources/DiamondGeezerFrontV1.png')
            self.assertEqual(hashlib.sha256(source.read_bytes()).hexdigest(),item['approved_source_sha256'])
