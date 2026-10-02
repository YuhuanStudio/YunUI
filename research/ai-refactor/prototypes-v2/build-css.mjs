import postcss from '../../../node_modules/.pnpm/postcss@8.5.25/node_modules/postcss/lib/postcss.mjs';
import tailwind from '../../../site/node_modules/@tailwindcss/postcss/dist/index.mjs';
import { readFile, writeFile } from 'node:fs/promises';
const input = new URL('./upstream.css', import.meta.url);
const css = await readFile(input, 'utf8');
const output = await postcss([tailwind()]).process(css, { from: input.pathname, to: new URL('./d3.css', import.meta.url).pathname });
await writeFile(new URL('./d3.css', import.meta.url), output.css);
console.log(`Generated Beautiful UI source styles (${output.css.length} bytes)`);
