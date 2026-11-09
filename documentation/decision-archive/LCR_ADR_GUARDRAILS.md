# LCR_ADR_GUARDRAILS — Critérios para gerar ADRs

## Regra central
**Todo prompt de desenvolvimento ou upgrade deve avaliar a necessidade de ADR; não deve obrigatoriamente criar ADR.** Um ADR registra decisão **arquiteturalmente significativa**, não toda tarefa extensa. Hotfix comum não gera ADR; quando há impacto arquitetural, reavaliar classificação da mudança.

### Quando criar
- Escolha ou troca de stack, banco de dados, autenticação, infraestrutura, interface de API ou integração crítica;
- Alteração duradoura da estrutura, papéis/agentes ou segurança, com consequências/reversão relevantes;
- Decisão exigida pelos guardrails institucionais (ex.: criar ou convocar novo chat especialista);
- Outra decisão significativa, com alternativas reais, critérios e consequências para o projeto.

### Quando não criar
- Ajuste visual, correção pontual, inclusão de componente/página na arquitetura existente;
- Upgrade extenso mas sem novas decisões estruturais;
- Repetição de decisão já registrada num ADR relevante; referenciar o ADR em vez de duplicá-lo.

## Procedimento obrigatório de avaliação
1. Checar `documentation/decision-archive/`, especialmente o **último ADR relevante**.
2. Comparar o que foi aprovado no brainstorming **efetivamente acessível** desde o ADR ou decisão relacionados. Não alegar acesso integral a outros chats.
3. Decidir `sim/não`, registrar razão e vínculos. Se houver dúvida por ausência de contexto, declarar a limitação e não inventar aprovação.
4. Se **sim**, preencher `.agents/skills/lcr-adr-generator/templates/AdrTemplate.md` com data verificada, status, decisão e ações. Separar arquivos: prompt de desenvolvimento e ADR.
5. Se **não**, entregar só o prompt com nota breve: "ADR avaliado: não necessário — [razão]".
6. Se a decisão foi **explicitamente aprovada anteriormente**, não exigir novo OK; usar `aprovado` e indicar sua origem. Sem evidência de aprovação, usar `proposto`. A criação do arquivo não representa execução da decisão.
7. Não fazer commit, publicar dados privados ou dizer que salvou no GitHub/Drive sem operação efetiva autorizada e verificada.

## Revisão de qualidade (Zimmermann)
- Descrever questão e requisitos significativos, sem fabricar urgência.
- Comparar alternativas **viáveis** (idealmente duas ou mais; não criar alternativa fictícia se não existir).
- Explicar **benefícios, perdas e trade-offs** da escolha.
- Considerar consequências operacionais e de manutenção, inclusive médio/longo prazo.
- Usar linguagem factual, concisa e verificável; justificar grau de confiança.
- Registrar quem decidiu, decisão aprovada/proposta, ações de acompanhamento e critérios de reavaliação.
- Evitar antipadrões: *Fairy Tale*, *Sales Pitch*, *Free Lunch Coupon*, *Dummy Alternative*, *Sprint*, *Tunnel Vision*, *Mega-ADR* e falsa precisão.

**Referência externa:** Olaf Zimmermann, [How to create Architectural Decision Records (ADRs) — and how not to](https://ozimmer.ch/practices/2023/04/03/ADRCreation.html) (2023; atualização de setembro de 2026). Estas regras são **adaptação interna do LCR**, não uma cópia literal do artigo.

## Formato e tamanho
Documento curto e auditável, sempre proporcional à complexidade. Uma decisão importante por ADR, conectando outros registros quando necessário. Formato oficial único: `AdrTemplate.md`. Nomes finais: `ADR-0001-titulo-curto.md` e numeração baseada no índice verificado.

## Persistência automática da decisão real
- ADR aprovado: persistir no GitHub no próprio turno; Drive recebe apenas na rotina diária centralizada, sem upload simultâneo por arquivo.
- A solicitação permanente de registro foi aprovada pelo usuário, sem necessidade de novo OK para decisões já aprovadas; respeitar confirmações da plataforma e não publicar segredos ou dados brutos privados.
- Validar primeiro repositório, último índice, conteúdo, ausência de duplicação, status da decisão e vínculo ao ADR anterior. **Não salvar testes nem exemplos hipotéticos.**
- Verificar commit GitHub e registrar Drive como pendente até verificar o backup diário e o snapshot; falha não autoriza declarar backup concluído. Não confundir Drive do framework com Drive de um projeto de aplicação.
- A automação ocorre **no turno do agente que tenha acesso aos conectores**. A cópia contínua sem chat só acontece depois de habilitar `.github/workflows/LCR_BACKUP.yml` com suas próprias credenciais.
