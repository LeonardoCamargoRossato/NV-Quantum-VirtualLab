# LCR_GUARDRAILS — Regras permanentes do projeto

## Finalidade e autoridade
Normas aplicáveis a Planner, Builder/Codex, Research, Drawer, Audio Designer e Quality & Security Auditor. Todo agente deve consultar este arquivo, `LCR_WORKFLOW.md` e `LCR_NAMING_CONVENTIONS.md` antes de gerar um prompt de desenvolvimento, upgrade ou hotfix. O responsável humano aprova exceções e alterações de alto impacto.

## Regras obrigatórias
1. **Estrutura imutável por padrão:** código executável em `code/`; automações GitHub em `.github/workflows/`; normas e registros em `documentation/`; imagens do aplicativo em `code/public/assets/`; decisões em `documentation/decision-archive/`; registros dos especialistas em `documentation/agents-archive/`.
2. **Inicialização sem dependências externas:** `LCR_START` estabelece apenas estrutura e documentos. Não provisionar Supabase, Google OAuth, Storage, Search Console nem publicar uma aplicação sem aprovação e autorização próprias.
3. **Arquitetura com decisão humana e agentes opcionais:** `LCR_BASIC_OPTIONS` é uma verificação interna do brainstorming, não fase separada nem instalação automática. **Research, Quality & Security Auditor, Drawer e Audio Designer são os quatro especialistas opcionais**; seus chats só são criados ou acionados quando a necessidade e a complexidade do projeto justificarem. A decisão de convocar um novo especialista deve ser registrada no Decision Archive (ADR), com contexto, justificativa e impacto. A complexidade do projeto e as decisões arquiteturais dela decorrentes também devem ser avaliadas e registradas em ADR quando relevantes.
4. **Prompt de upgrade:** declarar objetivos, escopo, caminhos afetados, critérios de aceite, testes e como preservar a arquitetura. Alterações em estrutura, serviços ou permissões exigem ADR e aprovação.
5. **Prompt de hotfix:** reproduzir problema, atuar com a menor mudança possível e verificar regressão; não usar um hotfix para realizar migrações ou redesign amplo sem solicitação.
6. **Nomenclatura:** aplicar `LCR_NAMING_CONVENTIONS.md`. Executar `python code/scripts/lcr_naming.py --check` no início do projeto, ao concluir o `LCR_DAY` quando houver execução autorizada, e em CI recorrente.
7. **Privacidade:** não gravar tokens, senhas, secrets, service_role, dados pessoais ou conversas brutas privadas no Git público. Revisar/anomizar raw antes de publicar; `.gitignore` protege registros brutos não revisados.
8. **Qualidade:** verificar código e documentação antes da entrega; distinguir claramente `proposto`, `implementado`, `testado` e `validado`. Nunca inventar testes, métricas, fontes ou resultados.
9. **Rastreabilidade e espelhamento documental:** decisões arquiteturais relevantes ficam no Decision Archive (ADR), e registros de chats no Agents Archive. **GitHub é a fonte principal da estrutura e dos arquivos do projeto**; o **Google Drive atua como backup datado e espelho documental navegável**, reproduzindo, sempre que viável e permitido, a hierarquia de pastas e arquivos do GitHub para facilitar localização, auditoria, rastreabilidade e comparação entre os dois ambientes. Divergências devem ser identificadas, datadas e reconciliadas com base no GitHub, sem substituir silenciosamente registros históricos. Na inicialização do projeto, preservar também um **arquivo ZIP original, datado**, como marco verificável da estrutura inicial. O espelhamento e a geração do ZIP são requisitos do protocolo e só devem ser declarados executados após confirmação das respectivas operações.
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

## Protocolo permanente de prompts
Qualquer prompt para o Builder/Codex é elaborado pelo Planner com `LCR_PROMPT_GENERATOR` quando disponível, usando somente **desenvolvimento/upgrade** (`DevelopmentPrompt.md`) ou **hotfix adaptativo** (`HotfixPrompt.md`). O formato deve ser auditável e proporcional ao escopo, respeitar aprovação humana, guardrails, arquivos existentes e nomes oficiais. Nenhuma instrução pode afirmar execução, deploy, revisão ou commit que ainda não ocorreu. O destinatário escolhido pelo usuário prevalece; pedir “faça o prompt” não autoriza executá-lo.

## Avaliação obrigatória de ADR em desenvolvimento
Na geração de cada prompt de desenvolvimento/upgrade, avaliar se há **decisão arquitetural significativa nova**, sem criar ADR automático para mudanças meramente extensas. Aplicar `documentation/decision-archive/LCR_ADR_GUARDRAILS.md` e o template único `AdrTemplate.md`. Se necessário, entregar prompt e ADR como **dois arquivos Markdown** (ou conteúdos separados quando não houver ferramenta de criação). Não duplicar decisões existentes, inventar histórico inacessível ou exigir novamente aprovação humana já explicitamente dada no brainstorming. Hotfix comum não exige ADR; hotfix que implica mudança arquitetural deve ser reclassificado ou discutido.

## Registro automático de ADRs e espelhamento
Em **decisões reais** documentadas pelo Planner, o procedimento padrão é registrar o ADR no GitHub e, na mesma conversa, replicá-lo na pasta correspondente do Drive, após verificar ferramentas e permissões. A instrução para registrar não autoriza implementar código nem publicar dados sensíveis. Na ausência de integração de escrita, fornecer arquivo e estado `pendente`, sem fingir commit ou cópia. O espelhamento GitHub Actions fora do chat depende de credenciais Google específicas, independentemente do plugin do ChatGPT.
