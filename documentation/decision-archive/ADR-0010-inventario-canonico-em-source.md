# ADR-0010 — Inventário canônico em source

- **Data:** 2026-11-09.
- **Status:** aprovado.
- **Responsável pela decisão:** responsável humano do projeto.
- **Decisão relacionada:** ADR-0007 (substitui a dependência operacional da planilha como fonte do site; preserva o laboratório estático e a procedência).
- **Confiança:** alta para centralização e rastreabilidade; dados e interpretações físicas continuam sujeitos à revisão técnica.
- **Origem da aprovação:** nesta conversa, o responsável determinou “vamos unificar tudo dentro de source” e solicitou implementar o prompt de unificação do Planner junto dessa orientação.

## Problema e contexto
O inventário antigo de 33 itens e a pesquisa de 69 componentes tinham fontes e interfaces distintas. A árvore documental duplicava o catálogo. O acesso Google no ambiente não foi validado; o responsável forneceu o XLSX e escolheu GitHub como fonte de verdade.

## Critérios e restrições
Preservar o original V1/V2, tags e hierarquia; não criar imagens ou hotspots fictícios; não depender de credenciais no navegador; preservar metadados, divergências e revisão das evidências.

## Alternativas consideradas
| Alternativa | Benefícios | Custos e riscos |
|---|---|---|
| Manter duas interfaces e fontes | Menor mudança imediata | Divergência e buscas independentes |
| Consultar Google ao vivo | Atualização central online | Dependência de autenticação/rede não resolvida nesta sessão |
| XLSX versionado e catálogo derivado único em source | Reprodutível e acessível pelo Git; sem autenticação em runtime | Atualização explícita, arquivo XLSX binário e necessidade de reconciliação |

## Decisão e justificativa
Adotar `code/source/` para o XLSX original, JSON canônico derivado, evidências auxiliares e arquivos históricos. A árvore de 79 itens é canônica; a aba de 33 complementa lacunas em registros com a mesma tag. Para filhos desagregados, o vínculo legado preserva a referência sem copiar automaticamente quantidades/modelos de grupos. A interface consome somente o catálogo gerado e oferece busca e filtros compartilhados.

## Consequências e trade-offs
- Preservação das duas abas, V2 e galeria no XLSX; documentação explica o modelo sem outro catálogo ativo.
- Divergências são mantidas no relatório de consolidação. Vistas frontal/traseira da PCB ficam como referências históricas acessíveis pela ficha da PCB.
- Sem sincronização nem escrita Google. Atualizações online precisam de incorporação explícita ao XLSX e reconstrução do catálogo.
- Imagens externas referenciadas não são automaticamente arquivadas. Evidências de imagens aprovadas do Builder complementam o catálogo com sua procedência e limitações.
- Reversão possível pelo histórico Git; não reescrever ADR-0007.

## Implementação e acompanhamento
Importador reproduzível, validação de 10 subsistemas/69 componentes e integridade da origem no CI; testes de hierarquia, busca, CSV e navegador. Reteste independente e aprovação final seguem ADR-0008. Não acionar backup Drive neste trabalho, conforme orientação explícita do responsável nesta conversa.

## Evidências
- [Fonte e atualização](../../code/source/README.md).
- [Guia do inventário](../Inventory.md).
- XLSX autorizado com SHA-256 registrado em `code/source/README.md`.
- Escopo da aprovação: mensagens acessíveis desta conversa e prompt fornecido pelo responsável; não presume acesso a outros chats.
