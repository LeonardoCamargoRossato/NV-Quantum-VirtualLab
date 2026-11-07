#!/usr/bin/env python3
"""Gera relatório factual de commits do GitHub; não lê históricos do ChatGPT."""
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo
from pathlib import Path
import subprocess, json, os

TZ=ZoneInfo('America/Sao_Paulo')
today=datetime.now(TZ).date()
start=datetime.combine(today,datetime.min.time(),tzinfo=TZ)
end=start+timedelta(days=1)
raw=subprocess.check_output([
 'git','log',f'--since={start.isoformat()}',f'--until={end.isoformat()}',
 '--format=%H%x09%aI%x09%an%x09%s','--no-merges'
],text=True)
commits=[]
for line in raw.splitlines():
 parts=line.split('\t',3)
 if len(parts)==4:
  sha,date,author,subject=parts
  # Exclui commits gerados pelo próprio job para evitar ruído recursivo.
  if subject.startswith('docs(lcr): atualizar relatório daily'): continue
  commits.append({'sha':sha,'datetime':date,'author':author,'subject':subject,'source':'github_commit'})
base=Path('documentation/reports/daily')/today.isoformat()
base.mkdir(parents=True,exist_ok=True)
repository=os.environ.get('GITHUB_REPOSITORY','unknown')
summary=[f'# LCR Daily — {today.isoformat()}','',f'- Repositório: `{repository}`',f'- Commits registrados: **{len(commits)}**','- Fonte: histórico Git; **não inclui conversas privadas do ChatGPT**.','', '## Commits']
summary += [f"- `{c['sha'][:10]}` — {c['subject']} ({c['author']})" for c in commits] or ['- Nenhum commit registrado.']
summary += ['','## Pendências','- Atividades dos chats não inferíveis a partir de commits: registrar via `LCR_DAY` quando disponíveis.']
(base/'summary.md').write_text('\n'.join(summary)+'\n',encoding='utf-8')
(base/'github_activity.jsonl').write_text(''.join(json.dumps(c,ensure_ascii=False)+'\n' for c in commits),encoding='utf-8')
meta={'date':today.isoformat(),'timezone':'America/Sao_Paulo','repository':repository,'source':'git_log','commits':len(commits),'chat_history_included':False,'raw_complete':False,'generated_at':datetime.now(timezone.utc).isoformat()}
(base/'metadata.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'Gerado: {base}')