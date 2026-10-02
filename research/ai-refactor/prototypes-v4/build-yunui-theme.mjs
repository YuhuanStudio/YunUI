import postcss from '../../../node_modules/.pnpm/postcss@8.5.25/node_modules/postcss/lib/postcss.mjs';
import { readFile, writeFile } from 'node:fs/promises';
const source = postcss.parse(await readFile(new URL('../../../styles/yunui.css', import.meta.url), 'utf8'));
const targetSelectors = new Set([':root', '.dark', '[data-theme="dark"]', '.true-black', '[data-theme="true-black"]']);
const tokenNames = new Set(['--bg-base','--bg-elevated','--bg-glass','--bg-glass-hover','--bg-card','--border-hairline','--border-subtle','--border-default','--border-strong','--text-primary','--text-secondary','--text-tertiary','--text-muted','--accent','--accent-subtle','--accent-muted','--bg-hover','--bg-muted','--success','--warning','--error','--info','--shadow-xs','--shadow-sm','--shadow-md','--shadow-lg']);
const rules = [];
function visit(nodes) {
  for (const node of nodes ?? []) {
    if (node.type === 'rule') {
      const selectors = node.selector.split(',').map((selector) => selector.trim());
      const matched = selectors.filter((selector) => targetSelectors.has(selector));
      const declarations = node.nodes?.filter((child) => child.type === 'decl' && tokenNames.has(child.prop)) ?? [];
      if (matched.length && declarations.length) rules.push(`${matched.join(', ')} {\n${declarations.map((declaration) => `  ${declaration.prop}: ${declaration.value};`).join('\n')}\n}`);
    }
    if (node.nodes) visit(node.nodes);
  }
}
visit(source.nodes);
await writeFile(new URL('./yunui-theme.css', import.meta.url), `/* Derived role-token subset from styles/yunui.css; no YunUI component styles are loaded. */\n${rules.join('\n\n')}\n`);
