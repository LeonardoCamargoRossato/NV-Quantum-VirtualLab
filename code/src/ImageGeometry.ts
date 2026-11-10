export function normalizeRotation(angle:number){return ((angle%360)+360)%360}
export function rotateOffset(point:{x:number;y:number},degrees:number){
 const angle=normalizeRotation(degrees)*Math.PI/180,c=Math.cos(angle),s=Math.sin(angle);
 return {x:point.x*c-point.y*s,y:point.x*s+point.y*c};
}
export function orientedSize(size:{width:number;height:number},rotation:number){
 return normalizeRotation(rotation)%180===90?{width:size.height,height:size.width}:size;
}
