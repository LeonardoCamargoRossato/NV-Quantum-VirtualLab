# ADR-0005 — Avaliação arquitetural integrada ao gerador de prompts

- **Data:** 2026-11-08
- **Status:** aprovado
- **Responsável:** responsável humano pelo projeto
- **Relacionados:** ADR-0004 (modelos de prompt), `LCR_GUARDRAILS.md`
- **Confiança:** alta — regras de comportamento e limites explícitos
- **Evidência de aprovação:** discussão do Planner sobre geração de prompt + ADR, seguida de solicitação explícita de implementação

## Contexto
O Planner já entrega prompts de desenvolvimento/upgrade e hotfix. É preciso rastrear decisões arquiteturais sem criar documentos desnecessários em cada ciclo; o processo deve ser natural, rápido e funcionar por voz.

## Critérios e alternativas
| Alternativa | Benefício | Custo ou risco |
|---|---|---|
| ADR em **todo** desenvolvimento/upgrade | Rastreabilidade uniforme | Burocracia, ADRs triviais e perda de adesão |
| ADR apenas quando solicitado manualmente | Simplicidade | Decisões relevantes podem ficar sem registro |
| **Avaliação automática** em todo desenvolvimento, ADR condicional | Equilíbrio entre rastreabilidade e agilidade | Exige julgamento contextual e acesso aos registros |

## Decisão
A skill `LCR_PROMPT_GENERATOR` verifica sempre a relevância arquitetural quando prepara prompts de desenvolvimento/upgrade e pode invocar `LCR_ADR_GENERATOR`. Se houver nova decisão significativa, entregar **dois arquivos Markdown**: o prompt e o ADR. Caso contrário, apenas o prompt, com justificativa breve. Hotfixes normalmente não geram ADR.

O ADR deve usar o último registro **relevante**, o brainstorming efetivamente acessível e o modelo/guardrails adaptados de Zimmermann. Decisão já explicitamente aprovada no brainstorming não exige um segundo "OK"; alterações solicitadas pelo humano geram revisão antes de implementação. A ausência de aprovação permanece `proposto`.

## Consequências
Redução de burocracia, dois pacotes de skills distribuíveis e dois modelos canônicos de prompts preservados (DevelopmentPrompt e HotfixPrompt). A geração dos arquivos não autoriza commits nem implementação automaticamente; contexto de outros chats não é presumido.

## Ações e revisão
- Criar skill ADR e template, integrar skill existente e documentos normativos.
- Testar arquivos e republicar pacotes para instalação no ChatGPT.
- Revisar após uso em projetos com e sem novas decisões arquiteturais.

## Referências
`documentation/decision-archive/LCR_ADR_GUARDRAILS.md`; [Zimmermann, ADR Creation](https://ozimmer.ch/practices/2023/04/03/ADRCreation.html).
