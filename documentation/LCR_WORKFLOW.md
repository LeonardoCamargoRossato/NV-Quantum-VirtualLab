# LCR Workflow — Protocolo-base

**Estado:** proposta operacional em implementação; não é metodologia validada cientificamente.

## Propósito
Padronizar criação, desenvolvimento, revisão, documentação, evolução e rastreabilidade de projetos científicos e web assistidos por IA, com **orquestração humana**, poucos papéis especializados e procedimentos reproduzíveis.

## Especialistas
| Papel | Responsabilidade |
|---|---|
| Planner | Requisitos, escopo, planejamento, arquitetura e prompts para implementações. |
| Builder | Implementação: Builder Aux (hotfixes) e Codex (mudanças complexas). |
| Research | Pesquisa bibliográfica, estado da técnica, patentes, fontes e validação de fundamentos. |
| Drawer | UX/UI, diagramas e recursos visuais. Somente os registros textuais ficam em `documentation/agents-archive/drawer/`; imagens ficam em `code/public/assets/` ou storage externo. |
| Audio Designer (opcional) | Identidade sonora, efeitos, áudio e trilhas originais. Recursos em `code/public/assets/audio/`. |
| Quality & Security Auditor | Testes, auditoria de segurança, SEO, riscos, conformidade e recomendações. Relatórios independentes sob demanda. |

O **Organizador não é um chat**: é a função de consolidação documental do próprio LCR Workflow. O usuário decide prioridades, autoriza publicações e aprova decisões importantes.

## Ciclo de trabalho
Criar repositório GitHub → `LCR_START` **apenas estrutural** → brainstorming com Planner → plano aprovado → desenvolvimento iterativo (humano ↔ Planner ↔ Builder/Codex) → upgrade ou hotfix conforme a demanda. Novas dúvidas retornam ao brainstorming. Serviços externos e publicação são opcionais, separados e autorizados.

## GitHub como fonte principal
- `.github/workflows/`: automações periódicas e por evento.
- `code/src/`: aplicação e componentes.
- `code/public/assets/`: imagens, ícones e áudio; `robots.txt` e `sitemap.xml` ficam em `code/public/`.
- `code/tests/`: testes executáveis; `code/scripts/`: utilitários.
- `code/supabase/`: opcional (Auth, SQL, Storage, Edge Functions).
- `documentation/`: normas; sessões dos agentes em `agents-archive/` e decisões em `decision-archive/`. Drive é backup, não cópia mestra.

## Registros por chat (LCR_DAY)
O comando `LCR_DAY` age como marcador: 1ª ocorrência inicia intervalo; 2ª fecha e registra; ocorrências seguintes fecham o intervalo desde o marcador anterior. São produzidos, quando houver conteúdo acessível:

- `daily_summary.md`: síntese de fatos, entregas, bloqueios e próximas ações;
- `raw_data.jsonl`: mensagens originais **efetivamente acessíveis**, uma por linha, sem fingir completude;
- `data.json`: metadados (data, papel, tema central, keywords, até cinco tópicos, fonte, precisão do registro, horários somente se verificáveis).

Não alegar extração integral do ChatGPT, tokens exatos ou horários que não estejam disponíveis. Em repositórios **públicos**, **não publicar automaticamente registros brutos não revisados**: podem conter chaves, conversas privadas ou outras informações sensíveis. Para risco, manter raw privado ou publicá-lo somente após verificação/anonimização.

`Quality & Security Auditor` mantém relatórios de auditoria com estrutura própria e privilégios apropriados; não recebe automaticamente o trio diário.

## Decision Archive (ADR)
`documentation/decision-archive/` mantém registros curtos de decisões: contexto, alternativas consideradas, decisão, justificativa, consequências, status, responsável e referências. Mudanças importantes exigem novo ADR ou atualização rastreável, nunca reescrita silenciosa da história.

## Governança, segurança e princípios
1. Nunca versionar segredos, `service_role`, tokens OAuth, `.env` real, credenciais de Supabase ou dados pessoais.
2. Não efetuar deploy, publicar dados, ativar autenticação ou alterar políticas de acesso sem validar requisitos e consequências.
3. Diferenciar `proposto`, `implementado`, `testado` e `validado` em relatórios.
4. Citar fontes verificáveis; não inventar experimentos ou resultados.
5. Usar GitHub para versão e evidências; Drive para backup. Preservar histórico Git no backup (`git bundle`).
6. `LCR_START.md` é instrução; automação exige scripts executáveis, eventos e credenciais autorizadas.

## Automações
- `LCR_DAILY.yml`: relatório GitHub de commits (não lê automaticamente chats).
- `LCR_SEO.yml`: auditoria de arquivos SEO e rotas quando aplicável.
- `LCR_AUDITORIA.yml`: verificação preventiva de padrões inseguros, complementar à revisão humana.
- `LCR_BACKUP.yml`: snapshot + histórico Git para Drive, **desabilitado até configurar credenciais**.

Veja `BASIC_COMMANDS.md` e `BASIC_SKILLS.md` para detalhes. Repos de templates podem replicar estes arquivos; projetos existentes exigem migração e ajuste de caminhos no build/deploy.
## Brainstorming: fluxo interno, não uma sequência rígida
1. **Ideia e escopo:** problema, usuário, objetivo, restrições e resultado desejado.
2. **`LCR_BASIC_OPTIONS` dentro do brainstorming:** apresentar opções de stack, GitHub Pages, Supabase, autenticação, armazenamento, APIs e serviços; avaliar custo, necessidade e manutenção. Não provisionar nada por padrão.
3. **Precisa de aprofundamento científico/técnico ou patentes?** Se sim, solicitar Research / Technical Reviewer: revisão bibliográfica, cientometria, estado da técnica ou patentes. **Retornar ao Planner.**
4. **Exige segurança/qualidade além do padrão?** Se sim, solicitar Quality & Security Auditor para riscos, autenticação, privacidade, compliance e testes necessários. **Retornar ao Planner.**
5. **Decisão humana:** sintetizar opções, prioridades, critérios de aceite e registrar ADR quando houver decisão arquitetural. Encaminhar para Builder/Codex.

**Trilha habitual:** humano ↔ Planner ↔ Builder/Codex. Research, Auditor, Drawer e Audio Designer são consultados conforme a necessidade, não etapas fixas.

### Desenvolvimento macro, upgrade e hotfix
- **Desenvolvimento/upgrade:** novas funcionalidades, serviços, telas ou mudanças de arquitetura. Planner propõe escopo, caminhos, testes e guardrails; humano aprova; Builder/Codex implementa; revisar e retornar ao Planner.
- **Hotfix:** correção pontual com reprodução, intervenção mínima, validação de regressão e sem migração arquitetural implícita.
- **Retorno ao brainstorming:** qualquer nova dúvida significativa pode reabrir avaliação de Basic Options, Research ou Auditoria. Testes e documentação acompanham todas as entregas.

## Documentos normativos e arquivos de registros
- `LCR_GUARDRAILS.md`: regras permanentes e governança; lido por todos os especialistas.
- `LCR_NAMING_CONVENTIONS.md`: pastas kebab-case; documentos institucionais UPPER_SNAKE_CASE; maioria dos arquivos personalizados PascalCase; Python snake_case.
- `agents-archive/`: por sessão, Planner, Builder, Research, Drawer e Audio Designer recebem `daily_summary.md`, `raw_data.jsonl` (após revisão de privacidade) e `data.json`; Auditor mantém relatórios independentes.
- `decision-archive/`: **Decision Archive (ADR = Architecture Decision Record)**; registra motivos, alternativas, riscos e consequências de decisões relevantes.

## Verificação de nomenclatura (LCR_NAMING)
Todos os papéis podem solicitá-la. A verificação inspeciona arquivos rastreados no Git, sem renomeá-los; `LCR_NAMING.yml` roda em push/PR, manualmente e de forma agendada. `LCR_START.yml` inclui verificação inicial, e `LCR_DAILY.yml` a executa recorrentemente. A parte de LCR_DAY feita no chat só executa auditoria se houver ferramenta/conexão capaz de fazê-lo.

## Padronização de prompts do Planner — LCR_PROMPT_GENERATOR
- Durante o brainstorming, após a decisão humana, ao receber um pedido natural como **“faça um prompt para o Builder”**, o Planner reconhece a **intenção de gerar instruções**, não de executar a alteração.
- Usar **uma skill**: `.agents/skills/lcr-prompt-generator/SKILL.md`, com **exatamente dois modelos** canônicos: `DevelopmentPrompt.md` para desenvolvimento/upgrade e `HotfixPrompt.md` para hotfix compacto ou detalhado (adaptativo, sem terceiro modelo).
- Destino explicitado prevalece. Na ausência: Codex preferido para implementação estrutural e Builder Aux para correção local. Quando Codex indisponível, Builder pode receber prompt de desenvolvimento após escolha humana.
- O prompt deve registrar objetivo, destinatário, data/hora até o minuto e fuso **se verificáveis**, arquivos reais conferidos, guardrails, escopo, critérios de aceite, testes e relatório final. Não inventar timestamp ou caminhos.
- `LCR_DEV` e `LCR_HOTFIX` são atalhos **opcionais**. O pedido natural não depende de sintaxe especial. O arquivo `documentation/LCR_CHATGPT_PROJECT_INSTRUCTIONS.md` contém texto para ativar o comportamento em Projetos ChatGPT.
- Em upgrade e hotfix, a regra é gerar o prompt para o usuário revisar/encaminhar, **sem execução ou envio automático**, salvo ordem separada e ferramentas autorizadas.

## Gerador de ADR condicionado ao desenvolvimento
Ao produzir um prompt de **desenvolvimento/upgrade**, o Planner sempre executa uma avaliação proporcional de relevância arquitetural, conforme `documentation/decision-archive/LCR_ADR_GUARDRAILS.md`. Se necessário, utiliza `lcr-adr-generator` para gerar **dois documentos Markdown consecutivos**: prompt e ADR. Caso não haja decisão nova, só o prompt, informando resumidamente o motivo. Um upgrade extenso não implica ADR por si só. Hotfixes geralmente não geram ADR. O último ADR **relevante**, não necessariamente o mais recente global, e o brainstorming acessível orientam a decisão. Decisão humana já aprovada no contexto não exige aprovação repetida. Sem evidência de aprovação, status `proposto`. O registro não executa a implementação nem confirma publicação.
