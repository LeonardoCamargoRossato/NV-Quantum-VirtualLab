import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { fields, filterItems, exportCsv, safeUrl, validateSnapshot, type Item, type Snapshot } from "./Inventory";
import { PHOTO_REGIONS, findPhotoRegion, cropAspect, PHOTO_ORIGINAL_URL, type PhotoRegion } from "./PhotoRegions";
import { Articles, Fundamentals, Guide, Literature, References, navigationGroups, pageTitles, Out, type Page } from "./StudyPages";
import "./Workbench.css";

const base = import.meta.env.BASE_URL;
const inventorySheet = "https://docs.google.com/spreadsheets/d/158OGccBdF5Hf6qdWIH2-Tmt_-gU8sO8pz3CvyTpycXU/edit?gid=1346018179#gid=1346018179";
const project = "https://github.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab";
const logo = "https://pgfis.ita.br/static/core/uploads/Post/ITA-logo_606c9f4c450c8e7bd0b4b118.jpg_606c9f4c450c8e7bd0b4b118.jpg.jpg";
const originalPhoto = base + "assets/official/DeviceV1.png";
const isPage = (v: string): v is Page => Object.prototype.hasOwnProperty.call(pageTitles, v);
function currentPage(): Page {
  const value = decodeURIComponent(window.location.hash.replace(/^#/, ""));
  return isPage(value) ? value : "explorar";
}

type ImagePreview = { url: string; title: string; region?: PhotoRegion };
function Crop({region, title, onClick, interactive = true}: {region: PhotoRegion; title: string; onClick?: () => void; interactive?: boolean}) {
  const style: React.CSSProperties = { aspectRatio: String(cropAspect(region)) };
  return <div className="crop-shell" style={style}>
    <img
      src={originalPhoto}
      draggable={false}
      loading="lazy"
      alt={"Recorte de fotografia oficial V1: " + title}
      style={{
        width: (100 / (region.w / 100)) + "%",
        height: (100 / (region.h / 100)) + "%",
        maxWidth: "none",
        position: "absolute",
        left: -(region.x / region.w) * 100 + "%",
        top: -(region.y / region.h) * 100 + "%",
        pointerEvents: "none",
      }}
    />
    {interactive && onClick && <button type="button" className="crop-overlay" onClick={onClick} aria-label={"Ampliar recorte real: " + title}>Ampliar recorte <span aria-hidden="true">↗</span></button>}
  </div>;
}
function Picture({url,label,onClick}: {url: string; label: string; onClick: (preview: ImagePreview) => void}) {
  const [failed,setFailed] = useState(false);
  useEffect(() => setFailed(false), [url]);
  const safe = safeUrl(url);
  if (!safe || failed) return <span className="image-placeholder">{url ? "Imagem indisponível" : "Sem imagem validada"}</span>;
  return <button type="button" className="image-button" onClick={() => onClick({url:safe,title:label})} aria-label={"Ampliar " + label}><img src={safe} alt={label} loading="lazy" onError={() => setFailed(true)} /></button>;
}
function ComponentImage({item,onOpen}: {item: Item; onOpen: (preview: ImagePreview) => void}) {
  const region = findPhotoRegion(item.tag);
  if (region) return <div className="component-visual">
    <Crop region={region} title={item.name} onClick={() => onOpen({url:originalPhoto, title:"Recorte oficial V1 — "+item.name,region})} />
    <p className="image-provenance"><strong>Recorte de fotografia oficial</strong> · Quantum Village / Uncut Gem V1</p>
    <p className="visual-note">{region.note} Ampliação limitada à resolução original.</p>
    <Out href={PHOTO_ORIGINAL_URL}>Fotografia integral de origem</Out>
  </div>;
  const type = item.imageType.toLocaleLowerCase("pt-BR");
  if (type.includes("gerada por ia")) return <div className="component-visual">
    <Picture url={item.imageUrl} label={"Ilustração por IA — "+item.name} onClick={onOpen} />
    <p className="image-provenance"><strong>Imagem ilustrativa por IA</strong> · pode não corresponder ao modelo original</p>
  </div>;
  if (type.includes("diagrama") || type.includes("render")) return <div className="component-visual">
    <Picture url={item.imageUrl} label={(type.includes("render")?"Render":"Diagrama")+" — "+item.name} onClick={onOpen} />
    <p className="image-provenance"><strong>{type.includes("render") ? "Render oficial de placa" : "Diagrama técnico"}</strong> · não é fotografia individual da peça</p>
  </div>;
  return <div className="component-visual">
    <div className="no-individual-photo"><span aria-hidden="true">▧</span><strong>Sem fotografia individual confirmada</strong><p>O inventário referencia a montagem completa; não será usada como se fosse uma foto isolada deste item.</p></div>
    {safeUrl(item.imageUrl) && <Out href={item.imageUrl}>Ver imagem de conjunto / contexto</Out>}
  </div>;
}
function Inspector({item,expanded,onExpand,onClose,onOpen,refTarget}: {
  item:Item; expanded:boolean;onExpand:()=>void;onClose:()=>void;onOpen:(p:ImagePreview)=>void;refTarget:React.RefObject<HTMLElement | null>;
}) {
  return <aside className={"inspector"+(expanded?" inspector-expanded":"")} aria-label={"Ficha de componente: "+item.name} ref={refTarget}>
    <div className="inspector-heading"><div><span className="overline">INSPEÇÃO DE COMPONENTE</span><h2>{item.name}</h2></div><button type="button" className="close-icon" onClick={onClose} aria-label="Fechar inspetor">×</button></div>
    <div className="inspector-scroll">
      <div className="item-meta"><span className="tag-pill">{item.tag}</span><span>{findPhotoRegion(item.tag)?"Localizado na fotografia V1":"Sem ponto de localização validado"}</span></div>
      <ComponentImage item={item} onOpen={onOpen} />
      <div className="field-list">{(Object.keys(fields) as (keyof Item)[]).filter(k=>!["tag","name","imageUrl","source","datasheet"].includes(k)).map(k=><div key={k}><dt>{fields[k]}</dt><dd>{item[k]||"Não documentado"}</dd></div>)}</div>
      <div className="source-line"><Out href={item.source}>Fonte técnica</Out><Out href={item.datasheet}>Datasheet</Out><Out href={item.imageUrl}>URL de imagem do inventário</Out></div>
      <p className="price-disclaimer">Preços indicados são referências históricas do inventário, não cotações atuais.</p>
    </div>
    <div className="inspector-footer"><button onClick={onExpand}>{expanded?"Reduzir painel":"Expandir painel"}</button><button onClick={onClose}>Fechar</button></div>
  </aside>;
}
function Lightbox({preview,onClose}: {preview:ImagePreview;onClose:()=>void}) {
  const [zoom,setZoom]=useState(1);
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{ref.current?.focus();},[]);
  return <div role="dialog" aria-modal="true" aria-label={preview.title} className="lightbox-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
    <div className="lightbox-dialog" ref={ref} tabIndex={-1}>
      <div className="lightbox-heading"><strong>{preview.title}</strong><div className="lightbox-buttons"><button onClick={()=>setZoom(z=>Math.max(1,z-0.25))} aria-label="Diminuir zoom da imagem">−</button><output>{Math.round(zoom*100)}%</output><button onClick={()=>setZoom(z=>Math.min(4,z+0.25))} aria-label="Aumentar zoom da imagem">+</button><button onClick={()=>setZoom(1)}>Redefinir</button><button onClick={onClose} aria-label="Fechar imagem">×</button></div></div>
      <div className="lightbox-content"><div className="lightbox-zoom" style={{transform:"scale("+zoom+")"}}>{preview.region?<Crop region={preview.region} title={preview.title} interactive={false}/>:<img src={preview.url} alt={preview.title}/>}</div></div>
      <div className="lightbox-caption">{preview.region?"Recorte visual da fotografia original: sem upscaling nem detalhes inventados.":"Fonte de imagem fornecida pelo inventário ou pelos arquivos oficiais."} <Out href={preview.region?PHOTO_ORIGINAL_URL:preview.url}>Abrir arquivo original</Out></div>
    </div>
  </div>;
}
function App() {
  const [page,setPage]=useState<Page>(currentPage);
  const [collapsed,setCollapsed]=useState(()=>{try{return window.localStorage.getItem("nv-sidebar-collapsed")==="true"}catch{return false}});
  const [mobileMenu,setMobileMenu]=useState(false);
  const [snapshot,setSnapshot]=useState<Snapshot | null>(null);
  const [loadError,setLoadError]=useState("");
  const [query,setQuery]=useState("");
  const [subsystem,setSubsystem]=useState("");
  const [imageType,setImageType]=useState("");
  const [sort,setSort]=useState<"tag"|"name"|"subsystem">("tag");
  const [selected,setSelected]=useState<Item | null>(null);
  const [inspectorExpanded,setInspectorExpanded]=useState(false);
  const [preview,setPreview]=useState<ImagePreview|null>(null);
  const [zoom,setZoom]=useState(1);
  const [pan,setPan]=useState({x:0,y:0});
  const [fullFallback,setFullFallback]=useState(false);
  const [isFull,setIsFull]=useState(false);
  const [photoFailed,setPhotoFailed]=useState(false);
  const [logoFailed,setLogoFailed]=useState(false);
  const [viewSize,setViewSize]=useState({width:1000,height:650});
  const [photoSize,setPhotoSize]=useState({width:1000,height:743});
  const viewportRef=useRef<HTMLDivElement>(null);
  const photoPanelRef=useRef<HTMLElement>(null);
  const inspectorRef=useRef<HTMLElement>(null);
  const lastSelectionRef=useRef<HTMLElement|null>(null);
  const drag=useRef<{x:number;y:number;px:number;py:number}|null>(null);
  useEffect(()=>{
    fetch(base+"data/InventoryV1.json").then(r=>{if(!r.ok)throw Error("Erro HTTP "+r.status);return r.json()})
      .then(validateSnapshot).then(setSnapshot).catch(()=>setLoadError("Não foi possível carregar o snapshot local. Consulte a planilha mestre."));
  },[]);
  useEffect(()=>{
    function onHash(){setPage(currentPage());setMobileMenu(false);setSelected(null)}
    window.addEventListener("hashchange",onHash);
    return ()=>window.removeEventListener("hashchange",onHash);
  },[]);
  useEffect(()=>{
    const target=viewportRef.current;
    if(!target)return;
    const observer=new ResizeObserver(entries=>{const rect=entries[0].contentRect;setViewSize({width:rect.width,height:rect.height})});
    observer.observe(target);
    return ()=>observer.disconnect();
  },[page,selected,inspectorExpanded,fullFallback]);
  useEffect(()=>{
    const listener=()=>{
      setIsFull(Boolean(document.fullscreenElement));
      if(!document.fullscreenElement)setFullFallback(false);
    };
    document.addEventListener("fullscreenchange",listener);
    return ()=>document.removeEventListener("fullscreenchange",listener);
  },[]);
  useEffect(()=>{
    function onKey(e:KeyboardEvent) {
      if(e.key==="Escape"){
        if(preview){setPreview(null);return;}
        if(document.fullscreenElement){document.exitFullscreen().catch(()=>{});return;}
        if(fullFallback){setFullFallback(false);return;}
        if(mobileMenu){setMobileMenu(false);return;}
        if(selected){setSelected(null);lastSelectionRef.current?.focus();}
      }
    }
    document.addEventListener("keydown",onKey);
    return ()=>document.removeEventListener("keydown",onKey);
  },[selected,preview,fullFallback,mobileMenu]);
  useEffect(()=>{
    if(selected&&window.matchMedia("(max-width: 800px)").matches)inspectorRef.current?.focus();
  },[selected]);
  const items=snapshot?.items||[];
  const filtered=filterItems(items,query,subsystem,imageType).sort((a,b)=>a[sort].localeCompare(b[sort],"pt-BR",{numeric:true}));
  const fitted=Math.max(0,Math.min(viewSize.width/photoSize.width,viewSize.height/photoSize.height));
  const imageDimensions={width:photoSize.width*fitted,height:photoSize.height*fitted};
  function go(target:Page){setPage(target);window.location.hash=target;setMobileMenu(false);setSelected(null);}
  function toggleCollapsed(){setCollapsed(v=>{try{window.localStorage.setItem("nv-sidebar-collapsed",String(!v))}catch{}return !v;});}
  function openItem(item:Item,trigger?:HTMLElement){lastSelectionRef.current=trigger||document.activeElement as HTMLElement;setInspectorExpanded(false);setSelected(item);}
  function closeInspector(){setSelected(null);setInspectorExpanded(false);lastSelectionRef.current?.focus();}
  function download(all:boolean){const file=new Blob([exportCsv(all?items:filtered)],{type:"text/csv;charset=utf-8"});const url=URL.createObjectURL(file);const a=document.createElement("a");a.href=url;a.download=all?"UncutGemV1.csv":"UncutGemV1Filtrado.csv";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
  async function fullscreen(){
    if(document.fullscreenElement){await document.exitFullscreen();return;}
    if(fullFallback){setFullFallback(false);return;}
    const el=photoPanelRef.current;
    if(!el)return;
    // Fallback visual imediato: a Fullscreen API pode não ser suportada ou ser negada.
    setFullFallback(true);
    try{
      if(el.requestFullscreen){
        await el.requestFullscreen();
        if(document.fullscreenElement)setFullFallback(false);
      }
    }catch{ /* Mantém fullscreen visual em CSS quando a API falha. */ }
  }
  const isPhotoFull=isFull||fullFallback;
  return <div className={"app-shell"+(collapsed?" menu-collapsed":"")}>
    {mobileMenu&&<button className="mobile-scrim" aria-label="Fechar navegação" onClick={()=>setMobileMenu(false)} />}
    <aside className={"nav-sidebar"+(mobileMenu?" mobile-open":"")} aria-label="Navegação do laboratório">
      <div className="sidebar-top"><div className="identity">
        <div className="identity-icon" aria-hidden="true">NV</div>
        {!collapsed&&<div className="identity-text"><strong>NV Quantum<br/>Virtual Lab</strong><small>LABORATÓRIO V1</small></div>}
      </div><button className="sidebar-toggle" type="button" title={collapsed?"Expandir menu":"Recolher menu"} aria-label={collapsed?"Expandir menu lateral":"Recolher menu lateral"} onClick={toggleCollapsed}>{collapsed?"»":"«"}</button></div>
      <div className="sidebar-ita"><a href="https://www.ita.br/" target="_blank" rel="noopener noreferrer" aria-label="Site institucional do ITA" title="ITA — Instituto Tecnológico de Aeronáutica">{logoFailed?<strong>ITA</strong>:<img src={logo} alt="Logomarca do ITA, exibida a partir de site institucional" onError={()=>setLogoFailed(true)}/>}</a>{!collapsed&&<small>Identidade institucional de referência<br/>Projeto acadêmico independente</small>}</div>
      <nav className="side-navigation" aria-label="Seções">{navigationGroups.map(group=><section key={group.group}><h2>{collapsed?"·":group.group}</h2>{group.pages.map(p=><button
        type="button" key={p.key} title={pageTitles[p.key]} aria-label={pageTitles[p.key]}
        aria-current={page===p.key?"page":undefined} className={"nav-item"+(page===p.key?" active":"")}
        onClick={()=>go(p.key)}><span className="nav-icon" aria-hidden="true">{p.icon}</span>{!collapsed&&<span>{pageTitles[p.key]}</span>}</button>)}</section>)}</nav>
      <div className="sidebar-bottom"><div className="author-block">{!collapsed&&<><strong>Leonardo Camargo Rossato</strong><Out href="https://leonardocamargorossato.github.io/LCR-SolutionsArchitecture-IA-Quantum/#/">Portfólio</Out><span>ITA — Instituto Tecnológico de Aeronáutica</span><small>Projeto acadêmico independente. Sem declaração de endosso oficial.</small></>}{collapsed&&<a href="https://leonardocamargorossato.github.io/LCR-SolutionsArchitecture-IA-Quantum/#/" title="Portfólio — Leonardo Camargo Rossato" aria-label="Portfólio">↗</a>}</div></div>
    </aside>
    <div className="main-column">
      <div className="mobile-bar"><button type="button" onClick={()=>{setCollapsed(false);setMobileMenu(true)}} aria-label="Abrir menu lateral">☰</button><strong>NV Quantum Virtual Lab</strong><span>V0.1</span></div>
      {page==="explorar" ? <div className="workbench-page">
        <div className="compact-toolbar"><div><span className="overline">LABORATÓRIO FOTOGRÁFICO · 2D</span><h1>Explorar V1</h1></div><div className="toolbar-right"><span className="small-source">Foto real · Quantum Village</span><button className="toolbar-button" onClick={fullscreen} aria-label={isPhotoFull?"Sair da tela cheia":"Tela cheia da fotografia"}>{isPhotoFull?"↙ Sair da tela cheia":"⛶ Tela cheia"}</button></div></div>
        <div className={"work-area"+(selected?" with-inspector":"")+(selected&&inspectorExpanded?" inspector-big":"")}>
          {selected&&<Inspector item={selected} expanded={inspectorExpanded} onExpand={()=>setInspectorExpanded(x=>!x)} onClose={closeInspector} onOpen={setPreview} refTarget={inspectorRef}/>}
          <section className={"photo-panel"+(fullFallback?" full-fallback":"")} ref={photoPanelRef} aria-label="Fotografia interativa da V1">
            <div className="photo-header"><span><i className="live-dot" /> Uncut Gem V1 · montagem oficial</span><span>{PHOTO_REGIONS.length} pontos identificados na imagem</span></div>
            <div className="photo-viewport" ref={viewportRef} aria-label="Imagem da montagem V1 com hotspots" onWheel={e=>setZoom(z=>Math.min(4,Math.max(1,z+(e.deltaY<0?0.15:-0.15))))}
              onPointerDown={e=>{if(e.button!==0)return;drag.current={x:e.clientX,y:e.clientY,px:pan.x,py:pan.y};e.currentTarget.setPointerCapture(e.pointerId)}}
              onPointerMove={e=>{const d=drag.current;if(d)setPan({x:d.px+e.clientX-d.x,y:d.py+e.clientY-d.y})}}
              onPointerUp={()=>{drag.current=null}} onPointerCancel={()=>{drag.current=null}}>
              {photoFailed?<div className="no-individual-photo">Fotografia indisponível. <Out href={PHOTO_ORIGINAL_URL}>Ver fonte original</Out></div>:<div className="photo-stage" style={{width:imageDimensions.width,height:imageDimensions.height,transform:"translate("+pan.x+"px, "+pan.y+"px) scale("+zoom+")"}}>
                <img src={originalPhoto} draggable={false} alt="Fotografia oficial da montagem Uncut Gem V1 com laser, prisma óptico, amplificador RF, ESP32 e OLED" onError={()=>setPhotoFailed(true)} onLoad={e=>setPhotoSize({width:e.currentTarget.naturalWidth,height:e.currentTarget.naturalHeight})}/>
                {PHOTO_REGIONS.map(r=>{const item=items.find(i=>i.tag===r.tag);if(!item)return null;return <button key={r.tag} type="button" className={"hotspot"+(selected?.tag===r.tag?" is-selected":"")} style={{left:r.markerX+"%",top:r.markerY+"%",transform:"translate(-50%,-50%) scale("+(1/zoom)+")"}} title={item.name} aria-label={"Inspecionar "+item.name}
                  onPointerDown={e=>e.stopPropagation()} onClick={e=>openItem(item,e.currentTarget)}><span className="hotspot-circle" aria-hidden="true">●</span><span className="hotspot-tooltip"><strong>{r.short}</strong><small>{item.tag}</small><span className="hotspot-mini" style={{aspectRatio:String(cropAspect(r))}}><img src={originalPhoto} alt="" draggable={false} style={{position:"absolute",width:(10000/r.w)+"%",height:(10000/r.h)+"%",left:-(r.x/r.w)*100+"%",top:-(r.y/r.h)*100+"%",maxWidth:"none",pointerEvents:"none"}}/></span></span></button>})}
              </div>}
              <div className="photo-controls" onPointerDown={e=>e.stopPropagation()}><button onClick={()=>setZoom(z=>Math.max(1,z-0.25))} aria-label="Diminuir zoom">−</button><output aria-live="polite">{Math.round(zoom*100)}%</output><button onClick={()=>setZoom(z=>Math.min(4,z+0.25))} aria-label="Aumentar zoom">+</button><button className="reset-button" onClick={()=>{setZoom(1);setPan({x:0,y:0})}}>Redefinir</button><button onClick={fullscreen} aria-label={isPhotoFull?"Sair da tela cheia":"Maximizar foto"}>{isPhotoFull?"↙":"⛶"}</button></div>
            </div>
            <div className="photo-caption"><span>FOTOGRAFIA OFICIAL · AGPL-3.0</span><span>Arraste para mover · Roda do mouse para aproximar · Selecione um componente</span><Out href={PHOTO_ORIGINAL_URL}>Fonte e créditos</Out></div>
          </section>
        </div>
        <div className="below-photo"><strong>Nota de montagem:</strong> o BPW34 está no prisma encapsulado; <code>PHOTODIODE1</code> é apenas seu conector na placa. <button type="button" onClick={()=>go("guia")}>Ver guia de montagem ↗</button></div>
      </div> : <div className="content-page">
        {page==="inventario" ? <div className="inventory-page">
          <div className="section-heading"><span className="overline">LABORATÓRIO / DADOS</span><h1>Inventário</h1><p>Componentes V1, imagens rotuladas, ficha técnica, filtros e exportação CSV. A planilha Google Sheets permanece fonte mestre privada.</p></div>
          <div className="inventory-summary"><div><strong>Uncut Gem V1</strong><p>{snapshot?.status==="validated"?"Snapshot local · "+new Date(snapshot.snapshotAt||"").toLocaleString("pt-BR")+" · "+items.length+" registros":"Importação não concluída"}</p></div><Out href={inventorySheet}>Abrir planilha original</Out></div>
          <div className="inventory-filters"><label>Buscar<input type="search" placeholder="Tag, componente, modelo, função…" value={query} onChange={e=>setQuery(e.target.value)}/></label>
            <label>Subsistema<select value={subsystem} onChange={e=>setSubsystem(e.target.value)} aria-label="Subsistema"><option value="">Todos</option>{Array.from(new Set(items.map(i=>i.subsystem))).sort().map(s=><option key={s} value={s}>{s}</option>)}</select></label>
            <label>Tipo de imagem<select value={imageType} onChange={e=>setImageType(e.target.value)} aria-label="Tipo de imagem"><option value="">Todos</option>{Array.from(new Set(items.map(i=>i.imageType))).sort().map(s=><option key={s} value={s}>{s}</option>)}</select></label>
            <label>Ordenar<select value={sort} onChange={e=>setSort(e.target.value as typeof sort)} aria-label="Ordenar por"><option value="tag">Tag</option><option value="name">Componente</option><option value="subsystem">Subsistema</option></select></label></div>
          <div className="inventory-tools"><span aria-live="polite">{filtered.length} de {items.length} itens · V1 <small>V2 futura</small></span><div><button disabled={!items.length} onClick={()=>download(true)}>Baixar CSV · todos</button><button disabled={!filtered.length} onClick={()=>download(false)}>CSV · filtrados</button></div></div>
          {loadError?<div className="status-panel" role="alert">{loadError}</div>:!snapshot?<div className="status-panel">Carregando inventário…</div>:snapshot.status==="pending"?<div className="status-panel">Snapshot ainda não importado. <Out href={inventorySheet}>Consultar planilha</Out></div>:<div className="inventory-table-shell"><table className="inventory-table"><thead><tr>{["Tag","Imagem","Componente","Ref. PCB","Subsistema","Qtde","Modelo / valor","Função"].map(x=><th key={x} scope="col">{x}</th>)}</tr></thead><tbody>{filtered.map(item=><tr key={item.tag}><td><button className="plain-link" onClick={e=>openItem(item,e.currentTarget)}>{item.tag}</button></td><td><div className="table-photo"><ComponentImage item={item} onOpen={setPreview}/></div></td><td><button className="plain-link strong" onClick={e=>openItem(item,e.currentTarget)}>{item.name}</button></td><td>{item.pcb||"—"}</td><td>{item.subsystem}</td><td>{item.quantity||"—"}</td><td>{item.model||"—"}</td><td>{item.function}</td></tr>)}</tbody></table>{!filtered.length&&<div className="status-panel">Nenhum componente encontrado para os filtros atuais.</div>}</div>}
          {selected&&<div className="inventory-inspector"><Inspector item={selected} expanded={inspectorExpanded} onExpand={()=>setInspectorExpanded(v=>!v)} onClose={closeInspector} onOpen={setPreview} refTarget={inspectorRef}/></div>}
        </div> : page==="guia" ? <Guide base={base} onMedia={(url,title)=>setPreview({url,title})}/> : page==="fundamentos" ? <Fundamentals/> : page==="artigos" ? <Articles/> : page==="revisao" ? <Literature/> : <References base={base}/>}
      </div>}
      <footer className="app-footer"><span>NV Quantum Virtual Lab · V0.1 · estudo independente</span><span><Out href={project}>Código e fontes</Out> · <Out href="https://www.bibl-old.ita.br/logomarca_ita.htm">Origem da logomarca ITA</Out></span></footer>
    </div>
    {preview&&<Lightbox preview={preview} onClose={()=>setPreview(null)}/>}
  </div>;
}
createRoot(document.getElementById("root")!).render(<React.StrictMode><App/></React.StrictMode>);
