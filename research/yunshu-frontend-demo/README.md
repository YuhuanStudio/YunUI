# Yunshu inference-engine console — review demo

Yunshu is a local inference engine, not a chat application. The active direction is
[CONSOLE-DIRECTION.md](CONSOLE-DIRECTION.md); the intermediate chat-first proposal
was explicitly rejected and is retained only as a superseded review record.

Run `pnpm dev` here, then open http://127.0.0.1:3970/#/overview.
One preview server is used. `pnpm build` checks types/builds; `pnpm test` validates
session and service URL behavior. All UI primitives and patterns come from the real
local YunUI package (`file:../..`), with project-local `yunui init` setup.

Main navigation: engine overview, model library, requests/performance, API integration,
settings. Inference testing is a secondary tool. The mock model library supports
search, load/unload, details and adding IDs. Unloaded models cannot send test prompts.
No GPU work, downloads, backend probes or service settings writes occur.
Unavailable service metrics remain unavailable. Mock workspace values are kept only
in tab sessionStorage; they are not real engine state or credentials.

Geist and JetBrains Mono load from local licensed assets, with OFL notices in
`public/fonts/`. Evidence and external reference images are ignored local artifacts.
