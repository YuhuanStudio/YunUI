# D3 upstream provenance

Repository: https://github.com/slev12397/beautiful-ui

Pinned commit: `44a274e598395ab61e7c96c26fda2758780253b7`.
Local original checkout: `reference/beautiful-ui/` (not modified by this port).
MIT notice: `../LICENSE`; preserve that notice when redistributing derivatives.

| Local derivative | Original path | D3 adaptation |
| --- | --- | --- |
| PromptBar.tsx | components/primitives/PromptBar.tsx | Local YunUI study fixtures; remove external service/voice/shader demos; retain token menus; composition guard; host-replaceable aria labels for prompt, attach, model, send and dynamic remove (verified by independent :3944 fixture) |
| ThinkingState.tsx | components/primitives/ThinkingState.tsx | Optional staticStage for explicit review state |
| ToolChips.tsx | components/primitives/ToolChips.tsx | Optional staticStep and local fixtures; keep disclosure/diff presentation |
| TaskRows.tsx | components/primitives/TaskRows.tsx | Optional staticTick; fixture labels sized for the review shell |
| ApprovalCard.tsx | components/primitives/ApprovalCard.tsx | Local questions/labels, manualAdvance, adjusted local dependency paths; host-replaceable Dismiss, custom-answer, previous and next question aria labels (verified by independent :3944 fixture) |
| GlideMenu.tsx | components/primitives/GlideMenu.tsx | Local import paths for ApprovalCard dependency |
| atoms/Button.tsx | components/atoms/Button.tsx | Local import paths |
| lib/utils.ts | lib/utils.ts | Local dependency helper |

The :3944 test-only fixture asserts custom label overrides and explicit `undefined` fallbacks; it does not alter the D3 entry or UI.

The original stylesheet is recorded as `../upstream.css`, derived from
`app/globals.css`; `../build-css.mjs` compiles it. The new review shell lives in
`../entry.tsx` and `../layout.css`; it is a local composition, not an upstream
application copied unchanged. General shell icons use lucide-react; no claim is
made that the upstream commercial icon license is covered by MIT.

ChatComposer.tsx, StreamingText.tsx and ContextCards.tsx were copied for study.
Their presence does not mean they are rendered or ready for the shipped API.
The actual D3 render uses PromptBar, ThinkingState, ToolChips, TaskRows and
ApprovalCard, plus their dependencies.

Static props disable simulated execution in D3. Some derivatives retain the
upstream timed-demo fallback if those props are omitted; that fallback is not an
acceptable production execution source. Before shipping, use controlled host
events, remove demo defaults, expose host-owned data/labels, and verify request,
approval, cancellation and partial-result boundaries.

Approval status: **PENDING_OWNER_APPROVAL**. These source derivatives are outside
the published package. See `../../DESIGN-03-REVIEW.zh-TW.md` for the owner gate.
