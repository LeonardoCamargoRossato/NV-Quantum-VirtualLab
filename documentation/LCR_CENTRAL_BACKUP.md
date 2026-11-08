# LCR_CENTRAL_BACKUP — Backup central na nuvem

O repositório NV-Quantum-VirtualLab é, inicialmente, o **controlador central** do backup. Ele usa os **mesmos cinco valores** (dois Variables e três Secrets) já configurados para o Google Drive. Não há novo OAuth nem dependência de computador local.

### Como funciona
O workflow consulta diariamente os repositórios **públicos** do mesmo proprietário e identifica aqueles que contêm o marcador `documentation/LCR_START.md`. Inclui sempre o repositório controlador. Em cada projeto, lê o GitHub sem executar o código e copia para o Drive:
- `<nome-repo>/repository/` — espelho navegável sem exclusão automática;
- `<nome-repo>/snapshots/YYYY-MM-DD/<commit>/` — ZIP do commit e histórico da branch padrão.

**Novo projeto público:** crie o repositório e rode `LCR_START` pelo Planner, instalando `documentation/LCR_START.md`. **Não copie o workflow central nem configure Google Cloud, Secrets ou Variables nesse novo projeto.** O controlador o descobrirá no próximo backup diário, ou manualmente por `Run workflow`.

**Limitações:** repositórios privados precisam de autorização adicional de leitura no GitHub; não serão incluídos automaticamente. O cron não faz backup instantâneo a cada push de outro repositório. Arquivos de conversas privadas não são acessíveis ao GitHub Actions. O espelho não apaga automaticamente arquivos removidos do GitHub. O token Google deve continuar válido; falhas de autenticação aparecerão no job. O controlador central é hospedado provisoriamente no NV Quantum Virtual Lab.
