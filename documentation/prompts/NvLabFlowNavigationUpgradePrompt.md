# NV Quantum Virtual Lab — Upgrade de navegação e fluxo do hardware

**Tipo:** upgrade de frontend autorizado pelo responsável.  
**Destino:** Builder / implementação na stack React + TypeScript + Vite existente.  
**Repositório:** https://github.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab  
**Website:** https://leonardocamargorossato.github.io/NV-Quantum-VirtualLab/  
**Referência arquitetural:** ADR-0007 (inventário fotográfico e privacidade da planilha).

## Requisitos e escopo
1. Conservar sidebar esquerda expansível/retrátil, com Explorar, Inventário, Entenda o Fluxo, Referências, Revisão Bibliográfica e Sobre o Projeto. Preservar Guia de montagem, Fundamentos e Artigos.
2. Eliminar rótulos de versões isolados na interface. Manter o nome próprio **Uncut Gem V1** e as tags canônicas do inventário sem alterações.
3. Usar um único painel de inspeção contextual, à esquerda do conteúdo principal, com reflow no desktop, controles expandir/reduzir/fechar e drawer mobile. Deve servir à PCB, inventário, fluxo e documentação.
4. Adicionar página de sete etapas de funcionamento: alimentação; ESP32; ramo óptico; ramo de micro-ondas (ADF4351/amp/cabo/antena); prisma NV; BPW34/TL082; ADC/OLED. Mostrar explicitamente dois ramos paralelos convergindo no prisma.
5. Cada etapa apresenta descrição, imagem real verificada (ou diagrama identificado, quando foto individual não é possível), links às fontes e botão **Ver na PCB**, preservando o vínculo por tags do inventário. Nunca inventar localização física de itens encapsulados ou montados no verso.
6. Ao clicar no título/ação, abrir o inspetor contextual; ao clicar na imagem, abrir galeria com zoom, etapas numeradas, fonte, setas e fechar.
7. Preservar photo viewer, hotspots, inventário de 33 componentes, busca, filtros, exportação CSV, PDF aberto do arXiv, referências Springer e separação da revisão científica privada.
8. Adicionar Sobre o Projeto: objetivos didáticos, contexto acadêmico independente e trilha futura de modelagem matemática/3D/integrações, rotulados como não implementados.
9. Identidade inspirada no ITA, com atribuição sem alegar endosso, autoria Leonardo Camargo Rossato e link portfólio no rodapé da sidebar.

## Segurança e escopo excluído
Não alterar Google Sheets, banco de dados, autenticação, permissões, datasets privados, backend, modelos experimentais ou hardware. Não incorporar PDFs Springer restritos ou simulações inventadas. A fonte é a montagem documentada pelo Quantum Village.

## Aceite e validação
- 9 entradas de navegação (6 obrigatórias + 3 preservadas) sem labels de versão soltos.
- 7 etapas; paralelismo das etapas 3/4; acesso às fotografias em modal sequencial.
- Inspetor e botão Ver na PCB testados pelo Chromium e links exatos do inventário.
- Testes: npm test, npm run build, Python unittest, BrowserSmoke desktop/mobile, verificação Pages dos PNGs.
- Entregar commit, URLs do projeto e do deploy, testes reais, limitações honestas e nota de ADR.

**ADR avaliado:** não necessário — extensão do frontend sem mudança de stack, privacidade ou serviços externos. Conserva-se o ADR-0007.
