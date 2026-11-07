# ADR-0001 — Separar inicialização estrutural de escolhas tecnológicas
- **Data:** 2026-11-07
- **Status:** aprovado
- **Decisor:** responsável humano pelo projeto

## Contexto
Um comando de inicialização que inclui Supabase, OAuth ou deploy antes do planejamento obriga decisões tecnológicas prematuras e cria trabalho desnecessário para projetos públicos e didáticos.

## Alternativas consideradas
1. Inicializar estrutura e serviços externos juntos.
2. Inicializar somente documentos/estrutura e decidir tecnologias durante brainstorming.

## Decisão
\`LCR_START\` instala exclusivamente a base do repositório e as normas. \`LCR_BASIC_OPTIONS\` é uma análise **interna** do brainstorming com Planner, não fase autônoma. Research e Quality & Security são consultas condicionais que retornam ao Planner. Desenvolvimento cotidiano segue o ciclo humano → Planner → Builder/Codex → revisão/retorno, distinguindo upgrades de hotfixes.

## Consequências
Menor dependência tecnológica inicial e guardrails desde o primeiro commit. Integrações externas exigem planejamento, autorização, implementação e testes posteriores. A execução a partir de uma URL GitHub exige ferramentas conectadas; arquivo Markdown sozinho não é executor.

## Referências
\`LCR_WORKFLOW.md\`, \`LCR_START.md\`, \`LCR_GUARDRAILS.md\`.
