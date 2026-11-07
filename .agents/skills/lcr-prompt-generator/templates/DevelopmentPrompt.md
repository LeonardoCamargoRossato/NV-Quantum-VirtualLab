# DevelopmentPrompt — Modelo único de desenvolvimento e upgrade

> Usar para implementação nova, expansão funcional ou mudança arquitetural aprovada. Preencher os campos a partir do brainstorming; não publicar marcadores de preenchimento como fatos.

## Identificação
- **Tipo:** desenvolvimento ou upgrade
- **Destinatário:** {{Codex | Builder Aux — escolha explícita ou preferência padrão}}
- **Projeto/repositório:** {{URL real confirmada ou "a confirmar"}}
- **Data e hora:** {{YYYY-MM-DD HH:MM e fuso se verificados; caso contrário "não verificada"}}
- **Origem da decisão:** {{resumo da aprovação humana; ADR se houver}}

## Objetivo e resultado esperado
{{Uma frase com o objetivo, seguida de descrição clara da experiência ou comportamento esperado.}}

## Escopo aprovado
1. {{Item funcional concreto}}
2. {{Item funcional concreto}}
3. {{Dependências e componentes afetados, se houver}}

## Referências e arquivos reais
- Consultar `AGENTS.md`, `documentation/LCR_GUARDRAILS.md`, `documentation/LCR_NAMING_CONVENTIONS.md`, `documentation/LCR_WORKFLOW.md`.
- Arquivos confirmados no repositório: {{listar caminhos exatos APÓS consulta; se não houve acesso, pedir ao executor que os localize sem inventar}}
- Outras referências aprovadas: {{opcional}}

## Guardrails e limites
- Preservar a árvore `code/`, `documentation/`, `.github/workflows/` e os registros `agents-archive/` / `decision-archive/`.
- Cumprir a nomenclatura LCR: pastas kebab-case, arquivos personalizados PascalCase, Python snake_case e nomes de ferramentas reservados.
- Não introduzir serviços externos, segredos, alterações de acesso ou mudança arquitetural não aprovados.
- Diferenciar alteração de app, upgrade de stack e hotfix. Não reformatar/reorganizar áreas fora do escopo.

## Plano de implementação
1. Verificar estrutura atual, dependências e caminhos reais.
2. Implementar apenas o escopo aprovado; adaptar às tecnologias efetivamente presentes.
3. Adicionar ou atualizar testes proporcionais (incluindo regressão, acessibilidade e segurança quando relevantes).
4. Verificar build e `python code/scripts/lcr_naming.py --check` quando houver ambiente de execução.
5. Atualizar documentação e registrar ADR quando existir decisão arquitetural relevante.

## Critérios de aceite e evidências
- {{Comportamento verificável 1}}
- {{Comportamento verificável 2}}
- Sem regressão perceptível nas partes existentes.
- Relatório final: arquivos criados/alterados, testes realmente executados e resultados, pendências, riscos e referência de commit **somente se houver commit**.

## Entrega
Executar a implementação somente no ambiente autorizado. Não afirmar que deploy, integração externa ou teste foi concluído sem evidência.
