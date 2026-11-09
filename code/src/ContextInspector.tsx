import React from "react";
import { fields, safeUrl, type Item } from "./Inventory";
import { findPhotoRegion } from "./PhotoRegions";
import { flowImageUrl, type FlowStep } from "./FlowData";

export type ReferenceContext = {
  id:string;
  title:string;
  description:string;
  origin:string;
  links:{label:string;url:string}[];
};
export type InspectorSelection =
  | {kind:"component";item:Item}
  | {kind:"flow";step:FlowStep}
  | {kind:"reference";reference:ReferenceContext};

type Props = {
  selection:InspectorSelection;
  expanded:boolean;
  onExpand:()=>void;
  onClose:()=>void;
  onSeePcb:(tag:string)=>void;
  renderComponent:(item:Item)=>React.ReactNode;
  onOpenFlowImage:(step:FlowStep)=>void;
  refTarget:React.RefObject<HTMLElement | null>;
  base:string;
};
function Link({href,children}: {href:string;children:React.ReactNode}) {
  return safeUrl(href)?<a href={href} target="_blank" rel="noopener noreferrer">{children} ↗</a>:null;
}
/** Um único inspetor contextual utilizado por PCB, inventário, fluxo e referências. */
export function ContextInspector({selection,expanded,onExpand,onClose,onSeePcb,renderComponent,onOpenFlowImage,refTarget,base}:Props) {
  const isComponent=selection.kind==="component";
  const isFlow=selection.kind==="flow";
  const title=isComponent?selection.item.name:isFlow?selection.step.title:selection.reference.title;
  return <aside className={"inspector context-inspector"+(expanded?" inspector-expanded":"")} tabIndex={-1} ref={refTarget} aria-label={"Painel de informações: "+title}>
    <div className="inspector-heading"><div>
      <span className="overline">{isComponent?"INSPEÇÃO DE COMPONENTE":isFlow?"ETAPA DE FUNCIONAMENTO":"DOCUMENTAÇÃO / REFERÊNCIA"}</span>
      <h2>{title}</h2>
    </div><button type="button" className="close-icon" onClick={onClose} aria-label="Fechar inspetor">×</button></div>
    <div className="inspector-scroll">
      {selection.kind==="component"?<>
        <div className="item-meta"><span className="tag-pill">{selection.item.tag}</span><span>{findPhotoRegion(selection.item.tag)?"Localizado na fotografia oficial":"Sem localização individual confirmada na foto"}</span></div>
        {renderComponent(selection.item)}
        <dl className="field-list">{(Object.keys(fields) as (keyof Item)[]).filter(k=>!["tag","name","imageUrl","source","datasheet"].includes(k)).map(k=><div key={k}><dt>{fields[k]}</dt><dd>{selection.item[k]||"Não documentado"}</dd></div>)}</dl>
        <div className="source-line"><Link href={selection.item.source}>Fonte técnica</Link><Link href={selection.item.datasheet}>Datasheet</Link><Link href={selection.item.imageUrl}>Imagem do inventário</Link></div>
        <p className="price-disclaimer">Os preços do inventário são referências históricas, não cotações atuais.</p>
        <button type="button" className="inspector-pcb-link" onClick={()=>onSeePcb(selection.item.tag)}>
          Ver na PCB
        </button>
        {!findPhotoRegion(selection.item.tag)&&<p className="visual-note">O componente não tem hotspot próprio validado; a foto geral será mostrada com a ficha, sem localização inventada.</p>}
      </>:selection.kind==="flow"?<>
        <div className="item-meta"><span className="tag-pill">ETAPA {String(selection.step.number).padStart(2,"0")}</span><span>{selection.step.imageKind}</span></div>
        <button type="button" className="context-photo-button" onClick={()=>onOpenFlowImage(selection.step)} aria-label={"Ampliar imagem da etapa "+selection.step.number}>
          <img src={flowImageUrl(selection.step,base)} alt={selection.step.imageAlt}/>
          <span>Ampliar imagem ↗</span>
        </button>
        <p className="visual-note">{selection.step.imageNote}</p>
        <h3>Funcionamento</h3><p className="context-explanation">{selection.step.detail}</p>
        <h3>Relação com o sistema</h3><p className="context-explanation">{selection.step.connection}</p>
        <h3>Itens relacionados no inventário</h3><div className="related-tags">{selection.step.relatedTags.map(tag=><span key={tag} className="tag-pill">{tag}</span>)}</div>
        <button type="button" className="inspector-pcb-link" onClick={()=>onSeePcb(selection.step.pcbTag)}>Ver na PCB</button>
        <div className="source-line"><Link href={selection.step.sourceUrl}>Referência do projeto</Link></div>
      </>:<>
        <p className="context-explanation">{selection.reference.description}</p>
        <p className="image-provenance">Origem: {selection.reference.origin}</p>
        <h3>Fontes disponíveis</h3>
        <div className="reference-inspector-links">{selection.reference.links.map(link=><Link key={link.url} href={link.url}>{link.label}</Link>)}</div>
      </>}
    </div>
    <div className="inspector-footer">
      <button type="button" onClick={onExpand}>{expanded?"Reduzir painel":"Expandir painel"}</button>
      <button type="button" onClick={onClose}>Fechar</button>
    </div>
  </aside>;
}
