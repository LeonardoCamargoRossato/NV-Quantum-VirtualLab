import sys
import unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/"scripts"))
from lcr_central_backup import eligible

class BackupTests(unittest.TestCase):
    def test_public(self):
        repo={"name":"App","visibility":"public","owner":{"login":"LeonardoCamargoRossato"}}
        self.assertTrue(eligible(repo,"LeonardoCamargoRossato"))
        self.assertFalse(eligible({**repo,"visibility":"private"},"LeonardoCamargoRossato"))
        self.assertFalse(eligible({**repo,"archived":True},"LeonardoCamargoRossato"))
        self.assertFalse(eligible({**repo,"fork":True},"LeonardoCamargoRossato"))
