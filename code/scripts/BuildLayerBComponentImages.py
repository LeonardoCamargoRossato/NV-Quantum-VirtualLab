#!/usr/bin/env python3
"""Produce auditable Uncut Gem V1 Camada B crops from real, canonical project images.

The plan was obtained from the exact Google Sheet; the script never modifies Camada A.
No generative synthesis, no reconstructed pins/PCB components, no false hotspots.
"""
from __future__ import annotations
import argparse
import hashlib
import io
import json
import os
from pathlib import Path
import shutil
import sys
import urllib.request
import zipfile
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

CODE = Path(__file__).resolve().parents[1]
PLAN = CODE / 'public/data/LayerBComponentImagePlan.json'
OUT = CODE / 'public/assets/official/v1/components'
CHECKPOINT = CODE.parent / 'documentation/agents-archive/planner/artifacts/component-image-checkpoint.json'
GITHUB = 'https://github.com/QuantumVillage/UncutGem'
SOURCES = {
    'front': CODE / 'public/assets/official/DeviceV1.png',
    'backphoto': CODE / 'public/assets/official/v1/subsystems/sources/DeviceBackV1.jpeg',
    'pcbfront': CODE / 'public/assets/official/v1/subsystems/sources/DiamondGeezerFrontV1.png',
    'pcbback': OUT / 'sources/DiamondGeezerBackV1.png',
    'layer1': CODE / 'public/assets/official/Layer1.png',
    'layer2': CODE / 'public/assets/official/Layer2.png',
    'layer3': CODE / 'public/assets/official/Layer3.png',
}
EXTERNAL_URLS = {
    'pcbback': 'https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/hardware/PCB/images/DiamondGeezer-2.png',
}
CREDIT = 'Quantum Village/UncutGem — AGPL-3.0'


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def get_source(name, allow_remote=True):
    path = SOURCES[name]
    if not path.is_file():
        if name not in EXTERNAL_URLS or not allow_remote:
            raise FileNotFoundError(f'Fonte ausente: {path}; não usar imagem substituta.')
        req = urllib.request.Request(EXTERNAL_URLS[name], headers={'User-Agent':'NVQuantumVirtualLab/1.0 educational reference'})
        with urllib.request.urlopen(req, timeout=40) as resp:
            data = resp.read()
        if len(data) < 4000:
            raise ValueError(f'Arquivo oficial inesperadamente pequeno: {name}')
        with Image.open(io.BytesIO(data)) as img:
            img.verify()
        path.parent.mkdir(parents=True,exist_ok=True)
        path.write_bytes(data)
    return path


def crop(image, region):
    # rectangle references the preserved official front photo at 1453×1080, or % for other originals
    if region is None or region=='all':
        return image.copy(), [0,0,image.width,image.height]
    if isinstance(region,dict) and 'px_1453x1080' in region:
        if image.size != (1453,1080):
            raise RuntimeError(f'Fonte frontal mudou de dimensões: {image.size}')
        box=region['px_1453x1080']
    elif isinstance(region,dict) and 'percent' in region:
        x,y,w,h=region['percent']
        box=[round(image.width*x/100),round(image.height*y/100),round(image.width*(x+w)/100),round(image.height*(y+h)/100)]
    else:
        raise ValueError('Plano exige coordenadas auditáveis')
    box=[int(t) for t in box]
    if len(box)!=4 or not (0<=box[0]<box[2]<=image.width and 0<=box[1]<box[3]<=image.height):
        raise ValueError(f'Caixa de recorte inválida {box} para {image.size}')
    return image.crop(box), box


def enhance(image):
    image=ImageOps.exif_transpose(image).convert('RGB')
    image=ImageEnhance.Contrast(image).enhance(1.035)
    # For tiny true photographic crops, only interpolate; no new electronic details are created.
    if max(image.size)<850:
        target=(image.width*2,image.height*2)
    else:
        target=image.size
    if max(target)>1500:
        k=1500/max(target)
        target=(max(1,round(target[0]*k)),max(1,round(target[1]*k)))
    if target!=image.size:
        image=image.resize(target,Image.Resampling.LANCZOS)
    image=image.filter(ImageFilter.UnsharpMask(radius=1.0,percent=50,threshold=4))
    return image


def build(plan, dest, checkpoint_path, preview_only=False):
    entries=plan['components']
    if len(entries)!=69 or len({e['tag'] for e in entries})!=69:
        raise ValueError('O plano deve conter exatamente 69 tags únicas de componentes')
    if any(e['category']!='componente' for e in entries):
        raise ValueError('Camada A presente no plano: operação abortada')
    # Keep every source immutable and record its hash before processing.
    use_sources=sorted({e['source_id'] for e in entries if e['status']=='CHECK'})
    src_paths={}
    for name in use_sources:
        if preview_only and name!='front':continue
        src_paths[name]=get_source(name,allow_remote=not preview_only)
    before={k:sha256(p) for k,p in src_paths.items()}
    if not preview_only and before.get('front')!='d29720f611b3ae76caed31a220f715148a0e9a4fb485152fcbfbeeb2bb396516':
        raise RuntimeError('Imagem oficial frontal diverge do hash registrado no lote V1 original')
    decoded={}
    for k,p in src_paths.items():
        with Image.open(p) as im:decoded[k]=ImageOps.exif_transpose(im).convert('RGB')
    dest.mkdir(parents=True,exist_ok=True)
    manifest={'schema_version':1,'project':'NV Quantum Virtual Lab / Uncut Gem V1 Layer B',
              'license':CREDIT,'source_hashes':before,
              'method':'Pillow: original official source, crop box, contrast 1.035, LANCZOS for small crops, conservative unsharp; no generative AI.',
              'accuracy':'A denotes visible physical context, B denotes official reference/context (not proven isolated component), C denotes internal host imagery, D is explicitly unverified.',
              'items':[]}
    checkpoint={'schema_version':1,'source_sheet_id':'158OGccBdF5Hf6qdWIH2-Tmt_-gU8sO8pz3CvyTpycXU',
                'source_sheet_gid':2026110901,'source_rows':'12–80 inclusive, category componente only',
                'untouched_layer_a':'rows 2–11, category subsistema',
                'producer':'code/scripts/BuildLayerBComponentImages.py','stage':'images-generated; spreadsheet synchronization performed separately',
                'items':[]}
    for entry in entries:
        row={'tag':entry['tag'],'row':entry['row'],'name':entry['name'],'parent':entry['parent'],
             'classification':entry['class'],'status':entry['status'],'notes':entry['notes']}
        if entry['status']=='CHECK':
            if entry['source_id'] not in decoded:
                if preview_only:continue
                raise FileNotFoundError('No exact source for '+entry['tag'])
            source=decoded[entry['source_id']]
            part,box=crop(source,entry['region'])
            enhanced=enhance(part)
            file=entry['filename']
            file_path=dest/file
            enhanced.save(file_path,format='PNG',optimize=True)
            with Image.open(file_path) as verify: verify.verify()
            row.update({'image':file,'source_id':entry['source_id'],'source_box_px':box,
                        'image_type':entry['image_type'], 'source_hash':before[entry['source_id']],
                        'width':enhanced.width,'height':enhanced.height,'bytes':file_path.stat().st_size})
            print(f"CHECK {entry['tag']} {file} ({enhanced.width}x{enhanced.height}) class {entry['class']}")
        else:
            row.update({'image':None,'preserved_existing_url':entry['existing_image_url'],
                        'image_type':entry['existing_image_type']})
            print(f"REVISÃO {entry['tag']}: não atribuir recorte sem evidência")
        manifest['items'].append(row)
        checkpoint['items'].append(row)
    if preview_only:
        return manifest,checkpoint
    for k,p in src_paths.items():
        if sha256(p)!=before[k]:raise RuntimeError(f'Origem modificada durante o lote {k}')
    if len(manifest['items'])!=69:raise RuntimeError('Processamento incompleto')
    manifest_path=dest/'LayerBImageManifest.json'
    manifest_path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    checkpoint_path.parent.mkdir(parents=True,exist_ok=True)
    checkpoint_path.write_text(json.dumps(checkpoint,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    (dest/'README.md').write_text(
        '# Uncut Gem V1 — imagens da Camada B\n\n'
        'Derivadas de fotos/referências OFICIAIS do projeto Quantum Village (AGPL-3.0). '
        'A fotografia original e os diagramas originais são mantidos. '
        'A = recorte físico; B = contexto/render/diagrama oficial, não identificação individual garantida; '
        'C = hospedeiro de função interna, SEM hotspot próprio; D = revisão sem recorte inventado. '
        'A interpolação não restitui inscrições/componentes invisíveis. '
        'O manifesto discrimina as fontes, caixas de recorte, hashes e ressalvas por TAG.\n',encoding='utf-8')
    bundle=dest/'UgV1LayerBComponents.zip'
    with zipfile.ZipFile(bundle,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
        for p in sorted(dest.glob('UgV1*.png'))+[manifest_path,dest/'README.md',checkpoint_path]:
            z.write(p,arcname=p.name)
    counts={status:sum(e['status']==status for e in checkpoint['items']) for status in ('CHECK','REVISÃO','ERRO')}
    print('CHECKPOINT '+json.dumps(counts,ensure_ascii=False)+' ZIP bytes='+str(bundle.stat().st_size))
    return manifest,checkpoint

if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--preview-front',help='Only preview components from the front photo without publishing or requiring the real photo SHA')
    args=parser.parse_args()
    plan=json.loads(PLAN.read_text(encoding='utf-8'))
    if args.preview_front:
        SOURCES['front']=Path(args.preview_front)
    build(plan, OUT if not args.preview_front else Path('/tmp/uncutgem-layer-b-preview'),CHECKPOINT,preview_only=bool(args.preview_front))
