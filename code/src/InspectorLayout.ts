export const DEFAULT_INSPECTOR_WIDTH=315;
export function inspectorLimits(workspaceWidth:number){
 const max=Math.max(260,Math.min(workspaceWidth*.45,workspaceWidth-330));
 return {min:260,max:Math.round(max)};
}
export function inspectorWidth(value:unknown,workspaceWidth:number){
 const {min,max}=inspectorLimits(workspaceWidth);
 const parsed=typeof value==='number'?value:typeof value==='string'&&value.trim()?Number(value):NaN;
 return Math.round(Math.max(min,Math.min(max,Number.isFinite(parsed)&&parsed>=min?parsed:DEFAULT_INSPECTOR_WIDTH)));
}
