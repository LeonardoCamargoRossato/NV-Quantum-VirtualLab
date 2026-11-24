# LCR_CICD_STANDARD

CI/CD centralizado, proporcional e sem redundância

Versão 1.2 · 24/11/2026 · Diretriz aprovada; implementação por projeto pendente. Revisão: Quality Gate obrigatório e gate técnico independente do Auditor opcional.

## 1. Escopo

Define como executar validações; os comportamentos a testar pertencem ao LCR_TESTING_STANDARD. Complementa MIN-19 e LCR_GUARDRAILS. CI, merge e deploy são estados distintos.

## 2. Pipeline de referência

Manter um entrypoint de qualidade por projeto, com jobs reutilizáveis e paralelismo quando útil. Preflight: instalação com lockfile, secrets, documentação, formatação, typecheck, lint, unitários, build, assets, artefato e dependências conforme stack e risco. E2E em build local/homologação. Reutilizar build e artefatos quando equivalentes. Publicar somente revisão aprovada; smoke mínimo pós-deploy.

## 3. Gatilhos e deduplicação

Inventariar workflow → gatilho → script → cenário → dependências. Cada teste tem responsável canônico; evitar executar a mesma suíte em workflows distintos para mesmo SHA, configuração e finalidade. Filtros de paths incluem dependências compartilhadas e não podem pular gates obrigatórios. Usar concurrency por PR/ref e cancelar execução obsoleta quando seguro. Não cancelar deploy crítico sem estratégia consistente. Workflows especializados sob demanda/agendamento, salvo justificativa. Revisar sobreposição push/PR e pós-deploy.

## 4. Controles

Permissões mínimas, versões controladas, secrets por ambiente, timeouts, retries limitados e retenção de evidências. Sem credenciais reais em PRs comuns. Não desabilitar checagens para obter status verde. Quality Gate automatizado obrigatório para todos os PRs: exigir sucesso das verificações aplicáveis antes do merge, com status check obrigatório quando a proteção da plataforma permitir; na ausência de proteção configurável, registrar evidência e verificar o resultado antes do merge. Preservar cobertura na migração. A revisão independente é proporcional ao risco, conforme LCR_GUARDRAILS e LCR_AUDITORIA; o gate técnico adicional de aprovação por Auditor independente é opcional, conforme maturidade e infraestrutura do projeto. Aprovação humana permanece obrigatória para decisões de alto impacto. A ausência do gate técnico adicional não dispensa auditoria indicada pelo risco nem autoriza contornar o Quality Gate.

## 5. Aceite verificável

CI-01: mapa de execuções sem duplicação injustificada. CI-02: logs/artefatos por SHA e PR. CI-03: gates e cobertura preservados; falhas recorrentes categorizadas por assinatura, sem confundir assinatura com causa-raiz. CI-04: deploy/smoke separados da CI comum. CI-05: comparação de execuções, duração e consumo antes/depois; limites segundo LCR_RESOURCE_GOVERNANCE_STANDARD. CI-06: em produtos com navegação, integrar a verificação do Product Structure Mapping ao Quality Gate existente, conforme PSM-01 a PSM-04 do LCR_FRAMEWORK_DOCUMENTATION_STANDARD; não criar workflow redundante. Registrar não aplicabilidade em projetos sem navegação.
