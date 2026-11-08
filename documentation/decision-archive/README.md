# Decision Archive (ADR)

Repositório de **Architecture Decision Records**. Não é apenas um histórico de tarefas: registra **por que** uma escolha foi realizada, quais alternativas existiam e seus impactos.

Nome recomendado: `ADR-0001-titulo-curto.md`.

```markdown
# ADR-0001 — Título
- Data: AAAA-MM-DD
- Status: proposto | aprovado | substituído | revogado
- Responsável:

## Contexto
## Alternativas consideradas
## Decisão
## Justificativa
## Consequências e riscos
## Referências e evidências
```

Decisões relevantes: GitHub como fonte de verdade, Drive como backup, Supabase como opcional, políticas públicas/privadas, modelo de autenticação, regras de divulgação científica. Alterações importantes geram ADR novo vinculado ao anterior.
**Confirmação:** ADR significa *Architecture Decision Record*. Este arquivo documenta decisões e suas justificativas; não substitui registros de chats, que ficam em `../agents-archive/`.

## Protocolo ADR atualizado
- [Guardrails para ADR](LCR_ADR_GUARDRAILS.md) — inspirado em Zimmermann: problema significativo, alternativas reais, prós e contras, decisão, confiança e acompanhamento, evitando mega-ADRs e justificativas artificiais.
- [Skill LCR ADR Generator](../../.agents/skills/lcr-adr-generator/SKILL.md) — executa avaliação condicional, sem criar registros triviais.
- [Modelo único de ADR](../../.agents/skills/lcr-adr-generator/templates/AdrTemplate.md) — documento de registro, não terceiro modelo de prompt.

Todo prompt de desenvolvimento avalia a relevância de ADR; **nem todo desenvolvimento cria um**. Registros existentes e o histórico realmente acessível servem de contexto. Não reescrever ADRs históricos silenciosamente; novas decisões relacionam/sucedem registros antigos.
