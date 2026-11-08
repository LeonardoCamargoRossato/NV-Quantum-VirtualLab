# ADR-0006 — Centralizar backups dos projetos públicos LCR

- **Data:** 2026-11-08
- **Status:** aprovado pelo responsável do projeto
- **Escopo:** GitHub Actions, Google Drive e LCR_START

## Contexto
Configurar OAuth, Secrets e variáveis separadamente em todo novo projeto é trabalhoso e inviabiliza a adoção do LCR Workflow. O usuário confirmou a expectativa de uma única configuração de backup em nuvem, reutilizada em projetos futuros.

## Alternativas e trade-offs
1. **Backup por repositório:** isolamento maior, mas repetição de credenciais, variáveis e manutenção.
2. **Backup central por marcador:** mesmo OAuth e Secrets para todos os projetos públicos iniciados com LCR_START, menor esforço operacional, mas dependência de um controlador central e cópias no ritmo do agendamento.
3. **GitHub App/infraestrutura exclusiva:** cobre potencialmente privados e eventos quase em tempo real, porém exige autorizações e manutenção adicionais.

## Decisão
Adotar inicialmente o backup central no repositório NV-Quantum-VirtualLab, mantendo as credenciais do Drive já configuradas. O workflow descobre repositórios **públicos** do mesmo proprietário que possuam `documentation/LCR_START.md`. O LCR_START instala o marcador, mas não copia o workflow central para repositórios novos. Os snapshots ficam em `<repo>/snapshots/YYYY-MM-DD/<commit>/`, e o espelho navegável em `<repo>/repository/` no Drive.

## Consequências e limitações
- Não é necessário repetir Google Cloud, OAuth, Secrets nem Variables em novos projetos públicos.
- Projetos privados precisarão de autorização GitHub específica antes de serem incluídos.
- A sincronização central é diária, não a cada commit feito em outro repositório. É possível iniciar o job manualmente.
- O espelho não apaga arquivos removidos do GitHub; a reconciliação deve considerar isso.
- A autorização OAuth pode expirar ou ser revogada; o monitoramento dos jobs continua necessário.
- O repositório NV Quantum hospeda provisoriamente o controlador e poderá ser migrado no futuro para um repositório independente.

## Evidência de validação
GitHub Actions: execução `42512005943`, concluída com sucesso em 2026-11-08, com `BACKUP_OK` para NV-Quantum-VirtualLab e snapshot correspondente criado no Drive. A inclusão automática de um segundo projeto ainda não foi validada na prática.

## Referências
- `documentation/LCR_CENTRAL_BACKUP.md`
- `.github/workflows/LCR_BACKUP.yml`
- `code/scripts/lcr_central_backup.py`
