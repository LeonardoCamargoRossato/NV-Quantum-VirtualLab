# Quality & Security Auditor — LCR_AUDITORIA

**Versão 1.2 · 24/11/2026** — protocolo documental aprovado para inclusão no Framework; automações ampliadas ainda pendentes de implementação e validação por projeto.

Relatórios independentes de testes, segurança, SEO, desempenho, consumo de infraestrutura e riscos. Criar relatórios somente após avaliações efetivas. Não há obrigação do trio `LCR_DAY` comum aos demais especialistas.

## 1. Autoridade e referências únicas

O Auditor verifica conformidade e recomenda correções; Planner define o plano, Builder implementa e responsável humano aprova exceções e decisões de impacto. Aplicar `LCR_GUARDRAILS.md` e `LCR_WORKFLOW.md`; não repetir as regras dos padrões especializados neste protocolo.

A auditoria independente é proporcional ao risco e à complexidade. Mudanças de baixo risco, como ajustes locais de CSS sem efeitos relevantes, podem ser aceitas pelo Quality Gate automatizado e revisão ordinária, sem convocação de Auditor separado. Mudanças de alto impacto (segurança, autenticação, permissões, dados, arquitetura ou produção) exigem avaliação independente e aprovação humana. Para risco intermediário, o Planner justifica a necessidade de auditoria. Registrar escopo, SHA, evidências e eventuais limitações de independência; chats distintos na mesma identidade GitHub não constituem segregação técnica de funções. O gate técnico adicional do Auditor no GitHub é opcional, conforme maturidade e infraestrutura. O Quality Gate automatizado permanece obrigatório em todos os PRs, segundo LCR_CICD_STANDARD. Ausência de gate adicional não autoriza ignorar riscos ou aprovações exigidas.

| Dimensão | Norma de referência |
| --- | --- |
| Segurança, privacidade e nomenclatura | LCR_GUARDRAILS, LCR_NAMING_CONVENTIONS |
| Testes e isolamento de produção | [LCR_TESTING_STANDARD](LCR_TESTING_STANDARD.md) |
| Pipeline, gates e redundância | [LCR_CICD_STANDARD](LCR_CICD_STANDARD.md) |
| Desempenho, carregamento e cache | [LCR_PERFORMANCE_STANDARD](LCR_PERFORMANCE_STANDARD.md) |
| Quotas, egress, APIs, LLMs e custos | [LCR_RESOURCE_GOVERNANCE_STANDARD](LCR_RESOURCE_GOVERNANCE_STANDARD.md) |
| Assets, hospedagem, integridade e migração | [LCR_ASSET_ORGANIZATION_STANDARD](LCR_ASSET_ORGANIZATION_STANDARD.md) |
| Estrutura documental | LCR_FRAMEWORK_DOCUMENTATION_STANDARD |
| SEO e indexação | LCR_SEO_STANDARD (quando aplicável) |

## 2. Procedimento de auditoria

1. Definir escopo, versão/SHA, ambientes, acessos e normas aplicáveis; identificar exceções e controles não aplicáveis.
2. Inspecionar código, configuração, inventários, dependências, permissões, workflows e evidências de execução; não disparar testes reais de alto consumo sem autorização e orçamento.
3. Validar controles tecnicamente verificáveis com testes isolados e métricas. Identificar requisições inesperadas, duplicação de CI, carregamento fora do viewport e violações de orçamento. Confrontar logs com faturamento oficial quando acessível.
4. Registrar achados com ID, norma/critério, evidência verificável, impacto, severidade, confiança, recomendação, responsável e condição de revalidação. Distinguir fato, hipótese, lacuna e não aplicável; não tratar ausência de evidência como aprovação.
5. Priorizar P0 (incidente/risco crítico), P1 (causa estrutural ou risco alto), P2 (qualidade e manutenção), P3 (melhoria). Encaminhar ao Planner; preservar cobertura e histórico. Revalidar com comparativo antes/depois.

## 3. Automação e evidências

O comando `LCR_AUDITORIA` mantém seu nome e finalidade. A implementação de referência inicial (`LCR_AUDITORIA.yml` e `lcr_auditoria.py`, NV Quantum VirtualLab) verifica indícios de secrets e nomenclatura; não equivale a auditoria completa.

Evoluir o workflow existente ou seu equivalente centralizado, sem criar pipelines duplicados. Integrar verificações de isolamento de rede, orçamento, inventário, dependências, artefatos, documentação e configuração CI conforme as normas e a stack. Evitar repetir a suíte de testes já executada; consumir seus artefatos quando equivalentes. Usar permissões mínimas, não imprimir valores secretos, não alterar produção durante auditoria. Checagens determinísticas podem bloquear CI; julgamento de risco e exceções permanece humano. Monitoramento de quotas requer acesso autorizado e política leve.

Relatórios de auditoria devem separar: proposto, implementado, testado, validado, não comprovado e não aplicável. Registrar bloqueios e links/SHA. Publicar somente conteúdo revisado; manter evidências sensíveis privadas. Nenhum documento normativo por si só instala automações.

**Histórico:** versão anterior — responsabilidades de auditoria independente; v1.1 — amplia escopo e método de fiscalização com referências únicas após o incidente de egress do Portfolio. Preserva o papel e o comando existentes. v1.2 — explicita proporcionalidade da auditoria, Quality Gate obrigatório e gate técnico adicional opcional, conforme decisão humana de 24/11/2026.
