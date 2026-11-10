"""Audit original-source integrity, framing, and rectified photo geometry."""
from pathlib import Path
import hashlib
import json
import struct
import unittest
ROOT=Path(__file__).resolve().parents[1]
class ImagePresentationTests(unittest.TestCase):
    def setUp(self):
        self.data=json.loads((ROOT/'source/ImagePresentation.json').read_text())

    def test_all_79_items_have_valid_outputs_and_unchanged_sources(self):
        catalog=json.loads((ROOT/'source/InventoryV1.json').read_text())
        self.assertEqual(set(self.data['items']),{i['tag'] for i in catalog['items']})
        for original in self.data['originals'].values():
            self.assertEqual(hashlib.sha256((ROOT/original['path']).read_bytes()).hexdigest(),original['sha256'])
        for image in self.data['items'].values():
            raw=(ROOT/'public'/image['image']).read_bytes()
            self.assertEqual(hashlib.sha256(raw).hexdigest(),image['sha256'])
            self.assertEqual(list(struct.unpack('>II',raw[16:24])),image['outputSize'])
            self.assertLessEqual(abs(image['deskewDegrees']),15)
            self.assertLessEqual(image['scale'],2)
            subject=image['subjectBounds'];crop=image['cropBounds']
            self.assertAlmostEqual((subject[0]+subject[2])/2,(crop[0]+crop[2])/2,delta=1)
            self.assertAlmostEqual((subject[1]+subject[3])/2,(crop[1]+crop[3])/2,delta=1)
            self.assertLess(crop[0],subject[0]);self.assertLess(crop[1],subject[1])
            self.assertGreater(crop[2],subject[2]);self.assertGreater(crop[3],subject[3])

    def test_main_board_axes_are_orthogonal_and_original_not_overwritten(self):
        top_left,top_right,bottom_right,bottom_left=self.data['main']['referenceCorners']
        self.assertAlmostEqual(top_left[1],top_right[1],places=6)
        self.assertAlmostEqual(bottom_left[1],bottom_right[1],places=6)
        self.assertAlmostEqual(top_left[0],bottom_left[0],places=6)
        self.assertAlmostEqual(top_right[0],bottom_right[0],places=6)
        self.assertEqual(self.data['originals']['front']['sha256'],'d29720f611b3ae76caed31a220f715148a0e9a4fb485152fcbfbeeb2bb396516')

    def test_module_mounting_references_form_rectangles(self):
        config=json.loads((ROOT/'source/evidence/ImageFraming.json').read_text())
        for item in self.data['items'].values():
            if not item.get('plane'): continue
            h=item['sourceToOutput']
            points=[]
            for x,y in config['planes'][item['plane']]['sourceCorners']:
                d=h[2][0]*x+h[2][1]*y+h[2][2]
                points.append(((h[0][0]*x+h[0][1]*y+h[0][2])/d,(h[1][0]*x+h[1][1]*y+h[1][2])/d))
            self.assertAlmostEqual(points[0][1],points[1][1],places=6)
            self.assertAlmostEqual(points[0][0],points[3][0],places=6)
            self.assertAlmostEqual(points[2][1],points[3][1],places=6)
            self.assertAlmostEqual(points[1][0],points[2][0],places=6)

    def test_native_resolution_limits_and_internal_context_are_disclosed(self):
        for tag in ['UG-V1-B014','UG-V1-B019','UG-V1-B039']:
            self.assertIn('interna',self.data['items'][tag]['note'])
        data=json.loads((ROOT/'source/InventoryV1.json').read_text())
        for item in data['items']:
            if self.data['items'][item['tag']]['lowNativeResolution']:
                self.assertIn('poucos pixels nativos',item['imageNotes'])

    def test_analog_crop_plan_matches_corrected_presentation(self):
        plan = json.loads((ROOT/'source/evidence/LayerBComponentImagePlan.json').read_text())
        entries = {entry['tag']: entry for entry in plan['components']}
        for index in range(29, 38):
            tag = f'UG-V1-B{index:03d}'
            self.assertEqual(
                entries[tag]['region']['px_1453x1080'],
                self.data['items'][tag]['sourceBox'],
                f'{tag}: Layer B crop must match aligned presentation'
            )

    def test_regenerated_analog_layer_b_manifest(self):
        manifest = json.loads((ROOT/'public/assets/official/v1/components/LayerBImageManifest.json').read_text())
        entries = {entry['tag']: entry for entry in manifest['items']}
        for index in range(29, 38):
            tag = f'UG-V1-B{index:03d}'
            published = entries[tag]
            self.assertEqual(
                published['source_box_px'],
                self.data['items'][tag]['sourceBox'],
                f'{tag}: regenerated Layer B image must use corrected crop'
            )
            self.assertEqual(published['source_id'], 'front')
            self.assertEqual(published['status'], 'CHECK')
            self.assertTrue((ROOT/'public/assets/official/v1/components'/published['image']).is_file())
