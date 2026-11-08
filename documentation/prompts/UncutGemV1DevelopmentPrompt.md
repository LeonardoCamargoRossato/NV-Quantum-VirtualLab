# DevelopmentPrompt — NV Quantum Virtual Lab V0 | Uncut Gem V1

## Identificação

- **Tipo:** desenvolvimento inicial (V0), não hotfix.
- **Destinatário:** Codex (Builder principal).
- **Projeto:** NV Quantum Virtual Lab.
- **Repositório:** https://github.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab
- **Planilha canônica:** https://docs.google.com/spreadsheets/d/158OGccBdF5Hf6qdWIH2-Tmt_-gU8sO8pz3CvyTpycXU/edit
- **Data:** 2026-11-08 (horário e minuto não verificados).
- **Origem:** decisões explícitas do responsável no brainstorming do projeto em 08/11/2026: priorizar Uncut Gem V1, interface 2D simples e fotográfica, inventário mestre no Google Sheets, e adiar V2, 3D e simulações.
- **Decisão relacionada:** `documentation/decision-archive/ADR-0007-laboratorio-fotografico-v1-inventario-sheets.md` — consultar status antes de implementar.

## Objetivo e resultado esperado

**IMPLEMENTAR a V0 utilizável do aplicativo, não apenas gerar mockups, capturas ou um planejamento.** Criar um laboratório didático 2D centrado nas **imagens REAIS do hardware Uncut Gem V1**, permitindo inspecionar a placa/montagem com zoom, selecionar componentes por áreas interativas verificadas, ler fichas em um painel lateral retrátil e navegar em uma aba **Inventário**, que apresenta em HTML responsivo os dados do Google Planilhas com busca, filtros, imagens ampliáveis e exportação CSV.

O propósito é ajudar um físico que está aprendendo eletrônica a reconhecer fisicamente cada peça e entender conexões e montagem antes de construir o magnetômetro. **A precisão da aparência e da localização das peças é mais importante que decoração.**

## Contexto REAL verificado antes deste prompt

1. O repositório existe, mas no momento da elaboração contém essencialmente o esqueleto LCR; `code/src/.gitkeep`, `code/public/assets/images/.gitkeep`, `code/tests/` e os workflows existem. **A aplicação React e o deploy NÃO estavam implementados/confirmados**; verificar novamente no início.
2. O inventário Google Sheets existe, com abas `Uncut Gem V1` (33 registros), `Uncut Gem V2` (56 registros), `Galeria de imagens` e `Leia-me`. A planilha mostrou permissão de proprietário e **não está compartilhada publicamente** no momento da elaboração. **NÃO assumir acesso livre por fetch público ou Google Sheets API no navegador.**
3. O inventário V1 contém colunas, nesta ordem: `Tag única`, `Imagem`, `Componente`, `Ref. PCB`, `Subsistema`, `Qtde`, `Modelo / valor`, `Função / descrição`, `Localização / montagem`, `Preço BR (referência histórica)`, `Tipo de imagem`, `URL da imagem`, `Fonte técnica`, `Datasheet`, `Pendências / compatibilidade`.
4. As tags V1 atuais vão de `UG-V1-0001` a `UG-V1-0033`. Tratá-las como identificadores estáveis e **não usar índice de linha como chave**.
5. Parte das células `Imagem` usa `IMAGE(...)` do Google Sheets e pode apresentar erro `#REF!` por autorização de imagens externas. **O campo canônico para resolver imagem no site é `URL da imagem`, complementado pelo campo `Tipo de imagem`.** Nunca inferir que uma foto representa a peça exata se é foto do conjunto, render, IA ou imagem genérica.
6. O repo oficial é https://github.com/QuantumVillage/UncutGem — **não confundir V1 com a BOM integrada V2**; versões têm diferenças materiais de placa, componentes e mecânica. O manual do projeto no Drive é estudo acadêmico independente, não documento oficial da Quantum Village.
7. Existe um fluxo LCR de prompts e ADR; este texto foi estruturado segundo `.agents/skills/lcr-prompt-generator/templates/DevelopmentPrompt.md`. O arquivo de ADR registra apenas decisões, não implementa a aplicação.

## Escopo APROVADO — telas e experiência mínima

### A. Navegação limpa
- Páginas/abas visíveis: **Explorar V1** (tela inicial) e **Inventário**. Links para fontes oficiais, manual, GitHub e planilha em local discreto (rodapé ou menu simples). Sem painel cheio de botões.
- Design contemporâneo científico, limpo, claro, bom contraste, poucas cores, sem inventar logotipos de instituição. Desktop prioritário, mobile funcional.
- Sem tela V2 funcional na V0. Na aba Inventário pode haver marcador `V2 — futura` sem simular montagem.
- Não implementar chat, Gemini, GPT, RAG, botão “Copiar para GPT”, captura de tela, screenshot, APIs pagas, autenticação, Supabase, backend Python, simulação ODMR, animações físicas inventadas, modo 3D, seletor 2D/3D ou instrumentação real.

### B. Explorar V1 — fotografia verdadeira em destaque
- A área principal da tela deve mostrar **fotografia oficial real do conjunto V1**, com zoom via scroll/controles discretos e pan/deslocamento por mouse/touch; permitir `redefinir zoom`. Providenciar frente e verso quando existir uma foto compatível e identificada, mantendo enquadramento correto.
- Referências primárias verificadas de imagens:
  - `https://github.com/QuantumVillage/UncutGem/blob/main/BuildGuide/images/device-v1.png` (montagem real V1);
  - `https://github.com/QuantumVillage/UncutGem/tree/main/hardware/PCB/images` (renders oficiais `DiamondGeezer-1.png` e `DiamondGeezer-2.png`, **não fotografias**);
  - `https://github.com/QuantumVillage/UncutGem/tree/main/hardware/DiamondMount/images` (`layer1.png`, `layer2.png`, `layer3.png`, diagramas de montagem e `decapsulating.png`);
  - `https://quantumvillage.org/uncut-gem.html` (confirmar disponibilidade e versões de fotografias adicionais).
- Verificar a licença de cada recurso e a possibilidade de redistribuição antes de copiar para `code/public/assets/`; preservar créditos e links de origem. Preferir recursos oficiais estáveis; se licença ou fonte impedir cópia, usar URL autorizada com fallback documentado.
- **Hotspots sobrepostos apenas em locais realmente identificados na foto daquela revisão.** Coordenadas relativas à imagem, escaláveis com zoom e pan; armazenar mapeamento em dados versionados, cada hotspot vinculado a uma `Tag única` da planilha. Não colocar 33 hotspots arbitrários ou presumir que todos os componentes estão visíveis.
- Priorizar pontos com correspondência confiável (ESP32, OLED, gerador RF, amplificador RF, PCB, conexões claramente visíveis). Componentes não identificáveis na fotografia continuam localizáveis por busca e inventário, com status “não localizado visualmente”.
- **Fotodiodo BPW34:** na V1, o BPW34 faz parte do conjunto óptico do prisma encapsulado; `PHOTODIODE1` é seu conector na placa. NÃO colocar um fotodiodo fictício diretamente na PCB. Um clique no conector pode abrir explicação e link ao item BPW34 no inventário.
- Mostrar nome/mini ficha ao passar mouse ou focar por teclado; clique abre o painel esquerdo com foco acessível e indicação da peça selecionada.

### C. Painel lateral esquerdo de componente
- Painel retrátil e expansível, sem bloquear permanentemente a imagem. Estados: fechado, aberto normal, expandido; suporte mobile como drawer/modal bem dimensionado.
- Exibir, a partir dos campos do inventário: tag única, foto/ilustração com rótulo de procedência, nome, referência PCB, quantidade, modelo/série/código apenas quando documentados, função em linguagem acessível, localização física, notas de montagem e compatibilidade, preço **referencial/histórico** quando disponível (sem inventar cotação atual), URL de imagem original, fonte técnica e datasheet.
- Clique na imagem abre visualização ampliada/lightbox, com zoom e retorno simples; links abrem a fonte/datasheet em outra aba de modo seguro.
- Texto HTML normal, selecionável pelo mouse/Ctrl+C. **Não adicionar botões especiais para perguntar ao GPT ou capturar tela.**
- Na ausência de foto individual real, usar imagem genérica/ilustração disponível **com selo textual claro** (ex.: “ilustração por IA”, “foto genérica”, “foto do conjunto”, “render oficial”, “sem imagem validada”). Não confundir produto genérico com modelo exato.

### D. Aba Inventário — prioridade da V0
- Transformar o inventário em uma **tabela HTML rica**, mais legível que Sheets: linhas alternadas, cabeçalho fixo, responsividade, categorias, imagens nítidas, busca instantânea por tag/nome/modelo, filtros por subsistema e tipo de imagem, opção de expandir detalhes, ordenação simples e contador dos itens filtrados.
- Colunas iniciais essenciais: **tag**, **imagem (miniatura clicável)**, **componente**, **ref. PCB**, **subsistema**, **quantidade**, **modelo/valor**, **função**; informações adicionais disponíveis ao expandir linha ou abrir ficha. Em mobile usar cartões ou rolagem sem cortes.
- Foto em miniatura abre lightbox com zoom. Se a imagem remota falhar, usar um placeholder informativo “imagem indisponível” e link original; nunca imagem falsa silenciosa.
- Botão **Baixar CSV** de dados V1 (UTF-8 com BOM opcional para Excel BR, cabeçalhos estáveis, escape seguro de aspas/linhas), com escolha clara de exportar todos os registros ou somente os filtrados. **Não exportar fórmulas inseguras, HTML, credenciais ou dados internos.**
- Botão/link discreto “Abrir planilha original” apontando ao Google Sheets; se visitante não tiver permissão, o site permanece funcional.
- Indicar **versão da fonte, data do último snapshot validado** e se os dados vêm de cópia estática (“snapshot local”) ou sincronização comprovada; **não exibir “ao vivo” quando não houver integração funcionando**.
- Fornecer componente reutilizável de ficha para o painel do laboratório e a aba Inventário. Seleção de uma linha pode levar para “Explorar V1”, se hotspot verificado, ou permanecer na ficha se não houver localização mapeada.
- Manter os 33 registros V1 e IDs estáveis; V2 permanece apenas na planilha original, fora da implementação da primeira versão.

### E. Modo de orientação de montagem simples (sem simulação irreal)
- Permitir consultar uma sequência curta, opcional/discreta, vinculada ao **guia oficial V1**, com fotos reais e diagramas oficiais das três camadas do prisma, **claramente rotulados como diagramas**. Não é necessário drag-and-drop na V0 se a geometria fiel não estiver validada.
- Resumir de modo referenciado: placa/soquetes, módulos ESP32/ADF4351/amplificador, conexões SMA, laser, prisma com diamante NV/antena em cobre esmaltado, filtro vermelho e BPW34, OLED, alimentação e testes.
- Não desenhar componentes em posições inventadas. Fotos do conjunto e render de PCB não substituem o esquemático/footprints para indicar soldagem.
- Nota de segurança simples e visível quando pertinente: evitar exposição ocular ao laser/reflexos, não energizar montagem com curto, checar alimentação e pinagem, especialmente OLED (ordem VDD/GND) e TL082 (variante/tensão). Não apresentar o tutorial como protocolo certificado.

## Fonte da verdade e sincronização do Google Sheets — restrição crítica

**Decisão de produto:** a planilha é o cadastro mestre editável; o site é a experiência de leitura avançada. **Fato técnico observado:** a planilha está privada; não há autorização nesta V0 para torná-la pública.

Implementar fluxo **sem backend e sem expor credenciais**:
1. Manter no repositório um **snapshot versionado e sanitizado de V1** (JSON e, opcionalmente, CSV) que o site consome em tempo de execução. Sua origem deve ser explicitamente a aba `Uncut Gem V1` da planilha, não uma base paralela inventada.
2. Criar utilitário simples de importação/sincronização (preferir `code/scripts/sync_uncut_gem_inventory.py`) que aceite exportação CSV/XLSX legítima dessa aba ou leitura de Sheets autorizada em ambiente seguro/build-time. Mapear colunas por **cabeçalho**, nunca por posição rígida sem validação; validar tags únicas, campos essenciais e referências de imagem; normalizar valores sem inventar dados. Gerar manifest/snapshot e registrar proveniência/horário apenas quando executado e verificado.
3. Se o Codex tiver acesso legítimo via integração à planilha durante a implementação, importar os **33 registros V1 atuais**; se não tiver, relatar bloqueio objetivo e documentar **uma ação mínima necessária** (exportar CSV ou configurar credencial somente leitura). Não afirmar “sincronização automática” ou aprovação de integração inexistente. **Não prosseguir com um inventário fictício ou 33 placeholders sem dados reais.**
4. Permitir atualização futura a partir da planilha por comando local/CI com secret de leitura mínima **apenas se o responsável autorizar e configurar**. Nenhuma credencial Google, token pessoal, conteúdo de planilha privada ou segredo em bundle cliente/JavaScript, Git ou GitHub Pages.
5. O JSON público deve conter exclusivamente os campos do inventário explicitamente aprovados para visualização no site, **nunca dados ocultos da planilha ou metadados pessoais**. Respeitar o ato posterior de publicar dados derivados no site público; se a publicação do conteúdo não estiver autorizada/confirmada, registrar condição bloqueante para deploy sem tornar a planilha pública.
6. Fonte para imagens: coluna `URL da imagem`, preferência por `code/public/assets/` quando arquivo já publicado e licitamente reutilizável. **Não analisar a célula `IMAGE()` como arquivo binário.** As imagens do Drawer que aparecerem no GitHub poderão substituir ilustrações genéricas, mas sempre rotuladas como IA, nunca como evidência física.

## Stack, estrutura e implantação

- Preservar integralmente o LCR Workflow existente, ADRs, prompts e workflows não relacionados. Consultar **antes de modificar**: `AGENTS.md`, `documentation/LCR_WORKFLOW.md`, `documentation/LCR_GUARDRAILS.md`, `documentation/LCR_NAMING_CONVENTIONS.md`, `documentation/LCR_START.md`, `documentation/decision-archive/LCR_ADR_GUARDRAILS.md`.
- Desenvolver o aplicativo **em `code/`**. Preferência por React + TypeScript + Vite, CSS simples e dependências mínimas; como hoje há só scaffold, criar os arquivos de build/config necessários somente após inspecionar o repositório. **Não migrar/adicionar Supabase, Firebase, Google OAuth, Gemini, APIs pagas ou backend web.**
- Recursos em `code/public/assets/`; imagens do Drawer, se utilizadas, sob subpasta organizada. Pastas LCR kebab-case; componentes e artefatos personalizados PascalCase, Python snake_case e exceções de ferramentas preservadas.
- Configurar corretamente o `base` do Vite/GitHub Pages para `/NV-Quantum-VirtualLab/` e a navegação estática (evitar 404 em reload; usar abordagem compatível com Pages). Links relativos não devem quebrar após o deploy.
- Adicionar scripts de instalação, build e testes; configurar publicação GitHub Pages apenas na forma autorizada e realmente suportada pelo repositório. Não alterar configurações remotas de conta nem divulgar planilha privada sem autorização explícita. Se Pages não puder ser ativado, entregar build e passos exatos para desbloqueio.
- Atualizar `README.md` mantendo no início: **1. site real somente depois de publicado e verificado; 2. planilha/inventário original**; incluir como usar o site, como atualizar snapshot de inventário, política de imagens e status real do deploy. Não afirmar que a V0 está online até confirmar URL e HTML.
- Sem análises ODMR neste ciclo: futura fase de simulador/math flow e backend local será replanejada depois de validar a montagem 2D V1.

## Referências verificadas e ordem de confiança

- Fonte primária hardware/fotos: https://github.com/QuantumVillage/UncutGem
- Guia V1: https://github.com/QuantumVillage/UncutGem/blob/main/BuildGuide/BuildGuide.md
- PCB V1 BOM: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- Montagem do diamante: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/DiamondMount/README.md
- Firmware: https://github.com/QuantumVillage/UncutGem/blob/main/firmware/src/uncut-gem.ino
- Site: https://quantumvillage.org/uncut-gem.html
- Inventário principal V1: https://docs.google.com/spreadsheets/d/158OGccBdF5Hf6qdWIH2-Tmt_-gU8sO8pz3CvyTpycXU/edit
- Documentação acadêmica auxiliar: pasta do projeto https://drive.google.com/drive/folders/1ZjJ5__Dxd1LAYi2wU6YSDBg3Eqs3SPZk (manual de reprodução de 59 páginas; **não é manual oficial da Quantum Village**).

**Não usar** `hardware/PCB/Uncut Gem-BOM.csv` da V2 como BOM da V1; não vincular imagens V2 à V1. Não confundir diagrama educativo original, render CAD, fotografia do conjunto e fotografia isolada.

## Implementação sugerida (adapte ao repositório real)

1. Inspecionar branch, arquivos existentes, regras LCR, materiais oficiais e planilha/dados disponíveis. Criar breve matriz fontes/itens/pendências.
2. Congelar contrato de dados V1, importador, validação e snapshot comprovado; garantir que a planilha continua mestre.
3. Implementar interface estática, componentes reutilizáveis de ficha, layout responsivo e página Inventário com CSV/lightbox.
4. Integrar fotografia oficial do dispositivo, controle de zoom/pan e hotspots **verificados**; incluir link entre hotspot e tag única da planilha. Testar alinhamento do hotspot com diferentes níveis de zoom e proporções.
5. Implementar orientação visual do prisma por etapas oficiais e referências; adicionar avisos de segurança.
6. Testes, revisão da acessibilidade, build, revisão de assets/créditos, validação do CSV, auditoria LCR, README e eventual Pages.
7. Entregar relatório honesto de implementação, pendências, origem de imagens e status do acesso à planilha.

## Critérios de aceite obrigatórios

- [ ] Tela inicial mostra imagem de referência **oficial V1** identificada corretamente como foto/render/diagrama, com zoom/pan sem distorção.
- [ ] Existe pelo menos **um hotspot realmente validado** com identificação da localização (não fictício), painel esquerdo retrátil/expansível e campos corretos; outras peças acessíveis no inventário.
- [ ] A aba **Inventário** carrega os **33 registros reais V1**, tags únicas preservadas, busca/filtros funcionando, imagem ampliável e fallback de imagens ausentes; não usa linhas V2 na V1.
- [ ] Exportar CSV de V1 funciona com tag, nome, modelo, função e campos disponíveis; arquivos CSV possuem codificação e escape corretos.
- [ ] O site diferencia **foto oficial, foto genérica, render oficial, diagrama e imagem gerada por IA**. Nenhuma imagem do Drawer é apresentada como fotografia do componente original.
- [ ] Página de montagem não mostra soldagem/posicionamento inventado; BPW34 está no prisma e `PHOTODIODE1` é conector na PCB.
- [ ] Navegação teclado/foco, dispositivos móveis e links externos funcionam. Não há chat, geração de imagem no navegador, 3D, GPT, Supabase ou medição/simulação ODMR.
- [ ] O mecanismo de origem do inventário informa `snapshot`/data verdadeira. Privacidade da planilha mantida; não existem secrets na web ou repositório.
- [ ] Executar build e testes reais; executar `python code/scripts/lcr_naming.py --check` e testes LCR existentes. Registrar comandos e resultados; não declarar êxito se não executados.
- [ ] README preserva o link da planilha e adiciona link do site **somente após deploy verificado**. Atualizar arquitetura e fonte dos dados no README.
- [ ] Relatório final com commit(s), URLs reais, lista de arquivos, evidências de testes (incluindo captura de tela se o ambiente permitir, sem botão de screenshot no app), limitações e passos para sincronização futura.

## Entrega esperada do Codex

Implementar e testar no repositório autorizado. Ao terminar, responder:
1. O que foi implementado e o que ficou **não implementado**.
2. URL real do site (apenas se publicada e testada), link do GitHub, commit/PR.
3. Estado da leitura da planilha: importação efetuada? snapshot de 33 itens? como atualizá-lo? Se não, qual autorização/CSV ainda falta?
4. Lista de fotografias oficiais realmente usadas, respectivos créditos e hotspots validados.
5. Resultado de `npm run build` e testes reais, com eventuais falhas.
6. Verificação do ADR-0007 e da nomenclatura LCR; não produzir ADR duplicado de decisão já registrada.

**Regra de honestidade:** não marcar um critério de aceite como concluído sem evidência. Não usar visualização falsa para ocultar ausência de dados ou fotografia. Priorizar a experiência 2D V1 real sobre funcionalidades extras.
