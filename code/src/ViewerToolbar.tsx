import {useEffect,useRef,useState,type ReactNode} from 'react';
import {ImageIcon} from './ImageViewer';
import {PHOTO_ORIGINAL_URL} from './PhotoRegions';
import type {PhotoLayer} from './PhotoLayers';
function Arrow({up=false}:{up?:boolean}){return <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={up?'m6 15 6-6 6 6':'m6 9 6 6 6-6'}/></svg>}
export function ViewerToolbar({children,zoomControls,layerMode,layerFocus,onLayerChange,onScheme,onFullscreen,fullscreen}:{children:ReactNode;zoomControls:ReactNode;layerMode:PhotoLayer;layerFocus:string|null;onLayerChange:(mode:PhotoLayer)=>void;onScheme:()=>void;onFullscreen:()=>void;fullscreen:boolean}){
 const [minimized,setMinimized]=useState(false);
 const [expanded,setExpanded]=useState(false),[menu,setMenu]=useState(false),[credits,setCredits]=useState(false);
 const [hint,setHint]=useState(()=>{try{return !localStorage.getItem('nv-explore-toolbar-hint-seen')}catch{return true}});
 const restoreFocus=useRef(false);
 const root=useRef<HTMLDivElement>(null),menuRef=useRef<HTMLDivElement>(null),trigger=useRef<HTMLButtonElement>(null),layerTrigger=useRef<HTMLButtonElement>(null),creditsRef=useRef<HTMLDialogElement>(null);
 useEffect(()=>{if(restoreFocus.current){root.current?.querySelector<HTMLButtonElement>('button')?.focus();restoreFocus.current=false}},[minimized]);
 useEffect(()=>{if(!hint)return;const timer=setTimeout(()=>setHint(false),1200);return ()=>clearTimeout(timer)},[hint]);
 useEffect(()=>{try{localStorage.setItem('nv-explore-toolbar-minimized',String(minimized));localStorage.setItem('nv-explore-toolbar-hint-seen','true')}catch{}},[minimized]);
 useEffect(()=>{
  if(!menu&&!expanded)return;
  const outside=(e:PointerEvent)=>{if(!root.current?.contains(e.target as Node)){setMenu(false);setExpanded(false)}};
  document.addEventListener('pointerdown',outside);return ()=>document.removeEventListener('pointerdown',outside);
 },[menu,expanded]);
 useEffect(()=>{if(menu)menuRef.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus()},[menu]);
 useEffect(()=>{if(credits)creditsRef.current?.showModal()},[credits]);
 function closeMenu(){setMenu(false);trigger.current?.focus()}
 function action(fn:()=>void){closeMenu();fn()}
 function closeCredits(){setCredits(false);trigger.current?.focus()}
 return <div ref={root} className={'viewer-toolbar'+(minimized?' is-minimized':'')} onKeyDown={e=>{
  if(e.key==='Escape'&&(menu||expanded||credits)){e.stopPropagation();if(menu){e.preventDefault();closeMenu()}else if(expanded){e.preventDefault();setExpanded(false);layerTrigger.current?.focus()}}
 }}>
  {minimized?<button type="button" className={'viewer-restore'+(hint?' viewer-hint':'')} aria-label="Restaurar barra do visualizador" title="Restaurar barra do visualizador" onClick={()=>{restoreFocus.current=true;setMinimized(false)}}><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 5v14m5-7h11m-5-5 5 5-5 5"/></svg></button>:<>
   <div className="viewer-toolbar-row">
    <button type="button" className="viewer-toolbar-icon" aria-label="Minimizar barra do visualizador" title="Minimizar barra do visualizador" onClick={()=>{restoreFocus.current=true;setMinimized(true);setExpanded(false);setMenu(false)}}><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 5v14m16-7H9m5-5-5 5 5 5"/></svg></button>
    <span className="viewer-assembly"><i className="live-dot"/> Uncut Gem V1 <small>· montagem oficial</small></span>
    <div className="viewer-toolbar-actions">{zoomControls}<div className="viewer-layer-group">
      <div className="viewer-layer-modes" role="group" aria-label="Camada da fotografia">
       {([['subsystems','Subsistemas'],['components','Componentes'],['none','Nenhuma']] as const).map(([value,label])=><button key={value} type="button" className={value==='subsystems'&&layerMode==='none'?'viewer-layer-callout':undefined} aria-pressed={layerMode===value} title={value==='components'&&!layerFocus?'Mostrar todos os componentes visíveis da PCB':undefined} onClick={()=>onLayerChange(value)}>{label}</button>)}
      </div>
      <button type="button" ref={layerTrigger} className="viewer-layer-toggle" aria-label={expanded?'Recolher controles de camadas':'Expandir controles de camadas'} aria-expanded={expanded} aria-controls="viewer-layer-controls" title={expanded?'Ocultar detalhes das camadas':'Exibir detalhes das camadas'} onClick={()=>{setExpanded(v=>!v);setMenu(false)}}><Arrow up={expanded}/></button>
        </div><div className="viewer-modules"><button type="button" ref={trigger} className="viewer-modules-trigger" aria-haspopup="menu" aria-controls="viewer-modules-menu" aria-expanded={menu} onClick={()=>{setMenu(v=>!v);setExpanded(false)}}>Módulos e Visualização <Arrow up={menu}/></button>
    {menu&&<div ref={menuRef} id="viewer-modules-menu" className="viewer-modules-menu" role="menu" aria-label="Módulos e Visualização" onKeyDown={e=>{
     const entries=Array.from(menuRef.current!.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'));
     const index=entries.indexOf(document.activeElement as HTMLButtonElement);
     const next=e.key==='ArrowDown'?(index+1)%entries.length:e.key==='ArrowUp'?(index+entries.length-1)%entries.length:e.key==='Home'?0:e.key==='End'?entries.length-1:null;
     if(next!==null){e.preventDefault();entries[next].focus()}if(e.key==='Tab')setMenu(false);
    }}>
     <button type="button" role="menuitem" onClick={()=>action(onScheme)}>Ver esquema 2D</button>
     <button type="button" role="menuitem" onClick={()=>action(onFullscreen)}>{fullscreen?'Sair da tela cheia':'Tela cheia'}</button>
     <button type="button" role="menuitem" disabled aria-disabled="true">Visualizar prisma 3D <small>Em breve</small></button>
     <button type="button" role="menuitem" onClick={()=>action(()=>setCredits(true))}>Informações e créditos</button>
    </div>}
    </div></div>
   </div>
   {expanded&&<section id="viewer-layer-controls" className="viewer-layer-popover" aria-label="Controles de camadas" onClick={e=>{if((e.target as Element).closest(".photo-unmapped button,.photo-layer-note button"))setExpanded(false)}}>{children}</section>}
  </>}
  {credits&&<dialog className="viewer-credits" ref={creditsRef} aria-label="Informações e créditos" onCancel={e=>{e.preventDefault();closeCredits()}}>
   <div className="viewer-credits-heading"><h2>Informações e créditos</h2><button type="button" aria-label="Fechar créditos" onClick={closeCredits}><ImageIcon kind="close"/></button></div>
   <p>Fotografia oficial: Quantum Village / Uncut Gem V1. Licença AGPL-3.0.</p><p>Apresentação alinhada geometricamente; contornos aproximados para navegação, sem substituir documentação ou medições.</p>
   <p>Use a roda do mouse para zoom e clique e arraste para mover. Selecione os polígonos para inspecionar; use o ícone de expansão para entrar num subsistema.</p>
   <a href={PHOTO_ORIGINAL_URL} target="_blank" rel="noopener noreferrer">Fonte original e créditos ↗</a>
  </dialog>}
 </div>;
}
