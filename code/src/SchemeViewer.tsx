import {useCallback,useEffect,useLayoutEffect,useRef,useState,type PointerEvent as ReactPointerEvent} from "react";
import "./SchemeViewer.css";

type Props={base:string;onClose:()=>void};
function SchemeIcon({kind}:{kind:"close"|"flip"|"expand"|"collapse"|"download"}){
  const paths={
    close:"M6 6l12 12M18 6L6 18",
    flip:"M20 8a8 8 0 0 0-14-3L3 8m0-5v5h5M4 16a8 8 0 0 0 14 3l3-3m0 5v-5h-5",
    expand:"M8 3H3v5m13-5h5v5m0 8v5h-5M8 21H3v-5",
    collapse:"M3 8h5V3m8 0v5h5m0 8h-5v5M8 21v-5H3",
    download:"M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5",
  };
  return <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={paths[kind]}/></svg>;
}
/** Two educational illustrations, not a simulated 3D model of the hardware. */
export function SchemeViewer({base,onClose}:Props){
  const dialog=useRef<HTMLDialogElement>(null);
  // Fullscreen API explicitly excludes <dialog>; request it on this inner surface.
  const surface=useRef<HTMLDivElement>(null);
  const scrollArea=useRef<HTMLDivElement>(null);
  const stage=useRef<HTMLDivElement>(null);
  const zoomRef=useRef(1);
  const pan=useRef<{id:number;x:number;y:number;left:number;top:number}|null>(null);
  const zoomAnchor=useRef<{x:number;y:number;viewportX:number;viewportY:number}|null>(null);
  const [dragging,setDragging]=useState(false);
  const previousFocus=useRef(document.activeElement instanceof HTMLElement?document.activeElement:null);
  const [back,setBack]=useState(false);
  const [zoom,setZoom]=useState(1);
  const [fitWidth,setFitWidth]=useState(0);
  const [fullscreen,setFullscreen]=useState(false);
  const [fullscreenSupported,setFullscreenSupported]=useState(true);
  const [fullscreenError,setFullscreenError]=useState("");
  const [failed,setFailed]=useState({front:false,back:false});
  const releasePan=useCallback(()=>{
    const pointer=pan.current;
    pan.current=null;
    setDragging(false);
    if(pointer&&scrollArea.current?.hasPointerCapture(pointer.id))scrollArea.current.releasePointerCapture(pointer.id);
  },[]);
  const changeZoom=useCallback((value:number,anchor?:{x:number;y:number})=>{
    const next=Math.round(Math.min(3,Math.max(1,value))*100)/100;
    if(next===zoomRef.current)return;
    if(pan.current)releasePan();
    const area=scrollArea.current,image=stage.current;
    if(area&&image){
      const viewport=area.getBoundingClientRect(),rect=image.getBoundingClientRect();
      const x=anchor?.x??viewport.left+area.clientLeft+area.clientWidth/2;
      const y=anchor?.y??viewport.top+area.clientTop+area.clientHeight/2;
      zoomAnchor.current={x:Math.min(1,Math.max(0,(x-rect.left)/rect.width)),y:Math.min(1,Math.max(0,(y-rect.top)/rect.height)),viewportX:x-viewport.left-area.clientLeft,viewportY:y-viewport.top-area.clientTop};
    }
    zoomRef.current=next;
    setZoom(next);
  },[releasePan]);
  useLayoutEffect(()=>{
    const anchor=zoomAnchor.current,area=scrollArea.current,image=stage.current;
    if(!anchor||!area||!image)return;
    zoomAnchor.current=null;
    const viewport=area.getBoundingClientRect(),rect=image.getBoundingClientRect();
    area.scrollLeft+=rect.left+rect.width*anchor.x-viewport.left-area.clientLeft-anchor.viewportX;
    area.scrollTop+=rect.top+rect.height*anchor.y-viewport.top-area.clientTop-anchor.viewportY;
  },[zoom,fitWidth]);
  useEffect(()=>{
    const area=scrollArea.current;
    if(!area)return;
    const wheel=(event:WheelEvent)=>{
      if(!event.deltaY)return;
      event.preventDefault();
      const unit=event.deltaMode===1?16:event.deltaMode===2?area.clientHeight:1;
      const delta=Math.min(500,Math.max(-500,event.deltaY*unit));
      changeZoom(zoomRef.current*Math.exp(-delta*.0015),{x:event.clientX,y:event.clientY});
    };
    area.addEventListener("wheel",wheel,{passive:false});
    return ()=>area.removeEventListener("wheel",wheel);
  },[changeZoom]);
  function resetView(){
    releasePan();zoomAnchor.current=null;zoomRef.current=1;setZoom(1);
    if(scrollArea.current){scrollArea.current.scrollLeft=0;scrollArea.current.scrollTop=0}
  }
  function startPan(event:ReactPointerEvent<HTMLDivElement>){
    if(zoomRef.current<=1||event.button!==0||!event.isPrimary)return;
    const area=event.currentTarget,rect=area.getBoundingClientRect();
    if(event.clientX>=rect.left+area.clientLeft+area.clientWidth||event.clientY>=rect.top+area.clientTop+area.clientHeight)return;
    event.preventDefault();
    pan.current={id:event.pointerId,x:event.clientX,y:event.clientY,left:area.scrollLeft,top:area.scrollTop};
    area.setPointerCapture(event.pointerId);setDragging(true);
  }
  function movePan(event:ReactPointerEvent<HTMLDivElement>){
    const start=pan.current;
    if(!start||event.pointerId!==start.id)return;
    event.currentTarget.scrollLeft=start.left-(event.clientX-start.x);
    event.currentTarget.scrollTop=start.top-(event.clientY-start.y);
  }
  useEffect(()=>{
    const element=dialog.current;
    const target=surface.current;
    const overflow=document.body.style.overflow;
    document.body.style.overflow="hidden";
    element?.showModal();
    setFullscreenSupported(Boolean(document.fullscreenEnabled&&target?.requestFullscreen));
    const updateFullscreen=()=>setFullscreen(document.fullscreenElement===target);
    document.addEventListener("fullscreenchange",updateFullscreen);
    const observer=new ResizeObserver(entries=>{
      const {width,height}=entries[0].contentRect;
      setFitWidth(Math.max(1,Math.floor(Math.min(width,height*1672/941))));
    });
    if(scrollArea.current)observer.observe(scrollArea.current);
    return ()=>{
      observer.disconnect();
      document.removeEventListener("fullscreenchange",updateFullscreen);
      if(document.fullscreenElement===target)void document.exitFullscreen().catch(()=>{});
      element?.close();
      document.body.style.overflow=overflow;
      previousFocus.current?.focus();
    };
  },[]);
  async function closeViewer(){
    if(document.fullscreenElement===surface.current){
      try{await document.exitFullscreen()}catch{/* Removing the viewer also ends fullscreen. */}
    }
    onClose();
  }
  async function toggleFullscreen(){
    setFullscreenError("");
    try{
      if(document.fullscreenElement===surface.current)await document.exitFullscreen();
      else await surface.current?.requestFullscreen();
    }catch{setFullscreenError("O navegador não permitiu ativar a tela cheia. Tente novamente pelo botão.")}
  }
  const flip=()=>{setBack(v=>!v);resetView()};
  const fileName="UncutGemV1"+(back?"Back":"Front")+"Scheme.png";
  const flipLabel=back?"Voltar para a frente":"Virar para o verso";
  const fullLabel=fullscreen?"Sair da tela cheia do esquema":"Expandir esquema em tela cheia";
  return <dialog ref={dialog} className="scheme-viewer" aria-labelledby="scheme-title" onCancel={event=>{event.preventDefault();void closeViewer()}} onKeyDown={event=>{
    if(event.key==="ArrowLeft"||event.key==="ArrowRight"){event.preventDefault();flip()}
  }}>
    <div ref={surface} className="scheme-surface">
      <header className="scheme-heading"><div><h2 id="scheme-title">Esquema 2D — Uncut Gem V1</h2><p role="status">{back?"Verso da PCB":"Frente da PCB"}</p></div>
        <div className="scheme-controls">
          <button type="button" onClick={flip} aria-label={flipLabel} title={flipLabel}><SchemeIcon kind="flip"/><span>Virar</span></button>
          <button type="button" aria-label="Diminuir zoom do esquema" disabled={zoom<=1} onClick={()=>changeZoom(zoomRef.current-.25)}>−</button>
          <output aria-label="Zoom do esquema">{Math.round(zoom*100)}%</output>
          <button type="button" aria-label="Aumentar zoom do esquema" disabled={zoom>=3} onClick={()=>changeZoom(zoomRef.current+.25)}>+</button>
          <button type="button" onClick={resetView}>Ajustar à tela</button>
          <a className="scheme-action" href={base+"assets/diagrams/"+fileName} download={fileName} aria-label={"Baixar PNG da "+(back?"face traseira":"face frontal")} title="Baixar PNG desta face"><SchemeIcon kind="download"/><span>Baixar PNG</span></a>
          <button type="button" className="scheme-icon-button" aria-label={fullLabel} title={fullscreenSupported?fullLabel:"Tela cheia indisponível neste navegador"} disabled={!fullscreenSupported} onClick={()=>void toggleFullscreen()}><SchemeIcon kind={fullscreen?"collapse":"expand"}/></button>
          <button type="button" className="scheme-icon-button" aria-label="Fechar esquema 2D" title="Fechar esquema 2D" onClick={()=>void closeViewer()}><SchemeIcon kind="close"/></button>
        </div>
      </header>
      {fullscreenError&&<p className="scheme-fullscreen-error" role="alert">{fullscreenError}</p>}
      <div ref={scrollArea} role="region" aria-label="Visualização do esquema 2D" className={"scheme-scroll"+(zoom>1?" scheme-pan-enabled":"")+(dragging?" scheme-dragging":"")} onPointerDown={startPan} onPointerMove={movePan} onPointerUp={releasePan} onPointerCancel={releasePan} onLostPointerCapture={releasePan}><div ref={stage} className="scheme-stage" style={{width:fitWidth?`${fitWidth*zoom}px`:"100%"}}>
        <div className={"scheme-card"+(back?" scheme-card-flipped":"")}>
          {([false,true] as const).map(isBack=>{
            const side=isBack?"back":"front";
            return <div key={side} className={"scheme-face scheme-"+side} aria-hidden={back!==isBack}>
              {failed[side]?<p className="scheme-load-error" role={back===isBack?"alert":undefined}>Não foi possível carregar esta imagem.</p>:<img
                src={base+"assets/diagrams/UncutGemV1"+(isBack?"Back":"Front")+"Scheme.png"}
                alt={"Esquema 2D da "+(isBack?"face traseira":"face frontal")+" do Uncut Gem V1"}
                onError={()=>setFailed(state=>({...state,[side]:true}))} draggable={false}/>}
            </div>;
          })}
        </div>
      </div></div>
      <footer className="scheme-footer">Roda do mouse: zoom. Após ampliar, mantenha o botão esquerdo pressionado e arraste para mover. O download salva o PNG original da face atual.</footer>
    </div>
  </dialog>;
}
