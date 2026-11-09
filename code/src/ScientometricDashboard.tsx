import React, {useEffect, useMemo, useRef, useState} from "react";
import {SectionHeading,Out} from "./StudyPages";
import {parseResearchCsv,filterResearchRows} from "./ResearchCsv";
import {
  DOCUMENT_FIGURES,RESEARCH_SHEET,RESEARCH_SHEET_PREVIEW,SCIENTOMETRIC_DOC,
  SCIENTOMETRIC_DOC_PREVIEW,SUPPORT_DOC,SEARCH_EQUATIONS,searchResults,
  researcherDecisions,reviewMethods,RESEARCH_AUDIT_DATE
} from "./ScientometricData";

type DialogName="sheet"|"pdf"|null;
function Metric({label,value,detail}:{label:string;value:number;detail:string}){
 return <div className="sciento-kpi"><span>{label}</span><strong>{value.toLocaleString("pt-BR")}</strong><small>{detail}</small></div>;
}
function CopyEquation({expression}:{expression:string}){
 const [message,setMessage]=useState("");
 return <button type="button" onClick={async()=>{
   try {await navigator.clipboard.writeText(expression);setMessage("Copiada");}
   catch {setMessage("Selecione o texto para copiar");}
 }} aria-label="Copiar equação de busca">{message||"Copiar expressão"}</button>;
}
function PrivateSheet({expanded,onClose}:{expanded:boolean;onClose:()=>void}){
 const [mode,setMode]=useState<"google"|"table">("google");
 const [sheetRows,setSheetRows]=useState<string[][]>([]);
 const [query,setQuery]=useState("");
 const [filterColumn,setFilterColumn]=useState("");
 const [filterValue,setFilterValue]=useState("");
 const [sheetStatus,setSheetStatus]=useState("Arquivo não carregado");
 const [fullscreen,setFullscreen]=useState(false);
 const section=useRef<HTMLElement>(null);
 const fileRef=useRef<HTMLInputElement>(null);
 const headers=sheetRows[0]||[];
 const body=sheetRows.slice(1);
 const visible=useMemo(()=>filterResearchRows(headers,body,query,filterColumn,filterValue),[headers,body,query,filterColumn,filterValue]);
 const values=useMemo(()=>{
   const index=headers.indexOf(filterColumn);
   if(index<0)return [];
   return [...new Set(body.map(r=>r[index]).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"pt-BR")).slice(0,100);
 },[headers,body,filterColumn]);
 useEffect(()=>{
   const onChange=()=>setFullscreen(document.fullscreenElement===section.current);
   document.addEventListener("fullscreenchange",onChange);
   return ()=>document.removeEventListener("fullscreenchange",onChange);
 },[]);
 async function loadCsv(file?:File){
   if(!file)return;
   if(file.size>4_000_000){setSheetStatus("Arquivo acima de 4 MB; mantenha a exportação limitada à aba Artigos - 172.");return;}
   try{
     const cells=parseResearchCsv(await file.text());
     if(!cells[0].includes("Título original")||!cells[0].includes("Sua decisão")){
       throw Error("O arquivo não corresponde à aba Artigos - 172 da revisão. Nenhum dado foi importado.");
     }
     const nextRows=cells.slice(1);
     setSheetRows(cells);
     setSheetStatus(file.name+" · "+nextRows.length+" linhas carregadas somente na memória deste navegador");
     setFilterColumn("Sua decisão");setFilterValue("");setMode("table");
   }catch(e){setSheetStatus(e instanceof Error?e.message:"Falha ao ler CSV");}
 }
 async function full(){
   if(document.fullscreenElement===section.current){await document.exitFullscreen();setFullscreen(false);return;}
   if(fullscreen){setFullscreen(false);return;}
   setFullscreen(true);
   try{await section.current?.requestFullscreen?.();}
   catch{ /* fallback fixed overlay */ }
 }
 async function close(){
   if(document.fullscreenElement===section.current)await document.exitFullscreen();
   setFullscreen(false);onClose();
 }
 return <section ref={section} className={"sciento-sheet-panel"+(expanded||fullscreen?" expanded":"")+(fullscreen?" sciento-full":"")} aria-label="Base de artigos — Revisão Cientométrica">
   <header className="sciento-panel-header">
     <div><span className="overline">BASE DE PESQUISA · GOOGLE SHEETS PRIVADO</span><h2>Base de artigos — Revisão Cientométrica</h2>
       <p>Fonte original com 172 registros. Dados não são copiados para este repositório público.</p></div>
     <div className="sciento-panel-actions">
       <Out href={RESEARCH_SHEET}>Abrir no Google Planilhas</Out>
       <button type="button" onClick={()=>onClose()} disabled={!expanded&&!fullscreen}>Minimizar</button>
       <button type="button" onClick={full}>{fullscreen?"Sair da tela inteira":"Tela inteira"}</button>
       <button type="button" onClick={close}>{expanded||fullscreen?"Fechar ampliação":"Expandir"}</button>
     </div>
   </header>
   <div className="sciento-sheet-toolbar">
     <div className="sciento-segments">
       <button type="button" aria-pressed={mode==="google"} onClick={()=>setMode("google")}>Visualização Google</button>
       <button type="button" aria-pressed={mode==="table"} onClick={()=>setMode("table")}>Tabela pesquisável</button>
     </div>
     <div className="sciento-load-controls">
       <input ref={fileRef} type="file" accept=".csv,text/csv" className="sciento-file-input" aria-label="Importar CSV privado do Google Sheets" onChange={e=>{void loadCsv(e.target.files?.[0]);e.currentTarget.value="";}}/>
       <button type="button" onClick={()=>fileRef.current?.click()}>Carregar CSV local</button>
     </div>
   </div>
   {mode==="google"?<div className="sciento-embed-frame">
     <iframe title="Prévia autenticada da planilha cientométrica" loading="lazy" src={RESEARCH_SHEET_PREVIEW} referrerPolicy="no-referrer"/>
     <p>Esta prévia depende da autorização do Google no navegador. Se o Google impedir a incorporação, abra a planilha diretamente ou carregue uma exportação CSV local para pesquisar sem enviar dados a terceiros.</p>
   </div>:<div className="sciento-table-mode">
     {!sheetRows.length?<div className="sciento-private-empty"><h3>Nenhum registro privado foi carregado.</h3><p>Por segurança, o site público não armazena as 172 linhas. Abra a aba “Artigos - 172” no Google Sheets, exporte essa aba em CSV e use <strong>Carregar CSV local</strong>. A pesquisa ocorre apenas nesta sessão, no seu próprio navegador.</p><Out href={RESEARCH_SHEET}>Abrir base no Google Planilhas</Out></div>:<>
       <div className="sciento-table-filters">
         <label>Buscar título, autor ou palavra-chave<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Pesquise em todas as colunas..."/></label>
         <label>Filtrar campo<select aria-label="Campo de filtro da revisão" value={filterColumn} onChange={e=>{setFilterColumn(e.target.value);setFilterValue("");}}><option value="">Todos os campos</option>{headers.map((h,i)=><option key={h+"-"+i} value={h}>{h}</option>)}</select></label>
         <label>Valor<select aria-label="Valor de filtro da revisão" value={filterValue} onChange={e=>setFilterValue(e.target.value)}><option value="">Todos</option>{values.map(v=><option key={v} value={v}>{v.length>55?v.slice(0,55)+"…":v}</option>)}</select></label>
       </div>
       <div className="sciento-table-scroll" role="region" tabIndex={0} aria-label="Tabela privada de artigos; rolagem horizontal e vertical">
         <table><thead><tr>{headers.map((h,i)=><th key={h+"-"+i} scope="col">{h}</th>)}</tr></thead>
           <tbody>{visible.map((row,i)=><tr key={i}>{headers.map((h,j)=><td key={h+"-"+j} title={row[j]||""}>{row[j]||"—"}</td>)}</tr>)}</tbody></table>
         {!visible.length&&<p>Nenhum artigo corresponde aos filtros.</p>}
       </div>
       <p className="sciento-table-status" aria-live="polite">{visible.length} de {body.length} linhas exibidas. Nenhuma alteração foi enviada ao Google Sheets.</p>
     </>}
   </div>}
   <p className="sciento-panel-note" aria-live="polite">{sheetStatus} · Atualização do arquivo original: consulte o Google Sheets. Os indicadores agregados foram conferidos em {RESEARCH_AUDIT_DATE.split("-").reverse().join("/")}.</p>
 </section>;
}

function ScientometricFigures({pdfUrl,onSetPage,selectedPage}:{pdfUrl:string|null;onSetPage:(p:number|null)=>void;selectedPage:number|null}){
 const [index,setIndex]=useState(0);
 const [pageInput,setPageInput]=useState("");
 const item=DOCUMENT_FIGURES[index];
 function next(delta:number){setIndex(i=>(i+DOCUMENT_FIGURES.length+delta)%DOCUMENT_FIGURES.length);setPageInput("");onSetPage(null);}
 return <section className="sciento-results-card sciento-figures" aria-label="Carrossel de figuras do artigo">
   <div className="sciento-result-head"><span className="overline">FIGURAS DO DOCUMENTO ORIGINAL</span><h3>Carrossel de figuras</h3></div>
   <div className="sciento-figure-navigation"><button type="button" onClick={()=>next(-1)} aria-label="Figura anterior">←</button><strong>Figura {item.number} de {DOCUMENT_FIGURES.length}</strong><button type="button" onClick={()=>next(1)} aria-label="Próxima figura">→</button></div>
   <div className="sciento-figure-image">
     {pdfUrl&&selectedPage?<iframe title={"Página "+selectedPage+" do PDF privado"} src={pdfUrl+"#page="+selectedPage+"&view=FitH"}/>:<div className="sciento-figure-unavailable">
       <strong>Imagem original não publicada</strong>
       <p>As quatro figuras estão no documento científico privado. Nenhuma figura foi redesenhada, recortada por estimativa ou publicada sem confirmação do PDF e da página de origem.</p>
       <Out href={SCIENTOMETRIC_DOC}>Ver as figuras no documento original</Out>
     </div>}
   </div>
   <div className="sciento-figure-caption"><h4>{item.title}</h4><p>{item.description}</p><span>{item.origin} · Página no PDF: {selectedPage??"a confirmar"}</span></div>
   {pdfUrl&&<div className="sciento-page-locator"><label>Página desta figura no PDF carregado<input type="number" min="1" max="300" value={pageInput} onChange={e=>setPageInput(e.target.value)} placeholder="Ex.: 8"/></label><button type="button" onClick={()=>{const n=Number(pageInput);if(Number.isInteger(n)&&n>0&&n<=300)onSetPage(n)}}>Localizar no PDF</button></div>}
   <p className="sciento-figure-footnote">A numeração da figura é confirmada pelo artigo V0; a página física não foi identificada. O carregamento local do PDF permite indicar a página correta sem armazenar o documento no site.</p>
 </section>;
}
function PrivateDocument({expanded,onClose,pdfUrl,onLoadPdf,selectedPage}:{expanded:boolean;onClose:()=>void;pdfUrl:string|null;onLoadPdf:(file:File)=>void;selectedPage:number|null}){
 const [fullscreen,setFullscreen]=useState(false);
 const ref=useRef<HTMLElement>(null);
 const inp=useRef<HTMLInputElement>(null);
 const [resetKey,setResetKey]=useState(0);
 useEffect(()=>{const fn=()=>setFullscreen(document.fullscreenElement===ref.current);document.addEventListener("fullscreenchange",fn);return()=>document.removeEventListener("fullscreenchange",fn)},[]);
 async function close(){if(document.fullscreenElement===ref.current)await document.exitFullscreen();setFullscreen(false);onClose();}
 async function full(){
   if(document.fullscreenElement===ref.current){await document.exitFullscreen();setFullscreen(false);return;}
   if(fullscreen){setFullscreen(false);return;}
   setFullscreen(true);try{await ref.current?.requestFullscreen?.()}catch{}
 }
 return <section ref={ref} className={"sciento-results-card sciento-document"+(expanded||fullscreen?" expanded":"")} aria-label="Visualizador do documento da revisão">
   <div className="sciento-result-head"><span className="overline">DOCUMENTO DA REVISÃO · ACESSO RESTRITO</span><h3>{pdfUrl?"PDF local da revisão":"Artigo científico original (Google Docs)"}</h3>
    <p>{pdfUrl?"PDF selecionado permanece exclusivamente neste navegador.":"O PDF cientométrico original não foi encontrado na pasta do projeto. Esta prévia exibe o Google Doc associado, sem substituí-lo por outro PDF."}</p>
   </div>
   <div className="sciento-document-actions">
     <button type="button" disabled={!expanded&&!fullscreen} onClick={()=>{void close()}}>Minimizar</button>
     <button type="button" onClick={full}>{fullscreen?"Tela inteira ativa":"Tela inteira"}</button>
     <button type="button" onClick={onClose}>{expanded?"Reduzir":"Ampliar"}</button>
     <input ref={inp} type="file" accept=".pdf,application/pdf" className="sciento-file-input" aria-label="Carregar PDF privado da revisão" onChange={e=>{const f=e.target.files?.[0];if(f)onLoadPdf(f);e.currentTarget.value="";}}/>
     <button type="button" onClick={()=>inp.current?.click()}>Carregar PDF local</button>
   </div>
   <iframe key={resetKey+"-"+selectedPage} className="sciento-pdf-frame" title="Visualizador de documento cientométrico" loading="lazy" src={pdfUrl?pdfUrl+(selectedPage?"#page="+selectedPage:""):SCIENTOMETRIC_DOC_PREVIEW} referrerPolicy="no-referrer"/>
   <div className="sciento-document-links"><Out href={SCIENTOMETRIC_DOC}>Abrir documento principal</Out><Out href={SUPPORT_DOC}>Artigo de apoio</Out><button type="button" onClick={()=>setResetKey(x=>x+1)}>Recarregar visualizador</button></div>
 </section>;
}
export function ScientometricDashboard(){
 const [sheetExpanded,setSheetExpanded]=useState(false);
 const [pdfExpanded,setPdfExpanded]=useState(false);
 const [pdfUrl,setPdfUrl]=useState<string|null>(null);
 const [selectedPage,setSelectedPage]=useState<number|null>(null);
 const [pdfError,setPdfError]=useState("");
 useEffect(()=>()=>{if(pdfUrl)URL.revokeObjectURL(pdfUrl)},[pdfUrl]);
 useEffect(()=>{
   function onKey(e:KeyboardEvent){if(e.key==="Escape"){setSheetExpanded(false);setPdfExpanded(false);}}
   document.addEventListener("keydown",onKey);return()=>document.removeEventListener("keydown",onKey);
 },[]);
 function loadPdf(file:File){
   if(file.type!=="application/pdf"&&!file.name.toLowerCase().endsWith(".pdf")){setPdfError("Selecione um arquivo PDF.");return;}
   if(file.size>35_000_000){setPdfError("PDF maior que 35 MB. Abra o documento original no Google Drive.");return;}
   setPdfError("");
   setPdfUrl(URL.createObjectURL(file));
   setSelectedPage(null);
 }
 return <div className="study-page sciento-dashboard">
   <SectionHeading eyebrow="ESTUDO E PESQUISA / REVISÃO BIBLIOGRÁFICA" title="Revisão Cientométrica" subtitle="Dados verificados do levantamento NV + INS (Scopus e Web of Science, 05/11/2026). Triagem documental e bibliométrica descritiva; não se trata de uma avaliação experimental de navegação."/>
   <div className="sciento-source-head"><div><strong>Scopus + Web of Science Core Collection</strong><span>Acesso institucional / Portal CAPES · 3 estratégias de busca · 05/11/2026</span></div><span>Verificação dos agregados: 09/11/2026</span></div>
   <div className="sciento-metrics">{searchResults.map(m=><Metric key={m.label} {...m}/>)}</div>
   <div className="sciento-decisions"><div><h2>Decisões da planilha — etapa posterior</h2><p>Classificação sugerida dos 172 registros (não confundir com a triagem de 245 artigos).</p></div><div className="sciento-decision-list">{researcherDecisions.map(v=><span key={v.label}><strong>{v.count}</strong>{v.label}</span>)}</div></div>
   <section className="sciento-method"><div><span className="overline">MÉTODO DOCUMENTADO</span><h2>Como foi feita a revisão</h2><p>Mapeamento cientométrico exploratório e análise bibliométrica descritiva, com síntese crítica. O PRISMA 2020 é referência para transparência, não declaração de revisão sistemática integral concluída.</p></div>
    <ol>{reviewMethods.map((m,i)=><li key={m}><span>{String(i+1).padStart(2,"0")}</span><p>{m}</p></li>)}</ol>
    <p className="sciento-method-limitation"><strong>Rastreabilidade:</strong> 28 resultados de E2 na Scopus não foram exportados. A triagem integral independente e a avaliação de risco de viés ainda não foram concluídas, conforme os documentos originais.</p>
   </section>
   <PrivateSheet expanded={sheetExpanded} onClose={()=>setSheetExpanded(v=>!v)}/>
   <section className="sciento-search-strategies"><div className="sciento-section-head"><span className="overline">ESTRATÉGIAS REPRODUTÍVEIS</span><h2>Estratégias e Equações de Busca</h2><p>Expressões transcritas dos documentos científicos. A consulta simples utilizou apenas a expressão booleana; em modo avançado, usar TITLE-ABS-KEY(...) na Scopus e TS=(...) na Web of Science.</p></div>
     <div className="sciento-equations">{SEARCH_EQUATIONS.map(eq=><article key={eq.id} className="sciento-equation">
       <div className="sciento-equation-head"><span>{eq.id}</span><div><h3>{eq.title}</h3><small>{eq.bases} · Scopus {eq.scopusHits} exibidos ({eq.scopusExported} exportados) · WoS {eq.wosHits} exibidos</small></div></div>
       <pre><code>{eq.expression}</code></pre>
       <div className="sciento-equation-keywords">{eq.keywords.map(k=><span key={k}>{k}</span>)}</div>
       <p>{eq.explanation}</p><div className="sciento-equation-foot"><span>Operadores booleanos: AND · OR; agrupamento por parênteses</span><CopyEquation expression={eq.expression}/></div>
     </article>)}</div>
     <p className="sciento-strategy-note">Consultas exploratórias amplas E2 e E3 produziram 1.974 e 2.799 resultados na Scopus, respectivamente. Esses registros não integram os 447 resultados finais e não foram misturados com o corpus analisado.</p>
   </section>
   <section className="sciento-results"><div className="sciento-section-head"><span className="overline">RESULTADOS DOCUMENTAIS</span><h2>Resultados Cientométricos</h2><p>Figuras e documento técnico lado a lado. O documento permanece no Google Drive com as permissões originais; para um PDF local, selecione o arquivo no navegador, sem enviá-lo ao GitHub.</p></div>
     <div className="sciento-results-grid">
       <ScientometricFigures pdfUrl={pdfUrl} onSetPage={setSelectedPage} selectedPage={selectedPage}/>
       <PrivateDocument expanded={pdfExpanded} onClose={()=>setPdfExpanded(v=>!v)} pdfUrl={pdfUrl} onLoadPdf={loadPdf} selectedPage={selectedPage}/>
     </div>
     {pdfError&&<p role="alert" className="sciento-error">{pdfError}</p>}
     <p className="sciento-privacy"><strong>Privacidade:</strong> nenhum registro da planilha, texto integral do artigo ou PDF é gravado em arquivos públicos. O CSV e o PDF selecionados localmente permanecem somente na memória deste navegador. Não alteramos compartilhamento no Google Drive.</p>
   </section>
 </div>;
}
export function PatentReviewPlaceholder(){
 return <div className="study-page sciento-patents"><SectionHeading eyebrow="ESTUDO / REVISÃO BIBLIOGRÁFICA" title="Revisão de Patentes" subtitle="Área reservada ao futuro mapeamento de patentes pertinentes à magnetometria NV e navegação inercial."/>
  <div className="future-lab-panel"><div className="future-lab-mark" aria-hidden="true">IP</div><div className="future-lab-copy"><span className="future-lab-status">EM BREVE · IMPLEMENTAÇÃO FUTURA</span><h2>Pesquisa patentária ainda não iniciada nesta plataforma</h2><p>Serão definidos bases, jurisdições, classificações, critérios de deduplicação, estratégia de busca e procedimentos de análise de anterioridade. Nenhum resultado ou titular de patente foi inventado.</p></div></div>
 </div>;
}
