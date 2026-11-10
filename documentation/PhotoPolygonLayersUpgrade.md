# Camadas poligonais da PCB frontal

## Estrutura e edição

`code/source/PhotoPolygons.json` amplia as regiões fotográficas expostas por `PhotoRegions.ts`. Registra imagem alinhada, tamanho, coordenadas percentuais, polígonos múltiplos por tag, cores e classe visual. Os nomes, metadados e relações pai/filho vêm exclusivamente de `InventoryV1.json`; não são duplicados no mapa. Mudanças na fotografia ou na retificação exigem conferir os vértices.

`PhotoLayers.tsx` fornece seletor, legenda e SVG acessível; `Workbench.tsx` mantém foco, zoom e o inspetor compartilhado. O zoom usa os limites dos polígonos e acompanha o redimensionamento. Nenhuma camada C foi implementada.

## Cobertura

9 dos 10 subsistemas possuem regiões frontais; 35 dos 69 componentes possuem contornos. Áreas são aproximações manuais da foto, não footprints CAD nem mapas de trilhas. ADF4351/S04 é traseiro e não foi projetado ficticiamente sobre a frente.

| Subsistema | Componentes com contorno | Sem contorno frontal |
|---|---|---|
| UG-V1-S01 · Alimentação elétrica | UG-V1-B001 · Conector USB do ESP32 | UG-V1-0031 · Fonte de alimentação protegida<br>UG-V1-0013 · Conector 5 V<br>UG-V1-B002 · Capacitor C5<br>UG-V1-B003 · Capacitor C6<br>UG-V1-B004 · Capacitor C7<br>UG-V1-B005 · Capacitor C8<br>UG-V1-B006 · Capacitor C9<br>UG-V1-B007 · Capacitor C10 |
| UG-V1-S02 · Controle e aquisição — ESP32 | UG-V1-0004 · ESP32 DOIT DevKit V1<br>UG-V1-B008 · Módulo metálico ESP32<br>UG-V1-B009 · Botão EN<br>UG-V1-B010 · Botão BOOT<br>UG-V1-B011 · LEDs do DevKit<br>UG-V1-B012 · Fileiras de pinos / headers<br>UG-V1-B013 · Conversor USB–serial | UG-V1-B014 · ADC interno do ESP32 |
| UG-V1-S03 · Excitação óptica — laser | UG-V1-0022 · Laser verde<br>UG-V1-B015 · Driver / placa do laser<br>UG-V1-B016 · Fios de alimentação do laser | UG-V1-B017 · Suporte e alinhamento do laser |
| UG-V1-S04 · Geração de micro-ondas — ADF4351 | Nenhum | UG-V1-0018 · Placa geradora RF ADF4351<br>UG-V1-0017 · Conector gerador RF<br>UG-V1-B018 · Circuito sintetizador ADF4351<br>UG-V1-B019 · Pinos de comando SPI/LE<br>UG-V1-B020 · Saída RF do ADF4351 |
| UG-V1-S05 · Amplificação de micro-ondas | UG-V1-0019 · Amplificador RF 40 dB<br>UG-V1-B022 · Conector SMA de entrada RF<br>UG-V1-B023 · Conector SMA de saída RF<br>UG-V1-B024 · Fios de alimentação do módulo RF | UG-V1-B021 · Circuito ativo do amplificador RF<br>UG-V1-B025 · Componentes SMD do módulo RF |
| UG-V1-S06 · Conexões RF e antena | UG-V1-0020 · Cabo SMA curto<br>UG-V1-0021 · Antena em laço<br>UG-V1-B027 · Ligação do amplificador à antena | UG-V1-B026 · Adaptadores e terminais SMA |
| UG-V1-S07 · Prisma e detecção óptica | UG-V1-0023 · Conjunto do prisma NV | UG-V1-0024 · Diamante com centros NV<br>UG-V1-0027 · Filtro gel vermelho<br>UG-V1-0028 · Fotodiodo BPW34<br>UG-V1-0025 · Resina transparente UV<br>UG-V1-0026 · Molde de silicone<br>UG-V1-0016 · Conector do fotodiodo<br>UG-V1-B028 · Fios de saída do BPW34 |
| UG-V1-S08 · Condicionamento eletrônico de sinal | UG-V1-0005 · TL082 amplificador operacional<br>UG-V1-0015 · Ponto de osciloscópio<br>UG-V1-B029 · R1 — Resistor<br>UG-V1-B030 · R2 — Resistor<br>UG-V1-B031 · R3 — Resistor<br>UG-V1-B032 · R4 — Resistor<br>UG-V1-B033 · R5 — Resistor<br>UG-V1-B034 · C1 — Capacitor<br>UG-V1-B035 · C2 — Capacitor<br>UG-V1-B036 · C3 — Capacitor<br>UG-V1-B037 · C4 — Capacitor | Nenhum |
| UG-V1-S09 · Visualização — OLED | UG-V1-0030 · Display OLED<br>UG-V1-B038 · Painel emissor OLED 128 × 64<br>UG-V1-B040 · Pinos VDD/GND/SCK/SDA | UG-V1-0014 · Conector OLED<br>UG-V1-B039 · Controlador SH110X |
| UG-V1-S10 · Placa-base e estrutura | UG-V1-0001 · PCB DiamondGeezer V1<br>UG-V1-0033 · Espaçadores de PCB | UG-V1-0029 · Suportes e fios de fixação<br>UG-V1-0032 · Ímã de ensaio<br>UG-V1-B041 · Face frontal da PCB<br>UG-V1-B042 · Face traseira da PCB<br>UG-V1-B043 · Trilhas de cobre<br>UG-V1-B044 · Pads / ilhas de solda<br>UG-V1-B045 · Soquetes / headers mecânicos |

## Limites visuais

O BPW34, o diamante e elementos encapsulados não têm contorno individual; ADC e controlador OLED são internos. Componentes pequenos ou encobertos, conectores sem correspondência visual inequívoca e a face traseira permanecem sem localização inventada. Fichas continuam acessíveis pela lista no subsistema e pelo inventário. Uma região distribuída (alimentação/RF) pode ter vários polígonos; espaçadores e headers mostram uma área representativa, sem prometer localizar cada unidade. A PCB estrutural é o contorno geral.

Os polígonos de módulo e suas partes podem se sobrepor; o detalhe menor aparece acima do módulo, e todas as regiões podem ser selecionadas por teclado. A fonte fotográfica limitada não permite recuperar detalhes ausentes.

## Verificação

- `npm --prefix code test` e `npm --prefix code run build`.
- `python -m unittest discover -s code/tests -p "test_*.py" -v`.
- `node code/scripts/BrowserPhotoLayersSmoke.mjs`: nenhuma camada, nove subsistemas, hover, seleção, desseleção, expansão, todos os vínculos mapeados, itens ocultos, retorno, mobile e teclado.
- `BrowserSmoke.mjs` e `BrowserSchemeSmoke.mjs`: regressões do inventário, navegação, PNGs e esquema 2D.
- `python code/scripts/lcr_naming.py --check`.

Evidência de screenshots gerada localmente em `/tmp/nv-polygon-layers/`; não constitui auditoria independente.

## Display fixo do Explorar

A rota Explorar ocupa a altura disponível sem galeria de detalhes, nota adicional ou rodapé. O viewport da fotografia absorve a roda do mouse com listener não passivo e `preventDefault`, aplicando zoom sem rolar o documento. Painéis contextuais mantêm rolagem interna; outras páginas preservam a rolagem normal. A suíte `BrowserPhotoLayersSmoke.mjs` verifica encaixe e zoom por roda em 1440×950, 390×844 e 1680×900, além da saída para o inventário.

## Revisão Builder 2 — região analógica (09/11/2026)

Quatro regiões antes sem contorno (UG-V1-B031, B034, B035, B037) passam a refletir os recortes corrigidos em ImagePresentation.json. A cobertura frontal passa de 31 para 35 componentes, sem inventar posições de elementos internos, ocultos ou traseiros.

As nove caixas da região analógica (R1–R5 e C1–C4) foram reconciliadas em LayerBComponentImagePlan.json com os recortes da apresentação. A geração de PNGs do plano é feita por LCR_LAYER_B_COMPONENT_IMAGES.yml; confirmar a geração no CI antes de declarar o asset atualizado.

A interface agora permite escolher todos os contornos frontais diretamente no modo Componentes, com opção de filtrar por subsistema. Os modos permanecem visíveis na toolbar; o dropdown associado mostra legenda e itens não mapeados. Um botão flutuante volta à placa inteira; Redefinir atua apenas no zoom/pan. Contornos são aproximações visuais, não validação CAD/KiCad ou metrológica.
