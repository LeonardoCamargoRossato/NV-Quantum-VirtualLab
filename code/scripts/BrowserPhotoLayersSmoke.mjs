import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdirSync,readFileSync} from 'node:fs';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const data=JSON.parse(readFileSync(new URL('../source/PhotoPolygons.json',import.meta.url)));
const inventory=JSON.parse(readFileSync(new URL('../source/InventoryV1.json',import.meta.url))).items;
const shots=process.env.SCREENSHOT_DIR||'/tmp/nv-polygon-layers';mkdirSync(shots,{recursive:true});
async function openControls(){if(!await page.locator('.viewer-layer-popover').count())await page.getByRole('button',{name:'Expandir controles de camadas'}).click()}
async function closeControls(){if(await page.getByRole('button',{name:'Recolher controles de camadas'}).isVisible())await page.getByRole('button',{name:'Recolher controles de camadas'}).click()}
try{
 await page.goto(process.env.APP_URL||'http://127.0.0.1:4173/NV-Quantum-VirtualLab/');
 await page.locator('.photo-polygon').nth(8).waitFor();
 assert.equal(await page.locator('.hotspot').count(),0);
 assert.equal(await page.locator('.photo-polygon').count(),9);
 await openControls();
 const modes=page.getByRole('group',{name:'Camada da fotografia'});
 assert(await modes.getByRole('button',{name:'Componentes',exact:true}).isEnabled());
 await modes.getByRole('button',{name:'Componentes',exact:true}).click();
 assert.equal(await page.locator('.photo-polygon').count(),data.components.length,'All located components must be available from the global layer');
 await modes.getByRole('button',{name:'Nenhuma',exact:true}).click();
 assert.equal(await page.locator('.photo-polygon-overlay').count(),0);
 await modes.getByRole('button',{name:'Subsistemas',exact:true}).click();
 const laser=page.locator('.photo-polygon[data-tag="UG-V1-S03"]');
 await laser.locator('polygon').hover();
 assert(+await laser.locator('polygon').evaluate(el=>getComputedStyle(el).fillOpacity)>.08);
 await laser.click();await page.getByRole('complementary',{name:/Excitação óptica/}).waitFor();
 assert.equal(await laser.getAttribute('aria-pressed'),'true');
 await laser.press('Enter');assert.equal(await page.locator('.context-inspector').count(),0);
 await page.screenshot({path:shots+'/Subsystems.png',fullPage:true});
 for(const region of data.subsystems){
  const parent=inventory.find(i=>i.tag===region.tag);
  await openControls();
  await page.getByLabel('Expandir subsistema',{exact:true}).selectOption(region.tag);
  const expected=data.components.filter(r=>inventory.find(i=>i.tag===r.tag).parentTag===region.tag);
  assert.equal(await page.locator('.photo-polygon').count(),expected.length,parent.name);
  assert.equal(await modes.getByRole('button',{name:'Componentes',exact:true}).getAttribute('aria-pressed'),'true');
  assert(parseInt(await page.locator('.photo-controls output').textContent())>=100);
  assert(await page.getByRole('button',{name:'Voltar à placa inteira',exact:false}).isVisible());
  for(const child of expected){
   const polygon=page.locator('.photo-polygon[data-tag="'+child.tag+'"]');
   // Keyboard is essential for tiny / nested contours; test every inventory link.
   await polygon.focus();await polygon.press('Enter');
   await page.getByRole('complementary',{name:'Painel de informações: '+inventory.find(i=>i.tag===child.tag).name,exact:true}).waitFor();
   assert.equal(await polygon.getAttribute('aria-pressed'),'true');
   await polygon.press('Space');assert.equal(await polygon.getAttribute('aria-pressed'),'false');
  }
  if(region.tag==='UG-V1-S07'){
   await openControls();
   await page.locator('.photo-unmapped summary').click();
   await page.locator('.photo-unmapped').getByRole('button',{name:'Fotodiodo BPW34',exact:true}).click();
   assert.equal(await page.locator('.photo-polygon.is-selected').count(),0);
   await page.getByRole('button',{name:'Fechar inspetor'}).click();
  }
  if(region.tag==='UG-V1-S08'){
   for(const tag of ['UG-V1-B031','UG-V1-B034','UG-V1-B035','UG-V1-B037'])
    assert.equal(await page.locator('.photo-polygon[data-tag="'+tag+'"]').count(),1,'Missing analog polygon '+tag);
   await page.screenshot({path:shots+'/SignalComponents.png',fullPage:true});
   await page.getByRole('button',{name:'Redefinir',exact:true}).click();
   assert.equal(await page.locator('.photo-controls output').textContent(),'100%');
   assert.equal(await page.locator('.photo-polygon').count(),expected.length,'Zoom reset must preserve subsystem focus');
  }
  await closeControls();
  await page.getByRole('button',{name:'Voltar à placa inteira',exact:false}).click();
  assert.equal(await page.locator('.photo-controls output').textContent(),'100%');
 }
 // Actual expand icon and pointer component clicks, not only the accessible select.
 await closeControls();
 await page.getByRole('button',{name:'Expandir Excitação óptica — laser',exact:true}).click();
 const component=page.getByRole('button',{name:'Inspecionar Laser verde',exact:true});
 await component.click();await page.getByRole('complementary',{name:'Painel de informações: Laser verde',exact:true}).waitFor();
 await component.click();assert.equal(await page.locator('.context-inspector').count(),0);
 await page.setViewportSize({width:390,height:844});
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 await page.screenshot({path:shots+'/MobileComponents.png',fullPage:true});
 await closeControls();
 await page.getByRole('button',{name:'Voltar à placa inteira',exact:false}).click();
 await openControls();
 await modes.getByRole('button',{name:'Nenhuma',exact:true}).click();
 await closeControls();
 await page.screenshot({path:shots+'/MobileNoLayer.png',fullPage:true});
 assert.equal(await page.locator('.photo-polygon').count(),0);
 for(const size of [{width:1440,height:950},{width:390,height:844},{width:1680,height:900}]){
  await page.setViewportSize(size);
  await page.waitForTimeout(100);
  assert(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1),'Explore must fit the viewport');
  assert.equal(await page.locator('.enhanced-gallery,.below-photo').count(),0);
  const photo=page.locator('.photo-viewport');const rect=await photo.boundingBox();assert(rect.height>180,'Main image keeps usable height');
  await page.mouse.move(rect.x+rect.width/2,rect.y+rect.height/2);
  const before=parseInt(await page.locator('.photo-controls output').textContent());
  await page.mouse.wheel(0,-150);await page.waitForTimeout(100);
  const after=parseInt(await page.locator('.photo-controls output').textContent());assert(after>before,'Wheel zooms in');
  await page.mouse.wheel(0,150);await page.waitForTimeout(100);
  assert(parseInt(await page.locator('.photo-controls output').textContent())<after,'Wheel zooms out');
  assert.equal(await page.evaluate(()=>window.scrollY),0,'Wheel cannot scroll the page');
 }
 await page.evaluate(()=>{location.hash='inventario'});
 await page.getByRole('heading',{name:'Inventário — Uncut Gem V1',exact:true}).waitFor();
 assert.equal(await page.locator('.explore-fixed').count(),0,'Other pages retain normal document scrolling');
 assert.deepEqual(errors,[]);
 console.log('PASS: no-layer photo, nine subsystem polygons, hover, select/deselect, expansion, all mapped component links, hidden items, return, mouse, keyboard and mobile.');
}finally{await browser.close();}
