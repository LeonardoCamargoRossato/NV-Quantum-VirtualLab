import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';

const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:950}}),errors=[];
page.on('pageerror',error=>errors.push(error.message));
const shots=process.env.SCREENSHOT_DIR||'/tmp/nv-back-face';mkdirSync(shots,{recursive:true});
const url=process.env.APP_URL||'http://127.0.0.1:4173/NV-Quantum-VirtualLab/';
async function flip(label){await page.getByRole('button',{name:label,exact:true}).click();await page.waitForFunction(()=>!document.querySelector('.photo-stage')?.classList.contains('is-flipping'));}
try{
 await page.goto(url,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>document.querySelector('.photo-stage img')?.naturalWidth>0);
 assert.equal(await page.locator('.photo-polygon').count(),0);
 const button=page.getByRole('button',{name:'Virar fotografia para o verso',exact:true});await button.click();assert(await page.locator('.photo-stage.is-flipping').count());await page.waitForFunction(()=>!document.querySelector('.photo-stage')?.classList.contains('is-flipping'));
 const stage=page.locator('.photo-stage');assert.equal(await stage.getAttribute('data-face'),'back');assert((await stage.getByRole('img').getAttribute('src')).endsWith('/DeviceBackV1.jpeg'));assert.equal(await page.locator('.photo-polygon').count(),0,'Layer choice survives face change');
 await page.getByRole('button',{name:'Subsistemas',exact:true}).click();assert.equal(await page.locator('.photo-polygon').count(),1);assert.equal(await page.locator('.photo-polygon[data-tag="UG-V1-S04"]').count(),1);
 await page.locator('.photo-polygon[data-tag="UG-V1-S04"]').click();await page.getByRole('complementary',{name:'Painel de informações: Geração de micro-ondas — ADF4351',exact:true}).waitFor();await page.getByRole('button',{name:'Fechar inspetor'}).click();
 await page.getByRole('button',{name:'Expandir Geração de micro-ondas — ADF4351',exact:true}).click();assert.equal(await page.locator('.photo-polygon').count(),1);assert.equal(await page.locator('.photo-polygon[data-tag="UG-V1-0018"]').count(),1);
 await page.locator('.photo-polygon[data-tag="UG-V1-0018"]').click();await page.getByRole('complementary',{name:'Painel de informações: Placa geradora RF ADF4351',exact:true}).waitFor();await page.getByRole('button',{name:'Fechar inspetor'}).click();
 await page.getByRole('button',{name:'Expandir controles de camadas'}).click();await page.locator('.photo-unmapped summary').click();assert((await page.locator('.photo-unmapped button').allTextContents()).includes('Circuito sintetizador ADF4351'));await page.getByRole('button',{name:'Recolher controles de camadas'}).click();
 await page.getByRole('button',{name:'Voltar à placa inteira',exact:true}).click();await page.getByRole('button',{name:'Componentes',exact:true}).click();assert.equal(await page.locator('.photo-polygon').count(),2,'Global rear layer exposes the board face and RF module only');
 const image=await stage.locator('img').boundingBox(),svg=await stage.locator('svg').boundingBox();for(const key of ['x','y','width','height'])assert(Math.abs(image[key]-svg[key])<1,'Rear polygons stay registered');
 await page.getByRole('button',{name:'Maximizar foto',exact:true}).click();await page.waitForFunction(()=>document.fullscreenElement?.classList.contains('scientific-workspace'));assert.equal(await stage.getAttribute('data-face'),'back');assert.equal(await page.locator('.photo-polygon').count(),2);await page.getByRole('button',{name:'Sair da tela cheia',exact:true}).click();await page.waitForFunction(()=>!document.fullscreenElement);
 await page.getByRole('button',{name:'Aumentar zoom',exact:true}).click();const view=await page.locator('.photo-viewport').boundingBox();await page.mouse.move(view.x+view.width/2,view.y+view.height/2);await page.mouse.down();await page.mouse.move(view.x+view.width/2+35,view.y+view.height/2-25);await page.mouse.up();
 await page.screenshot({path:shots+'/RearInteractive.png'});
 await flip('Voltar fotografia para a frente');assert.equal(await stage.getAttribute('data-face'),'front');assert.equal(await page.locator('.context-inspector').count(),0);assert.equal(await page.locator('.photo-polygon').count(),34,'Components layer switches back to frontal geometry');
 await page.emulateMedia({reducedMotion:'reduce'});await flip('Virar fotografia para o verso');assert.equal(await stage.getAttribute('data-face'),'back');assert.equal(await stage.evaluate(element=>getComputedStyle(element).animationName),'none');
 await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.screenshot({path:shots+'/RearMobile.png'});
 assert.deepEqual(errors,[]);console.log('PASS: real rear photograph, bidirectional 3D flip/reduced motion, face-specific layers, safe omissions, correct inspectors, registered polygons, zoom/pan and mobile.');
}finally{await browser.close()}
