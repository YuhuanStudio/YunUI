# Superseded: incorrect product direction

Owner explicitly corrected the chat-first direction: Yunshu is an inference-engine console, not a chat product. The observations about shared model state and safe workflows remain useful, but the navigation/product conclusion below was rejected. See CONSOLE-DIRECTION.md for the active direction.

---

# Yunshu Demo 02 — workflow review

Owner feedback: Demo01 imported YunUI but its product composition felt wrong.
This revision remains an isolated design demo. It does not restore the deleted
Yunshu frontend, change the engine, or alter YunUI production components.

## What was wrong

- A made-up performance dashboard was the entry point, ahead of the main task.
- A page header, card header and model footer repeated the same chat identity;
  a bounded card inside the page constrained the useful conversation area.
- Selected chat model and loaded model had no send-time relationship.
- New chat erased the only message array; choosing another model renamed old replies.
- Fixed token/speed statistics and a generic thinking paragraph added false detail.
- Settings looked like engine configuration while only changing local flags.
- Code examples could append `/v1` twice; invalid service addresses were accepted.

## Primary references actually reviewed

- [LM Studio getting started](https://lmstudio.ai/docs/app/basics):
  download → load into memory → chat. Its official chat/loader images show a
  persistent conversation rail and a model loader adjacent to the conversation.
  Those images are historical examples, not a claim about the latest version.
- [Jan desktop quickstart](https://www.jan.ai/docs/desktop/quickstart):
  a conversation-first workspace, separate model hub, and one model selection
  workflow. Inspected the official chat image rather than just reading its copy.
- [Open WebUI chat features](https://docs.openwebui.com/features/chat-conversations/chat-features/):
  model selection and suggestions at the entry point, conversation history and
  per-chat controls. Inspected its official new-chat image.
- Jan source at commit `71eb4863b7222e2d1b7d003ad66d98eecd2d2352`:
  [ChatInput](https://github.com/janhq/jan/blob/71eb4863b7222e2d1b7d003ad66d98eecd2d2352/web-app/src/containers/ChatInput.tsx),
  [useThreads](https://github.com/janhq/jan/blob/71eb4863b7222e2d1b7d003ad66d98eecd2d2352/web-app/src/hooks/useThreads.ts),
  [useModelProvider](https://github.com/janhq/jan/blob/71eb4863b7222e2d1b7d003ad66d98eecd2d2352/web-app/src/hooks/useModelProvider.ts),
  [useAppState](https://github.com/janhq/jan/blob/71eb4863b7222e2d1b7d003ad66d98eecd2d2352/web-app/src/hooks/useAppState.ts).
  Learned separation of selected model, runtime-loaded models, thread identity,
  messages and draft state. No Jan or Open WebUI component/source code is copied
  into this demo; all UI controls are YunUI exports.

## Applied changes

Chat is the initial view with a single model selector and an open canvas. The
composer is central when empty and remains beneath the message list in a thread.
New conversations create a separate thread. Sidebar history, draft and parameters
are per-thread; each reply keeps its own model ID. Tab sessionStorage restores
this mock workspace on refresh; malformed storage falls back safely.

Selecting a model does not pretend to load it. An unloaded selection blocks
send and presents a load action. The model library uses YunUI Table/Buttons for
compact, scannable rows. Adding an ID visibly adds an item to the mock list.
No file is downloaded. Service diagnostics remain unavailable without a real
engine; synthetic graphs, request tables and invented inference stats are gone.
Only client preferences live in Settings. Conversation parameters use the YunUI
Sheet next to the composer. Service URL validation and code examples share the
same API-base normalization.

## Proof of YunUI adoption

`yunui doctor --strict` and `yunui audit --strict` pass. The installed package's
index/patterns/ai/chat/adapters bundles match the library build byte-for-byte;
checksums are in local `evidence/v2/import-origin.json`. This verifies imports,
not UX quality. Layout, routes, sample content and application state are host code.
No Button, Card, Sidebar, Select, Sheet, Dialog, Composer or message UI is redrawn
with copied markup or a second component kit.

Verification includes actual behavior and rendered pixels in addition to build
and adoption checks. Evidence remains local under `evidence/v2`.
