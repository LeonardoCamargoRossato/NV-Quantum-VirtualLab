"""Garante que LCR_START distribua skills e normas sem copiar ADRs históricos."""

import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from lcr_start import SOURCE_ROOT, bootstrap, template_files  # noqa: E402


class LcrStartTests(unittest.TestCase):
    def test_template_includes_adr_rules_but_not_old_decisions(self):
        paths = {relative for _src, relative in template_files(SOURCE_ROOT)}
        self.assertIn("documentation/decision-archive/LCR_ADR_GUARDRAILS.md", paths)
        self.assertIn(".agents/skills/lcr-adr-generator/SKILL.md", paths)
        self.assertIn(".agents/skills/lcr-adr-generator/templates/AdrTemplate.md", paths)
        self.assertIn(".agents/skills/lcr-prompt-generator/SKILL.md", paths)
        self.assertFalse(any(path.startswith("documentation/decision-archive/ADR-")
                             for path in paths))

    def test_bootstrap_copies_adr_policy(self):
        with tempfile.TemporaryDirectory() as tmp:
            destination = Path(tmp) / "TesteProjeto"
            created, skipped = bootstrap(SOURCE_ROOT, destination)
            self.assertGreater(created, 0)
            self.assertEqual(skipped, 0)
            self.assertTrue((destination /
                             "documentation/decision-archive/LCR_ADR_GUARDRAILS.md").is_file())
            self.assertTrue((destination /
                             ".agents/skills/lcr-adr-generator/SKILL.md").is_file())


if __name__ == "__main__":
    unittest.main()
