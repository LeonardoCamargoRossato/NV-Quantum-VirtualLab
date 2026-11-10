import {describe,it,expect} from 'vitest';
import inventory from '../source/InventoryV1.json';
import {imagePresentation} from './ImagePresentation';
import {PHOTO_POLYGONS,subsystemPolygons,componentPolygons,polygonBounds,findPolygonRegion} from './PhotoRegions';
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
});
