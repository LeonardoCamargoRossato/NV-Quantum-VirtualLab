import {describe,expect,it} from "vitest";
import {parseResearchCsv,filterResearchRows} from "./ResearchCsv";
import {SEARCH_EQUATIONS,searchResults,researcherDecisions,DOCUMENT_FIGURES} from "./ScientometricData";

describe("revisão cientométrica — fonte e privacidade",()=>{
 it("preserva as grandezas distintas da triagem e decisão",()=>{
  expect(searchResults.map(m=>m.value)).toEqual([447,419,245,172,122,50,73]);
  expect(419-174).toBe(245);
  expect(122+50+73).toBe(245);
  expect(63+59+50+0).toBe(172);
  expect(researcherDecisions.map(d=>d.count)).toEqual([63,59,50,0]);
 });
 it("usa três equações finais documentadas, sem recomposição",()=>{
  expect(SEARCH_EQUATIONS.map(x=>x.id)).toEqual(["E1","E2","E3"]);
  expect(SEARCH_EQUATIONS[1].scopusHits).toBe(194);
  expect(SEARCH_EQUATIONS[1].scopusExported).toBe(166);
  expect(SEARCH_EQUATIONS[1].expression).toContain('"ODMR"');
  expect(SEARCH_EQUATIONS[2].expression).toContain('"GNSS-denied"');
  expect(DOCUMENT_FIGURES).toHaveLength(4);
  expect(DOCUMENT_FIGURES.every(f=>f.page===null)).toBe(true);
 });
 it("lê CSV com multiline, aspas internas e filtro de texto",()=>{
  const csv='Nº,Sua decisão,Título original,Autores\n1,Manter,"NV, quantum",Ana\n2,Em dúvida,"Nota ""especial""",Bob\n3,Manter,"Texto\nmultilinha",Eva\n';
  const rows=parseResearchCsv(csv);
  expect(rows).toHaveLength(4);
  expect(rows[1][2]).toBe("NV, quantum");
  expect(rows[2][2]).toBe('Nota "especial"');
  expect(rows[3][2]).toBe("Texto\nmultilinha");
  expect(filterResearchRows(rows[0],rows.slice(1),"ana","","")).toHaveLength(1);
  expect(filterResearchRows(rows[0],rows.slice(1),"","Sua decisão","Manter")).toHaveLength(2);
 });
 it("não omite aspas CSV malformadas",()=>{
  expect(()=>parseResearchCsv('A,B\n1,"texto')).toThrow();
 });
});