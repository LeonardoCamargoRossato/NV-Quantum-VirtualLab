---
name: lcr-prompt-generator
description: "Gerar prompts padronizados para Builder Aux ou Codex ao reconhecer pedidos naturais de implementação, desenvolvimento, upgrade ou hotfix no brainstorming do Planner, como 'faça o prompt para o Builder', 'mande para o Codex' ou 'prepare um hotfix'. Usa exatamente dois modelos: DevelopmentPrompt.md e HotfixPrompt.md."
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
7. Gerar **somente o prompt**, pronto para copiar/enviar, e indicar qualquer informação indispensável ainda desconhecida. Não executar alterações nem declarar commit ou deploy feitos ao simplesmente gerar o texto.
8. Quando aplicável, registrar o prompt ou seu resumo como evidência de sessão via `LCR_DAY`, sem publicar transcrições brutas sensíveis. Mudança arquitetural significativa requer ADR.

## Padrão mínimo de auditoria
Toda saída tem tipo, destino, contexto/projeto, data/hora verificada ou ausência explícita, objetivo, escopo, guardrails/nomes dos documentos normativos, critério de aceite e pedido de relatório dos arquivos alterados. Em modo compacto, essas informações podem aparecer em **poucas linhas**.

## Portabilidade
Esta pasta é uma **skill distribuível para Codex** (`.agents/skills/`). Para ChatGPT, o arquivo no GitHub não equivale a instalação na conta: criar/carregar skill em ambiente elegível ou usar instruções do Projeto ChatGPT. Modelos incluídos em `templates/` garantem que um ZIP da skill seja autossuficiente.
