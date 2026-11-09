import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1050 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
try {
  await page.goto(
    process.env.APP_URL || "http://127.0.0.1:5173/NV-Quantum-VirtualLab/",
  );
  await page.getByRole("heading", { name: "Conheça o Uncut Gem." }).waitFor();
  assert(
    await page
      .locator(".viewport>img")
      .evaluate((i) => i.complete && i.naturalWidth > 0),
  );
  await page
    .getByRole("button", { name: "Aumentar zoom", exact: true })
    .click();
  assert.equal(await page.locator("output").innerText(), "125%");
  await page.getByRole("button", { name: "Redefinir", exact: true }).click();
  assert.equal(await page.locator("output").innerText(), "100%");
  await page
    .getByRole("button", { name: "Como a montagem se organiza" })
    .click();
  await page.getByRole("dialog").waitFor();
  assert.equal(await page.locator(".layers img").count(), 3);
  await page.keyboard.press("Escape");
  await page.screenshot({ path: "/tmp/NvLabDesktop.png", fullPage: true });
  await page.getByRole("button", { name: "Inventário", exact: true }).click();
  await page
    .getByRole("heading", {
      name: "O inventário aguarda sua primeira importação.",
    })
    .waitFor();
  assert(
    await page.getByRole("button", { name: "Baixar CSV · todos" }).isDisabled(),
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Explorar V1", exact: true }).click();
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.screenshot({ path: "/tmp/NvLabMobile.png", fullPage: true });
  // Synthetic data is used only in the intercepted test response, never written to public assets.
  const items = Array.from({ length: 33 }, (_, n) => ({
    tag: `UG-V1-${String(n + 1).padStart(4, "0")}`,
    name: `Componente de teste ${n + 1}`,
    pcb: "U1",
    subsystem: n % 2 ? "RF" : "Óptica",
    quantity: "1",
    model: "Modelo de teste",
    function: "Descrição sintética para teste",
    location: "Não mapeada",
    price: "",
    imageType: "Sem imagem validada",
    imageUrl: "",
    source: "",
    datasheet: "",
    notes: "Teste isolado",
  }));
  await page.route("**/data/InventoryV1.json", (r) =>
    r.fulfill({
      json: {
        schemaVersion: 1,
        status: "validated",
        source: "Fixture sintética",
        sourceUrl: "https://example.com",
        snapshotAt: new Date().toISOString(),
        sourceSha256: "fixture",
        items,
      },
    }),
  );
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.reload();
  await page.getByRole("button", { name: "Inventário", exact: true }).click();
  await page.getByText("33 de 33 itens", { exact: false }).waitFor();
  await page.getByRole("searchbox").fill("UG-V1-0001");
  await page.getByText("1 de 33 itens", { exact: false }).waitFor();
  const downloaded = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "CSV · filtrados", exact: true })
    .click();
  assert.equal(
    (await downloaded).suggestedFilename(),
    "UncutGemV1Filtrado.csv",
  );
  await page.getByRole("button", { name: "UG-V1-0001", exact: true }).click();
  await page.getByRole("dialog").waitFor();
  assert(
    await page
      .getByText("NÃO LOCALIZADO VISUALMENTE", { exact: false })
      .isVisible(),
  );
  await page.keyboard.press("Escape");
  await page.getByRole("searchbox").fill("");
  await page.getByLabel("Subsistema", { exact: true }).selectOption("RF");
  await page.getByText("16 de 33 itens", { exact: false }).waitFor();
  assert.deepEqual(errors, []);
  console.log(
    "PASS: fotografia, zoom, reset, guia, Escape, mobile sem overflow, estado pendente, busca, filtro, ficha e download CSV (fixtures isoladas).",
  );
} finally {
  await browser.close();
}
