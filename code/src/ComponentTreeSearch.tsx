import { useEffect, useMemo, useState } from "react";
import "./ComponentTreeSearch.css";

type LayerBRecord = {
  tag: string; name: string; parent: string; ref: string; model?: string;
  class: "A" | "B" | "C" | "D"; status: "CHECK" | "REVISÃO" | "ERRO";
  filename: string | null; existing_image_url: string;
  existing_image_type: string; image_type: string; notes: string;
};
type FaceRecord = { tag: string; face: string };
const sheet = "https://docs.google.com/spreadsheets/d/158OGccBdF5Hf6qdWIH2-Tmt_-gU8sO8pz3CvyTpycXU/edit#gid=2026110901";
const pendingCapacitors = new Set(["UG-V1-B002", "UG-V1-B003", "UG-V1-B004", "UG-V1-B005", "UG-V1-B006", "UG-V1-B007"]);
const faceChoices = ["Frente", "Verso", "Ambas", "Externo à PCB", "Interno ao módulo"];
const labels: Record<LayerBRecord["class"], string> = {
  A: "Recorte real", B: "Referência contextual", C: "Módulo hospedeiro", D: "Revisão pendente"
};
function normalized(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
export function ComponentTreeSearch({base, onPreview}: {base:string; onPreview:(url:string,title:string)=>void}) {
  const [items, setItems] = useState<LayerBRecord[]>([]);
  const [faces, setFaces] = useState<Record<string,string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("capacitor");
  const [face, setFace] = useState("");
  const [showMore, setShowMore] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const retrieve = async (path: string) => {
      const response = await fetch(base + path);
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.json();
    };
    Promise.all([retrieve("data/LayerBComponentImagePlan.json"), retrieve("data/LayerBBoardFaceIndex.json")])
      .then(([tree, index]) => {
        if (cancelled) return;
        if (!Array.isArray(tree.components) || tree.components.length !== 69 || !Array.isArray(index.items))
          throw new Error("Índice de componentes incompleto");
        setItems(tree.components);
        setFaces(Object.fromEntries((index.items as FaceRecord[]).map(entry => [entry.tag, entry.face])));
        setLoading(false);
      })
      .catch(() => {if (!cancelled) {setError("Não foi possível carregar a árvore local de componentes. Consulte a planilha.");setLoading(false);}});
    return () => {cancelled = true;};
  }, [base]);
  const filtered = useMemo(() => {
    const q = normalized(query.trim());
    return items.filter(item => (!face || faces[item.tag] === face) &&
      (!q || normalized([item.name, item.ref, item.tag, item.parent, item.model || ""].join(" ")).includes(q)));
  }, [items, faces, query, face]);
  const displayed = showMore ? filtered : filtered.slice(0, 15);
  return <section className="v1-component-tree" aria-label="Pesquisa de componentes da árvore Uncut Gem V1">
    <div className="v1-tree-head">
      <div><span className="v1-tree-eyebrow">ÁRVORE V1 · CAMADA B</span><h2>Pesquisar componentes</h2>
        <p>Encontre capacitores, conectores e módulos por TAG, nome ou subsistema. Veja a face da placa e a procedência da imagem.</p></div>
      <a href={sheet} target="_blank" rel="noopener noreferrer">Planilha completa ↗</a>
    </div>
    <div className="v1-tree-filters">
      <label>Pesquisar componente
        <input type="search" value={query} onChange={e => {setQuery(e.target.value);setShowMore(false);}}
          placeholder="Ex.: capacitor, C5, ESP32, TL082" aria-label="Pesquisar componentes da árvore" />
      </label>
      <label>Face da PCB
        <select value={face} onChange={e=>{setFace(e.target.value);setShowMore(false);}} aria-label="Filtrar face da PCB">
          <option value="">Todas</option>{faceChoices.map(x=><option key={x} value={x}>{x}</option>)}
        </select>
      </label>
    </div>
    {loading ? <p className="v1-tree-message">Carregando árvore de componentes…</p>
      : error ? <p className="v1-tree-message" role="alert">{error}</p> : <>
        <p className="v1-tree-count" aria-live="polite">{filtered.length} de {items.length} componentes encontrados · Imagens oficiais e de referência identificadas</p>
        <div className="v1-tree-grid">
          {displayed.map(item => {
            const awaiting = pendingCapacitors.has(item.tag) && item.status === "REVISÃO";
            const url = awaiting ? "" : item.status === "CHECK" && item.filename
              ? base + "assets/official/v1/components/" + item.filename : item.existing_image_url;
            const title = item.name + " — " + (faces[item.tag] || "Localização não verificada");
            return <article className="v1-tree-card" key={item.tag}>
              <div className="v1-tree-card-header"><strong>{item.name}</strong><span>{item.ref || item.tag}</span></div>
              <div className="v1-tree-thumb">
                {url ? <button type="button" onClick={()=>onPreview(url,title)} aria-label={"Ampliar referência: " + item.name}>
                  <img src={url} loading="lazy" alt={"Imagem " + labels[item.class] + " do componente " + item.name} />
                </button> : <div className="v1-tree-pending"><strong>Imagem em revisão</strong><span>Recorte frontal aguarda aprovação antes de ser publicado.</span></div>}
              </div>
              <div className="v1-tree-tags"><span>{faces[item.tag] || "A confirmar"}</span><span>{labels[item.class]}</span></div>
              <p className="v1-tree-card-meta">{item.parent} · <code>{item.tag}</code></p>
              {awaiting && <p className="v1-tree-warning">Footprint confirmado no KiCad; não comprova capacitor soldado.</p>}
              {!awaiting && item.status === "REVISÃO" && <p className="v1-tree-warning">Imagem ilustrativa/contextual; identificação física pendente.</p>}
            </article>;
          })}
        </div>
        {!filtered.length && <p className="v1-tree-message">Nenhum componente corresponde à busca.</p>}
        {!showMore && filtered.length > 15 && <button className="v1-tree-more" type="button" onClick={()=>setShowMore(true)}>Mostrar todos os {filtered.length} resultados</button>}
      </>}
    <p className="v1-tree-disclaimer">Os seis recortes C5–C10 ainda estão em fase de aprovação. A localização é baseada no projeto KiCad da revisão V1; não comprova a montagem física dos capacitores.</p>
  </section>;
}
