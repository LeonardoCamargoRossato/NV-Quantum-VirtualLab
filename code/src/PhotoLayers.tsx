import React from "react";
import type { Item } from "./Inventory";
import { PHOTO_POLYGONS, subsystemPolygons, componentPolygons, polygonBounds, type PolygonRegion } from "./PhotoRegions";
export type PhotoLayer = "none" | "subsystems" | "components";
export function PhotoLayerControls({mode,focus,items,onExpand,onItem}:{mode:PhotoLayer;focus:string|null;items:Item[];onExpand:(tag:string)=>void;onItem:(item:Item)=>void}) {
 const parent=items.find(i=>i.tag===focus);
 const children=items.filter(i=>i.parentTag===focus);
 const missing=children.filter(i=>!componentPolygons.some(r=>r.tag===i.tag));
 const visible=children.length-missing.length;
 const regions=mode==='subsystems'?subsystemPolygons:mode==='components'?(focus?componentPolygons.filter(r=>children.some(i=>i.tag===r.tag)):componentPolygons):[];
 const classes=PHOTO_POLYGONS.classes as Record<string,{label:string;color:string}>;
 return <div className="photo-layer-panel">
  <div className="photo-layer-toolbar"><label className="photo-subsystem-select">Expandir subsistema<select aria-label="Expandir subsistema" value={focus||""} onChange={e=>{if(e.target.value)onExpand(e.target.value)}}><option value="">Escolha uma região…</option>{subsystemPolygons.map(r=>{const item=items.find(i=>i.tag===r.tag);return item?<option key={r.tag} value={r.tag}>{item.name}</option>:null})}</select></label></div>
  <p className="photo-layer-context" role="status">{parent?parent.name+' · '+visible+' de '+children.length+' componentes com contorno frontal':mode==='none'?'Foto sem sobreposições.':mode==='components'?'Camada B · selecione componentes para inspeção.':'Camada A · selecione para inspecionar; use ↗ para expandir e ver componentes.'}</p>
  {mode!=='none'&&<div className="photo-layer-legend" aria-label="Legenda de cores">{mode==='subsystems'?regions.map(r=><span key={r.tag}><i style={{background:r.color}}/>{items.find(i=>i.tag===r.tag)?.name}</span>):Array.from(new Set(regions.map(r=>r.class!))).map(key=><span key={key}><i style={{background:classes[key].color}}/>{classes[key].label}</span>)}</div>}
  {focus&&missing.length>0&&<details className="photo-unmapped"><summary>{missing.length} itens sem contorno ativo</summary><p>Itens internos, ocultos, omitidos desta visualização ou sem identificação individual suficiente nesta foto. Consulte a ficha sem atribuir uma posição fictícia.</p>{missing.map(i=><button key={i.tag} type="button" onClick={()=>onItem(i)}>{i.name}</button>)}</details>}
  {!focus&&mode!=='none'&&<p className="photo-layer-note">Contornos aproximados da montagem real. ADF4351 fica no verso e está disponível no <button type="button" onClick={()=>{const item=items.find(i=>i.tag==='UG-V1-S04');if(item)onItem(item)}}>inventário de subsistemas</button>.</p>}
 </div>;
}
export function PhotoPolygonOverlay({mode,focus,items,selected,onSelect,onExpand,rotation=0}:{rotation?:number;mode:PhotoLayer;focus:string|null;items:Item[];selected:string|undefined;onSelect:(item:Item)=>void;onExpand:(tag:string)=>void}) {
 const regions=mode==='subsystems'?subsystemPolygons:mode==='components'?(focus?componentPolygons.filter(r=>items.find(i=>i.tag===r.tag)?.parentTag===focus):componentPolygons):[];
 if(!regions.length)return null;
 const classes=PHOTO_POLYGONS.classes as Record<string,{label:string;color:string}>;
 function keyAction(e:React.KeyboardEvent,action:()=>void){if(e.key==='Enter'||e.key===' '){e.preventDefault();action()}}
 return <svg className="photo-polygon-overlay" viewBox="0 0 100 100" preserveAspectRatio="none" aria-label={mode==='subsystems'?'Polígonos dos subsistemas':'Polígonos dos componentes'}>
 {regions.map(region=>{const item=items.find(i=>i.tag===region.tag);if(!item)return null;const b=polygonBounds(region);const color=region.color||classes[region.class!].color;
 return <g key={region.tag} style={{'--region-color':color} as React.CSSProperties}>
  <g className={'photo-polygon'+(selected===item.tag?' is-selected':'')} data-tag={item.tag} role="button" tabIndex={0} aria-label={'Inspecionar '+item.name} aria-pressed={selected===item.tag} onClick={e=>{e.stopPropagation();onSelect(item)}} onKeyDown={e=>keyAction(e,()=>onSelect(item))}>
   <title>{item.name+' · '+item.tag+(region.label?' · '+region.label:'')}</title>{region.polygons.map((points,index)=><polygon key={index} points={points.map(p=>p.join(',')).join(' ')} vectorEffect="non-scaling-stroke"/>)}
   {region.label&&<text className="photo-region-label" x={b.x+b.w/2} y={b.y+b.h/2} textAnchor="middle" dominantBaseline="middle" transform={`rotate(${-rotation},${b.x+b.w/2},${b.y+b.h/2})`}>{region.label}</text>}
  </g>
  {mode==='subsystems'&&<g className="photo-polygon-expand" role="button" tabIndex={0} aria-label={'Expandir '+item.name} onPointerDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();onExpand(item.tag)}} onKeyDown={e=>keyAction(e,()=>onExpand(item.tag))}>
   <title>{'Expandir '+item.name}</title><rect x={b.x+b.w-3.8} y={b.y+0.4} width="3.4" height="3.4" rx=".6"/><path d={`M ${b.x+b.w-3} ${b.y+2.9} l 1.8 -1.8 m -1.6 0 h 1.6 v 1.6`} fill="none" stroke="white" strokeWidth=".25" pointerEvents="none"/>
  </g>}
 </g>})}</svg>;
}
