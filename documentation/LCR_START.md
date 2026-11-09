# LCR_START — Inicialização estrutural

**Escopo aprovado (07-11-2026):** o START prepara apenas **pastas, arquivos-base, guardrails, normas, scripts e workflows**. Não seleciona tecnologias, não instala Supabase, Google Auth nem APIs, não cria contas e não ativa publicação.

## Procedimento para o Planner
1. Humano cria um novo repositório GitHub e passa a URL: `LCR_START https://github.com/owner/repo`.
2. Com integração GitHub autorizada, o Planner confere a URL e **copia o template sem sobrescrever arquivos existentes**. O texto do comando sozinho não executa integrações.
3. Estrutura essencial: `.gitignore`, `AGENTS.md`, `.github/workflows/`, `code/src/`, `code/public/assets/`, `code/tests/`, `code/scripts/`, `documentation/`, `documentation/decision-archive/`, `documentation/agents-archive/` e documentos-base.
4. Conferência local no template: `python code/scripts/lcr_start.py --verify`; nomes: `python code/scripts/lcr_naming.py --check`. O workflow `LCR_START.yml` valida a estrutura do repositório em que estiver instalado.
5. Incluir no template as skills `.agents/skills/lcr-prompt-generator/` e `.agents/skills/lcr-adr-generator/`, além de `.agents/skills/lcr-audit-generator/`, mais `documentation/decision-archive/LCR_ADR_GUARDRAILS.md`; a segunda é consultada para ADR condicional durante desenvolvimento. Incluir na primeira skill `.agents/skills/lcr-prompt-generator/SKILL.md` com os **dois** modelos `templates/DevelopmentPrompt.md` e `templates/HotfixPrompt.md`, além do índice `documentation/prompt-templates/README.md`. Esses arquivos são **instruções**; não instalam automaticamente skills na conta do ChatGPT. O `AdrTemplate.md` é um **modelo de registro**, não um terceiro modelo de prompt.
6. Se houver o template clonado localmente: `python code/scripts/lcr_start.py --target ../NovoProjeto` copia os arquivos locais e preserva o que já existir. Este script **não escreve em repositórios remotos**.

**Condição de conclusão:** estrutura e documentos criados e verificados. Não presumir deploy, autorização ou integração externa.

## Próxima fase: brainstorming com o Planner
`LCR_BASIC_OPTIONS` é parte do brainstorming, não uma etapa separada. O Planner analisa opções, pode consultar Research para fundamentação científica e Quality & Security Auditor para riscos elevados; resultados retornam ao Planner e o humano aprova antes de implementar. As regras permanentes estão em `LCR_GUARDRAILS.md`; os nomes em `LCR_NAMING_CONVENTIONS.md`.

---
## Apêndice — catálogo anterior preservado para consulta durante o brainstorming
**Atenção:** as listas de serviços, módulos, deploy e operação abaixo são referências para decisões **posteriores**; não são tarefas executadas por `LCR_START`.


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
## Backup central (novos projetos públicos)
O `LCR_START` instala o marcador `documentation/LCR_START.md`. O backup central o detecta automaticamente no próximo ciclo; não copiar `LCR_BACKUP.yml` nem credenciais para o novo repositório. Ver `documentation/LCR_CENTRAL_BACKUP.md` no controlador.

## Gate e backup de 09/11/2026
O template LCR passa a incluir os modelos de auditoria (AuditPrompt, AuditHotfixPrompt, AuditReport). Auditor geral executa verificações e aconselha especialistas opcionais Cybersecurity, Safety e Scientific Reviewer, sempre mediante decisão humana via Planner. Backup central é diário às 23h55 de Brasília, não por arquivo, com status pendente enquanto o Drive não confirmar snapshot.
