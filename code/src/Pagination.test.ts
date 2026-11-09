import {it,expect} from "vitest";
import {cardPageSize,pageNumbers} from "./Pagination";
it("limits cards to two rows on narrow and wide layouts",()=>{
 expect(cardPageSize(200)).toBe(2);
 expect(cardPageSize(516)).toBe(4);
 expect(cardPageSize(1314)).toBe(10);
});
it("keeps current, first and last page reachable without forty mobile buttons",()=>{
 expect(pageNumbers(1,1)).toEqual([1]);
 expect(pageNumbers(20,40)).toEqual([1,null,18,19,20,21,22,null,40]);
});
