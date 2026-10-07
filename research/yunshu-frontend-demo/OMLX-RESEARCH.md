# oMLX Console patterns and Yunshu telemetry boundary

Read-only research for the Yunshu engine-console demo. No application or backend files were changed.

## Source and license

- oMLX checkout: `reference/omlx/`, clean at `4b6b4458a53dfb1a3c6ce2af7379f75ce13e24bd` (2026-10-07, “test: pin process state in two tests that broke under xdist”). The repo is Apache-2.0; see `reference/omlx/LICENSE`.
- Yunshu backend inspected at `/Users/yuhuan/Documents/YuhuanStudio/Yunshu`, commit `5269e9e5ca9b4e9488fa5b2272aa0ac80c32b7c0`.

## What is useful in oMLX

The admin dashboard is an engine console, not a product-analytics landing page. `omlx/admin/templates/dashboard.html:21-39` places Status, Models, Settings, Logs, and Benchmark in distinct tabs. Status can be rearranged as real operator blocks; `_status.html:1-10,48-80` lists Serving Stats, Usage History, Active Models, Cache Observability, API Endpoints, engine versions, and application information. Its layout editor is optional. The demo should begin at operational status and keep model administration nearby; a fabricated business dashboard would not express this workflow.

The status numbers have explicit scopes and meanings. `_serving_stats.html:8-50,54-98` filters by model and toggles current-session versus all-time totals; it shows prompt tokens, cached tokens, cache efficiency, average prefill throughput (with the cached portion excluded), and average generation throughput. “Clear” asks for confirmation before a destructive reset. These are aggregate values, not points in a time-series chart.

oMLX separates current serving activity from historical usage. `_active_models.html` shows each loaded/loading model, memory pressure and size, pin state, prefill progress, active requests, generated tokens, request speed, elapsed/ETA, idle time, and TTL. `dashboard.js:4047-4053` polls live status every 500 ms while the Status tab is active. `_usage.html:1-86` is a distinct historical view with today/yesterday/7/30/90-day/month ranges, model filter, request/token totals, per-model table, and hourly token heatmap. `usage.js:11-65` polls it every 15 seconds, aborts stale filter requests, and distinguishes disabled recording, delayed/dropped records, loading, and unavailable data.

Cache observability is also a separate operational concern: `_cache_observability.html` distinguishes hot memory from SSD cache, reports capacity, size, entries/hit rates/evictions per model, and only exposes controls when the corresponding cache is active. Benchmark is a separate tab and uses measured benchmark runs, not live serving counters. The `docs/images/omlx.ai_perf_explorer.png` screenshot is an external community benchmark comparison by context length; its caption says the values are community submissions. Do not present that chart as Yunshu runtime telemetry.

Useful visual references shipped by oMLX:

- `reference/omlx/docs/images/omlx_dashboard.png` — overall Status/Serving Stats layout.
- `reference/omlx/docs/images/omlx_dashboard_activemodels.png` — per-model active/idle/prefill rows and memory bar.
- `reference/omlx/docs/images/omlx_hot_cold_cache.png` — hot/SSD cache concept.
- `reference/omlx/docs/images/omlx_benchmark.png` — benchmark configuration, separate from runtime status.
- `reference/omlx/docs/images/omlx.ai_perf_explorer.png` — external community benchmark distribution; not local telemetry.

The key implementation references are `reference/omlx/omlx/admin/templates/dashboard.html`, `dashboard/_status.html`, `dashboard/blocks/_serving_stats.html`, `dashboard/blocks/_active_models.html`, `dashboard/blocks/_cache_observability.html`, `dashboard/_usage.html`, `reference/omlx/omlx/admin/static/js/dashboard.js:3966-4053`, and `reference/omlx/omlx/admin/static/js/usage.js:11-65`.

## What Yunshu can actually display today

| Priority | Dashboard idea | Existing Yunshu source of truth | Boundary / UI state to show |
| --- | --- | --- | --- |
| **P0** | Engine status header and live activity: running/load error, model inventory, active/queued/prefill/decode counts, last request, 60-second prompt/completion totals and live/mean prefill/decode rates. | `python/yunshu_gateway/routers/yunshu.py:157-199` (`GET /v1/yunshu/status`). It is mounted under `/v1` in `python/yunshu_gateway/main.py:1089`. | This is the best current starting surface. Requires the normal `can_infer` auth check; distinguish `load_error`, empty/no-model, and zero activity. The `throughput.window_s` is explicitly 60 seconds; do not label it all-time or invent a historical curve from these totals. |
| **P1** | Real-time model roster with load state, request phase, memory, and prefill/decode details. | `/v1/yunshu/status` returns `models`, `memory`, `requests.items`, and `gpu` (`yunshu.py:157-199`). If debug routes are enabled, `python/yunshu_gateway/routers/monitoring.py:352-388` adds `/debug/models` and `/debug/requests`; `_get_active_requests` assembles active/waiting counts and recent summary. | `/debug/*` is conditional on `YUNSHU_DEBUG_ROUTES` (`main.py:1098-1101`) and each endpoint requires a bearer token unless auth is explicitly disabled (`monitoring.py:32-60`). Check availability before showing debug-only details. Do not present absent values as zero. |
| **P1** | System and memory pressure: CPU/RAM/MLX active/peak/cache memory and compute utilization; optionally memory-guard view. | `/debug/system` (`monitoring.py:320-349`) and `/debug/memory-guard` (`1077-1101`). | Debug route/auth gate applies. GPU utilization is not necessarily a vendor utilization percentage: the endpoint reports MLX active/peak/cache bytes and UMA-based ratio. Label the measurement exactly. |
| **P2** | Recent service health: request/error rate, average latency, p50/p90/p95/p99 latency and token count percentiles, active/waiting requests, ITL percentiles. | `/debug/requests?window=60` (`monitoring.py:363-388`) backed by `python/yunshu_gateway/middleware/metrics_aggregator.py:117-165` and `python/yunshu_engine/server_metrics.py:164-205`. | The gateway request buffer is in-memory and retained for 600 seconds; requested windows are clamped to that retention. The aggregator’s endpoint breakdown does **not** have production token attribution because token counts are recorded out-of-band without endpoint labels; do not plot per-endpoint token totals from it (`metrics_aggregator.py:237-276`). |
| **P2** | KV/speculative decode/cache diagnostics, per model. | `/debug/kv-cache`, `/debug/spec-decode`, `/debug/ssd-cache`, `/debug/per-model` (`monitoring.py:983-1159`). | These are optional/capability-dependent. Preserve “inactive”, “unavailable”, and per-model `error` responses; `/debug/all` can return `null` for an individual endpoint failure (`monitoring.py:1169-1185`). Avoid showing implementation counters to every user by default. |
| **P3 — needs backend work** | Multi-day history, date range selector, hourly heatmap, durable per-model historical trends. | No matching usage-history database/endpoint was found in the current Yunshu backend. `ServerMetrics` holds session and per-model aggregate counters; its singleton defaults to `ServerMetrics()` without a persistence path (`python/yunshu_engine/server_metrics.py:24-54,309-345,417-424`). The gateway rolling aggregator keeps only a 600-second in-memory window. | Do not transplant oMLX’s 7/30/90-day heatmap or call session totals “history.” A real history chart needs timestamped aggregation plus persistence and an API contract; that is backend scope, not a front-end fixture. |

Yunshu also has a `TelemetryCollector` in `python/yunshu_engine/telemetry.py`, but it defaults to `enabled=False` and is an optional sampled/batched OTLP exporter. It is not the source for a local dashboard unless an operator explicitly configures that integration.

## Eventual backend integration priorities

The current owner request is a populated review demo; explicit fixtures are appropriate
for that review. The following priorities apply when integrating the real service,
not as a claim that this demo already connects to it.

1. **Make the first screen operational and real.** Replace the current hardcoded overview metrics/area chart/recent-request rows with server state, current model roster, a few honest 60-second KPIs, and a clear empty/disconnected state. Use `/v1/yunshu/status` first; avoid a chart if the data is only one aggregate snapshot.
2. **Add model activity and memory details.** Separate registered/selected models from loaded/running ones; show per-model loading, active requests, prefill, decode, and memory pressure only when the endpoint supplies those fields. Keep load/unload actions tied to the actual backend or mark them unavailable—never toggle a local boolean that looks like a completed load.
3. **Use a real short-window chart only after choosing a real sample stream.** The current aggregator can support a recent-window summary and latency distribution. A short-lived UI chart can be explicitly labeled as samples collected since opening the page, or the backend can add time buckets. Do not imply durable history from the current rolling buffer.
4. **Keep advanced diagnostics separate.** Cache/spec-decode and benchmarking are useful operator tools, but they have capability gates and different data semantics. Use a secondary tab/section and real measured runs; do not mix community performance-explorer values with this machine’s serving numbers.

This comparison is about information hierarchy, metric semantics, and backend capability—not a request to copy oMLX source or its dashboard styling. The oMLX dashboard’s Apache-2.0 source was read for reference only; no source was copied and no backend code was changed.
