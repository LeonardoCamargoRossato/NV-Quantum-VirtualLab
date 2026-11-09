# ADR-0008 — Auditoria independente e especialistas opcionais

- **Data:** 2026-11-09
- **Status:** aprovado
- **Responsável:** responsável humano do LCR Workflow
- **Decisão relacionada:** ADR-0003, ADR-0004, ADR-0005
- **Confiança:** alta; aprovação explícita nesta conversa
- **Origem:** o responsável aprovou o fluxo de decisão, especialistas opcionais, retestes e pediu padronização LCR.

## Contexto
O Quality & Security Auditor reunia conformidade, QA e segurança, sem gate objetivo ou critérios explícitos para separar especialistas. Era necessário evitar autoverificação de código e proliferação de chats.

## Alternativas
| Opção | Ganhos | Perdas |
|---|---|---|
| A. Auditor faz tudo | Menor custo inicial | Limita profundidade e independência |
| B. Especialistas fixos em todo projeto | Revisão especializada permanente | Sobrecarga e excesso de agentes |
| C. Auditor geral + especialistas por gatilho humano | Proporcionalidade e rastreabilidade | Triagem e decisão humana adicionais |

## Decisão
Adotar **C**: **Planner → decisão humana → Auditor geral + especialista opcional → parecer consolidado → Codex/Builder → reteste independente em commit estável → aprovação final humana**.
O Auditor verifica conformidade, nomenclatura, testes, build e Actions; não altera código por padrão. Especialistas opcionais: Cybersecurity (segurança lógica), Safety (segurança física) e Scientific/Technical Reviewer (validação científica). Convocação proposta pelo Planner se **risco alto OU (especialização alta E complexidade alta)**, sempre autorizada pelo humano. Criar skill `LCR_AUDIT_GENERATOR` com três templates próprios, distintos dos dois modelos de implementação do Planner.

## Consequências e riscos
Mais qualidade, rastreabilidade e independência; mais custo de testes e eventual demora. Testes durante commits concorrentes são diagnósticos, não aceite final. A decisão pode ser revista por novo ADR, preservando histórico.

## Implementação e acompanhamento
Atualizar AGENTS, workflow, guardrails, skills e README do Auditor. A aprovação desta política não constitui aprovação automática do software ou certificação em normas externas.

## Evidências
- Aprovação do responsável nesta conversa em 09/11/2026.
- `.agents/skills/lcr-audit-generator/SKILL.md`, `documentation/LCR_WORKFLOW.md`.
