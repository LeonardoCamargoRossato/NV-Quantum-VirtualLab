---
name: lcr-adr-generator
description: "Avaliar se um brainstorming ou prompt de desenvolvimento contém nova decisão arquitetural significativa e, apenas quando necessário, gerar um Architecture Decision Record (ADR) conciso com alternativas, trade-offs, confiança e consequências, conforme Zimmermann. Pode ser chamado automaticamente por lcr-prompt-generator ou por linguagem natural."
---

# LCR ADR Generator — Skill do Planner

## Gatilhos
- Ser solicitado naturalmente: "registre esta decisão", "gere um ADR", "documente a decisão arquitetural".
- **Ser consultado automaticamente pelo `lcr-prompt-generator` sempre que ele preparar um prompt de desenvolvimento ou upgrade.** A consulta não implica obrigatoriamente um novo ADR.
- Hotfixes não geram ADR por padrão; só se revelarem mudança arquitetural real, caso em que o Planner deve identificar possível reclassificação para desenvolvimento.

## Contrato: resultado da avaliação
Retornar conceitualmente:
- `adr_required: true | false`
- `reason: texto curto`
- `related_adrs: [caminhos verificados]`
- `evidence_scope: mensagens e arquivos realmente acessíveis`
- `approval_state: aprovado | proposto`
- `adr_path: caminho sugerido, apenas se necessário`

**Criar ADR quando** a decisão envolve alteração duradoura e relevante de estrutura, stack, autenticação/segurança, dados, integrações críticas, contratos de API, custos futuros, requisitos de qualidade ou risco de reversão. Também respeitar ADRs requeridos por guardrails locais, como a decisão de convocar um novo especialista. **Não criar ADR** só porque o prompt é longo, foi chamada uma página nova, mudou estilo ou se adicionou funcionalidade dentro da arquitetura vigente.

## Leitura e recorte de contexto
1. Identificar a decisão humana **efetivamente aprovada**, a proposta a executar e seu impacto. Aprovação explícita anterior ("adotamos X", "ok, faça") vale; não pedir um segundo OK sem necessidade. Um simples pedido para redigir o ADR não equivale a aprovação de uma decisão ainda não tomada.
2. Localizar **o último ADR relevante e o índice do `documentation/decision-archive/`**, conferindo conteúdo, relação com a decisão atual e numeração. Não assumir que o último ADR global é necessariamente o referente à arquitetura em questão.
3. Examinar o brainstorming **acessível desde a decisão/ADR relacionado** e qualquer resumo material de conversas fornecido. Não alegar ter lido mensagens de outros chats, histórico privado não disponível ou conversas integrais. Quando faltar contexto, indicar as lacunas em vez de inventar fatos.
4. Determinar se o assunto já está registrado: não criar ADR duplicado. Se uma decisão nova substitui outra, criar ADR novo com vínculo e estado "substitui ADR-XXXX" sem reescrever a história.
5. Se não houver decisão arquitetural significativa, devolver `adr_required: false` e uma frase explicativa ao gerador de prompts. **Nenhum arquivo ADR é criado**.
6. Se houver, ler `templates/AdrTemplate.md` e `documentation/decision-archive/LCR_ADR_GUARDRAILS.md` (ou utilizar a cópia das regras abaixo caso o projeto não esteja acessível), redigir **um ADR por decisão arquitetural principal**, proporcional ao impacto. Não misturar múltiplas escolhas independentes em mega-ADR.

## Guardrails de conteúdo — referência Zimmermann
Revisar problema concreto, requisitos e critérios; pelo menos duas alternativas **viáveis quando existirem**, incluindo manter o atual; justificar a escolha e perdas (trade-offs) de cada alternativa; registrar consequências boas **e ruins**, responsáveis e ações de acompanhamento; indicar confiança (alta/média/baixa e razão). Evitar "venda" de tecnologia, alternativa fictícia, justificativa tautológica, ausência de riscos, foco exclusivo no curto prazo, falso detalhamento numérico e documentos quilométricos. Fontes e suposições devem estar identificadas.

Base: Olaf Zimmermann, "How to create Architectural Decision Records (ADRs) — and how not to", https://ozimmer.ch/practices/2023/04/03/ADRCreation.html

## Status, arquivo e apresentação
- Se o usuário **já aprovou a decisão no brainstorming**, marcar `aprovado`, indicando a evidência da aprovação. Sem aprovação identificável: `proposto`.
- Nomear `documentation/decision-archive/ADR-XXXX-titulo-curto.md`; usar número seguinte **apenas após conferir** o repositório. Sem acesso, usar `ADR-PENDENTE-titulo-curto.md` para rascunho fora do Git, sem inventar número.
- Quando invocado pelo Prompt Generator: **entregar o prompt primeiro e o ADR em seguida**, cada qual como arquivo Markdown separado quando houver ferramenta para criar arquivos. Se ferramentas não permitirem gerar arquivos, apresentar dois blocos completos e copiáveis, sem alegar anexos.
- Não fazer commit nem upload automaticamente só por redigir o ADR. Requerer autorização para persistir se necessário; reportar status de escrita verdadeiro.
- Redigir de modo enxuto, proporcional ao risco: poucas linhas para decisão simples; detalhe apenas para decisão complexa.
- Se duas decisões independentes exigirem dois ADRs, indicá-lo claramente e evitar aglutiná-las, mesmo que isso aumente a quantidade de arquivos.

## Instalação e interoperabilidade
Esta skill é uma unidade independente para instalar no ChatGPT, em `.agents/skills/lcr-adr-generator/`. O Prompt Generator pode invocá-la se estiver disponível. Se ainda não estiver instalada, pode seguir a referência `LCR_ADR_GUARDRAILS.md` e `AdrTemplate.md` diretamente, desde que acessíveis — jamais declarar uso de uma skill inexistente.
