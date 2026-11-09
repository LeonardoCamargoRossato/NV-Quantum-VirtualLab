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
  await page.getByRole("heading", { name: "Explorar V1" }).waitFor();
  await page.getByRole("button", { name: "Inspecionar Laser verde" }).waitFor();
  assert.equal(await page.locator(".side-navigation button").count(), 7);
  assert(await page.locator(".photo-stage>img").evaluate(img => img.complete && img.naturalWidth > 0), "Imagem original precisa carregar");
  // Regressão do hotfix: os 11 recortes estavam no Git, mas faltaram no deploy.
  const expectedEnhancedPngs = [
    "ug-v1-overview-enhanced.png", "ug-v1-pcb-enhanced.png",
    "ug-v1-esp32-enhanced.png", "ug-v1-rf-amp-enhanced.png",
    "ug-v1-laser-enhanced.png", "ug-v1-prism-enhanced.png",
    "ug-v1-oled-enhanced.png", "ug-v1-rf-cable-enhanced.png",
    "ug-v1-between-rf-and-esp32-enhanced.png",
    "ug-v1-above-esp32-enhanced.png", "ug-v1-laser-driver-enhanced.png",
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
  await page.getByRole("complementary", { name: /Ficha de componente/ }).waitFor();
  assert(await page.getByText("Recorte de fotografia oficial", { exact: false }).isVisible());
  assert(await page.locator(".inspector .crop-shell img").evaluate(i => i.complete && i.naturalWidth > 0), "Imagem individual do laser não carregou");
  const panelWithInspector = await page.locator(".photo-panel").evaluate(el => el.getBoundingClientRect().width);
  assert(panelWithInspector < panelBefore, "Foto deve refluir à direita com inspector");
  await page.screenshot({ path: join(shots,"NvLabV01Inspector.png"), fullPage: true });
  // Recorte ampliado deve exibir a imagem do laser, não uma área cinza/alt quebrado.
  await page.getByRole("button", { name: "Ampliar recorte real: Laser verde" }).click();
  await page.getByRole("dialog", { name: /Recorte oficial V1 aprimorado/ }).waitFor();
  assert(await page.locator(".lightbox-dialog .crop-shell img").evaluate(i => i.complete && i.naturalWidth > 0));
  await page.getByRole("button", { name: "Fechar imagem" }).click();
  await page.getByRole("button", { name: "Expandir painel" }).click();
  assert(await page.locator(".work-area.inspector-big").isVisible());
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
  await page.getByRole("searchbox").fill("UG-V1-0028");
  await page.getByText("1 de 33 itens", { exact: false }).waitFor();
  const expectedDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: "CSV · filtrados" }).click();
  assert.equal((await expectedDownload).suggestedFilename(), "UncutGemV1Filtrado.csv");
  await page.getByRole("button", { name: "Guia de montagem V1" }).click();
  assert.equal(await page.locator(".layer-grid img").count(), 3);
  await page.getByRole("button", { name: "Fundamentos" }).click();
  assert.equal(await page.locator(".fundamental").count(), 6);
  await page.getByRole("button", { name: "Artigos" }).click();
  assert.equal(await page.locator(".paper-card").count(), 3);
  await page.getByRole("button", { name: "Revisão Bibliográfica" }).click();
  assert(await page.getByText("Acesso sujeito às permissões do proprietário.", { exact:false }).isVisible());
  await page.getByRole("button", { name: "Referências" }).click();
  assert.equal(await page.locator(".reference-triptych .preview-card").count(), 3);
  await page.screenshot({ path: join(shots,"NvLabV01References.png"), fullPage: true });

  await page.setViewportSize({width:390,height:844});
  await page.reload({waitUntil:"domcontentloaded"});
  await page.getByRole("heading", {name:"Referências"}).waitFor();
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "Sem overflow horizontal no mobile");
  await page.getByRole("button", {name:"Abrir menu lateral"}).click();
  await page.getByRole("button", {name:"Explorar V1"}).click();
  await page.getByRole("button", {name:"Inspecionar Laser verde"}).waitFor();
  await page.getByRole("button", {name:"Inspecionar Laser verde"}).click();
  await page.screenshot({path:join(shots,"NvLabV01MobileInspector.png"),fullPage:true});
  assert.equal(errors.length,0,"Erros JavaScript: "+errors.join("; "));
  console.log("PASS: sidebar, inspector reflow, 33 real records, CSV, 7 tabs, references, mobile, image crop, zoom and fullscreen.");
} finally {
  await browser.close();
}
