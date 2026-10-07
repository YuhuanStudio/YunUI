/**
 * Deterministic, local-only dashboard fixtures. Each time range is a view over
 * the same minute-level series: 15m takes 15 one-minute buckets, 1h aggregates
 * the trailing 60 minutes into twelve 5-minute buckets, and 24h aggregates the
 * full day into hourly buckets. This keeps counts/tokens coherent across scopes.
 * The sample telemetry is independent from the demo app's `loaded` model state.
 */
export type DashboardRange = "15m" | "1h" | "24h";

export interface TelemetryBucket {
  /** End time of the sample bucket, relative to the fixture's T reference. */
  label: string;
  /** Request count observed in this bucket, not a currently-active count. */
  requests: number;
  /** Request-weighted sample throughput within this bucket. */
  decodeTps: number;
  prefillTps: number;
  promptTokens: number;
  cachedPromptTokens: number;
  /** Requests with any reused prefix tokens; distinct from token reuse ratio. */
  requestsWithPrefixReuse: number;
  modelWeightsGb: number;
  activeKvGb: number;
  runtimeCacheGb: number;
  otherProcessGb: number;
  /** Explicit synthetic remainder; not measured OS-available memory. */
  demoRemainingGb: number;
}

export interface RequestSample {
  id: string;
  modelId: string;
  /** Time since the most recent update to this sample row. */
  updatedAgo: string;
  status: "queued" | "prefill" | "decode" | "complete" | "failed";
  promptTokens: number;
  /** Undefined until the fixture has an observed cache-reuse value. */
  cachedPromptTokens?: number;
  outputTokens: number;
  prefillTps?: number;
  decodeTps?: number;
  ttftMs?: number;
  elapsedSeconds: number;
  /** Fixture-only error detail. */
  error?: string;
}

export interface DashboardScenario {
  title: string;
  interval: string;
  points: readonly TelemetryBucket[];
}

const MEMORY_CAPACITY_GB = 64;

interface MinuteSample {
  requests: number;
  promptTokens: number;
  cachedPromptTokens: number;
  requestsWithPrefixReuse: number;
  decodeTps: number;
  prefillTps: number;
  modelWeightsGb: number;
  activeKvGb: number;
  runtimeCacheGb: number;
  otherProcessGb: number;
  demoRemainingGb: number;
}

function makeMinuteSample(index: number): MinuteSample {
  const wave = Math.sin(index * 0.071 + 1.2);
  const slowerWave = Math.cos(index * 0.033 + 0.6);
  const requests = Math.max(1, Math.round(1.35 + 0.82 * wave + 0.42 * slowerWave));
  const promptTokens = requests * (1_950 + Math.round((slowerWave + 1) * 780));
  const tokenReuseRatio = 0.2 + ((Math.sin(index * 0.047 + 0.9) + 1) / 2) * 0.34;
  const cachedPromptTokens = Math.round(promptTokens * tokenReuseRatio);
  const requestHitRatio = 0.26 + ((Math.cos(index * 0.061 + 0.4) + 1) / 2) * 0.48;
  const requestsWithPrefixReuse = Math.min(requests, Math.max(1, Math.round(requests * requestHitRatio)));

  const modelWeightsGb = 18.2;
  const activeKvGb = Number((5.7 + (wave + 1) * 0.78).toFixed(1));
  const runtimeCacheGb = Number((1.4 + (slowerWave + 1) * 0.35).toFixed(1));
  const otherProcessGb = Number((8.2 + (Math.sin(index * 0.022 + 0.5) + 1) * 1.1).toFixed(1));
  const demoRemainingGb = Number((MEMORY_CAPACITY_GB - modelWeightsGb - activeKvGb - runtimeCacheGb - otherProcessGb).toFixed(1));

  return {
    requests,
    promptTokens,
    cachedPromptTokens,
    requestsWithPrefixReuse,
    decodeTps: Number((34 + (wave + 1) * 8 + slowerWave * 2).toFixed(1)),
    prefillTps: Number((560 + (slowerWave + 1) * 230 + wave * 35).toFixed(1)),
    modelWeightsGb,
    activeKvGb,
    runtimeCacheGb,
    otherProcessGb,
    demoRemainingGb,
  };
}

const MINUTE_SAMPLES = Array.from({ length: 24 * 60 }, (_, index) => makeMinuteSample(index));

function relativeEndLabel(minutesFromEnd: number): string {
  if (minutesFromEnd <= 0) return "T";
  if (minutesFromEnd % 60 === 0) return `T−${minutesFromEnd / 60}h`;
  return `T−${minutesFromEnd}m`;
}

function aggregateBucket(samples: readonly MinuteSample[], label: string): TelemetryBucket {
  const requests = samples.reduce((sum, sample) => sum + sample.requests, 0);
  const requestWeightedAverage = (key: "decodeTps" | "prefillTps") => {
    const weighted = samples.reduce((sum, sample) => sum + sample[key] * sample.requests, 0);
    return requests ? Number((weighted / requests).toFixed(1)) : 0;
  };
  const last = samples.at(-1)!;
  return {
    label,
    requests,
    decodeTps: requestWeightedAverage("decodeTps"),
    prefillTps: requestWeightedAverage("prefillTps"),
    promptTokens: samples.reduce((sum, sample) => sum + sample.promptTokens, 0),
    cachedPromptTokens: samples.reduce((sum, sample) => sum + sample.cachedPromptTokens, 0),
    requestsWithPrefixReuse: samples.reduce((sum, sample) => sum + sample.requestsWithPrefixReuse, 0),
    modelWeightsGb: last.modelWeightsGb,
    activeKvGb: last.activeKvGb,
    runtimeCacheGb: last.runtimeCacheGb,
    otherProcessGb: last.otherProcessGb,
    demoRemainingGb: last.demoRemainingGb,
  };
}

function makeScenario(range: DashboardRange): DashboardScenario {
  const bucketMinutes = range === "15m" ? 1 : range === "1h" ? 5 : 60;
  const bucketCount = range === "15m" ? 15 : range === "1h" ? 12 : 24;
  const totalMinutes = bucketMinutes * bucketCount;
  const start = MINUTE_SAMPLES.length - totalMinutes;
  const points = Array.from({ length: bucketCount }, (_, index) => {
    const from = start + index * bucketMinutes;
    const until = from + bucketMinutes;
    const minutesFromEnd = totalMinutes - (index + 1) * bucketMinutes;
    return aggregateBucket(MINUTE_SAMPLES.slice(from, until), relativeEndLabel(minutesFromEnd));
  });
  return {
    title: range === "15m" ? "最近 15 分鐘" : range === "1h" ? "最近 1 小時" : "最近 24 小時",
    interval: range === "15m" ? "每分鐘" : range === "1h" ? "每 5 分鐘" : "每小時",
    points,
  };
}

export const demoTelemetry: Readonly<Record<DashboardRange, DashboardScenario>> = {
  "15m": makeScenario("15m"),
  "1h": makeScenario("1h"),
  "24h": makeScenario("24h"),
};

export const demoMemoryCapacityGb = MEMORY_CAPACITY_GB;

export const demoRequests: readonly RequestSample[] = [
  { id: "req-7F2A", modelId: "qwen", updatedAgo: "T−02s", status: "decode", promptTokens: 1_824, cachedPromptTokens: 1_024, outputTokens: 312, prefillTps: 742, decodeTps: 42.8, ttftMs: 638, elapsedSeconds: 9.1 },
  { id: "req-7F29", modelId: "qwen-small", updatedAgo: "T−08s", status: "prefill", promptTokens: 6_240, cachedPromptTokens: 2_048, outputTokens: 0, prefillTps: 891, elapsedSeconds: 6.4 },
  { id: "req-7F28", modelId: "llama", updatedAgo: "T−14s", status: "complete", promptTokens: 912, cachedPromptTokens: 0, outputTokens: 204, prefillTps: 612, decodeTps: 37.4, ttftMs: 1_204, elapsedSeconds: 8.3 },
  { id: "req-7F27", modelId: "qwen", updatedAgo: "T−21s", status: "complete", promptTokens: 2_944, cachedPromptTokens: 1_856, outputTokens: 486, prefillTps: 1_012, decodeTps: 45.2, ttftMs: 705, elapsedSeconds: 12.8 },
  { id: "req-7F26", modelId: "qwen-small", updatedAgo: "T−34s", status: "queued", promptTokens: 4_096, outputTokens: 0, elapsedSeconds: 0.9 },
  { id: "req-7F25", modelId: "qwen", updatedAgo: "T−48s", status: "failed", promptTokens: 1_536, cachedPromptTokens: 512, outputTokens: 0, prefillTps: 520, elapsedSeconds: 4.2, error: "Fixture: simulated request timeout before decode." },
  { id: "req-7F24", modelId: "llama", updatedAgo: "T−1m", status: "complete", promptTokens: 640, cachedPromptTokens: 0, outputTokens: 118, prefillTps: 488, decodeTps: 35.9, ttftMs: 1_316, elapsedSeconds: 5.7 },
  { id: "req-7F23", modelId: "qwen", updatedAgo: "T−2m", status: "complete", promptTokens: 3_328, cachedPromptTokens: 2_432, outputTokens: 592, prefillTps: 934, decodeTps: 43.1, ttftMs: 812, elapsedSeconds: 15.4 },
  { id: "req-7F22", modelId: "qwen-small", updatedAgo: "T−3m", status: "decode", promptTokens: 1_280, cachedPromptTokens: 384, outputTokens: 176, prefillTps: 668, decodeTps: 39.6, ttftMs: 974, elapsedSeconds: 7.5 },
  { id: "req-7F21", modelId: "llama", updatedAgo: "T−4m", status: "complete", promptTokens: 832, cachedPromptTokens: 256, outputTokens: 143, prefillTps: 580, decodeTps: 36.8, ttftMs: 1_081, elapsedSeconds: 6.8 },
];

export const requestStatusLabels: Readonly<Record<RequestSample["status"], string>> = {
  queued: "排隊中",
  prefill: "Prefill",
  decode: "Decode",
  complete: "完成",
  failed: "失敗",
};
