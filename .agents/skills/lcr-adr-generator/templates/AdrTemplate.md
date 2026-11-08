# AdrTemplate — Registro de decisão arquitetural (não é modelo de prompt)

> Fonte normativa: `documentation/decision-archive/LCR_ADR_GUARDRAILS.md`.
> Este é um modelo de **registro**, distinto dos dois modelos de **prompts** do LCR.

# ADR-{{NUMERO_CONFIRMADO}} — {{Título objetivo da decisão}}

- **Data:** {{YYYY-MM-DD — comprovada}}
- **Status:** {{proposto | aprovado | substituído | revogado}}
- **Responsável pela decisão:** {{papel/nome quando conhecido}}
- **Decisão relacionada:** {{ADR-XXXX ou nenhuma}}
- **Confiança:** {{alta | média | baixa; justificativa sucinta}}
- **Origem da aprovação:** {{trecho ou resumo verificável; "ainda não aprovada" caso ausente}}

## Problema e contexto
{{Que problema arquitetural significativo existe? Qual requisito torna a decisão necessária agora?}}

## Critérios e restrições
{{Requisitos relevantes: segurança, manutenção, custo, reversibilidade, desempenho, público etc. Somente os pertinentes.}}

## Alternativas consideradas
| Alternativa viável | Benefícios | Custos, riscos e desvantagens |
|---|---|---|
| {{A: manter a solução atual ou alternativa real}} | {{benefícios}} | {{perdas}} |
| {{B: opção tecnicamente viável}} | {{benefícios}} | {{perdas}} |

## Decisão e justificativa
{{O que foi decidido, por quem e por quê, vinculado aos critérios. Se ainda em discussão, escrever "proposta".}}

## Consequências e trade-offs
- **Ganhos:** {{reais e verificáveis}}
- **Perdas/riscos:** {{curto, médio e longo prazo; admitir incertezas}}
- **Reversibilidade:** {{custo e caminho para reverter, quando relevante}}

## Implementação e acompanhamento
{{Ações decorrentes, responsável se conhecido e condição de revisão. Não confundir intenção com execução.}}

## Evidências e referências
- {{Arquivos e decisões anteriores efetivamente consultados; links verificáveis}}
- {{Lacunas da análise e hipóteses explícitas}}
