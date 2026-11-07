#!/usr/bin/env python3
"""Copia o template estrutural LCR para um diretório local, sem integrações externas.

Não faz deploy, não cria repositórios remotos e não sobrescreve arquivos existentes.
Para URLs GitHub, o Planner precisa usar uma ferramenta autorizada de escrita GitHub.
"""
from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

SOURCE_ROOT = Path(__file__).resolve().parents[2]
ROOT_FILES = ("AGENTS.md", "README.md", ".gitignore")
STRUCTURAL_PREFIXES = (
    ".github/workflows/",
    ".agents/skills/",
    "code/scripts/",
    "code/tests/",
    "code/public/",
    "code/src/",
    "documentation/",
)
EXCLUDED_PREFIXES = (
    "documentation/assets/",  # imagem de apresentação não pertence ao template de apps
    "documentation/reports/",  # logs de um projeto não devem migrar para outro
)
EXCLUDED_SUFFIXES = (".png", ".jpg", ".jpeg", ".pdf", ".zip", ".gif", ".webp")

def template_files(root: Path):
    for f in root.rglob("*"):
        if not f.is_file():
            continue
        relative = f.relative_to(root).as_posix()
        if relative in ROOT_FILES or relative.startswith(STRUCTURAL_PREFIXES):
            if relative.startswith(EXCLUDED_PREFIXES) or f.suffix.lower() in EXCLUDED_SUFFIXES:
                continue
            if relative.startswith("documentation/decision-archive/") and relative != "documentation/decision-archive/README.md":
                continue
            if "/__pycache__/" in relative or relative.endswith(".pyc"):
                continue
            yield f, relative

def bootstrap(root: Path, target: Path) -> tuple[int, int]:
    if root.resolve() == target.resolve():
        raise ValueError("destino não pode ser a própria origem")
    copied = skipped = 0
    target.mkdir(parents=True, exist_ok=True)
    for src, relative in template_files(root):
        dest = target / relative
        dest.parent.mkdir(parents=True, exist_ok=True)
        if dest.exists():
            skipped += 1
            continue
        if relative == "README.md":
            title = target.name.replace("-", " ").replace("_", " ")
            dest.write_text(f"# {title}\n\nProjeto iniciado com o LCR Workflow.\n"
                            "Consulte [LCR_START](documentation/LCR_START.md) e "
                            "[LCR_WORKFLOW](documentation/LCR_WORKFLOW.md).\n",
                            encoding="utf-8")
        else:
            shutil.copy2(src, dest)
        copied += 1
    return copied, skipped

def verify(root: Path) -> list[str]:
    needed = [
        ".gitignore", "AGENTS.md",
        ".agents/skills/lcr-prompt-generator/SKILL.md",
        ".agents/skills/lcr-prompt-generator/templates/DevelopmentPrompt.md",
        ".agents/skills/lcr-prompt-generator/templates/HotfixPrompt.md",
        "documentation/prompt-templates/README.md",
        "documentation/CHATGPT_PROJECT_INSTRUCTIONS.md",
        "documentation/LCR_START.md", "documentation/LCR_WORKFLOW.md",
        "documentation/LCR_GUARDRAILS.md", "documentation/LCR_NAMING_CONVENTIONS.md",
        "documentation/BASIC_COMMANDS.md", "documentation/BASIC_SKILLS.md",
        "documentation/decision-archive/README.md",
        "documentation/agents-archive/README.md",
        "code/public/robots.txt", "code/public/sitemap.xml",
        "code/scripts/lcr_naming.py",
        ".github/workflows/LCR_NAMING.yml",
    ]
    return [item for item in needed if not (root / item).exists()]

def main() -> int:
    p = argparse.ArgumentParser(description="LCR_START: somente estrutura local")
    mode = p.add_mutually_exclusive_group(required=True)
    mode.add_argument("--target", help="diretório para criar o template (sem sobrescrever)")
    mode.add_argument("--verify", action="store_true", help="validar o template atual")
    args = p.parse_args()
    if args.verify:
        missing = verify(SOURCE_ROOT)
        for item in missing:
            print("FALTANDO:", item)
        print("LCR_START:", "estrutura validada" if not missing else "estrutura incompleta")
        return 1 if missing else 0
    target = Path(args.target).resolve()
    try:
        created, skipped = bootstrap(SOURCE_ROOT, target)
    except (ValueError, OSError) as exc:
        print("LCR_START ERRO:", exc, file=sys.stderr)
        return 1
    print(f"LCR_START: {created} arquivos criados, {skipped} preservados em {target}")
    # Checagem estrutural imediata; não demanda banco de dados nem APIs externas.
    from lcr_naming import scan
    files = [p.relative_to(target).as_posix() for p in target.rglob("*")
             if p.is_file() and ".git" not in p.relative_to(target).parts
             and "__pycache__" not in p.relative_to(target).parts]
    result = scan(files)
    print(f"LCR_NAMING: {result['checked']} arquivos avaliados; "
          f"{len(result['violations'])} violação(ões).")
    for item in result["violations"]:
        print(f" - {item['path']}: {'; '.join(item['problems'])}")
    return 0 if result["ok"] else 1

if __name__ == "__main__":
    raise SystemExit(main())
