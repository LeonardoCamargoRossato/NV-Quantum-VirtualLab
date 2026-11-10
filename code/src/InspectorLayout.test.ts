import {expect,it} from 'vitest';
import {inspectorWidth,inspectorLimits} from './InspectorLayout';
it('validates persisted values and defaults invalid preferences',()=>{
 for(const value of [null,undefined,'','bad',NaN,Infinity,-5,0])expect(inspectorWidth(value,1102)).toBe(315);
 expect(inspectorWidth('380',1102)).toBe(380);
});
it('keeps the inspector within useful workspace bounds',()=>{
 for(const width of [600,900,1102,1656]){
  const {min,max}=inspectorLimits(width);expect(min).toBe(260);expect(max).toBeLessThanOrEqual(Math.round(width*.45));expect(width-max-10).toBeGreaterThanOrEqual(319);
  expect(inspectorWidth(99999,width)).toBe(max);expect(inspectorWidth(270,width)).toBeLessThanOrEqual(max);
 }
});
