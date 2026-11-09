---
name: lcr-prompt-generator
description: "Gerar prompts para Codex/Builder por linguagem natural com dois modelos (DevelopmentPrompt e HotfixPrompt). Em desenvolvimento/upgrade, avaliar automaticamente se há nova decisão arquitetural significativa e, quando houver, gerar também um ADR separado com lcr-adr-generator."
---

# LCR Prompt Generator — Skill do Planner

## Quando usar
Ative por linguagem natural quando o usuário pedir para **criar um prompt** que será entregue ao Codex ou Builder, incluindo pedidos feitos por voz. Atalhos `LCR_DEV` e `LCR_HOTFIX` são opcionais; o usuário **não precisa** usar `/`, comandos nem o nome da skill.

**Não ativar para toda discussão ou brainstorm:** só quando houver intenção de elaborar instruções para implementação ou correção. Se o usuário pedir para implementar diretamente, não confundir com um pedido de prompt.

## Classificação e destino
- **Desenvolvimento/upgrade:** criar página, funcionalidade, integração, arquitetura ou melhoria significativa → ler `templates/DevelopmentPrompt.md`.
- **Hotfix:** corrigir bug ou comportamento existente com escopo delimitado → ler `templates/HotfixPrompt.md`. O mesmo template é **adaptativo**: compacto para correções simples, detalhado para problemas com dependências, segurança ou regressão. **Não existe terceiro modelo.**
- Destino explicitado pelo usuário sempre prevalece (ex.: "para o Builder"). Sem indicação: Codex como preferência para mudanças estruturais; Builder Aux para correções localizadas. Não mudar destino de modo silencioso.
- Se o pedido denominado "hotfix" exigir migração ou nova arquitetura, avisar a divergência e propor modelo de desenvolvimento sem alterar a intenção do usuário silenciosamente.

## Procedimento
1. Recuperar do brainstorming a **decisão aprovada**, escopo, dependências, critérios de aceite, impactos e os pontos ainda pendentes. Não presumir aprovação de tópicos apenas debatidos.
2. Consultar `AGENTS.md`, `documentation/LCR_WORKFLOW.md`, `documentation/LCR_GUARDRAILS.md`, `documentation/LCR_NAMING_CONVENTIONS.md` e as instruções do projeto.
3. Com acesso GitHub, **verificar nomes e caminhos reais** do repositório; sem acesso, não inventar caminhos ou IDs: use "localizar e confirmar no repositório" nos itens afetados. Cite sempre os **nomes exatos** dos arquivos normativos, quando disponíveis.
4. Determinar tipo e destinatário; preencher **um e somente um** dos dois templates da pasta `templates/`.
5. Incluir data e hora até o minuto e fuso **somente quando verificados**. Na ausência de relógio confiável, usar "data/hora não verificada" para o executor preencher. Não fabricar cronologia.
6. Inserir critérios de aceite proporcionais, verificações e testes. Guardrails são referência à fonte normativa, sem copiar dezenas de linhas desnecessárias.
7. **Avaliar necessidade de ADR em todo desenvolvimento/upgrade** antes de finalizar a entrega, preferencialmente acionando `lcr-adr-generator` (skill em `../lcr-adr-generator/SKILL.md`). Consultar a última decisão **relevante** em `documentation/decision-archive/`, o brainstorming efetivamente acessível e as normas em `documentation/decision-archive/LCR_ADR_GUARDRAILS.md`. **Tamanho do prompt não implica ADR.** Se houve decisão arquitetural significativa, gerar o prompt e, em sequência, **um ADR Markdown separado**, segundo `../lcr-adr-generator/templates/AdrTemplate.md`. Se não houve, gerar só o prompt e dizer em uma frase que ADR não foi necessário. Se não houver acesso à segunda skill, seguir os documentos de ADR diretamente, declarando essa limitação; nunca fingir acionamento.
7b. **Apresentar arquivos de verdade quando ferramentas permitirem:** `DevelopmentPrompt.md` (ou nome específico em PascalCase) e `ADR-XXXX-titulo-curto.md`. Caso a interface não permita criar arquivos, apresentar os dois conteúdos Markdown completos separadamente, sem alegar arquivos anexados. O modelo `HotfixPrompt.md` continua único e normalmente dispensa ADR. **Não executar alterações nem declarar commit/deploy** ao apenas gerar o texto.
8. Quando aplicável, registrar o prompt ou seu resumo como evidência de sessão via `LCR_DAY`, sem publicar transcrições brutas sensíveis. **Se a decisão já foi explicitamente aprovada no brainstorming, não solicitar novo OK para registrar o ADR**: marcar o ADR como aprovado com origem de aprovação. Sem aprovação comprovável, marcar proposto.
9. **Persistência automática na mesma conversa:** se a avaliação produzir ADR de uma decisão real, seguir o protocolo de gravação descrito em `../lcr-adr-generator/SKILL.md`: GitHub `documentation/decision-archive/` no turno → backup Drive diário → verificação do snapshot após o job; sem upload por arquivo. Este registro está autorizado como rotina padrão do LCR, sujeito às permissões atuais e a quaisquer confirmações exigidas pelo host. Não salvar ADR de demonstração nem afirmar salvamento sem confirmação.
10. Ao entregar o prompt, separar claramente `geração`, `commit GitHub` e `replicação Drive`. Em falha de uma das integrações, devolver o conteúdo do ADR e explicar a pendência, sem bloquear a entrega do prompt. O prompt de implementação não é executado pelo ato de gerar ou registrar o ADR.

## Padrão mínimo de auditoria
Toda saída tem tipo, destino, contexto/projeto, data/hora verificada ou ausência explícita, objetivo, escopo, guardrails/nomes dos documentos normativos, critério de aceite e pedido de relatório dos arquivos alterados. Em desenvolvimento, também informar a avaliação ADR: quando necessário, segundo arquivo separado; quando não, justificativa curta. Em modo compacto, essas informações podem aparecer em **poucas linhas**.

## Portabilidade
Esta pasta é uma **skill distribuível para Codex** (`.agents/skills/`). Para ChatGPT, o arquivo no GitHub não equivale a instalação na conta: criar/carregar skill em ambiente elegível ou usar instruções do Projeto ChatGPT. Modelos incluídos em `templates/` garantem que um ZIP da skill seja autossuficiente.
