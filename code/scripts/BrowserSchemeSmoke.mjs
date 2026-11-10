import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:950},acceptDownloads:true});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const url=process.env.APP_URL||'http://127.0.0.1:4173/NV-Quantum-VirtualLab/';
await page.goto(url);
const trigger=page.getByRole('button',{name:'Ver esquema 2D',exact:true});
const modal=page.getByRole('dialog');
async function loaded(){await page.waitForFunction(()=>document.querySelector('.image-viewer-viewport img')?.naturalWidth>0)}
async function exercise(){
 await loaded();const area=modal.getByRole('region',{name:'Visualização da imagem'});const image=area.getByRole('img');
 const rect=await image.boundingBox(),anchor={x:rect.x+rect.width*.6,y:rect.y+rect.height*.55};
 await page.mouse.move(anchor.x,anchor.y);await page.mouse.wheel(0,-500);
 await page.waitForFunction(()=>parseInt(document.querySelector('[aria-label="Zoom da imagem"]').textContent)>100);
 const after=await image.boundingBox();assert(Math.abs((anchor.x-after.x)/after.width-.6)<.03,'Wheel remains anchored');
 const bounds=await area.boundingBox();await page.mouse.move(bounds.x+bounds.width/2,bounds.y+bounds.height/2);
 const beforeDrag=await image.boundingBox();await page.mouse.down();assert.equal(await area.evaluate(el=>getComputedStyle(el).cursor),'grabbing');
 await page.mouse.move(bounds.x+bounds.width/2-85,bounds.y+bounds.height/2-70,{steps:5});await page.mouse.up();
 const afterDrag=await image.boundingBox();assert(Math.abs(afterDrag.x-beforeDrag.x+85)<2);assert(Math.abs(afterDrag.y-beforeDrag.y+70)<2);
 assert.equal(await area.evaluate(el=>getComputedStyle(el).cursor),'grab');
 await modal.getByRole('button',{name:'Ajustar imagem à tela'}).click();
 assert.equal(await modal.getByLabel('Zoom da imagem',{exact:true}).textContent(),'100%');
 await modal.getByRole('button',{name:'Diminuir zoom da imagem'}).click();assert.equal(await modal.getByLabel('Zoom da imagem',{exact:true}).textContent(),'75%');
 // Pan also works below the fitted size, and wheel cannot move the document.
 await page.mouse.move(bounds.x+bounds.width/2,bounds.y+bounds.height/2);await page.mouse.down();await page.mouse.move(bounds.x+bounds.width/2+30,bounds.y+bounds.height/2+20);await page.mouse.up();
 await modal.getByRole('button',{name:'Ajustar imagem à tela'}).click();
 assert.equal(await page.evaluate(()=>window.scrollY),0);
 await page.mouse.move(bounds.x+bounds.width/2,bounds.y+bounds.height/2);
 for(let i=0;i<4;i++){await page.mouse.wheel(0,-500);await page.waitForTimeout(35)}
 assert.equal(await modal.getByLabel('Zoom da imagem',{exact:true}).textContent(),'800%');
 for(let i=0;i<6;i++){await page.mouse.wheel(0,500);await page.waitForTimeout(35)}
 assert.equal(await modal.getByLabel('Zoom da imagem',{exact:true}).textContent(),'25%');
 await modal.getByRole('button',{name:'Ajustar imagem à tela'}).click();
 for(const name of ['Baixar imagem','Ampliar imagem em tela cheia','Fechar imagem']){const button=modal.getByRole('button',{name,exact:true});assert.equal((await button.textContent()).trim(),'');assert.equal(await button.locator('svg').count(),1);}
}
try{
 await trigger.click();await exercise();
 for(const side of ['Front','Back']){
  if(side==='Back')await modal.getByRole('button',{name:'Virar para o verso'}).click();
  await loaded();assert((await modal.getByRole('img').getAttribute('src')).endsWith(side+'Scheme.png'));
  if(side==='Back')await exercise();
  const downloadEvent=page.waitForEvent('download');await modal.getByRole('button',{name:'Baixar imagem',exact:true}).click();const download=await downloadEvent;
  assert.equal(download.suggestedFilename(),'UncutGemV1'+side+'Scheme.png');assert(readFileSync(await download.path()).equals(readFileSync(new URL('../public/assets/diagrams/UncutGemV1'+side+'Scheme.png',import.meta.url))));
 }
 await modal.getByRole('button',{name:'Ampliar imagem em tela cheia'}).click();await page.waitForFunction(()=>document.fullscreenElement?.classList.contains('image-viewer-surface'));
 await modal.getByRole('button',{name:'Sair da tela cheia da imagem'}).click();await page.waitForFunction(()=>!document.fullscreenElement);
 await page.keyboard.press('Escape');assert.equal(await modal.count(),0);assert(await trigger.evaluate(el=>el===document.activeElement));
 await page.setViewportSize({width:390,height:844});await trigger.click();await loaded();assert(await modal.evaluate(el=>el.scrollWidth<=el.clientWidth+1));
 await page.emulateMedia({reducedMotion:'reduce'});await modal.getByRole('button',{name:'Virar para o verso'}).click();await loaded();
 await modal.getByRole('button',{name:'Ampliar imagem em tela cheia'}).click();await page.waitForFunction(()=>Boolean(document.fullscreenElement));
 await modal.getByRole('button',{name:'Fechar imagem'}).click();await page.waitForFunction(()=>!document.fullscreenElement&&!document.querySelector('.image-viewer'));
 assert.deepEqual(errors,[]);console.log('PASS: shared viewer, both faces, pointer anchored wheel zoom, drag above/below 100%, fit, original downloads, fullscreen, icon-only controls, Escape/focus, mobile and reduced motion.');
}finally{await browser.close()}
