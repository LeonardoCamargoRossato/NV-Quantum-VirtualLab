# Hotfix — visualizador do esquema 2D

Data: 2026-11-09.

O botão “Ver esquema 2D” foi adicionado à barra inicial de Explorar. Abre um diálogo com frente inicial e alternância para o verso por botão ou setas. Há zoom, ajuste à tela, fechamento por botão/Escape, restauração de foco, bloqueio de rolagem do fundo e suporte a movimento reduzido.

O verso foi copiado byte a byte do PNG gerado nesta conversa para `code/public/assets/diagrams/UncutGemV1BackScheme.png`. A frente foi extraída byte a byte do ZIP fornecido pelo responsável e salva como `UncutGemV1FrontScheme.png`, sem reconstrução ou edição. Ambos os PNGs têm 1672×941 pixels.

Validação: build TypeScript/Vite e 19 testes Vitest passaram; teste Chromium com os dois PNGs reais cobre frente inicial, alternância de face, zoom/reset, fechamento, foco, mobile e movimento reduzido. O teste anterior com fixture foi substituído por verificação com arquivos reais. O smoke geral foi ampliado para cobrir o visualizador. Envio à main e publicação seguem a autorização do responsável; a conclusão do deploy é verificada separadamente.

Repetição do teste específico: com o servidor ativo, executar `node code/scripts/BrowserSchemeSmoke.mjs`; aceita APP_URL e CHROMIUM_PATH.

## Controles — atualização de 2026-11-09

Fechar exibe apenas um X vetorial, com nome acessível. Virar usa ícone vetorial de duas setas circulares. Baixar PNG salva o arquivo original da face atual; frente e verso foram comparados byte a byte no teste de download. O ícone de fullscreen fica imediatamente antes do X e usa a Fullscreen API em uma superfície interna (a API não permite solicitar fullscreen diretamente em um elemento dialog). O mesmo controle permite sair do fullscreen; fechar o visualizador também encerra esse estado. Navegadores sem suporte deixam o controle indisponível, sem simular fullscreen com CSS.

O ajuste inicial considera largura e altura disponíveis para mostrar a imagem inteira, incluindo após entrar/sair do fullscreen. Zoom continua disponível. Teste específico executado contra o build de produção confirmou fullscreen nativo real (document.fullscreenElement), saída, fechamento, os dois downloads, foco, mobile e movimento reduzido.
