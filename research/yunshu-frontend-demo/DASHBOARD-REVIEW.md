# Dashboard review — oMLX-informed engine console

Status: requested by owner for the local demo; visual review pending. No new YunUI
library appearance is approved or shipped by this draft. No release or backend
operation is authorized by the preview.

## Composition

- YunUI Sidebar / PageHeader: existing console navigation and page identity.
- YunUI StatCard / Sparkline: compact summaries and recent trends.
- YunUI Card / AreaChart: separately scoped prefill, decode and cache histories.
- YunUI SegmentedSelect / Select: period, metric and demonstration-state controls.
- YunUI Table / Input / Sheet: request filtering and inspection.
- YunUI Button: navigation and local export actions.
- Host code: deterministic fixtures, calculations, time labels, filtering and CSV.

## State and interaction review

| Surface | Populated demonstration | Empty / disconnected | Review |
| --- | --- | --- | --- |
| Service context | Explicit fixture/source label, configured endpoint | No claim of a live connection | Pending |
| Summary metrics | Values from selected fixture window; units and scope | Unavailable remains unavailable | Pending |
| Throughput | Distinct Prefill / Decode, selectable observation window | No fabricated flat-zero chart | Pending |
| Memory | Allocator allocation and capacity with labeled meanings | No available-memory claim from absent OS data | Pending |
| Cache | Explicit ratio definition; distinct from Metal allocator cache | No claim that missing observations mean zero hits | Pending |
| Requests | Search/filter, individual detail; fixture identity | Empty result has clear explanation | Pending |
| Export | Downloads local demonstration observations | No backend or credentials included | Pending |

The source comparison and data availability are in [OMLX-RESEARCH.md](OMLX-RESEARCH.md).
All numeric screenshots are design examples, not measured Yunshu performance.

## Verification

- Typecheck and production build pass; the existing demo bundle-size advisory remains.
- `yunui doctor --strict` and `yunui audit --strict` pass. Charts import the public
  AreaChart / Sparkline / Gauge / Progress exports; no chart package or copied UI.
- Four workspace/URL/routing regression tests pass.
- Chromium and WebKit, 390 / 768 / 1440 px, light / dark: overview and requests page
  captured at multiple inner-scroll positions (72 captures). No document overflow
  or browser errors. Contact sheets and original mobile captures were inspected;
  mobile KPI cards were tightened into two columns after the first visual pass.
- Local evidence is ignored under `evidence/dashboard-v3/`; `root-matrix.json`
  records the final visual matrix. Design acceptance remains the owner's decision.
- Both engines pass metric/time selection, snapshot/empty/offline transitions,
  chart tooltips and numeric disclosure, request status/model/search filters,
  filtered CSV download/content, and detail-sheet Escape/focus restoration.
  `root-interactions.json` records zero focus, browser, network or HTTP errors.
