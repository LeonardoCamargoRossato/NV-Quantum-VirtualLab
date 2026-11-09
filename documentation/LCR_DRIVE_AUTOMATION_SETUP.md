# LCR_DRIVE_AUTOMATION_SETUP — Espelhamento independente do ChatGPT

## Duas formas complementares

1. **No Planner, durante uma conversa:** registrar ADRs reais no GitHub; o Drive os receberá apenas no ciclo diário centralizado, sem uploads por arquivo. Não depende de GitHub Actions; **não é processo contínuo nem garantia de acionamento de ferramentas**.
2. **No GitHub Actions, sem chat:** `.github/workflows/LCR_BACKUP.yml` verifica `LCR_DRIVE_BACKUP_ENABLED`. Quando habilitado, espelha os arquivos do repositório e mantém snapshots Git em pasta datada do Drive. O token do plugin ChatGPT **não é repassado** ao GitHub Actions.

## Configuração uma vez, por repositório GitHub
Em **Settings → Secrets and variables → Actions**:
- Variable `LCR_DRIVE_BACKUP_ENABLED` = `true`.
- Variable `LCR_DRIVE_FOLDER_ID` = ID da pasta **do projeto específico** no Drive.
- Repository secret `LCR_DRIVE_OAUTH_TOKEN` = JSON do campo **token** do remote Google Drive no `rclone.conf`, com `refresh_token` e acesso de escrita autorizado. Não é o token do plugin ChatGPT.
- Repository secret `LCR_DRIVE_CLIENT_ID` = OAuth Client ID da aplicação **Desktop app** criada no Google Cloud para o rclone.
- Repository secret `LCR_DRIVE_CLIENT_SECRET` = OAuth Client Secret da mesma aplicação.
- Em 2026, o Client ID compartilhado do rclone está em descontinuação; por isso o workflow exige credenciais OAuth próprias. Tutorial oficial: https://rclone.org/drive/#making-your-own-client-id .
- No Linux Mint: instale `rclone`, execute `rclone config` e crie um remote do tipo **Google Drive**, usando seu Client ID e Secret, autorizando pelo navegador. Verifique com `rclone lsf NOME_DO_REMOTE:` antes de copiar o conteúdo do campo `token` para o GitHub Secret. Localize o arquivo com `rclone config file` — normalmente `~/.config/rclone/rclone.conf`. **Não compartilhe nem publique seu token, Client Secret ou o arquivo rclone.conf.**

Valide a configuração de escopos e a autorização no Google; os tokens devem pertencer a uma conta com acesso de escrita à pasta de destino. O uso de conexão Google Drive no ChatGPT não substitui esse token.

## Operação
- Executar **automaticamente às 23h55 Brasília**; **Actions → LCR Backup → Run workflow** fica reservado para exceção autorizada. Não disparar em push.
- Estrutura no Drive sob a pasta configurada: `<nome-do-repositório>/repository/` (espelho navegável, sem exclusão automática) e `<nome-do-repositório>/snapshots/YYYY-MM-DD/` (`repository_snapshot.zip`, `repository_history.bundle`).
- A ação **não** acessa histórico privado de chats ChatGPT; documentos de sessão só entram após gravação autorizada no GitHub.
- Antes de declarar "sincronizado", confirmar no Drive a existência do ADR/registro e os logs do job. Falhas devem ser reportadas e posteriormente reconciliadas.
- **Limite técnico:** o espelhamento via Actions não utiliza o plugin do ChatGPT; depende de segredo/variáveis configurados pelo titular. A existência de `LCR_BACKUP.yml` por si só não ativa nada.

## Substituição pelo backup central
Para novos projetos **públicos**, não repetir os passos acima; este repositório controlador já tem as credenciais. Só instalar `LCR_START` para que seja descoberto no backup central. Consulte `LCR_CENTRAL_BACKUP.md`.

## Política de backup ao final do dia (ADR-0009)
**GitHub é a fonte de verdade e o histórico contínuo. Google Drive recebe uma única rodada automática diária**: 23h55 Brasília (02h55 UTC do dia seguinte), via `LCR_BACKUP.yml`, ou `workflow_dispatch` excepcional autorizado. Não realizar upload por arquivo, ADR, relatório ou push durante o desenvolvimento. O `rclone copy` atualiza incrementalmente o espelho navegável e salva ZIP + `git bundle` por data/commit; **não apagar históricos sem política de retenção aprovada**. Status Drive é **pendente** até verificar job `success`, SHA e snapshot. OAuth do GitHub Actions é independente do plugin Drive deste chat. Em 09/11/2026, a última falha observada foi HTTP 401; não declarar corrigida sem novo teste.
