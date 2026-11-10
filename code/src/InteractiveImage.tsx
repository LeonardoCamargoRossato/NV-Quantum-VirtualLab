import {createContext,useContext,type ImgHTMLAttributes} from 'react';
import type {ViewerImage} from './ImageViewer';
export const ImageOpeningContext=createContext<(image:ViewerImage)=>void>(()=>{throw new Error('InteractiveImage requires ImageOpeningContext')});
/** Default for all new image content: keyboard accessible and opens the shared viewer. */
export function InteractiveImage({src,alt,...props}:ImgHTMLAttributes<HTMLImageElement>&{src:string;alt:string}){
 const open=useContext(ImageOpeningContext);
 return <button type="button" className="image-trigger" aria-label={'Ampliar '+alt} onClick={()=>open({url:src,title:alt})}><img src={src} alt={alt} {...props}/></button>;
}
