import React from "react";
import { FLOW_STEPS, flowImageUrl, type FlowStep } from "./FlowData";
import { SectionHeading, Out } from "./StudyPages";

type Props = {
  base:string;
  activeStepId?:string;
  onInspect:(step:FlowStep,trigger:HTMLElement)=>void;
  onPcb:(step:FlowStep)=>void;
  onGallery:(index:number)=>void;
};
function StepCard({step,base,activeStepId,onInspect,onPcb,onGallery}:Props&{step:FlowStep}){
 return <article className={"flow-step"+(activeStepId===step.id?" flow-step-active":"")} data-flow-step={step.id}>
   <div className="flow-copy">
     <span className="flow-numeral">ETAPA {String(step.number).padStart(2,"0")}</span>
     <button type="button" className="flow-title-button" onClick={e=>onInspect(step,e.currentTarget)}
       aria-label={"Inspecionar etapa "+step.number+": "+step.title}><h2>{step.title}</h2></button>
     <p>{step.summary}</p>
     <div className="flow-step-actions">
       <button type="button" onClick={e=>onInspect(step,e.currentTarget)}>Entender esta etapa</button>
       <button type="button" className="flow-pcb-link" onClick={()=>onPcb(step)}>Ver na PCB</button>
     </div>
   </div>
   <div className="flow-media">
     <button type="button" className="flow-image-open" onClick={()=>onGallery(step.number-1)}
       aria-label={"Ampliar imagem da etapa "+step.number+": "+step.title}>
       <img src={flowImageUrl(step,base)} loading="lazy" alt={step.imageAlt}/>
       <span aria-hidden="true" className="flow-zoom-badge">⤢</span>
     </button>
     <div className="flow-credit"><strong>{step.imageKind}</strong><span>{step.imageNote}</span></div>
   </div>
 </article>;
}
export function FlowPage(props:Props){
  const common={...props};
  return <div className="study-page flow-page">
    <SectionHeading eyebrow="LABORATÓRIO / FUNCIONAMENTO" title="Entenda o Fluxo"
      subtitle="Da alimentação à leitura: siga os sinais reais da montagem Uncut Gem V1. Clique em uma etapa para inspecionar, ou abra a fotografia da região."/>
    <div className="flow-key" aria-label="Legenda dos ramos"><span>Energia e controle</span><span className="key-optical">Luz verde</span><span className="key-rf">Micro-ondas</span><span>Fotodetecção e leitura</span></div>
    {FLOW_STEPS.slice(0,2).map(step=><React.Fragment key={step.id}>
      <StepCard step={step} {...common}/>
      <div className="flow-down" aria-hidden="true">↓</div>
    </React.Fragment>)}
    <section className="flow-branches" aria-label="Ramos óptico e de micro-ondas em paralelo">
      <div className="flow-branch-label">Dois caminhos em paralelo chegam ao diamante</div>
      <div className="flow-parallel">
        {FLOW_STEPS.slice(2,4).map(step=><div key={step.id} className={"flow-branch "+step.branch}>
          <span className="branch-arrow" aria-hidden="true">↓</span>
          <StepCard step={step} {...common}/>
          <span className="branch-arrow" aria-hidden="true">↓</span>
        </div>)}
      </div>
      <div className="flow-converge">Convergência óptica + RF no prisma NV <span aria-hidden="true">↓</span></div>
    </section>
    {FLOW_STEPS.slice(4).map((step,i)=><React.Fragment key={step.id}>
      <StepCard step={step} {...common}/>
      {i<2&&<div className="flow-down" aria-hidden="true">↓</div>}
    </React.Fragment>)}
    <div className="flow-science-note"><strong>O que é observado?</strong> O laser e as micro-ondas chegam ao diamante por ramos distintos. A fluorescência detectada é convertida em sinal elétrico e apresentada pelo ESP32/OLED. Os recortes mostram o hardware real; o BPW34 está encapsulado e não pode ser identificado isoladamente na foto.</div>
    <div className="flow-source-line"><Out href="https://github.com/QuantumVillage/UncutGem/blob/main/BuildGuide/BuildGuide.md">BuildGuide oficial</Out><Out href="https://arxiv.org/abs/2509.18329">Artigo aberto Uncut Gem</Out></div>
  </div>;
}
