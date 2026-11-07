# BASIC_COMMANDS — Comandos do LCR Workflow V0.3

Comandos são **convenções** interpretadas pelos chats que recebem estas instruções; eles não representam ações de sistema sem ferramentas conectadas.

| Comando | Comportamento esperado | Saída |
|---|---|---|
| `LCR_START` | Ler `LCR_START.md`, coletar configuração mínima, planejar bootstrap modular e executar somente passos autorizados. | Checklist / plano de setup |
| `LCR_DAY` | 1ª ocorrência marca início; toda ocorrência seguinte fecha o trecho desde o marcador anterior, registra e torna-se novo marco. | `daily_summary.md`, `raw_data.jsonl`, `data.json` |
| `LCR_STATUS` | Exibe registros existentes, módulos ativos e pendências, sem inferir atividade não registrada. | Estado da sessão/projeto |
| `LCR_AUDITORIA` | Solicita verificação de qualidade/segurança; relatório sem expor valores secretos. | Relatório do Auditor |
| `LCR_SEO` | Solicita inspeção da indexação e documentação SEO. | Diagnóstico SEO |
| `LCR_BACKUP` | Verifica a configuração e aciona backup autorizado; nunca afirma sucesso sem evidência. | Log/artefato de backup |
| `LCR_DECISAO` | Prepara um ADR com contexto, alternativas e decisão pendente de aprovação. | Arquivo em `decision-archive/` |

## Contrato do LCR_DAY
1. Localizar o marcador anterior **no histórico efetivamente acessível** do mesmo chat.
2. Se não houver marcador: criar marcador inicial, sem inventar sessão encerrada.
3. Com marcador existente: resumir somente o intervalo entre os dois marcadores.
4. Produzir 3 arquivos no papel correspondente, se houver acesso de gravação.
5. Para cada nova ocorrência, usar a anterior como início; registrar status do upload GitHub.
6. Se não houver acesso integral ao intervalo, declarar `raw_complete: false` e explicar o limite.
7. **Não enviar `raw_data.jsonl` para repositório público sem revisão de sensibilidade.** Pode manter temporariamente local/privado, e publicar só metadados e resumo sanitizados.

### `data.json` — esquema mínimo
```json
{
  "project": "NV Quantum Virtual Lab",
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

Data/hora e tokens exatos só quando verificados. Ações do GitHub Actions não conseguem ler diretamente o histórico privado do ChatGPT.