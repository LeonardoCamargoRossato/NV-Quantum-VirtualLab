import { describe, it, expect } from "vitest";
import {
  exportCsv,
  filterItems,
  safeUrl,
  validateSnapshot,
  type Item,
} from "./Inventory";
const item: Item = {
  imageStatus:"", imageClass:"", imageNotes:"", imageSource:"", category:"componente", layer:"B", parent:"Óptica", parentTag:"UG-V1-S01", legacyTag:"UG-V1-0001", face:"Frente", imageFormula:"",
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
    expect(filterItems([item], "optica", "", "")).toHaveLength(1);
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
      validateSnapshot({ schemaVersion: 3, status: "validated", items: [] }),
    ).toThrow();
    expect(
      validateSnapshot({ schemaVersion: 3, status: "pending", items: [] })
        .status,
    ).toBe("pending");
  });
});

import canonical from "../source/InventoryV1.json";
describe("catálogo canônico", () => {
  it("valida as duas camadas e busca metadados de hierarquia", () => {
    const data = validateSnapshot(canonical);
    expect(data.items.filter(i=>i.layer==="A")).toHaveLength(10);
    expect(data.items.filter(i=>i.layer==="B")).toHaveLength(69);
    expect("legacyItems" in data).toBe(false);
    expect("legacyOnlyTags" in data).toBe(false);
    expect(data.items.find(i=>i.tag==="UG-V1-B041")?.name).toBe("Face frontal da PCB");
    expect(data.items.find(i=>i.tag==="UG-V1-B042")?.name).toBe("Face traseira da PCB");
    const child = data.items.find(i=>i.layer==="B")!;
    expect(filterItems(data.items,child.parent,"","")).toContain(child);
  });
  it("rejeita tags duplicadas, hierarquia órfã e imagens executáveis", () => {
    const duplicate = structuredClone(canonical);
    duplicate.items[1].tag = duplicate.items[0].tag;
    expect(()=>validateSnapshot(duplicate)).toThrow();
    const orphan = structuredClone(canonical);
    orphan.items.find(i=>i.layer==="B")!.parentTag="UG-V1-S99";
    expect(()=>validateSnapshot(orphan)).toThrow();
    const unsafe = structuredClone(canonical);
    unsafe.items[0].imageUrl="javascript:alert(1)";
    expect(()=>validateSnapshot(unsafe)).toThrow();
  });
});
