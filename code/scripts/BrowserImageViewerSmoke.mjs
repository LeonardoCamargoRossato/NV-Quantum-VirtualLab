import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync} from 'node:fs';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:950},acceptDownloads:true});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const base=process.env.APP_URL||'http://127.0.0.1:4173/NV-Quantum-VirtualLab/';
const modal=page.getByRole('dialog');
async function exercise({download=false,fullscreen=false}={}){
 await modal.waitFor();await page.waitForFunction(()=>document.querySelector('.image-viewer-viewport img')?.naturalWidth>0);
 const area=modal.getByRole('region',{name:'Visualização da imagem'}),img=area.getByRole('img');
 const bounds=await area.boundingBox();await page.mouse.move(bounds.x+bounds.width*.6,bounds.y+bounds.height*.5);
 await page.mouse.wheel(0,-300);await page.waitForFunction(()=>parseInt(document.querySelector('[aria-label="Zoom da imagem"]').textContent)>100);
 const before=await img.boundingBox();await page.mouse.down();await page.mouse.move(bounds.x+bounds.width*.6-60,bounds.y+bounds.height*.5+35,{steps:5});await page.mouse.up();
 const after=await img.boundingBox();assert(Math.abs(after.x-before.x+60)<2);assert(Math.abs(after.y-before.y-35)<2);
 await page.mouse.wheel(0,500);await page.waitForFunction(()=>parseInt(document.querySelector('[aria-label="Zoom da imagem"]').textContent)<100);
 for(const name of ['Baixar imagem','Ampliar imagem em tela cheia','Fechar imagem'])assert.equal((await modal.getByRole('button',{name,exact:true}).textContent()).trim(),'');
 if(download){const src=await img.getAttribute('src');const response=await page.request.get(new URL(src,base).href);const expected=await response.body();const promise=page.waitForEvent('download');await modal.getByRole('button',{name:'Baixar imagem',exact:true}).click();const saved=await promise;assert(readFileSync(await saved.path()).equals(expected));}
 if(fullscreen){await modal.getByRole('button',{name:'Ampliar imagem em tela cheia'}).click();await page.waitForFunction(()=>document.fullscreenElement?.classList.contains('image-viewer-surface'));await modal.getByRole('button',{name:'Sair da tela cheia da imagem'}).click();await page.waitForFunction(()=>!document.fullscreenElement);}
 assert.equal(await modal.getByRole('button',{name:'Ajustar imagem à tela'}).count(),0,'Fit control must be absent on every image');
 await modal.getByRole('button',{name:'Fechar imagem'}).click();assert.equal(await modal.count(),0);
}
async function route(hash){await page.goto(base+'#'+hash,{waitUntil:'domcontentloaded'});await page.waitForTimeout(100)}
try{
 await route('referencias');await page.locator('.real-photo .image-trigger').click();await exercise({download:true,fullscreen:true});
 // Every currently visible thumbnail in cards uses the shared viewer, including crop images.
 console.log('PASS: main photo viewer');await route('inventario');const images=page.locator('.catalog-image button');await images.first().waitFor();const count=await images.count();
 for(let i=0;i<count;i++){await images.nth(i).click();await exercise({download:i===0});}
 await page.getByRole('button',{name:'☷ Lista',exact:true}).click();const tableImages=page.locator('.table-photo button');await tableImages.first().click();await exercise();
 console.log('PASS: inventory viewers');await route('fluxo');const steps=page.locator('.flow-image-open');for(let i=0;i<await steps.count();i++){await steps.nth(i).click();await exercise();}
 await steps.first().click();await modal.getByRole('button',{name:'Aumentar zoom da imagem'}).click();await modal.getByRole('button',{name:'Próxima imagem'}).click();assert.equal(await modal.getByLabel('Zoom da imagem',{exact:true}).textContent(),'100%');await page.keyboard.press('ArrowLeft');await page.keyboard.press('Escape');
 console.log('PASS: flow viewers');await route('guia');const guides=page.locator('.image-action');for(let i=0;i<await guides.count();i++){await guides.nth(i).click();await exercise({download:true});}
 console.log('PASS: guide viewers');await route('sobre');await page.locator('.image-trigger').first().click();await exercise({fullscreen:true});
 console.log('PASS: about viewer');await route('referencias');await page.locator('.real-photo .image-trigger').click();await exercise();
 await page.setViewportSize({width:390,height:844});await page.locator('.real-photo .image-trigger').focus();await page.keyboard.press('Enter');await exercise();
 // Failed asset/download are explicit errors, never silent navigation to another site.
 await page.route('**/assets/official/DeviceV1.png',route=>route.abort());await page.locator('.real-photo .image-trigger').click();await modal.getByRole('alert').getByText('Não foi possível carregar esta imagem.',{exact:true}).waitFor();await modal.getByRole('button',{name:'Baixar imagem',exact:true}).click();await modal.getByText(/Não foi possível baixar a imagem/).waitFor();await modal.getByRole('button',{name:'Fechar imagem'}).click();await page.unroute('**/assets/official/DeviceV1.png');
 mkdirSync('/tmp/nv-shared-image-viewer',{recursive:true});await page.locator('.real-photo .image-trigger').click();await page.waitForFunction(()=>document.querySelector('.image-viewer-viewport img')?.naturalWidth>0);await page.screenshot({path:'/tmp/nv-shared-image-viewer/MobileViewer.png'});
 assert.deepEqual(errors,[]);console.log('PASS: overview, inventory cards/table, flow gallery, all guide diagrams, about, references, keyboard/mobile, wheel, dragging, original downloads, fullscreen, gallery reset, failure messages and icon-only actions.');
}finally{await browser.close()}
