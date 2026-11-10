import {chromium} from '@playwright/test';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox','--enable-webgl','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']});
const url=process.env.APP_URL||'http://127.0.0.1:4174/NV-Quantum-VirtualLab/';
for(const [width,height] of [[1366,768],[1920,1080],[390,844]]){
 const page=await browser.newPage({viewport:{width,height}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url+'#explorar');await page.getByRole('button',{name:/Módulos e Visualização/}).click();await page.getByRole('menuitem',{name:'Visualizar Prisma 3D'}).click();
 const started=Date.now();await page.waitForFunction(()=>{const state=document.querySelector('.scientific-3d-status');return (document.querySelector('.scientific-3d-canvas canvas')&&!state)||state?.textContent?.includes('WebGL indisponível')},undefined,{timeout:60000});
 if(await page.getByText('WebGL indisponível neste navegador.').count()){await page.getByRole('button',{name:'Tentar novamente'}).waitFor();console.log('PASS WebGL fallback on CI renderer',width,height);await page.close();continue}
 console.log('Load ms',width,Date.now()-started);
 if(await page.getByText('Não foi possível carregar o modelo 3D.').count())throw Error('model failed');
 if(await page.locator('.scientific-3d-canvas canvas').count()!==1)throw Error('canvas absent');
 await page.screenshot({path:`/tmp/Scientific3D-Solid-${width}.png`});
 const box=await page.locator('.scientific-3d-canvas').boundingBox();if(!box)throw Error('canvas not visible');
 await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+80,box.y+box.height/2+40,{steps:5});await page.mouse.up();
 await page.mouse.wheel(0,-160);await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down({button:'right'});await page.mouse.move(box.x+box.width/2+30,box.y+box.height/2+30,{steps:5});await page.mouse.up({button:'right'});
 await page.getByLabel('Vista').selectOption('Superior');await page.getByLabel('Exibição').selectOption('Malha');await page.getByRole('button',{name:'Aproximar modelo'}).click();await page.getByRole('button',{name:'Afastar modelo'}).click();await page.getByRole('button',{name:'Centralizar modelo'}).click();
 await page.getByRole('button',{name:'Tela cheia 3D'}).click();if(!(await page.evaluate(()=>Boolean(document.fullscreenElement))))throw Error('fullscreen failed');await page.getByRole('button',{name:'Sair da tela cheia 3D'}).click();
 await page.screenshot({path:`/tmp/Scientific3D-${width}.png`});
 await page.getByRole('button',{name:/Módulos e Visualização/}).click();await page.getByRole('menuitem',{name:'Ver fotografia 2D'}).click();await page.locator('.photo-viewport img').waitFor();
 await page.getByRole('button',{name:/Módulos e Visualização/}).click();await page.getByRole('menuitem',{name:'Visualizar Prisma 3D'}).click();await page.locator('.scientific-3d-canvas canvas').waitFor();
 if(errors.length)throw Error(errors.join('\n'));console.log('PASS',width,height);await page.close();
}
const fallback=await browser.newPage();await fallback.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){if(type==='webgl'||type==='webgl2')return null;return original.call(this,type,...args)}});await fallback.goto(url+'#explorar');await fallback.getByRole('button',{name:/Módulos e Visualização/}).click();await fallback.getByRole('menuitem',{name:'Visualizar Prisma 3D'}).click();await fallback.getByText('WebGL indisponível neste navegador.').waitFor();await fallback.getByRole('button',{name:'Tentar novamente'}).waitFor();await fallback.close();console.log('PASS WebGL fallback');
await browser.close();
