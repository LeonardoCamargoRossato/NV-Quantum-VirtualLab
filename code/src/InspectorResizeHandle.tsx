import {useRef} from 'react';
import {DEFAULT_INSPECTOR_WIDTH} from './InspectorLayout';
export function InspectorResizeHandle({value,min,max,onChange}:{value:number;min:number;max:number;onChange:(width:number)=>void}){
 const drag=useRef<{id:number;x:number;width:number}|null>(null);
 return <div className="inspector-resize-handle" role="separator" tabIndex={0} aria-label="Largura do inspetor" aria-orientation="vertical" aria-valuemin={min} aria-valuemax={max} aria-valuenow={value} aria-valuetext={value+' pixels'} title="Arraste para redimensionar. Duplo clique restaura a largura. Setas ajustam; Home restaura."
  onPointerDown={e=>{if(e.button!==0)return;e.preventDefault();e.stopPropagation();drag.current={id:e.pointerId,x:e.clientX,width:value};e.currentTarget.setPointerCapture(e.pointerId);e.currentTarget.classList.add('is-resizing')}}
  onPointerMove={e=>{const start=drag.current;if(start&&start.id===e.pointerId)onChange(Math.max(min,Math.min(max,start.width+e.clientX-start.x)))}}
  onPointerUp={e=>{drag.current=null;e.currentTarget.classList.remove('is-resizing');if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId)}}
  onPointerCancel={e=>{drag.current=null;e.currentTarget.classList.remove('is-resizing')}}
  onLostPointerCapture={e=>{drag.current=null;e.currentTarget.classList.remove('is-resizing')}}
  onDoubleClick={()=>onChange(DEFAULT_INSPECTOR_WIDTH)}
  onKeyDown={e=>{const next=e.key==='ArrowLeft'?value-10:e.key==='ArrowRight'?value+10:e.key==='Home'?DEFAULT_INSPECTOR_WIDTH:e.key==='End'?max:null;if(next!==null){e.preventDefault();onChange(Math.max(min,Math.min(max,next)))}}}>
  <span aria-hidden="true"/>
 </div>;
}
