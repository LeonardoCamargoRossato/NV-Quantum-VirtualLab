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
  await page.screenshot({ path: join(shots,"NvLabV01SidebarOpen.png"), fullPage: true });

  const panelBefore = await page.locator(".photo-panel").evaluate(el => el.getBoundingClientRect().width);
  await page.getByRole("button", { name: "Inspecionar Laser verde" }).click();
  await page.getByRole("complementary", { name: /Ficha de componente/ }).waitFor();
  assert(await page.getByText("Recorte de fotografia oficial", { exact: false }).isVisible());
  const panelWithInspector = await page.locator(".photo-panel").evaluate(el => el.getBoundingClientRect().width);
  assert(panelWithInspector < panelBefore, "Foto deve refluir à direita com inspector");
  await page.screenshot({ path: join(shots,"NvLabV01Inspector.png"), fullPage: true });
  await page.getByRole("button", { name: "Expandir painel" }).click();
  assert(await page.locator(".work-area.inspector-big").isVisible());
  await page.getByRole("button", { name: "Fechar inspetor" }).click();
  assert(await page.locator(".inspector").count() === 0);

  await page.getByRole("button", { name: "Recolher menu lateral" }).click();
  assert(await page.locator(".menu-collapsed").count() === 1);
  const panelCollapsed = await page.locator(".photo-panel").evaluate(el => el.getBoundingClientRect().width);
  assert(panelCollapsed > panelBefore + 70, "Menu recolhido deve aumentar a foto");
  await page.screenshot({ path: join(shots,"NvLabV01SidebarClosed.png"), fullPage: true });
  await page.getByRole("button", { name: "Expandir menu lateral" }).click();

  await page.getByRole("button", { name: "Aumentar zoom", exact: true }).click();
  assert.equal(await page.locator(".photo-controls output").textContent(), "125%");
  await page.getByRole("button", { name: "Redefinir" }).click();
  assert.equal(await page.locator(".photo-controls output").textContent(), "100%");
  await page.getByRole("button", { name: "Tela cheia da fotografia" }).click();
  assert(await page.evaluate(() => Boolean(document.fullscreenElement) || Boolean(document.querySelector(".full-fallback"))));
  await page.keyboard.press("Escape");

  await page.getByRole("button", { name: "Inventário", exact: true }).click();
  await page.getByText("33 de 33 itens", { exact: false }).waitFor();
  await page.getByRole("searchbox").fill("BPW34");
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
