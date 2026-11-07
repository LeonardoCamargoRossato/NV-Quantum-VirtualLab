# ADR-0004 — Skill única e dois modelos de prompts

- **Data:** 2026-11-07
- **Status:** aprovado
- **Decisor:** responsável humano pelo projeto

## Contexto
Os prompts elaborados pelo Planner para Builder/Codex precisam de rastreabilidade, clareza e nomes de arquivos reais, sem exigir que o humano decore comandos ou mantenha muitos modelos.

## Alternativas consideradas
1. Textos livres, sem formato.
2. Vários modelos separados por destinatário e complexidade.
3. Uma skill de seleção e **dois modelos canônicos** adaptativos.

## Decisão
Adotar `LCR_PROMPT_GENERATOR`, reconhecido por linguagem natural quando o usuário solicita elaboração de prompt. Dois modelos: `DevelopmentPrompt.md` para desenvolvimento/upgrade e `HotfixPrompt.md` para todas as correções, compacto ou detalhado conforme necessidade. Destinatário explicitamente pedido prevalece; por padrão, Codex em desenvolvimento estrutural e Builder Aux em correções locais. Atalhos `LCR_DEV` e `LCR_HOTFIX` são opcionais.

## Consequências e limites
Documentação em `.agents/skills/lcr-prompt-generator/` e índice em `documentation/prompt-templates/` entram no template `LCR_START`. `SKILL.md` precisa de exceção no auditor de nomes. Instalar o arquivo no GitHub **não instala automaticamente uma skill na conta ChatGPT**. Não gerar timestamps ou caminhos falsos; não executar prompts enviados apenas para redação.

## Referências
`LCR_WORKFLOW.md`, `LCR_GUARDRAILS.md`, `BASIC_COMMANDS.md`, `BASIC_SKILLS.md`.
