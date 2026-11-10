import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1366,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
const folder=process.env.SCREENSHOT_DIR||'/tmp/nv-rf-rotation';mkdirSync(folder,{recursive:true});
const url=process.env.APP_URL||'http://127.0.0.1:4173/NV-Quantum-VirtualLab/';
async function settle(){await page.waitForTimeout(100)}
async function checkFocus(){
 const result=await page.locator('.photo-polygon-overlay').evaluate(svg=>{const p=new DOMPoint(60.5,53.5).matrixTransform(svg.getScreenCTM()),v=document.querySelector('.photo-viewport').getBoundingClientRect();return {dx:p.x-v.x-v.width/2,dy:p.y-v.y-v.height/2}});
 assert(Math.abs(result.dx)<3&&Math.abs(result.dy)<3,'Rotation keeps RF viewing center: '+JSON.stringify(result));
 const rects=await page.locator('.photo-stage').evaluate(el=>{const image=el.querySelector('img').getBoundingClientRect(),svg=el.querySelector('svg').getBoundingClientRect();return ['x','y','width','height'].map(k=>Math.abs(image[k]-svg[k]))});assert(rects.every(v=>v<1),'Image and polygon layers remain registered');
}
try{
 await page.goto(url,{waitUntil:'domcontentloaded'});await page.getByRole('button',{name:'Subsistemas',exact:true}).click();await page.getByRole('button',{name:'Expandir Amplificação de micro-ondas',exact:true}).click();await settle();
 assert.equal(await page.locator('.photo-polygon[data-tag="UG-V1-B024"]').count(),0);
 assert.equal(await page.locator('.photo-region-label').getByText('RFIN',{exact:true}).count(),1);assert.equal(await page.locator('.photo-region-label').getByText('RFOUT',{exact:true}).count(),1);
 await checkFocus();const zoom=await page.locator('.photo-controls output').textContent();
 for(const angle of [90,180,270,0]){
  await page.getByRole('button',{name:'Girar imagem 90°',exact:true}).click();await settle();assert.equal(await page.locator('.photo-stage').getAttribute('data-rotation'),String(angle));assert.equal(await page.locator('.photo-controls output').textContent(),zoom);await checkFocus();
  for(const tag of ['UG-V1-B022','UG-V1-B023']){
   const box=await page.locator('.photo-polygon[data-tag="'+tag+'"]').boundingBox(),view=await page.locator('.photo-viewport').boundingBox();assert(box.x>=view.x-1&&box.x+box.width<=view.x+view.width+1&&box.y>=view.y-1&&box.y+box.height<=view.y+view.height+1,'RF ports remain visible');
  }
  if(angle===180)await page.screenshot({path:folder+'/RfReadable180.png'});
 }
 await page.getByRole('button',{name:'Girar imagem 90°',exact:true}).click();await page.getByRole('button',{name:'Girar imagem 90°',exact:true}).click();await settle();
 await page.locator('.photo-polygon[data-tag="UG-V1-B022"]').click();let inspector=page.getByRole('complementary',{name:'Painel de informações: Conector SMA de entrada RF',exact:true});await inspector.waitFor();assert((await inspector.getByRole('img',{name:'Conector SMA de entrada RF'}).getAttribute('src')).endsWith('/UgV1B023.png'),'RFIN uses the corrected input crop');await page.getByRole('button',{name:'Fechar inspetor'}).click();
 await page.locator('.photo-polygon[data-tag="UG-V1-B023"]').click();inspector=page.getByRole('complementary',{name:'Painel de informações: Conector SMA de saída RF',exact:true});await inspector.waitFor();assert((await inspector.getByRole('img',{name:'Conector SMA de saída RF'}).getAttribute('src')).endsWith('/UgV1B022.png'),'RFOUT uses the corrected output crop');await page.getByRole('button',{name:'Fechar inspetor'}).click();
 const view=await page.locator('.photo-viewport').boundingBox();await page.mouse.move(view.x+view.width/2,view.y+view.height/2);await page.mouse.wheel(0,-100);await settle();const before=await page.locator('.photo-stage').boundingBox();await page.mouse.down();await page.mouse.move(view.x+view.width/2-40,view.y+view.height/2+30,{steps:4});await page.mouse.up();const after=await page.locator('.photo-stage').boundingBox();assert(Math.abs(after.x-before.x+40)<2&&Math.abs(after.y-before.y-30)<2);
 await page.getByRole('button',{name:'Módulos e Visualização',exact:true}).click();await page.getByRole('menuitem',{name:'Ver esquema 2D',exact:true}).click();const modal=page.getByRole('dialog');await page.waitForFunction(()=>document.querySelector('.image-viewer-viewport img')?.naturalWidth>0);await modal.getByRole('button',{name:'Girar imagem 90°',exact:true}).click();await modal.getByRole('button',{name:'Girar imagem 90°',exact:true}).click();assert.equal(await modal.getByRole('img').getAttribute('data-rotation'),'180');await modal.getByRole('button',{name:'Virar para o verso'}).click();await page.waitForFunction(()=>!document.querySelector('.image-viewer-viewport')?.classList.contains('is-flipping'));assert.equal(await modal.getByRole('img').getAttribute('data-rotation'),'0');await page.keyboard.press('Escape');assert.equal(await page.locator('.photo-stage').getAttribute('data-rotation'),'180');
 await page.setViewportSize({width:390,height:844});await settle();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));const toolbar=await page.locator('.viewer-toolbar').boundingBox(),modules=await page.getByRole('button',{name:'Módulos e Visualização',exact:true}).boundingBox();assert(modules.y+modules.height<=toolbar.y+toolbar.height+1,'Rotation control does not overflow the mobile toolbar');await page.screenshot({path:folder+'/RfMobile.png'});
 assert.deepEqual(errors,[]);console.log('PASS: corrected RFIN/RFOUT crops, hidden RF supply-wire contour, labels and framing, all four rotations, stable focus/zoom, registered polygons, rotated click/drag, shared viewer rotation/reset and mobile.');
}finally{await browser.close()}
