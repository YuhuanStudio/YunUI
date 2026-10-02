import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root=dirname(fileURLToPath(import.meta.url));
const server=createServer(async(req,res)=>{
 const path=new URL(req.url??'/', 'http://localhost').pathname;
 const names={'/':'index.html','/bundle.js':'bundle.js','/d3.css':'d3.css','/layout.css':'layout.css','/upstream.css':'upstream.css','/LICENSE':'LICENSE','/capture-review.mjs':'capture-review.mjs'};
 const name=names[path];
 if(!name){res.writeHead(404,{'content-type':'text/plain'});res.end('Not found');return}
 try{const body=await readFile(join(root,name));const type=name.endsWith('.js')||name.endsWith('.mjs')?'text/javascript; charset=utf-8':name.endsWith('.css')?'text/css; charset=utf-8':name.endsWith('.html')?'text/html; charset=utf-8':'text/plain; charset=utf-8';res.writeHead(200,{'content-type':type,'cache-control':'no-store'});res.end(body)}catch(e){res.writeHead(503,{'content-type':'text/plain'});res.end(e.message)}
});
server.listen(3943,'127.0.0.1',()=>console.log('D3 Beautiful UI ported prototype at http://localhost:3943'));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>process.exit(0)));
