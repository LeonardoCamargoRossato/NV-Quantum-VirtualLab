#!/usr/bin/env python3
"""Inspeção leve de arquivos SEO; não substitui Search Console."""
from pathlib import Path
import sys, xml.etree.ElementTree as ET
p=Path('code/public');err=[];warnings=[]
if not p.exists():
 print('AVISO: site público não configurado; verificações SEO adiadas.');sys.exit(0)
robots=p/'robots.txt'; sitemap=p/'sitemap.xml'
if not robots.exists(): err.append('robots.txt ausente')
else:
 data=robots.read_text(encoding='utf-8')
 if 'User-agent:' not in data: err.append('robots.txt sem User-agent')
 if 'Sitemap:' not in '\n'.join(x for x in data.splitlines() if not x.lstrip().startswith('#')): warnings.append('URL de sitemap ainda não anunciada (definir após deploy)')
if not sitemap.exists():err.append('sitemap.xml ausente')
else:
 try:
  root=ET.parse(sitemap).getroot()
  if not root.tag.endswith('urlset'):err.append('sitemap.xml não é urlset')
  ns={'sm':'http://www.sitemaps.org/schemas/sitemap/0.9'}
  urls=root.findall('.//sm:loc',ns)
  if not urls:warnings.append('sitemap.xml ainda não lista URLs; preencher após configurar domínio/base path')
  if any(x.text and ('SEU-DOMINIO' in x.text or 'example.com' in x.text) for x in urls):err.append('sitemap possui URL de exemplo')
 except ET.ParseError:err.append('sitemap.xml inválido')
print('LCR SEO:')
for v in warnings:print('AVISO:',v)
for v in err:print('ERRO:',v)
if err:sys.exit(1)