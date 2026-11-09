/** Agregados e transcrições verificados em 09/11/2026.
 * Fontes: Google Sheets (aba "Resumo e critérios") e Google Docs do artigo V0.
 * Não contém títulos, autores nem resumos privados da planilha de 172 artigos.
 */
export const RESEARCH_SHEET = "https://docs.google.com/spreadsheets/d/1ID0MHrg_-2Fx37vGR8SMhoILLs6E8WR8CnMV4mlf734/edit";
export const RESEARCH_SHEET_PREVIEW = "https://docs.google.com/spreadsheets/d/1ID0MHrg_-2Fx37vGR8SMhoILLs6E8WR8CnMV4mlf734/preview?gid=448820393";
export const SCIENTOMETRIC_DOC = "https://docs.google.com/document/d/12TKAwbNWHPy99cCV4XF26fLyAKZGOUkNwMoBGCkuOhE/edit";
export const SCIENTOMETRIC_DOC_PREVIEW = "https://docs.google.com/document/d/12TKAwbNWHPy99cCV4XF26fLyAKZGOUkNwMoBGCkuOhE/preview";
export const SCIENTOMETRIC_PDF = "https://drive.google.com/file/d/1pouGbfNMHSnZkp-MIDdNgP34CJXlA7aG/view";
export const SCIENTOMETRIC_PDF_PREVIEW = "https://drive.google.com/file/d/1pouGbfNMHSnZkp-MIDdNgP34CJXlA7aG/preview";
export const SCIENTOMETRIC_PDF_CREATED_UTC = "2026-11-09T15:06:59.682Z";
export const SUPPORT_DOC = "https://docs.google.com/document/d/1ylp9JnYox8yULs5msb1bzgS7i7B_1keRxkDUyuhXdiU/edit";

export const searchResults = [
  {label:"Resultados nas interfaces",value:447,detail:"Scopus 261 + Web of Science 186"},
  {label:"Registros exportados",value:419,detail:"Scopus 233 + Web of Science 186"},
  {label:"Documentos únicos",value:245,detail:"Após deduplicação de 174 registros"},
  {label:"Artigos na planilha",value:172,detail:"122 recomendados + 50 em dúvida"},
  {label:"Recomendados na triagem",value:122,detail:"Primeira triagem de título e resumo"},
  {label:"Em dúvida na triagem",value:50,detail:"Primeira triagem"},
  {label:"Não recomendados",value:73,detail:"Fora da planilha de 172"},
] as const;

export const researcherDecisions = [
  {label:"Manter",count:63},
  {label:"Apoio teórico",count:59},
  {label:"Solicitar texto completo",count:50},
  {label:"Excluir",count:0},
] as const;

export type SearchEquation = {
  id:"E1"|"E2"|"E3";
  title:string;
  bases:string;
  scopusHits:number;
  wosHits:number;
  scopusExported:number;
  expression:string;
  explanation:string;
  keywords:string[];
};
export const SEARCH_EQUATIONS:SearchEquation[] = [
  {
    id:"E1",title:"Sensoriamento quântico e navegação",bases:"Scopus + Web of Science",
    scopusHits:55,wosHits:33,scopusExported:55,
    expression:'("quantum magnetometer" OR "diamond magnetometer" OR "nitrogen-vacancy" OR "NV center" OR "quantum sensing") AND ("inertial navigation" OR "INS" OR "IMU" OR "GNSS-denied" OR "GPS-denied" OR "heading estimation" OR "sensor fusion")',
    keywords:["quantum magnetometer","nitrogen-vacancy","NV center","inertial navigation","IMU","GNSS-denied"],
    explanation:"Investiga a interseção entre sensores quânticos e navegação inercial ou sem GNSS."
  },
  {
    id:"E2",title:"NV compacto e instrumentação aberta",bases:"Scopus + Web of Science",
    scopusHits:194,wosHits:149,scopusExported:166,
    expression:'("nitrogen-vacancy" OR "NV center" OR "diamond magnetometer") AND ("low-cost" OR "open-source" OR "portable" OR "compact") AND ("magnetometer" OR "magnetometry" OR "ODMR")',
    keywords:["nitrogen-vacancy","low-cost","open-source","portable","compact","ODMR"],
    explanation:"Recorte refinado de reprodutibilidade e miniaturização NV. A consulta Scopus mostrou 194 resultados, mas somente 166 foram exportados; faltam 28 registros."
  },
  {
    id:"E3",title:"INS com auxílio magnético e desempenho",bases:"Scopus + Web of Science",
    scopusHits:12,wosHits:4,scopusExported:12,
    expression:'("inertial navigation" OR "heading estimation" OR "attitude estimation") AND ("MEMS magnetometer" OR "magnetometer-aided" OR "magnetic aiding") AND ("drift" OR "accuracy" OR "performance evaluation" OR "GNSS-denied")',
    keywords:["inertial navigation","heading estimation","MEMS magnetometer","drift","performance evaluation"],
    explanation:"Agrupa estudos de referência clássicos para avaliar erro, deriva e desempenho de navegação."
  }
];
export type DocumentFigure = {number:number;title:string;description:string;origin:string;page:number};
export const DOCUMENT_FIGURES:DocumentFigure[] = [
 {number:1,title:"Fluxo de buscas e triagem",description:"Busca, exportação, deduplicação e decisões. Esquema documental, não fluxograma PRISMA de leitura integral.",origin:"Artigo V0, Figura 1",page:7},
 {number:2,title:"Publicações por ano",description:"Distribuição temporal do corpus ‘Manter’ (63 trabalhos). O ano de 2026 ainda não havia terminado quando os dados foram coletados.",origin:"Artigo V0, Figura 2",page:8},
 {number:3,title:"País da primeira afiliação",description:"Contagem por país de afiliação do primeiro autor nos 63 trabalhos; classificação preliminar.",origin:"Artigo V0, Figura 3",page:9},
 {number:4,title:"Arquitetura experimental proposta",description:"Arquitetura conceitual de coleta, calibração, fusão e comparação de configurações INS; não implementada/validada.",origin:"Artigo V0, Figura 4",page:12},
];
export const RESEARCH_SNAPSHOT_DATE = "2026-11-05";
export const RESEARCH_AUDIT_DATE = "2026-11-09";
export const RESEARCH_SHEET_LAST_MODIFIED_UTC = "2026-11-06T04:18:00.104Z";
export const reviewMethods = [
 "Formular três famílias de equações booleanas (E1, E2 e E3).",
 "Consultar Scopus e Web of Science Core Collection em 05/11/2026, via acesso institucional/Portal CAPES.",
 "Consolidar exportações bibliográficas e remover duplicatas por DOI/título.",
 "Analisar título, resumo e pertinência temática; não declarar triagem de texto integral concluída.",
 "Classificar registros como recomendados, em dúvida ou não recomendados; organizar a planilha dos 172 registros em grupos de decisão.",
 "Realizar análise bibliométrica descritiva do recorte “Manter” (63 artigos) e documentar gráficos."
];
