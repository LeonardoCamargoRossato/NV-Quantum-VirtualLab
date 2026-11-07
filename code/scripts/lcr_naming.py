#!/usr/bin/env python3
"""Verifica nomes de caminhos versionados segundo LCR_NAMING_CONVENTIONS.md.

Não renomeia arquivos. O resultado é reproduzível, com falha em caso de violações.
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

KEBAB = re.compile(r"^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$")
PASCAL = re.compile(r"^[A-Z][A-Za-z0-9]*$")
SNAKE = re.compile(r"^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$")
INSTITUTIONAL = re.compile(r"^(?:LCR|BASIC)_[A-Z0-9_]+\.(?:md|ya?ml)$")
ADR = re.compile(r"^ADR-[0-9]{4}-[a-z0-9]+(?:-[a-z0-9]+)*\.md$")
SPECIAL = {
    ".gitignore", ".gitkeep", ".gitattributes", ".editorconfig",
    ".env.example", ".npmrc", ".prettierrc", ".prettierignore",
    "README.md", "AGENTS.md", "LICENSE", "LICENSE.md", "CONTRIBUTING.md",
    "CHANGELOG.md", "CITATION.cff", "Dockerfile", "Makefile",
    "index.html", "robots.txt", "sitemap.xml", "favicon.ico",
    "package.json", "package-lock.json", "pnpm-lock.yaml", "yarn.lock",
    "tsconfig.json", "tsconfig.app.json", "tsconfig.node.json",
    "vite.config.ts", "vite.config.js", "vitest.config.ts",
    "eslint.config.js", "eslint.config.mjs", "postcss.config.js",
    "tailwind.config.js", "requirements.txt", "pyproject.toml",
    "pytest.ini", "setup.cfg", "Pipfile", "Pipfile.lock",
    "daily_summary.md", "raw_data.jsonl", "data.json",
    "summary.md", "github_activity.jsonl", "metadata.json",
}
SPECIAL_DIRECTORIES = {".github", ".vscode", ".idea", "__pycache__", ".pytest_cache"}
SUFFIXES = (".test", ".spec", ".stories", ".module")

def check_path(raw: str) -> list[str]:
    """Retorna violações para um arquivo relativo ao repositório."""
    path = Path(raw)
    issues: list[str] = []
    for part in path.parts[:-1]:
        if part not in SPECIAL_DIRECTORIES and not KEBAB.fullmatch(part):
            issues.append(f"pasta '{part}' não segue kebab-case")
    name = path.name
    if name in SPECIAL or INSTITUTIONAL.fullmatch(name) or ADR.fullmatch(name):
        return issues
    # Nomes técnicos fixos podem ser adicionados explicitamente ao catálogo.
    if name.startswith("."):
        issues.append(f"arquivo oculto '{name}' não está na lista de exceções")
        return issues
    if "." not in name:
        if not PASCAL.fullmatch(name):
            issues.append(f"arquivo '{name}' deve seguir PascalCase")
        return issues
    base, ext = name.rsplit(".", 1)
    if ext in ("py", "pyi"):
        if base not in {"__init__", "__main__"} and not SNAKE.fullmatch(base):
            issues.append(f"módulo Python '{name}' deve seguir snake_case (PEP 8)")
        return issues
    for suffix in SUFFIXES:
        if base.endswith(suffix):
            base = base[:-len(suffix)]
            break
    if not PASCAL.fullmatch(base):
        issues.append(f"arquivo personalizado '{name}' deve seguir PascalCase")
    return issues

def tracked_files(root: Path) -> list[str]:
    try:
        data = subprocess.check_output(["git", "ls-files", "-z"], cwd=root)
    except (OSError, subprocess.CalledProcessError) as exc:
        raise RuntimeError("execute no diretório raiz de um repositório Git") from exc
    return sorted(s.decode("utf-8") for s in data.split(b"\0") if s)

def scan(paths: list[str]) -> dict:
    violations = [{"path": p, "problems": check_path(p)} for p in paths]
    violations = [x for x in violations if x["problems"]]
    return {"checked": len(paths), "violations": violations, "ok": not violations}

def main() -> int:
    parser = argparse.ArgumentParser(description="Auditoria LCR de nomenclatura")
    parser.add_argument("--root", default=".", help="raiz do repositório Git")
    parser.add_argument("--check", action="store_true", help="falhar se houver nomes inválidos")
    parser.add_argument("--json", action="store_true", help="imprimir resultado JSON")
    args = parser.parse_args()
    try:
        result = scan(tracked_files(Path(args.root).resolve()))
    except RuntimeError as exc:
        print(f"ERRO: {exc}", file=sys.stderr)
        return 2
    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(f"LCR Naming: {result['checked']} arquivos verificados; "
              f"{len(result['violations'])} com nome(s) fora do padrão.")
        for item in result["violations"]:
            print(f" - {item['path']}: {'; '.join(item['problems'])}")
    return 1 if args.check and not result["ok"] else 0

if __name__ == "__main__":
    raise SystemExit(main())
