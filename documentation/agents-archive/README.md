# Agents Archive — registros dos especialistas

Este diretório guarda **registros e entregas**, não código e não cópias dos arquivos visuais/sonoros. Cada especialista pode ter subpastas por sessão/data, preservando a estrutura indicada.

## Registro padrão dos agentes
`planner/`, `builder/builder-aux/`, `builder/codex/`, `research/`, `drawer/` e `audio-designer/` seguem o mesmo contrato para sessões encerradas com `LCR_DAY`:

- `daily_summary.md` — resumo de decisões, entregas, pendências e próximos passos;
- `raw_data.jsonl` — apenas mensagens realmente acessíveis, após revisão de segurança; não publicar raw automaticamente em Git público;
- `data.json` — data, assunto central, keywords, até cinco tópicos, papel, origem, horários apenas verificados e indicação de completude.

**Não criar arquivos fictícios vazios para fingir que houve uma sessão.** Esses três registros são gerados por sessão quando houver material acessível.

## Exceção — Quality & Security Auditor
`quality-security-auditor/` mantém relatórios independentes segundo o risco (segurança, testes, SEO, configuração, revisão de arquitetura, evidências), sem obrigação do trio diário.

## Separação de responsabilidades
- Decisões aprovadas e justificativas: `../decision-archive/`.
- Código/scripts/testes: `../../code/`.
- Arquivos visuais e sonoros usados pelo app: `../../code/public/assets/`.
- Normas permanentes: `../LCR_GUARDRAILS.md` e `../LCR_NAMING_CONVENTIONS.md`.
