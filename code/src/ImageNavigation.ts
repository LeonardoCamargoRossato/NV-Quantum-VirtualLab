import {useEffect,useRef,type RefObject,type PointerEvent as ReactPointerEvent,type MouseEvent as ReactMouseEvent} from 'react';
export type ImageOffset={x:number;y:number};
type NavigationOptions={viewport:RefObject<HTMLDivElement|null>;zoom:number;setZoom:(value:number)=>void;offset:ImageOffset;setOffset:(value:ImageOffset)=>void;key?:string;min?:number;max?:number};
/** Shared gestures for the PCB and every image dialog, independent of image type. */
export function useImageNavigation(options:NavigationOptions){
 const current=useRef(options);current.current=options;
 const pointer=useRef<{id:number;x:number;y:number;offset:ImageOffset;moved:boolean}|null>(null);
 const suppressClick=useRef(false);
 function changeZoom(value:number,anchor?:ImageOffset){
  const {viewport,zoom,offset,setZoom,setOffset,min=.25,max=8}=current.current;
  const next=Math.round(Math.max(min,Math.min(max,value))*100)/100;if(next===zoom)return;
  const rect=viewport.current?.getBoundingClientRect();
  const p=rect&&anchor?{x:anchor.x-rect.left-rect.width/2,y:anchor.y-rect.top-rect.height/2}:{x:0,y:0};
  const ratio=next/zoom;
  setOffset({x:p.x-(p.x-offset.x)*ratio,y:p.y-(p.y-offset.y)*ratio});setZoom(next);
 }
 useEffect(()=>{
  const area=options.viewport.current;if(!area)return;
  function wheel(e:WheelEvent){
   e.preventDefault();if(!e.deltaY)return;
   const unit=e.deltaMode===1?16:e.deltaMode===2?area!.clientHeight:1;
   changeZoom(current.current.zoom*Math.exp(-Math.min(500,Math.max(-500,e.deltaY*unit))*.0015),{x:e.clientX,y:e.clientY});
  }
  area.addEventListener('wheel',wheel,{passive:false});
  return ()=>area.removeEventListener('wheel',wheel);
 },[options.viewport,options.key]);
 function finish(e:ReactPointerEvent<HTMLDivElement>){
  const drag=pointer.current;if(!drag||drag.id!==e.pointerId)return;
  suppressClick.current=drag.moved;pointer.current=null;
  e.currentTarget.classList.remove('image-is-dragging');
  if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);
 }
 const handlers={
  onPointerDown:(e:ReactPointerEvent<HTMLDivElement>)=>{
   if(e.button!==0||!e.isPrimary||(e.target as Element).closest('button,a,input,select,[data-no-image-pan]'))return;
   suppressClick.current=false;e.currentTarget.classList.add('image-is-dragging');pointer.current={id:e.pointerId,x:e.clientX,y:e.clientY,offset:current.current.offset,moved:false};
  },
  onPointerMove:(e:ReactPointerEvent<HTMLDivElement>)=>{
   const drag=pointer.current;if(!drag||drag.id!==e.pointerId)return;
   const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
   if(!drag.moved&&Math.hypot(dx,dy)<4)return;
   if(!drag.moved){drag.moved=true;e.currentTarget.setPointerCapture(e.pointerId);e.currentTarget.classList.add('image-is-dragging');}
   e.preventDefault();current.current.setOffset({x:drag.offset.x+dx,y:drag.offset.y+dy});
  },
  onPointerUp:finish,onPointerCancel:finish,
  onLostPointerCapture:()=>{pointer.current=null;options.viewport.current?.classList.remove('image-is-dragging')},
  onClickCapture:(e:ReactMouseEvent<HTMLDivElement>)=>{if(suppressClick.current){e.preventDefault();e.stopPropagation();suppressClick.current=false}},
 };
 return {changeZoom,handlers,reset:()=>{options.setZoom(1);options.setOffset({x:0,y:0})}};
}
