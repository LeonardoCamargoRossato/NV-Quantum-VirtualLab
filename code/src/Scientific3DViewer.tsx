import {useEffect,useRef,useState} from "react";
import * as THREE from "three";
import {STLLoader} from "three/addons/loaders/STLLoader.js";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import "./Scientific3DViewer.css";

const source="https://github.com/QuantumVillage/UncutGem/tree/main/3D-files";
const stepSource="https://github.com/QuantumVillage/UncutGem/blob/main/3D-files/QVUncutGemV2DiamondMount%20Isosceles%20v6.step";
const stlSource="https://github.com/QuantumVillage/UncutGem/blob/main/3D-files/QVUncutGemV2DiamondMount%20Isosceles%20v6.stl";
const modelUrl=import.meta.env.BASE_URL+"assets/official/v2/diamond-mount/DiamondMountIsoscelesV6.stl";
type View="Isométrica"|"Superior"|"Inferior"|"Frontal"|"Lateral";
type Display="Sólido"|"Arestas"|"Malha";
export function Scientific3DViewer(){
 const root=useRef<HTMLElement>(null);
 const host=useRef<HTMLDivElement>(null);
 const api=useRef<{view:(v:View)=>void;display:(v:Display)=>void;zoom:(factor:number)=>void;reset:()=>void;dispose:()=>void}|null>(null);
 const [status,setStatus]=useState("Carregando modelo oficial…");
 const [failure,setFailure]=useState(false);
 const [attempt,setAttempt]=useState(0);
 const [display,setDisplay]=useState<Display>("Sólido");
 const [view,setView]=useState<View>("Isométrica");
 const [full,setFull]=useState(false);
 useEffect(()=>{
  const container=host.current;if(!container)return;
  let stopped=false,geometry:THREE.BufferGeometry|undefined,mesh:THREE.Mesh|undefined,edge:THREE.LineSegments|undefined,renderer:THREE.WebGLRenderer|undefined,controls:OrbitControls|undefined,observer:ResizeObserver|undefined,frame=0;
  let scene:THREE.Scene,camera:THREE.PerspectiveCamera,center=new THREE.Vector3(),radius=40;
  const render=()=>{if(renderer&&!stopped)renderer.render(scene,camera)};
  const resize=()=>{if(!renderer)return;const w=Math.max(1,container.clientWidth),h=Math.max(1,container.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();render()};
  const orient=(v:View)=>{const directions:Record<View,[number,number,number]>={"Isométrica":[1,-1,1],"Superior":[0,-1,0],"Inferior":[0,1,0],"Frontal":[0,0,1],"Lateral":[1,0,0]};const [x,y,z]=directions[v];const target=new THREE.Vector3(x,y,z).normalize().multiplyScalar(radius);camera.position.copy(target);camera.up.set(0,0,Math.abs(y)>0.9?1:0);if(Math.abs(y)<=0.9)camera.up.set(0,1,0);controls!.target.copy(center);controls!.update();render()};
  const changeDisplay=(v:Display)=>{if(!mesh||!edge)return;(mesh.material as THREE.MeshStandardMaterial).wireframe=v==="Malha";edge.visible=v==="Arestas";render()};
  try{
   const canvas=document.createElement("canvas");if(!canvas.getContext("webgl2")&&!canvas.getContext("webgl"))throw Error("WebGL indisponível neste navegador.");
   renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:"low-power"});renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.6));renderer.setClearColor(0x101b2c);renderer.outputColorSpace=THREE.SRGBColorSpace;container.append(canvas);
   scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(42,1,.05,2000);scene.add(new THREE.HemisphereLight(0xd9e9ff,0x344052,2.2));const key=new THREE.DirectionalLight(0xffffff,3);key.position.set(30,-25,45);scene.add(key);const fill=new THREE.DirectionalLight(0x86c9ff,1.5);fill.position.set(-25,20,10);scene.add(fill);
   controls=new OrbitControls(camera,canvas);controls.enableDamping=false;controls.screenSpacePanning=true;controls.addEventListener("change",render);observer=new ResizeObserver(resize);observer.observe(container);
   const loader=new STLLoader();loader.load(modelUrl,loaded=>{
    if(stopped){loaded.dispose();return}geometry=loaded;geometry.computeVertexNormals();geometry.computeBoundingBox();const box=geometry.boundingBox!;center=box.getCenter(new THREE.Vector3());const size=box.getSize(new THREE.Vector3());radius=Math.max(size.length()*1.15,40);
    mesh=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({color:0xb7c9d7,metalness:.18,roughness:.62,side:THREE.DoubleSide}));mesh.position.copy(center).multiplyScalar(-1);scene.add(mesh);
    edge=new THREE.LineSegments(new THREE.EdgesGeometry(geometry,28),new THREE.LineBasicMaterial({color:0x62d6f2,transparent:true,opacity:.6}));edge.position.copy(mesh.position);edge.visible=false;scene.add(edge);
    center.set(0,0,0);controls!.minDistance=8;controls!.maxDistance=200;orient(view);changeDisplay(display);resize();setFailure(false);setStatus("");
    api.current={view:orient,display:changeDisplay,zoom:factor=>{camera.position.sub(controls!.target).multiplyScalar(factor).add(controls!.target);controls!.update()},reset:()=>orient("Isométrica"),dispose:()=>{}};
   },event=>{if(event.total>0)setStatus("Carregando modelo oficial… "+Math.round(event.loaded/event.total*100)+"%")},()=>{if(!stopped){setFailure(true);setStatus("Não foi possível carregar o modelo 3D.")}});
  }catch(e){setFailure(true);setStatus(e instanceof Error?e.message:"Não foi possível iniciar o visualizador 3D.")}
  return()=>{stopped=true;cancelAnimationFrame(frame);api.current=null;observer?.disconnect();controls?.dispose();if(edge){edge.geometry.dispose();(edge.material as THREE.Material).dispose()}if(mesh)(mesh.material as THREE.Material).dispose();geometry?.dispose();renderer?.dispose();renderer?.forceContextLoss();renderer?.domElement.remove()};
 },[attempt]);
 useEffect(()=>{const listener=()=>setFull(document.fullscreenElement===root.current);document.addEventListener("fullscreenchange",listener);return()=>document.removeEventListener("fullscreenchange",listener)},[]);
 const goView=(value:View)=>{setView(value);api.current?.view(value)};
 const goDisplay=(value:Display)=>{setDisplay(value);api.current?.display(value)};
 return <section ref={root} className="scientific-3d" aria-label="Visualizador 3D do Diamond Mount V2">
  <div className="scientific-3d-heading"><div><strong>Modelo 3D oficial — Diamond Mount V2</strong><span>Suporte mecânico associado ao Uncut Gem V2 · aparência cinza ilustrativa</span></div><div className="scientific-3d-controls"><button onClick={()=>api.current?.reset()} aria-label="Centralizar modelo" title="Centralizar">⌂</button><button onClick={()=>api.current?.zoom(1/1.25)} aria-label="Aproximar modelo">+</button><button onClick={()=>api.current?.zoom(1.25)} aria-label="Afastar modelo">−</button><button onClick={()=>{if(full)void document.exitFullscreen();else void root.current?.requestFullscreen()}} aria-label={full?"Sair da tela cheia 3D":"Tela cheia 3D"}>⛶</button></div></div>
  <div className="scientific-3d-canvas-wrap"><div ref={host} className="scientific-3d-canvas" aria-label="Modelo CAD tridimensional: arraste para girar, use a roda para zoom e o botão direito para deslocar"/>{status&&<div className="scientific-3d-status" role="status">{status}{failure&&<p><button onClick={()=>{setFailure(false);setStatus("Carregando modelo oficial…");setAttempt(n=>n+1)}}>Tentar novamente</button> <a href={source} target="_blank" rel="noreferrer">Abrir arquivos originais ↗</a></p>}</div>}</div>
  <div className="scientific-3d-options"><label>Vista <select value={view} onChange={e=>goView(e.target.value as View)}>{(["Isométrica","Superior","Inferior","Frontal","Lateral"] as View[]).map(x=><option key={x}>{x}</option>)}</select></label><label>Exibição <select value={display} onChange={e=>goDisplay(e.target.value as Display)}>{(["Sólido","Arestas","Malha"] as Display[]).map(x=><option key={x}>{x}</option>)}</select></label><span>Arraste: girar · roda: zoom · botão direito: mover · toque: girar/pinçar</span></div>
  <details className="scientific-3d-about"><summary>Sobre este modelo</summary><p><strong>Nome original:</strong> QVUncutGemV2DiamondMount Isosceles v6. <strong>Origem:</strong> Quantum Village / UncutGem. <strong>Formatos:</strong> STEP e STL. <strong>Malha:</strong> 80.074 triângulos. <strong>Dimensões:</strong> aproximadamente 28 × 6,35 × 30 mm (STEP declara mm; STL usa coordenadas compatíveis).</p><p>O arquivo representa a geometria do suporte do diamante. Não contém uma montagem completa nem comprova equivalência geométrica com o suporte V1. O guia V1 descreve diamante, epóxi, antena, fotodiodo e filtro; a correspondência com este suporte V2 ainda não foi comprovada.</p><p><a href={stepSource} target="_blank" rel="noreferrer">STEP original ↗</a> · <a href={stlSource} target="_blank" rel="noreferrer">STL original ↗</a> · Quantum Village, AGPL-3.0</p></details>
 </section>
}
