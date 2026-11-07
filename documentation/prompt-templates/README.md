# Templates de prompts — referência oficial

Existem **apenas dois modelos canônicos**, incluídos na skill `LCR_PROMPT_GENERATOR`, sem duplicação de cópias que possam divergir:

1. [DevelopmentPrompt.md](../../.agents/skills/lcr-prompt-generator/templates/DevelopmentPrompt.md) — desenvolvimento e upgrade.
2. [HotfixPrompt.md](../../.agents/skills/lcr-prompt-generator/templates/HotfixPrompt.md) — hotfix adaptativo, compacto ou completo no **mesmo** arquivo.

A skill está em [SKILL.md](../../.agents/skills/lcr-prompt-generator/SKILL.md). O Planner deve reconhecer intenções em português natural, como "gostei, faça um prompt para o Builder", sem comando obrigatório.

**Hierarquia:** intenção e aprovação do humano → guardrails e caminhos reais do projeto → seleção do modelo → preenchimento auditável → prompt entregue ao usuário. Gerar o prompt não envia instruções automaticamente ao executor.
