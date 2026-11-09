# Consolidação do inventário V1

Implementação em 2026-11-09, conforme pedido do responsável e prompt do Planner. Decisão: [ADR-0010](decision-archive/ADR-0010-inventario-canonico-em-source.md).

## Resultado

- `code/source/` reúne o XLSX original intacto, catálogo canônico, evidências de imagem/face e histórico. O site usa somente `InventoryV1.json`.
- 79 itens canônicos: 10 subsistemas A e 69 componentes B; C indisponível. Busca única, filtros combinados, cards/lista preservados na sessão, detalhes, hierarquia e CSV.
- Os 33 registros da aba antiga permanecem no XLSX e no catálogo para auditoria; 15 campos ausentes foram complementados. Há 579 diferenças de valores registradas por campo e vínculo, inclusive diferenças esperadas entre agrupamentos e peças desagregadas; não representam 579 erros confirmados.
- Para peças desagregadas, não atribuir quantidades/modelos do grupo legado. Os valores originais permanecem disponíveis para comparação.
- UG-V1-0002/0003 são vistas históricas da PCB, acessíveis pela ficha UG-V1-0001 sem inflar os 79 registros.
- Evidências do Builder preservadas: 67 imagens CHECK e duas REVISÃO. Os seis footprints C5–C10 carregam sem serem descritos como capacitores fisicamente instalados.
- Navegação e revisão cientométrica atualizadas pelo Builder foram integradas antes dos testes finais.
- Nenhuma escrita em Google Sheets nem sincronização Drive foi executada.

## Validação local

- 23 testes Python: passaram.
- 15 testes Vitest: passaram.
- TypeScript e build Vite: passaram; permanece aviso de bundle JavaScript maior que 500 kB.
- Reconstrução determinística do catálogo e hash do XLSX: passaram.
- Chromium: busca/camadas/face, cards/lista, imagens, hierarquia, vistas PCB, CSV, Explorar, Fluxo, pesquisa, revisão cientométrica e inventário mobile sem overflow: passaram.
- LCR_NAMING: zero violações.
- Varredura preliminar de segredos: zero alertas; não constitui auditoria exaustiva ou independente.

## Entrega e limites

Commit estável destinado à revisão. Retestes independentes do Auditor e aprovação final humana seguem o gate do AGENTS/ADR-0008; este relatório registra verificações do implementador, não aprovação do Auditor. Publicação do site não deve ser declarada antes de verificar o deploy do commit aprovado. Os arquivos e evidências de origem foram mantidos sem redefinir a política geral de backup de outros documentos.
