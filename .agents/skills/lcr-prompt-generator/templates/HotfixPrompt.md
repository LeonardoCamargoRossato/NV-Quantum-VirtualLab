# HotfixPrompt — Modelo único de hotfix (adaptativo)

> O mesmo arquivo cobre **hotfix compacto** e **hotfix completo**. A quantidade de detalhe cresce conforme complexidade, risco e número de arquivos; não criar terceiro template.

## Identificação mínima (sempre presente)
- **Tipo:** hotfix
- **Destinatário:** {{Builder Aux | Codex — respeitar pedido do usuário}}
- **Projeto/repositório:** {{URL real confirmada ou "a confirmar"}}
- **Data e hora:** {{YYYY-MM-DD HH:MM e fuso se verificados; senão "não verificada"}}
- **Problema:** {{descrever comportamento atual}}

## Correção solicitada
- **Esperado:** {{comportamento final verificável}}
- **Escopo:** {{componente/tela/arquivo; caminho exato só após verificação}}
- **Restrição:** corrigir com a menor intervenção possível, sem upgrade, refatoração generalizada nem mudança de arquitetura não solicitada.
- **Guardrails:** consultar `AGENTS.md`, `documentation/LCR_GUARDRAILS.md`, `documentation/LCR_NAMING_CONVENTIONS.md` e `documentation/LCR_WORKFLOW.md`.
- **Validação:** {{verificação objetiva de regressão adequada ao problema}}
- **Relatório:** informar arquivos efetivamente modificados, testes executados, resultado e pendências; não inventar evidências.

### Uso compacto (preferência quando o problema é trivial)
Gerar só as seções acima, em um prompt curto. **Exemplo fictício:** alterar hover azul para verde em um botão específico, sem alterar outras regras de CSS, e verificar o estado hover e focus.

### Ampliação condicional (mesmo modelo, quando necessário)
Adicionar somente se a complexidade justificar:
- Ambiente, reprodução detalhada e sintomas observados.
- Causas prováveis como hipóteses, separando fatos de suposições.
- Arquivos, dependências e rotas envolvidos, após inspeção do repositório.
- Riscos de segurança, autenticação, RLS, dados, compatibilidade ou acessibilidade.
- Testes de regressão, cenários de falha, monitoramento e plano de reversão.
- Aprovação/ADR se a solução demandar decisão arquitetural; nesse caso indicar que provavelmente se trata de **desenvolvimento/upgrade**, não hotfix.

## Segurança de interpretação
Não transformar correção simples em reforma do projeto. Não executar automaticamente o prompt: primeiro entregá-lo ao usuário para encaminhar ao Builder/Codex.
