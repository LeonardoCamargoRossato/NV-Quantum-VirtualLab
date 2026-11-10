import {ImageViewer} from './ImageViewer';
/** Educational front/back images use the same viewer as every other image. */
export function SchemeViewer({base,onClose}:{base:string;onClose:()=>void}){
 return <ImageViewer title="Esquema 2D — Uncut Gem V1" flip onClose={onClose} images={[
  {url:base+'assets/diagrams/UncutGemV1FrontScheme.png',title:'Frente da PCB'},
  {url:base+'assets/diagrams/UncutGemV1BackScheme.png',title:'Verso da PCB'},
 ]}/>;
}
