import {chromium} from '@playwright/test';
import {mkdirSync,writeFileSync} from 'node:fs';
const phase=process.env.METRICS_PHASE||'Before';const folder=process.env.METRICS_DIR||'/tmp/nv-adaptive-viewer';mkdirSync(folder,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});const results=[];
for(const [width,height] of [[1366,768],[1920,1080],[768,1024],[390,844]]){
 const page=await browser.newPage({viewport:{width,height}});await page.goto(process.env.APP_URL||'http://127.0.0.1:4173/NV-Quantum-VirtualLab/',{waitUntil:'domcontentloaded'});await page.locator('.photo-polygon').nth(8).waitFor();await page.waitForTimeout(120);
 const rect=await page.locator('.photo-viewport').boundingBox();const toolbar=page.locator('.viewer-toolbar');const toolbarHeight=await toolbar.count()?await toolbar.evaluate(el=>el.getBoundingClientRect().height):0;const oldTop=await page.locator('.compact-toolbar').count()?await page.locator('.compact-toolbar').boundingBox():null;const oldControls=await page.locator('.photo-layer-panel').count()?await page.locator('.photo-layer-panel').boundingBox():null;
 await page.screenshot({path:folder+'/'+phase+width+'.png'});
 await page.locator('[data-tag="UG-V1-S03"].photo-polygon').press('Enter');await page.locator('.context-inspector').waitFor();await page.waitForTimeout(120);const withInspector=await page.locator('.photo-viewport').boundingBox();
 await page.getByRole('button',{name:'Fechar inspetor'}).click();
 let minimized=null;if(await page.getByRole('button',{name:'Minimizar barra do visualizador'}).count()){await page.getByRole('button',{name:'Minimizar barra do visualizador'}).click();await page.waitForTimeout(100);minimized=await page.locator('.photo-viewport').boundingBox();}
 results.push({viewport:[width,height],photoHeight:Math.round(rect.height),photoWidth:Math.round(rect.width),photoWidthWithInspector:Math.round(withInspector.width),headerAndControlsHeight:Math.round(oldTop&&oldControls?rect.y-oldTop.y:toolbarHeight),minimizedPhotoHeight:minimized?Math.round(minimized.height):null});await page.close();
}
await browser.close();writeFileSync(folder+'/'+phase+'Metrics.json',JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify(results));
