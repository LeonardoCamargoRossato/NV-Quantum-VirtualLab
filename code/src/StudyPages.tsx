import {InteractiveImage} from "./InteractiveImage";
import React, { useState } from "react";
import { safeUrl } from "./Inventory";
import type { ReferenceContext } from "./ContextInspector";
const source = "https://github.com/QuantumVillage/UncutGem";
const paper = "https://arxiv.org/abs/2509.18329";
const pdf = "https://arxiv.org/pdf/2509.18329";
const springer = "https://link.springer.com/chapter/10.1007/978-3-032-13852-1_7";
const stegemann = "https://doi.org/10.1088/1361-6404/acbe7c";
const frellsen = "https://doi.org/10.22331/qv-2018-07-17-10";
const reviewSheet = "https://docs.google.com/spreadsheets/d/1ID0MHrg_-2Fx37vGR8SMhoILLs6E8WR8CnMV4mlf734/edit";
export function Out({ href, children, className = "" }: {href: string; children: React.ReactNode; className?: string}) {
  return safeUrl(href) ? <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}<span aria-hidden="true"> ↗</span></a> : null;
}
export type Page = "explorar" | "inventario" | "fluxo" | "guia" | "uncut-v2" | "modelo3d" | "fundamentos" | "artigos" | "revisao" | "patentes" | "referencias" | "sobre";
export const pageTitles: Record<Page, string> = {
  explorar: "Explorar", inventario: "Inventário", fluxo: "Entenda o Fluxo", guia: "Guia de montagem",
  "uncut-v2": "Uncut Gem V2", modelo3d: "NV-Print 3D Stegemann",
  fundamentos: "Fundamentos", artigos: "Artigos", revisao: "Revisão Cientométrica", patentes: "Revisão de Patentes", referencias: "Referências Diretas Virtual Lab", sobre: "Sobre o Projeto",
};
export const navigationGroups: {group:string; pages: {key:Page; icon:string}[]}[] = [
  { group:"LABORATÓRIO", pages:[{key:"explorar",icon:"◉"},{key:"inventario",icon:"▤"},{key:"fluxo",icon:"⇢"},{key:"guia",icon:"⌁"}] },
  { group:"ESTUDO E PESQUISA", pages:[{key:"referencias",icon:"↗"},{key:"fundamentos",icon:"◇"},{key:"sobre",icon:"ⓘ"}] },
];
const articles = [
  {title:"Uncut Gem — An Open-Source Hackable Quantum Sensor",authors:"Mark Carney; Victoria Kumaran",year:"2025 / 2026", type:"Preprint livre + capítulo de conferência",url:paper,pdf,doi:"10.1007/978-3-032-13852-1_7",notes:"Hardware aberto de magnetometria com centros NV; a versão Springer é acesso por assinatura."},
  {title:"Modular low-cost 3D printed setup for experiments with NV centers in diamond",authors:"Jan Stegemann et al.",year:"2023",type:"Artigo acadêmico aberto",url:stegemann,pdf:"https://quantumvillage.org/resources/Stegemann_2023_Eur._J._Phys._44_035402.pdf",doi:"10.1088/1361-6404/acbe7c",notes:"Plataforma óptica didática modular. Não é a lista de materiais da Uncut Gem V1."},
  {title:"Sensing magnetic fields with diamonds and green laser light",authors:"Louise F. Frellsen; Sepehr Ahmadi",year:"2018",type:"Artigo didático aberto",url:frellsen,pdf:"https://quantumvillage.org/resources/Sensing%20magnetic%20fields%20with%20diamonds%20and%20green%20laser%20light%20%E2%80%93%20Quantum.pdf",doi:"10.22331/qv-2018-07-17-10",notes:"Introdução aos centros NV e à detecção óptica, com configuração distinta da Uncut Gem."},
];
export function SectionHeading({eyebrow, title, subtitle}: {eyebrow:string; title:string; subtitle:string}) {
  return <div className="section-heading"><span className="overline">{eyebrow}</span><h1>{title}</h1><p>{subtitle}</p></div>;
}
export function Guide({base, onMedia}:{base:string; onMedia:(url:string,label:string)=>void}) {
  const steps=[
    {number:"01",heading:"PCB, componentes passivos e alimentação",detail:"Identifique os soquetes, componentes da PCB e interfaces de alimentação. Confira o esquema e a pinagem antes de soldar ou energizar; a foto geral não é mapa de footprints."},
    {number:"02",heading:"ESP32, RF e conexões",detail:"O guia do Uncut Gem V1 documenta módulos ESP32, ADF4351, amplificador RF e cabo SMA. Compare conectores e orientação no guia original antes de montar."},
    {number:"03",heading:"Prisma óptico e diamante NV",detail:"Montagem em camadas: diamante e laço de cobre esmaltado; resina de encapsulamento; filtro vermelho e fotodiodo BPW34. Os diagramas são esquemáticos, fora de escala."},
    {number:"04",heading:"Laser, OLED e testes",detail:"Confira o circuito do laser e a orientação do OLED, especialmente VDD/GND. O fotodiodo BPW34 está no prisma; PHOTODIODE1 é o conector na placa."},
  ];
  return <div className="study-page">
    <SectionHeading eyebrow="LABORATÓRIO / MONTAGEM" title="Guia de montagem" subtitle="Leitura orientada do projeto Quantum Village. As etapas são referências didáticas, não instruções certificadas de soldagem."/>
    <div className="action-strip"><Out href={source+"/blob/main/BuildGuide/BuildGuide.md"}>Abrir guia oficial completo</Out><Out href={source+"/blob/main/hardware/PCB/README.md"}>PCB e esquemáticos</Out><Out href={source+"/blob/main/hardware/DiamondMount/README.md"}>Conjunto óptico</Out></div>
    <div className="step-stack">{steps.map(s=><section className="study-step" key={s.number}><span className="step-no">{s.number}</span><div><h2>{s.heading}</h2><p>{s.detail}</p></div></section>)}</div>
    <h2 className="section-subtitle">Três camadas do prisma — diagramas oficiais</h2>
    <div className="layer-grid">{[1,2,3].map(n=><figure key={n}><button className="image-action" aria-label={"Ampliar diagrama da camada "+n} onClick={()=>onMedia(base+"assets/official/Layer"+n+".png","Diagrama oficial — camada "+n)}><img src={base+"assets/official/Layer"+n+".png"} alt={"Diagrama de montagem da camada "+n}/></button><figcaption>Diagrama Quantum Village · Camada {n}</figcaption></figure>)}</div>
    <div className="safety-note"><strong>Segurança</strong> Nunca direcione o laser aos olhos ou a superfícies refletivas. Inspecione curtos e alimentação antes de energizar. Confirme pinagem do OLED e tensão/variante TL082. Consulte as recomendações <Out href={source+"/blob/main/SAFETY.md"}>oficiais de segurança</Out>.</div>
  </div>;
}
const basics = [
  {tag:"01",title:"Centros NV e spin",detail:"Um defeito de nitrogênio adjacente a uma vacância na rede do diamante possui níveis eletrônicos sensíveis ao campo magnético; diferenças de energia dependem do estado de spin.",ref:paper},
  {tag:"02",title:"Excitação óptica verde",detail:"Um laser verde excita os centros NV. O ciclo óptico e as transições entre estados sustentam o contraste dependente do spin.",ref:frellsen},
  {tag:"03",title:"Micro-ondas e ressonância",detail:"Micro-ondas promovem transições de spin. A varredura de frequência pode revelar ressonâncias cuja posição depende do campo magnético.",ref:paper},
  {tag:"04",title:"Fluorescência vermelha",detail:"O conjunto óptico recolhe a emissão, usa um filtro para atenuar luz verde e entrega o sinal ao BPW34 encapsulado no prisma.",ref:source+"/blob/main/hardware/DiamondMount/README.md"},
  {tag:"05",title:"Fotodetecção e amplificação",detail:"O fotodiodo converte luz em corrente elétrica; a eletrônica analógica amplifica e adapta esse sinal para aquisição.",ref:source+"/blob/main/hardware/PCB/README.md"},
  {tag:"06",title:"ESP32, OLED e leitura ODMR",detail:"O controlador coordena a aquisição e a apresentação das leituras; a curva ODMR é uma medida experimental, não uma animação implementada nesta versão.",ref:source+"/blob/main/firmware/src/uncut-gem.ino"},
];
export function Fundamentals() {
  return <div className="study-page"><SectionHeading eyebrow="ESTUDO / TEORIA" title="Fundamentos" subtitle="Do defeito na estrutura cristalina até o sinal detectado pelo hardware. Conteúdo conceitual, sem simulação."/>
    <div className="fundamentals-grid">{basics.map(s=><article key={s.tag} className="fundamental"><span className="step-no">{s.tag}</span><h2>{s.title}</h2><p>{s.detail}</p><Out href={s.ref}>Fonte de estudo</Out></article>)}</div>
    <div className="roadmap-note">Próximas etapas de pesquisa: fluxo matemático, equações de leitura ODMR e magnetometria quantitativa — <strong>não implementadas nesta plataforma</strong>.</div>
  </div>;
}
export function Articles() {
  const [search,setSearch]=useState("");
  const matches=articles.filter(x=>(x.title+" "+x.authors+" "+x.year).toLocaleLowerCase("pt-BR").includes(search.toLocaleLowerCase("pt-BR")));
  return <div className="study-page"><SectionHeading eyebrow="ESTUDO / PUBLICAÇÕES" title="Artigos" subtitle="Seleção inicial de fontes científicas verificadas e links públicos. Não inclui PDFs fechados nem dados privados."/>
    <label className="library-search">Pesquisar título, autor ou ano<input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Ex.: Uncut Gem, Stegemann, NV"/></label>
    <p className="results-count" aria-live="polite">{matches.length} de {articles.length} publicações</p>
    <div className="article-list">{matches.map(x=><article key={x.title} className="paper-card"><div><span className="paper-type">{x.type} · {x.year}</span><h2>{x.title}</h2><p className="paper-authors">{x.authors}</p><p>{x.notes}</p><p className="doi">DOI: {x.doi}</p></div><div className="paper-actions"><Out href={x.url}>Publicação</Out><Out href={x.pdf}>PDF disponível</Out></div></article>)}</div>
    {!matches.length&&<p className="empty-hint">Nenhuma publicação corresponde à pesquisa.</p>}
  </div>;
}
export function Literature() {
  return <div className="study-page"><SectionHeading eyebrow="ESTUDO / MÉTODO" title="Revisão Bibliográfica" subtitle="Área destinada à organização metodológica da pesquisa de doutorado sobre NV e INS, separada das fontes de montagem do Uncut Gem."/>
    <div className="review-layout"><section className="research-panel"><span className="paper-type">BASE DE TRABALHO · ACESSO RESTRITO</span><h2>Doutorado ITA — Revisão NV + INS</h2><p>A planilha de pesquisa inclui as abas “Artigos - 172”, “Resumo e critérios” e “Artigos que preciso ler”. O título e a organização da base são apresentados apenas como metadados: seus registros e análises não foram publicados neste site.</p><Out href={reviewSheet}>Abrir base original no Google Sheets</Out><p className="muted-note">Acesso sujeito às permissões do proprietário. Nenhuma permissão de compartilhamento foi alterada.</p></section>
    <section className="research-panel"><span className="paper-type">ESTRUTURA METODOLÓGICA</span><h2>Como a revisão será organizada</h2><ol className="research-method"><li>Definir questão de pesquisa e critérios de inclusão/exclusão.</li><li>Registrar bases e estratégias de busca, incluindo Scopus e Web of Science quando documentadas.</li><li>Remover duplicatas, selecionar e classificar os trabalhos por relevância.</li><li>Sistematizar lacunas, questões metodológicas e evidências citáveis.</li></ol><p className="muted-note">Esse fluxo é uma estrutura de trabalho, não estatística de uma análise executada nesta página.</p></section></div>
    <div className="roadmap-note">As referências de hardware ficam na aba <strong>Referências Diretas Virtual Lab</strong>; a revisão científica só receberá registros detalhados após seleção e autorização para divulgação.</div>
  </div>;
}
export function References({base,onInspect}:{base:string;onInspect?:(reference:ReferenceContext,trigger:HTMLElement)=>void}) {
  const primary:ReferenceContext = {
    id:"uncut-gem",title:"Uncut Gem — Quantum Village",
    description:"Hardware aberto para magnetometria com centros NV. A publicação aberta, o projeto original, o código-fonte e o capítulo Springer são fontes distintas.",
    origin:"Quantum Village / arXiv / Springer",
    links:[{label:"Preprint PDF",url:pdf},{label:"Site do projeto",url:"https://quantumvillage.org/uncut-gem.html"},{label:"Repositório oficial",url:source},{label:"Capítulo Springer (acesso por assinatura)",url:springer}],
  };
  return <div className="study-page references-page"><SectionHeading eyebrow="PESQUISA / FONTES" title="Referências Diretas Virtual Lab" subtitle="Fontes oficiais do hardware, publicações abertas e trabalhos relacionados. Cada recurso é identificado pela sua procedência."/>
    <div className="feature-head"><div><span className="paper-type">PROJETO PRINCIPAL · HARDWARE ABERTO</span><h2>Uncut Gem — Quantum Village</h2><p>Magnetômetro didático com centros NV baseado em componentes comerciais e firmware aberto. Implementação deste laboratório é um estudo acadêmico independente.</p></div><div className="reference-actions"><button type="button" onClick={e=>onInspect?.(primary,e.currentTarget)}>Inspecionar referência</button><Out href={source}>Projeto no GitHub</Out></div></div>
    <div className="reference-triptych">
      <article className="preview-card"><div className="preview-head"><span>01 / PREPRINT</span><strong>Artigo científico</strong></div><div className="pdf-preview"><iframe loading="lazy" title="PDF aberto do artigo Uncut Gem no arXiv" src={pdf+"#view=FitH"} referrerPolicy="no-referrer" /><div className="embed-notice">O PDF do arXiv pode bloquear incorporação neste navegador. Utilize o link abaixo caso não apareça.</div></div><div className="preview-info"><h3>Uncut Gem — An Open-Source Hackable Quantum Sensor</h3><p>Mark Carney e Victoria Kumaran · arXiv:2509.18329 (2025)</p><Out href={pdf}>Abrir PDF livre</Out> <Out href={paper}>Ver registro arXiv</Out></div></article>
      <article className="preview-card"><div className="preview-head"><span>02 / FONTE ORIGINAL</span><strong>Site oficial</strong></div><div className="real-photo"><InteractiveImage src={base+"assets/official/DeviceV1.png"} alt="Fotografia oficial da montagem Uncut Gem V1 por Quantum Village" loading="lazy"/><small>Fotografia oficial do projeto, não captura do site</small></div><div className="preview-info"><h3>Quantum Village / Uncut Gem</h3><p>Descrição técnica, ciência, hardware e guia de montagem do Uncut Gem V1. A página externa não é reproduzida aqui.</p><Out href="https://quantumvillage.org/uncut-gem.html">Abrir site oficial</Out></div></article>
      <article className="preview-card"><div className="preview-head"><span>03 / CÓDIGO ABERTO</span><strong>Repositório GitHub</strong></div><div className="github-metadata"><div className="repo-symbol" aria-hidden="true">⌘</div><p>QuantumVillage / <strong>UncutGem</strong></p><p>Projeto público · documentação, hardware, firmware e guias</p><p>Licença declarada no repositório: AGPL-3.0</p></div><div className="preview-info"><h3>Código-fonte da montagem Uncut Gem V1</h3><p>Fonte primária para montagem e arquivos de engenharia. Não é uma captura de tela do GitHub.</p><Out href={source}>Abrir repositório</Out></div></article>
    </div>
    <section className="reference-springer"><div><span className="paper-type">PUBLICAÇÃO DE CONFERÊNCIA · 21 FEVEREIRO 2026</span><h2>Versão Springer</h2><p>Mark Carney e Victoria Kumaran · <em>Quantum Engineering Sciences and Technologies for Industry and Services</em> · páginas 55–64.</p><p>DOI: 10.1007/978-3-032-13852-1_7 · <strong>Acesso por assinatura</strong>. O visualizador acima utiliza somente o preprint aberto do arXiv.</p></div><Out href={springer}>Ver capítulo Springer</Out></section>
    <h2 className="section-subtitle">Fontes e estudos relacionados</h2>
    <div className="reference-links">
      <div><span className="paper-type">MANUAL OFICIAL</span><h3>Quantum Village — BuildGuide V1</h3><p>Montagem e advertências de segurança.</p><Out href={source+"/blob/main/BuildGuide/BuildGuide.md"}>Ver guia</Out></div>
      <div><span className="paper-type">HARDWARE</span><h3>PCB, DiamondMount e firmware</h3><p>Documentação de hardware e código original.</p><Out href={source+"/blob/main/hardware/PCB/README.md"}>PCB</Out> · <Out href={source+"/blob/main/hardware/DiamondMount/README.md"}>Prisma</Out> · <Out href={source+"/tree/main/firmware"}>Firmware</Out></div>
      <div><span className="paper-type">ESTUDO RELACIONADO · 2023</span><h3>Stegemann et al.</h3><p>Plataforma modular didática com centros NV, distinta da lista de materiais do Uncut Gem V1.</p><Out href={stegemann}>Ver publicação</Out></div>
      <div><span className="paper-type">REFERÊNCIA DIDÁTICA · 2018</span><h3>Frellsen e Ahmadi</h3><p>Introdução à detecção com diamantes e laser verde.</p><Out href={frellsen}>Ver artigo</Out></div>
    </div>
    <div className="roadmap-note"><strong>Linhas futuras — não implementadas:</strong> fluxo matemático e equações, magnetometria ODMR, visualização 3D e análise documental de hardware futuras versões do hardware.</div>
  </div>;
}
