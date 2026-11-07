# LCR Workflow — Protocolo-base

**Estado:** proposta operacional em implementação; não é metodologia validada cientificamente.

## Propósito
Padronizar criação, desenvolvimento, revisão, documentação, evolução e rastreabilidade de projetos científicos e web assistidos por IA, com **orquestração humana**, poucos papéis especializados e procedimentos reproduzíveis.

## Especialistas
| Papel | Responsabilidade |
|---|---|
| Planner | Requisitos, escopo, planejamento, arquitetura e prompts para implementações. |
| Builder | Implementação: Builder Aux (hotfixes) e Codex (mudanças complexas). |
| Research | Pesquisa bibliográfica, estado da técnica, patentes, fontes e validação de fundamentos. |
| Drawer | UX/UI, diagramas e recursos visuais. Somente os registros textuais ficam em `documentation/drawer/`; imagens ficam em `code/public/assets/` ou storage externo. |
| Audio Designer (opcional) | Identidade sonora, efeitos, áudio e trilhas originais. Recursos em `code/public/assets/audio/`. |
| Quality & Security Auditor | Testes, auditoria de segurança, SEO, riscos, conformidade e recomendações. Relatórios independentes sob demanda. |

O **Organizador não é um chat**: é a função de consolidação documental do próprio LCR Workflow. O usuário decide prioridades, autoriza publicações e aprova decisões importantes.

## Ciclo de trabalho
Planejamento → `LCR_START` (bootstrap; publicação inicial se o site for público e houver configuração) → desenvolvimento e pesquisa → Quality & Security → evolução. Projetos privados mantêm a publicação como etapa separada, autorizada.

## GitHub como fonte principal
- `.github/workflows/`: automações periódicas e por evento.
- `code/src/`: aplicação e componentes.
- `code/public/assets/`: imagens, ícones e áudio; `robots.txt` e `sitemap.xml` ficam em `code/public/`.
- `code/tests/`: testes executáveis; `code/scripts/`: utilitários.
- `code/supabase/`: opcional (Auth, SQL, Storage, Edge Functions).
- `documentation/`: normas, sessões e decisões. Drive é backup, não cópia mestra.

## Registros por chat (LCR_DAY)
O comando `LCR_DAY` age como marcador: 1ª ocorrência inicia intervalo; 2ª fecha e registra; ocorrências seguintes fecham o intervalo desde o marcador anterior. São produzidos, quando houver conteúdo acessível:

- `daily_summary.md`: síntese de fatos, entregas, bloqueios e próximas ações;
- `raw_data.jsonl`: mensagens originais **efetivamente acessíveis**, uma por linha, sem fingir completude;
- `data.json`: metadados (data, papel, tema central, keywords, até cinco tópicos, fonte, precisão do registro, horários somente se verificáveis).

Não alegar extração integral do ChatGPT, tokens exatos ou horários que não estejam disponíveis. Em repositórios **públicos**, **não publicar automaticamente registros brutos não revisados**: podem conter chaves, conversas privadas ou outras informações sensíveis. Para risco, manter raw privado ou publicá-lo somente após verificação/anonimização.

`Quality & Security Auditor` mantém relatórios de auditoria com estrutura própria e privilégios apropriados; não recebe automaticamente o trio diário.

## Decision Archive (ADR)
`documentation/decision-archive/` mantém registros curtos de decisões: contexto, alternativas consideradas, decisão, justificativa, consequências, status, responsável e referências. Mudanças importantes exigem novo ADR ou atualização rastreável, nunca reescrita silenciosa da história.

## Governança, segurança e princípios
1. Nunca versionar segredos, `service_role`, tokens OAuth, `.env` real, credenciais de Supabase ou dados pessoais.
2. Não efetuar deploy, publicar dados, ativar autenticação ou alterar políticas de acesso sem validar requisitos e consequências.
3. Diferenciar `proposto`, `implementado`, `testado` e `validado` em relatórios.
4. Citar fontes verificáveis; não inventar experimentos ou resultados.
5. Usar GitHub para versão e evidências; Drive para backup. Preservar histórico Git no backup (`git bundle`).
6. `LCR_START.md` é instrução; automação exige scripts executáveis, eventos e credenciais autorizadas.

## Automações
- `LCR_DAILY.yml`: relatório GitHub de commits (não lê automaticamente chats).
- `LCR_SEO.yml`: auditoria de arquivos SEO e rotas quando aplicável.
- `LCR_AUDITORIA.yml`: verificação preventiva de padrões inseguros, complementar à revisão humana.
- `LCR_BACKUP.yml`: snapshot + histórico Git para Drive, **desabilitado até configurar credenciais**.

Veja `BASIC_COMMANDS.md` e `BASIC_SKILLS.md` para detalhes. Repos de templates podem replicar estes arquivos; projetos existentes exigem migração e ajuste de caminhos no build/deploy.