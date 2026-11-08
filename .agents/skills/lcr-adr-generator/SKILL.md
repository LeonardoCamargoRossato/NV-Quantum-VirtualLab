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
- **Persistência operacional padrão:** depois de gerar um ADR correspondente a uma decisão **real**, efetivamente aprovada ou explicitamente documentada como proposta, usar as integrações GitHub e Google Drive disponíveis **na mesma resposta**, sem esperar por um pedido adicional de "salve". Este é um pedido permanente do usuário para registros LCR, sujeito às permissões efetivamente concedidas pelo ambiente; se o host exigir confirmação, respeitá-la. **Não persistir ADRs fictícios de demonstração, testes ou simulações.** Nunca interpretar criação de ADR como autorização para executar implementação, deploy ou outra operação no projeto.
- **GitHub primeiro:** confirmar o repositório do projeto e branch; listar `documentation/decision-archive/` para numerar e evitar duplicata; criar o `ADR-XXXX-titulo-curto.md` via ação autorizada de escrita, com status `aprovado` somente se houver evidência; obter SHA e URL reais. Se o arquivo já existir, comparar conteúdo, evitar sobrescrita silenciosa e registrar revisão por novo ADR se a decisão mudou.
- **Drive em seguida:** encontrar a pasta do projeto (não confundir com pasta do framework LCR); espelhar o arquivo em `documentation/decision-archive/` dentro dela, criando somente as subpastas necessárias, usando o mesmo conteúdo e nome. Se já existir um arquivo homônimo, comparar metadados ou conteúdo e atualizar a versão apropriada em vez de criar duplicações. Não mover nem apagar backups históricos datados.
- **Verificar e reportar:** entregar links e status independentes `github=salvo|pendente|falhou`, `drive=salvo|pendente|falhou`, além do SHA do commit quando confirmado. Se uma integração falhar, preservar o documento gerado e indicar o passo de recuperação; não declarar sincronização inexistente.
- **Limite técnico:** ter uma skill instalada **não** executa ferramentas em segundo plano, não garante acionamento em todo chat e não transfere o OAuth do plugin Drive para o GitHub Actions. O salvamento imediato depende de o agente dispor das duas ferramentas de escrita **naquela conversa**. Backups independentes do chat requerem credenciais próprias no GitHub Actions e o workflow `LCR_BACKUP.yml`.
- Redigir de modo enxuto, proporcional ao risco: poucas linhas para decisão simples; detalhe apenas para decisão complexa.
- Se duas decisões independentes exigirem dois ADRs, indicá-lo claramente e evitar aglutiná-las, mesmo que isso aumente a quantidade de arquivos.

## Instalação e interoperabilidade
Esta skill é uma unidade independente para instalar no ChatGPT, em `.agents/skills/lcr-adr-generator/`. O Prompt Generator pode invocá-la se estiver disponível. Se ainda não estiver instalada, pode seguir a referência `LCR_ADR_GUARDRAILS.md` e `AdrTemplate.md` diretamente, desde que acessíveis — jamais declarar uso de uma skill inexistente.
