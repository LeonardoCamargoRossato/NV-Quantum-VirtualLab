# Hotfix — recortes PCB e paginação do inventário

Data: 2026-11-09. Implementação autorizada pelo responsável nesta conversa, incluindo envio à main.

## Imagens

Os quatro recortes apresentados e aprovados foram preservados sem alteração de pixels. Acrescentados pads U2 (exemplo de ilhas de solda) e footprint de header U1 (referência para soquetes/headers; não representa peça instalada).

| Tag | Arquivo em code/public/assets/official/v1/components | Face | Região em pixels (esquerda, topo, direita, base) |
|---|---|---|---|
| UG-V1-0013 | UgV10013.png | Frente | 660, 1025, 850, 1250 |
| UG-V1-0014 | UgV10014.png | Frente | 1920, 1280, 2225, 1405 |
| UG-V1-0016 | UgV10016.png | Frente | 1160, 855, 1585, 965 |
| UG-V1-0017 | UgV10017.png | Verso | 1065, 1475, 1395, 1625 |
| UG-V1-B044 | UgV1B044.png | Frente | 1150, 1020, 1385, 1255 |
| UG-V1-B045 | UgV1B045.png | Frente | 1580, 1420, 1910, 1635 |

Fontes: renders oficiais DiamondGeezerFrontV1.png e DiamondGeezerBackV1.png preservados no repositório, 3022×1952. Capturas de janelas de pixels em tamanho natural; sem reconstrução ou aprimoramento generativo. Coordenadas, hashes de fonte e de recorte estão no plano de evidências e no manifesto. O gerador mantém os PNGs aprovados byte a byte, incluindo os recortes do verso.

Os recortes mostram footprints/pads, não componentes ou conectores instalados. A imagem UG-V1-B043 (trilhas de cobre) permanece intacta para hotfix posterior. As vistas gerais da frente e do verso também permanecem.

## Paginação

Cards mostram no máximo duas fileiras por página. A quantidade de colunas acompanha a largura disponível, incluindo mobile, menu recolhido e inspetor aberto. Navegação com números, anterior/próxima e contagem. Busca, filtros e ordenação reiniciam na primeira página; CSV continua exportando todos os resultados filtrados, não apenas a página. A visualização Lista mantém sua tabela detalhada.

## Verificação

24 testes Python e 17 Vitest aprovados; build TypeScript/Vite aprovado, com aviso preexistente de bundle acima de 500 kB. Smoke Chromium desktop/mobile passou, percorrendo os 79 registros sem duplicação e verificando limite de duas fileiras, mudança de página, reset de filtros, CSV e regressões de navegação/Fluxo/pesquisa. LCR_NAMING: zero violações. Varredura preliminar de segredos: zero alertas; não substitui auditoria independente.

Nenhuma atualização no Google Sheets nem sincronização Drive foi executada. O catálogo foi reconstruído a partir das fontes e evidências versionadas.
