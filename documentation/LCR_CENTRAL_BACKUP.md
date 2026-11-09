# LCR_CENTRAL_BACKUP — Backup central na nuvem

O repositório NV-Quantum-VirtualLab é, inicialmente, o **controlador central** do backup. Ele usa os **mesmos cinco valores** (dois Variables e três Secrets) já configurados para o Google Drive. Não há novo OAuth nem dependência de computador local.

### Como funciona
O workflow consulta diariamente os repositórios **públicos** do mesmo proprietário e identifica aqueles que contêm o marcador `documentation/LCR_START.md`. Inclui sempre o repositório controlador. Em cada projeto, lê o GitHub sem executar o código e copia para o Drive:
- `<nome-repo>/repository/` — espelho navegável sem exclusão automática;
- `<nome-repo>/snapshots/YYYY-MM-DD/<commit>/` — ZIP do commit e histórico da branch padrão.

**Novo projeto público:** crie o repositório e rode `LCR_START` pelo Planner, instalando `documentation/LCR_START.md`. **Não copie o workflow central nem configure Google Cloud, Secrets ou Variables nesse novo projeto.** O controlador o descobrirá no próximo backup diário, ou manualmente por `Run workflow`.

**Limitações:** repositórios privados precisam de autorização adicional de leitura no GitHub; não serão incluídos automaticamente. O cron não faz backup instantâneo a cada push de outro repositório. Arquivos de conversas privadas não são acessíveis ao GitHub Actions. O espelho não apaga automaticamente arquivos removidos do GitHub. O token Google deve continuar válido; falhas de autenticação aparecerão no job. O controlador central é hospedado provisoriamente no NV Quantum Virtual Lab.

## Política de backup ao final do dia (ADR-0009)
**GitHub é a fonte de verdade e o histórico contínuo. Google Drive recebe uma única rodada automática diária**: 23h55 Brasília (02h55 UTC do dia seguinte), via `LCR_BACKUP.yml`, ou `workflow_dispatch` excepcional autorizado. Não realizar upload por arquivo, ADR, relatório ou push durante o desenvolvimento. O `rclone copy` atualiza incrementalmente o espelho navegável e salva ZIP + `git bundle` por data/commit; **não apagar históricos sem política de retenção aprovada**. Status Drive é **pendente** até verificar job `success`, SHA e snapshot. OAuth do GitHub Actions é independente do plugin Drive deste chat. Em 09/11/2026, a última falha observada foi HTTP 401; não declarar corrigida sem novo teste.

**Retenção:** snapshots completos diários crescem com o tempo. Avaliar retenção 7 diários + 4 semanais + 12 mensais somente após decisão humana; nenhum descarte automático está autorizado.
