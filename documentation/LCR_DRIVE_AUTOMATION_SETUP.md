# LCR_DRIVE_AUTOMATION_SETUP — Espelhamento independente do ChatGPT

## Duas formas complementares

1. **No Planner, durante uma conversa:** skills LCR atualizadas orientam o agente com acesso autorizado aos plugins GitHub e Google Drive a salvar ADRs reais no GitHub e espelhar na pasta Drive do mesmo projeto. Não depende de GitHub Actions; **não é processo contínuo nem garantia de acionamento de ferramentas**.
2. **No GitHub Actions, sem chat:** `.github/workflows/LCR_BACKUP.yml` verifica `LCR_DRIVE_BACKUP_ENABLED`. Quando habilitado, espelha os arquivos do repositório e mantém snapshots Git em pasta datada do Drive. O token do plugin ChatGPT **não é repassado** ao GitHub Actions.

## Configuração uma vez, por repositório GitHub
Em **Settings → Secrets and variables → Actions**:
- Variable `LCR_DRIVE_BACKUP_ENABLED` = `true`.
- Variable `LCR_DRIVE_FOLDER_ID` = ID da pasta **do projeto específico** no Drive.
- Repository secret `LCR_DRIVE_OAUTH_TOKEN` = JSON de token OAuth do Google Drive **gerado para o rclone com acesso autorizado** (de preferência escopos mínimos e token de atualização válido). Nunca coloque no Git ou em um prompt público.

Valide a configuração de escopos e a autorização no Google; os tokens devem pertencer a uma conta com acesso de escrita à pasta de destino. O uso de conexão Google Drive no ChatGPT não substitui esse token.

## Operação
- Iniciar manualmente em **Actions → LCR Backup → Run workflow** e conferir status/logs. Também pode executar em mudanças relevantes de `documentation/`, nas skills e diariamente.
- Estrutura no Drive sob a pasta configurada: `<nome-do-repositório>/repository/` (espelho navegável, sem exclusão automática) e `<nome-do-repositório>/snapshots/YYYY-MM-DD/` (`repository_snapshot.zip`, `repository_history.bundle`).
- A ação **não** acessa histórico privado de chats ChatGPT; documentos de sessão só entram após gravação autorizada no GitHub.
- Antes de declarar "sincronizado", confirmar no Drive a existência do ADR/registro e os logs do job. Falhas devem ser reportadas e posteriormente reconciliadas.
- **Limite técnico:** o espelhamento via Actions não utiliza o plugin do ChatGPT; depende de segredo/variáveis configurados pelo titular. A existência de `LCR_BACKUP.yml` por si só não ativa nada.
