# BASIC_SKILLS — Biblioteca do LCR Workflow V0.3

**Skill:** procedimento reutilizável; **comando:** atalho que invoca o procedimento; **agente/chat:** papel especializado que avalia e aplica o procedimento; **ferramenta:** GitHub, Google Drive, CLI, API etc.

| Skill proposta | Responsável natural | Aplicação |
|---|---|---|
| `LCR_PROJECT_BOOTSTRAP` | Planner + Builder | Preparar estrutura padrão e escolher módulos de projeto. |
| `LCR_DAY_RECORD` | Qualquer papel | Produzir resumo, registro bruto autorizado e metadados. |
| `LCR_SEO` | Quality & Security | Validar títulos, descrições, sitemap, robots, links e acessibilidade de imagens. |
| `LCR_SECURITY_AUDIT` | Quality & Security | Inspecionar secrets, dependências, políticas RLS e exposição de dados. |
| `LCR_PROMPT_INJECTION` | Quality & Security | Testar instruções maliciosas em conteúdo de baixa confiança e produzir riscos/mitigações. |
| `LCR_FUNCTIONAL_TEST` | Builder + Quality | Testes de comportamento, builds e regressões. |
| `LCR_BACKUP` | Automação CI | Exportar snapshot Git + histórico e testar restauração. |
| `LCR_ADR` | Planner | Registrar decisões arquiteturais e consequências. |
| `LCR_AUDIO` | Audio Designer + Builder | Padronizar áudios, UX, ativação voluntária e acessibilidade. |
| `LCR_RESEARCH_REVIEW` | Research | Referências acadêmicas, bibliometria/cientometria, estado da técnica e patentes. |

Este catálogo é **documentação de skills propostas**, não um conjunto já instalado. Para torná-las executáveis, adicionar `SKILL.md` e/ou scripts compatíveis com o ambiente, testar ferramentas e conceder permissões adequadas.

Políticas comuns: nenhum segredo ou dado pessoal em repositório público; confirmar ações destrutivas, deploys e publicações; registrar fontes e distinguir `proposto`, `configurado`, `executado` e `validado`.