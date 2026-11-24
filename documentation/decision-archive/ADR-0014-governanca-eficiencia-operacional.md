# ADR-0014 — Governança transversal da eficiência operacional

- **Data:** 2026-11-24
- **Status:** aprovado (direção e documentação); implementação automatizada pendente.
- **Responsável:** responsável humano do LCR Workflow.
- **Decisão relacionada:** ADR-0008 — auditoria independente e especialistas opcionais; ADR-0009 — backup diário ao Drive (GitHub, referência NV-Quantum-VirtualLab).
- **Confiança:** alta na decisão documental; impacto operacional depende de aplicação e medição em cada projeto.
- **Origem da aprovação:** em 24/11/2026, o responsável concordou com as correções da auditoria de egress do Portfolio e solicitou explicitamente criar/atualizar as normas no Drive, sem redundância. Determinou carregamento de imagens somente quando utilizadas/visíveis e prioridade de estabilidade sobre rapidez.

## Problema e contexto
A auditoria do LCR Portfolio encontrou chamadas repetitivas a mídia de produção, predominantemente por navegadores automatizados, antecipação de imagens fora da tela e sobreposição de workflows. A atribuição exata por script ainda não foi comprovada por ensaio controlado. As normas anteriores estabeleciam organização, segurança, testes e rastreabilidade, porém não detalhavam suficientemente isolamento, topologia de CI, demanda de rede, quotas e consumo. O script de auditoria original não cobria todas essas dimensões.

## Critérios e restrições
Manter o Framework conciso e sem fontes normativas concorrentes; preservar responsabilidades do Planner, Builder, Auditor e humano; não adicionar serviços obrigatórios, custos, exclusões ou dependências automaticamente. A qualidade e a estabilidade precedem a rapidez de entrega. GitHub é fonte versionada; Drive é referência documental/backup. Não prometer disponibilidade absoluta.

## Alternativas consideradas
| Alternativa | Benefícios | Custos, riscos e desvantagens |
| --- | --- | --- |
| Corrigir apenas o Portfolio | Menor alteração inicial | Outros projetos repetem o risco; conhecimento fica local |
| Concentrar tudo em guardrails genéricos | Poucos arquivos | Regras técnicas dispersas e difícil fiscalização |
| Normas especializadas, referenciadas por um Auditor existente | Responsabilidades claras e critérios verificáveis | Exige manutenção de referências e adoção gradual |

## Decisão e justificativa
Adotar a terceira alternativa. Criar quatro normas complementares: LCR_TESTING_STANDARD (isolamento), LCR_CICD_STANDARD (orquestração), LCR_PERFORMANCE_STANDARD (carregamento e cache) e LCR_RESOURCE_GOVERNANCE_STANDARD (quotas e custos). Evoluir no próprio documento LCR_ASSET_ORGANIZATION_STANDARD para v1.1 (hospedagem estática/dinâmica, inventário e migração) e QUALITY_SECURITY_AUDITOR_README para v1.1 (fiscalização por referência), sem criar auditoria concorrente. Atualizar o índice existente. O ADR-0008 continua válido: não substituir a auditoria independente por autoverificação do Builder.

## Consequências e trade-offs
- Ganhos esperados: prevenção de egress e custos não autorizados, testes mais reproduzíveis, melhor rastreabilidade e menor retrabalho.
- Custos: manutenção de fixtures, gates, inventários e evidências; calibração de orçamentos e testes reais selecionados; mais tempo inicial de validação.
- Adoção gradual e reversível por projeto; preservar originais, cobertura e versão saudável. Exceções significativas exigem decisão humana/ADR. Nenhum monitor ou serviço novo é instalado pela documentação.

## Implementação e acompanhamento
Documentação no Drive: quatro normas criadas, norma de assets e README do Auditor atualizados, índice atualizado; os sete documentos foram relidos após gravação em 24/11. A sincronização GitHub e a evolução executável de LCR_AUDITORIA/CI permanecem pendentes. LCR Portfolio é aplicação inicial com cinco etapas sequenciais; demais projetos devem ser avaliados conforme stack e risco. Auditor revalida evidências por SHA, cenário, consumo e estado de publicação. Alertas 50/80/100% são sugestões configuráveis, não monitoramento instalado.

## Evidências e referências
- Governança e Padrões no Drive (referência documental)
- [Índice do Framework](../LCR_FRAMEWORK_INDEX.md)
- [ADR-0008 — auditoria independente](https://github.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/blob/main/documentation/decision-archive/ADR-0008-gate-de-auditoria-e-especialistas-opcionais.md)
- [ADR-0009 — backup diário](https://github.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/blob/main/documentation/decision-archive/ADR-0009-backup-diario-drive.md)
- Numeração 0014 reservada a partir do índice GitHub consultado (0013 era o maior número); o Drive tinha somente 0001–0006. Lacuna de sincronização não resolvida por este registro.
