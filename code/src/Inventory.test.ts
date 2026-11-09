import { describe, it, expect } from "vitest";
import {
  exportCsv,
  filterItems,
  safeUrl,
  validateSnapshot,
  type Item,
} from "./Inventory";
const item: Item = {
  tag: "UG-V1-0001",
  name: "Amplificador",
  pcb: "U1",
  subsystem: "Óptica",
  quantity: "1",
  model: "BPW34",
  function: 'Detecta "luz"\nvermelha',
  location: "Prisma",
  price: "",
  imageType: "Diagrama",
  imageUrl: "",
  source: "",
  datasheet: "",
  notes: '=HYPERLINK("https://example.com")',
};
describe("inventário V1", () => {
  it("busca sem acentos e combina filtros", () => {
    expect(filterItems([item], "optica", "", "")).toHaveLength(0);
    expect(filterItems([item], "bpw", "Óptica", "Diagrama")).toHaveLength(1);
    expect(filterItems([item], "bpw", "RF", "")).toHaveLength(0);
  });
  it("exporta BOM UTF-8, aspas, quebras de linha e neutraliza fórmulas", () => {
    const csv = exportCsv([item]);
    expect(csv.startsWith("\ufeff")).toBe(true);
    expect(csv).toContain('"Detecta ""luz""\nvermelha"');
    expect(csv).toContain("\"'=HYPERLINK");
  });
  it("rejeita links executáveis e credenciais", () => {
    expect(safeUrl("javascript:alert(1)")).toBeUndefined();
    expect(safeUrl("https://user:pass@example.com")).toBeUndefined();
    expect(safeUrl("https://example.com")).toBe("https://example.com/");
  });
  it("rejeita snapshot validado incompleto e não confunde pendente com validado", () => {
    expect(() =>
      validateSnapshot({ schemaVersion: 1, status: "validated", items: [] }),
    ).toThrow();
    expect(
      validateSnapshot({ schemaVersion: 1, status: "pending", items: [] })
        .status,
    ).toBe("pending");
  });
});
