# Inventário — fonte única

- `UncutGemInventoryV1V2.xlsx`: workbook **operacional migrado** com exatamente quatro abas (árvore canônica, Uncut Gem V2, Galeria de imagens e Leia-me). O original de cinco abas permanece recuperável no histórico Git (`4b641bfebb2d3694163df3338b2e66d0d1556c21`). SHA-256 operacional: `13339c68d4fcb0a44134faf0a9fff29b39859904bc9b5f44078bf2f0a6413445` (substituído automaticamente pelo script de migração após os testes).
- `InventoryV1.json`: catálogo determinístico de **79 registros** gerado unicamente da aba `Árvore Uncut Gem V1 — System Co` (título truncado pelo Excel). Sem `legacyItems` ou `legacyOnlyTags`, sem preenchimento automático do legado. `legacyTag` é apenas metadado histórico. As vistas PCB são `UG-V1-B041`/`UG-V1-B042`.
- `evidence/`: evidências do Builder para imagens, estados de revisão e faces da PCB. Alimentam o importador; não são carregadas como catálogos separados pela interface. Seus hashes são registrados no catálogo.
- `legacy/`: snapshot histórico de 33 registros e árvore Markdown antiga. Nenhum desses arquivos participa da reconstrução nem da interface.

Após autorização e revisão da fonte canônica, executar, da raiz do repositório:

```bash
python code/scripts/migrate_inventory_workbook.py --verify-only
python code/scripts/consolidate_inventory.py
python code/scripts/consolidate_inventory.py --check
```

O importador usa apenas a biblioteca padrão Python, não executa fórmulas e preserva as referências IMAGE como texto. O JSON é derivado da árvore canônica; não editar manualmente. V2, galeria e Leia-me permanecem no XLSX, sem mistura com o catálogo V1. URLs externas não equivalem ao arquivamento de arquivos. Os 15 links foram migrados para a coluna P da árvore por tag; os links para o firmware são referências de código, não datasheets do fabricante.

O Google Sheets foi editado apenas para preencher 15 células da coluna P, por autorização explícita; a exclusão da aba antiga depende do gate de testes e auditoria de dependências. Não existe sincronização automática Google↔GitHub. A data do snapshot é a data de recebimento, sem horário de sincronização inventado. A posição física só tem hotspot quando validada nas seis regiões existentes.

## Apresentação visual alinhada

`evidence/ImageFraming.json` registra, item por item, a fonte original, o retângulo do assunto principal e as referências geométricas. `ImagePresentation.json` registra as transformações e hashes das versões exibidas em `code/public/assets/official/v1/presentation/`. O catálogo usa essas URLs, preservando a classificação e a procedência; os assets anteriores permanecem como referência. Para R1/R3, o enquadramento atual é o registrado em ImageFraming, corrigindo a associação visual anterior.

Para regenerar, com Chromium disponível e dependências npm instaladas, da raiz:

```bash
node code/scripts/AlignInventoryImages.mjs
python code/scripts/consolidate_inventory.py
```

Opcional: `CHROMIUM_PATH` seleciona o executável do Chromium. A transformação é geométrica, com margem neutra e interpolação máxima 2×; não recupera detalhes ausentes. A foto principal usa o plano da PCB; recortes do ESP32, OLED e RF usam referências dos seus planos visíveis. Os hotspots continuam definidos na foto original e são remapeados para a apresentação alinhada. Não interpretar a retificação como calibração metrológica. Novas imagens ou mudanças de fonte exigem revisar coordenadas e hashes antes de regenerar.

## Regiões interativas da foto

`PhotoPolygons.json` registra somente geometrias por tag e classes visuais na foto frontal alinhada; os dados e vínculos de inventário permanecem em `InventoryV1.json`. A imagem e seu tamanho devem coincidir com `ImagePresentation.json`. Cobertura e limitações: `documentation/PhotoPolygonLayersUpgrade.md` na raiz do repositório.
