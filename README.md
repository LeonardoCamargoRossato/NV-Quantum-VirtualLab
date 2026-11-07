# NV Quantum Virtual Lab — LCR Workflow Bootstrap

Esta versão do repositório contém o **esqueleto documental e de automações** do LCR Workflow. O simulador/aplicação NV ainda precisa ser implementado em `code/src/`; a presença dos workflows **não** significa que o deploy ou integrações externas estejam ativos.

- [Protocolo LCR](documentation/LCR_WORKFLOW.md)
- [Inicialização](documentation/LCR_START.md)
- [Comandos](documentation/BASIC_COMMANDS.md)
- [Skills](documentation/BASIC_SKILLS.md)
- [Decision Archive](documentation/decision-archive/README.md)
- [Padrão SEO detalhado](documentation/seo/LCR_SEO_STANDARD.md)

As automações ficam em `.github/workflows/`. **LCR_BACKUP** permanece inativo até configurar `LCR_DRIVE_BACKUP_ENABLED` e credenciais. O arquivo `robots.txt` e o `sitemap.xml` são modelos iniciais que exigem URL real antes da publicação.