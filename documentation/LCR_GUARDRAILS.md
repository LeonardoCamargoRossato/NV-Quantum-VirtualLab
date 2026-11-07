# LCR_GUARDRAILS — Regras permanentes do projeto

## Finalidade e autoridade
Normas aplicáveis a Planner, Builder/Codex, Research, Drawer, Audio Designer e Quality & Security Auditor. Todo agente deve consultar este arquivo, `LCR_WORKFLOW.md` e `LCR_NAMING_CONVENTIONS.md` antes de gerar um prompt de desenvolvimento, upgrade ou hotfix. O responsável humano aprova exceções e alterações de alto impacto.

## Regras obrigatórias
1. **Estrutura imutável por padrão:** código executável em `code/`; automações GitHub em `.github/workflows/`; normas e registros em `documentation/`; imagens do aplicativo em `code/public/assets/`; decisões em `documentation/decision-archive/`; registros dos especialistas em `documentation/agents-archive/`.
2. **Inicialização sem dependências externas:** `LCR_START` estabelece apenas estrutura e documentos. Não provisionar Supabase, Google OAuth, Storage, Search Console nem publicar uma aplicação sem aprovação e autorização próprias.
3. **Arquitetura com decisão humana:** `LCR_BASIC_OPTIONS` é uma verificação interna do brainstorming, não fase separada nem instalação automática. Research e Quality & Security são acionados apenas quando necessário.
4. **Prompt de upgrade:** declarar objetivos, escopo, caminhos afetados, critérios de aceite, testes e como preservar a arquitetura. Alterações em estrutura, serviços ou permissões exigem ADR e aprovação.
5. **Prompt de hotfix:** reproduzir problema, atuar com a menor mudança possível e verificar regressão; não usar um hotfix para realizar migrações ou redesign amplo sem solicitação.
6. **Nomenclatura:** aplicar `LCR_NAMING_CONVENTIONS.md`. Executar `python code/scripts/lcr_naming.py --check` no início do projeto, ao concluir o `LCR_DAY` quando houver execução autorizada, e em CI recorrente.
7. **Privacidade:** não gravar tokens, senhas, secrets, service_role, dados pessoais ou conversas brutas privadas no Git público. Revisar/anomizar raw antes de publicar; `.gitignore` protege registros brutos não revisados.
8. **Qualidade:** verificar código e documentação antes da entrega; distinguir claramente `proposto`, `implementado`, `testado` e `validado`. Nunca inventar testes, métricas, fontes ou resultados.
9. **Rastreabilidade:** decisões arquiteturais relevantes ficam no Decision Archive (ADR); relatórios de chats em Agents Archive; GitHub é a fonte principal e Drive é backup datado.
10. **Não destrutivo:** não sobrescrever, remover, mover dados ou fazer deploy de alto impacto sem justificativa, verificação e autorização humana quando aplicável.

## Aplicação por agente
- **Planner:** valida escopo, alternativas, critérios de aceite, ADR e solicita aos Builders que leiam estas regras.
- **Builder / Codex:** respeita caminhos, nomenclatura, testes e requisitos aprovados.
- **Research:** fundamenta escolhas e explicita a confiabilidade das evidências.
- **Quality & Security Auditor:** verifica aplicação dos guardrails e registra riscos, independentemente do registro diário comum.
- **Drawer / Audio Designer:** seguem política de recursos visuais/sonoros e nomenclatura.

## Exceções e fiscalização
- Nome exigido por linguagem, framework, sistema operacional ou protocolo prevalece sobre preferência estilística; registrar a exceção em `LCR_NAMING_CONVENTIONS.md`.
- Exceção arquitetural relevante: documentar ADR aprovado, sem alterar retroativamente fatos do registro.
- `AGENTS.md` resume e referencia estas normas; o arquivo Markdown sozinho **não garante** que todo chat ChatGPT o carregue automaticamente. O agente deve acessá-lo no projeto. CI automatiza apenas verificações tecnicamente verificáveis.
