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
Para uma **decisão real** com ADR, registrar no GitHub no próprio turno e deixar a cópia Drive para o backup diário, sem envio por arquivo. Mostrar links e status verificados; não persistir exemplos hipotéticos ou conteúdo privado. Se ferramenta não estiver disponível, indicar pendência e entregar arquivo. A configuração de backups por GitHub Actions é independente dos conectores do ChatGPT.

## Gate de qualidade e especialistas opcionais (ADR-0008)
Fluxo aprovado: **Planner → decisão humana → Auditor geral + especialista opcional → parecer consolidado → Codex/Builder → retestes do Auditor → aprovação final humana**.

O Auditor verifica nomenclatura, conformidade, testes, build, GitHub Actions, segurança básica, SEO e documentação em commit **estável**. Pode inspecionar em paralelo ao Builder (somente leitura), mas somente emite parecer final quando a implementação terminar. Codex/Builder executa correções; o Auditor retesta independentemente. Estados: **aprovado, atenção, reprovado, não verificado**; todo achado precisa de evidência.

O Planner recomenda um especialista quando **risco alto OU (especialização alta E complexidade alta)**. **Cybersecurity**: ataques digitais, autenticação, permissões e dependências; **Safety**: danos físicos, ópticos e elétricos; **Scientific/Technical Reviewer**: modelos, unidades, incertezas e método científico. A convocação depende de autorização humana, com ADR quando necessária. Normas externas são referências conforme contexto, **não certificações automáticas**. Skill: `.agents/skills/lcr-audit-generator/SKILL.md`.

## Política de backup ao final do dia (ADR-0009)
**GitHub é a fonte de verdade e o histórico contínuo. Google Drive recebe uma única rodada automática diária**: 23h55 Brasília (02h55 UTC do dia seguinte), via `LCR_BACKUP.yml`, ou `workflow_dispatch` excepcional autorizado. Não realizar upload por arquivo, ADR, relatório ou push durante o desenvolvimento. O `rclone copy` atualiza incrementalmente o espelho navegável e salva ZIP + `git bundle` por data/commit; **não apagar históricos sem política de retenção aprovada**. Status Drive é **pendente** até verificar job `success`, SHA e snapshot. OAuth do GitHub Actions é independente do plugin Drive deste chat. Em 09/11/2026, a última falha observada foi HTTP 401; não declarar corrigida sem novo teste.

## Preferências operacionais do responsável
- Neste projeto, o responsável autorizou entrega das alterações na `main` e acionamento da publicação; preservar alterações concorrentes e verificar testes antes do envio.
- Ao finalizar, informar o tempo decorrido desde a leitura do pedido até a conclusão, medido por relógio. Não inventar duração se a medição estiver indisponível.
