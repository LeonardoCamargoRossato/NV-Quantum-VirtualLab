#!/usr/bin/env python3
"""Build ten Uncut Gem V1 subsystem crops from verified Quantum Village originals.

Real source images only. No AI image generation, object removal, interpolation-based restoration
or source pixel edits beyond conservative local contrast/noise and scaling.
Originals are never overwritten. Requires Pillow.
"""
from __future__ import annotations
import argparse, hashlib, io, json, math, os, pathlib, urllib.request, zipfile
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

ROOT = pathlib.Path(__file__).resolve().parents[1]
FRONT = ROOT / 'public/assets/official/DeviceV1.png'
OUT = ROOT / 'public/assets/official/v1/subsystems'
SOURCES = OUT / 'sources'
UPSTREAM = 'https://github.com/QuantumVillage/UncutGem'
EXTERNAL = {
    'back': 'https://quantumvillage.org/images/device-back.jpeg',
    'pcb': 'https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/hardware/PCB/images/DiamondGeezer-1.png',
}
# Coordinates in percent of each unaltered source image; x,y,width,height.
# A region, not a new component photograph; the public README documents identification limits.
SPECS = [
    ('S01', 'UgV1SubsystemPowerUsb.png', 'Conector USB no ESP32 e circuito adjacente', 'front', (0, 65, 25, 26), 'recorte real', 'O conector USB é visível, porém não demonstra o circuito do borne 5V_SUPP1.'),
    ('S02', 'UgV1SubsystemEsp32.png', 'ESP32 completo', 'front', (7, 61, 40, 31), 'recorte real', 'Módulo controlador na face frontal.'),
    ('S03', 'UgV1SubsystemLaser.png', 'Laser verde e seu suporte', 'front', (9, 15, 26, 23), 'recorte real', 'Laser e placa de acionamento junto ao suporte.'),
    ('S04', 'UgV1SubsystemAdf4351.png', 'Região traseira do módulo ADF4351', 'back', (7, 40, 51, 46), 'fotografia oficial do verso', 'Região do módulo traseiro, associada ao ADF4351 pelo guia oficial. Marcação do CI não é legível.'),
    ('S05', 'UgV1SubsystemRfAmplifier.png', 'Amplificador de micro-ondas', 'front', (40, 42, 34, 28), 'recorte real', 'Placa de amplificação RF e terminais SMA.'),
    ('S06', 'UgV1SubsystemRfConnections.png', 'Conectores SMA e cabo RF', 'front', (64, 39, 36, 45), 'recorte real', 'Região da ligação coaxial do amplificador; percurso completo não visível em um único recorte.'),
    ('S07', 'UgV1SubsystemPrismDetection.png', 'Prisma real e óptica encapsulada', 'front', (41, 10, 21, 26), 'recorte real', 'Prisma real. Filtro vermelho e BPW34 internos não podem ser vistos individualmente nesta foto.'),
    ('S08', 'UgV1SubsystemSignalConditioning.png', 'TL082 e componentes passivos', 'front', (10, 43, 30, 23), 'recorte real', 'Região analógica com TL082 e resistores/capacitores, conforme montagem V1.'),
    ('S09', 'UgV1SubsystemOled.png', 'Display OLED completo', 'front', (44, 62, 29, 36), 'recorte real', 'Módulo e tela OLED frontal.'),
    ('S10', 'UgV1SubsystemPcbStructure.png', 'PCB DiamondGeezer', 'pcb', (0, 0, 100, 100), 'render oficial PCB', 'Render oficial frontal da PCB, não fotografia de montagem.'),
]

def fetch(name: str, dest: pathlib.Path) -> bytes:
    if not dest.exists():
        req = urllib.request.Request(EXTERNAL[name], headers={'User-Agent':'NV-Quantum-VirtualLab/1.0 (+public educational asset indexing)'})
        with urllib.request.urlopen(req, timeout=35) as response:
            data=response.read()
        if len(data)<3000:
            raise ValueError(f'Arquivo muito pequeno: {name} {len(data)} B')
        with Image.open(io.BytesIO(data)) as im:
            im.verify()
        dest.parent.mkdir(parents=True,exist_ok=True)
        dest.write_bytes(data)
    return dest.read_bytes()

def bbox(size, percentages):
    w,h=size; x,y,a,b=percentages
    box=(math.floor(w*x/100),math.floor(h*y/100),math.ceil(w*(x+a)/100),math.ceil(h*(y+b)/100))
    if not (0<=box[0]<box[2]<=w and 0<=box[1]<box[3]<=h):
        raise ValueError(f'Invalid bounding box {box} for {size}')
    return box

def clean(crop: Image.Image):
    rgb = ImageOps.exif_transpose(crop).convert('RGB')
    # Light contrast-only change; preserve identifiable component geometry.
    adjusted = ImageEnhance.Contrast(rgb).enhance(1.035)
    if max(adjusted.size)<1500:
        adjusted=adjusted.resize((adjusted.width*2,adjusted.height*2),Image.Resampling.LANCZOS)
    return adjusted.filter(ImageFilter.UnsharpMask(radius=1.05,percent=58,threshold=3))

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--front-preview',help='Use an external provided image for local preview only (NEVER for publishing); skips remote sources')
    args=parser.parse_args()
    if not FRONT.is_file() and not args.front_preview:
        raise FileNotFoundError(FRONT)
    OUT.mkdir(parents=True, exist_ok=True); SOURCES.mkdir(parents=True, exist_ok=True)
    source_bytes = {}
    if args.front_preview:
        source_bytes['front']=pathlib.Path(args.front_preview).read_bytes()
    else:
        source_bytes['front']=FRONT.read_bytes()
        source_bytes['back']=fetch('back',SOURCES/'DeviceBackV1.jpeg')
        source_bytes['pcb']=fetch('pcb',SOURCES/'DiamondGeezerFrontV1.png')
    manifest={'project':'NV Quantum Virtual Lab / Uncut Gem V1', 'method':'Pillow crop, contrast 1.035, moderate UnsharpMask. Optional Lanczos 2x for small crops. No generative AI.',
              'attribution':'Quantum Village / Uncut Gem; official project AGPL-3.0. Retain upstream source and project license.',
              'originals':{},'subsystems':[]}
    images={}
    for name,data in source_bytes.items():
        with Image.open(io.BytesIO(data)) as im:images[name]=ImageOps.exif_transpose(im).convert('RGB')
        manifest['originals'][name]={'sha256':hashlib.sha256(data).hexdigest(),'dimensions':list(images[name].size),'url':EXTERNAL.get(name,'https://github.com/QuantumVillage/UncutGem/blob/main/BuildGuide/images/device-v1.png')}
    for id,filename,title,src,coords,image_kind,note in SPECS:
        if src not in images:
            print(f'SKIP {id}: external source unavailable in preview');continue
        b=bbox(images[src].size,coords)
        result=clean(images[src].crop(b))
        target=OUT/filename
        result.save(target,'PNG',optimize=True)
        with Image.open(target) as verify:verify.verify()
        manifest['subsystems'].append({'id':id,'file':filename,'title':title,'source':src,'source_crop_box_px':b,'kind':image_kind,'notes':note,'size':list(result.size),'bytes':target.stat().st_size})
        print(f'CHECK {id} {title}: {filename} {result.size} {target.stat().st_size} B')
    (OUT/'SubsystemsManifest.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    (OUT/'README.md').write_text('''# Uncut Gem V1 — 10 subsistemas fotográficos

Todos os PNGs são recortes ou renderizações da fonte oficial Quantum Village, licença AGPL-3.0, sem IA generativa. Preservados os arquivos-fonte; veja `SubsystemsManifest.json` para associação, caixa de recorte, metadados e ressalvas. Imagens não provam ligações elétricas, valores de componentes ou marcação de CI que não esteja legível. A documentação do Build Guide fundamenta ADF4351 no verso e TL082 na região analógica. Não confundir o conector USB do ESP32 com o conector da fonte 5V_SUPP1.

Fonte: https://github.com/QuantumVillage/UncutGem
''',encoding='utf-8')
    zip_path=OUT/'UgV1SubsystemsBundle.zip'
    with zipfile.ZipFile(zip_path,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
        for p in sorted(OUT.glob('*.png'))+[OUT/'SubsystemsManifest.json',OUT/'README.md']:
            z.write(p,p.name)
    print('CHECK ZIP '+str(zip_path)+' '+str(zip_path.stat().st_size))

if __name__=='__main__':main()
