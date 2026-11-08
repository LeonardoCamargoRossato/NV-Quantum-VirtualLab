# BASIC_SKILLS — Biblioteca do LCR Workflow

**Skill:** procedimento reutilizável; **comando:** atalho que invoca o procedimento; **agente/chat:** papel especializado que avalia e aplica o procedimento; **ferramenta:** GitHub, Google Drive, CLI, API etc.

| Skill proposta | Responsável natural | Aplicação |
|---|---|---|
| `LCR_PROMPT_GENERATOR` | Planner | Gerar prompt via dois modelos (desenvolvimento/upgrade ou hotfix adaptativo) e **avaliar automaticamente ADR** em desenvolvimento. Artefato em `.agents/skills/lcr-prompt-generator/`. |
| `LCR_ADR_GENERATOR` | Planner (+ Research/Auditor se necessário) | Decidir se ADR é relevante; quando sim, documentar alternativas, trade-offs, status, confiança e ações, seguindo Zimmermann. Artefato em `.agents/skills/lcr-adr-generator/`. |
| `LCR_PROJECT_BOOTSTRAP` | Planner + Builder | Preparar somente a estrutura, documentação e guardrails; escolhas tecnológicas ficam para o brainstorming. |
| `LCR_NAMING_AUDIT` | Qualquer especialista + GitHub Actions | Checar pastas em kebab-case, Python em snake_case e arquivos personalizados em PascalCase. |
| `LCR_BASIC_OPTIONS_REVIEW` | Planner + especialistas opcionais | Avaliar alternativas no brainstorming, sem provisionamento automático. |
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
## Normas permanentes
Antes de tarefas de desenvolvimento, upgrade ou hotfix, consultar `LCR_GUARDRAILS.md` e `LCR_NAMING_CONVENTIONS.md`. `LCR_NAMING` é auditado no start, nos ciclos daily e no GitHub Actions. Arquivos de sessões em `agents-archive/`; decisões em `decision-archive/`.

## Skill instalada no repositório versus ChatGPT
O diretório `.agents/skills/lcr-prompt-generator/` contém uma skill em formato `SKILL.md` com dois templates. Pode ser reconhecido por Codex em contextos compatíveis. Isso **não** implica instalação automática na conta ChatGPT: a plataforma requer criação/instalação conforme plano e workspace; como alternativa, aplicar o texto de `LCR_CHATGPT_PROJECT_INSTRUCTIONS.md` nas instruções do Projeto.
