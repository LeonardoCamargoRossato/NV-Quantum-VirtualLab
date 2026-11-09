import {useEffect,useRef,useState} from "react";
import "./SchemeViewer.css";

type Props={base:string;onClose:()=>void};
/** Two educational illustrations, not a simulated 3D model of the hardware. */
export function SchemeViewer({base,onClose}:Props){
  const dialog=useRef<HTMLDialogElement>(null);
  const previousFocus=useRef(document.activeElement instanceof HTMLElement?document.activeElement:null);
  const [back,setBack]=useState(false);
  const [zoom,setZoom]=useState(1);
  const [failed,setFailed]=useState({front:false,back:false});
  useEffect(()=>{
    const element=dialog.current;
    const overflow=document.body.style.overflow;
    document.body.style.overflow="hidden";
    element?.showModal();
    return ()=>{
      element?.close();
      document.body.style.overflow=overflow;
      previousFocus.current?.focus();
    };
  },[]);
  const flip=()=>{setBack(v=>!v);setZoom(1)};
  return <dialog ref={dialog} className="scheme-viewer" aria-labelledby="scheme-title" onCancel={onClose} onKeyDown={event=>{
    if(event.key==="ArrowLeft"||event.key==="ArrowRight"){event.preventDefault();flip()}
  }}>
    <header className="scheme-heading"><div><h2 id="scheme-title">Esquema 2D — Uncut Gem V1</h2><p role="status">{back?"Verso da PCB":"Frente da PCB"}</p></div>
      <div className="scheme-controls">
        <button type="button" onClick={flip}>{back?"Voltar para a frente":"Virar para o verso"} ↻</button>
        <button type="button" aria-label="Diminuir zoom do esquema" disabled={zoom<=1} onClick={()=>setZoom(v=>Math.max(1,v-.25))}>−</button>
        <output aria-label="Zoom do esquema">{Math.round(zoom*100)}%</output>
        <button type="button" aria-label="Aumentar zoom do esquema" disabled={zoom>=3} onClick={()=>setZoom(v=>Math.min(3,v+.25))}>+</button>
        <button type="button" onClick={()=>setZoom(1)}>Ajustar à tela</button>
        <button type="button" aria-label="Fechar esquema 2D" onClick={onClose}>Fechar ×</button>
      </div>
    </header>
    <div className="scheme-scroll"><div className="scheme-stage" style={{width:`${zoom*100}%`}}>
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
    <footer className="scheme-footer">Use o botão para alternar entre frente e verso. Amplie para ler os detalhes. Esc fecha o visualizador.</footer>
  </dialog>;
}
