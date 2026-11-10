# Builder 2 — PCB analog contour and toolbar hotfix: audit handoff

**Date:** 2026-11-09 (America/Sao_Paulo; execution crossed midnight).
**Implementer:** Builder 2 auxiliary. **Audit state:** awaiting independent Quality & Security Auditor retest and final human approval (ADR-0008).
**Scope:** real Uncut Gem V1 front-board region and shared scientific viewer; no new stack, permission, service, or architecture.

## Delivery traceability

- PR #3 (merged): https://github.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/pull/3
- Tested PR head: 1fab3e74f329bf32e1aec2cbbb367387daa8dbab.
- Main merge: 955dad4d4fc47a59b7f6699cdff71215923f5142.
- Automated Layer B PNG regeneration: be839abcccb78dfe15a2718b30d6924cef6b1054.
- Latest final main SHA must be verified independently after this report/test commit.

## Implemented

1. Four added front polygon tags: UG-V1-B031 (R3), B034 (C1), B035 (C2), B037 (C4). Coverage: 31 -> 35 of 69 components; nine subsystem polygons unchanged.
2. Layer B crop plan for R1-R5 and C1-C4 reconciled with sourceBox coordinates in ImagePresentation.json; R1 and R3 aliases no longer reuse the former reversed cropping. Rebuilt nine official physical PNG crops, manifest, bundle ZIP and checkpoint on main.
3. Persistent Subsistemas / Componentes / Nenhuma selector adjacent to Módulos e Visualização, independently anchored details dropdown; Componentes mode can reveal every visible frontal component or a selected subsystem.
4. Always available translucent floating Voltar à placa inteira action; toolbar Redefinir now resets only zoom and pan.
5. Tablet/mobile dropdown geometry corrected using the failed Chromium evidence: x=-82px at 768px; subsequent responsive smoke passed.
6. Canonical 79-item inventory preserved, with updated LayerBComponentImagePlan evidence SHA-256. Source workbook, Google Sheet, legacy archive and image originals unchanged.

## CI evidence before final handoff

- PR Pages / Python / Vitest / build: https://github.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/actions/runs/42747519674 — success.
- PR Interface Smoke desktop/mobile: https://github.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/actions/runs/42747519691 — success.
- PR Naming: https://github.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/actions/runs/42747519680 — success.
- PR automated audit: https://github.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/actions/runs/42747519940 — success.
- PR SEO: https://github.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/actions/runs/42747519715 — success.
- Main Pages and public delivery: https://github.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/actions/runs/42747754387 — success.
- Main Interface Smoke: https://github.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/actions/runs/42747754628 — success.
- Automated Layer B crops + bundle: https://github.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/actions/runs/42747754734 — success.

## Auditor gates

- Verify all five GitHub Actions checks on a common stable final main SHA after the present follow-up commit.
- Verify nine manifest crop coordinates and PNG files against ImagePresentation.json; Python test_regenerated_analog_layer_b_manifest is added to prevent regression.
- Visually inspect R1/R3 physical correspondence, the four new polygons and their crop previews on actual desktop, tablet and mobile browsers.
- Verify keyboard focus, screenreader labels, Escape behavior, polygon selection, zoom/pan reset, floating return, module dropdown edge alignment and fullscreen.
- Confirm copyright/credit labels remain unchanged and no personal/secret content is introduced.
- Scientific limitation: identification is photographic and provisional; check circuit reference in original KiCad/PCB silk before treating R3 as electrically confirmed.
- Audit report and human approval are not replaced by passing Actions. No per-file Drive upload; the daily backup remains governed by ADR-0009.

## Modified implementation surfaces

- code/src/ViewerToolbar.tsx, PhotoLayers.tsx, Workbench.tsx, Workbench.css, PhotoLayers.test.ts
- code/source/PhotoPolygons.json, evidence/LayerBComponentImagePlan.json, InventoryV1.json
- code/tests/test_image_presentation.py, code/scripts/BrowserPhotoLayersSmoke.mjs, BrowserAdaptiveViewerSmoke.mjs
- documentation/PhotoPolygonLayersUpgrade.md, ScientificViewerUpgrade.md
