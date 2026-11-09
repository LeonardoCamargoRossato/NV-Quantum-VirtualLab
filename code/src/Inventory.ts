export const fields = {
  tag: "Tag única",
  imageUrl: "URL da imagem",
  name: "Componente",
  pcb: "Ref. PCB",
  subsystem: "Subsistema",
  quantity: "Qtde",
  model: "Modelo / valor",
  function: "Função / descrição",
  location: "Localização / montagem",
  price: "Preço BR (referência histórica)",
  imageType: "Tipo de imagem",
  source: "Fonte técnica",
  datasheet: "Datasheet",
  notes: "Pendências / compatibilidade",
  category: "Categoria",
  layer: "Camada",
  parent: "Pertence a",
  parentTag: "Tag do subsistema",
  legacyTag: "Tag inventário V1",
  face: "Face da PCB",
  imageFormula: "Imagem — referência original",
  imageStatus: "Estado da imagem",
  imageClass: "Classe de evidência da imagem",
  imageNotes: "Limitações da imagem",
  imageSource: "Procedência complementar",
};
export type Item = Record<keyof typeof fields, string>;
export type Snapshot = {
  schemaVersion: number;
  status: "pending" | "validated";
  source: string;
  sourceUrl: string;
  snapshotAt: string | null;
  sourceSha256: string | null;
  items: Item[];
  legacyItems: Item[];
};
export function safeUrl(url: string): string | undefined {
  try {
    const value = new URL(url);
    return value.protocol === "https:" && !value.username && !value.password
      ? value.href
      : undefined;
  } catch {
    return undefined;
  }
}
export function validateSnapshot(value: unknown): Snapshot {
  const data = value as Snapshot;
  if (
    !data ||
    data.schemaVersion !== 2 ||
    !Array.isArray(data.items) ||
    !["pending", "validated"].includes(data.status)
  )
    throw Error("Formato de inventário inválido");
  if (data.status === "pending" && data.items.length)
    throw Error("Snapshot pendente não deve conter registros");
  if (data.status === "validated") {
    if (data.items.length !== 79 || !data.snapshotAt || !data.sourceSha256 || !/^[a-f0-9]{64}$/.test(data.sourceSha256))
      throw Error("Snapshot incompleto");
    const tags = new Set<string>();
    data.items.forEach((item) => {
      if (
        Object.keys(fields).some(
          (key) => typeof item[key as keyof Item] !== "string",
        ) ||
        !/^UG-V1-(?:\d{4}|S\d{2}|B\d{3})$/.test(item.tag) ||
        tags.has(item.tag) ||
        !item.name ||
        !item.subsystem ||
        !["A", "B"].includes(item.layer) ||
        item.category !== (item.layer === "A" ? "subsistema" : "componente") ||
        [item.imageUrl, item.datasheet].some(url => url && !safeUrl(url))
      )
        throw Error("Registro V1 inválido");
      tags.add(item.tag);
    });
    const parents = data.items.filter(item => item.layer === "A");
    if (parents.length !== 10 || data.items.some(item => item.layer === "B" && !parents.some(parent => parent.tag === item.parentTag && parent.name === item.parent)))
      throw Error("Hierarquia V1 inválida");
  }
  return data;
}
export function filterItems(
  items: Item[],
  query: string,
  subsystem: string,
  imageType: string,
): Item[] {
  const normalized = query
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
  return items.filter(
    (item) =>
      (!subsystem || item.subsystem === subsystem) &&
      (!imageType || item.imageType === imageType) &&
      Object.values(item)
        .join(" ")
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .includes(normalized),
  );
}
export function exportCsv(items: Item[]): string {
  const cell = (value: string) =>
    '"' +
    (/^[\s\u0000-\u001f]*[=+\-@]/.test(value) ? "'" + value : value).replace(
      /"/g,
      '""',
    ) +
    '"';
  const keys = Object.keys(fields) as (keyof Item)[];
  return (
    "\ufeff" +
    [
      keys.map((key) => cell(fields[key])).join(","),
      ...items.map((item) =>
        keys.map((key) => cell(item[key] || "")).join(","),
      ),
    ].join("\r\n")
  );
}
