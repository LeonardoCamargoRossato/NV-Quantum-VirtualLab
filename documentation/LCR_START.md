# LCR_START — Inicialização do projeto

**Importante:** este arquivo é um protocolo de inicialização, **não é executado automaticamente pelo simples upload**. A automação depende dos workflows, scripts, permissões e de um gatilho de GitHub Actions (`workflow_dispatch` ou evento configurado).

## 1. Identificação
- Projeto: preencher.
- Objetivo e público-alvo: preencher.
- Visibilidade: `public` / `private`.
- Repositório remoto e branch: preencher.
- URL canônica do site (somente se houver deploy): preencher.
- Papéis utilizados: Planner / Builder / Research / Drawer / Quality & Security / Audio Designer opcional.

## 2. Seleção de módulos
Marque os serviços necessários (módulos opcionais não criam dependências quando desativados).

- [ ] GitHub Pages / deploy estático (somente se houver site público e build funcional).
- [ ] Supabase DB — criar projeto e aplicar migrações com credenciais autorizadas.
- [ ] Supabase Auth — configurar URLs, RLS e políticas de sessão.
- [ ] Supabase Storage — criar buckets/políticas explícitas, conforme necessidade.
- [ ] Google Login — OAuth via provedor, com client ID, redirect URI e segredo guardado fora do Git.
- [ ] SEO público — definir domínio/base path, `robots.txt`, `sitemap.xml` com URLs reais e metadata.
- [ ] Google Search Console — propriedade verificada e permissão API concedida; não assumir que o ChatGPT já a autoriza para Actions.
- [ ] Algum buscador interno/API externa — somente quando justificado.
- [ ] Backup Google Drive — habilitar workflow apenas após autorizar `rclone` e definir pasta destino.
- [ ] LCR Audio — incluir biblioteca sonora se desejada, com controles de volume e acessibilidade.

**Seed SQL é dado inicial**, não uma senha. `client_secret`, tokens e chaves são **secrets** e nunca entram em repositório público.

## 3. Checklist do primeiro deploy
1. Criar pastas-padrão e arquivos versionados necessários.
2. Definir ambiente e lockfile; configurar workflows para `code/` se aplicação usa monorepo.
3. Adicionar Secrets/Vars no GitHub com menor privilégio possível.
4. Validar scripts, build e testes; ativar Pages **apenas** quando a aplicação estiver pronta.
5. Confirmar base URL, SSL, sitemap e comportamento de páginas privadas.
6. Registrar a primeira decisão significativa em `documentation/decision-archive/`.
7. Não declarar integração funcional antes de testar sua execução real.

## 4. Operação
- `LCR_DAY`: registrar intervalo de trabalho do chat; revisar raw antes de publicar.
- `LCR_AUDITORIA`: revisão especializada e/ou executar workflow manual.
- `LCR_SEO`: diagnóstico e revisão por Quality & Security.
- `LCR_BACKUP`: somente após configuração segura; testar restauração.

O LCR Workflow **não cria automaticamente** propriedades do Search Console ou credenciais OAuth sem as autorizações exigidas pelo provedor.