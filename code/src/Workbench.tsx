import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { fields, filterItems, exportCsv, safeUrl, validateSnapshot, type Item, type Snapshot } from "./Inventory";
import { findPhotoRegion, cropAspect, PHOTO_ORIGINAL_URL, type PhotoRegion } from "./PhotoRegions";
import { ENHANCED_CROPS, ENHANCED_OVERVIEW } from "./EnhancedPhotoAssets";
import { Articles, Fundamentals, Guide, References, navigationGroups, pageTitles, Out, type Page } from "./StudyPages";
import { ScientometricDashboard, PatentReviewPlaceholder } from "./ScientometricDashboard";
import { FLOW_STEPS, flowImageUrl, type FlowStep } from "./FlowData";
import { FlowPage } from "./FlowPage";
import { ImageViewer } from "./ImageViewer";
import { ImageOpeningContext } from "./InteractiveImage";
import { useImageNavigation } from "./ImageNavigation";
import { SchemeViewer } from "./SchemeViewer";
import { AboutPage } from "./AboutPage";
import { LabFuturePage } from "./LabFuturePages";
import { ContextInspector, type InspectorSelection, type ReferenceContext } from "./ContextInspector";
import { imagePresentation, presentedItem, presentedAsset } from "./ImagePresentation";
import { PhotoLayerControls, PhotoPolygonOverlay, type PhotoLayer } from "./PhotoLayers";
import { findPolygonRegion, polygonBounds } from "./PhotoRegions";
import { cardPageSize, pageNumbers } from "./Pagination";
import inventoryData from "../source/InventoryV1.json";
import "./Workbench.css";

const base = import.meta.env.BASE_URL;
const inventorySheet = "https://docs.google.com/spreadsheets/d/158OGccBdF5Hf6qdWIH2-Tmt_-gU8sO8pz3CvyTpycXU/edit?gid=2026110901#gid=2026110901";
const project = "https://github.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab";
const logo = "https://pgfis.ita.br/static/core/uploads/Post/ITA-logo_606c9f4c450c8e7bd0b4b118.jpg_606c9f4c450c8e7bd0b4b118.jpg.jpg";
const originalPhoto = base + imagePresentation.main.image;
const enhancedPhoto = base + "assets/official/v1/enhanced/";
const isPage = (v: string): v is Page => Object.prototype.hasOwnProperty.call(pageTitles, v);
function currentPage(): Page {
  const value = decodeURIComponent(window.location.hash.replace(/^#/, ""));
  return isPage(value) ? value : "explorar";
}

type GallerySlide = {url:string;title:string;number:number;caption:string;source:string};
type ImagePreview = { url: string; title: string; region?: PhotoRegion; gallery?:GallerySlide[]; index?:number };
function Crop({region, title, onClick, interactive = true}: {region: PhotoRegion; title: string; onClick?: () => void; interactive?: boolean}) {
  const visual=presentedItem(region.tag);
  const style: React.CSSProperties = { aspectRatio: String(visual?visual.outputSize[0]/visual.outputSize[1]:cropAspect(region)) };
  const file = ENHANCED_CROPS[region.tag];
  const Element=interactive&&onClick?"button":"div";
  return <Element className="crop-shell" style={style} onClick={interactive?onClick:undefined} {...(interactive&&onClick?{type:"button" as const,"aria-label":"Ampliar recorte real: "+title}:{})}>
    <img src={presentedAsset(enhancedPhoto + file,base)} draggable={false} loading="lazy"
      alt={"Recorte da fotografia do Uncut Gem V1: " + title}
      style={{width:"100%",height:"100%",position:"absolute",inset:0,objectFit:"contain"}} />
    {interactive && onClick && <span className="crop-overlay">Ampliar recorte <span aria-hidden="true">↗</span></span>}
  </Element>;
}
function Picture({url,label,onClick}: {url: string; label: string; onClick: (preview: ImagePreview) => void}) {
  const [failed,setFailed] = useState(false);
  useEffect(() => setFailed(false), [url]);
  const safe = safeUrl(url);
  if (!safe || failed) return <span className="image-placeholder">{url ? "Imagem indisponível" : "Sem imagem validada"}</span>;
  return <button type="button" className="image-button" onClick={() => onClick({url:safe,title:label})} aria-label={"Ampliar " + label}><img src={safe.startsWith("https://raw.githubusercontent.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/main/code/public/")?base+safe.split("/main/code/public/")[1]:safe} alt={label} loading="lazy" onError={() => setFailed(true)} /></button>;
}
function ComponentImage({item,onOpen}: {item: Item; onOpen: (preview: ImagePreview) => void}) {
  if (item.imageStatus && !findPhotoRegion(item.tag)) return <div className="component-visual">
    <Picture url={item.imageUrl} label={item.name} onClick={onOpen}/>
    <p className="image-provenance"><strong>{item.imageType}</strong> · {item.imageStatus}</p>
    <p className="visual-note">{item.imageNotes}</p>
  </div>;
  const region = findPhotoRegion(item.tag);
  if (region) return <div className="component-visual">
    <Crop region={region} title={item.name} onClick={() => onOpen({url:presentedAsset(enhancedPhoto+ENHANCED_CROPS[region.tag],base), title:"Recorte aprimorado do Uncut Gem V1 — "+item.name,region})} />
    <p className="image-provenance"><strong>Recorte de fotografia oficial</strong> · Quantum Village / Uncut Gem V1</p>
    <p className="visual-note">{region.note} Enquadramento centralizado e alinhamento geométrico; detalhes ausentes na fonte não podem ser recuperados.</p>
    <Out href={PHOTO_ORIGINAL_URL}>Fotografia integral de origem</Out>
  </div>;
  const type = item.imageType.toLocaleLowerCase("pt-BR");
  if (type.includes("gerada por ia")) return <div className="component-visual">
    <Picture url={item.imageUrl} label={"Ilustração por IA — "+item.name} onClick={onOpen} />
    <p className="image-provenance"><strong>Imagem ilustrativa por IA</strong> · pode não corresponder ao modelo original</p>
  </div>;
  if (type.includes("fotografia real")) return <div className="component-visual"><Picture url={item.imageUrl} label={item.name} onClick={onOpen}/><p className="image-provenance">{item.imageType}</p><p className="visual-note">{item.notes}</p><Out href={item.source}>Fonte técnica</Out></div>;
  if (type.includes("diagrama") || type.includes("render")) return <div className="component-visual">
    <Picture url={item.imageUrl} label={(type.includes("render")?"Render":"Diagrama")+" — "+item.name} onClick={onOpen} />
    <p className="image-provenance"><strong>{type.includes("render") ? "Render oficial de placa" : "Diagrama técnico"}</strong> · não é fotografia individual da peça</p>
  </div>;
  return <div className="component-visual">
    <div className="no-individual-photo"><span aria-hidden="true">▧</span><strong>Sem fotografia individual confirmada</strong><p>O inventário referencia a montagem completa; não será usada como se fosse uma foto isolada deste item.</p></div>
    {safeUrl(item.imageUrl) && <Out href={item.imageUrl}>Ver imagem de conjunto / contexto</Out>}
  </div>;
}
function Lightbox({preview,onClose}: {preview:ImagePreview;onClose:()=>void}) {
 const local=(url:string)=>url.startsWith("https://raw.githubusercontent.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/main/code/public/")?base+url.split("/main/code/public/")[1]:url;
 const images=preview.gallery?preview.gallery.map(slide=>({url:local(slide.url),title:"Etapa "+slide.number+": "+slide.title,caption:slide.caption,source:slide.source})):[{url:local(preview.url),title:preview.title,source:preview.region?PHOTO_ORIGINAL_URL:undefined}];
 return <ImageViewer images={images} initialIndex={preview.index||0} onClose={onClose}/>;
}
const v1Pages: Page[] = ["explorar", "inventario", "fluxo", "guia"];
const labPages: Page[] = [...v1Pages, "uncut-v2", "modelo3d"];
function isLabPage(page:Page){return labPages.includes(page);}
function isV1Page(page:Page){return v1Pages.includes(page);}
function App() {
  const [page,setPage]=useState<Page>(currentPage);
  const [collapsed,setCollapsed]=useState(()=>{try{return window.localStorage.getItem("nv-sidebar-collapsed")==="true"}catch{return false}});
  const [mobileMenu,setMobileMenu]=useState(false);
  // Grupos independentes; o laboratório e a Uncut Gem V1 estão abertos por padrão.
  const [labOpen,setLabOpen]=useState(()=>isLabPage(currentPage()));
  const [v1Open,setV1Open]=useState(()=>isV1Page(currentPage()));
  const [studyOpen,setStudyOpen]=useState(()=>!isLabPage(currentPage()));
  const [reviewOpen,setReviewOpen]=useState(()=>["artigos","revisao","patentes"].includes(currentPage()));
  const [snapshot,setSnapshot]=useState<Snapshot | null>(null);
  const [loadError,setLoadError]=useState("");
  const [query,setQuery]=useState("");
  const [subsystem,setSubsystem]=useState("");
  const [imageType,setImageType]=useState("");
  const [layer,setLayer]=useState("");
  const [face,setFace]=useState("");
  const [view,setView]=useState(()=>{try{return sessionStorage.getItem("nv-inventory-view")||"cards"}catch{return "cards"}});
  const [catalogPage,setCatalogPage]=useState(1);
  const [catalogWidth,setCatalogWidth]=useState(0);
  const catalogGridRef=useRef<HTMLDivElement>(null);
  const [sort,setSort]=useState<"tag"|"name"|"subsystem">("tag");
  const [selected,setSelected]=useState<Item | null>(null);
  const [selectedFlow,setSelectedFlow]=useState<FlowStep | null>(null);
  const [selectedReference,setSelectedReference]=useState<ReferenceContext | null>(null);
  const [pendingPcbTag,setPendingPcbTag]=useState<string|null>(null);
  const [inspectorExpanded,setInspectorExpanded]=useState(false);
  const [schemeOpen,setSchemeOpen]=useState(false);
  const [preview,setPreview]=useState<ImagePreview|null>(null);
  const [photoLayer,setPhotoLayer]=useState<PhotoLayer>("subsystems");
  const [focusedSubsystem,setFocusedSubsystem]=useState<string|null>(null);
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
  const photoNavigation=useImageNavigation({viewport:viewportRef,zoom,setZoom,offset:pan,setOffset:setPan,key:page});
  useEffect(()=>{
    try { setSnapshot(validateSnapshot(inventoryData)); } catch { setLoadError("Não foi possível validar o catálogo de referência."); }
  },[]);
  useEffect(()=>{
    function onHash(){
      const target=currentPage();
      setPage(target);setMobileMenu(false);
      if(isLabPage(target)){setLabOpen(true);if(isV1Page(target))setV1Open(true);}
      else {setStudyOpen(true);if(["artigos","revisao","patentes"].includes(target))setReviewOpen(true);}
    }
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
        if(schemeOpen)return;
        if(preview){setPreview(null);return;}
        if(document.fullscreenElement){document.exitFullscreen().catch(()=>{});return;}
        if(fullFallback){setFullFallback(false);return;}
        if(mobileMenu){setMobileMenu(false);return;}
        if(selected||selectedFlow||selectedReference){closeSelection();}
      }
    }
    document.addEventListener("keydown",onKey);
    return ()=>document.removeEventListener("keydown",onKey);
  },[selected,selectedFlow,selectedReference,preview,fullFallback,mobileMenu,schemeOpen]);
  useEffect(()=>{
    if((selected||selectedFlow||selectedReference)&&window.matchMedia("(max-width: 800px)").matches)inspectorRef.current?.focus();
  },[selected,selectedFlow,selectedReference]);
  const items=snapshot?.items||[];
  const filtered=filterItems(items,query,subsystem,imageType).filter(i=>(!layer||i.layer===layer)&&(!face||i.face===face)).sort((a,b)=>a[sort].localeCompare(b[sort],"pt-BR",{numeric:true}));
  const pageSize=cardPageSize(catalogWidth);
  const totalPages=Math.max(1,Math.ceil(filtered.length/pageSize));
  const activePage=Math.min(catalogPage,totalPages);
  const visibleCards=filtered.slice((activePage-1)*pageSize,activePage*pageSize);
  useEffect(()=>{setCatalogPage(1)},[query,subsystem,imageType,sort,layer,face,pageSize]);
  useEffect(()=>{
    const grid=catalogGridRef.current;
    if(!grid)return;
    const observer=new ResizeObserver(entries=>setCatalogWidth(entries[0].contentRect.width));
    observer.observe(grid);
    return ()=>observer.disconnect();
  },[page,view,snapshot]);
  const fitted=Math.max(0,Math.min(viewSize.width/photoSize.width,viewSize.height/photoSize.height));
  const imageDimensions={width:photoSize.width*fitted,height:photoSize.height*fitted};
  useEffect(()=>{
    if(!focusedSubsystem)return;
    const region=findPolygonRegion(focusedSubsystem);if(!region)return;
    const b=polygonBounds(region);
    const z=Math.min(8,Math.max(1,Math.min(viewSize.width/(imageDimensions.width*b.w/100),viewSize.height/(imageDimensions.height*b.h/100))*.82));
    setZoom(z);setPan({x:(50-b.x-b.w/2)*imageDimensions.width*z/100,y:(50-b.y-b.h/2)*imageDimensions.height*z/100});
  },[focusedSubsystem,viewSize.width,viewSize.height,imageDimensions.width,imageDimensions.height]);
  function expandSubsystem(tag:string){setFocusedSubsystem(tag);setPhotoLayer("components");clearSelection();}
  function leaveSubsystem(){setFocusedSubsystem(null);setPhotoLayer("subsystems");setZoom(1);setPan({x:0,y:0});clearSelection();}
  function choosePhotoLayer(mode:PhotoLayer){if(mode==="subsystems"){leaveSubsystem();return;}setPhotoLayer(mode);clearSelection();}
  function selectPolygon(item:Item){if(selected?.tag===item.tag){closeSelection();return;}openItem(item);}
  const selection:InspectorSelection|null = selectedFlow?{kind:"flow",step:selectedFlow}:selectedReference?{kind:"reference",reference:selectedReference}:selected?{kind:"component",item:selected}:null;
  function clearSelection(){setSelected(null);setSelectedFlow(null);setSelectedReference(null);setInspectorExpanded(false);}
  function go(target:Page){
    clearSelection();setPage(target);window.location.hash=target;setMobileMenu(false);
    if(isLabPage(target)){setLabOpen(true);if(isV1Page(target))setV1Open(true);}
    else {setStudyOpen(true);if(["artigos","revisao","patentes"].includes(target))setReviewOpen(true);}
  }
  function toggleNavGroup(group:"lab"|"study"){
    if(collapsed){
      setCollapsed(false);
      try{window.localStorage.setItem("nv-sidebar-collapsed","false");}catch{}
      if(group==="lab")setLabOpen(true);else setStudyOpen(true);
      return;
    }
    if(group==="lab")setLabOpen(open=>!open);else setStudyOpen(open=>!open);
  }
  function chooseV1(){
    // Em Estudo/Pesquisa, apenas abre a árvore; na V2 ou 3D, volta ao laboratório real.
    if(isLabPage(page)&&!isV1Page(page)){go("explorar");setV1Open(true);}
    else setV1Open(open=>!open);
  }
  function toggleCollapsed(){setCollapsed(v=>{try{window.localStorage.setItem("nv-sidebar-collapsed",String(!v))}catch{}return !v;});}
  function openItem(item:Item,trigger?:HTMLElement){lastSelectionRef.current=trigger||document.activeElement as HTMLElement;setSelectedFlow(null);setSelectedReference(null);setInspectorExpanded(false);setSelected(item);}
  function openStep(step:FlowStep,trigger:HTMLElement){lastSelectionRef.current=trigger;setSelected(null);setSelectedReference(null);setInspectorExpanded(false);setSelectedFlow(step);}
  function openReference(reference:ReferenceContext,trigger:HTMLElement){lastSelectionRef.current=trigger;setSelected(null);setSelectedFlow(null);setInspectorExpanded(false);setSelectedReference(reference);}
  function closeSelection(){clearSelection();lastSelectionRef.current?.focus();}
  function seePcb(tag:string){
    const item=items.find(row=>row.tag===tag)||null;
    setSelectedFlow(null);setSelectedReference(null);setInspectorExpanded(false);
    setSelected(item);setPendingPcbTag(item?null:tag);
    const region=findPolygonRegion(tag);
    if(region&&item?.layer==="B"){setFocusedSubsystem(item.parentTag);setPhotoLayer("components");}
    else {setFocusedSubsystem(null);setPhotoLayer("subsystems");setZoom(1);setPan({x:0,y:0});}
    setLabOpen(true);setV1Open(true);
    setPage("explorar");window.location.hash="explorar";setMobileMenu(false);
  }
  useEffect(()=>{
    if(!pendingPcbTag||!snapshot)return;
    const matching=snapshot.items.find(row=>row.tag===pendingPcbTag);
    if(matching)setSelected(matching);
    setPendingPcbTag(null);
  },[pendingPcbTag,snapshot]);
  function openFlowGallery(index:number){
    const gallery=FLOW_STEPS.map(step=>({url:flowImageUrl(step,base),title:step.title,number:step.number,caption:step.imageNote,source:step.sourceUrl}));
    setPreview({url:gallery[index].url,title:gallery[index].title,gallery,index});
  }
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
  return <ImageOpeningContext.Provider value={image=>setPreview({url:image.url,title:image.title})}><div className={"app-shell"+(page==="explorar"?" explore-fixed":"")+(collapsed?" menu-collapsed":"")}>
    {mobileMenu&&<button className="mobile-scrim" aria-label="Fechar navegação" onClick={()=>setMobileMenu(false)} />}
    <aside className={"nav-sidebar"+(mobileMenu?" mobile-open":"")} aria-label="Navegação do laboratório">
      <div className="sidebar-top"><div className="identity">
        <div className="identity-icon" aria-hidden="true">NV</div>
        {!collapsed&&<div className="identity-text"><strong>NV Quantum<br/>Virtual Lab</strong><small>AMBIENTE DE PESQUISA</small></div>}
      </div><button className="sidebar-toggle" type="button" title={collapsed?"Expandir menu":"Recolher menu"} aria-label={collapsed?"Expandir menu lateral":"Recolher menu lateral"} onClick={toggleCollapsed}>{collapsed?"»":"«"}</button></div>
      <div className="sidebar-ita"><button type="button" className="logo-image-button" onClick={()=>setPreview({url:logo,title:"Logomarca do ITA"})} aria-label="Ampliar logomarca do ITA" title="ITA — Instituto Tecnológico de Aeronáutica">{logoFailed?<strong>ITA</strong>:<img src={logo} alt="Logomarca do ITA, exibida a partir de site institucional" onError={()=>setLogoFailed(true)}/>}</button>{!collapsed&&<small>Identidade institucional de referência<br/>Projeto acadêmico independente</small>}</div>
      <nav className="side-navigation nav-tree" aria-label="Seções">
        <section className="nav-tree-group">
          <button type="button" className={"nav-group-toggle"+(isLabPage(page)?" group-current":"")}
            aria-label="Laboratório" title="Laboratório" aria-expanded={labOpen&&!collapsed} aria-controls="nav-laboratorio"
            onClick={()=>toggleNavGroup("lab")}>
            <span className="nav-icon" aria-hidden="true">⚗</span>
            {!collapsed&&<><span className="nav-group-name">Laboratório</span><span className={"nav-chevron"+(labOpen?" expanded":"")} aria-hidden="true">⌄</span></>}
          </button>
          <div id="nav-laboratorio" className="nav-tree-children" hidden={!labOpen||collapsed}>
            <button type="button" className={"nav-branch-toggle"+(isV1Page(page)?" branch-current":"")}
              aria-label="Uncut Gem V1" title="Uncut Gem V1" aria-expanded={v1Open} aria-controls="nav-v1-pages"
              onClick={chooseV1}>
              <span className="nav-branch-mark" aria-hidden="true">◆</span><span>Uncut Gem V1</span>
              <span className={"nav-chevron"+(v1Open?" expanded":"")} aria-hidden="true">⌄</span>
            </button>
            <div id="nav-v1-pages" className="nav-v1-pages" hidden={!v1Open}>
              {navigationGroups[0].pages.map(p=><button type="button" key={p.key}
                title={pageTitles[p.key]} aria-label={pageTitles[p.key]} aria-current={page===p.key?"page":undefined}
                className={"nav-item nav-leaf"+(page===p.key?" active":"")}
                onClick={()=>go(p.key)}>
                <span className="nav-icon" aria-hidden="true">{p.icon}</span><span>{pageTitles[p.key]}</span>
              </button>)}
            </div>
            <button type="button" className={"nav-item nav-future-item"+(page==="uncut-v2"?" active":"")}
              aria-current={page==="uncut-v2"?"page":undefined} onClick={()=>go("uncut-v2")} title="Uncut Gem V2 — ainda não implementado">
              <span className="nav-icon" aria-hidden="true">◇</span><span>Uncut Gem V2<small>Ainda não implementado</small></span>
            </button>
            <button type="button" className={"nav-item nav-future-item"+(page==="modelo3d"?" active":"")}
              aria-current={page==="modelo3d"?"page":undefined} onClick={()=>go("modelo3d")} title="Implementações futuras">
              <span className="nav-icon" aria-hidden="true">⬡</span><span>NV-Print 3D Stegemann<small>Implementações futuras</small></span>
            </button>
          </div>
        </section>
        <section className="nav-tree-group">
          <button type="button" className={"nav-group-toggle"+(!isLabPage(page)?" group-current":"")}
            aria-label="Estudo e Pesquisa" title="Estudo e Pesquisa"
            aria-expanded={studyOpen&&!collapsed} aria-controls="nav-estudo"
            onClick={()=>toggleNavGroup("study")}>
            <span className="nav-icon" aria-hidden="true">▤</span>
            {!collapsed&&<><span className="nav-group-name">Estudo e Pesquisa</span><span className={"nav-chevron"+(studyOpen?" expanded":"")} aria-hidden="true">⌄</span></>}
          </button>
          <div id="nav-estudo" className="nav-tree-children nav-study-pages" hidden={!studyOpen||collapsed}>
            {navigationGroups[1].pages.slice(0,1).map(p=><button type="button" key={p.key}
              title={pageTitles[p.key]} aria-label={pageTitles[p.key]} aria-current={page===p.key?"page":undefined}
              className={"nav-item nav-leaf"+(page===p.key?" active":"")} onClick={()=>go(p.key)}>
              <span className="nav-icon" aria-hidden="true">{p.icon}</span><span>{pageTitles[p.key]}</span>
            </button>)}
            <button type="button" className={"nav-branch-toggle nav-review-toggle"+(["artigos","revisao","patentes"].includes(page)?" branch-current":"")}
              aria-label="Revisão Bibliográfica" aria-expanded={reviewOpen} aria-controls="nav-revisao-pages"
              onClick={()=>setReviewOpen(v=>!v)}>
              <span className="nav-branch-mark" aria-hidden="true">≡</span><span>Revisão Bibliográfica</span>
              <span className={"nav-chevron"+(reviewOpen?" expanded":"")} aria-hidden="true">⌄</span>
            </button>
            <div id="nav-revisao-pages" className="nav-v1-pages nav-review-pages" hidden={!reviewOpen}>
              {([{key:"artigos",icon:"▣"},{key:"revisao",icon:"≋"},{key:"patentes",icon:"◇"}] as const).map(p=><button type="button" key={p.key}
                title={pageTitles[p.key]} aria-label={pageTitles[p.key]} aria-current={page===p.key?"page":undefined}
                className={"nav-item nav-leaf"+(page===p.key?" active":"")} onClick={()=>go(p.key)}>
                <span className="nav-icon" aria-hidden="true">{p.icon}</span>
                <span>{pageTitles[p.key]}{p.key==="patentes"&&<small className="sciento-coming-soon">Em breve</small>}</span>
              </button>)}
            </div>
            {navigationGroups[1].pages.slice(1).map(p=><button type="button" key={p.key}
              title={pageTitles[p.key]} aria-label={pageTitles[p.key]} aria-current={page===p.key?"page":undefined}
              className={"nav-item nav-leaf"+(page===p.key?" active":"")} onClick={()=>go(p.key)}>
              <span className="nav-icon" aria-hidden="true">{p.icon}</span><span>{pageTitles[p.key]}</span>
            </button>)}
          </div>
        </section>
      </nav>
      <div className="sidebar-bottom"><div className="author-block">{!collapsed&&<><strong>Leonardo Camargo Rossato</strong><Out href="https://leonardocamargorossato.github.io/LCR-SolutionsArchitecture-IA-Quantum/#/">Portfólio</Out><span>ITA — Instituto Tecnológico de Aeronáutica</span><small>Projeto acadêmico independente. Sem declaração de endosso oficial.</small></>}{collapsed&&<a href="https://leonardocamargorossato.github.io/LCR-SolutionsArchitecture-IA-Quantum/#/" title="Portfólio — Leonardo Camargo Rossato" aria-label="Portfólio">↗</a>}</div></div>
    </aside>
    <div className="main-column">
      <div className="mobile-bar"><button type="button" onClick={()=>{setCollapsed(false);setMobileMenu(true)}} aria-label="Abrir menu lateral">☰</button><strong>NV Quantum Virtual Lab</strong><span>Laboratório</span></div>
      <div className={"workspace-layout"+(selection?" has-inspector":"")+(selection&&inspectorExpanded?" wide-inspector":"")}>
        {selection&&<ContextInspector selection={selection} expanded={inspectorExpanded} onExpand={()=>setInspectorExpanded(x=>!x)} onClose={closeSelection} onSeePcb={seePcb} renderComponent={item=><ComponentImage item={item} onOpen={setPreview}/>} onOpenItem={tag=>{const item=items.find(i=>i.tag===tag);if(item)openItem(item)}} onChildren={tag=>{const item=items.find(i=>i.tag===tag);if(item){go("inventario");setQuery("");setLayer("B");setSubsystem(item.name);setFace("");setImageType("");}}} items={items} onOpenFlowImage={step=>openFlowGallery(step.number-1)} refTarget={inspectorRef} base={base}/>}
        <div className="workspace-primary">
      {page==="explorar" ? <div className="workbench-page">
        <div className="compact-toolbar"><div><span className="overline">LABORATÓRIO FOTOGRÁFICO · 2D</span><h1>Explorar</h1></div><div className="toolbar-right"><span className="small-source">Foto real alinhada · Quantum Village</span><button type="button" className="toolbar-button" onClick={()=>setSchemeOpen(true)}>Ver esquema 2D</button><button className="toolbar-button" onClick={()=>setPreview({url:presentedAsset(enhancedPhoto+ENHANCED_OVERVIEW,base),title:"Fotografia do Uncut Gem V1 — visão geral aprimorada"})}>Abrir foto aprimorada</button><button className="toolbar-button" onClick={fullscreen} aria-label={isPhotoFull?"Sair da tela cheia":"Tela cheia da fotografia"}>{isPhotoFull?"↙ Sair da tela cheia":"⛶ Tela cheia"}</button></div></div>
        <div className="work-area">
          <section className={"photo-panel"+(fullFallback?" full-fallback":"")} ref={photoPanelRef} aria-label="Fotografia interativa do Uncut Gem V1">
            <div className="photo-header"><span><i className="live-dot" /> Uncut Gem V1 · montagem oficial</span><span>Frente da PCB · camadas A / B</span></div>
            <PhotoLayerControls mode={photoLayer} focus={focusedSubsystem} items={items} onMode={choosePhotoLayer} onBack={leaveSubsystem} onExpand={expandSubsystem} onItem={item=>selectPolygon(item)}/>
            <div className="photo-viewport" ref={viewportRef} aria-label="Imagem da montagem Uncut Gem V1 com camadas poligonais"
              data-image-viewport {...photoNavigation.handlers}>
              {photoFailed?<div className="no-individual-photo">Fotografia indisponível. <Out href={PHOTO_ORIGINAL_URL}>Ver fonte original</Out></div>:<div className="photo-stage" style={{width:imageDimensions.width,height:imageDimensions.height,transform:"translate("+pan.x+"px, "+pan.y+"px) scale("+zoom+")"}}>
                <img src={originalPhoto} draggable={false} alt="Fotografia oficial da montagem Uncut Gem V1 com laser, prisma óptico, amplificador RF, ESP32 e OLED" onError={()=>setPhotoFailed(true)} onLoad={e=>setPhotoSize({width:e.currentTarget.naturalWidth,height:e.currentTarget.naturalHeight})}/>
                <PhotoPolygonOverlay mode={photoLayer} focus={focusedSubsystem} items={items} selected={selected?.tag} onSelect={selectPolygon} onExpand={expandSubsystem}/>
              </div>}
              <div className="photo-controls" onPointerDown={e=>e.stopPropagation()}><button onClick={()=>photoNavigation.changeZoom(zoom-.25)} aria-label="Diminuir zoom">−</button><output aria-live="polite">{Math.round(zoom*100)}%</output><button onClick={()=>photoNavigation.changeZoom(zoom+.25)} aria-label="Aumentar zoom">+</button><button className="reset-button" onClick={leaveSubsystem}>Redefinir</button><button onClick={fullscreen} aria-label={isPhotoFull?"Sair da tela cheia":"Maximizar foto"}>{isPhotoFull?"↙":"⛶"}</button></div>
            </div>
            <div className="photo-caption"><span>FOTOGRAFIA OFICIAL · AGPL-3.0</span><span>Arraste para mover · Roda do mouse para aproximar · Selecione um componente</span><Out href={PHOTO_ORIGINAL_URL}>Fonte e créditos</Out></div>
          </section>
        </div>

      </div> : <div className="content-page">
        {page==="inventario" ? <div className="inventory-page">
          <div className="section-heading"><span className="overline">LABORATÓRIO / DADOS</span><h1>Inventário — Uncut Gem V1</h1><p>Catálogo de subsistemas, componentes, imagens e documentação técnica.</p></div>
          <div className="inventory-summary"><div><strong>Uncut Gem V1</strong><p>{snapshot?.status==="validated"?"Referência XLSX · "+snapshot.snapshotAt+" · "+items.length+" registros":"Importação não concluída"}</p></div><Out href={inventorySheet}>Abrir no Google Planilhas</Out></div>
          <div className="inventory-layer" role="group" aria-label="Camada do inventário">{[["","Todas (A+B)"],["A","Camada A"],["B","Camada B"]].map(([value,label])=><button key={value} aria-pressed={layer===value} onClick={()=>setLayer(value)}>{label}</button>)}<button disabled title="Em breve">Camada C · Em breve</button></div>
          <div className="inventory-filters"><label>Buscar<input type="search" placeholder="Tag, componente, modelo, função…" value={query} onChange={e=>setQuery(e.target.value)}/></label>
            <label>Subsistema<select value={subsystem} onChange={e=>setSubsystem(e.target.value)} aria-label="Subsistema"><option value="">Todos</option>{Array.from(new Set(items.map(i=>i.subsystem))).sort().map(s=><option key={s} value={s}>{s}</option>)}</select></label>
            <label>Tipo de imagem<select value={imageType} onChange={e=>setImageType(e.target.value)} aria-label="Tipo de imagem"><option value="">Todos</option>{Array.from(new Set(items.map(i=>i.imageType))).sort().map(s=><option key={s} value={s}>{s}</option>)}</select></label>
            <label>Face da PCB<select aria-label="Face da PCB" value={face} onChange={e=>setFace(e.target.value)}><option value="">Todas</option>{Array.from(new Set(items.map(i=>i.face))).sort().map(f=><option key={f}>{f}</option>)}</select></label>
            <label>Ordenar<select value={sort} onChange={e=>setSort(e.target.value as typeof sort)} aria-label="Ordenar por"><option value="tag">Tag</option><option value="name">Componente</option><option value="subsystem">Subsistema</option></select></label></div>
          <div className="inventory-tools"><div><button onClick={()=>{setQuery("");setSubsystem("");setImageType("");setLayer("");setFace("");setSort("tag")}}>Limpar filtros</button>{["cards","list"].map(mode=><button key={mode} aria-pressed={view===mode} onClick={()=>{setView(mode);try{sessionStorage.setItem("nv-inventory-view",mode)}catch{}}}>{mode==="cards"?"▦ Cards":"☷ Lista"}</button>)}</div><span aria-live="polite">{filtered.length} de {items.length} itens · Inventário do Uncut Gem V1</span><div><button disabled={!items.length} onClick={()=>download(true)}>Baixar CSV · todos</button><button disabled={!filtered.length} onClick={()=>download(false)}>CSV · filtrados</button></div></div>
          {loadError?<div className="status-panel" role="alert">{loadError}</div>:!snapshot?<div className="status-panel">Carregando inventário…</div>:snapshot.status==="pending"?<div className="status-panel">Snapshot ainda não importado. <Out href={inventorySheet}>Consultar planilha</Out></div>:view==="cards"?<><div ref={catalogGridRef} className="inventory-cards" data-page-size={pageSize}>{visibleCards.map(item=><article key={item.tag} data-tag={item.tag} className="inventory-card"><div className="catalog-image"><ComponentImage item={item} onOpen={setPreview}/></div><button className="plain-link strong" onClick={e=>openItem(item,e.currentTarget)}>{item.name}</button><span>{item.tag} · Camada {item.layer}</span><span>{item.subsystem} · {item.pcb||"Sem referência PCB"}</span><p>{item.function}</p></article>)}{!filtered.length&&<p>Nenhum componente encontrado para os filtros atuais.</p>}</div><nav className="inventory-pagination" aria-label="Páginas do inventário"><button disabled={activePage===1} onClick={()=>setCatalogPage(activePage-1)}>Anterior</button>{pageNumbers(activePage,totalPages).map((number,index)=>number===null?<span key={"gap"+index}>…</span>:<button key={number} aria-label={"Página "+number} aria-current={activePage===number?"page":undefined} onClick={()=>setCatalogPage(number)}>{number}</button>)}<button disabled={activePage===totalPages} onClick={()=>setCatalogPage(activePage+1)}>Próxima</button><span role="status">Página {activePage} de {totalPages} · {filtered.length} resultados</span></nav></>:<div className="inventory-table-shell"><table className="inventory-table"><thead><tr>{["Tag","Imagem","Componente","Ref. PCB","Subsistema","Qtde","Modelo / valor","Função"].map(x=><th key={x} scope="col">{x}</th>)}</tr></thead><tbody>{filtered.map(item=><tr key={item.tag}><td><button className="plain-link" onClick={e=>openItem(item,e.currentTarget)}>{item.tag}</button></td><td><div className="table-photo"><ComponentImage item={item} onOpen={setPreview}/></div></td><td><button className="plain-link strong" onClick={e=>openItem(item,e.currentTarget)}>{item.name}</button></td><td>{item.pcb||"—"}</td><td>{item.subsystem}</td><td>{item.quantity||"—"}</td><td>{item.model||"—"}</td><td>{item.function}</td></tr>)}</tbody></table>{!filtered.length&&<div className="status-panel">Nenhum componente encontrado para os filtros atuais.</div>}</div>}
        </div> : page==="fluxo" ? <FlowPage base={base} onInspect={openStep} onPcb={step=>seePcb(step.pcbTag)} onGallery={openFlowGallery} activeStepId={selectedFlow?.id}/> : page==="guia" ? <Guide base={base} onMedia={(url,title)=>setPreview({url,title})}/> : page==="fundamentos" ? <Fundamentals/> : page==="artigos" ? <Articles/> : page==="revisao" ? <ScientometricDashboard/> : page==="patentes" ? <PatentReviewPlaceholder/> : page==="sobre" ? <AboutPage/> : (page==="uncut-v2"||page==="modelo3d") ? <LabFuturePage kind={page==="uncut-v2"?"v2":"modelo3d"} onReturn={()=>go("explorar")}/> : <References base={base} onInspect={openReference}/>}
      </div>}
        </div>
      </div>
      <footer className="app-footer"><span>NV Quantum Virtual Lab · estudo acadêmico independente</span><span><Out href={project}>Código e fontes</Out> · <Out href="https://www.bibl-old.ita.br/logomarca_ita.htm">Origem da logomarca ITA</Out></span></footer>
    </div>
    {schemeOpen&&<SchemeViewer base={base} onClose={()=>setSchemeOpen(false)}/>}
    {preview&&<Lightbox preview={preview} onClose={()=>setPreview(null)}/>}
  </div></ImageOpeningContext.Provider>;
}
createRoot(document.getElementById("root")!).render(<React.StrictMode><App/></React.StrictMode>);
