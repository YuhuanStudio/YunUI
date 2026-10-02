# YunUI contributor guidance

Read `CLAUDE.md` and `ARCHITECTURE.md` for conventions and validation.
YunUI is a versioned UI implementation: consumers import public components
and compose their props/slots. Do not recreate controls or call similar-looking
markup adoption. Product data and backend execution stay in the host.

## Consumer contract

`agent/skills/yunui/SKILL.md`, the generated export catalogue and typed recipes
are the consumer-facing contract. `yunui init` installs it for Codex/Claude,
preserves existing instructions and never changes global agent configuration.
Generate the catalogue from real public exports; check recipes against the API.

## AI design scope and approval

Conversational components and their embedded content are in scope, including
the separately requested compact CodeBlock. Model workspace/model cards,
model management, capability controls and navigation/account/language/footer
appearances remain original; confirmed functional/accessibility fixes stay.

Use pinned Beautiful UI source as the primary foundation with limited YunUI
integration. Read `reference/beautiful-ui/` and record source paths/commit,
licenses, behavior, data boundaries and failure modes in research.

The owner requires review of every new AI appearance and interaction design
before production implementation. Preserve YunUI tokens, typography, radius,
spacing, borders, shadows, icons and motion unless a specific change is approved.
Present a concrete draft and state/interaction matrix with its approval status.
One approval does not approve other designs; screenshots or generated plans
cannot substitute for owner approval. Pending drafts stay outside shipped code.

Owner approvals already granted on 2026-10-02:
- D4 conversational UI and compact embedded CodeBlock: directly implement the
  reviewed design in production, with Git rollback available. Do not re-request
  that approval or keep the result prototype-only.
- StreamingText, ContextCards, SelectionActions and DiffTable: owner reviewed
  the source-adapted four-component packet and approved full integration.
  [Approval record](research/ai-refactor/upstream-gap-review/APPROVAL.zh-TW.md).

Current implementation, proof and historical draft status are indexed in
[research/INDEX.md](research/INDEX.md). Historical pending labels do not override
later owner approval; excluded workspace designs remain excluded.

## Publication

Releases/deployments require current owner authorization. Publication is on
hold; local organization and commits do not lift it. Keep version 0.2.18 until
publication is explicitly authorized; follow the existing patch-only policy.
