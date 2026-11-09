# Hotfix — Revisão Bibliográfica e Dashboard Cientométrico

**Tipo:** hotfix funcional e visual sobre React/TypeScript/Vite existente  
**Data da implementação:** 2026-11-09  
**Repositório:** https://github.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab

## Origem e integridade científica

Os indicadores foram confirmados por leitura autorizada da planilha privada **Doutorado ITA — Revisão NV + INS | 172 artigos analisados (Scopus + WoS)**, principalmente a aba `Resumo e critérios`, e pelo artigo principal **Artigo V0 | ITA — Magnetometria quântica NV e navegação inercial sem GNSS — Revisão cientométrica**. O artigo complementar **Artigo V0 — Revisão Cienciométrica da Magnetometria NV Aberta na Navegação Inercial sem GNSS | ITA** foi consultado.

### Contagens, sem mistura entre fases

| Etapa | Quantidade |
|---|---:|
| Resultados exibidos nas interfaces: Scopus 261 + WoS 186 | 447 |
| Exportados: Scopus 233 + WoS 186 | 419 |
| Duplicatas removidas | 174 |
| Documentos únicos | 245 |
| Recomendados pela triagem inicial de título e resumo | 122 |
| Em dúvida na triagem inicial | 50 |
| Não recomendados na triagem inicial (fora da planilha de 172) | 73 |
| Registros na aba de artigos | 172 |

A aba `Resumo e critérios` distingue uma **classificação sugerida posterior dos 172 registros**: 63 `Manter`, 59 `Apoio teórico`, 50 `Solicitar texto completo` e 0 `Excluir`. Não atribuir esses números às categorias da triagem inicial dos 245. Os 28 registros E2 da Scopus não exportados permanecem uma limitação.

### Equações finais

As estratégias E1 (sensoriamento quântico e navegação), E2 refinada (NV compacto/aberto) e E3 refinada (INS auxiliado por magnetometria clássica) foram transcritas literalmente do artigo V0 para `code/src/ScientometricData.ts`. Em busca avançada, o artigo orienta usar `TITLE-ABS-KEY(...)` na Scopus e `TS=(...)` na Web of Science; em busca simples, somente a expressão booleana. A referência ao acesso institucional é **Portal CAPES**, não foi encontrada uma sigla metodológica "CAF" confirmada na fonte.

## Fontes originais (permissões preservadas)

- Planilha privada: https://docs.google.com/spreadsheets/d/1ID0MHrg_-2Fx37vGR8SMhoILLs6E8WR8CnMV4mlf734/edit
- PDF exportado e privado: https://drive.google.com/file/d/1pouGbfNMHSnZkp-MIDdNgP34CJXlA7aG/view
- Documento principal cientométrico: https://docs.google.com/document/d/12TKAwbNWHPy99cCV4XF26fLyAKZGOUkNwMoBGCkuOhE/edit
- Documento de apoio: https://docs.google.com/document/d/1ylp9JnYox8yULs5msb1bzgS7i7B_1keRxkDUyuhXdiU/edit

### Identificação do PDF

Na pasta do Drive contendo as fontes originais, **não foi localizado o PDF antigo da revisão cientométrica**. O arquivo `Modelagem Físico-Computacional de Magnetômetros Quânticos NV para Navegação Inercial sem GNSS.pdf` não é substituto e foi excluído desta implementação.

Para viabilizar o visualizador com fonte correta, em 09/11/2026 foi **exportada uma nova cópia fiel em PDF** do Google Docs cientométrico principal e salva na mesma pasta privada de origem, sem mudar permissões. Arquivo: [RevisaoCientometricaNvInsArtigoV0_Export2026-11-09.pdf](https://drive.google.com/file/d/1pouGbfNMHSnZkp-MIDdNgP34CJXlA7aG/view). Metadados verificados: 1.115.379 bytes, 41 páginas A4, permissões Google Drive retornadas: somente proprietário.

O PDF exportado foi inspecionado localmente com utilitários PDF. As **quatro figuras originais** aparecem nas páginas:
- Figura 1 — fluxo de busca/seleção: **7**;
- Figura 2 — produção anual dos 63 artigos: **8**;
- Figura 3 — país de afiliação do primeiro autor: **9**;
- Figura 4 — arquitetura conceitual proposta: **12**.

Os gráficos originais contêm dados agregados e não foram regenerados. Para preservar confidencialidade, os PNGs extraídos da fonte privada **não foram versionados no GitHub público**. O site carrega as páginas do PDF via visualização autenticada do Drive; alguns navegadores podem ignorar âncoras de página ou bloquear cookies de terceiros. Como alternativa, o usuário pode selecionar a cópia PDF localmente, permitindo navegação por página sem upload. As páginas do carrossel são verificadas e podem ser refinadas no navegador.

## Arquitetura da interface

- `code/src/Workbench.tsx`: sidebar Revisão Bibliográfica expansível com Artigos, Revisão Cientométrica e Revisão de Patentes.
- `code/src/StudyPages.tsx`: mantém Artigos, agora dentro do submenu; rotas atualizadas.
- `code/src/ScientometricDashboard.tsx`: dashboard KPI, método, planilha e visores; placeholder de patentes.
- `code/src/ScientometricData.ts`: métricas e equações auditadas (somente agregados; sem linhas bibliográficas privadas).
- `code/src/ResearchCsv.ts`: parser CSV local e filtros.
- `code/src/Workbench.css`: dashboard responsivo e componentes de leitura privada.
- `code/src/ResearchCsv.test.ts`: testes de consistência das contagens e do parser.
- `code/scripts/BrowserSmoke.mjs`: regressão do menu e do dashboard via Chromium.

## Planilha privada: limitações técnicas e privacidade

O GitHub Pages é público e estático. Não tem OAuth do Google nem acesso ao conector privado do ChatGPT: **não pode ler automaticamente as 172 linhas sem uma autorização própria**. A prévia `/preview` do Google Sheets depende do navegador autenticado e da política de incorporação do Google; caso bloqueie, há link direto ao original.

A visualização tabular pesquisável requer que o usuário selecione localmente um CSV da aba `Artigos - 172`; o parser faz buscas e filtros **na memória do navegador**, sem upload, armazenamento persistente, analytics de conteúdo ou publicação da base. Não foi criado botão de download, serviço externo ou alteração de compartilhamento.

## Testes e critérios pendentes

A aprovação integral ainda exige a validação visual, no navegador autenticado do proprietário, dos embeds do Google Sheets e do PDF Drive. A cópia PDF correta e as páginas 7, 8, 9 e 12 estão confirmadas; a extração de PNGs para um carrossel servido diretamente pelo site permanece intencionalmente não realizada para proteger a privacidade dos arquivos. O build e o smoke test da interface são checados por GitHub Actions; os resultados devem ser registrados somente após suas respectivas execuções.

**ADR avaliado: não necessário** — extensão de páginas e componentes na arquitetura existente; preservada a separação entre dados privados e website público. Reavaliar ADR caso futuramente se decida por OAuth ou backend autenticado.
