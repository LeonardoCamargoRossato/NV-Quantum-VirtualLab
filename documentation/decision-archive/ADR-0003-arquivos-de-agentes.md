# ADR-0003 — Separar Decision Archive e Agents Archive
- **Data:** 2026-11-07
- **Status:** aprovado
- **Decisor:** responsável humano pelo projeto

## Contexto
Misturar registros de conversas com decisões estruturais prejudica a rastreabilidade e a organização dos especialistas.

## Decisão
\`documentation/decision-archive/\` contém Architecture Decision Records (ADR). \`documentation/agents-archive/\` guarda os registros dos especialistas. O Quality & Security Auditor usa relatórios independentes; demais agentes compartilham o trio padronizado quando executam \`LCR_DAY\`.

## Consequências
Separação clara entre evidências de trabalho e justificativas de decisões. Dados brutos exigem revisão antes de publicação pública.

## Referências
\`LCR_WORKFLOW.md\`, \`agents-archive/README.md\`.
