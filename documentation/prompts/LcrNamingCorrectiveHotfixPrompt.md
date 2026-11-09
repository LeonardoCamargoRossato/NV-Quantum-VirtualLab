# HotfixPrompt — Corrigir as 25 violações LCR_NAMING

- **Tipo:** hotfix de nomenclatura com regressão
- **Destinatário:** Builder / Codex
- **Repositório:** https://github.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab
- **Data:** 2026-11-09 (hora não verificada)
- **Problema:** LCR_NAMING e LCR_AUDITORIA falham por 25 nomes fora do padrão (observação anterior; recontar no HEAD antes da implementação).

## Fontes obrigatórias
Ler `AGENTS.md`, `documentation/LCR_GUARDRAILS.md`, `documentation/LCR_NAMING_CONVENTIONS.md`, `documentation/LCR_WORKFLOW.md`, `documentation/decision-archive/ADR-0002-nomenclatura.md` e o template canônico `.agents/skills/lcr-prompt-generator/templates/HotfixPrompt.md`.

## Inventário inicial de 25 violações
`assets/components/illustrative/` (9):
`ug-v1-capacitor-ceramico-ilustrativo.png`, `ug-v1-capacitor-eletrolitico-ilustrativo.png`, `ug-v1-capacitor-smd-ilustrativo.png`, `ug-v1-ima-neodimio-cubo-ilustrativo.png`, `ug-v1-ima-neodimio-disco-ilustrativo.png`, `ug-v1-power-bank-usb-ilustrativo.png`, `ug-v1-prancha-8-componentes-ilustrativa.png`, `ug-v1-resistor-axial-ilustrativo.png`, `ug-v1-resistor-smd-ilustrativo.png`.

`code/public/assets/official/v1/enhanced/` (13):
`manifest.json`, `ug-v1-above-esp32-enhanced.png`, `ug-v1-between-rf-and-esp32-enhanced.png`, `ug-v1-esp32-enhanced.png`, `ug-v1-laser-driver-enhanced.png`, `ug-v1-laser-enhanced.png`, `ug-v1-oled-enhanced.png`, `ug-v1-overview-enhanced.png`, `ug-v1-pcb-enhanced.png`, `ug-v1-prism-enhanced.png`, `ug-v1-recortes-aprimorados.zip`, `ug-v1-rf-amp-enhanced.png`, `ug-v1-rf-cable-enhanced.png`.

Scripts Python (2): `code/scripts/BuildLayerBComponentImages.py`, `code/scripts/BuildUncutGemV1Subsystems.py`.
Documento (1): `documentation/history/TheJourneyOfBuildingTheLCRWorkflow_EN.md`.

## Execução segura
1. Confirmar branch, commit e saída atual do `LCR_NAMING`; trabalhar em commit estável, sem mudanças concorrentes de outros agentes no mesmo arquivo.
2. Criar mapa `antigo → novo`. Preservar binários e nomes técnicos contratualmente exigidos, justificando eventuais exceções específicas; não enfraquecer o verificador artificialmente.
3. Atualizar imports, caminhos, referências a PNG/ZIP, manifestos, scripts, testes, GitHub Actions, documentação, URLs estáticas do site e eventuais referências na planilha do Google **apenas com permissão de escrita e sem torná-la pública**.
4. Conferir em especial `code/src/EnhancedPhotoAssets.ts`, `code/scripts/enhance_uncut_gem_v1.py`, `code/scripts/BrowserSmoke.mjs`, `code/public/assets/official/v1/enhanced/manifest.json` e workflows de Pages/imagens. Verificar os caminhos existentes no HEAD.
5. Correção mínima, sem refatoração científica/UI e sem upload ao Drive por arquivo.

## Aceite e evidências
- `python code/scripts/lcr_naming.py --check` → **zero violações**.
- `python -m unittest discover -s code/tests -p 'test_*.py' -v` → aprovado.
- `cd code && npm ci && npm test && npm run build` → aprovado.
- Validar imports, fotos, JSON/manifesto, links, smoke desktop/mobile.
- GitHub Actions `LCR_NAMING`, `LCR_AUDITORIA`, `LCR_PAGES` e `LCR_INTERFACE_SMOKE` aprovados no **mesmo commit estável**; não confundir falha OAuth do backup com nomenclatura.
- Entregar mapa de renomes, diff, logs, SHA/branch, regressões e pendências ao Auditor para reteste independente.

**Sem execução automática deste prompt.** O Builder/Codex implementa; Auditor faz o parecer final (ADR-0008).
