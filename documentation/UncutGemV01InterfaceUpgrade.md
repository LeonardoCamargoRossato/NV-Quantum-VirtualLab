# NV Quantum Virtual Lab — Upgrade V0.1 de interface

## Escopo implementado
- Navegação principal na lateral esquerda, expansível/retrátil, com 7 abas exatas organizadas em Laboratório e Estudo e Pesquisa.
- Fotografia oficial V1 preenche a área principal, sem introdução institucional e sem cartão promocional à direita.
- Seleção de hotspots abre inspetor integrado ao layout no desktop, adjacente à fotografia; CSS drawer no mobile.
- Fullscreen API com fallback, controle de zoom/pan, indicadores de seleção e acessibilidade para foco e clique.
- Recortes fotográficos visuais (CSS; não PNG autônomo) da própria foto oficial V1 para PCB, ESP32, amplificador RF, laser, prisma e OLED. Coordenadas e procedência no PhotoRegions.ts.
- Inventário V1 com 33 tags reais preservado; pesquisa, filtros, exportação CSV e fichas.
- Guia com diagramas originais das três camadas, Fundamentos, biblioteca de Artigos e Referências com 3 visões e links originais.
- Revisão bibliográfica aponta para a base privada, sem importar registros nem divulgar dados de pesquisa.
- Identidade inspirada nas cores ITA. Logomarca servida por origem institucional com fallback textual, não redistribuída como ativo local.
- Nenhuma mudança em banco de dados, autenticação, conteúdo das planilhas, V2/3D ou simulação ODMR.

## Origem das informações
1. Fotografia e guia: https://github.com/QuantumVillage/UncutGem/blob/main/BuildGuide/BuildGuide.md
2. Hardware e óptica: https://github.com/QuantumVillage/UncutGem/tree/main/hardware
3. arXiv 2509.18329: https://arxiv.org/abs/2509.18329 — Mark Carney, Victoria Kumaran (preprint 2025).
4. Springer DOI 10.1007/978-3-032-13852-1_7 — capítulo de conferência publicado online 21/02/2026, pp. 55–64; versão fechada não foi hospedada.
5. Stegemann et al. 2023, European Journal of Physics 44, 035402 — DOI 10.1088/1361-6404/acbe7c.
6. Frellsen e Ahmadi 2018, Quantum Views 2, 10 — DOI 10.22331/qv-2018-07-17-10.
7. Marca ITA: https://www.bibl-old.ita.br/logomarca_ita.htm e visualização remota em subdomínio institucional pgfis.ita.br.
8. Inventário mestre: https://docs.google.com/spreadsheets/d/158OGccBdF5Hf6qdWIH2-Tmt_-gU8sO8pz3CvyTpycXU/edit (permanece privado).

## Limitações explícitas
- O recorte digital usa pixels da fotografia geral. Não constitui fotografia comercial isolada do produto e não revela detalhes encapsulados no prisma.
- Fotos individuais de componentes não identificáveis não foram inventadas; o app exibe aviso de ausência.
- A leitura do PDF do arXiv em iframe depende do navegador e das políticas de incorporação. Há sempre botão direto Abrir PDF livre.
- O site Quantum Village é representado por uma fotografia oficial e link, não imitação ou captura do site.
- O repositório GitHub é apresentado por metadados estáticos verdadeiros e link, não iframe falso.
- A base bibliográfica privada não foi divulgada. O snapshot público do inventário V1 foi preservado sem atualização.
- A logo remota pode falhar em rede externa: existe fallback “ITA” em texto. Sem afirmação de endosso oficial.
- Anotações de bounding boxes são coordenadas percentuais inspecionadas; podem ser refinadas a partir de exame visual do usuário.

## Testes e publicação confirmados — 09/11/2026 UTC
- Build + TypeScript: npm run build aprovado no GitHub Actions.
- Vitest: 6 de 6 testes passaram.
- Python unittest: 15 de 15 testes passaram.
- Playwright Chromium: smoke funcional desktop/mobile aprovado, incluindo sete abas, zoom/fallback tela cheia, sidebar aberta/fechada, inspector com reflow, busca/CSV com 33 registros, referências e responsividade.
- Capturas: [V01VisualEvidence](https://github.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/actions/runs/42546579261/artifacts/13643876608) — 5 imagens PNG: sidebar aberta, inspector, sidebar recolhida, referências e mobile.
- Publicação: [GitHub Pages / deploy](https://github.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/actions/runs/42546579254) confirmou https://leonardocamargorossato.github.io/NV-Quantum-VirtualLab/.
- Limitação: ferramenta de navegação web externa deste chat não abriu a URL GitHub Pages, mas CI executou o navegador no ambiente Vite e o deploy foi confirmado pelo GitHub Actions. Revisão humana do endereço publicado recomendada.
- LCR Naming/Auditoria: seguem com 10 violações de nomes anteriores (9 PNGs linkados e 1 arquivo histórico). A verificação de segredos dentro da Auditoria concluiu sucesso.
 
## Comandos para reproduzir
- Rodar: cd code && npm ci && npm test && npm run build
- Rodar: python -m unittest discover -s code/tests -p 'test_*.py' -v
- Rodar: python code/scripts/lcr_naming.py --check
- Smoke de browser: .github/workflows/LCR_INTERFACE_SMOKE.yml ou node code/scripts/BrowserSmoke.mjs com servidor Vite ativo.
- GitHub Pages: https://leonardocamargorossato.github.io/NV-Quantum-VirtualLab/
- Naming e Auditoria LCR podem persistir com dez violações anteriores: nove PNGs com links estáveis e documento histórico em inglês. Não quebrar links nem reescrever história para mascarar falhas.

## Governança
ADR avaliado: não necessário — evolução visual e editorial na stack React existente, sem alterar contrato de privacidade do ADR-0007, sem backend/serviços ou nova decisão arquitetural.
