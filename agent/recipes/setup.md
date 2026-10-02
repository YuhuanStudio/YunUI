# Compiler and consumer setup

Use the host's existing framework. Install React 19, React DOM 19 and Tailwind
CSS v4 alongside YunUI. Initialize the actual consumer project after installing
the package; `init` adds guidance and styles, not a new framework or backend.

```sh
yunui init --css src/app/globals.css
yunui doctor --strict
```

For Next.js/PostCSS, use the Tailwind v4 PostCSS package:

```js
export default { plugins: { "@tailwindcss/postcss": {} } };
```

For Vite, use `@tailwindcss/vite` in the existing Vite plugin list alongside the
React plugin. Serving CSS with unprocessed `@theme`, `@utility` or `@source`
directives leaves components unstyled even when the imports are correct.

The global CSS imports `tailwindcss` first, followed by the initialized
`.yunui/setup.css`. That file imports the installed module's `/css` and computes
the `@source` path relative to itself. With an existing alias named `yunui`,
imports are `yunui/css` and `yunui/...`; do not address a scoped path that isn't
installed. Use `yunui info` to see that project's actual bindings.

If the app imports `@yuhuanowo/yunui/content`, install the renderer peers listed
in the Content documentation even though YunUI marks them optional in package
metadata: the barrel statically imports React Markdown, its plugins, KaTeX and
Shiki core. Mermaid is needed only when rendering Mermaid charts. Import the
installed module's `/content.css`, and add `katex/dist/katex.min.css` when using
math. Keep these imports in the active app stylesheet/entry, not an unused
example file. `yunui doctor` checks stylesheet wiring, not peer resolution;
verify module resolution with the host build.

Geist and the monospace face are loaded by the host. In Next.js use its font
loader and apply its CSS variables at the app root. In other hosts use licensed
font files or an explicit font provider. For exact YunUI appearance, verify the
computed font as well as tokens; a missing font is not a reason to recreate UI.

Run a real host build and inspect rendered components after `doctor` and
`audit`. Static integration checks cannot prove the bundler emitted the CSS or
that every product state is correct.
