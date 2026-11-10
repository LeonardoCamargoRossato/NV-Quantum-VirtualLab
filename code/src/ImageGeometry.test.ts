import {expect,it} from 'vitest';
import {normalizeRotation,rotateOffset,orientedSize} from './ImageGeometry';
import {subsystemFocusBounds} from './PhotoRegions';
it('rotates a panned image around the viewed center and returns after four turns',()=>{
 let p={x:70,y:-20};p=rotateOffset(p,90);expect(p.x).toBeCloseTo(20);expect(p.y).toBeCloseTo(70);
 for(let i=0;i<3;i++)p=rotateOffset(p,90);expect(p.x).toBeCloseTo(70);expect(p.y).toBeCloseTo(-20);
 expect(normalizeRotation(450)).toBe(90);expect(normalizeRotation(-90)).toBe(270);
});
it('fits portrait orientations and frames both RF connectors',()=>{
 expect(orientedSize({width:1478,height:1105},90)).toEqual({width:1105,height:1478});
 expect(orientedSize({width:1478,height:1105},180)).toEqual({width:1478,height:1105});
 const b=subsystemFocusBounds('UG-V1-S05')!;expect(b.x).toBe(42);expect(b.x+b.w).toBe(79);
});
