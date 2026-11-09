# Inventário — fonte única

- `UncutGemInventoryV1V2.xlsx`: original recebido do responsável em 2026-11-09, preservado byte a byte (SHA-256 `3fa0d1c8fe767964b278d91756fdf4679aca897cc3ffb827d24ac65614c463c4`). Contém cinco abas, incluindo V1 e V2.
- `InventoryV1.json`: catálogo canônico consumido pela aplicação. Sua origem é a aba `Árvore Uncut Gem V1 — System Co` (nome efetivo no XLSX): 10 subsistemas A + 69 componentes B. A aba antiga complementa lacunas sem duplicar componentes. `legacyItems` preserva os 33 registros; `consolidation` registra complementos e divergências; `legacyOnlyTags` preserva as vistas frontal/traseira da PCB, UG-V1-0002/0003.
- `evidence/`: evidências do Builder para imagens, estados de revisão e faces da PCB. Alimentam o importador; não são carregadas como catálogos separados pela interface. Seus hashes são registrados no catálogo.
- `legacy/`: arquivos históricos, não consumidos pela interface. A árvore Markdown histórica não é outro catálogo ativo.

Para atualizar, substituir o XLSX somente após conferir a nova revisão e executar, da raiz do repositório:

```bash
python code/scripts/consolidate_inventory.py
python code/scripts/consolidate_inventory.py --check
```

O importador usa apenas a biblioteca padrão Python, não executa fórmulas e preserva as referências IMAGE como texto. O JSON é derivado: não editar manualmente. As diferenças ficam preservadas, não são resolvidas por adivinhação. V2 e galeria permanecem no XLSX, sem mistura com o catálogo V1. URLs de imagens externas não equivalem ao arquivamento de seus arquivos.

Não há escrita ou sincronização com Google Sheets/Drive. A data do snapshot é a data de recebimento, sem horário de sincronização inventado. A posição física só tem hotspot quando validada nas seis regiões existentes.

## Apresentação visual alinhada

`evidence/ImageFraming.json` registra, item por item, a fonte original, o retângulo do assunto principal e as referências geométricas. `ImagePresentation.json` registra as transformações e hashes das versões exibidas em `code/public/assets/official/v1/presentation/`. O catálogo usa essas URLs, preservando a classificação e a procedência; os assets anteriores permanecem como referência. Para R1/R3, o enquadramento atual é o registrado em ImageFraming, corrigindo a associação visual anterior.

Para regenerar, com Chromium disponível e dependências npm instaladas, da raiz:

```bash
node code/scripts/AlignInventoryImages.mjs
python code/scripts/consolidate_inventory.py
```

Opcional: `CHROMIUM_PATH` seleciona o executável do Chromium. A transformação é geométrica, com margem neutra e interpolação máxima 2×; não recupera detalhes ausentes. A foto principal usa o plano da PCB; recortes do ESP32, OLED e RF usam referências dos seus planos visíveis. Os hotspots continuam definidos na foto original e são remapeados para a apresentação alinhada. Não interpretar a retificação como calibração metrológica. Novas imagens ou mudanças de fonte exigem revisar coordenadas e hashes antes de regenerar.
