import {useEffect,useRef,useState} from "react";
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
  const previousFocus=useRef(document.activeElement instanceof HTMLElement?document.activeElement:null);
  const [back,setBack]=useState(false);
  const [zoom,setZoom]=useState(1);
  const [fitWidth,setFitWidth]=useState(0);
  const [fullscreen,setFullscreen]=useState(false);
  const [fullscreenSupported,setFullscreenSupported]=useState(true);
  const [fullscreenError,setFullscreenError]=useState("");
  const [failed,setFailed]=useState({front:false,back:false});
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
  const flip=()=>{setBack(v=>!v);setZoom(1)};
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
          <button type="button" aria-label="Diminuir zoom do esquema" disabled={zoom<=1} onClick={()=>setZoom(v=>Math.max(1,v-.25))}>−</button>
          <output aria-label="Zoom do esquema">{Math.round(zoom*100)}%</output>
          <button type="button" aria-label="Aumentar zoom do esquema" disabled={zoom>=3} onClick={()=>setZoom(v=>Math.min(3,v+.25))}>+</button>
          <button type="button" onClick={()=>setZoom(1)}>Ajustar à tela</button>
          <a className="scheme-action" href={base+"assets/diagrams/"+fileName} download={fileName} aria-label={"Baixar PNG da "+(back?"face traseira":"face frontal")} title="Baixar PNG desta face"><SchemeIcon kind="download"/><span>Baixar PNG</span></a>
          <button type="button" className="scheme-icon-button" aria-label={fullLabel} title={fullscreenSupported?fullLabel:"Tela cheia indisponível neste navegador"} disabled={!fullscreenSupported} onClick={()=>void toggleFullscreen()}><SchemeIcon kind={fullscreen?"collapse":"expand"}/></button>
          <button type="button" className="scheme-icon-button" aria-label="Fechar esquema 2D" title="Fechar esquema 2D" onClick={()=>void closeViewer()}><SchemeIcon kind="close"/></button>
        </div>
      </header>
      {fullscreenError&&<p className="scheme-fullscreen-error" role="alert">{fullscreenError}</p>}
      <div ref={scrollArea} className="scheme-scroll"><div className="scheme-stage" style={{width:fitWidth?`${fitWidth*zoom}px`:"100%"}}>
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
      <footer className="scheme-footer">Vire para alternar entre frente e verso. O download salva o PNG original da face atual.</footer>
    </div>
  </dialog>;
}
