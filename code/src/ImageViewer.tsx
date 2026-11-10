import {useEffect,useRef,useState} from 'react';
import {useImageNavigation} from './ImageNavigation';
import './ImageViewer.css';
export type ViewerImage={url:string;title:string;caption?:string;source?:string;filename?:string};
export function ImageIcon({kind}:{kind:'close'|'expand'|'collapse'|'download'|'flip'|'fit'|'plus'|'minus'}){
 const paths={close:'M6 6l12 12M18 6L6 18',expand:'M9 3H3v6m12 12h6v-6M3 3l6 6m12 12-6-6',collapse:'M3 9h6V3m12 12h-6v6M9 9 3 3m12 12 6 6',download:'M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4',flip:'M20 8a8 8 0 0 0-14-3L3 8m0-5v5h5M4 16a8 8 0 0 0 14 3l3-3m0 5v-5h-5',fit:'M8 3H3v5m13-5h5v5m0 8v5h-5M8 21H3v-5M9 9h6v6H9z',plus:'M12 5v14M5 12h14',minus:'M5 12h14'};
 return <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={paths[kind]}/></svg>;
}
function filename(image:ViewerImage){try{return image.filename||decodeURIComponent(new URL(image.url,location.href).pathname.split('/').pop()||'Imagem.png')}catch{return 'Imagem.png'}}
export function ImageViewer({images,initialIndex=0,onClose,title,flip=false}:{images:ViewerImage[];initialIndex?:number;onClose:()=>void;title?:string;flip?:boolean}){
 const [index,setIndex]=useState(initialIndex);const image=images[index];
 const [zoom,setZoom]=useState(1),[offset,setOffset]=useState({x:0,y:0});
 const [natural,setNatural]=useState({width:0,height:0}),[size,setSize]=useState({width:0,height:0});
 const [error,setError]=useState(''),[failed,setFailed]=useState(false),[fullscreen,setFullscreen]=useState(false),[downloading,setDownloading]=useState(false);
 const dialog=useRef<HTMLDialogElement>(null),surface=useRef<HTMLDivElement>(null),viewport=useRef<HTMLDivElement>(null);
 const previousFocus=useRef(document.activeElement as HTMLElement|null);
 const navigation=useImageNavigation({viewport,zoom,setZoom,offset,setOffset,key:image.url});
 useEffect(()=>{setZoom(1);setOffset({x:0,y:0});setNatural({width:0,height:0});setFailed(false);setError('')},[image.url]);
 useEffect(()=>{
  const overflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.current?.showModal();
  const observer=new ResizeObserver(entries=>{const {width,height}=entries[0].contentRect;setSize({width,height})});
  if(viewport.current)observer.observe(viewport.current);
  const full=()=>setFullscreen(document.fullscreenElement===surface.current);document.addEventListener('fullscreenchange',full);
  const element=dialog.current,target=surface.current;
  return ()=>{observer.disconnect();document.removeEventListener('fullscreenchange',full);if(document.fullscreenElement===target)void document.exitFullscreen().catch(()=>{});element?.close();document.body.style.overflow=overflow;previousFocus.current?.focus()};
 },[]);
 async function toggleFullscreen(){try{if(document.fullscreenElement===surface.current)await document.exitFullscreen();else await surface.current?.requestFullscreen()}catch{setError('O navegador não permitiu ativar a tela cheia.')}}
 async function close(){if(document.fullscreenElement===surface.current)await document.exitFullscreen().catch(()=>{});onClose()}
 async function download(){
  setError('');setDownloading(true);
  try{
   const response=await fetch(image.url);if(!response.ok)throw new Error();
   const blob=await response.blob();const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=filename(image);link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }catch{setError('Não foi possível baixar a imagem. A origem pode bloquear o download neste navegador.')}finally{setDownloading(false)}
 }
 const fit=natural.width&&natural.height?Math.min(size.width/natural.width,size.height/natural.height):0;
 const fullLabel=fullscreen?'Sair da tela cheia da imagem':'Ampliar imagem em tela cheia';
 const move=(delta:number)=>{navigation.reset();setIndex(i=>(i+delta+images.length)%images.length)};
 return <dialog ref={dialog} className="image-viewer" aria-label={title||image.title} onCancel={e=>{e.preventDefault();void close()}} onKeyDown={e=>{if(images.length>1&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){e.preventDefault();move(e.key==='ArrowLeft'?-1:1)}}}>
 <div ref={surface} className="image-viewer-surface">
  <header className="image-viewer-heading"><div><h2>{title||image.title}</h2>{title&&<p role="status">{image.title}</p>}</div><div className="image-viewer-controls">
   {flip&&<button type="button" aria-label={index?'Voltar para a frente':'Virar para o verso'} title="Virar" onClick={()=>move(1)}><ImageIcon kind="flip"/></button>}
   <button type="button" aria-label="Diminuir zoom da imagem" title="Diminuir zoom" disabled={zoom<=.25} onClick={()=>navigation.changeZoom(zoom-.25)}><ImageIcon kind="minus"/></button>
   <output aria-label="Zoom da imagem">{Math.round(zoom*100)}%</output>
   <button type="button" aria-label="Aumentar zoom da imagem" title="Aumentar zoom" disabled={zoom>=8} onClick={()=>navigation.changeZoom(zoom+.25)}><ImageIcon kind="plus"/></button>
   <button type="button" aria-label="Ajustar imagem à tela" title="Ajustar à tela" onClick={navigation.reset}><ImageIcon kind="fit"/></button>
   <button type="button" aria-label="Baixar imagem" title="Baixar imagem original" disabled={downloading} onClick={()=>void download()}><ImageIcon kind="download"/></button>
   <button type="button" aria-label={fullLabel} title={fullLabel} onClick={()=>void toggleFullscreen()}><ImageIcon kind={fullscreen?'collapse':'expand'}/></button>
   <button type="button" aria-label="Fechar imagem" title="Fechar imagem" onClick={()=>void close()}><ImageIcon kind="close"/></button>
  </div></header>
  {error&&<p className="image-viewer-error" role="alert">{error}</p>}
  <div ref={viewport} className="image-viewer-viewport" role="region" aria-label="Visualização da imagem" data-image-viewport {...navigation.handlers}>
   {failed?<p role="alert">Não foi possível carregar esta imagem.</p>:<img key={image.url} src={image.url} alt={image.title} draggable={false} onLoad={e=>setNatural({width:e.currentTarget.naturalWidth,height:e.currentTarget.naturalHeight})} onError={()=>setFailed(true)} style={{width:natural.width*fit,height:natural.height*fit,visibility:fit?'visible':'hidden',transform:`translate(-50%,-50%) translate(${offset.x}px,${offset.y}px) scale(${zoom})`}}/>}
  </div>
  {!flip&&images.length>1&&<nav className="gallery-navigation" aria-label="Navegação das imagens do fluxo"><button type="button" aria-label="Imagem anterior" onClick={()=>move(-1)}>←</button><span>{index+1} / {images.length}</span><button type="button" aria-label="Próxima imagem" onClick={()=>move(1)}>→</button></nav>}
  <footer className="image-viewer-footer">{image.caption||'Roda do mouse: zoom · Clique e arraste para mover.'} {image.source&&<a href={image.source} target="_blank" rel="noopener noreferrer">Fonte original ↗</a>}</footer>
 </div></dialog>;
}
