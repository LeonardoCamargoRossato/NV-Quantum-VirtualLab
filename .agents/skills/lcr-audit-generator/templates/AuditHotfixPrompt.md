# AuditHotfixPrompt — Reteste de hotfix LCR
- Projeto/branch/commit estável: {{confirmar}}
- Problema corrigido: {{documentar}}
- Critérios: integridade de imports, assets, links, documentação e fluxos; ausência de regressão.
- Comandos: `python code/scripts/lcr_naming.py --check`; `python -m unittest discover -s code/tests -p 'test_*.py' -v`; `cd code && npm ci && npm test && npm run build`; smoke/CI.
- Resultado: evidências e estado `aprovado/atenção/reprovado/não verificado`, correções pendentes, SHA e parecer.
- Independência: Auditor testa e recomenda; Builder/Codex corrige.
