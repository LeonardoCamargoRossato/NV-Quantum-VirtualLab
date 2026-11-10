# Visualizador científico 3D — Diamond Mount V2

O menu **Explorar → Módulos e Visualização → Visualizar Prisma 3D** abre o suporte mecânico oficial do Diamond Mount Isosceles V6 associado ao Uncut Gem V2. A fotografia 2D e seu inventário seguem independentes. O modelo é uma peça CAD; não representa uma montagem V1 completa.

## Proveniência e integridade

- Origem: [QuantumVillage/UncutGem, `3D-files`](https://github.com/QuantumVillage/UncutGem/tree/main/3D-files), commit `fdc0fcb28f0962d59b279080658e2c11bf367494`.
- Licença do repositório de origem: AGPL-3.0; cópia em `code/public/assets/licenses/UncutGemLicense.txt`.
- STEP original `QVUncutGemV2DiamondMount Isosceles v6.step`, SHA-256 `f5e5accf224c8103d85d927ead55d9c5444973e29c12dca23aca62a8c883b850`.
- STL original `QVUncutGemV2DiamondMount Isosceles v6.stl`, SHA-256 `b56ccb541c0b9acad4bc99b060b73787ce462287eea2d91b9b59bf932d08635d`.
- Os arquivos foram copiados sem alteração de geometria como `DiamondMountIsoscelesV6.step` e `DiamondMountIsoscelesV6.stl` em `code/public/assets/official/v2/diamond-mount/`.
- STL binário íntegro: 80.074 triângulos e 4.003.784 bytes (84 + 50 × triângulos). Limites dos vértices: X de −14 a 13,99999; Y de −6,35 a 0; Z de −9,7644 a 20,2352. Dimensões aproximadas 28 × 6,35 × 30. STEP declara `SI_UNIT(.MILLI.,.METRE.)`; o STL não guarda unidade, mas seus limites são compatíveis com o STEP em milímetros. A interpretação em mm deve ser verificada em software CAD antes de usá-la para fabricação.

O STL é carregado diretamente. Não houve conversão GLB nem simplificação geométrica; nenhuma redução mensurável foi comprovada para justificar uma conversão nesta entrega. Three.js e o leitor STL ficam em um chunk dinâmico e só são baixados ao selecionar o modo 3D. A aparência cinza e a iluminação são escolhas de visualização, não propriedades verificadas do material. O renderer usa no máximo 1,6 pixels por pixel CSS e desenha por demanda quando os controles mudam, em vez de manter uma animação contínua. Geometria, materiais e contexto gráfico são liberados ao sair do modo.

## Relação V1 × V2

O [README oficial](https://github.com/QuantumVillage/UncutGem/blob/main/README.md) distingue V1 e V2. O [guia de montagem do diamante](https://github.com/QuantumVillage/UncutGem/blob/main/hardware/DiamondMount/README.md) descreve diamante, bloco de epóxi, antena de fio, BPW34 e filtro vermelho. O nome do CAD atribui este suporte à V2. A correspondência física e dimensional entre o suporte V2 e o conjunto óptico visto na fotografia V1 **não foi comprovada**. Portanto, o modelo 3D não é apresentado como geometria da V1.

## Verificação

`BrowserScientific3DSmoke.mjs` cobre abertura, carregamento, giro/zoom/pan com mouse, vistas, modos, botões, tela cheia, retorno ao 2D e alternância repetida em 1366×768, 1920×1080 e 390×844, além do fallback sem WebGL. No preview local automatizado, o tempo entre a seleção e o modelo pronto foi 816 ms, 1.086 ms e 795 ms nesses tamanhos, respectivamente. Esses valores não medem a rede pública nem FPS; a meta de 60 FPS e o desempenho em aparelhos reais requerem reteste independente em hardware representativo.
