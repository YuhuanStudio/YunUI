import { createServer } from 'node:http';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root=dirname(fileURLToPath(import.meta.url));
const siteStatic=join(root,'../../../site/.next/static');
const files={'/':'index.html','/bundle.js':'bundle.js','/favicon.ico':null};
const server=createServer(async(req,res)=>{
 const path=new URL(req.url??'/', 'http://localhost').pathname;
 if(path==='/favicon.ico'){res.writeHead(204);res.end();return}
 if(path==='/fixture.css'){
  try{
   const names=(await readdir(join(siteStatic,'chunks'))).filter(file=>file.endsWith('.css')).sort();
   if(!names.length)throw new Error('No compiled yunui-site CSS chunks found. Build site before running this fixture.');
   const chunks=await Promise.all(names.map(file=>readFile(join(siteStatic,'chunks',file),'utf8')));
   const css=chunks.join('\n').replace(/@import[^;]*fonts\.googleapis\.com[^;]*;/g,'').replace(/url\(\.\.\/media\/([^)]*)\)/g,'url(/site-media/$1)');
   res.writeHead(200,{'content-type':'text/css; charset=utf-8','cache-control':'no-store'});res.end(css);
  }catch(error){res.writeHead(503,{'content-type':'text/plain; charset=utf-8'});res.end(error.message)}return;
 }
 if(path.startsWith('/site-media/')){
  const name=decodeURIComponent(path.slice('/site-media/'.length));
  if(!/^[\w.-]+$/.test(name)){res.writeHead(400);res.end('Invalid media filename');return}
  try{const body=await readFile(join(siteStatic,'media',name));const contentType=name.endsWith('.woff2')?'font/woff2':name.endsWith('.woff')?'font/woff':name.endsWith('.ttf')?'font/ttf':name.endsWith('.svg')?'image/svg+xml':'application/octet-stream';res.writeHead(200,{'content-type':contentType,'cache-control':'no-store'});res.end(body)}catch(error){res.writeHead(503);res.end(error.message)}return;
 }
 const name=files[path];if(!name){res.writeHead(404);res.end('Not found');return}
 try{const body=await readFile(join(root,name));const contentType=name.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8';res.writeHead(200,{'content-type':contentType,'cache-control':'no-store'});res.end(body)}catch(error){res.writeHead(503);res.end(error.message)}
});
server.listen(3945,'127.0.0.1',()=>console.log('AI runtime regression fixture at http://localhost:3945'));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>process.exit(0)));
