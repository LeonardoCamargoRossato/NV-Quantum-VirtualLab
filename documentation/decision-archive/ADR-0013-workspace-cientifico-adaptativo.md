# ADR-0013 — Workspace científico com controles adaptativos

- **Data:** 2026-11-09 (Brasília)
- **Status:** aprovado para implementação; auditoria independente pendente
- **Responsável:** responsável humano do NV Quantum Virtual Lab
- **Decisões relacionadas:** ADR-0008, ADR-0010, ADR-0011 e ADR-0012
- **Confiança:** alta na composição nativa React/CSS; validação visual limitada às resoluções e ao Chromium registrados.
- **Origem:** pedido explícito de executar o prompt Scientific Viewer — Interface Adaptativa e Maximização da PCB.

## Problema e critérios
Cabeçalho, legendas e avisos permanentes consumiam altura do Explorar. A experiência precisa priorizar a foto, preservar hierarquia científica, manter controles acessíveis e permitir largura de inspeção ajustável sem redefinir zoom.

## Alternativas consideradas
| Alternativa | Benefícios | Custos e riscos |
|---|---|---|
| Controles em fluxo, somente recolhíveis | Fluxo DOM simples | Cada abertura reduz a área da fotografia |
| Barra do workspace com painel sobreposto | Mantém foto dominante; atende o prompt | Exige fechamento, foco e limites de sobreposição |
| Biblioteca externa de layout/docking | Redimensionamento pronto | Dependência e complexidade desnecessárias para duas regiões |

## Decisão e justificativa
Usar barra compartilhada de 48 px, controles sobrepostos e aba minimizada; grid com inspetor, divisória de 10 px e fotografia. Persistir somente preferências de largura e minimização. O fullscreen passa a abranger esse workspace, preservando toolbar e inspeção. Zoom/pan continuam no mecanismo existente; ResizeObserver atualiza o ajuste e preserva o centro proporcionalmente, sem reaplicar o zoom de expansão a cada resize.

## Consequências e trade-offs
Menus temporários podem cobrir a foto; fecham explicitamente, com Escape ou clique externo. Em mobile, o inspetor permanece drawer e dispensa divisória. Créditos ficam a uma ação de distância, sem ocupar altura permanente. As geometrias e o inventário não são alterados. Reversão é possível via histórico Git dos arquivos de interface.

## Implementação, evidências e acompanhamento
- `documentation/ScientificViewerUpgrade.md`: capturas, métricas e limites.
- `ViewerToolbar.tsx`, `InspectorResizeHandle.tsx` e `InspectorLayout.ts`: responsabilidades separadas, sem biblioteca adicional.
- `BrowserAdaptiveViewerSmoke.mjs`: aceites integrados ao smoke de interface existente.
- Reteste do Auditor e aprovação final humana são etapas independentes da implementação/publicação autorizada; nenhum parecer independente é presumido.
