# Hotfix — visualizador do esquema 2D

Data: 2026-11-09.

O botão “Ver esquema 2D” foi adicionado à barra inicial de Explorar. Abre um diálogo com frente inicial e alternância para o verso por botão ou setas. Há zoom, ajuste à tela, fechamento por botão/Escape, restauração de foco, bloqueio de rolagem do fundo e suporte a movimento reduzido.

O verso foi copiado byte a byte do PNG gerado nesta conversa para `code/public/assets/diagrams/UncutGemV1BackScheme.png`. A frente foi extraída byte a byte do ZIP fornecido pelo responsável e salva como `UncutGemV1FrontScheme.png`, sem reconstrução ou edição. Ambos os PNGs têm 1672×941 pixels.

Validação: build TypeScript/Vite e 19 testes Vitest passaram; teste Chromium com os dois PNGs reais cobre frente inicial, alternância de face, zoom/reset, fechamento, foco, mobile e movimento reduzido. O teste anterior com fixture foi substituído por verificação com arquivos reais. O smoke geral foi ampliado para cobrir o visualizador. Envio à main e publicação seguem a autorização do responsável; a conclusão do deploy é verificada separadamente.

Repetição do teste específico: com o servidor ativo, executar `node code/scripts/BrowserSchemeSmoke.mjs`; aceita APP_URL e CHROMIUM_PATH.
