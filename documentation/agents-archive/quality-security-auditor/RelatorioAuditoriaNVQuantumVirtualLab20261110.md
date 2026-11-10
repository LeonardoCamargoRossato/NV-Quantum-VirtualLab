# Auditoria independente — NV Quantum Virtual Lab — 10/11/2026

- **Data da auditoria:** 2026-11-10 (America/Sao_Paulo).
- **Repositório:** https://github.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab
- **HEAD auditado:** `a0ca2bd105858377be34afc7ea471085112f3d3f`.
- **Base de implementação verificada por build/Chromium:** `f030377e24e9e3a26680b486b11642a62a93e965`.
- **Parecer:** **APROVAÇÃO FUNCIONAL COM RESSALVAS; BACKUP REPROVADO**. Autorização de publicação/aceite residual de risco permanece humana.
- **Método:** leitura independente do registro do Planner, árvore Git, fontes, ADRs, relatórios e logs de GitHub Actions; consulta direta ao Google Drive do backup. Não houve alterações no software, credenciais ou disparo de workflows. Evidências de CI são verificadas independentemente; testes não foram reexecutados fora do runner Actions.

## 1. Registro do Planner versus realidade

Fonte: [RegistroPlannerNVQuantumVirtualLab20261110.md](../planner/RegistroPlannerNVQuantumVirtualLab20261110.md). O relatório do Planner declara corretamente que é um retrato de planejamento e que **não atesta execução**. Entretanto, ficou temporalmente defasado: commits posteriores à redação/ao conjunto de fatos que consolidou **já implementaram** o flip frontal/traseiro e o CAD 3D. A revisão abaixo reconcilia os fatos, sem reescrever o registro histórico.

| Entrega | Estado em 10/11 | Evidência e restrição |
|---|---|---|
| Visualizador de esquema 2D frente/verso e animação de flip | **Implementado; testes passaram** | `SchemeViewer.tsx` usa os dois PNG originais via `ImageViewer` com `flip`. BrowserSmoke: PASS frente/verso/zoom/Escape; `BrowserSchemeSmoke.mjs`. |
| Fotografia V1 frontal e traseira com flip | **Implementado; testes passaram** | Commit `73ee3bc`; `Workbench.tsx` escolhe `DeviceBackV1.jpeg`, preserva estados por face; `BrowserBackFaceSmoke.mjs`: PASS rear photo/flip/reduced-motion/zoom/mobile. |
| Contornos poligonais por face | **Implementado parcialmente por evidência** | `PhotoPolygons.json` frontal tem 9 subsistemas e 34 componentes testados; `PhotoPolygonsBack.json` limita verso a 1 subsistema (S04) e 2 componentes (B042, 0018). Ausências de pinos internos são justificadas, não lacuna a preencher inventando geometria. Contornos são aproximações manuais, não medições CAD. |
| Inventário canônico V1 | **Implementado; testes passaram** | `code/source/InventoryV1.json`, 79 itens; XLSX operacional de 4 guias; importação determinística, validação de migração/consolidação na CI. ADR-0010 e ADR-0011. Google Sheets histórico e consumidores externos não foram auditados para exclusão da guia legada; não apagar. |
| Visualizador 3D do Diamond Mount V2 | **Implementado no site, com ressalvas** | Commit `d6d3bda`; `Scientific3DViewer.tsx`, `three`, `STLLoader`, `OrbitControls`, arquivo STL e STEP na pasta `official/v2/diamond-mount`. Modo 3D em Explorar via `ViewerToolbar`. Testes Playwright de abertura/zoom/vistas/modos/fullscreen/fallback passaram em `f030377`. |
| Equivalência geométrica V1 × V2, desempenho em dispositivos reais | **Não comprovado** | `Scientific3DViewerUpgrade.md` explicita que a peça V2 é suporte do diamante, não prisma V1; unidades STL inferidas em mm exigem verificação CAD, e métricas 60 FPS/hardware móvel não estão comprovadas. |
| Simulação ODMR com backend local e arquitetura híbrida | **Planejado / fora desta entrega** | Consta no histórico de pesquisa; nenhum aceite de implementação integral foi encontrado neste recorte. |
| Backup GitHub → Google Drive do HEAD | **Reprovado / não atualizado** | Run `42801021641` attempt 2 (10/11) falhou novamente em `rclone copy` por `401 Invalid Credentials`; espelho Drive em `repository/` e única pasta de snapshots `2026-11-08`. Não há evidência de cópia do HEAD `a0ca2bd`. |

## 2. Testes e evidências (GitHub Actions)

| Controle | Commit | Resultado |
|---|---|---|
| `LCR_NAMING` | `a0ca2bd` | **success**; 411 arquivos versionados, **0 violações**. Run https://github.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/actions/runs/42885568311 |
| `LCR_AUDITORIA` | `a0ca2bd` | **success**; 412 arquivos examinados, 0 alertas na **varredura não exaustiva**. Run https://github.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/actions/runs/42885568439 |
| `LCR_PAGES` (build/deploy/assets) | `f030377` | **success**; 31 testes Vitest, 32 Python, migração e consolidação `--check`, build TypeScript/Vite, deploy e 11 PNGs públicos. Run https://github.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/actions/runs/42882670297 |
| `LCR_INTERFACE_SMOKE` | `f030377` | **success**; testes de frente/verso, camadas, interface mobile, 3D em 1366×768, 1920×1080, 390×844 e fallback WebGL. Run https://github.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/actions/runs/42882671079 |
| `LCR_BACKUP` (agendado, reexecutado) | `dd7a635` | **failure**; OAuth 401 no Actions, run https://github.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/actions/runs/42801021641 (tentativa 2). |

**Nota sobre SHAs:** o HEAD `a0ca2bd` apenas adicionou o registro do Planner após o commit `f030377` que havia passado em Pages/Smoke. Portanto o conteúdo aplicativo foi aprovado em `f030377`; Naming/Auditoria básica passaram novamente no HEAD. Não afirmar que smoke e build foram executados no HEAD exato.

A verificação automática básica de segredos é limitada, não equivale a teste de invasão. O CAD 3D foi testado no Chromium do CI, não em equipamento físico representativo.

## 3. Integridade do Google Drive e backup

Consultada pasta Drive `NV-Quantum-VirtualLab`, com `repository/` e `snapshots/`. O espelho mostra arquivos com modificação de **08/11/2026** (ex.: README 3.515 bytes) e `snapshots/` contém `2026-11-08/`. Não existe snapshot de 10/11 na árvore consultada.

Log da tentativa 2: `googleapi: Error 401: Request had invalid authentication credentials`, `Reason: authError, Message: Invalid Credentials`, na leitura do destino `lcrdrive:NV-Quantum-VirtualLab/repository`. A checagem de presença dos três secrets e variáveis passou, mas isso **não comprova validade** de `access_token`, `refresh_token` e par `client_id/client_secret`.

A ação do GitHub não herda login do conector Drive do ChatGPT. **Correção proposta ao Codex/operador:** finalizar OAuth local `rclone config` usando credenciais do MESMO cliente; validar leitura/escrita em pasta temporária restrita, atualizar `LCR_DRIVE_CLIENT_ID`, `LCR_DRIVE_CLIENT_SECRET` e `LCR_DRIVE_OAUTH_TOKEN` nos Secrets GitHub por canal seguro; executar `LCR_BACKUP.yml` manualmente; conferir `BACKUP_OK`, pasta nova, ZIP, bundle, SHA e ensaio de restauração. Não compartilhar tokens, não embutir secrets no código e não modificar agendamento diário `55 2 * * *` sem autorização.

## 4. Divergências, riscos e correções para Codex/Planner

| ID | Severidade | Achado | Ação e critério de aceite |
|---|---|---|---|
| BKP-001 | **Alta / bloqueia aceite do backup** | OAuth 401 do GitHub Actions; cópia Drive defasada de 08/11 | Reautorizar credenciais, rodar job de backup e conferir snapshot do HEAD de 10/11 e teste de restauração; sem declarar êxito prematuramente. |
| GOV-001 | **Média** | Registro do Planner marcado “3D/flip não comprovados”, apesar de commits posteriores com CI verde | Emitir adendo de reconciliação histórica com SHA e links, sem reescrever fatos passados. |
| GOV-002 | **Média** | Adoção de Three.js + STLLoader e lazy-loading 3D é decisão técnica relevante; ainda não há ADR-0014 cobrindo implantação/alternativas/limites | Planner avalia e registra ADR de decisão já aprovada/implementada, com escolha STL vs GLB e escopo V2; sem atribuir aprovação inexistente. |
| SCI-001 | **Média** | Geometria V2 e equivalência com V1 não comprovadas; STL não traz unidade formal | Revisão científica/CAD independente antes de utilizar dimensões no hardware ou afirmar equivalência. |
| QA-001 | **Baixa/Média** | Smoke 3D em ambiente CI não prova 60 FPS ou desempenho mobile real | Avaliar dispositivo físico e registrar medição/limites de desempenho; fallback WebGL já testado. |
| INV-001 | **Média / gate humano** | Exclusão da antiga guia Google depende de auditoria de consumidores externos e fórmulas | Não excluir até gate próprio do ADR-0011 e autorização humana. |
| SEC-001 | **Observação** | Varredura automatizada de segredos encontrou 0 alertas, mas é não exaustiva | Se forem ampliadas credenciais, usuários ou serviços, convocar Cybersecurity conforme ADR-0008. |

### Recomendações práticas

1. **Prioridade P0 — Backup:** correção do OAuth e verificação real de nova cópia no Drive. A ausência de backup válido não deve ser escondida por CI verde do aplicativo.
2. **P1 — Governance:** adendo ao registro do Planner e avaliação/registro de ADR-0014 para o visualizador CAD 3D, com decisão humana e rastreabilidade.
3. **P2 — Validação científica/qualidade:** ensaio CAD do suporte V2 em mm, performance em hardware representativo e revisão manual dos contornos cuja identificação não seja inequívoca.
4. **P2 — Dados:** manter a guia Google histórica até avaliação de consumidores/dependências e aprovação explícita de exclusão.

## 5. Parecer consolidado e decisão humana

**Aprovação técnica funcional com ressalvas**: visualização 2D, foto traseira, camada por face, inventário e visualização CAD 3D têm código, assets e CI positivo. **Sem homologação científica de geometria ou de desempenho real**.

**Backup reprovado**: Google Drive não contém evidência do HEAD auditado e último job falhou 401.

**Decisão humana pendente**: (a) aceitar continuidade do desenvolvimento com ressalvas e obrigatoriedade de corrigir backup; (b) autorizar Planner a documentar ADR específico do visualizador 3D; (c) definir se quer revisão CAD científica antes de qualquer uso físico. Não apagar aba Google histórica sem gate separado.

Referências principais: `documentation/agents-archive/planner/RegistroPlannerNVQuantumVirtualLab20261110.md`, ADR-0008 a ADR-0013, `documentation/Scientific3DViewerUpgrade.md`, código citado e os cinco GitHub Actions acima.

**Registro do Auditor:** documento gerado mediante pedido humano; não implementa funcionalidades nem altera secrets. **Espelhamento Drive apenas no backup diário após corrigir OAuth**.
