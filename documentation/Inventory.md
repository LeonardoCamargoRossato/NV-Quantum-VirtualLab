# Inventário unificado

A fonte do inventário está em [`code/source/`](../code/source/README.md): XLSX original e JSON canônico derivado. Documentação explica o modelo sem duplicar a lista de componentes.

A página Inventário apresenta um único catálogo com 79 registros (10 subsistemas A e 69 componentes B), busca em todos os metadados, filtros de camada/subsistema/face/tipo de imagem, ordenação, cards/lista e CSV. Camada C permanece indisponível. A ficha contextual expõe os metadados e a navegação entre subsistemas e componentes, sem hotspots novos não validados.

A aba legada de 33 itens é mantida no XLSX e em `legacyItems` para auditoria. A árvore prevalece em divergências; valores legados divergentes e campos complementados são registrados em `consolidation` no JSON. As vistas PCB frontal/traseira são referências históricas vinculadas à PCB, não componentes duplicados no catálogo de 79.

Não foi possível gravar no Google Sheets; não existe sincronização automática. Atualizações propostas à aba 2 estão materializadas no JSON, com diferenças auditáveis, e precisam de validação antes de aplicação manual à planilha. O JSON é incorporado ao site no build, sem autenticação Google no navegador.

Validação: `python code/scripts/consolidate_inventory.py --check`, testes Python, `npm test`, `npm run build` e `node scripts/BrowserSmoke.mjs` (estes três últimos em `code/`, smoke com servidor em execução). Documentos e prompts anteriores descrevem o contrato histórico de 33 registros, substituído por este catálogo.
