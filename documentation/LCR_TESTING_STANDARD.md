# LCR_TESTING_STANDARD

Testes isolados e evidências de qualidade

Versão 1.0 · 24/11/2026 · Diretriz aprovada para inclusão no Framework; implementação por projeto pendente.

## 1. Escopo

Aplica-se a projetos LCR web, científicos e de IA. Complementa LCR_GUARDRAILS, LCR_FUNCTIONAL_TEST (BASIC_SKILLS) e MIN-19. Não substitui normas de segurança ou documentação.

## 2. Camadas

Unitário: funções e regras sem rede. Componente: interface isolada com dados e assets locais. Integração: serviços reais somente em ambiente de teste autorizado, dados sintéticos e credenciais restritas. E2E: jornadas representativas com backend simulado ou homologação. Smoke de produção: somente leitura, escopo mínimo, orçamento explícito e autorização; nunca carga, escrita, upload ou download em massa.

## 3. Isolamento obrigatório

Testes comuns locais e CI não podem chamar Supabase de produção, LLMs pagos, embeddings, APIs externas ou serviços reais por acidente. Usar fixtures determinísticas, adapters, mocks de contratos e assets locais representativos. Bloquear por padrão tráfego externo não autorizado, incluindo imagens, redirects, WebSockets e service workers quando aplicável. Validar endpoints antes de abrir o navegador; falhar de forma segura se apontarem à produção. Não fornecer secrets de produção a jobs comuns. Exceções devem declarar ambiente, finalidade, escopo, limite e responsável.

## 4. Confiabilidade

Testar o menor escopo suficiente; usar Test Component Lab ou harness isolado para UI. Fixar versões, seeds e dados; evitar sleeps arbitrários, retries ilimitados e dependência de ordem. Cobrir sucesso, erros, autorização, responsividade e acessibilidade pertinentes. Mocks não substituem testes de contrato e integração real selecionados. Deduplicação de execuções: LCR_CICD_STANDARD.

## 5. Aceite verificável

TST-01: zero chamadas não autorizadas à produção e registro de tentativas bloqueadas. TST-02: fixtures sem dados privados. TST-03: integração real separada e limitada. TST-04: testes reproduzíveis e falhas não mascaradas. TST-05: evidência por SHA, cenário, ambiente, resultado e artefato; distinguir implementado, testado e validado. Orçamentos: LCR_PERFORMANCE_STANDARD e LCR_RESOURCE_GOVERNANCE_STANDARD.
