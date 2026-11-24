# ADR-0015 — Auditoria proporcional e gate técnico independente opcional

- **Data:** 2026-11-24
- **Status:** aprovado pelo responsável humano; implementação documental no Drive; adoção por projeto e sincronização GitHub pendentes.
- **Decisões relacionadas:** ADR-0008 e ADR-0014. Revisão parcial, preservando os registros históricos.

## Contexto
Na auditoria do Instituto Foton, constatou-se que a separação de chats por papel não garante segregação técnica de identidades no GitHub. Exigir um bloqueio de merge adicional baseado em aprovação independente em todos os PRs pode inviabilizar projetos pequenos e produzir custo desproporcional ao risco. A aprovação humana de 24/11/2026 autorizou a revisão normativa no Drive.

## Alternativas
| Alternativa | Benefício | Limitação |
| --- | --- | --- |
| Gate independente obrigatório para todos os PRs | Bloqueio formal uniforme | Exige identidades e infraestrutura distintas; excesso de revisão em mudanças triviais |
| Somente CI, sem avaliação independente | Menor custo | Perde revisão contextual de riscos relevantes |
| Quality Gate universal e auditoria proporcional | Mantém segurança e adequação ao risco | Requer triagem documentada e disciplina humana |

## Decisão
Adotar a terceira alternativa. Quality Gate automatizado obrigatório para todos os PRs; avaliação independente proporcional ao risco e complexidade; aprovação humana obrigatória em decisões de alto impacto; gate técnico adicional do Auditor opcional conforme maturidade e infraestrutura. Mudanças de baixo risco podem passar por revisão ordinária; mudanças de alto impacto exigem avaliação independente e aprovação humana. Se não for possível obter avaliação adequada, registrar bloqueio, não simular independência ou autorizar merge por omissão. Exigências externas mais rigorosas prevalecem.

Esta decisão revisa o ADR-0008 quanto à obrigatoriedade universal do fluxo de auditoria e gate técnico, e a referência a esse gate no ADR-0014; não revoga o papel independente do Auditor, a necessidade de reteste quando indicado, os controles de CI ou demais decisões.

## Consequências e acompanhamento
Planner classifica risco e complexidade; Builder executa CI e registra SHA e evidências; Auditor revisa quando indicado; responsável humano decide questões de alto impacto. Chats distintos sob a mesma identidade não demonstram independência técnica. Verificar qualidade dos PRs e decisões de risco sem criar aprovações fictícias nem remover regras de proteção existentes sem avaliação e autorização específica.

## Referências
- `LCR_GUARDRAILS.md`, `LCR_WORKFLOW.md`, `LCR_CICD_STANDARD`, `QUALITY_SECURITY_AUDITOR_README.md`.
- [ADR-0008](https://github.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/blob/main/documentation/decision-archive/ADR-0008-gate-de-auditoria-e-especialistas-opcionais.md).
- [ADR-0014](ADR-0014-governanca-eficiencia-operacional.md).
