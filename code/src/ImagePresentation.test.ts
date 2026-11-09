import {it,expect} from "vitest";
import {imagePresentation,presentedMarker,presentedAsset,presentedItem} from "./ImagePresentation";
import {PHOTO_REGIONS} from "./PhotoRegions";
it("keeps all six real hotspots on the rectified main photograph",()=>{
 for(const region of PHOTO_REGIONS){
  const marker=presentedMarker(region);
  expect(marker.x).toBeGreaterThan(0);expect(marker.x).toBeLessThan(100);
  expect(marker.y).toBeGreaterThan(0);expect(marker.y).toBeLessThan(100);
  expect(presentedItem(region.tag).outputSize.every(v=>v>0)).toBe(true);
 }
 expect(Object.keys(imagePresentation.items)).toHaveLength(79);
});
it("uses the corrected photo in flow and galleries, leaving diagrams unchanged",()=>{
 expect(presentedAsset('/base/assets/official/v1/enhanced/UgV1OledEnhanced.png','/base/')).toContain('/presentation/');
 expect(presentedAsset('/base/assets/official/Layer3.png','/base/')).toBe('/base/assets/official/Layer3.png');
});
