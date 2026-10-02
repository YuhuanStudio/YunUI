import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root=dirname(fileURLToPath(import.meta.url));
const files={'/':'label-fixture.html','/label-bundle.js':'label-bundle.js','/d3.css':'d3.css','/layout.css':'layout.css'};
createServer(async(req,res)=>{const name=files[new URL(req.url??'/', 'http://localhost').pathname];if(!name){res.writeHead(404);res.end('Not found');return}try{const body=await readFile(join(root,name));const type=name.endsWith('.js')?'text/javascript; charset=utf-8':name.endsWith('.css')?'text/css; charset=utf-8':'text/html; charset=utf-8';res.writeHead(200,{'content-type':type,'cache-control':'no-store'});res.end(body)}catch(error){res.writeHead(503);res.end(error.message)}}).listen(3944,'127.0.0.1',()=>console.log('Label override fixture at http://localhost:3944'));
