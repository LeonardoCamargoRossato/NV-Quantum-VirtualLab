---
name: lcr-audit-generator
description: "Auditoria geral, auditoria corretiva e relatórios independentes do LCR Workflow."
---
# LCR Audit Generator — Quality & Security Auditor

## Templates
- `templates/AuditPrompt.md`: auditoria geral.
- `templates/AuditHotfixPrompt.md`: auditoria pontual e regressão após hotfix.
- `templates/AuditReport.md`: relatório com evidência, status, gravidade e retestes.

## Regras
1. Ler `AGENTS.md`, `documentation/LCR_GUARDRAILS.md`, `documentation/LCR_WORKFLOW.md`, `documentation/LCR_NAMING_CONVENTIONS.md` e ADR-0008.
2. Fixar repositório/commit; inspecionar naming, segurança, qualidade, testes, build, Actions, backup e normas aplicáveis. Diferenciar não verificado de aprovado.
3. Auditor pode executar testes e consultar logs, **não altera código como procedimento padrão**. Em paralelo ao Builder, somente diagnóstico; aceite após build em commit estável.
4. Recomendar especialista Cybersecurity, Safety ou Scientific quando risco alto **ou** especialização alta + complexidade alta. A convocação exige decisão humana via Planner.
5. Relatar achados, reproduções e correções ao Codex/Builder; retestar independentemente e emitir parecer `aprovado/atenção/reprovado/não verificado`.
6. Registrar relatório no GitHub; Drive apenas via backup diário ADR-0009. Não publicar segredos nem alegar certificação sem processo correspondente.
