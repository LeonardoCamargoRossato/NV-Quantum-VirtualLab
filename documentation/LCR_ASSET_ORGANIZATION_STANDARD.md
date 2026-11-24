# LCR Workflow — Organização Humanizada, Rastreabilidade e Migração de Assets

Versão 1.2 · 24/11/2026 · Padrão transversal de engenharia

Estado: diretriz aprovada pelo responsável, sujeita a evolução documentada.

## 1. Finalidade e filosofia

O LCR Workflow prioriza projetos que permaneçam compreensíveis e manteníveis por outras pessoas ao longo do tempo. Um arquivo deve ser localizável, identificável, rastreável, verificável e recuperável, sem depender da memória de quem criou o sistema.

A organização de assets não é mero detalhe estético. Ela integra a arquitetura da informação, o controle de qualidade, a governança e a continuidade operacional.

Princípio: organizar para que uma pessoa consiga abrir o projeto, entender onde um recurso está, por que existe, onde é usado e como mantê-lo com segurança.

## 2. Hierarquia orientada ao produto

Em sites e aplicações que possuem navegação por páginas, a estrutura dos assets deve, sempre que útil, acompanhar a hierarquia conceitual do menu principal.

Exemplo de menu: Início → Sobre (História, Equipe) → Projetos (Pesquisa, Eventos) → Notícias → Contato.

Exemplo de acervo legível:

assets/

  01 - Início/

  02 - Sobre/

    02A - História/

    02B - Equipe/

  03 - Projetos/

    03A - Pesquisa/

    03B - Eventos/

  04 - Notícias/

  05 - Contato/

  06 - Identidade Visual/

A organização por menu é uma tendência útil para produtos editoriais e institucionais, não uma obrigação universal. Áreas transversais, como branding, mídia compartilhada, fontes, documentos e recursos de interface, podem ter diretórios próprios.

A ordem do menu é mutável: numeração serve à leitura humana, não deve virar dependência lógica, chave estável ou caminho inevitável do código. Para produtos com navegação, vincular a organização dos assets ao identificador estável da página no Product Structure Mapping, conforme LCR_FRAMEWORK_DOCUMENTATION_STANDARD, seção 7. O manifesto aponta para o catálogo de assets existente; não duplicar inventários ou arquivos. Exceções compartilhadas, dinâmicas e não aplicáveis devem ser explícitas. Validar as referências no Quality Gate existente.

## 3. Duas convenções complementares

O LCR Workflow preserva sua regra de nomenclatura técnica: pastas personalizadas em kebab-case, arquivos de aplicação conforme a linguagem e normas reservadas, documentos institucionais em UPPER_SNAKE_CASE.

Exceção organizacional para o acervo humano: quando melhorar a navegação, o Google Drive pode usar pastas numeradas e títulos legíveis com espaços, acentos e nomes editoriais.

Exemplo de correspondência:

Acervo (Drive): 03 - Projetos / 03B - Eventos / Evento Científico

Projeto (GitHub): code/public/assets/projects/events/scientific-event/

Supabase Storage: public-assets/projects/events/scientific-event/

A correspondência deve ser registrada em inventário, catálogo ou documentação. Não replicar automaticamente caminhos com espaços e acentos dentro de URLs, buckets ou APIs.

Evitar renomeações em massa quando o projeto já tem convenções estáveis; preferir migração incremental e controlada.

## 4. Granularidade e distribuição

Agrupar primeiro por função ou página, depois por conjunto de conteúdo e, quando houver benefício, por formato.

Não criar diretórios vazios por obrigação. Não concentrar todos os recursos em uma pasta genérica se isso ocultar seu contexto.

Recursos compartilhados devem ter um local comum e referências explícitas; não duplicar cópias independentes em cada página sem necessidade.

Arquivos gerados dinamicamente, uploads de usuários e anexos privados podem exigir organização por entidade ou identificador e não exatamente por menu. A regra de clareza permanece.

## 5. Formatos e versões

WebP/AVIF: versões leves de entrega quando suportadas pelo produto.

PNG: versões sem perdas, transparência ou arquivos originais aprovados quando apropriado.

JPEG/JPG: originais fotográficos ou imagens em que o formato seja tecnicamente adequado.

SVG: logotipos, ícones e vetores confiáveis; inspecionar a segurança de SVGs não confiáveis.

PDF: documentos, preferencialmente separados por finalidade e nível de acesso.

Vídeo, áudio, animações, fontes e outros formatos têm diretrizes proporcionais às suas características.

A versão otimizada (WebP/AVIF quando suportado) é a versão de entrega inicial. A versão original ou PNG aprovado para zoom/download só é requisitada quando o usuário abrir o visualizador ou solicitar o download. Imagens visíveis e necessárias à primeira dobra podem carregar imediatamente; as demais só quando efetivamente visíveis no viewport. Não carregar imagens de seções, rotas, slides, abas ou modais ainda não exibidos. O mecanismo técnico e os testes de rede são definidos no LCR_PERFORMANCE_STANDARD (PERF-01/02).

Não converter tudo indiscriminadamente para PNG: converter não melhora automaticamente qualidade, resolução ou autenticidade do original. Preservar a fonte e o histórico da transformação.

## 6. Nomenclatura e identidade estável

Nomes devem ser previsíveis e descritivos, respeitando LCR_NAMING_CONVENTIONS.

Versões de um mesmo recurso devem compartilhar identificador lógico: EventPhoto01.png e EventPhoto01.webp, por exemplo.

Identificadores lógicos não devem depender de uma posição transitória do menu.

Quando possível, centralizar caminhos em um catálogo para que renomeações não exijam caçar strings em todos os componentes.

Não usar nomes pessoais ou dados sensíveis desnecessários em caminhos públicos.

## 7. Inventário e rastreabilidade

Para cada asset relevante, registrar ao menos: asset_id, descrição, função/página, arquivo-fonte, versões derivadas, caminho no Git, caminho no Drive (se aplicável), formato, origem/autoria, estado de aprovação, direitos de uso, referências no sistema e nível de acesso.

Quando relevante, registrar dimensões, tamanho, hash SHA-256 e data de atualização.

Hashes iguais comprovam identidade binária; versões PNG/WebP legitimamente derivadas geralmente possuem hashes diferentes. Nesse caso, verificar a origem, a correspondência visual e a transformação registrada.

O inventário pode residir em JSON, CSV ou documentação versionada, idealmente validado no pipeline.

## 8. Separação entre acervo, publicação e backup

Acervo: guarda originais, versões aprovadas, histórico documental e recursos não publicados.

Publicação: inclui somente o necessário ao produto e a seus usuários.

Backup: fornece recuperação após exclusões, corrupção, falhas ou erro humano.

O GitHub versiona o produto e seus recursos de publicação. Para aplicações estáticas em GitHub Pages, hospedar preferencialmente junto ao build os assets públicos, estáticos e versionados (logos, capas, fotos editoriais, ícones e documentos aprovados), respeitando o subcaminho de publicação, os limites do host e o tamanho do repositório. Usar Supabase Storage ou serviço equivalente para uploads de usuários, conteúdo dinâmico independente do deploy, arquivos privados e volumes que justifiquem infraestrutura dedicada. O Drive pode atuar como acervo navegável e espelho documental, sem ser CDN de produção. Exceções à hospedagem preferencial exigem justificativa proporcional e ADR quando estrutural.

A fonte de verdade do LCR Workflow versionado continua sendo o repositório Git; a presente versão no Drive é a referência documental acessível e deve ser sincronizada com a fonte versionada quando autorizado.

Duas cópias não equivalem automaticamente a backup completo. Definir política de retenção, permissões, independência das cópias, verificação de integridade e teste periódico de restauração.

Nenhum arquivo confidencial deve ser publicado apenas para facilitar compartilhamento entre ferramentas ou chats.

## 9. Aplicação ao Supabase Storage

Recomenda-se alinhar os caminhos dos objetos ao domínio funcional da aplicação, com chaves técnicas estáveis:

public-assets/home/banners/hero.webp

public-assets/about/team/member-01.webp

public-assets/projects/events/event-01/cover.webp

public-assets/news/article-01/cover.webp

Buckets representam principalmente políticas de acesso, ciclo de vida e isolamento operacional, e não precisam existir por item do menu.

Exemplo: um bucket public-assets para conteúdos públicos; outro private-assets para documentos restritos, com políticas separadas.

Utilizar nomes minúsculos, kebab-case e identificadores únicos quando apropriado. Não tomar a estrutura de diretórios como substituto de autorização: usar políticas de acesso e RLS de Storage adequadas, URLs assinadas quando aplicável e evitar expor dados privados.

Uploads por usuários, grandes volumes e entidades dinâmicas podem seguir IDs técnicos para garantir estabilidade.

Esta seção diz respeito somente ao Storage. Modelagem de tabelas, schemas, relacionamentos e RLS do banco relacional constituem capítulo independente. O banco de dados não precisa reproduzir o menu.

## 10. Governança de alterações

Planner: define organização-alvo, inventário, riscos e critérios de aceite.

Builder: implementa mudanças em branch isolada quando pertinente, atualiza referências e apresenta evidências dos testes.

Quality & Security Auditor: verifica integridade, segurança, regressões e conformidade independentemente.

Responsável humano: aprova decisões de impacto, publicações e exclusões irreversíveis.

Documentar decisões estruturais relevantes com ADR quando os guardrails do LCR Workflow exigirem.

Separar estados: proposto, implementado, testado e validado. Não tratar um documento criado ou um arquivo copiado como prova de migração concluída.

## 11. Subcapítulo: migração segura de assets

Fluxo normativo: INVENTARIAR → PLANEJAR → PRESERVAR → COPIAR → VERIFICAR → ATUALIZAR REFERÊNCIAS → TESTAR → LIMPAR → DOCUMENTAR.

### 11.1 Diagnóstico

Inventariar fontes e destinos, caminhos, formatos, quantidade, tamanho, hashes, referência de uso, níveis de acesso, duplicações e itens sem utilização conhecida.

Registrar linha de base verificável. Um arquivo que parece não usado pode integrar conteúdo histórico ou alimentar uma integração externa.

### 11.2 Planejamento

Definir mapa antigo → novo, conversões necessárias, dependências afetadas, permissões e plano de reversão.

Segmentar por página, domínio ou lote pequeno. Não combinar migração de arquivos com reescrita funcional desnecessária.

### 11.3 Preservação

Criar cópia recuperável e validar acesso antes de alterar. Em Git, usar branch e registrar SHA/PR; em storage, garantir estratégia de recuperação apropriada.

Nunca excluir originais antes de confirmar integridade e autorização para remoção.

### 11.4 Cópia e equivalência

Copiar para a hierarquia-alvo sem remover inicialmente os caminhos antigos.

Verificar hashes quando os arquivos são binariamente idênticos. Para conversões e formatos diferentes, confirmar equivalência visual, resolução e qualidade.

Arquivos com nome parecido não são automaticamente o mesmo recurso.

### 11.5 Referências e catálogos

Atualizar React, CSS, JSON, scripts, documentos, URLs, testes, registros editoriais e referências externas relevantes.

Concentrar referências repetidas em catálogo quando apropriado. Manter compatibilidade temporária somente enquanto for necessária.

### 11.6 Testes e inspeção

Executar lint, typecheck, build, testes unitários, validação dos assets e testes de navegador pertinentes.

Conferir renderização, responsividade, zoom, downloads, links, acessibilidade e ausência de 404.

Verificar o artefato publicado para impedir vazamento de originais privados ou recursos não aprovados.

Se houver falhas prévias no pipeline, registrá-las separadamente das regressões introduzidas.

### 11.7 Remoção controlada

Apenas após validação e aprovação, remover duplicações temporárias e caminhos legados sem referências.

Distinguir exclusão da publicação de exclusão do acervo histórico. Registrar arquivos preservados e descartados.

### 11.8 Encerramento

Atualizar inventário, documentação e ADR pertinente, confirmar CI e implantação, verificar o resultado publicado e registrar o estado final.

A migração só está concluída quando a nova estrutura funciona, os testes foram avaliados, o backup pode ser recuperado e o humano responsável aprovou.

## 12. Critérios de aceite do padrão

A. Um novo mantenedor consegue localizar um recurso a partir da página ou função.

B. É possível identificar origem, formato e versão publicada.

C. Existe correspondência documentada entre acervo humano e caminhos técnicos.

D. Recursos privados não são publicados ou liberados indevidamente.

E. Referências quebradas e integridade são verificadas proporcionalmente ao risco.

F. A recuperação dos originais é demonstrável.

G. Exclusões e migrações relevantes possuem evidências e aprovação.

H. O padrão preserva as convenções existentes do LCR Workflow, inclusive kebab-case técnico e source of truth em Git.

I. Cada asset possui destino de hospedagem justificado pela natureza pública/privada, estática/dinâmica e pelos limites do serviço; testar caminhos e permissões no artefato publicado.

J. O carregamento sob demanda e o cache são verificados conforme LCR_PERFORMANCE_STANDARD; não usar imagens reais de produção em testes comuns (LCR_TESTING_STANDARD).

## 13. Disponibilidade no ChatGPT

O documento no Google Drive pode ser localizado em conversas que tenham acesso ao conector e recebam instrução para consultá-lo.

Salvar este documento no Drive não altera automaticamente as instruções de todos os chats nem instala uma skill global. Para maior consistência entre conversas, adicionar uma instrução resumida às Instruções Personalizadas da conta e disponibilizar o link do documento como referência.

Não compartilhar publicamente o arquivo apenas para obter acesso por IA; respeitar permissões e políticas do Drive.

## 14. Relação com normas existentes

Complementa LCR_WORKFLOW.md, LCR_NAMING_CONVENTIONS.md, LCR_GUARDRAILS.md e LCR_CHATGPT_PROJECT_INSTRUCTIONS.md. LCR_PERFORMANCE_STANDARD é a referência única para carregamento, cache e métricas; LCR_TESTING_STANDARD, para isolamento de testes; LCR_RESOURCE_GOVERNANCE_STANDARD, para limites de hospedagem, egress e custos.

Histórico: v1.0 (16/11/2026), organização e migração segura; v1.1 (24/11/2026), critérios de hospedagem estática/dinâmica, carregamento estritamente sob demanda e referências normativas após auditoria de egress do LCR Portfolio. v1.2 (24/11/2026), integração com Product Structure Mapping. Nenhuma migração ou exclusão é autorizada apenas pela atualização deste padrão.

Em caso de conflito, prevalecem controles de segurança, legislação, contratos de tecnologia e decisões humanas registradas. Alterações ao padrão exigem atualização versionada e, quando significativo, ADR.
