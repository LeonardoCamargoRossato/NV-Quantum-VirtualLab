/** Keep two complete card rows; the grid reports its available width. */
export function cardPageSize(width:number):number {
  return Math.max(1,Math.floor((width+16)/266))*2;
}
export function pageNumbers(current:number,total:number):(number|null)[] {
  const pages=Array.from({length:total},(_,i)=>i+1).filter(p=>p===1||p===total||Math.abs(p-current)<=2);
  const result:(number|null)[]=[];
  pages.forEach((p,i)=>{if(i&&p-pages[i-1]>1)result.push(null);result.push(p)});
  return result;
}
