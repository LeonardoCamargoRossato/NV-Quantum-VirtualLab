# LCR_PERFORMANCE_STANDARD

Desempenho mensurável e carregamento conforme demanda

Versão 1.0 · 24/11/2026 · Diretriz aprovada para inclusão no Framework; implementação por projeto pendente.

## 1. Escopo

Define comportamento de execução e métricas. Hospedagem, formatos e inventário pertencem ao LCR_ASSET_ORGANIZATION_STANDARD; quotas e custos ao LCR_RESOURCE_GOVERNANCE_STANDARD.

## 2. Carregamento obrigatório por necessidade

Imagens só podem iniciar transferência quando efetivamente utilizadas na interface e visíveis no viewport. Imagens da primeira dobra podem ser eager apenas se visíveis e necessárias. Abaixo da dobra, abas/modal fechados, carrosséis fora da tela e rotas não abertas não iniciam transferência. Não atribuir src/srcset, background-image remoto, preload, new Image ou fetch de conteúdo oculto. Usar IntersectionObserver com margem zero ou mecanismo equivalente; placeholders dimensionados e fallback. Carrossel: apenas slides/miniaturas visíveis. PNG de zoom somente ao abrir viewer ou solicitar download; não prefetch de imagens fora da tela. Open Graph requisitado por crawler é contexto próprio, não justificativa de preload na Home.

## 3. Rede e cache

Evitar repetição: chaves estáveis, deduplicação em voo, cancelamento quando adequado, cache de dados com validade/invalidação e retries limitados com backoff. Assets públicos imutáveis e versionados usam cache prolongado onde o host permitir; não aplicar immutable a URLs mutáveis/privadas. Verificar headers reais, 200/304, cache do navegador versus CDN e cold/warm. Não prometer headers que o host não permite configurar.

## 4. Orçamentos e métricas

Definir por rota/cenário bytes, requisições, terceiros, tempo e métricas pertinentes (LCP, INP, CLS, tarefas longas, frames). Medir desktop/mobile, rede representativa, cache frio/quente e interação real; distinguir laboratório de campo. Limites numéricos aprovados por projeto, não arbitrários universais. Benchmark com fixtures locais; produção pontual e limitada.

## 5. Aceite verificável

PERF-01: zero downloads de imagens fora do viewport ou de rotas/controles fechados; medir rede antes/depois de scroll/clique. PERF-02: zero PNG de zoom antes da abertura/download, salvo PNG que seja o próprio asset visível aprovado. PERF-03: sem loop ou retry ilimitado; medir requisições repetidas. PERF-04: cache/versões verificados no publicado. PERF-05: baseline e resultado por SHA, cenário, bytes e métricas; reprovar regressões acima de limites definidos.
