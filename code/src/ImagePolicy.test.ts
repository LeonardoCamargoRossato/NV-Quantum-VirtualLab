import {expect,it} from 'vitest';
import ts from 'typescript';
/** Keep future content images on the shared interactive path (also enforced in CI). */
function unhandledImages(text:string,file:string){
 const tree=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 const problems:number[]=[];
 function visit(node:ts.Node){
  if(ts.isJsxSelfClosingElement(node)&&node.tagName.getText(tree)==='img'){
   let handled=false;
   for(let parent=node.parent;parent;parent=parent.parent){
    if(ts.isJsxElement(parent)){
     const open=parent.openingElement,tag=open.tagName.getText(tree);
     if(tag==='button'||open.attributes.properties.some(p=>ts.isJsxAttribute(p)&&p.name.getText(tree)==='data-image-viewport'))handled=true;
     // Crop uses an accessible dynamic button/div; its caller controls interactivity.
     if(file.endsWith('/Workbench.tsx')&&tag==='Element')handled=true;
    }
   }
   if(!handled)problems.push(tree.getLineAndCharacterOfPosition(node.getStart()).line+1);
  }
  ts.forEachChild(node,visit);
 }
 visit(tree);return problems;
}
it('routes every content image through an accessible trigger or an interactive viewport',()=>{
 const sources=import.meta.glob<string>('./**/*.tsx',{query:'?raw',import:'default',eager:true});
 const failures=Object.entries(sources).flatMap(([file,text])=>unhandledImages(text,file).map(line=>file+':'+line));
 expect(failures,'Use InteractiveImage, a shared viewer trigger or data-image-viewport for new images').toEqual([]);
});
it('catches a future bare image but accepts a keyboard-accessible image button',()=>{
 expect(unhandledImages('const X=()=> <figure><img src="x"/></figure>','/Future.tsx')).toEqual([1]);
 expect(unhandledImages('const X=()=> <button><img src="x"/></button>','/Future.tsx')).toEqual([]);
});
