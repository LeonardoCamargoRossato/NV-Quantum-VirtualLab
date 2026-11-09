# Recursos oficiais Uncut Gem V1

Autor/projeto: Quantum Village / QuantumVillage/UncutGem.
Fonte: https://github.com/QuantumVillage/UncutGem/tree/fdc0fcb28f0962d59b279080658e2c11bf367494

Cópias sem edição de conteúdo:
- DeviceV1.png: BuildGuide/images/device-v1.png — fotografia da montagem V1, identificada como Completed V1 board no BuildGuide/BuildGuide.md.
- Layer1.png, Layer2.png, Layer3.png: hardware/DiamondMount/images/layer1.png, layer2.png, layer3.png — diagramas ilustrativos oficiais, fora de escala; não são fotografias.

O README upstream declara licença Affero GPL; a licença completa AGPL-3.0 acompanha os arquivos em ../licenses/UncutGemLicense.txt. Recursos mantêm a licença de origem, créditos e links. Sem garantia. Fontes originais e arquivos modificáveis estão disponíveis no repositório upstream e nesta cópia pública. O código independente da interface é consultável no link Código-fonte do site. Recursos IA do Drawer preexistentes não são imagens oficiais e não são usados na fotografia principal.

## Recortes visuais V0.2 — preservação e melhoria conservadora

A fotografia oficial `DeviceV1.png` é usada sem alteração no mapa interativo de hotspots.
Os seis recortes associados a tags (PCB, ESP32, RF, laser, prisma e OLED) utilizam PNGs
tratados por interpolação LANCZOS 2×, pequenos ajustes de contraste e nitidez, **sem IA
generativa**. Quatro regiões adicionais aparecem na galeria, com identificação
descritiva provisória e sem inferir pinagem ou modelo.

Os PNGs, ZIP e manifesto estão em `code/public/assets/official/v1/enhanced/`,
e o script reproduzível em `code/scripts/enhance_uncut_gem_v1.py`.
Crédito e licença: Quantum Village / Uncut Gem, AGPL-3.0; os originais foram
preservados. A interpolação **não recupera detalhes invisíveis** no original.
BPW34 está encapsulado no prisma; `PHOTODIODE1` é um conector, não um fotodiodo exposto.
