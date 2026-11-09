/** Deterministic photographic presentation: CSS projective/rigid transforms,
 * browser rasterization, original source images retained. No synthesized pixels.
 * Run from code/: node scripts/align_inventory_images.mjs
 */
import {chromium} from '@playwright/test';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const config=JSON.parse(readFileSync(root+'/source/evidence/ImageFraming.json'));
const output=root+'/public/assets/official/v1/presentation';mkdirSync(output,{recursive:true});
const hash=b=>createHash('sha256').update(b).digest('hex');
function solve(a,b){
 const m=a.map((r,i)=>[...r,b[i]]);
 for(let c=0;c<b.length;c++){
  let p=c;for(let i=c+1;i<b.length;i++)if(Math.abs(m[i][c])>Math.abs(m[p][c]))p=i;
  [m[c],m[p]]=[m[p],m[c]];
  const v=m[c][c];if(Math.abs(v)<1e-12)throw Error('Degenerate reference geometry');
  for(let j=c;j<=b.length;j++)m[c][j]/=v;
  for(let i=0;i<b.length;i++)if(i!==c){const f=m[i][c];for(let j=c;j<=b.length;j++)m[i][j]-=f*m[c][j]}
 }
 return m.map(r=>r.at(-1));
}
function homography(src,dst){const a=[],b=[];src.forEach(([x,y],i)=>{const[u,v]=dst[i];a.push([x,y,1,0,0,0,-u*x,-u*y],[0,0,0,x,y,1,-v*x,-v*y]);b.push(u,v)});const h=solve(a,b);return [[h[0],h[1],h[2]],[h[3],h[4],h[5]],[h[6],h[7],1]]}
const identity=[[1,0,0],[0,1,0],[0,0,1]];
function multiply(a,b){return a.map(row=>b[0].map((_,j)=>row.reduce((s,v,k)=>s+v*b[k][j],0)))}
function point(h,[x,y]){const d=h[2][0]*x+h[2][1]*y+h[2][2];return [(h[0][0]*x+h[0][1]*y+h[0][2])/d,(h[1][0]*x+h[1][1]*y+h[1][2])/d]}
function boxPoints([x,y,r,b]){return [[x,y],[r,y],[r,b],[x,b]]}
function bounds(points){return [Math.min(...points.map(p=>p[0])),Math.min(...points.map(p=>p[1])),Math.max(...points.map(p=>p[0])),Math.max(...points.map(p=>p[1]))]}
function css(h){return `matrix3d(${[h[0][0],h[1][0],0,h[2][0],h[0][1],h[1][1],0,h[2][1],0,0,1,0,h[0][2],h[1][2],0,h[2][2]].join(',')})`}
const frontH=homography(config.frontBoard.sourceCorners,config.frontBoard.targetCorners);
const srcData={};for(const[k,v]of Object.entries(config.sources)){const b=readFileSync(resolve(root,v.path));srcData[k]={...v,hash:hash(b),uri:'data:image/png;base64,'+b.toString('base64')}}
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1800,height:1500},deviceScaleFactor:1});
const manifest={schemaVersion:1,method:'Projective alignment to PCB plane, small rigid deskew against visible module edges, centered crop with symmetric padding; browser rasterization, at most 2x interpolation. No generative restoration.',originals:Object.fromEntries(Object.entries(srcData).map(([k,v])=>[k,{path:v.path,sha256:v.hash,size:v.size}])),items:{}};
async function render(key,source,subjectBox,axis,padding,{full=false,plane}={}){
 const src=srcData[source];let h=plane?homography(config.planes[plane].sourceCorners,config.planes[plane].targetCorners):source==='front'?frontH:identity;
 let angle=0;
 if(axis){const a=point(h,axis[0]),b=point(h,axis[1]);const raw=Math.atan2(b[1]-a[1],b[0]-a[0]);angle=raw-Math.round(raw/(Math.PI/2))*(Math.PI/2);if(Math.abs(angle)>Math.PI/12)throw Error('Unverified large rotation '+key);const c=Math.cos(-angle),s=Math.sin(-angle);h=multiply([[c,-s,0],[s,c,0],[0,0,1]],h)}
 const subject=bounds(boxPoints(subjectBox).map(p=>point(h,p)));
 const cx=(subject[0]+subject[2])/2,cy=(subject[1]+subject[3])/2;
 const w=subject[2]-subject[0],he=subject[3]-subject[1];
 const px=Math.max(8,w*padding),py=Math.max(8,he*padding);
 const crop=[Math.floor(cx-w/2-px),Math.floor(cy-he/2-py),Math.ceil(cx+w/2+px),Math.ceil(cy+he/2+py)];
 const native=[crop[2]-crop[0],crop[3]-crop[1]];
 const scale=full?1:Math.min(2,Math.max(1,400/Math.max(...native)),1500/native[0],1500/native[1]);
 const width=Math.round(native[0]*scale),height=Math.round(native[1]*scale);
 const transform=multiply([[scale,0,-crop[0]*scale],[0,scale,-crop[1]*scale],[0,0,1]],h);
 await page.setViewportSize({width:Math.max(1,width),height:Math.max(1,height)});
 await page.setContent(`<style>html,body{margin:0;overflow:hidden;background:#f7f8fa}img{position:absolute;left:0;top:0;max-width:none;transform-origin:0 0}</style><div style="position:absolute;inset:0;clip-path:inset(${(subject[1]-crop[1])*scale}px ${(crop[2]-subject[2])*scale}px ${(crop[3]-subject[3])*scale}px ${(subject[0]-crop[0])*scale}px)"><img width="${src.size[0]}" height="${src.size[1]}" style="transform:${css(transform)}" src="${src.uri}"></div>`);
 await page.evaluate(()=>document.images[0].decode());
 const file=key.replace(/^UG-/, 'Ug-').replaceAll('-','')+'.png';
 await page.screenshot({path:output+'/'+file});
 const meta={image:'assets/official/v1/presentation/'+file,source,sourceBox:subjectBox,subjectBounds:subject,cropBounds:crop,sourceToOutput:transform,outputSize:[width,height],plane:plane||null,nativeCropSize:native,scale,deskewDegrees:-angle*180/Math.PI,lowNativeResolution:Math.min(w,he)<120,sha256:hash(readFileSync(output+'/'+file))};
 return meta;
}
for(const item of config.items){manifest.items[item.tag]={...await render(item.tag,item.source,item.subjectBox,item.axis,item.padding,{plane:item.plane}),note:item.note};console.log(item.tag)}
manifest.main=await render('DeviceV1Aligned','front',[0,0,...srcData.front.size],null,0,{full:true});
manifest.main.referenceCorners=config.frontBoard.sourceCorners.map(p=>point(manifest.main.sourceToOutput,p));
// Four descriptive gallery regions retain their role, without assigning new component identities.
manifest.gallery={};
for(const [name,box]of Object.entries({UgV1RfCableEnhanced:[1000,434,1450,898],UgV1BetweenRfAndEsp32Enhanced:[450,530,820,790],UgV1AboveEsp32Enhanced:[160,455,580,680],UgV1LaserDriverEnhanced:[182,223,310,284]}))manifest.gallery[name]=await render(name,'front',box,null,0.14);
manifest.configSha256=hash(readFileSync(root+'/source/evidence/ImageFraming.json'));
writeFileSync(root+'/source/ImagePresentation.json',JSON.stringify(manifest,null,2)+'\n');
await browser.close();console.log('79 item images, main photo and four gallery images written; originals untouched.');
