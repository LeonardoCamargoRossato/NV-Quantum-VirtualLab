# Desenvolvimento da V0

## Executar
Use o checkout existente, sem criar worktree salvo solicitação explícita.
Requisitos: Node 22+ e Python 3.12.

```bash
cd code
npm ci
npm run dev
npm run build
npm test
```

Da raiz:

```bash
python -m unittest discover -s code/tests -p 'test_*.py' -v
python code/scripts/lcr_start.py --verify
python code/scripts/lcr_naming.py --check
python code/scripts/lcr_auditoria.py
```

## Importar inventário
A planilha permanece privada. O snapshot inicial foi gerado em 09/11/2026 UTC via leitura autorizada pelo conector Google Drive, com exatamente 33 registros reais. Para atualizar manualmente, exporte somente a aba Uncut Gem V1 como CSV UTF-8, guarde fora do checkout e confira os campos aprovados para publicação. Depois:

```bash
python code/scripts/sync_uncut_gem_inventory.py /caminho/privado/V1.csv --allow-public-snapshot
```

O importador mapeia cabeçalhos, exige as tags UG-V1-0001 a UG-V1-0033, valida URLs HTTPS e grava apenas os campos permitidos em code/public/data/InventoryV1.json. Fórmulas IMAGE não são utilizadas. Timestamp indica a importação, não atualização ao vivo; SHA-256 identifica os dados de origem (no snapshot inicial: JSON das linhas retornadas pelo conector; em importações por CSV: bytes da exportação). XLSX não é suportado nesta versão: exporte CSV. Depois confira os dados, imagens e autorização antes de commit.

## Imagens e hotspots
Fotografia DeviceV1.png e diagramas Layer1/2/3.png copiados sem modificações do projeto QuantumVillage/UncutGem, revisão fdc0fcb28f0962d59b279080658e2c11bf367494. Veja créditos e licença em code/public/assets/official/README.md. Os assets existentes em assets/components/illustrative são IA e permanecem nos caminhos originais para preservar links da planilha; não são usados como fotos reais. Seis hotspots visuais identificáveis sobre a fotografia oficial foram associados às tags da planilha: PCB, ESP32, amplificador RF, laser, conjunto do prisma e OLED. Os percentuais são relativos à fotografia, não ao painel, e acompanham zoom/pan. Itens não localizáveis não recebem marcador.

## Publicação
O workflow LCR_PAGES.yml testa e constrói em PR; em push main publica somente com snapshot validado de 33 itens. É necessário habilitar GitHub Pages com origem GitHub Actions nas configurações do repositório. O pedido atual autoriza entregar site; o bloqueio de dados impede uma entrega completa. Não há URL publicada verificada nesta execução.

O ambiente bloqueou docs.google.com, api.github.com e leonardocamargorossato.github.io. A ferramenta de configuração retornou INVALID_ARGUMENT. Liberar esses destinos nas configurações permite testar acesso real; isso não concede permissão à planilha privada. Se persistir falta de acesso Google, fornecer exportação CSV legítima.

## Evidências desta implementação
- Build TypeScript/Vite: passou.
- Vitest: 4 testes passaram (filtros, CSV seguro, URLs e validação de snapshot).
- Python unittest: 13 testes passaram (9 LCR existentes + 4 do importador).
- Chromium do sistema: fotografia carregada, zoom/reset, guia e Escape, mobile sem overflow, estado pendente e exportação desabilitada. Busca, filtro, ficha e download CSV testados com 33 fixtures sintéticas interceptadas somente no navegador; não são registros reais importados.
- Auditoria preliminar de segredos: zero alertas; não é auditoria exaustiva.
- Estrutura LCR: passou. SEO: passou com avisos de sitemap não publicado.
- Nomenclatura: 10 violações preexistentes (9 PNGs antigos e tradução histórica). Nenhum desses arquivos foi renomeado para evitar quebra de links ou modificação do histórico.
- Para repetir o teste de navegador: servidor ativo em code/; executar `node scripts/BrowserSmoke.mjs`. Variáveis opcionais APP_URL e CHROMIUM_PATH; requer Chromium instalado. Capturas ficam em /tmp/NvLabDesktop.png e /tmp/NvLabMobile.png.

## Continuação pelo Builder Aux
O acesso à aba Uncut Gem V1 do Google Sheets foi confirmado por conector autorizado em 09/11/2026 UTC. As 33 tags foram verificadas antes da criação do snapshot; o campo Imagem (fórmula IMAGE) não foi copiado, usando-se apenas URL da imagem. A publicação do snapshot não torna a planilha pública. A confirmação dos workflows e do site depende de execução do GitHub Actions e validação do endereço externo.
