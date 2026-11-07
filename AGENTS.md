# AGENTS — LCR Workflow

Antes de **qualquer** prompt ou alteração, consultar:
1. `documentation/LCR_GUARDRAILS.md` — obrigações e limites.
2. `documentation/LCR_NAMING_CONVENTIONS.md` — nomes dos artefatos.
3. `documentation/LCR_WORKFLOW.md` — fluxo, papéis e decisões.
4. `documentation/LCR_START.md`, `documentation/BASIC_COMMANDS.md`, `documentation/BASIC_SKILLS.md` — operação.

- `LCR_START`: cria somente a estrutura; não instala serviços externos nem faz deploy.
- `LCR_BASIC_OPTIONS`: avaliação **dentro** do brainstorming. Research e Quality & Security são opcionais e retornam ao Planner.
- Ciclo normal: humano ↔ Planner ↔ Builder/Codex; upgrades e hotfixes possuem processos distintos.
- Código em `code/`; automações em `.github/workflows/`; normas em `documentation/`; decisões em `documentation/decision-archive/`; registros dos especialistas em `documentation/agents-archive/`.
- Sem segredos e conversas brutas privadas em Git público. Não afirmar execução ou integração sem evidência.
- Aplicar `LCR_NAMING` e os guardrails antes de encerrar entregas.
- Este arquivo no GitHub **não é carregado automaticamente por todo chat**: consulte-o via conector ou instruções do projeto.
