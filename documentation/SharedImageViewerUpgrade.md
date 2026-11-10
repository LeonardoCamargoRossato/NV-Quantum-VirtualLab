# Visualizador de imagens compartilhado

## Contrato
Todas as imagens abertas pela aplicação usam `code/src/ImageViewer.tsx`. Fotos institucionais/de referências usam o acionador acessível `InteractiveImage.tsx`; inventário, recortes, fluxo e guia mantêm seus acionadores e passam ao mesmo visualizador. O esquema 2D é apenas uma configuração com duas imagens e o botão de virar.

A foto interativa do Explorar compartilha `ImageNavigation.ts` com o visualizador: zoom 25–800%, roda ancorada no cursor, zoom manual pelo mesmo estado, arraste nos dois eixos e cursor grab/grabbing. Arraste sobre polígonos não seleciona acidentalmente um componente. A roda impede a rolagem simultânea da página.

O cabeçalho usa ícones SVG para download, fullscreen nativo, fechar, ajuste e zoom; todos têm rótulos acessíveis e títulos. Fullscreen atua numa superfície dentro do dialog, conforme a restrição da API; o fechamento sai do fullscreen e restaura o foco. As dimensões naturais de cada imagem definem seu ajuste, sem assumir proporção fixa. Galeria/flip reiniciam enquadramento. Escape e setas permanecem disponíveis.

Download preserva os bytes do arquivo original e sua extensão, sem usar screenshot/canvas. Uma origem externa que negue CORS pode impedir download; nesse caso há mensagem explícita. Todas as 79 URLs do inventário são resolvidas para os arquivos locais publicados, evitando dependência de CORS para essas imagens. Arquivos de imagem e dados do inventário não foram alterados.

## Novas imagens
Usar `InteractiveImage` dentro de `ImageOpeningContext`. Fluxos com ações próprias podem passar `ViewerImage` para `ImageViewer`. Não adicionar um visualizador particular. A regra está também em AGENTS.md; `ImagePolicy.test.ts` verifica no build de testes os elementos img sem botão acessível ou viewport interativo.

## Validação
- Testes TypeScript e Python; build e nomenclatura.
- `BrowserImageViewerSmoke.mjs`: foto principal, cards/lista, fluxo, três diagramas, Sobre, Referências, teclado/mobile, zoom/arraste, download com comparação de bytes, fullscreen e mensagens de falha.
- `BrowserSchemeSmoke.mjs`: frente/verso, ancoragem da roda, arraste acima/abaixo de 100%, downloads originais, fullscreen, fechamento/foco e mobile.
- `BrowserPhotoLayersSmoke.mjs`: vínculo e seleção dos polígonos e display fixo.
- `BrowserSmoke.mjs`: navegação e regressões gerais.

Screenshots locais ficam em `/tmp/nv-shared-image-viewer/`. Verificações de implementação não equivalem a auditoria independente.
