/**
 * CSV reader for a private spreadsheet export selected in the user's own browser.
 * Files are never uploaded, persisted or tracked.
 */
export function parseResearchCsv(raw:string):string[][]{
 const text=raw.replace(/^\uFEFF/,"").replace(/\r\n?/g,"\n");
 // Excel/Google Sheets use comma CSV; semicolon is accepted for regional exports.
 const head=text.slice(0,Math.max(0,text.indexOf("\n"))||text.length);
 const sep=(head.match(/;/g)||[]).length>(head.match(/,/g)||[]).length?";":",";
 const rows:string[][]=[];let row:string[]=[],field="",quoted=false;
 for(let i=0;i<text.length;i++){
   const c=text[i];
   if(c==='"'){
     if(quoted&&text[i+1]==='"'){field+='"';i++;}
     else if(quoted){quoted=false;}
     else if(!field){quoted=true;}
     else field+=c;
   }else if(c===sep&&!quoted){row.push(field);field="";}
   else if(c==="\n"&&!quoted){row.push(field);if(row.some(v=>v.trim()!==""))rows.push(row);row=[];field="";}
   else field+=c;
 }
 if(quoted)throw Error("O CSV contém aspas não fechadas.");
 row.push(field);if(row.some(v=>v.trim()!==""))rows.push(row);
 if(!rows.length)throw Error("CSV vazio.");
 if(rows.length>3000||rows[0].length>50)throw Error("O arquivo está fora do limite esperado da revisão (até 3000 linhas e 50 colunas).");
 return rows;
}
export function filterResearchRows(headers:string[],rows:string[][],query:string,filterColumn:string,filterValue:string){
 const q=query.trim().toLocaleLowerCase("pt-BR");
 const ci=headers.indexOf(filterColumn);
 return rows.filter(row=>(!q||row.some(v=>v.toLocaleLowerCase("pt-BR").includes(q)))&&(ci<0||!filterValue||row[ci]===filterValue));
}
