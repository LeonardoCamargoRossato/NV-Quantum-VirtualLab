"""Testes sem dependências externas para o auditor de nomenclatura LCR."""
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from lcr_naming import check_path, scan  # noqa: E402


class NamingConventionTests(unittest.TestCase):
    def test_pascal_case_assets_and_components(self):
        self.assertEqual(check_path("code/src/components/SimulationPanel.tsx"), [])
        self.assertEqual(check_path("code/public/assets/images/NvCenterDiagram.png"), [])
        self.assertEqual(check_path("code/public/assets/audio/NotificationSuccess.mp3"), [])

    def test_python_pep8(self):
        self.assertEqual(check_path("code/scripts/lcr_naming.py"), [])
        self.assertEqual(check_path("code/tests/test_lcr_naming.py"), [])
        self.assertEqual(check_path("code/src/__init__.py"), [])
        self.assertTrue(check_path("code/src/SimulationEngine.py"))

    def test_folders_and_institutional_names(self):
        self.assertEqual(check_path("documentation/agents-archive/builder/builder-aux/.gitkeep"), [])
        self.assertEqual(check_path("documentation/LCR_GUARDRAILS.md"), [])
        self.assertEqual(check_path("documentation/decision-archive/ADR-0002-nomenclatura.md"), [])
        self.assertTrue(check_path("code/public/My Images/GoodImage.png"))
        self.assertEqual(check_path(".agents/skills/lcr-prompt-generator/SKILL.md"), [])
        self.assertEqual(check_path(".agents/skills/lcr-prompt-generator/templates/DevelopmentPrompt.md"), [])
        self.assertEqual(check_path(".agents/skills/lcr-prompt-generator/templates/HotfixPrompt.md"), [])

    def test_fixed_names_and_generated_records(self):
        for name in ("README.md", "AGENTS.md", "code/public/robots.txt",
                     "code/public/sitemap.xml",
                     "documentation/agents-archive/planner/daily_summary.md",
                     "documentation/agents-archive/planner/raw_data.jsonl",
                     "documentation/agents-archive/planner/data.json",
                     ".github/workflows/LCR_NAMING.yml"):
            self.assertEqual(check_path(name), [], name)

    def test_invalid_names_reported(self):
        result = scan(["code/src/components/SimulationPanel.tsx",
                       "code/src/components/simulationPanel.tsx"])
        self.assertEqual(result["checked"], 2)
        self.assertFalse(result["ok"])
        self.assertEqual(len(result["violations"]), 1)


if __name__ == "__main__":
    unittest.main()
