import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
const shots = process.env.SCREENSHOT_DIR || "/tmp";
mkdirSync(shots, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 950 }, acceptDownloads: true });
const errors = [];
page.on("pageerror", e => errors.push(e.message));
try {
  await page.goto(process.env.APP_URL || "http://127.0.0.1:5173/NV-Quantum-VirtualLab/", { waitUntil: "domcontentloaded" });
  await page.getByRole("heading", { name: "Explorar" }).waitFor();
  await page.getByRole("button", { name: "Inspecionar Laser verde" }).waitFor();
  // A primeira visita abre o Laboratório e os itens da Uncut Gem V1.
  const labGroup = page.getByRole("button",{name:"Laboratório",exact:true});
  const v1Branch = page.getByRole("button",{name:"Uncut Gem V1",exact:true});
  const researchGroup = page.getByRole("button",{name:"Estudo e Pesquisa",exact:true});
  assert.equal(await labGroup.getAttribute("aria-expanded"),"true");
  assert.equal(await v1Branch.getAttribute("aria-expanded"),"true");
  assert.equal(await researchGroup.getAttribute("aria-expanded"),"false");
  assert.equal(await page.locator(".side-navigation button:visible").count(),9);
  // Expandir/recolher independentemente, sem navegar para páginas fictícias.
  await v1Branch.click();
  assert.equal(await v1Branch.getAttribute("aria-expanded"),"false");
  await v1Branch.click();
  assert.equal(await v1Branch.getAttribute("aria-expanded"),"true");
  await labGroup.click();
  assert.equal(await labGroup.getAttribute("aria-expanded"),"false");
  await labGroup.click();
  assert.equal(await labGroup.getAttribute("aria-expanded"),"true");
  // V2 e modelo 3D são placeholders honestos, com rotas próprias.
  await page.getByRole("button",{name:/Uncut Gem V2.*Ainda não implementado/}).click();
  await page.getByRole("heading",{name:"Uncut Gem V2"}).waitFor();
  await page.getByText("Ainda não identificado · Ainda não implementado").waitFor();
  const model3d = page.getByRole("button",{name:/NV-Print 3D Stegemann/});
  assert.equal(await model3d.getAttribute("title"),"Implementações futuras");
  await model3d.click();
  await page.getByRole("heading",{name:"NV-Print 3D Stegemann"}).waitFor();
  await page.getByText("Implementações futuras",{exact:true}).first().waitFor();
  await page.getByRole("button",{name:"Voltar ao Uncut Gem V1"}).click();
  await page.getByRole("heading",{name:"Explorar"}).waitFor();
  assert.equal(await v1Branch.getAttribute("aria-expanded"),"true");
  console.log("PASS: árvore Laboratório / V1 / V2 / NV-Print 3D Stegemann e rotas futuras.");
  assert(await page.locator(".photo-stage>img").evaluate(img => img.complete && img.naturalWidth > 0), "Imagem original precisa carregar");
  // Regressão do hotfix: os 11 recortes estavam no Git, mas faltaram no deploy.
  const expectedEnhancedPngs = [
    "UgV1OverviewEnhanced.png", "UgV1PcbEnhanced.png",
    "UgV1Esp32Enhanced.png", "UgV1RfAmpEnhanced.png",
    "UgV1LaserEnhanced.png", "UgV1PrismEnhanced.png",
    "UgV1OledEnhanced.png", "UgV1RfCableEnhanced.png",
    "UgV1BetweenRfAndEsp32Enhanced.png",
    "UgV1AboveEsp32Enhanced.png", "UgV1LaserDriverEnhanced.png",
  ];
  const assetsRoot = new URL("assets/official/v1/enhanced/", page.url());
  for (const fileName of expectedEnhancedPngs) {
    const assetUrl = new URL(fileName, assetsRoot).href;
    const response = await page.request.get(assetUrl);
    assert(response.ok(), "Imagem não publicada: " + assetUrl + " (HTTP " + response.status() + ")");
    assert((response.headers()["content-type"] || "").includes("image/png"), "Conteúdo não PNG: " + assetUrl);
    const bytes = await response.body();
    assert(bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])), "PNG inválido: " + assetUrl);
  }
  await page.waitForFunction(
    () => [...document.querySelectorAll(".enhanced-gallery-card img")].length === 4 &&
      [...document.querySelectorAll(".enhanced-gallery-card img")].every(i => i.complete && i.naturalWidth > 0),
    undefined, { timeout: 12000 },
  );
  console.log("PASS: 11 arquivos PNG aprimorados acessíveis pelo caminho público e galeria carregada.");
  await page.screenshot({ path: join(shots,"NvLabV01SidebarOpen.png"), fullPage: true });

  const panelBefore = await page.locator(".photo-panel").evaluate(el => el.getBoundingClientRect().width);
  await page.getByRole("button", { name: "Inspecionar Laser verde" }).click();
  await page.getByRole("complementary", { name: /Painel de informações/ }).waitFor();
  assert(await page.getByText("Recorte de fotografia oficial", { exact: false }).isVisible());
  assert(await page.locator(".inspector .crop-shell img").evaluate(i => i.complete && i.naturalWidth > 0), "Imagem individual do laser não carregou");
  const panelWithInspector = await page.locator(".photo-panel").evaluate(el => el.getBoundingClientRect().width);
  assert(panelWithInspector < panelBefore, "Foto deve refluir à direita com inspector");
  await page.screenshot({ path: join(shots,"NvLabV01Inspector.png"), fullPage: true });
  // Recorte ampliado deve exibir a imagem do laser, não uma área cinza/alt quebrado.
  await page.getByRole("button", { name: "Ampliar recorte real: Laser verde" }).click();
  await page.getByRole("dialog", { name: /Recorte aprimorado do Uncut Gem V1/ }).waitFor();
  assert(await page.locator(".lightbox-dialog .crop-shell img").evaluate(i => i.complete && i.naturalWidth > 0));
  await page.getByRole("button", { name: "Fechar imagem" }).click();
  await page.getByRole("button", { name: "Expandir painel" }).click();
  assert(await page.locator(".workspace-layout.wide-inspector").isVisible());
  await page.getByRole("button", { name: "Fechar inspetor" }).click();
  assert(await page.locator(".inspector").count() === 0);

  await page.getByRole("button", { name: "Recolher menu lateral" }).click();
  assert(await page.locator(".menu-collapsed").count() === 1);
  await page.waitForTimeout(350);
  const panelCollapsed = await page.locator(".photo-panel").evaluate(el => el.getBoundingClientRect().width);
  console.log("Larguras da foto (inicial, com inspetor, menu recolhido):", panelBefore, panelWithInspector, panelCollapsed);
  assert(panelCollapsed > panelBefore + 70, "Menu recolhido deve aumentar a foto");
  await page.screenshot({ path: join(shots,"NvLabV01SidebarClosed.png"), fullPage: true });
  await page.getByRole("button", { name: "Expandir menu lateral" }).click();

  await page.getByRole("button", { name: "Aumentar zoom", exact: true }).click();
  assert.equal(await page.locator(".photo-controls output").textContent(), "125%");
  await page.getByRole("button", { name: "Redefinir" }).click();
  assert.equal(await page.locator(".photo-controls output").textContent(), "100%");
  // Chromium headless manipula a top-layer nativa de modo diferente do navegador interativo;
  // testar aqui o fallback CSS para ambientes sem Fullscreen API, sem falsear a saída.
  await page.evaluate(() => Object.defineProperty(Element.prototype, "requestFullscreen", {configurable:true, value:undefined}));
  await page.getByRole("button", { name: "Tela cheia da fotografia" }).click();
  assert(await page.evaluate(() => Boolean(document.fullscreenElement) || Boolean(document.querySelector(".full-fallback"))));
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => !document.fullscreenElement && !document.querySelector(".full-fallback"), undefined, {timeout: 8000});

  await page.getByRole("button", { name: "Inventário", exact: true }).click();
  await page.getByText("33 de 33 itens", { exact: false }).waitFor();
  // Árvore da Camada B: capacitores, filtro por face e prévias ainda não aprovadas.
  await page.getByRole("heading",{name:"Pesquisar componentes"}).waitFor();
  await page.getByText("10 de 69 componentes encontrados",{exact:false}).waitFor();
  assert.equal(await page.locator(".v1-tree-card").count(),10);
  assert.equal(await page.locator(".v1-tree-pending").count(),0,"Os seis recortes C5–C10 foram aprovados.");
  const approvedCapImages = page.locator('.v1-tree-card .v1-tree-thumb img[src*="UgV1B00"]');
  await page.waitForFunction(() => {
    const images = [...document.querySelectorAll('.v1-tree-card .v1-tree-thumb img[src*="UgV1B00"]')];
    return images.length === 6 && images.every(image => image.complete && image.naturalWidth > 0);
  }, undefined, {timeout: 18000});
  assert.equal(await approvedCapImages.count(),6,"Seis imagens oficiais dos footprints devem carregar.");
  await page.getByRole("combobox",{name:"Filtrar face da PCB"}).selectOption("Verso");
  assert.equal(await page.locator(".v1-tree-card").count(),0,"Capacitores C1–C10 são da frente da PCB.");
  await page.getByRole("combobox",{name:"Filtrar face da PCB"}).selectOption("Frente");
  assert.equal(await page.locator(".v1-tree-card").count(),10);
  await page.screenshot({path:join(shots,"NvLabV01CapacitorsApproved.png"),fullPage:true});
  await page.locator(".inventory-filters input[type=search]").fill("UG-V1-0028");
  await page.getByText("1 de 33 itens", { exact: false }).waitFor();
  const expectedDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: "CSV · filtrados" }).click();
  assert.equal((await expectedDownload).suggestedFilename(), "UncutGemV1Filtrado.csv");
  // Nova experiência: fluxo, inspetor compartilhado, imagens e correlação com PCB.
  await page.getByRole("button", { name: "Entenda o Fluxo" }).click();
  await page.getByRole("heading", { name: "Entenda o Fluxo" }).waitFor();
  assert.equal(await page.locator("[data-flow-step]").count(), 7);
  assert.equal(await page.locator(".flow-parallel [data-flow-step]").count(), 2);
  await page.screenshot({path:join(shots,"NvLabFlowDesktop.png"),fullPage:true});
  await page.locator('[data-flow-step="optico"] .flow-title-button').click();
  await page.getByRole("complementary", {name:/Painel de informações/}).waitFor();
  assert(await page.locator(".workspace-layout.has-inspector").count()===1);
  await page.screenshot({path:join(shots,"NvLabFlowInspector.png"),fullPage:true});
  await page.locator(".context-inspector").getByRole("button", {name:"Ver na PCB"}).click();
  await page.getByRole("heading", {name:"Explorar"}).waitFor();
  assert(await page.getByRole("complementary",{name:/Painel de informações: Laser verde/}).isVisible());
  assert(await page.locator('.hotspot.is-selected').count()===1,"Laser precisa ficar destacado na PCB");

  await page.getByRole("button", { name: "Entenda o Fluxo" }).click();
  await page.locator('[data-flow-step="microondas"] .flow-image-open').click();
  await page.getByRole("dialog", {name:/Etapa 4/}).waitFor();
  await page.getByRole("button", {name:"Próxima imagem"}).click();
  assert(await page.getByRole("dialog",{name:/Etapa 5/}).isVisible());
  await page.getByRole("button", {name:"Imagem anterior"}).click();
  assert(await page.getByRole("dialog",{name:/Etapa 4/}).isVisible());
  await page.getByRole("button", {name:"Fechar imagem"}).click();
  assert.equal(await page.getByRole("dialog").count(),0);
  console.log("PASS: fluxo com ramos paralelos, inspector compartilhado, galeria e Ver na PCB.");

  await page.getByRole("button", { name: "Guia de montagem" }).click();
  assert.equal(await page.locator(".layer-grid img").count(), 3);
  await researchGroup.click();
  assert.equal(await researchGroup.getAttribute("aria-expanded"),"true");
  await page.getByRole("button", { name: "Fundamentos" }).click();
  assert.equal(await page.locator(".fundamental").count(), 6);
  const reviewBranch=page.getByRole("button",{name:"Revisão Bibliográfica",exact:true});
  await reviewBranch.click();
  assert.equal(await reviewBranch.getAttribute("aria-expanded"),"true");
  await page.getByRole("button", { name: "Artigos",exact:true }).click();
  assert.equal(await page.locator(".paper-card").count(), 3);
  await page.getByRole("button", { name: "Revisão Cientométrica" }).click();
  await page.getByRole("heading",{name:"Revisão Cientométrica",exact:true}).waitFor();
  assert.equal(await page.locator(".sciento-kpi").count(),7);
  assert(await page.getByText("419",{exact:true}).isVisible());
  assert(await page.getByText("245",{exact:true}).isVisible());
  assert(await page.getByText("172",{exact:true}).isVisible());
  assert.equal(await page.locator(".sciento-equation").count(),3);
  assert.equal(await page.locator(".sciento-figures .sciento-figure-navigation").count(),1);
  assert.equal(await page.getByRole("button",{name:"Copiar equação de busca"}).count(),3);
  assert.equal(await page.getByRole("link",{name:/Abrir no Google Planilhas/}).count(),1);
  assert.equal(await page.getByRole("button",{name:/baixar/i}).count(),0,"Sem botão de download no dashboard");
  await page.getByRole("button",{name:"Tabela pesquisável"}).click();
  await page.locator('input[accept=".csv,text/csv"]').setInputFiles({
    name:"TestePrivado.csv",mimeType:"text/csv",
    buffer:Buffer.from('Nº,Sua decisão,Título original,Autores,Palavras-chave originais\n1,Manter,Quantum magnetometer,Alice,NV centers\n2,Apoio teórico,Magnetic navigation,Bob,INS\n')
  });
  await page.getByText("2 de 2 linhas exibidas.",{exact:false}).waitFor();
  await page.getByRole("searchbox",{name:/Buscar título/}).fill("Quantum");
  await page.getByText("1 de 2 linhas exibidas.",{exact:false}).waitFor();
  await page.getByRole("button",{name:"Expandir",exact:true}).click();
  assert.equal(await page.locator(".sciento-sheet-panel.expanded").count(),1);
  await page.getByRole("button",{name:"Fechar ampliação"}).click();
  assert.equal(await page.locator(".sciento-sheet-panel.expanded").count(),0);
  await page.getByRole("button",{name:"Figura anterior"}).click();
  assert(await page.getByText("Figura 4 de 4",{exact:true}).isVisible());
  await page.getByRole("button",{name:"Próxima figura"}).click();
  assert(await page.getByText("Figura 1 de 4",{exact:true}).isVisible());
  assert((await page.locator(".sciento-figures iframe").getAttribute("src")).includes("1pouGbfNMHSnZkp-MIDdNgP34CJXlA7aG"),"Carrossel deve apontar ao PDF cientométrico correto");
  assert((await page.locator(".sciento-document iframe").getAttribute("src")).includes("1pouGbfNMHSnZkp-MIDdNgP34CJXlA7aG"),"Visualizador deve apontar ao PDF cientométrico correto");
  await page.getByRole("button",{name:"Ampliar figura 1"}).click();
  await page.getByRole("dialog",{name:"Figura 1 ampliada"}).waitFor();
  assert(await page.getByRole("dialog",{name:"Figura 1 ampliada"}).locator("iframe").getAttribute("src"));
  await page.getByRole("button",{name:"Fechar figura ampliada"}).click();
  assert.equal(await page.getByRole("dialog",{name:"Figura 1 ampliada"}).count(),0);
  await page.getByRole("button",{name:"Revisão de Patentes"}).click();
  await page.getByRole("heading",{name:"Revisão de Patentes"}).waitFor();
  assert(await page.getByText("EM BREVE · IMPLEMENTAÇÃO FUTURA").isVisible());
  await page.getByRole("button",{name:"Revisão Cientométrica"}).click();
  await page.getByRole("heading",{name:"Revisão Cientométrica",exact:true}).waitFor();
  await page.screenshot({path:join(shots,"NvLabScientometricDashboard.png"),fullPage:true});
  console.log("PASS: review hierarchy, real aggregates, equations, in-browser CSV search and future patents.");
  await page.getByRole("button", { name: "Referências Diretas Virtual Lab" }).click();
  assert(await page.getByRole("button",{name:"Referências Diretas Virtual Lab"}).evaluate(el=>getComputedStyle(el).whiteSpace==="normal"),"A sidebar deve permitir o rótulo em duas linhas");
  assert.equal(await page.locator(".reference-triptych .preview-card").count(), 3);
  await page.getByRole("button", {name:"Inspecionar referência"}).click();
  assert(await page.getByRole("complementary",{name:/Painel de informações: Uncut Gem/}).isVisible());
  await page.getByRole("button",{name:"Fechar inspetor"}).click();
  await page.getByRole("button", {name:"Sobre o Projeto"}).click();
  await page.getByRole("heading",{name:"Sobre o Projeto"}).waitFor();
  await page.getByRole("button", {name:"Referências Diretas Virtual Lab"}).click();

  await page.screenshot({ path: join(shots,"NvLabV01References.png"), fullPage: true });

  await page.setViewportSize({width:390,height:844});
  await page.reload({waitUntil:"domcontentloaded"});
  await page.getByRole("heading", {name:"Referências Diretas Virtual Lab"}).waitFor();
  assert(await page.getByRole("button",{name:"Referências Diretas Virtual Lab"}).count()===1,"Menu de fontes diretas precisa existir");
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "Sem overflow horizontal no mobile");
  await page.getByRole("button", {name:"Abrir menu lateral"}).click();
  await page.getByRole("button", {name:"Laboratório",exact:true}).click();
  await page.getByRole("button", {name:"Uncut Gem V1",exact:true}).click();
  await page.getByRole("button", {name:"Explorar",exact:true}).click();
  await page.getByRole("button", {name:"Inspecionar Laser verde"}).waitFor();
  await page.getByRole("button", {name:"Inspecionar Laser verde"}).click();
  await page.screenshot({path:join(shots,"NvLabV01MobileInspector.png"),fullPage:true});
  assert.equal(errors.length,0,"Erros JavaScript: "+errors.join("; "));
  console.log("PASS: sidebar hierárquica, inspector reflow, 33 componentes, CSV, 9 páginas existentes, 2 rotas futuras, mobile, imagens e fullscreen.");
} finally {
  await browser.close();
}
