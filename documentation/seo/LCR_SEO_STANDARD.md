# LCR Workflow — SEO automatizado (proposta V0.3)

**Estado:** padrão proposto; automação ainda não instalada/validada.  
**Âmbito:** aplicações com páginas públicas indexáveis; não se aplica automaticamente a interfaces privadas, dashboards autenticados ou ambientes de desenvolvimento.  
**Executor:** GitHub Actions. **Responsável por exceções e revisão:** Quality Auditor. **Responsável por decisões:** humano.

## 1. Objetivo

Incorporar verificações de SEO à rotina do projeto, sem precisar abrir um chat nem executar manualmente uma skill. O pipeline inicia por eventos de código, por agendamento periódico e por acionamento manual quando necessário.

## 2. Configuração-base por projeto

- `site_url`: URL pública canônica publicada, incluindo subcaminho quando houver (por exemplo, GitHub Pages).
- `seo_enabled`: verdadeiro apenas para projetos com páginas públicas indexáveis.
- `sitemap_enabled`: verdadeiro se o site tiver URLs públicas relevantes.
- `search_console_property`: identificador da propriedade verificada, se existir.
- `indexing_policy`: produção pública / privado / pré-lançamento.
- Identificadores e preferências podem estar em configuração versionada; **nunca inserir tokens, segredos ou chaves privadas** no repositório.

## 3. Rotinas automáticas previstas

### A cada push/PR relevante
1. Validar URLs canônicas, títulos e metadescrições das páginas públicas.
2. Conferir cabeçalhos, acessibilidade básica de imagens (`alt`), links e erros de compilação.
3. Verificar `robots.txt` e sitemap, respeitando o subcaminho de publicação.
4. Gerar diagnóstico verificável; falhar o CI somente em problemas objetivos configurados (links inválidos, arquivos ausentes, erros de build).
5. Publicar relatório sem modificar automaticamente textos editoriais ou dados científicos.

### Após deploy de produção
1. Validar se a URL publicada está acessível.
2. Gerar/atualizar `sitemap.xml` com URLs reais, nunca endereços fictícios.
3. Publicar a referência ao sitemap em `robots.txt` quando aplicável.
4. Se a propriedade já estiver verificada e a credencial estiver configurada, opcionalmente submeter sitemap pela API do Google Search Console.

### Diário (integração à rotina LCR Daily)
1. Verificar se houve alteração de páginas públicas, deploy ou problemas críticos de SEO.
2. Validar a disponibilidade do site, a presença do sitemap e arquivos de SEO quando aplicáveis.
3. Produzir um registro leve e associá-lo ao LCR Daily; sem mudanças, registrar apenas `sem alteração relevante`.
4. Não executar IA paga diariamente sem necessidade; relatórios devem se basear nos dados realmente coletados.

### Semanal (análise mais ampla)
1. Executar auditoria aprofundada e revisar recomendações sobre conteúdo e estrutura.
2. Quando a API estiver autorizada, consultar impressões, cliques, CTR, posição e consultas via Search Analytics.
3. Registrar achados e recomendações em `documentation/seo/reports/YYYY-MM-DD.md` ou como artefato CI.
4. Não interpretar ausência de dados como ausência de visitas; Search Console possui atraso e filtros próprios.

## 4. Google Search Console: onboarding obrigatório

O template automatiza a **preparação**, mas não elimina a prova de propriedade.

- **Domínio próprio:** criar/verificar propriedade de domínio via DNS uma vez por domínio, abrangendo subdomínios e protocolos associados; domínios diferentes exigem verificação própria.
- **Prefixo de URL:** a propriedade cobre apenas URLs com aquele prefixo; pode ser apropriada para GitHub Pages publicado em subpasta.
- **Múltiplos sites GitHub Pages:** uma propriedade verificada do prefixo base pode cobrir vários caminhos sob o mesmo host, mas a propriedade/verificação da raiz do host precisa ser tecnicamente possível e efetivada; caso contrário, verificar o prefixo de cada projeto.
- **Automação com API:** após verificar a propriedade e fornecer credenciais com permissões apropriadas, é possível enviar sitemap e buscar métricas. Credenciais ficam em GitHub Secrets (ou mecanismo equivalente); acesso mínimo necessário.

## 5. Artefatos e locais propostos

```text
.github/workflows/lcr-seo.yml       # gatilhos: push/PR, após deploy, diário, semanal
code/public/robots.txt              # somente projetos com site público
code/public/sitemap.xml             # gerado a partir das rotas públicas
code/scripts/seo/                   # validações e geração automática
documentation/seo/README.md         # protocolo + onboarding e configuração
documentation/seo/reports/          # relatórios versionados ou links para artefatos
```

O arquivo `LCR_SEO_STANDARD.md` documenta o padrão; os scripts e workflows somente passam a existir depois da implementação e validação.

## 6. Controles de qualidade

- SEO não é uma promessa de indexação ou ranqueamento.
- Não usar a tag `meta keywords` como estratégia de ranqueamento; priorizar conteúdo útil, title, headings e descrições pertinentes.
- Não indexar inadvertidamente páginas privadas, dados de usuários ou ambientes de homologação.
- Alterações editoriais sugeridas por IA exigem revisão humana antes do merge.
- Documentar indicadores com intervalo de datas, fonte e distinção entre medição e inferência.
- GitHub Actions executa automações, mas **não lê automaticamente os históricos privados dos chats do ChatGPT**.

## 7. Princípio do LCR Workflow

**SEO = skill/protocolo especializado + execução automatizada pelo GitHub Actions + auditoria por exceção**, sem rotina manual obrigatória no Quality Auditor.

## 8. Fontes oficiais

- Google: https://support.google.com/webmasters/answer/34592?hl=pt-BR
- Google: https://developers.google.com/webmaster-tools/v1/api_reference_index
- Google: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- GitHub: https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows
