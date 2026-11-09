# LCR — Gate de migração do inventário canônico V1 (pré-exclusão)

Data: 2026-11-09. Referência: ADR-0011 e PR #2.

## Integração
- PR #2 foi mesclado na main no commit `d10ec162639944c0c448e249886e6ad8600df437`, preservando o visualizador 2D.
- O commit subsequente `1d272d533fd5bb2713cec4e8c412aa39eb7909af` modificou **somente** o ZIP `code/public/assets/official/v1/components/UgV1LayerBComponents.zip` por automação de imagens.
- O catálogo operacional `code/source/InventoryV1.json` está no schemaVersion 3: **79 itens**, sem `legacyItems` ou `legacyOnlyTags`; B041/B042 são as duas faces da PCB.
- Workbook XLSX operacional contém **quatro abas**, SHA-256 `13339c68d4fcb0a44134faf0a9fff29b39859904bc9b5f44078bf2f0a6413445`; original de cinco abas recuperável no histórico Git.
- 15 datasheets reconferidos por tag na coluna P da árvore Google (11 URLs de firmware identificadas como fonte de código e não datasheets do fabricante).

## Evidências do gate
- Checks anteriores ao merge (PR #2) e posteriores (commit do merge): Naming, Auditoria automatizada, Pages/build, Interface Smoke desktop/mobile e Layer B verdes.
- Varredura do código operacional (scripts Python, TS/React, testes, workflows, JSON de evidência/manifestos) sem dependências ativas de `gid=1346018179`, `UG-V1-0002` ou `UG-V1-0003`. Menções restantes a legados são intencionais em testes e histórico.
- Verificação por API Google Sheets da planilha `158OGccBdF5Hf6qdWIH2-Tmt_-gU8sO8pz3CvyTpycXU`, preservando `gid=2026110901`. As quatro abas de destino foram inspecionadas em A1:Z220 (fórmulas) e faixas de dados (validações, notas, hyperlinks): nenhuma referência ao gid antigo ou nome de aba em fórmula.
- Nenhum projeto Apps Script acessível foi encontrado na busca de Drive. **Isso não descarta scripts vinculados ou consumidores externos**; o conector não oferece auditoria completa desses acessos.
- A planilha permite leitura pública conforme permissões existentes (anyone reader); uma URL externa com o gid antigo pode existir fora dos sistemas inspecionados.

## Risco e exclusão
Exclusão de `Uncut Gem V1`, `gid=1346018179`, **somente após** todos os testes na main estável. A exclusão não deve alterar `Árvore Uncut Gem V1 — System Components`, `gid=2026110901`, nem V2, Galeria e Leia-me. O gid excluído pode não ser recuperável exatamente.

**Estado no momento deste registro:** exclusão Google ainda pendente. O resultado da operação, se executada, será registrado no histórico do PR #2, sem fazer backup arquivo a arquivo no Google Drive (ADR-0009).
