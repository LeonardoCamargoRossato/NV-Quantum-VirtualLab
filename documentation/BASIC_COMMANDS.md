# BASIC_COMMANDS — Comandos do LCR Workflow

Comandos são **convenções** interpretadas pelos chats que recebem estas instruções; eles não representam ações de sistema sem ferramentas conectadas.

| Comando | Comportamento esperado | Saída |
|---|---|---|
| `LCR_START <url>` | Criar apenas template estrutural no repositório autorizado e validar guardrails/nomes. | Pastas, arquivos e checklist de verificação |
| `LCR_DEV` | Gera prompt de desenvolvimento/upgrade e avalia ADR automaticamente; se houver nova decisão significativa, gera outro arquivo Markdown. | Prompt (+ ADR se necessário) para revisão |
| `LCR_HOTFIX` | Solicita prompt corretivo adaptativo pelo modelo único `HotfixPrompt.md`, compacto ou completo conforme complexidade. | Prompt pronto para Codex/Builder |
| `LCR_BASIC_OPTIONS` | Durante o brainstorming com Planner, comparar opções; chamar Research/Security se necessário; não instalar nada. | Proposta de opções para aprovação |
| `LCR_NAMING` | Inspecionar nomes dos caminhos versionados no Git, sem renomeação automática. | Relatório de nomes conformes ou violações |
| `LCR_DAY` | 1ª ocorrência marca início; toda ocorrência seguinte fecha o trecho desde o marcador anterior, registra e torna-se novo marco. | `daily_summary.md`, `raw_data.jsonl`, `data.json` |
| `LCR_STATUS` | Exibe registros existentes, módulos ativos e pendências, sem inferir atividade não registrada. | Estado da sessão/projeto |
| `LCR_AUDITORIA` | Verifica qualidade/conformidade/testes/build/Actions em commit estável, com recomendação de especialistas se justificável. | Relatório independente do Auditor |
| `LCR_SEO` | Solicita inspeção da indexação e documentação SEO. | Diagnóstico SEO |
| `LCR_BACKUP` | Verifica a configuração e aciona backup autorizado; nunca afirma sucesso sem evidência. | Log/artefato de backup |
| `LCR_ADR` | Avalia relevância arquitetural e gera ADR quando aplicável, seguindo `LCR_ADR_GUARDRAILS.md`. | ADR proposto/aprovado conforme evidência |
| `LCR_DECISAO` | Prepara um ADR com contexto, alternativas e decisão pendente de aprovação. | Arquivo em `decision-archive/` |

## Contrato do LCR_DAY
1. Localizar o marcador anterior **no histórico efetivamente acessível** do mesmo chat.
2. Se não houver marcador: criar marcador inicial, sem inventar sessão encerrada.
3. Com marcador existente: resumir somente o intervalo entre os dois marcadores.
4. Produzir 3 arquivos no papel correspondente sob `documentation/agents-archive/`, se houver acesso de gravação.
5. Para cada nova ocorrência, usar a anterior como início, registrar status do upload e solicitar/verificar `LCR_NAMING` com ferramenta disponível.
6. Se não houver acesso integral ao intervalo, declarar `raw_complete: false` e explicar o limite.
7. **Não enviar `raw_data.jsonl` para repositório público sem revisão de sensibilidade.** Pode manter temporariamente local/privado, e publicar só metadados e resumo sanitizados.

### `data.json` — esquema mínimo
```json
{
  "project": null,
  "agent_role": "planner",
  "date": null,
  "started_at": null,
  "closed_at": null,
  "uploaded_at": null,
  "topic": "",
  "keywords": [],
  "top_five_topics": [],
  "raw_complete": false,
  "tokens_exact": null,
  "publication_status": "pending_review",
  "source": "chat_accessible_messages"
}
```

Preencher `project` com o nome real do projeto; jamais assumir NV Quantum Virtual Lab nos templates.

Data/hora e tokens exatos só quando verificados. Ações do GitHub Actions não conseguem ler diretamente o histórico privado do ChatGPT.
## Contrato de verificação: LCR_NAMING
Qualquer agente — Planner, Builder, Research, Drawer, Audio Designer ou Quality & Security Auditor — pode solicitar `LCR_NAMING`. O script `python code/scripts/lcr_naming.py --check` examina nomes rastreados por Git e mostra o motivo de cada violação, **sem renomear** arquivos automaticamente. O job `LCR_NAMING.yml` roda no push, PR, manualmente e de forma agendada; `LCR_START.yml` e `LCR_DAILY.yml` integram essa checagem. Sem acesso de execução, o chat não deve declarar auditoria concluída.

## LCR_BASIC_OPTIONS pertence ao brainstorming
Apresente opções técnicas adequadas ao projeto; se precisar de revisão científica, patentes ou riscos elevados, consulte Research ou Quality & Security e retorne ao Planner. O humano aprova as escolhas. Nenhuma integração externa é consequência automática de `LCR_START`.

## Gerar prompts sem decorar comandos
“Faça o prompt para o Builder”, “prepare esse upgrade para o Codex” ou “faça um hotfix” ativam, quando o Planner dispõe da skill/instruções, o procedimento `LCR_PROMPT_GENERATOR`. O comando é apenas um atalho opcional. O Planner escolhe um dos **dois** templates em `.agents/skills/lcr-prompt-generator/templates/`, respeita o destinatário humano e confere guardrails e caminhos reais antes de redigir. Redigir não equivale a executar.

## Avaliação automática de ADR no LCR_DEV
Sempre examinar o último ADR relevante e o brainstorming acessível. Não gerar ADR em todo upgrade por padrão. Se houver decisão nova significativa, entregar `DevelopmentPrompt.md` e `ADR-XXXX-titulo-curto.md` como dois documentos. Caso contrário, só o prompt com justificativa de uma linha. A skill `LCR_ADR_GENERATOR` é especializada nesse julgamento; o usuário não precisa chamá-la nominalmente.

## Persistência de ADR e registros no Drive
- `LCR_ADR`/desenvolvimento com ADR real: registrar no GitHub no próprio turno; Drive apenas no ciclo diário, com estado pendente até a confirmação.
- `LCR_DAY`: quando o agente encerrar uma sessão real, tentar persistir somente `daily_summary.md` e `data.json` revisados no GitHub e Drive; `raw_data.jsonl` **não** é publicado automaticamente em repo público. O histórico de chat não é lido automaticamente pelo GitHub Actions.
- `LCR_BACKUP`: modo independente de chat, acionado pelo GitHub Actions após configuração manual de variável, pasta destino e segredo do Google; plugin Drive do ChatGPT sozinho não ativa o workflow.

## Gate de qualidade e especialistas opcionais (ADR-0008)
Fluxo aprovado: **Planner → decisão humana → Auditor geral + especialista opcional → parecer consolidado → Codex/Builder → retestes do Auditor → aprovação final humana**.

O Auditor verifica nomenclatura, conformidade, testes, build, GitHub Actions, segurança básica, SEO e documentação em commit **estável**. Pode inspecionar em paralelo ao Builder (somente leitura), mas somente emite parecer final quando a implementação terminar. Codex/Builder executa correções; o Auditor retesta independentemente. Estados: **aprovado, atenção, reprovado, não verificado**; todo achado precisa de evidência.

O Planner recomenda um especialista quando **risco alto OU (especialização alta E complexidade alta)**. **Cybersecurity**: ataques digitais, autenticação, permissões e dependências; **Safety**: danos físicos, ópticos e elétricos; **Scientific/Technical Reviewer**: modelos, unidades, incertezas e método científico. A convocação depende de autorização humana, com ADR quando necessária. Normas externas são referências conforme contexto, **não certificações automáticas**. Skill: `.agents/skills/lcr-audit-generator/SKILL.md`.

## Política de backup ao final do dia (ADR-0009)
**GitHub é a fonte de verdade e o histórico contínuo. Google Drive recebe uma única rodada automática diária**: 23h55 Brasília (02h55 UTC do dia seguinte), via `LCR_BACKUP.yml`, ou `workflow_dispatch` excepcional autorizado. Não realizar upload por arquivo, ADR, relatório ou push durante o desenvolvimento. O `rclone copy` atualiza incrementalmente o espelho navegável e salva ZIP + `git bundle` por data/commit; **não apagar históricos sem política de retenção aprovada**. Status Drive é **pendente** até verificar job `success`, SHA e snapshot. OAuth do GitHub Actions é independente do plugin Drive deste chat. Em 09/11/2026, a última falha observada foi HTTP 401; não declarar corrigida sem novo teste.
