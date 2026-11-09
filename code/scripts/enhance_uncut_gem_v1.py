#!/usr/bin/env python3
"""Conservative, deterministic crops from the official Uncut Gem V1 photograph.

No generative AI, content-aware filling, relabeling, or structural edits.
Run from anywhere: python code/scripts/enhance_uncut_gem_v1.py
The original image is NEVER modified.
"""
from __future__ import annotations

import hashlib
import io
import json
import math
import zipfile
from dataclasses import asdict, dataclass
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'public/assets/official/DeviceV1.png'
DEST = ROOT / 'public/assets/official/v1/enhanced'
SCALE = 2

@dataclass(frozen=True)
class Crop:
    filename: str
    title: str
    x: float
    y: float
    w: float
    h: float
    status: str = 'known'

# Percentages are tied to the unchanged official source photograph, NOT CSS pixels.
# The last four rectangles are exploratory descriptive regions, not component IDs.
CROPS = [
    Crop('ug-v1-overview-enhanced.png', 'Montagem V1 integral', 0, 0, 100, 100),
    Crop('ug-v1-pcb-enhanced.png', 'PCB V1', 2, 5, 69, 86),
    Crop('ug-v1-esp32-enhanced.png', 'ESP32', 8, 61, 38, 30),
    Crop('ug-v1-rf-amp-enhanced.png', 'Amplificador RF', 41, 43, 32, 25),
    Crop('ug-v1-laser-enhanced.png', 'Laser verde', 10, 17, 23, 18),
    Crop('ug-v1-prism-enhanced.png', 'Conjunto optico NV', 42, 11, 18, 24),
    Crop('ug-v1-oled-enhanced.png', 'OLED / display', 44, 64, 27, 32),
    Crop('ug-v1-rf-cable-enhanced.png', 'Cabo/conector proximo ao amplificador RF', 68, 38, 31, 36, 'descriptive'),
    Crop('ug-v1-between-rf-and-esp32-enhanced.png', 'Regiao entre amplificador RF e ESP32', 30, 49, 28, 24, 'descriptive'),
    Crop('ug-v1-above-esp32-enhanced.png', 'Regiao acima do ESP32', 12, 37, 36, 27, 'descriptive'),
    Crop('ug-v1-laser-driver-enhanced.png', 'Regiao da placa/driver do laser', 8, 31, 33, 29, 'descriptive'),
]


def original_box(c: Crop, width: int, height: int) -> tuple[int,int,int,int]:
    box = (math.floor(width*c.x/100), math.floor(height*c.y/100),
           math.ceil(width*(c.x+c.w)/100), math.ceil(height*(c.y+c.h)/100))
    if not (0 <= box[0] < box[2] <= width and 0 <= box[1] < box[3] <= height):
        raise ValueError(f'Invalid crop box for {c.filename}: {box}')
    return box


def enhance(image: Image.Image) -> Image.Image:
    """Small tonal/acutance gains, interpolation only; no hallucinated detail."""
    if image.mode != 'RGB':
        image = image.convert('RGB')
    enlarged = image.resize((image.width*SCALE, image.height*SCALE), Image.Resampling.LANCZOS)
    contrasted = ImageEnhance.Contrast(enlarged).enhance(1.055)
    return contrasted.filter(ImageFilter.UnsharpMask(radius=1.1, percent=74, threshold=3))


def create() -> dict:
    if not SOURCE.is_file():
        raise FileNotFoundError(f'Original official image not found: {SOURCE}')
    source_bytes = SOURCE.read_bytes()
    source_sha = hashlib.sha256(source_bytes).hexdigest()
    src = Image.open(io.BytesIO(source_bytes)).convert('RGB')
    if src.width < 650 or src.height < 450:
        raise ValueError(f'Unexpectedly small input: {src.size}')
    DEST.mkdir(parents=True, exist_ok=True)
    manifest = {
        'source': 'code/public/assets/official/DeviceV1.png',
        'upstream': 'https://github.com/QuantumVillage/UncutGem/blob/main/BuildGuide/images/device-v1.png',
        'license': 'AGPL-3.0 / Quantum Village; preserve upstream attribution',
        'source_sha256': source_sha,
        'source_size': list(src.size),
        'scale': SCALE,
        'method': 'Pillow LANCZOS 2x, contrast 1.055, UnsharpMask radius 1.1 percent 74 threshold 3; no generative AI',
        'warning': 'The interpolation cannot recover text or technical details missing from the source.',
        'crops': [],
    }
    for item in CROPS:
        box = original_box(item, src.width, src.height)
        cropped = src.crop(box)
        output = enhance(cropped)
        target = DEST / item.filename
        output.save(target, format='PNG', optimize=True)
        with Image.open(target) as check:
            check.verify()
        with Image.open(target) as check:
            if check.size != (cropped.width*SCALE,cropped.height*SCALE):
                raise RuntimeError(f'Size mismatch: {target.name}')
        manifest['crops'].append({**asdict(item), 'source_box_px': list(box),
                                  'output_size_px': list(output.size),
                                  'bytes': target.stat().st_size})
        print(f'CHECK {item.filename}: {tuple(output.size)}, {target.stat().st_size} bytes')
    (DEST/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    (DEST/'README.md').write_text(
        '# Recortes conservadores Uncut Gem V1\n\n'
        'Fonte: fotografia oficial `../../DeviceV1.png` (Quantum Village, AGPL-3.0). '
        'Este lote foi gerado por Pillow, sem IA generativa; as posições e detalhes físicos '
        'foram preservados. A melhoria interpolada **não recupera inscrições invisíveis**. '
        'Os quatro recortes adicionais têm títulos descritivos e exigem inspeção humana '
        'antes de identificar componentes específicos. Veja `manifest.json`.\n',encoding='utf-8')
    zip_path = DEST/'ug-v1-recortes-aprimorados.zip'
    with zipfile.ZipFile(zip_path,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=7) as archive:
        for f in sorted(DEST.glob('*.png')) + [DEST/'manifest.json',DEST/'README.md']:
            info = zipfile.ZipInfo(f.name,date_time=(2024,1,1,0,0,0))
            info.compress_type=zipfile.ZIP_DEFLATED
            archive.writestr(info,f.read_bytes())
    if hashlib.sha256(SOURCE.read_bytes()).hexdigest()!=source_sha:
        raise RuntimeError('Original source modified unexpectedly')
    print(f'CHECK ZIP {zip_path.name}: {zip_path.stat().st_size} bytes')
    return manifest


if __name__ == '__main__':
    print(f'SOURCE {SOURCE}')
    create()
