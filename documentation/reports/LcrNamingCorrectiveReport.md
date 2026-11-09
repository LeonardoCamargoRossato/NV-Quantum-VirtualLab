# LCR_NAMING — Hotfix corretivo de 25 caminhos

**Repositório:** LeonardoCamargoRossato/NV-Quantum-VirtualLab  
**Fonte de verdade:** commit estável final na branch `main` (consultar Actions)  
**Conforme:** AGENTS.md, LCR_GUARDRAILS.md, LCR_NAMING_CONVENTIONS.md, ADR-0002 e ADR-0009.

## Inventário de renomeações

| # | Antigo | Novo |
|---:|---|---|
| 1 | `assets/components/illustrative/ug-v1-capacitor-ceramico-ilustrativo.png` | `assets/components/illustrative/UgV1CapacitorCeramicoIlustrativo.png` |
| 2 | `assets/components/illustrative/ug-v1-capacitor-eletrolitico-ilustrativo.png` | `assets/components/illustrative/UgV1CapacitorEletroliticoIlustrativo.png` |
| 3 | `assets/components/illustrative/ug-v1-capacitor-smd-ilustrativo.png` | `assets/components/illustrative/UgV1CapacitorSmdIlustrativo.png` |
| 4 | `assets/components/illustrative/ug-v1-ima-neodimio-cubo-ilustrativo.png` | `assets/components/illustrative/UgV1ImaNeodimioCuboIlustrativo.png` |
| 5 | `assets/components/illustrative/ug-v1-ima-neodimio-disco-ilustrativo.png` | `assets/components/illustrative/UgV1ImaNeodimioDiscoIlustrativo.png` |
| 6 | `assets/components/illustrative/ug-v1-power-bank-usb-ilustrativo.png` | `assets/components/illustrative/UgV1PowerBankUsbIlustrativo.png` |
| 7 | `assets/components/illustrative/ug-v1-prancha-8-componentes-ilustrativa.png` | `assets/components/illustrative/UgV1Prancha8ComponentesIlustrativa.png` |
| 8 | `assets/components/illustrative/ug-v1-resistor-axial-ilustrativo.png` | `assets/components/illustrative/UgV1ResistorAxialIlustrativo.png` |
| 9 | `assets/components/illustrative/ug-v1-resistor-smd-ilustrativo.png` | `assets/components/illustrative/UgV1ResistorSmdIlustrativo.png` |
| 10 | `code/public/assets/official/v1/enhanced/manifest.json` | `code/public/assets/official/v1/enhanced/EnhancedCropsManifest.json` |
| 11 | `code/public/assets/official/v1/enhanced/ug-v1-above-esp32-enhanced.png` | `code/public/assets/official/v1/enhanced/UgV1AboveEsp32Enhanced.png` |
| 12 | `code/public/assets/official/v1/enhanced/ug-v1-between-rf-and-esp32-enhanced.png` | `code/public/assets/official/v1/enhanced/UgV1BetweenRfAndEsp32Enhanced.png` |
| 13 | `code/public/assets/official/v1/enhanced/ug-v1-esp32-enhanced.png` | `code/public/assets/official/v1/enhanced/UgV1Esp32Enhanced.png` |
| 14 | `code/public/assets/official/v1/enhanced/ug-v1-laser-driver-enhanced.png` | `code/public/assets/official/v1/enhanced/UgV1LaserDriverEnhanced.png` |
| 15 | `code/public/assets/official/v1/enhanced/ug-v1-laser-enhanced.png` | `code/public/assets/official/v1/enhanced/UgV1LaserEnhanced.png` |
| 16 | `code/public/assets/official/v1/enhanced/ug-v1-oled-enhanced.png` | `code/public/assets/official/v1/enhanced/UgV1OledEnhanced.png` |
| 17 | `code/public/assets/official/v1/enhanced/ug-v1-overview-enhanced.png` | `code/public/assets/official/v1/enhanced/UgV1OverviewEnhanced.png` |
| 18 | `code/public/assets/official/v1/enhanced/ug-v1-pcb-enhanced.png` | `code/public/assets/official/v1/enhanced/UgV1PcbEnhanced.png` |
| 19 | `code/public/assets/official/v1/enhanced/ug-v1-prism-enhanced.png` | `code/public/assets/official/v1/enhanced/UgV1PrismEnhanced.png` |
| 20 | `code/public/assets/official/v1/enhanced/ug-v1-rf-amp-enhanced.png` | `code/public/assets/official/v1/enhanced/UgV1RfAmpEnhanced.png` |
| 21 | `code/public/assets/official/v1/enhanced/ug-v1-rf-cable-enhanced.png` | `code/public/assets/official/v1/enhanced/UgV1RfCableEnhanced.png` |
| 22 | `code/public/assets/official/v1/enhanced/ug-v1-recortes-aprimorados.zip` | `code/public/assets/official/v1/enhanced/UgV1RecortesAprimorados.zip` |
| 23 | `code/scripts/BuildLayerBComponentImages.py` | `code/scripts/build_layer_b_component_images.py` |
| 24 | `code/scripts/BuildUncutGemV1Subsystems.py` | `code/scripts/build_uncut_gem_v1_subsystems.py` |
| 25 | `documentation/history/TheJourneyOfBuildingTheLCRWorkflow_EN.md` | `documentation/history/TheJourneyOfBuildingTheLcrWorkflowEn.md` |

## Procedimento e integridade

- Mapear as 25 violações do `LCR_NAMING` no commit inicial `9fd16b7a5ded212cefc01fd62f21d4231ee7e4af`.
- Preservar blobs Git dos PNGs ilustrativos/oficiais e do arquivo ZIP no commit de renome, sem recompressão ou regeneração desnecessária. O ZIP pode ser regenerado pelo workflow existente, pois seu conteúdo interno possui nomes de arquivos que também devem corresponder à nova nomenclatura.
- Alterar referências de interface, inventário JSON, plano de imagens, checkpoint, documentação operacional, manifestos e scripts/workflows para apontar aos novos caminhos.
- O prompt original `documentation/prompts/LcrNamingCorrectiveHotfixPrompt.md` **permanece histórico**, contendo os 25 nomes antigos como evidência de origem; esses nomes não são referências de execução.
- `code/scripts/lcr_naming.py` não foi enfraquecido ou alterado.
- Os números científicos, imagens originais e identidade visual permanecem inalterados.
- **Google Drive:** nenhum arquivo será enviado individualmente; o espelhamento segue o ciclo diário do ADR-0009, com status a verificar nos workflows de backup.

## Verificações no GitHub Actions

- LCR_NAMING: **zero violações**, sem exceções novas.
- LCR_AUDITORIA: aprovação no mesmo commit.
- LCR_PAGES: build, testes React/Vite e Python, verificação dos 11 PNGs e deploy público.
- LCR_INTERFACE_SMOKE: galeria, painel de inspeção, fluxo, inventário e mobile.
- O teste de integridade `code/tests/test_lcr_naming_migration.py` verifica nomes do manifesto, blobs PNG e referência a imagens ilustrativas no inventário.

**Reteste independente:** encaminhar este relatório e o commit estável ao Quality & Security Auditor (ADR-0008). Este relatório não constitui aprovação independente.
