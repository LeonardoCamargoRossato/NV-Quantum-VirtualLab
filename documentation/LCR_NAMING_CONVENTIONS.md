# LCR_NAMING_CONVENTIONS — Padrões de nomenclatura

**Princípio:** poucas regras, fáceis de memorizar, com exceções técnicas explícitas. Este documento faz parte do `LCR_START` e dos guardrails obrigatórios.

## As três convenções principais

| Tipo | Regra LCR | Exemplo |
|---|---|---|
| Pastas personalizadas | **kebab-case**, minúsculas e hífens | `agents-archive/`, `simulation-engine/` |
| Documentos institucionais e workflows LCR | **UPPER_SNAKE_CASE**, identificador conservado | `LCR_START.md`, `BASIC_COMMANDS.md`, `LCR_NAMING.yml` |
| Maioria dos arquivos personalizados (React, imagens, áudios, SVG, documentos não institucionais) | **PascalCase**, cada palavra com inicial maiúscula | `SimulationPanel.tsx`, `NvCenterDiagram.png`, `NotificationSuccess.mp3` |

## Exceção oficial — Python
Para `*.py` e `*.pyi`: **snake_case** para módulos/scripts e nomes conforme PEP 8 (ex.: `lcr_start.py`, `simulation_engine.py`, `test_lcr_naming.py`). A estrutura de código Python permanece nativa para facilitar imports, testes e colaboração. Classes Python usam PascalCase; funções e variáveis usam snake_case. Nomes como `__init__.py` são reservados.

## Nomes reservados ou exigidos
Não renomear convenções exigidas pelas ferramentas: `README.md`, `AGENTS.md`, `.gitignore`, `.github/`, `.gitkeep`, `index.html`, `robots.txt`, `sitemap.xml`, `package.json`, `tsconfig.json`, `vite.config.ts`, arquivos de lock/configuração e similares.

Contratos de registros:
- Agentes (exceto auditoria): `daily_summary.md`, `raw_data.jsonl`, `data.json`.
- Relatório GitHub automatizado: `summary.md`, `github_activity.jsonl`, `metadata.json`.
- ADR: `ADR-0001-titulo-curto.md` (identificador de decisão + título legível em kebab-case).

Em nomes de arquivos React, sufixos técnicos como `.test.tsx`, `.spec.ts` e `.module.css` são preservados; o nome personalizado anterior ao sufixo continua em PascalCase. Não renomear automaticamente arquivos importados de dependências.

## Comando de auditoria e recorrência
```bash
python code/scripts/lcr_naming.py --check
python -m unittest discover -s code/tests -p 'test_*.py' -v
```
- `LCR_NAMING`: qualquer especialista pode pedir ao agente conectado ao GitHub para executar/verificar a auditoria; sem acesso de execução, pode abrir um workflow `LCR_NAMING.yml` e inspecionar seu resultado.
- `LCR_START`: instala as regras e chama a validação inicial da estrutura/nomes.
- `LCR_DAY`: acrescenta verificação de nomenclatura ao encerramento quando houver acesso de execução; não substitui registro diário de chat.
- GitHub Actions: `LCR_NAMING.yml` roda no push, pull request, manualmente e por agendamento; `LCR_DAILY.yml` também verifica nomenclatura.
- Falhas devem produzir caminhos e motivos, sem renomeações automáticas destrutivas.

**Escopo do verificador atual:** arquivos rastreados por Git (`git ls-files`); arquivos locais não adicionados ao Git não entram na inspeção CI. A lista de exceções está no script e deve ser atualizada quando um framework realmente exigir outro nome.

## Referências orientadoras
- PEP 8, *Style Guide for Python Code* (Python.org).
- ISO 8601 para datas em registros (`YYYY-MM-DD`).
- Conventional Commits para mensagens de commit (`feat:`, `fix:`, `docs:`, etc.).
- ISO/IEC 11179-5 para princípios de nomes de metadados (não prescreve a árvore LCR).

As escolhas PascalCase e kebab-case do LCR são **convenções internas**, não uma norma ISO universal.

## Exceção para skills distribuíveis
`SKILL.md` é um nome técnico **reservado** do formato de skills, preservado independentemente de PascalCase. O diretório especial `.agents/` também é permitido; a pasta da skill segue kebab-case (`lcr-prompt-generator/`). Os modelos `DevelopmentPrompt.md` e `HotfixPrompt.md` usam PascalCase. Referenciar `documentation/prompt-templates/README.md`, que aponta para as fontes canônicas sem duplicar os modelos.
