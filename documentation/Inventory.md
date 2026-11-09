# Inventário unificado

A fonte do inventário está em [`code/source/`](../code/source/README.md): XLSX operacional com quatro abas e JSON canônico derivado. Documentação explica o modelo sem duplicar a lista de componentes.

A página Inventário apresenta um único catálogo com 79 registros (10 subsistemas A e 69 componentes B), busca em todos os metadados, filtros de camada/subsistema/face/tipo de imagem, ordenação, cards/lista e CSV. Cards têm paginação responsiva de até duas fileiras; filtros e CSV continuam trabalhando sobre todos os resultados filtrados. Camada C permanece indisponível. A ficha contextual expõe os metadados e a navegação entre subsistemas e componentes, sem hotspots novos não validados.

Os 33 itens históricos ficam somente em `code/source/legacy/InventoryV1Legacy.json` e no histórico Git; não alimentam o JSON operacional. Os 79 registros da árvore são a única fonte de reconstrução. A PCB frontal e traseira usam as tags canônicas `UG-V1-B041` e `UG-V1-B042`.

Não foi possível gravar no Google Sheets; não existe sincronização automática. Atualizações propostas à aba 2 estão materializadas no JSON, com diferenças auditáveis, e precisam de validação antes de aplicação manual à planilha. O JSON é incorporado ao site no build, sem autenticação Google no navegador.

Validação: `python code/scripts/consolidate_inventory.py --check`, testes Python, `npm test`, `npm run build` e `node scripts/BrowserSmoke.mjs` (estes três últimos em `code/`, smoke com servidor em execução). Documentos e prompts anteriores descrevem o contrato histórico de 33 registros, substituído por este catálogo.
