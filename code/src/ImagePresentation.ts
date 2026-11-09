import presentation from "../source/ImagePresentation.json";
import type { PhotoRegion } from "./PhotoRegions";
export const imagePresentation=presentation;
const images=presentation.items as Record<string,{image:string;outputSize:number[]}>;
const known:Record<string,string>={UgV1PcbEnhanced:"UG-V1-0001",UgV1Esp32Enhanced:"UG-V1-0004",UgV1RfAmpEnhanced:"UG-V1-0019",UgV1LaserEnhanced:"UG-V1-0022",UgV1PrismEnhanced:"UG-V1-0023",UgV1OledEnhanced:"UG-V1-0030"};
export const presentedItem=(tag:string)=>images[tag];
export function presentedAsset(url:string,base:string):string {
 const name=url.split('/').at(-1)?.replace(/\.png$/,'')||'';
 if(name==="UgV1OverviewEnhanced")return base+presentation.main.image;
 if(known[name])return base+images[known[name]].image;
 const gallery=presentation.gallery as Record<string,{image:string}>;
 return gallery[name]?base+gallery[name].image:url;
}
/** Anchors remain tied to the original photograph; remap them into the rectified view. */
export function presentedMarker(region:PhotoRegion):{x:number;y:number}{
 const [w,h]=presentation.originals.front.size;
 const x=region.markerX*w/100,y=region.markerY*h/100;
 const m=presentation.main.sourceToOutput;
 const d=m[2][0]*x+m[2][1]*y+m[2][2];
 return {x:100*(m[0][0]*x+m[0][1]*y+m[0][2])/d/presentation.main.outputSize[0],y:100*(m[1][0]*x+m[1][1]*y+m[1][2])/d/presentation.main.outputSize[1]};
}
