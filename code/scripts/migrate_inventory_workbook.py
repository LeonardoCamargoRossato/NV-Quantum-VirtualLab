#!/usr/bin/env python3
"""One-time, reversible XLSX V1 migration; preserve every non-target XML payload.

Run on a development branch, never from the public web app. Does not access Google
Sheets. It removes only the legacy worksheet and copies the 15 already verified
Datasheet values from the frozen, historical InventoryV1.json.
"""
from __future__ import annotations

import argparse
import hashlib
from pathlib import Path
import posixpath
import re
import tempfile
import xml.etree.ElementTree as ET
import zipfile

ROOT = Path(__file__).resolve().parents[1]
BOOK = ROOT / "source/UncutGemInventoryV1V2.xlsx"
README = ROOT / "source/README.md"
MAIN = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
REL_ID = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
REL = "http://schemas.openxmlformats.org/package/2006/relationships"
CT = "http://schemas.openxmlformats.org/package/2006/content-types"
VT = "http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"
NS = {"s": MAIN, "r": REL}
LEGACY_NAME = "Uncut Gem V1"
TREE_PREFIX = "Árvore Uncut Gem V1"
EXPECTED_FOUR = ["Uncut Gem V2", "Galeria de imagens", "Leia-me"]

URL_FIRMWARE = "https://github.com/QuantumVillage/UncutGem/blob/main/firmware/src/uncut-gem.ino"
URL_ADF4351 = "https://www.analog.com/en/products/adf4351.html"
URL_BPW34 = "https://www.vishay.com/docs/81521/bpw34.pdf"
EXPECTED = {
    **{f"UG-V1-{n}": URL_FIRMWARE for n in
       ("B001", "B008", "B009", "B010", "B011", "B012", "B013", "B014",
        "B038", "B039", "B040")},
    **{f"UG-V1-{n}": URL_ADF4351 for n in ("B018", "B019", "B020")},
    "UG-V1-B028": URL_BPW34,
}
LEGACY_REFS = (re.compile(r"'Uncut Gem V1'\s*!", re.I),
               re.compile(r"(?<![\w])Uncut Gem V1\s*!", re.I))


def xml(data):
    return ET.fromstring(data)


def as_bytes(root):
    return ET.tostring(root, encoding="utf-8", xml_declaration=True)


def get_parts(files):
    workbook = xml(files["xl/workbook.xml"])
    relations = xml(files["xl/_rels/workbook.xml.rels"])
    ids = {el.get("Id"): el for el in relations}
    tabs = {}
    for el in workbook.findall(f"{{{MAIN}}}sheets/{{{MAIN}}}sheet"):
        relation = ids[el.get(f"{{{REL_ID}}}id")]
        target = relation.get("Target")
        filename = target.lstrip("/") if target.startswith("/") else posixpath.normpath(posixpath.join("xl", target))
        tabs[el.get("name")] = (el, relation, filename)
    return workbook, relations, tabs


def shared_strings(files):
    if "xl/sharedStrings.xml" not in files:
        return []
    return ["".join(n.itertext()) for n in xml(files["xl/sharedStrings.xml"]).findall(f"{{{MAIN}}}si")]


def cell_text(cell, strings):
    if cell is None:
        return ""
    if cell.get("t") == "inlineStr":
        node = cell.find(f"{{{MAIN}}}is")
        return "".join(node.itertext()) if node is not None else ""
    value = cell.find(f"{{{MAIN}}}v")
    if value is None:
        return ""
    if cell.get("t") == "s":
        return strings[int(value.text)]
    return value.text or ""


def inspect_canonical(files, tabs):
    names = list(tabs)
    canonical = [x for x in names if x.startswith(TREE_PREFIX)]
    if len(canonical) != 1:
        raise ValueError("A aba da Árvore não foi identificada unicamente")
    name = canonical[0]
    root = xml(files[tabs[name][2]])
    strings = shared_strings(files)
    rows = root.findall(f"{{{MAIN}}}sheetData/{{{MAIN}}}row")
    if not rows:
        raise ValueError("Cabeçalho da árvore ausente")
    headers = {re.match(r"[A-Z]+", c.get("r"))[0]:cell_text(c, strings)
               for c in rows[0].findall(f"{{{MAIN}}}c")}
    if headers.get("A") != "Tag única" or headers.get("P") != "Datasheet":
        raise ValueError("Campos A/P da árvore mudaram")
    candidates = {}
    for row in rows[1:]:
        cells = {re.match(r"[A-Z]+", c.get("r"))[0]:c
                 for c in row.findall(f"{{{MAIN}}}c")}
        tag = cell_text(cells.get("A"), strings)
        if tag:
            if tag in candidates:
                raise ValueError(f"Tag duplicada: {tag}")
            candidates[tag] = (row, cells, cell_text(cells.get("P"), strings))
    if len(candidates) != 79 or sum(t.startswith("UG-V1-S") for t in candidates) != 10:
        raise ValueError("Árvore exige 79 tags, incluindo 10 subsistemas")
    if set(EXPECTED) - set(candidates):
        raise ValueError("Faltam tags de datasheet esperadas na árvore")
    for tag, url in EXPECTED.items():
        current = candidates[tag][2]
        if current and current != url:
            raise ValueError(f"Conflito em {tag}: valor já preenchido e divergente")
    return name, root, candidates


def assert_no_references(files, removed):
    for name, data in files.items():
        if name == removed or not name.endswith((".xml", ".rels")):
            continue
        if name in ("xl/workbook.xml", "xl/_rels/workbook.xml.rels",
                    "docProps/app.xml", "[Content_Types].xml"):
            continue
        text = data.decode("utf-8", errors="replace")
        if any(pattern.search(text) for pattern in LEGACY_REFS):
            raise ValueError(f"Referência à aba antiga encontrada em: {name}")


def apply(book=BOOK):
    with zipfile.ZipFile(book) as source:
        info = source.infolist()
        files = {entry.filename: source.read(entry.filename) for entry in info}
    workbook, relations, tabs = get_parts(files)
    tree_name, sheet_xml, candidates = inspect_canonical(files, tabs)
    if LEGACY_NAME not in tabs:
        if len(tabs) != 4 or any(name not in tabs for name in EXPECTED_FOUR):
            raise ValueError("Workbook sem aba legada mas com estrutura inesperada")
        return hashlib.sha256(book.read_bytes()).hexdigest(), False
    if len(tabs) != 5 or any(name not in tabs for name in EXPECTED_FOUR):
        raise ValueError("Migração abortada: abas inesperadas, nenhuma exclusão feita")
    legacy_sheet, legacy_rel, legacy_path = tabs[LEGACY_NAME]
    assert_no_references(files, legacy_path)

    for tag, url in EXPECTED.items():
        row, cells, value = candidates[tag]
        if value == url:
            continue
        target = cells.get("P")
        if target is None:
            target = ET.Element(f"{{{MAIN}}}c", {"r": f"P{row.get('r')}"})
            cols = row.findall(f"{{{MAIN}}}c")
            index = next((i for i,c in enumerate(cols)
                          if re.match(r"[A-Z]+",c.get("r"))[0] > "P"),len(cols))
            row.insert(index, target)
        if target.find(f"{{{MAIN}}}f") is not None:
            raise ValueError("A célula de datasheet contém fórmula, não sobrescrever")
        for child in list(target):
            target.remove(child)
        target.set("t", "inlineStr")
        inline = ET.SubElement(target, f"{{{MAIN}}}is")
        ET.SubElement(inline, f"{{{MAIN}}}t").text = url

    workbook.find(f"{{{MAIN}}}sheets").remove(legacy_sheet)
    relations.remove(legacy_rel)
    files["xl/workbook.xml"] = as_bytes(workbook)
    files["xl/_rels/workbook.xml.rels"] = as_bytes(relations)
    files[tabs[tree_name][2]] = as_bytes(sheet_xml)

    content_types = xml(files["[Content_Types].xml"])
    for item in list(content_types):
        if item.tag == f"{{{CT}}}Override" and item.get("PartName", "").lstrip("/") == legacy_path:
            content_types.remove(item)
    files["[Content_Types].xml"] = as_bytes(content_types)

    if "docProps/app.xml" in files:
        app = xml(files["docProps/app.xml"])
        for vector in app.iter(f"{{{VT}}}vector"):
            children = list(vector)
            if any(x.text == LEGACY_NAME for x in children):
                for x in children:
                    if x.text == LEGACY_NAME:
                        vector.remove(x)
                vector.set("size", str(len(list(vector))))
        files["docProps/app.xml"] = as_bytes(app)

    # Keep all other ZIP member payloads, drawings, styles, media and formulas.
    omit = {legacy_path}
    old_sheet_rels = posixpath.join(posixpath.dirname(legacy_path), "_rels",
                                   posixpath.basename(legacy_path) + ".rels")
    if old_sheet_rels in files:
        # Never delete relationship packages whose targets may still be shared.
        omit.add(old_sheet_rels)
    with tempfile.NamedTemporaryFile(dir=book.parent, suffix=".xlsx", delete=False) as temp:
        temp_path = Path(temp.name)
    try:
        with zipfile.ZipFile(temp_path, "w") as dest:
            for entry in info:
                if entry.filename not in omit:
                    dest.writestr(entry, files[entry.filename])
        with zipfile.ZipFile(temp_path) as dest:
            migrated = {entry.filename:dest.read(entry.filename) for entry in dest.infolist()}
        _, _, after_tabs = get_parts(migrated)
        if len(after_tabs) != 4 or LEGACY_NAME in after_tabs or set(after_tabs) != set(tabs)-{LEGACY_NAME}:
            raise ValueError("Arquivo temporário não contém exatamente as quatro abas")
        _, _, migrated_rows = inspect_canonical(migrated, after_tabs)
        if any(migrated_rows[tag][2] != url for tag,url in EXPECTED.items()):
            raise ValueError("Falha na verificação dos 15 datasheets")
        changed={"xl/workbook.xml","xl/_rels/workbook.xml.rels",tabs[tree_name][2],
                 "[Content_Types].xml","docProps/app.xml"}
        for name, data in files.items():
            if name not in changed|omit and migrated[name]!=data:
                raise ValueError(f"Entrada não autorizada mudou: {name}")
        new_sha = hashlib.sha256(temp_path.read_bytes()).hexdigest()
        # Replace in place after all validations. The prior version is in Git history.
        temp_path.replace(book)
    finally:
        temp_path.unlink(missing_ok=True)
    readme = README.read_text(encoding="utf-8")
    old_sha = re.search(r"SHA-256 .([a-f0-9]{64}).", readme)
    if old_sha:
        readme = readme.replace(old_sha.group(1), new_sha)
        README.write_text(readme, encoding="utf-8")
    return new_sha, True


if __name__ == "__main__":
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("--verify-only", action="store_true")
    args = cli.parse_args()
    if args.verify_only:
        with zipfile.ZipFile(BOOK) as z:
            files = {n: z.read(n) for n in z.namelist()}
        _, _, tabs = get_parts(files)
        _, _, rows = inspect_canonical(files, tabs)
        assert len(tabs) == 4 and LEGACY_NAME not in tabs
        assert all(rows[tag][2] == url for tag,url in EXPECTED.items())
        print("CHECK: quatro abas, 79 tags e 15 datasheets válidos")
    else:
        digest, changed = apply()
        print(f"CHECK: migration={'applied' if changed else 'already migrated'} SHA256={digest}")
