import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1366,height:768}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
const url=process.env.APP_URL||'http://127.0.0.1:4173/NV-Quantum-VirtualLab/';
const shots=process.env.SCREENSHOT_DIR||'/tmp/nv-adaptive-viewer';mkdirSync(shots,{recursive:true});
const width=()=>page.getByRole('separator',{name:'Largura do inspetor'}).getAttribute('aria-valuenow').then(Number);
const zoom=()=>page.locator('.photo-stage').evaluate(el=>{const matrix=new DOMMatrixReadOnly(getComputedStyle(el).transform);return Math.round(Math.hypot(matrix.a,matrix.b)*100)+'%'});
async function settle(){await page.waitForTimeout(100)}
async function point(){return page.evaluate(()=>{const area=document.querySelector('.photo-viewport').getBoundingClientRect(),image=document.querySelector('.photo-stage').getBoundingClientRect();return {x:(area.x+area.width/2-image.x)/image.width,y:(area.y+area.height/2-image.y)/image.height}})}
async function modules(){await page.getByRole('button',{name:'Módulos e Visualização',exact:true}).click()}
try{
 await page.addInitScript(()=>{localStorage.setItem('nv-sidebar-collapsed','true');localStorage.setItem('nv-explore-toolbar-minimized','true')});
 await page.goto(url,{waitUntil:'domcontentloaded'});await page.locator('.photo-polygon').nth(8).waitFor();await settle();
 assert.equal(await page.locator('.menu-collapsed').count(),0,'Sidebar starts open even after a previously collapsed visit');
 assert.equal(await page.locator('.viewer-restore').count(),0,'Top toolbar starts open');
 assert.equal(await page.locator('.photo-viewport .photo-controls').count(),0);
 assert.equal(await page.locator('.viewer-toolbar-actions .photo-controls').count(),1);
 assert.equal(await page.locator('.viewer-toolbar').evaluate(el=>el.offsetHeight),48);assert.equal(await page.locator('.photo-layer-panel').count(),0);
 assert(await page.getByRole('group',{name:'Camada da fotografia'}).isVisible(),'Layer modes must always be discoverable');
 assert.equal(await page.getByRole('button',{name:'Voltar à placa inteira',exact:true}).count(),1,'Return action must be floating and unique');
 assert(await page.locator('.viewer-layer-group').boundingBox(),'Layer control must occupy toolbar space');

 assert.equal(await page.getByRole('button',{name:'Abrir foto aprimorada',exact:true}).count(),0);assert.equal(await page.locator('.photo-caption,.compact-toolbar').count(),0);
 const initial=await page.locator('.photo-viewport').boundingBox();assert(initial.height>=700);
 await page.getByRole('button',{name:'Expandir controles de camadas'}).click();assert(await page.getByRole('group',{name:'Camada da fotografia'}).isVisible());assert.equal((await page.locator('.photo-viewport').boundingBox()).height,initial.height,'Overlay cannot consume image height');
 await page.getByRole('button',{name:'Recolher controles de camadas'}).click();
 await page.locator('.photo-polygon[data-tag="UG-V1-S03"]').press('Enter');await page.locator('.context-inspector').waitFor();await settle();assert.equal(await width(),315);
 await page.getByRole('button',{name:'Aumentar zoom',exact:true}).click();const focusRect=await page.locator('.photo-viewport').boundingBox();await page.mouse.move(focusRect.x+focusRect.width*.65,focusRect.y+focusRect.height*.55);await page.mouse.wheel(0,-140);await settle();const beforeZoom=await zoom(),beforePoint=await point();
 const separator=page.getByRole('separator',{name:'Largura do inspetor'}),bounds=await separator.boundingBox();await separator.hover();assert.equal(await separator.evaluate(el=>getComputedStyle(el).cursor),'col-resize');
 await page.mouse.move(bounds.x+5,bounds.y+150);await page.mouse.down();await page.mouse.move(bounds.x+75,bounds.y+150,{steps:10});await page.mouse.up();await settle();
 assert.equal(await width(),385);assert.equal(await zoom(),beforeZoom);assert.equal(await page.locator('.photo-polygon.is-selected').getAttribute('data-tag'),'UG-V1-S03');
 const afterPoint=await point();assert(Math.abs(beforePoint.x-afterPoint.x)<.01&&Math.abs(beforePoint.y-afterPoint.y)<.01,'Resize retains image center');
 assert.equal(await page.evaluate(()=>localStorage.getItem('nv-explore-inspector-width')),'385');
 await page.getByRole('button',{name:'Expandir painel',exact:true}).click();assert(await width()>385);await page.getByRole('button',{name:'Reduzir painel',exact:true}).click();assert.equal(await width(),385);
 await separator.press('End');assert.equal(await width(),Number(await separator.getAttribute('aria-valuemax')));await separator.press('ArrowLeft');assert(await width()<Number(await separator.getAttribute('aria-valuemax')));await separator.press('Home');assert.equal(await width(),315);await separator.press('ArrowRight');assert.equal(await width(),325);await separator.dblclick();assert.equal(await width(),315);
 await page.getByRole('button',{name:'Minimizar barra do visualizador'}).click();assert(await page.getByRole('button',{name:'Restaurar barra do visualizador'}).isVisible());assert((await page.locator('.photo-viewport').boundingBox()).height>initial.height);assert.equal(await zoom(),beforeZoom);assert.equal(await page.locator('.photo-polygon.is-selected').getAttribute('data-tag'),'UG-V1-S03');
 await page.getByRole('button',{name:'Restaurar barra do visualizador'}).click();assert.equal(await zoom(),beforeZoom);
 await modules();const menu=page.getByRole('menu',{name:'Módulos e Visualização'});assert(await menu.getByRole('menuitem',{name:/Visualizar prisma 3D/}).isDisabled());await page.keyboard.press('End');await page.keyboard.press('Enter');
 const credits=page.getByRole('dialog',{name:'Informações e créditos',exact:true});await credits.waitFor();assert((await credits.textContent()).includes('AGPL-3.0'));assert(await credits.getByRole('link',{name:/Fonte original/}).count());await page.keyboard.press('Escape');assert.equal(await credits.count(),0);assert.equal(await page.locator('.photo-polygon.is-selected').getAttribute('data-tag'),'UG-V1-S03');
 await modules();await page.keyboard.press('Escape');assert.equal(await menu.count(),0);assert(await page.getByRole('button',{name:'Módulos e Visualização',exact:true}).evaluate(el=>el===document.activeElement));
 await modules();await page.mouse.click(1340,700);assert.equal(await menu.count(),0);
 await modules();await menu.getByRole('menuitem',{name:'Ver esquema 2D',exact:true}).click();await page.getByRole('dialog',{name:'Esquema 2D — Uncut Gem V1'}).waitFor();await page.keyboard.press('Escape');assert.equal(await zoom(),beforeZoom);
 await modules();await menu.getByRole('menuitem',{name:'Tela cheia',exact:true}).click();await page.waitForFunction(()=>document.fullscreenElement?.classList.contains('scientific-workspace'));assert(await page.getByRole('button',{name:'Módulos e Visualização',exact:true}).isVisible());await page.getByRole('button',{name:'Sair da tela cheia',exact:true}).click();await page.waitForFunction(()=>!document.fullscreenElement);
 await page.screenshot({path:shots+'/AdaptiveInspector1366.png'});
 await page.reload({waitUntil:'domcontentloaded'});await page.locator('.photo-polygon').nth(8).waitFor();await page.locator('.photo-polygon[data-tag="UG-V1-S03"]').press('Enter');await page.getByRole('separator',{name:'Largura do inspetor'}).waitFor();assert.equal(await width(),315);
 await page.getByRole('separator',{name:'Largura do inspetor'}).press('ArrowRight');await page.reload({waitUntil:'domcontentloaded'});await page.locator('.photo-polygon').nth(8).waitFor();await page.locator('.photo-polygon[data-tag="UG-V1-S03"]').press('Enter');await settle();assert.equal(await width(),325);
 await page.getByRole('button',{name:'Fechar inspetor'}).click();assert.equal(await page.getByRole('separator',{name:'Largura do inspetor'}).count(),0);
 await page.evaluate(()=>localStorage.setItem('nv-explore-inspector-width','bad'));await page.reload({waitUntil:'domcontentloaded'});await page.locator('.photo-polygon').nth(8).waitFor();await page.locator('.photo-polygon[data-tag="UG-V1-S03"]').press('Enter');await settle();assert.equal(await width(),315);await page.getByRole('button',{name:'Fechar inspetor'}).click();
 await page.evaluate(()=>Object.defineProperty(Element.prototype,'requestFullscreen',{configurable:true,value:undefined}));await page.getByRole('button',{name:'Maximizar foto'}).click();assert(await page.locator('.scientific-workspace.full-fallback').isVisible());await page.keyboard.press('Escape');assert.equal(await page.locator('.full-fallback').count(),0);
 for(const size of [{width:1920,height:1080},{width:768,height:1024},{width:390,height:844}]){
  await page.setViewportSize(size);await settle();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1&&document.documentElement.scrollHeight<=innerHeight+1));
  await modules();const rect=await menu.boundingBox();assert(rect.x>=0&&rect.x+rect.width<=size.width+1&&rect.y+rect.height<=size.height);await page.keyboard.press('Escape');
  if(size.width<=800){await page.locator('.photo-polygon[data-tag="UG-V1-S03"]').press('Enter');await settle();assert(!await page.getByRole('separator',{name:'Largura do inspetor'}).isVisible());await page.getByRole('button',{name:'Fechar inspetor'}).click();}
 }
 await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('.viewer-toolbar-icon').first().evaluate(el=>getComputedStyle(el).animationName),'none');
 await page.evaluate(()=>location.hash='inventario');await page.getByRole('heading',{name:'Inventário — Uncut Gem V1',exact:true}).waitFor();assert.equal(await page.locator('.viewer-toolbar,.viewer-layer-popover,.inspector-resize-handle').count(),0);
 assert.deepEqual(errors,[]);console.log('PASS: adaptive toolbar, overlay, minimize/restore, menu keyboard/outside/Escape, credits, scheme, native/fallback fullscreen, inspector drag/limits/persistence/reset, zoom/focus continuity and four responsive sizes.');
}finally{await browser.close()}
