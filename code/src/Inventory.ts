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
    data.schemaVersion !== 1 ||
    !Array.isArray(data.items) ||
    !["pending", "validated"].includes(data.status)
  )
    throw Error("Formato de inventário inválido");
  if (data.status === "pending" && data.items.length)
    throw Error("Snapshot pendente não deve conter registros");
  if (data.status === "validated") {
    if (data.items.length !== 33 || !data.snapshotAt || !data.sourceSha256)
      throw Error("Snapshot incompleto");
    const tags = new Set<string>();
    data.items.forEach((item) => {
      if (
        Object.keys(fields).some(
          (key) => typeof item[key as keyof Item] !== "string",
        ) ||
        !/^UG-V1-00(0[1-9]|[12][0-9]|3[0-3])$/.test(item.tag) ||
        tags.has(item.tag) ||
        !item.name ||
        !item.subsystem
      )
        throw Error("Registro V1 inválido");
      tags.add(item.tag);
    });
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
      [item.tag, item.name, item.model, item.function, item.pcb]
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
