# Yunshu is an inference-engine console

Owner correction: "我們不是要做成 chat UI". Chat-first navigation is rejected.
The frontend's primary task is operating and understanding a local, single-node
LLM/VLM inference engine. A conversational playground is a secondary diagnostic tool.

## Main areas

1. Engine overview: service readiness/version/load errors, model lifecycle, memory.
2. Model library: inspect, load, unload and choose a model for a diagnostic test.
3. Requests/performance: queued, prefill and decode phases; request progress and
   cancellation; prefill/decode rates and first-token behavior when actually available.
4. API integration: connection address, OpenAI/Anthropic-compatible examples.
5. Settings: frontend connection/preferences and honest distinction from service startup settings.
6. Inference playground: secondary tool, not the app's entry point or identity.

## Existing backend source, inspected read-only

- `python/yunshu_gateway/routers/yunshu.py`:
  GET `/v1/yunshu/status`, GET `/v1/requests`, request detail/cancel, POST `/v1/yunshu/warmup`.
  Status exposes version/state/uptime/load_error, models, memory, request phases,
  GPU accounting where supported, and recent prefill/decode throughput.
- `python/yunshu_gateway/routers/models.py`: model cards/list, load/unload.
- `python/yunshu_gateway/main.py`: `/health`, `/health/ready`, `/health/live`,
  compatibility endpoints and conditional diagnostic routes.
- `python/yunshu_gateway/routers/monitoring.py`: protected monitoring and Prometheus.

This review does not execute those endpoints. Missing data renders unavailable,
not zero or fabricated runtime statistics. Mock model-library interactions remain
explicitly marked. Process start/stop needs a local management layer, not an invented
HTTP endpoint; the owner has been asked whether it belongs in the eventual product.

## Dashboard review iteration

The owner requested a richer oMLX-informed dashboard with charts and useful actions.
The next review uses an explicitly labeled, deterministic demonstration dataset so
the owner can assess populated charts as well as disconnected/empty states. These
fixtures are not measurements, benchmarks or claims about Yunshu performance.
Charts use YunUI's public AreaChart and Sparkline; controls and surfaces stay YunUI.
See [oMLX source research](OMLX-RESEARCH.md) for upstream paths, license, baseline
commit and the distinction between existing telemetry and future collection work.
This remains a host-demo design for review, not approval of new library appearances.

## Relevant reference

[LM Studio local server / Developer view](https://lmstudio.ai/docs/developer/core/server)
separates serving APIs from the user chat workflow. Its server/model/API organization
is relevant; the chat-first Jan/Open WebUI entry-point pattern is not Yunshu's identity.
Their separation of selected vs loaded models, request state and client preferences
is still useful implementation learning. No external UI implementation is copied.

## YunUI boundary

All controls/surfaces use the installed YunUI exports. The host owns product layout,
routes, state, fixture data and future backend integration. YunUI production code and
Yunshu backend files remain unchanged. This is still a review demo, not a release.
