# ADR-0011 — Fonte canônica única para o inventário Uncut Gem V1

- **Data:** 2026-11-09
- **Status:** aprovado para implementação; exclusão da aba Google histórica condicionada ao gate
- **Responsável:** responsável humano do NV Quantum Virtual Lab
- **Decisões relacionadas:** ADR-0007, ADR-0008, ADR-0009 e ADR-0010
- **Origem:** pedido explícito LCR_DEV de migrar a árvore para fonte exclusiva e somente então excluir a guia antiga.

## Contexto e problema

O catálogo de 79 itens do Uncut Gem V1 passou a ser organizado em `Árvore Uncut Gem V1 — System Components` (`gid=2026110901`), mas o consolidador ainda exigia `Uncut Gem V1` (`gid=1346018179`, 33 itens) e preenchia lacunas silenciosamente a partir do catálogo histórico. O XLSX operacional continha cinco guias e a interface dependia dos históricos `UG-V1-0002` e `UG-V1-0003` para vistas da PCB. Isso impedia excluir a guia antiga e aumentava o risco de divergência.

## Alternativas analisadas

| Opção | Vantagem | Risco |
|---|---|---|
| Manter ambas as abas | Migração mínima | Duas fontes e propagação de dados históricos silenciosa |
| Consultar Google Sheets online | Potencial sincronização | Autorização e disponibilidade em tempo de execução; não é necessário para GitHub Pages |
| **Árvore V1 única + XLSX de quatro abas + JSON derivado** | Contrato auditável, sem API externa no navegador, sem dados duplicados | Migração de dados, alteração de hashes e risco de dependências Google não identificadas |

## Decisão

Adotar a terceira opção. Os 79 registros da árvore são a **única fonte operacional** para reconstruir `code/source/InventoryV1.json`, enriquecidos apenas pelas evidências fotográficas aprovadas versionadas em `code/source/evidence/`. Preservar `legacyTag` como metadado sem criar dependência de `legacyItems` ou `legacyOnlyTags`. Os 33 registros antigos permanecem intactos em `code/source/legacy/InventoryV1Legacy.json` e no histórico do Git.

Completar 15 links da coluna P por tag. Os 11 links `uncut-gem.ino` são **referências ao firmware**, não datasheets formais de componentes; ADF4351 e BPW34 mantêm seus links técnicos identificados. As vistas da PCB passam a `UG-V1-B041` e `UG-V1-B042`.

Preservar no XLSX operacional exatamente quatro abas: árvore, V2, galeria e Leia-me. A árvore no Excel pode ter nome truncado a 31 caracteres, mas **não se renomeia nem altera o gid** da aba Google original.

## Riscos e controles

- **Destruição de dados:** a aba Google antiga só pode ser excluída após reconciliação dos 15 valores, XLSX reconstruído, 79 tags, testes Python/TypeScript/build/smoke/naming aprovados e auditoria de consumidores externos, fórmulas, intervalos e Apps Script. Na ausência de evidência, **não excluir**.
- **Ligações externas:** consumidores de `gid=1346018179` não são completamente observáveis pela API do Google Sheets; remover a aba pode romper aplicações externas. A exclusão é independente do deploy e exige seu próprio gate.
- **Rastreabilidade:** histórico Git recupera o workbook original; histórico do Google pode não recuperar o mesmo identificador `gid` após exclusão, portanto a reversão não é perfeitamente simétrica.
- **Segurança:** não alterar compartilhamento ou introduzir OAuth/API nova. Evitar qualquer backup individual no Google Drive (ADR-0009).
- **Imagens:** preservar assets reais, classificação de procedência e limites científicos; não inventar hotspots.
- **Automação:** o gerador Layer B deve fazer `--check` de esquema e reconstruir somente a árvore de quatro abas, sem repovoar o legado.

## Resultado esperado e gates

1. 15 datasheets reconferidos por tag no Google Sheets.
2. XLSX de quatro abas e seu novo SHA-256 versionados, com os outros dados preservados.
3. JSON 79 itens, sem união automática ao legado.
4. Interface de inspeção das faces `B041/B042` funcionando.
5. Actions de naming, auditoria, build/Pages e smoke aprovados no **mesmo SHA estável**.
6. Reteste independente pelo Auditor (ADR-0008), seguido da aprovação humana final.

**Reversibilidade:** checkout do commit pré-migração `4b641bfebb2d3694163df3338b2e66d0d1556c21` para reverter software/XLSX. O Google Sheets antigo é mantido até confirmação do gate; sua exclusão exige procedimento separado e registro da limitação de reversibilidade do gid.
