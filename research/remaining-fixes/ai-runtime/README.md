# AI runtime regression fixture

This isolated fixture is for the existing YunUI AI/chat runtime fixes. It imports the public `@yuhuanowo/yunui/ai` and `/chat` entrypoints and keeps every callback counter local to the browser.

Do not build the bundle against an old `dist/`. After the root agent reports that the source fixes, package build, and site build are complete, compile and run:

```sh
./node_modules/.bin/esbuild research/remaining-fixes/ai-runtime/entry.tsx --bundle --format=esm --target=es2022 --outfile=research/remaining-fixes/ai-runtime/bundle.js
node research/remaining-fixes/ai-runtime/server.mjs
node research/remaining-fixes/ai-runtime/capture-and-test.mjs
```

The fixture server uses port 3945, combines the freshly compiled CSS chunks from `site/.next/static/chunks/`, and serves their fonts/media locally from the same port. The browser run captures Chromium and WebKit at 390/768/1440px in light and dark modes, and checks disabled/enabled model selection and Escape focus restoration; collapsed/open timeline output tab order; approvals with and without callbacks; Stop with and without `onStop`; and IME versus ordinary Enter handling. Test output and screenshots are written to `captures/`.
