# DevelopmentPrompt — Upgrade V0.1: identidade ITA, navegação lateral e Research Hub do NV Quantum Virtual Lab

## Identificação

- **Tipo:** desenvolvimento / upgrade de experiência existente (não hotfix isolado).
- **Destinatário:** **Builder**, conforme pedido explícito do responsável.
- **Projeto:** NV Quantum Virtual Lab.
- **Repositório:** https://github.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab
- **Aplicação publicada para verificar:** https://leonardocamargorossato.github.io/NV-Quantum-VirtualLab/
- **Data de origem do pedido:** 2026-11-08, fuso America/Sao_Paulo (minuto de execução não verificado).
- **Origem:** avaliação da V0 já publicada, capturas de tela fornecidas pelo responsável, decisões do Planner sobre Uncut Gem V1 e estrutura de pesquisa do laboratório.
- **ADR relacionado:** `documentation/decision-archive/ADR-0007-laboratorio-fotografico-v1-inventario-sheets.md`.
- **Planilha mestre (componentes V1):** https://docs.google.com/spreadsheets/d/158OGccBdF5Hf6qdWIH2-Tmt_-gU8sO8pz3CvyTpycXU/edit

## Pedido executivo — não criar uma nova landing page

**Corrija diretamente a V0 existente e preserve o que já funciona.** O site NÃO deve parecer uma landing page institucional com imagem à esquerda e card promocional à direita. Deve parecer um **ambiente de trabalho científico e didático**: navegação persistente **na lateral esquerda**, área central dominante com **fotografia interativa real do Uncut Gem V1**, exploração focada e fichas reais de peças; seções de estudo, artigos e revisão bibliográfica acessíveis pela barra lateral.

A prioridade é **fidelidade visual às peças reais**, ergonomia do laboratório e navegação simples. Não inventar hardware, posições, informações científicas, resultados experimentais ou vínculos institucionais.

## 1. Diagnóstico de problemas observados na V0

A interface atual, observada nas capturas, apresenta:

1. Cabeçalho horizontal com as abas `Explorar V1` e `Inventário`, mas **não possui menu lateral**.
2. Card à direita com texto como `UM LABORATÓRIO PARA OBSERVAR`, `O experimento começa nas conexões`, `Excitar / Detectar / Ler` — **remover integralmente do layout de Explorar**. O usuário não quer essa coluna.
3. CTA `Guia oficial V1` no canto superior direito — remover dali e reposicionar na seção própria do menu lateral (`Guia de montagem V1`).
4. Área interativa subaproveitada; fotografia está espremida pela coluna da direita e por uma introdução grande. **Dar à fotografia a maior parte da viewport.**
5. Clicar no laser, prisma, OLED ou amplificador abre, em alguns casos, a **mesma fotografia inteira da PCB** como se fosse a fotografia individual da peça. Isso é inadequado e confunde a aprendizagem.
6. O painel atual é baseado em `dialog` modal à esquerda e obscurece a foto; o usuário quer **inspector lateral integrado ao layout** com imagem deslocando/refluindo à direita, além da possibilidade de retrair e ampliar.
7. Hotspots com sinais `+` não bastam para identificação. Melhorar contraste, rótulos, seleção e feedback.
8. Paleta verde atual e marca NV genérica não representam a identidade ITA desejada. O site carece de logomarca ITA verdadeira, atribuição do autor e portfólio.
9. Ausência das áreas **Fundamentos**, **Artigos**, **Revisão Bibliográfica** e **Referências** anteriormente planejadas.

## 2. Nova arquitetura visual: menu lateral esquerdo, sem menus em cima

Substituir a navegação horizontal por **sidebar fixa/retrátil à esquerda**. No topo da sidebar, exibir:
- Marca/título `NV Quantum Virtual Lab` (manter nome do projeto, sem nome fictício).
- Logotipo oficial do ITA, em tamanho sóbrio, com origem/crédito correto.
- Controle visível de recolher/expandir menu (`aria-label` e estado persistente apenas em memória/localStorage se apropriado).

Organização de seções **por grupos discretos**, com ícones, texto legível e estado ativo:

**LABORATÓRIO**
- **Explorar V1** — vista inicial da fotografia interativa.
- **Inventário** — tabela completa V1, imagens ampliáveis, filtros e exportação CSV já existentes.
- **Guia de montagem V1** — conteúdo de montagem já referenciado, fotos/diagramas de etapas, links oficiais, alertas de segurança. O botão `Guia oficial V1` não pode continuar no topo da tela.

**ESTUDO E PESQUISA**
- **Fundamentos** — explica, com texto científico acessível e referências, o que são centros NV, excitação óptica verde, fluorescência vermelha, micro-ondas, ODMR, fotodiodo, amplificação, ESP32 e OLED; conteúdos curtos e selecionáveis. Sem simular ODMR neste upgrade.
- **Artigos** — biblioteca de publicações e documentos científicos relevantes, fichas com título, autores, ano, DOI/link, origem e tipo. Quando houver PDF livre acessível, oferecer leitura/visualização; nunca criar referências bibliográficas inexistentes.
- **Revisão Bibliográfica** — seção dedicada ao método de revisão/cienciometria, bibliografia do projeto e base relacionada NV/INS, separando claramente a revisão de doutorado de referências específicas do hardware. Exibir o que de fato estiver disponível, com origem documentada; evitar preencher estatísticas fictícias ou publicar dados privados sem permissão.
- **Referências** — **nome exato obrigatório** (NÃO `Artigos de referência`). Mostrar os projetos e recursos utilizados, com visualizações e links; ver seção 6.

No rodapé da sidebar (sempre alcançável por rolagem, inclusive quando expandida):
- **Leonardo Camargo Rossato** (grafia correta).
- Link `Portfólio` → https://leonardocamargorossato.github.io/LCR-SolutionsArchitecture-IA-Quantum/#/
- `ITA — Instituto Tecnológico de Aeronáutica` e logotipo institucional de fonte oficial.
- Frase discreta `Projeto acadêmico independente` quando necessária para **não sugerir endosso oficial do ITA**.

Com menu recolhido, manter somente coluna estreita com ícones e *tooltips* acessíveis; área central recebe o espaço liberado. **Eliminar** as abas horizontais e hero/cabeçalho de landing page repetitivo. Não criar uma segunda sidebar no lado direito.

### Esquema de layout desktop

```text
┌─────────────────────┬─────────────────────────────────────────────────────────┐
│ NV Quantum Virtual  │ Explorar V1       [⛶ Tela cheia] [zoom − / + / 100%]  │
│ Lab   [ITA]      [≪]│                                                         │
│ ─ LABORATÓRIO ─    │                                                         │
│ Explorar V1    ●    │          IMAGEM REAL INTERATIVA DA V1                   │
│ Inventário          │                  (área dominante)                       │
│ Guia V1             │                                                         │
│ ─ PESQUISA ─        │                                                         │
│ Fundamentos         │                                                         │
│ Artigos             │                                                         │
│ Revisão Bibliogr.   │                                                         │
│ Referências         │                                                         │
│                     │                                                         │
│ ─────────────────── │                                                         │
│ Leonardo C. Rossato │                                                         │
│ Portfólio / ITA     │                                                         │
└─────────────────────┴─────────────────────────────────────────────────────────┘
```

**Ao clicar num hotspot:** aparece **um inspetor adicional à esquerda da foto, imediatamente à direita da sidebar**, com os dados e o close-up individual do componente; **a foto reflow/desloca para a direita**, preservando visibilidade e zoom, em vez de um dialog opaco sobreposto cobrindo o hardware. Inspector retrátil, com opções normal/expandido/fechado. Quando o inspector é expandido, foto pode diminuir proporcionalmente; ao fechar, foto retoma área integral. Não forçar o usuário a perder a posição/zoom selecionados. No mobile, adaptar inspector para drawer com fechamento e retorno de foco acessíveis; sidebar em painel móvel.

## 3. Identidade visual inspirada no ITA

Usar **vermelho, branco, amarelo e detalhes em azul**, alinhados às cores do emblema, no lugar do verde dominante. Sugestão de tokens de aplicação, **não declarar que sejam códigos oficiais do ITA**: `--ita-red: #B91C1C`, `--ita-white: #FFFFFF`, `--ita-yellow: #F2C94C`, `--ita-blue: #173A67`, `--ink: #172033`, `--canvas: #F7F8FA`. Conferir contraste WCAG; vermelho como primária, azul para informação e seleções secundárias, amarelo para destaques pontuais, fundo predominantemente branco.

**Logotipo:** obter a **marca oficial real** e respeitar proporções/cores, sem redesenhar usando IA nem escrever uma marca inventada. Fontes institucionais para pesquisar/creditar:
- Manual/arquivos do ITA: https://www.bibl-old.ita.br/logomarca_ita.htm
- Site institucional: https://www.ita.br/
- Descrição heráldica do ITA (FAB): https://www2.fab.mil.br/incaer/index.php/heraldica-siscult/emblemas2/294-ita

Usar arquivo próprio autorizado/licitamente reutilizável; se não for possível reproduzir, manter o nome ITA e o link oficial, registrar pendência de licença em vez de falsificar marca. **Não usar o brasão como declaração de apoio formal**.

Visual: organização profissional de software acadêmico, bom espaçamento e tipografia, sem slogans genéricos, sem gradientes chamativos, sem cartõezinhos de marketing. Deixar a foto real ser protagonista.

## 4. Explorar V1: espaço, modo tela inteira e hotspots

1. Área central grande, sem card de contexto à direita, sem introdução ocupando muitas linhas. Mover legendas e créditos para uma linha compacta.
2. Suportar zoom por roda do mouse e controles; pan, redefinir zoom, coordenadas relativas corretas. **Adicionar botão de maximizar / tela cheia** da fotografia ou viewport (`Fullscreen API` com fallback modal full-viewport), visível no hover/foco e em controle discreto; tecla Esc retorna. Não é botão de captura de tela.
3. Usar fotos reais originais do **Uncut Gem V1**, especialmente `code/public/assets/official/DeviceV1.png`. Manter créditos originais Quantum Village. Se existirem outras fotos oficiais verificadas de frente/verso, disponibilizar seleção compacta, claramente identificada; não tratar renders como fotos.
4. Hotspots identificáveis: alterar símbolos mínimos para marcadores limpos e discretos, com hover mostrando **nome curto e miniatura específica quando disponível**, foco de teclado e destaque da peça selecionada. Usar cor de destaque coerente (vermelho/azul/amarelo) e evitar cobrir texto da placa. Dimensionar alvos para clique/toque; em zoom, alvos devem continuar úteis, sem ficar excessivamente grandes.
5. Mostrar contexto do item selecionado: destaque/anel sobre a região correta (sem desenhar componentes fictícios). Ideal: contorno semi-transparente da **área física real do componente**; fazer retângulo/polígono apenas após conferência visual. Persistir hotspots por coordenadas relativas da foto, vinculados à tag `UG-V1-...`, com teste de resize/zoom/pan.
6. Ao selecionar, abrir inspector lateral à esquerda e **reorganizar o layout**, não usar `showModal()` para a ficha no desktop. Retornar ao estado anterior de zoom/pan e permitir troca de hotspot sem fechar painel.
7. Não incluir módulos V2, foto da V2, 3D, simulação física/ODMR, assistente GPT ou botão `Copiar para GPT`.

## 5. Fichas dos componentes: FOTO DA PEÇA, não foto da PCB inteira

**Correção essencial obrigatória:** os componentes laser, prisma NV, ESP32, OLED, amplificador RF e os demais hotspots devem mostrar **close-up real da peça específica** quando houver uma região identificável na foto original. Não usar a foto da placa inteira como imagem principal da peça.

Fluxo de ativos:
1. Inspecionar fotografia oficial e as outras fotos do repositório QuantumVillage; identificar e documentar **bounding boxes reais** (x/y/largura/altura) para laser, prisma NV, OLED, ESP32, ADF4351 e amplificador RF quando visíveis.
2. Criar recortes de alta resolução (PNG/WebP) a partir de **fotografias reais oficiais**, com proveniência e a indicação `Recorte de fotografia oficial`; não inventar detalhe por IA/upscale enganoso. Se fotografia não tiver nitidez, registrar limite de resolução e oferecer acesso à original; o zoom não pode criar informação que não existe.
3. **Prisma:** mostrar o prisma físico identificado na foto com close-up; complementar com diagramas `Layer1/2/3.png` em galeria secundária identificada como diagrama. Se os detalhes internos estão encapsulados, não fingir que o fotodiodo é visível.
4. **OLED, laser, amplificador RF:** usar recortes ou fotografia real do mesmo modelo, de fonte verificável. **Não substituir por foto geral da montagem como se fosse a peça isolada.**
5. Quando recorte próprio não for possível, procurar foto de produto real do mesmo modelo, com fabricante/loja/fonte e direitos de reutilização verificados; caso contrário, mostrar ilustração Drawer aprovada e **selo `Imagem ilustrativa por IA`**. Se nenhuma estiver disponível, exibir placeholder honesto e a foto do conjunto apenas numa aba secundária rotulada.
6. Distinguir categorias de imagens claramente: `Fotografia oficial (recorte)`, `Foto de produto`, `Foto genérica`, `Render oficial`, `Diagrama`, `Ilustração por IA`, `Sem imagem individual confirmada`.
7. Referências do inventário mantidas: tag, nome, localização, função, modelo, notas, custo referencial, datasheet, fonte e créditos. A ficha deve manter texto selecionável e imagem clicável ampliável com zoom. Fotos menores devem ter apresentação consistente, sem esticar e sem fundos imprecisos.
8. **Não alterar a planilha mestre silenciosamente:** a aba V1 do site continua lendo o snapshot versionado derivado do Google Sheets. Quando adicionar campos de recorte local, armazenar metadados enriquecidos separados e relacionados por tag, com sincronização/atualização documentada. Não sobrescrever a `URL da imagem` canônica sem verificação e autorização. Se houver link/asset já existente do Drawer, reutilizar sem apresentá-lo como foto real.
9. Relação física: `PHOTODIODE1` é conector na PCB, mas o **BPW34** está no prisma. Respeitar isso em hotspots, close-ups e textos.

## 6. Aba `Referências` — Uncut Gem em destaque e três visualizações

O nome da aba é **Referências**, sem nomes alternativos. Ela deve centralizar todas as referências usadas no projeto e futuras linhas de estudo, **sem misturar com a lista de artigos da revisão bibliográfica**.

**Primeiro destaque — Uncut Gem (Quantum Village)**, com título, autores, descrição curta, fontes e **um bloco de visualização em três colunas lado a lado no desktop**:

**Coluna A — Artigo PDF (visualizador):**
- Artigo: **Carney, Mark; Kumaran, Victoria. _Uncut Gem - An Open-Source Hackable Quantum Sensor_.**
- PDF livre: https://arxiv.org/pdf/2509.18329
- Página do preprint: https://arxiv.org/abs/2509.18329
- Se for possível e permitido, exibir o PDF em `iframe`/PDF viewer navegável, com scroll, zoom básico e botão `Abrir PDF`. Em caso de bloqueio por `X-Frame-Options`, CSP ou CORS, usar preview verdadeiro de primeira página produzido apenas a partir de PDF acessível/autorizado, senão um cartão com dados bibliográficos e botão de acesso. Não apresentar preview inventada.

**Coluna B — Site do projeto (prévia):**
- https://quantumvillage.org/uncut-gem.html
- Tentar iframe somente se o site permitir. Muitos sites bloqueiam incorporação: implementar fallback honesto com miniatura/captura genuína e atualizada autorizada ou foto oficial do projeto com crédito, descrição curta e botão `Abrir site`. **Não inserir uma imitação visual do site.**

**Coluna C — GitHub oficial (prévia):**
- https://github.com/QuantumVillage/UncutGem
- Tentar preview de repositório via metadados públicos estáticos (nome, descrição, linguagem, link) e/ou captura real autorizada; iframe pode falhar. Nunca pedir token privado, nunca expor credenciais e nunca construir uma falsa interface de GitHub. Link `Abrir repositório`.

**Springer:** abaixo do título/visualizações, incluir identificação bibliográfica visível e link verificado para o **capítulo de conferência Springer**, DOI `10.1007/978-3-032-13852-1_7`:
https://link.springer.com/chapter/10.1007/978-3-032-13852-1_7
- Autores Mark Carney e Victoria Kumaran; publicado online em **21 fevereiro 2026**, livro **_Quantum Engineering Sciences and Technologies for Industry and Services_**, páginas **55–64**. O capítulo Springer é material de acesso por assinatura; **não hospedar nem incorporar PDF protegido como se fosse livre**. O PDF incorporado deve ser a versão aberta do **arXiv** e identificado como preprint.
- No mobile: três visualizações empilhadas ou carrossel de 3 cartões, com links de acesso sempre visíveis.

**Outras referências desta aba**, com classificação e rastreabilidade:
- **Stegemann et al. (2023),** _Modular low-cost 3D printed setup for experiments with NV centers in diamond_, _European Journal of Physics_ 44, 035402, DOI https://doi.org/10.1088/1361-6404/acbe7c — **estudo relacionado**, não BOM do Uncut Gem.
- **Frellsen e Ahmadi (2018),** _Sensing magnetic fields with diamonds and green laser light_, DOI https://doi.org/10.22331/qv-2018-07-17-10 — **referência didática**, configuração óptica distinta.
- **Quantum Village — BuildGuide V1**, hardware/PCB, DiamondMount, firmware e documentação de segurança, com links oficiais.
- **Futuras versões** apenas como referências de pesquisa: cálculo matemático/fluxo das equações, magnetometria ODMR e eventualmente visualização 3D e Uncut Gem V2; manter rótulos `Futuro — não implementado`, sem novas abas de simulação nesta entrega. Pode citar **Tsunaki et al. (2025), _Digital Twin Simulations Toolbox NV_** somente se confirmar título, autores, acesso e procedência no documento armazenado na revisão; não inventar DOI.
- Crédito e a diferenciação entre fonte oficial e elaboração independente devem permanecer visíveis.

## 7. `Artigos`, `Fundamentos` e `Revisão Bibliográfica` — telas REAIS, não placeholders genéricos

**Artigos:** catálogo de materiais inicialmente relevantes, com cartões acessíveis, identificação correta, pesquisa por título/autor e acesso ao PDF quando permitido. Começar com Uncut Gem (arXiv/Springer), Stegemann (2023), Frellsen & Ahmadi (2018) e outros arquivos realmente disponibilizados no Drive/GitHub, se a permissão de publicação permitir. Não copiar PDFs de acesso restrito para o GitHub público.

**Fundamentos:** página didática simples com fluxo: centros NV e spin → excitação óptica → micro-ondas → fluorescência/fotodetecção → TIA/ADC/OLED → leitura ODMR; explicações textuais selecionáveis, cada uma com fonte real. Evitar gráficos/simulações fictícios; futuro `Fluxo matemático` fica documentado como próxima etapa, sem implementação das equações interativas agora.

**Revisão Bibliográfica:** recuperar a separação entre referências da montagem e a revisão científica/cienciométrica que fundamenta o laboratório; disponibilizar metodologia, objetivos, critérios e referências cuja divulgação esteja aprovada. Existe uma planilha de trabalho relacionada (não assumir que é pública):
https://docs.google.com/spreadsheets/d/1ID0MHrg_-2Fx37vGR8SMhoILLs6E8WR8CnMV4mlf734/edit
Título identificado no Drive: `Doutorado ITA — Revisão NV + INS | 172 artigos analisados (Scopus + WoS)`; abas `Artigos - 172`, `Resumo e critérios`, `Artigos que preciso ler`. O título da planilha não prova que todos os registros devam ser publicados no site. **Não abrir permissão nem importar o conteúdo integral para um repositório público sem autorização explícita do proprietário.** Neste upgrade, estruturar a página com conteúdo bibliográfico público verificável, metodologia conhecida e um link à base original com aviso de acesso, sem dashboards/counts/figuras inventados. Quando a base pública autorizada estiver disponível, ampliar essa página sem reprojetar a navegação.

Se forem encontrados materiais próprios no Drive, exibir os metadados e links apenas conforme permissões; não afirmar que foram automaticamente sincronizados.

## 8. Preservar funcionalidades existentes

A implementação já existente possui `Explorar V1` e `Inventário`. Preservar:
- Inventário V1, tags `UG-V1-0001` … `UG-V1-0033` e leitura do snapshot; planilha mestre continua no Google Sheets, com data/proveniência.
- Busca, filtros, ordenação, CSV, imagem ampliável e fallback já funcionais (corrigir regressões).
- Zoom/pan e pontos verificados na foto; redesenhar os controles e layout, **não perder suas coordenadas relativas**.
- Referências oficiais, avisos de segurança laser/pinagem/energia e distanciamento entre imagens reais e ilustrativas.

**Não acrescentar:** botão de print/captura de tela, chat GPT/Gemini/RAG, botões `Perguntar ao GPT`, modo 3D, simulação física, backend/API paga, Supabase, alteração da privacidade do Sheets, render falso de componentes.

## 9. Arquivos e procedimentos técnicos reais

Repositório já contém a aplicação React + TypeScript + Vite, diferente do scaffold inicial. Confirmados nesta revisão:
- `code/src/Main.tsx` — shell e componentes da V0 (navegação horizontal, hotspots, dialogs, guias, inventário).
- `code/src/Styles.css` — paleta verde e layout atual, inclusive `.context-card`, `.lab-layout`, `dialog.component-panel`.
- `code/src/Inventory.ts` — contrato e utilitários de filtro/CSV.
- `code/public/assets/official/DeviceV1.png` — fotografia real V1; `Layer1.png`, `Layer2.png`, `Layer3.png` — diagramas oficiais.
- `code/public/data/InventoryV1.json` — snapshot de inventário V1.
- `code/package.json`, `code/vite.config.ts`, `code/src/Inventory.test.ts`, `code/scripts/BrowserSmoke.mjs`.
- `documentation/prompts/UncutGemV1DevelopmentPrompt.md`, `documentation/prompts/UncutGemV1ExecutionPrompt.md`.
- `documentation/decision-archive/ADR-0007-laboratorio-fotografico-v1-inventario-sheets.md`.

**Antes de editar**, verificar branch e estado atualizado, ler `AGENTS.md`, `documentation/LCR_WORKFLOW.md`, `documentation/LCR_GUARDRAILS.md`, `documentation/LCR_NAMING_CONVENTIONS.md`, `documentation/decision-archive/LCR_ADR_GUARDRAILS.md`. **Adaptar arquivos aos fatos atuais, não refatorar à força sem necessidade.**

Sugestão: separar sidebar/nav, photo viewer, inspector, catalog/ref cards e páginas de conteúdo em componentes React `PascalCase.tsx` para manutenção; preservar estrutura `code/`, assets em `code/public/assets/` com créditos e nomes LCR. Usar layout CSS flex/grid com colunas responsivas, não `dialog.showModal()` para o inspector desktop. Browser History/hash deve funcionar sob `/NV-Quantum-VirtualLab/` no GitHub Pages mesmo após refresh; manter URLs das abas compartilháveis.

## 10. Critérios de aceite — demonstrar funcionando

1. **Sidebar visível à esquerda**, retrátil; navegação de 7 itens exatos distribuídos em grupos; não há abas horizontais redundantes.
2. **Explorar V1 abre a foto grande na área central/direita**, sem card `O experimento começa nas conexões` nem CTA `Guia oficial V1` no topo.
3. Sidebar recolhida deixa foto significativamente maior; `Tela cheia` maximiza e Esc retorna; zoom/pan/hotspots continuam alinhados após toggle e resize.
4. Selecionar hotspot abre **inspector lateral não-modal à esquerda da fotografia**, move/reduz a viewport da foto à direita, oferece recolher, expandir e fechar sem perder zoom. Mobile suporta drawer acessível.
5. **Laser, prisma NV, ESP32, OLED e amplificador RF** têm foto/close-up **do objeto específico** quando realmente identificável. Caso foto individual não exista ou esteja desfocada, o app **não exibe foto inteira da placa como se fosse daquela peça**: rotula tipo de recurso e fornece fallback honesto. Pelo menos laser, prisma e OLED devem ser demonstrados visualmente com origem/crop validada ou limitação declarada.
6. Cores vermelho/branco/amarelo/azul estão aplicadas; marca/brasão ITA de fonte verificável com crédito, sem alteração de proporções, e sem afirmar apoio oficial.
7. Rodapé sidebar mostra `Leonardo Camargo Rossato`, portfólio correto e identificação ITA; acessível mesmo com conteúdo extenso.
8. Páginas **Fundamentos, Artigos, Revisão Bibliográfica, Referências e Guia V1** existem, têm conteúdo inicial real com fontes e não só `Em construção`.
9. **Referências** apresenta Uncut Gem em destaque com três visões lado a lado (PDF livre, site, GitHub), links que funcionam e metadados Springer/DOI. Qualquer impossibilidade técnica de iframe gera fallback útil honesto, nunca tela branca ou preview simulada.
10. Referências futuras 3D/fluxo matemático/V2 constam **apenas como roadmap**, sem implementar essas funções neste upgrade.
11. Inventário V1 continua funcional, dados corretos, CSV, filtros, zoom de imagem; não publicou conteúdo privado novo e não alterou planilha sem autorização.
12. Responsividade desktop/notebook/mobile, foco visível, acessibilidade teclado, títulos/aria corretos; sem overlay que esconda toda a foto ao selecionar uma peça.
13. Rodar **testes reais** (`npm run build`, `npm test`, `python code/scripts/lcr_naming.py --check`, smoke visual/browser desktop e mobile quando disponíveis). Registrar outputs, corrigir problemas introduzidos e discriminar falhas preexistentes.
14. Atualizar README e documentação das fontes; relatar commits, URLs, arquivos alterados, fotos recortadas com crédito/licença, itens pendentes, restrições de embeds e status real do deploy.

## 11. Entrega ao responsável

**Implementar, não apenas comentar o plano.** Não pedir confirmação para escolhas visuais já decididas; agir dentro do escopo. No fim, responder resumidamente com:
- link do site atualizado e da branch/commit/PR;
- comparação objetiva do antes/depois;
- print(s) dos estados sidebar aberta/fechada, inspector aberto e página Referências quando o ambiente permitir (prints de evidência do executor; **não adicionar botão de screenshot ao site**);
- lista de imagens individuais reais/recortes gerados e proveniência;
- testes realmente executados e seus resultados;
- bloqueios honestos de acesso a PDFs, logotipo, planilhas privadas e iframes;
- registro: `ADR avaliado: não necessário — upgrade dentro da stack React existente e do contrato de privacidade do ADR-0007; nenhuma alteração nova de backend/segurança foi aprovada`. Se o Builder descobrir decisão arquitetural **nova** indispensável (especialmente sobre publicar dados científicos privados), interromper essa parte, relatar alternativa/risco e solicitar decisão antes de executá-la.

**Regra final:** o laboratório deve parecer uma ferramenta acadêmica de engenharia e física, não um website promocional. A fotografia REAL e a capacidade de estudar cada COMPONENTE são o centro da experiência; o menu lateral organiza o restante do projeto.
