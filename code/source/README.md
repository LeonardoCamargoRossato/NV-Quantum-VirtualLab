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
