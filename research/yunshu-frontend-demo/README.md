# Yunshu frontend — design review demo

Status: owner requested a demo first on 2026-10-07. This is a new local inference
workbench concept, independent of the removed historical frontend. Appearance
is pending owner feedback; no Yunshu backend or YunUI production component is changed.

Run `pnpm dev` in this directory; the one preview listens on
http://127.0.0.1:3970. `pnpm build` checks types and compiles the application.
The local `file:../..` dependency uses YunUI's actual package exports and built
implementation. It is intentionally not a registry release or copied controls.

## Interactive views

- Overview: sample metrics, range selector, current-model state and recent requests.
- Models: search, loaded filter, local demo load/unload state, detail and add-ID dialogs.
- Chat: model selection, new conversation, expandable reasoning, preset demo responses.
- Settings: controlled switches, session-only endpoint setting and working code-format tabs/copy.

All metrics, model entries and replies are sample data. No inference, download,
configuration write or service probe is performed. Page state is in memory.

## Direct library mapping

- Shell: `Sidebar`, `PageHeader`, `Card`, `Badge`, `Button`, `IconButton`.
- Overview: `StatCard`, `AreaChart`, `MetricBar`, `Table` and table parts.
- Models: `ModelManagerCard`, `Input`, `SegmentedSelect`, `EmptyState`, `Dialog` and parts.
- Chat: `ChatHeader`, `ChatMessageList`, `ChatMessage`, `ChatComposer`, `GenerationStats`,
  `ThinkingBlock`, `AgentRunStatus`.
- Settings: `SettingRow`, `Switch`, `Input`, patterns `CodeBlock`.
- Host: `YunUIProvider`, product content, page state, navigation and demo callbacks.

`yunui init` installed project-local guidance and `.yunui/setup.css`.
`yunui doctor --strict` and `yunui audit --strict` pass. UI is compiled with
Tailwind v4; styles.css only supplies host layout/font setup, not replacement controls.

## Fonts and evidence

Geist Latin font is reused from the existing licensed YunUI site build; OFL is
in `public/fonts/Geist-OFL.txt` (Google Fonts / Vercel). JetBrains Mono Regular
comes from the official JetBrains/JetBrainsMono webfonts directory; its OFL is
included beside the font. No external font request occurs while using the demo.
Browser screenshots and interaction evidence are in local `evidence/`.
