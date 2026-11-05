import {mkdir,writeFile,stat} from 'node:fs/promises';
import {resolve} from 'node:path';
import sharp from 'sharp';
import {CARRIER_LOGOS} from '../src/logos.mjs';

await mkdir(resolve('assets/carriers'),{recursive:true});
const entries=Object.entries(CARRIER_LOGOS), failures=[], success=[];
async function retrieve(id,logo){
 const target=resolve('assets/carriers',id+'.png');
 let last;
 const sources=[logo.source,logo.source,...(logo.fallbackSources||[])];
 for(const url of sources){
  try{
   const res=await fetch(url,{headers:{'User-Agent':'APN-Atlas-VN/1.2 (+https://github.com/danhthanh4182/apn-atlas-vn)','Accept':'image/avif,image/webp,image/png,image/jpeg,image/svg+xml,*/*;q=0.8'},signal:AbortSignal.timeout(30000)});
   if(!res.ok)throw Error('HTTP '+res.status);
   if(Number(res.headers.get('content-length')||0)>5000000)throw Error('Image too large');
   if((res.headers.get('content-type')||'').includes('text/html'))throw Error('Unexpected HTML response');
   const bytes=Buffer.from(await res.arrayBuffer());
   if(bytes.length>5000000||bytes.length<100)throw Error('Invalid image size');
   let image=sharp(bytes,{limitInputPixels:60000000});
   const meta=await image.metadata();
   if(!['svg','jpeg','png','webp','gif','avif'].includes(meta.format))throw Error('Unsupported image format: '+meta.format);
   if(logo.crop){
    const {left,top,width,height}=logo.crop,w=meta.width,h=meta.height;
    image=image.extract({left:Math.floor(w*left),top:Math.floor(h*top),width:Math.max(1,Math.floor(w*width)),height:Math.max(1,Math.floor(h*height))});
   }
   const png=await image.flatten({background:'#fff'}).trim({threshold:12}).resize(240,120,{fit:'contain',background:'#fff'}).png({compressionLevel:9}).toBuffer();
   await writeFile(target,png);
   success.push({id,size:(await stat(target)).size});
   return;
  }catch(e){last=e;}
 }
 failures.push({id,reason:String(last?.message||last)});
}
for(let i=0;i<entries.length;i+=3)await Promise.all(entries.slice(i,i+3).map(([id,logo])=>retrieve(id,logo)));
console.log(JSON.stringify({saved:success,failed:failures},null,2));
if(process.env.LOGOS_REQUIRED==='1'&&failures.length)process.exitCode=1;
