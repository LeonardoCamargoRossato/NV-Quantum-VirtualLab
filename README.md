# NV Quantum Virtual Lab — Uncut Gem V1

**Site público:** [Abrir NV Quantum Virtual Lab](https://leonardocamargorossato.github.io/NV-Quantum-VirtualLab/) · [documentação do fluxo e dos módulos](documentation/NvLabFlowUpgrade.md) · [prompt de upgrade](documentation/prompts/NvLabFlowNavigationUpgradePrompt.md).

**Inventário original:** [Google Sheets — Uncut Gem V1](https://docs.google.com/spreadsheets/d/158OGccBdF5Hf6qdWIH2-Tmt_-gU8sO8pz3CvyTpycXU/edit?gid=1346018179#gid=1346018179).

**Ambiente científico:** navegação lateral retrátil com Explorar, Inventário, Entenda o Fluxo, Guia de montagem, Referências, Revisão Bibliográfica, Fundamentos, Artigos e Sobre o Projeto. A nova página **Entenda o Fluxo** representa sete etapas do hardware com ramos óptico e de micro-ondas em paralelo e permite abrir um painel de inspeção compartilhado ou selecionar a peça correspondente na PCB por **Ver na PCB**. As imagens reais e diagramas identificados podem ser ampliados em galeria; imagens e localização não confirmadas não são inventadas. A fotografia da montagem mantém zoom/pan e os seis hotspots; o inventário de 33 componentes preserva busca, filtros, detalhes e CSV. Consulte [guia de operação](documentation/UncutGemV1Setup.md) e [registro do upgrade](documentation/NvLabFlowUpgrade.md).

**Revisão Bibliográfica:** grupo expansível com **Artigos**, **Revisão Cientométrica** (dashboard com fontes Scopus/WoS, indicadores auditados, três equações de busca, visualização autenticada da planilha e tabela pesquisável a partir de CSV carregado localmente) e **Revisão de Patentes** (em breve). A documentação de origem está em [ScientometricReviewHotfix.md](documentation/ScientometricReviewHotfix.md). Por segurança, nenhuma linha da planilha privada foi publicada no repositório. O PDF antigo da revisão não estava na pasta consultada; foi criada uma [nova exportação PDF privada](https://drive.google.com/file/d/1pouGbfNMHSnZkp-MIDdNgP34CJXlA7aG/view) fiel ao Google Doc original, com as quatro figuras verificadas nas páginas 7, 8, 9 e 12. O visualizador aponta para essa cópia privada, e o carrossel pode mostrar as páginas originais mediante acesso Google ou seleção local. Os PNGs individuais não são publicados no GitHub.\n\n**Inventário real importado:** os 33 registros V1 da planilha mestre foram lidos por integração autorizada, sanitizados e gravados no snapshot público versionado `code/public/data/InventoryV1.json`. A planilha original permanece privada; o site exibe uma cópia estática com data de importação, sem sincronização ao vivo. Seis hotspots localizados na fotografia real usam tags estáveis da planilha. V2, 3D e simulações não estão implementados.

Fotografias e diagramas oficiais preservam créditos/licença; imagens IA existentes permanecem nos caminhos originais. O snapshot é uma cópia estática, não sincronização ao vivo. A documentação LCR anterior é preservada abaixo.

---

# NV Quantum Virtual Lab — LCR Workflow Bootstrap

## Acesso rápido ao NV Quantum Virtual Lab

1. **Site do Virtual Lab:** [NV Quantum Virtual Lab](https://leonardocamargorossato.github.io/NV-Quantum-VirtualLab/) — publicado na V0 após importação dos 33 componentes.
2. **Inventário de componentes:** [Uncut Gem — Inventário de Componentes (Google Planilhas)](https://docs.google.com/spreadsheets/d/158OGccBdF5Hf6qdWIH2-Tmt_-gU8sO8pz3CvyTpycXU/edit).

**Prioridade da V0.1:** reprodução visual **2D interativa do Uncut Gem V1** com fotos reais, ficha de componentes, montagem e referências. A **V2** permanece no inventário como documentação para evolução futura; a opção **3D** está adiada, sem compromisso de implementação.


Este repositório foi inicializado com o **esqueleto documental e de automações** do LCR Workflow. A aplicação fotográfica V0 já foi implementada em `code/src/` e publicada pelo workflow Pages; simulações ODMR e backend ainda não fazem parte desta versão.

- [Protocolo LCR](documentation/LCR_WORKFLOW.md)
- [Inicialização](documentation/LCR_START.md)
- [Comandos](documentation/BASIC_COMMANDS.md)
- [Skills](documentation/BASIC_SKILLS.md)
- [Decision Archive](documentation/decision-archive/README.md)
- [Padrão SEO detalhado](documentation/seo/LCR_SEO_STANDARD.md)

As automações ficam em `.github/workflows/`. **LCR_BACKUP** roda uma vez ao dia às 23h55 de Brasília, quando habilitado e com credenciais válidas. Upload por push e espelhamento individual por chat não são rotina; a validação exige job `success` e snapshot conferido. O arquivo `robots.txt` e o `sitemap.xml` são modelos iniciais que exigem URL real antes da publicação.
## Documentos de governança e histórico
- [Guardrails permanentes](documentation/LCR_GUARDRAILS.md)
- [Nomenclatura oficial](documentation/LCR_NAMING_CONVENTIONS.md)
- [Agents Archive](documentation/agents-archive/README.md)
- [Decision Archive (ADR)](documentation/decision-archive/README.md)

## Inicialização e verificação
- `python code/scripts/lcr_start.py --verify`: valida o template estrutural.
- `python code/scripts/lcr_start.py --target ../NovoProjeto`: copia estrutura local sem sobrescrever arquivos.
- `python code/scripts/lcr_naming.py --check`: verifica nomenclatura de arquivos rastreados pelo Git.
- `LCR_BASIC_OPTIONS`: análise de opções **durante** o brainstorming, nunca provisionamento inicial automático.

Em repositório GitHub remoto, o Planner precisa de conexão de escrita e autorização para copiar a estrutura. `LCR_START` não instala serviços, não dispara automaticamente apenas por ser digitado num chat e não publica o site.

## Skill e modelos de prompt
- [LCR Prompt Generator](.agents/skills/lcr-prompt-generator/SKILL.md)
- [Índice dos dois templates](documentation/prompt-templates/README.md)
- [Instruções para Projeto ChatGPT](documentation/LCR_CHATGPT_PROJECT_INSTRUCTIONS.md)

Ao solicitar “faça o prompt para o Builder”, o Planner pode selecionar automaticamente o modelo apropriado com acesso a estas instruções. A skill do repositório não é instalada automaticamente na conta ChatGPT.

## Integração ADR + desenvolvimento
- [LCR ADR Generator — skill](.agents/skills/lcr-adr-generator/SKILL.md)
- [Modelo de registro ADR](.agents/skills/lcr-adr-generator/templates/AdrTemplate.md)
- [Guardrails de decisão arquitetural](documentation/decision-archive/LCR_ADR_GUARDRAILS.md)

Todo prompt de desenvolvimento/upgrade recebe avaliação de necessidade de ADR. Somente decisões arquiteturais significativas geram segundo arquivo Markdown; hotfixes comuns não.

## Persistência automática e backup Drive
O Planner, ao produzir um **ADR real**, deve tentar registrar no GitHub e espelhar na pasta Drive do **projeto**, usando os conectores habilitados no turno. Isso não ocorre silenciosamente em segundo plano. Para espelhamento sem conversa aberta, configurar `.github/workflows/LCR_BACKUP.yml` conforme [guia de configuração](documentation/LCR_DRIVE_AUTOMATION_SETUP.md).

## Backup central de projetos públicos
O `LCR_BACKUP.yml` deste repositório atua como controlador e descobre novos projetos públicos com `documentation/LCR_START.md`. Reutiliza OAuth do Drive sem Secrets adicionais. Veja [guia do backup central](documentation/LCR_CENTRAL_BACKUP.md).
