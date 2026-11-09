# Hotfix — enquadramento e alinhamento das imagens V1

Data: 2026-11-09. Pedido do responsável: revisar imagem por imagem, centralizar o assunto, corrigir inclinação sem girar componentes verticais para horizontal, ajustar a foto principal e entregar na main.

## Resultado

- 79 imagens do catálogo revisadas em painéis de contato e com inspeção ampliada de casos problemáticos.
- Assunto principal centralizado em um quadro retangular com margem neutra simétrica. A orientação vertical/horizontal relativa foi preservada; sem giros de 90° por preferência estética.
- Foto principal retificada no plano da PCB, com fonte original preservada. Hotspots remapeados pela mesma transformação; não foram criados novos pontos físicos.
- Recortes do ESP32, OLED e RF alinhados pelos centros dos furos de montagem visíveis; outras correções de inclinação são pequenas e registradas. São referências visuais, não calibração metrológica.
- Corrigida a associação visual R1/R3: R1 é o resistor inferior esquerdo; R3 está acima do TL082. R2 mantém a posição superior à de R1.
- 35 enquadramentos têm dimensão nativa pequena; as fichas informam a limitação. Interpolação até 2× melhora apresentação, sem inventar resolução, texto ou detalhes. A fonte original permanece disponível.
- Diagramas e funções internas mantêm contexto/legendas e classificação; imagens ilustrativas e itens em REVISÃO continuam assim identificados.
- Galeria e imagens do Fluxo usam a mesma apresentação corrigida. Arquivos anteriores são preservados.

## Reprodução

Da raiz, com npm instalado em code e Chromium disponível:

```bash
node code/scripts/AlignInventoryImages.mjs
python code/scripts/consolidate_inventory.py
python code/scripts/consolidate_inventory.py --check
```

Fontes e coordenadas: `code/source/evidence/ImageFraming.json`. Transformações e hashes: `code/source/ImagePresentation.json`. PNGs: `code/public/assets/official/v1/presentation/`. Nenhuma imagem foi restaurada por síntese generativa; as duas ilustrações preexistentes continuam rotuladas. O XLSX e as imagens-fonte não foram modificados. Nenhuma escrita Google foi feita.

## Revisão por item

“Centrado” descreve a composição conferida e testada geometricamente, não certificação técnica da identidade de componentes. Fonte pequena significa limite do material original, não falha de carregamento.

| Tag | Item | Apresentação | Limite de resolução nativa |
|---|---|---|---|
| UG-V1-S01 | Alimentação elétrica | Centrado; inclinação +1.39° | Fonte pequena |
| UG-V1-S02 | Controle e aquisição — ESP32 | Centrado; plano esp32 | Sem limitação adicional apontada |
| UG-V1-S03 | Excitação óptica — laser | Centrado; inclinação +4.41° | Fonte pequena |
| UG-V1-S04 | Geração de micro-ondas — ADF4351 | Centrado; inclinação -1.13° | Sem limitação adicional apontada |
| UG-V1-S05 | Amplificação de micro-ondas | Centrado; plano rf | Sem limitação adicional apontada |
| UG-V1-S06 | Conexões RF e antena | Centrado | Sem limitação adicional apontada |
| UG-V1-S07 | Prisma e detecção óptica | Centrado | Sem limitação adicional apontada |
| UG-V1-S08 | Condicionamento eletrônico de sinal | Centrado | Sem limitação adicional apontada |
| UG-V1-S09 | Visualização — OLED | Centrado; plano oled | Sem limitação adicional apontada |
| UG-V1-S10 | Placa-base e estrutura | Centrado | Sem limitação adicional apontada |
| UG-V1-0031 | Fonte de alimentação protegida | Centrado; revisão técnica preservada | Sem limitação adicional apontada |
| UG-V1-0013 | Conector 5 V | Centrado | Fonte pequena |
| UG-V1-B001 | Conector USB do ESP32 | Centrado; plano esp32 | Fonte pequena |
| UG-V1-B002 | Capacitor C5 | Centrado | Fonte pequena |
| UG-V1-B003 | Capacitor C6 | Centrado | Fonte pequena |
| UG-V1-B004 | Capacitor C7 | Centrado | Fonte pequena |
| UG-V1-B005 | Capacitor C8 | Centrado | Fonte pequena |
| UG-V1-B006 | Capacitor C9 | Centrado | Fonte pequena |
| UG-V1-B007 | Capacitor C10 | Centrado | Fonte pequena |
| UG-V1-0004 | ESP32 DOIT DevKit V1 | Centrado; plano esp32 | Sem limitação adicional apontada |
| UG-V1-B008 | Módulo metálico ESP32 | Centrado; plano esp32 | Sem limitação adicional apontada |
| UG-V1-B009 | Botão EN | Centrado; plano esp32 | Fonte pequena |
| UG-V1-B010 | Botão BOOT | Centrado; plano esp32 | Fonte pequena |
| UG-V1-B011 | LEDs do DevKit | Centrado; plano esp32 | Fonte pequena |
| UG-V1-B012 | Fileiras de pinos / headers | Centrado; plano esp32 | Sem limitação adicional apontada |
| UG-V1-B013 | Conversor USB–serial | Centrado; plano esp32 | Fonte pequena |
| UG-V1-B014 | ADC interno do ESP32 | Centrado; plano esp32; função interna / hospedeiro | Sem limitação adicional apontada |
| UG-V1-0022 | Laser verde | Centrado; inclinação +4.41° | Fonte pequena |
| UG-V1-B015 | Driver / placa do laser | Centrado; inclinação +4.41° | Fonte pequena |
| UG-V1-B016 | Fios de alimentação do laser | Centrado | Sem limitação adicional apontada |
| UG-V1-B017 | Suporte e alinhamento do laser | Centrado; inclinação +4.41° | Sem limitação adicional apontada |
| UG-V1-0018 | Placa geradora RF ADF4351 | Centrado; inclinação -1.13° | Sem limitação adicional apontada |
| UG-V1-0017 | Conector gerador RF | Centrado | Fonte pequena |
| UG-V1-B018 | Circuito sintetizador ADF4351 | Centrado; inclinação -1.13° | Sem limitação adicional apontada |
| UG-V1-B019 | Pinos de comando SPI/LE | Centrado; inclinação -1.13° | Sem limitação adicional apontada |
| UG-V1-B020 | Saída RF do ADF4351 | Centrado; inclinação -1.13° | Sem limitação adicional apontada |
| UG-V1-0019 | Amplificador RF 40 dB | Centrado; plano rf | Sem limitação adicional apontada |
| UG-V1-B021 | Circuito ativo do amplificador RF | Centrado; plano rf | Sem limitação adicional apontada |
| UG-V1-B022 | Conector SMA de entrada RF | Centrado; plano rf | Fonte pequena |
| UG-V1-B023 | Conector SMA de saída RF | Centrado; plano rf | Fonte pequena |
| UG-V1-B024 | Fios de alimentação do módulo RF | Centrado | Sem limitação adicional apontada |
| UG-V1-B025 | Componentes SMD do módulo RF | Centrado; plano rf | Sem limitação adicional apontada |
| UG-V1-0020 | Cabo SMA curto | Centrado | Sem limitação adicional apontada |
| UG-V1-0021 | Antena em laço | Centrado | Sem limitação adicional apontada |
| UG-V1-B026 | Adaptadores e terminais SMA | Centrado; plano rf | Fonte pequena |
| UG-V1-B027 | Ligação do amplificador à antena | Centrado | Sem limitação adicional apontada |
| UG-V1-0023 | Conjunto do prisma NV | Centrado | Sem limitação adicional apontada |
| UG-V1-0024 | Diamante com centros NV | Centrado | Sem limitação adicional apontada |
| UG-V1-0027 | Filtro gel vermelho | Centrado | Sem limitação adicional apontada |
| UG-V1-0028 | Fotodiodo BPW34 | Centrado | Sem limitação adicional apontada |
| UG-V1-0025 | Resina transparente UV | Centrado | Sem limitação adicional apontada |
| UG-V1-0026 | Molde de silicone | Centrado | Sem limitação adicional apontada |
| UG-V1-0016 | Conector do fotodiodo | Centrado | Fonte pequena |
| UG-V1-B028 | Fios de saída do BPW34 | Centrado | Sem limitação adicional apontada |
| UG-V1-0005 | TL082 amplificador operacional | Centrado | Fonte pequena |
| UG-V1-0015 | Ponto de osciloscópio | Centrado | Fonte pequena |
| UG-V1-B029 | R1 — Resistor | Centrado | Fonte pequena |
| UG-V1-B030 | R2 — Resistor | Centrado | Fonte pequena |
| UG-V1-B031 | R3 — Resistor | Centrado | Fonte pequena |
| UG-V1-B032 | R4 — Resistor | Centrado | Fonte pequena |
| UG-V1-B033 | R5 — Resistor | Centrado | Fonte pequena |
| UG-V1-B034 | C1 — Capacitor | Centrado | Fonte pequena |
| UG-V1-B035 | C2 — Capacitor | Centrado | Fonte pequena |
| UG-V1-B036 | C3 — Capacitor | Centrado | Fonte pequena |
| UG-V1-B037 | C4 — Capacitor | Centrado | Fonte pequena |
| UG-V1-0030 | Display OLED | Centrado; plano oled | Sem limitação adicional apontada |
| UG-V1-0014 | Conector OLED | Centrado | Fonte pequena |
| UG-V1-B038 | Painel emissor OLED 128 × 64 | Centrado; plano oled | Sem limitação adicional apontada |
| UG-V1-B039 | Controlador SH110X | Centrado; plano oled; função interna / hospedeiro | Sem limitação adicional apontada |
| UG-V1-B040 | Pinos VDD/GND/SCK/SDA | Centrado; plano oled | Fonte pequena |
| UG-V1-0001 | PCB DiamondGeezer V1 | Centrado | Sem limitação adicional apontada |
| UG-V1-0033 | Espaçadores de PCB | Centrado; plano rf | Sem limitação adicional apontada |
| UG-V1-0029 | Suportes e fios de fixação | Centrado | Sem limitação adicional apontada |
| UG-V1-0032 | Ímã de ensaio | Centrado; revisão técnica preservada | Sem limitação adicional apontada |
| UG-V1-B041 | Face frontal da PCB | Centrado | Sem limitação adicional apontada |
| UG-V1-B042 | Face traseira da PCB | Centrado | Sem limitação adicional apontada |
| UG-V1-B043 | Trilhas de cobre | Centrado | Sem limitação adicional apontada |
| UG-V1-B044 | Pads / ilhas de solda | Centrado | Sem limitação adicional apontada |
| UG-V1-B045 | Soquetes / headers mecânicos | Centrado | Fonte pequena |

## Verificação

Testes de integridade de todas as fontes e saídas, centralização, geometria dos planos e remapeamento dos hotspots; suíte Python/Vitest, build e smoke desktop/mobile. Resultado local: 28 testes Python, 19 Vitest, build TypeScript/Vite e smoke Chromium desktop/mobile passaram. Nomenclatura sem violações e varredura preliminar de segredos sem alertas. Permanece o aviso de bundle JavaScript acima de 500 kB. Conclusão do deploy remoto deve ser verificada separadamente.
