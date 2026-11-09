# ADR-0009 — Backup central diário ao Google Drive

- **Data:** 2026-11-09
- **Status:** aprovado
- **Responsável:** responsável humano do LCR Workflow
- **Decisão relacionada:** ADR-0006 (backup central)
- **Confiança:** alta na política; status operacional depende de OAuth válido
- **Origem:** decisão explícita nesta conversa para não espelhar arquivo por arquivo e realizar backup ao final do dia.

## Contexto
O GitHub tem versionamento contínuo. A duplicação de uploads Drive por arquivo/push traz operações redundantes e possível latência (sem medição causal). Em 09/11 o backup via Actions falhou com erro Google HTTP 401.

## Alternativas
| Opção | Benefícios | Riscos |
|---|---|---|
| A. Upload por arquivo/push | Cópia imediata | Operações excessivas e versões intermediárias |
| B. Backup diário incremental + snapshot ZIP/bundle | Eficiente, rastreável | Janela de recuperação até ~1 dia; dependência OAuth |
| C. Somente GitHub | Simples | Sem cópia externa |

## Decisão
Adotar **B**. O `LCR_BACKUP.yml` terá só `schedule: 55 2 * * *` (02h55 UTC, correspondente a **23h55 de Brasília do dia civil anterior**) e `workflow_dispatch` manual excepcional; remover o trigger `push`. GitHub continua fonte mestra; `rclone copy` espelha incrementalmente arquivos atuais sem exclusões; ZIP e bundle são mantidos por dia/commit. ADRs e registros de chat aprovados são salvos imediatamente no GitHub e entram no Drive no ciclo diário.

## Consequências e acompanhamento
Economia de operações, desacoplamento do Builder e menor inconsistência intermediária. Snapshots completos crescem com o tempo; **não implementar exclusão sem aprovação**, estudar retenção futura. Cron pode atrasar. Status Drive permanece pendente até um job `success` e arquivos confirmados no destino. Reautorizar OAuth do Actions (erro 401 de 09/11), testar snapshot e restauração.

## Evidências
- [Backup de 08/11, sucesso](https://github.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/actions/runs/42512005943)
- [Backup de 09/11, erro 401](https://github.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/actions/runs/42619801673)
- `documentation/LCR_CENTRAL_BACKUP.md`, `.github/workflows/LCR_BACKUP.yml`.
