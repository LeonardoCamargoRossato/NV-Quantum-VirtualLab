# ADR-0012 — Camadas poligonais vinculadas ao inventário

- **Data:** 2026-11-09 (Brasília)
- **Status:** aprovado
- **Responsável pela decisão:** responsável humano do NV Quantum Virtual Lab
- **Decisões relacionadas:** ADR-0007, ADR-0010, ADR-0011
- **Confiança:** alta no vínculo por tag; média na delimitação visual manual, limitada pela resolução e oclusões.
- **Origem da aprovação:** solicitação explícita de executar o upgrade do Planner para substituir pontos por camadas poligonais A/B.

## Problema e contexto
A foto frontal usava seis pontos de componentes, sem navegação espacial pela hierarquia do inventário. O upgrade exige contornos, expansão e seleção mantendo a imagem real.

## Critérios e restrições
Uma fonte de inventário; foto oficial preservada; tags existentes; contornos editáveis; ausência de posições inventadas para itens ocultos; interação responsiva e por teclado; sem camada C.

## Alternativas consideradas
| Alternativa viável | Benefícios | Custos e riscos |
|---|---|---|
| Polígonos diretamente no JSX | Alteração localizada | Mistura coordenadas e interação; manutenção visual mais difícil |
| Regiões por tag em JSON + SVG sobre a foto | Dados legíveis, alinhamento e seleção sem dependência nova | Revisão manual após mudanças na foto; sobreposição entre módulo e partes |
| Canvas com biblioteca de cenas | Flexibilidade gráfica | Dependência adicional e acessibilidade exigindo implementação paralela |

## Decisão e justificativa
Adotar metadados espaciais em `code/source/PhotoPolygons.json`, expostos pela estrutura fotográfica existente `PhotoRegions.ts`, e renderizar SVG em `PhotoLayers.tsx`. Percentuais referem-se exclusivamente à fotografia alinhada registrada no arquivo. `InventoryV1.json` continua fornecendo nomes e relações; as geometrias não substituem os dados técnicos.

## Consequências e trade-offs
- Contornos múltiplos atendem subsistemas distribuídos e podem ser editados sem alterar o componente React.
- SVG permite foco e ativação pelo teclado; cor é acompanhada de nome, legenda e estado de seleção.
- Coordenadas são aproximadas e não representam CAD ou validação elétrica. Itens sem evidência espacial ficam listados sem polígono.
- Reversão: restaurar os arquivos anteriores via Git; inventário e imagens não são migrados nem alterados.

## Implementação e acompanhamento
Codex implementa A/B, seleção, foco por limites e retorno. Testes conferem referências, ausência de mapas para itens ocultos, navegação e regressões. Revisar o mapa com o responsável antes de promover contornos a medições técnicas; reteste independente permanece separado.

## Evidências e referências
- `code/source/PhotoPolygons.json`, `code/src/PhotoRegions.ts`, `code/src/PhotoLayers.tsx`.
- `documentation/PhotoPolygonLayersUpgrade.md`: cobertura e limitações por tag.
- Fotografia oficial e retificação existentes em `code/source/ImagePresentation.json`.
