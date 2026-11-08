# NV Quantum Virtual Lab — LCR Workflow Bootstrap

Este repositório contém o **esqueleto documental e de automações** do LCR Workflow. O simulador/aplicação NV ainda precisa ser implementado em `code/src/`; a presença dos workflows **não** significa que o deploy ou integrações externas estejam ativos.

- [Protocolo LCR](documentation/LCR_WORKFLOW.md)
- [Inicialização](documentation/LCR_START.md)
- [Comandos](documentation/BASIC_COMMANDS.md)
- [Skills](documentation/BASIC_SKILLS.md)
- [Decision Archive](documentation/decision-archive/README.md)
- [Padrão SEO detalhado](documentation/seo/LCR_SEO_STANDARD.md)

As automações ficam em `.github/workflows/`. **LCR_BACKUP** permanece inativo até configurar `LCR_DRIVE_BACKUP_ENABLED` e credenciais. O arquivo `robots.txt` e o `sitemap.xml` são modelos iniciais que exigem URL real antes da publicação.
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
