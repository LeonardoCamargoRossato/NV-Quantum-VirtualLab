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

## Prompts para Builder e Codex
Quando o usuário pedir, em linguagem natural, para **criar um prompt** de desenvolvimento, upgrade ou hotfix, usar a skill `.agents/skills/lcr-prompt-generator/SKILL.md` e **somente** `DevelopmentPrompt.md` ou `HotfixPrompt.md`. Não exigir comando `/`, distinguir pedido de elaboração de pedido de execução, respeitar o destinatário escolhido e não inventar paths ou data/hora.

## ADR condicional em prompts
Ao gerar um prompt de desenvolvimento/upgrade, avaliar obrigatoriamente se existe **nova decisão arquitetural significativa**, consultando `documentation/decision-archive/LCR_ADR_GUARDRAILS.md`. Quando houver, usar `.agents/skills/lcr-adr-generator/SKILL.md` e entregar o ADR Markdown **após** o prompt. Sem decisão nova, só o prompt e nota breve. Não exigir novo OK para decisão que o humano já aprovou; não presumir histórico de outros chats.

## Salvamento operacional do ADR
Para uma **decisão real** com ADR, usar as integrações GitHub/Drive disponíveis no próprio turno para gravar em `documentation/decision-archive/` e espelhar na pasta do projeto no Drive. Mostrar links e status verificados; não persistir exemplos hipotéticos ou conteúdo privado. Se ferramenta não estiver disponível, indicar pendência e entregar arquivo. A configuração de backups por GitHub Actions é independente dos conectores do ChatGPT.
