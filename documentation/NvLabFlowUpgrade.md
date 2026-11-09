# NV Quantum Virtual Lab — Upgrade de navegação e fluxo

## Componentes alterados
- \`code/src/StudyPages.tsx\`: menu lateral organizado e títulos de interface sem rótulos soltos de versão; Referências abre painel associado.
- \`code/src/FlowData.ts\`: sete etapas didáticas, metadados de imagem, atribuições e tags reais do inventário.
- \`code/src/FlowPage.tsx\`: fluxo vertical com ramificação óptica/RF paralela, inspeção e navegação de volta à placa.
- \`code/src/ContextInspector.tsx\`: painel global reutilizado por Explorar, Inventário, Entenda o Fluxo e Referências.
- \`code/src/Workbench.tsx\`: estado/roteamento da navegação e da inspeção, painel em reflow, link Ver na PCB e galeria com setas.
- \`code/src/Workbench.css\`: layout responsivo e apresentação científica, sem novas dependências.
- \`code/src/AboutPage.tsx\`: resumo do projeto, autoria, tese, objetivos e expansão futura.
- \`code/src/FlowData.test.ts\` e \`code/scripts/BrowserSmoke.mjs\`: validação de dados, paralelismo, galeria e correlação com a PCB.

## Fluxo físico representado
Alimentação USB protegida → ESP32/controlador → bifurcação em (laser verde e ramo ADF4351/amplificador RF/cabo/antena) → prisma contendo diamante NV → fluorescência, filtro, BPW34 → condicionamento com TL082 → ADC ESP32 → OLED.

Os ramos verde e RF **convergem em paralelo** no diamante; não se afirma que as micro-ondas são geradas pelo laser.

## Imagens, localização e limitações
- Fotografias de componentes identificáveis usam recortes reais do arquivo oficial \`DeviceV1.png\`, aprimorados por interpolação conservadora e apresentados com proveniência.
- A etapa de alimentação mostra a região do USB do ESP32; **não** apresenta uma fotografia da fonte protegida externa como se ela fosse visível.
- ADF4351 encontra-se no verso da PCB; o recorte RF é do amplificador visível na frente, **não** uma foto individual do sintetizador.
- A etapa BPW34/TL082 usa o diagrama oficial \`Layer3.png\`: o BPW34 está no prisma e \`PHOTODIODE1\` é seu conector, não a peça óptica.
- Ao ir para a PCB, componentes sem hotspot verificado abrem ficha contextual, sem marcador de localização fictício. Para BPW34, o destaque pode recair no prisma que o encapsula.
- O fluxo não contém resultados experimentais, simulação ODMR, equações ou datasets privados.

## Bibliografia e rastreabilidade
- https://github.com/QuantumVillage/UncutGem
- https://github.com/QuantumVillage/UncutGem/blob/main/BuildGuide/BuildGuide.md
- https://arxiv.org/abs/2509.18329
- https://link.springer.com/chapter/10.1007/978-3-032-13852-1_7 (acesso por assinatura, somente link).
- Inventário real preservado em \`code/public/data/InventoryV1.json\` (snapshot autorizado da aba Uncut Gem V1 do Google Sheets).
- Marca ITA exibida a partir de URL institucional, com fallback; projeto acadêmico independente, sem declaração de endosso.

## Regressões e testes
Comandos: \`cd code && npm ci && npm test && npm run build\`; \`python -m unittest discover -s code/tests -p 'test_*.py' -v\`; smoke Chromium em \`.github/workflows/LCR_INTERFACE_SMOKE.yml\`.
O workflow de Pages também valida os 11 PNGs aprimorados nos artefatos e no endereço público.

## Governança
**ADR avaliado: não necessário** — upgrade das páginas/estado visual na stack React existente. Sem nova infraestrutura, backend, permissões ou revisão das decisões do ADR-0007.
