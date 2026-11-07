#!/usr/bin/env python3
"""Varredura preliminar de arquivos versionados. Não é auditoria exaustiva."""
import subprocess,re,sys
patterns=[('private_key',re.compile(rb'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----')),('aws_access_key',re.compile(rb'AKIA[0-9A-Z]{16}')),('github_token',re.compile(rb'gh[pousr]_[A-Za-z0-9_]{25,}')),('openai_key',re.compile(rb'sk-[A-Za-z0-9_-]{20,}'))]
paths=subprocess.check_output(['git','ls-files','-z']).split(b'\0')
issues=[]
for pb in paths:
 if not pb: continue
 fn=pb.decode(errors='replace')
 if fn.endswith(('.png','.jpg','.jpeg','.pdf','.zip','.woff','.mp3','.svg','.ico','.bundle')):continue
 try:
  with open(fn,'rb') as f: data=f.read(2_000_000)
 except (FileNotFoundError,OSError):continue
 for name,pattern in patterns:
  if pattern.search(data):issues.append((fn,name))
# Não imprimir valores de segredos; apenas tipo e arquivo.
for fn,name in issues:print(f'ALERTA: possível {name} em {fn}')
print(f'Arquivos inspecionados: {len(paths)}; alertas: {len(issues)}. Varredura não exaustiva.')
sys.exit(1 if issues else 0)