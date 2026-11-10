import {describe,it,expect} from 'vitest';
import inventory from '../source/InventoryV1.json';
import {imagePresentation} from './ImagePresentation';
import {PHOTO_POLYGONS,subsystemPolygons,componentPolygons,polygonBounds,findPolygonRegion} from './PhotoRegions';
import presentation from '../source/ImagePresentation.json';
import cropPlan from '../source/evidence/LayerBComponentImagePlan.json';
describe('frontal spatial inventory contract',()=>{
 it('registers all regions against the exact aligned image, not old source coordinates',()=>{
  expect(PHOTO_POLYGONS.image).toBe(imagePresentation.main.image);
  expect(PHOTO_POLYGONS.imageSize).toEqual(imagePresentation.main.outputSize);
  for(const regions of [subsystemPolygons,componentPolygons]){
   expect(new Set(regions.map(r=>r.tag)).size).toBe(regions.length);
   for(const region of regions){
    const item=inventory.items.find(i=>i.tag===region.tag)!;expect(item).toBeDefined();
    expect(item.layer).toBe(regions===subsystemPolygons?'A':'B');
    if(item.layer==='B'){expect(subsystemPolygons.some(r=>r.tag===item.parentTag)).toBe(true);expect(region.class! in PHOTO_POLYGONS.classes).toBe(true);}
    for(const points of region.polygons){expect(points.length).toBeGreaterThanOrEqual(3);for(const [x,y] of points){expect(x).toBeGreaterThanOrEqual(0);expect(y).toBeGreaterThanOrEqual(0);expect(x).toBeLessThanOrEqual(100);expect(y).toBeLessThanOrEqual(100);}}
    const bounds=polygonBounds(region);expect(bounds.w).toBeGreaterThan(0);expect(bounds.h).toBeGreaterThan(0);
   }
  }
 });
 it('never places hidden BPW34, diamond, ADC or rear RF synthesizer on the front photograph',()=>{
  for(const tag of ['UG-V1-S04','UG-V1-0028','UG-V1-0024','UG-V1-B014','UG-V1-B039','UG-V1-0018','UG-V1-0017'])expect(findPolygonRegion(tag)).toBeUndefined();
  expect(subsystemPolygons).toHaveLength(9);
 });
 it('adds R3 C1 C2 C4 at the original corrected crop coordinates',()=>{
  expect(componentPolygons).toHaveLength(34);
  const tags=['UG-V1-B031','UG-V1-B034','UG-V1-B035','UG-V1-B037'];
  const images=presentation.items as Record<string,{sourceBox:number[]}>;
  const transform=presentation.main.sourceToOutput;
  const [width,height]=presentation.main.outputSize;
  for(const tag of tags){
   const region=findPolygonRegion(tag)!;
   expect(region).toBeDefined();
   const item=inventory.items.find(i=>i.tag===tag)!;
   expect(region.class).toBe(item.pcb.startsWith('R')?'resistor':'capacitor');
   const [x0,y0,x1,y1]=images[tag].sourceBox;
   const x=(x0+x1)/2,y=(y0+y1)/2;
   const divisor=transform[2][0]*x+transform[2][1]*y+transform[2][2];
   const photoX=100*(transform[0][0]*x+transform[0][1]*y+transform[0][2])/(divisor*width);
   const photoY=100*(transform[1][0]*x+transform[1][1]*y+transform[1][2])/(divisor*height);
   const bounds=polygonBounds(region);
   expect(Math.abs(bounds.x+bounds.w/2-photoX)).toBeLessThan(1.5);
   expect(Math.abs(bounds.y+bounds.h/2-photoY)).toBeLessThan(1.5);
  }
  for(const tag of ['UG-V1-B029','UG-V1-B030',...tags]){
   const planEntry=cropPlan.components.find(i=>i.tag===tag)!;
   expect((planEntry.region as {px_1453x1080?:number[]}).px_1453x1080).toEqual(images[tag].sourceBox);
  }
 });
});

it('prioritizes RF input/output without drawing the supply wire',()=>{
 expect(findPolygonRegion('UG-V1-B022')?.label).toBe('RFIN');
 expect(findPolygonRegion('UG-V1-B023')?.label).toBe('RFOUT');
 expect(findPolygonRegion('UG-V1-B024')).toBeUndefined();
 expect(inventory.items.some(i=>i.tag==='UG-V1-B024')).toBe(true);
});
