import { useId, useMemo, useState } from "react";
import {
  AreaChart,
  Badge,
  Button,
  Card,
  EmptyState,
  Gauge,
  Input,
  Progress,
  SegmentedSelect,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  Sparkline,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@yuhuanowo/yunui";
import { PageHeader, StatCard } from "@yuhuanowo/yunui/patterns";
import { Activity, ArrowRight, Box, ChevronDown, Cpu, Database, Download, Search, Server, Zap } from "lucide-react";
import { demoMemoryCapacityGb, demoRequests, demoTelemetry, requestStatusLabels, type DashboardRange, type RequestSample } from "./dashboard-data";
import type { Model } from "./data";

interface DashboardViewProps {
  endpoint: string;
  items: Model[];
  loaded: string | null;
  navigate: (path: string) => void;
}

type DashboardScenario = "snapshot" | "empty" | "offline";
type ThroughputMetric = "decodeTps" | "prefillTps";
type RequestFilter = "all" | "active" | "complete" | "failed";

export interface RequestModelOption {
  id: string;
  name: string;
}

export interface RequestActivityProps {
  /** Defaults to the isolated dashboard fixture for direct `/requests` reuse. */
  requests?: readonly RequestSample[];
  modelOptions?: readonly RequestModelOption[];
  title?: string;
  description?: string;
  maxRows?: number;
  emptyTitle?: string;
  emptyDescription?: string;
}

const RANGE_OPTIONS: { value: DashboardRange; label: string }[] = [
  { value: "15m", label: "15m" },
  { value: "1h", label: "1h" },
  { value: "24h", label: "24h" },
];

const METRIC_OPTIONS = [
  { value: "decodeTps" as const, label: "Decode" },
  { value: "prefillTps" as const, label: "Prefill" },
];

const SCENARIO_OPTIONS = [
  { value: "snapshot" as const, label: "快照" },
  { value: "empty" as const, label: "無請求" },
  { value: "offline" as const, label: "離線" },
];

const REQUEST_FILTERS: { value: RequestFilter; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "active", label: "進行中" },
  { value: "complete", label: "完成" },
  { value: "failed", label: "失敗" },
];

function formatInt(value: number): string {
  return new Intl.NumberFormat("zh-TW", { maximumFractionDigits: 0 }).format(value);
}

function formatRate(value: number): string {
  return new Intl.NumberFormat("zh-TW", { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(value);
}

function formatGb(value: number): string {
  return `${value.toFixed(1)} GB`;
}

function statusVariant(status: RequestSample["status"]): "success" | "warning" | "error" | "info" | "secondary" {
  if (status === "complete") return "success";
  if (status === "failed") return "error";
  if (status === "decode") return "info";
  if (status === "prefill") return "warning";
  return "secondary";
}

function isActiveRequest(status: RequestSample["status"]): boolean {
  return status === "queued" || status === "prefill" || status === "decode";
}

function weightedRate(points: readonly (typeof demoTelemetry)[DashboardRange]["points"][number][], key: ThroughputMetric): number | undefined {
  const count = points.reduce((sum, point) => sum + point.requests, 0);
  return count ? points.reduce((sum, point) => sum + point[key] * point.requests, 0) / count : undefined;
}

function csvCell(value: string | number): string {
  const text = String(value);
  const protectedText = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${protectedText.replaceAll('"', '""')}"`;
}

function downloadRequestCsv(requests: readonly RequestSample[]) {
  const columns: (keyof RequestSample)[] = ["id", "modelId", "updatedAgo", "status", "promptTokens", "cachedPromptTokens", "outputTokens", "prefillTps", "decodeTps", "ttftMs", "elapsedSeconds", "error"];
  const rows = [columns.map(csvCell).join(","), ...requests.map((request) => columns.map((column) => csvCell(request[column] ?? "")).join(","))];
  const blob = new Blob([`\uFEFF${rows.join("\r\n")}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "yunshu-demo-requests.csv";
  anchor.click();
  // Safari may begin consuming the Blob after the click handler returns.
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

/** Reusable, fully local request panel shared by the dashboard and `/requests`. */
export function RequestActivity({
  requests = demoRequests,
  modelOptions = [],
  title = "最近請求",
  description = "依狀態、模型或 request ID 篩選本機示範記錄。",
  maxRows,
  emptyTitle = "沒有符合條件的示範請求",
  emptyDescription = "調整關鍵字或篩選條件，或切回完整示範快照。",
}: RequestActivityProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<RequestFilter>("all");
  const [modelFilter, setModelFilter] = useState("all");
  const [detail, setDetail] = useState<RequestSample | null>(null);
  const modelName = (modelId: string) => modelOptions.find((model) => model.id === modelId)?.name ?? modelId;
  const shown = useMemo(() => requests.filter((request) => {
    const needle = query.trim().toLowerCase();
    const matchesText = !needle || `${request.id} ${modelName(request.modelId)} ${request.modelId} ${request.error ?? ""}`.toLowerCase().includes(needle);
    const matchesStatus = statusFilter === "all"
      || (statusFilter === "active" && isActiveRequest(request.status))
      || (statusFilter === "complete" && request.status === "complete")
      || (statusFilter === "failed" && request.status === "failed");
    const matchesModel = modelFilter === "all" || request.modelId === modelFilter;
    return matchesText && matchesStatus && matchesModel;
  }), [requests, query, statusFilter, modelFilter, modelOptions]);
  const visible = maxRows ? shown.slice(0, maxRows) : shown;

  return (
    <Card className="min-w-0 overflow-hidden" data-testid="request-activity">
      <div className="flex flex-col gap-4 border-b border-border/60 px-4 py-4 sm:px-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2"><h2 className="text-sm font-semibold text-foreground">{title}</h2><Badge variant="outline">示範記錄</Badge></div>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
        </div>
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <Input className="h-9 w-full sm:w-48" icon={<Search size={14} />} aria-label="搜尋 request ID 或模型" placeholder="搜尋 request / model" value={query} onChange={(event) => setQuery(event.target.value)} />
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as RequestFilter)}>
            <SelectTrigger aria-label="依請求狀態篩選" className="h-9 w-[112px]"><SelectValue /></SelectTrigger>
            <SelectContent>{REQUEST_FILTERS.map((filter) => <SelectItem key={filter.value} value={filter.value}>{filter.label}</SelectItem>)}</SelectContent>
          </Select>
          {modelOptions.length > 0 ? (
            <Select value={modelFilter} onValueChange={setModelFilter}>
              <SelectTrigger aria-label="依模型篩選" className="h-9 w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">全部模型</SelectItem>{modelOptions.map((model) => <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>)}</SelectContent>
            </Select>
          ) : null}
          <Button type="button" size="sm" variant="secondary" className="h-9" disabled={shown.length === 0} onClick={() => downloadRequestCsv(shown)}><Download size={14} />CSV</Button>
        </div>
      </div>

      <Table scrollLabel="示範請求活動清單" className="min-w-[760px]">
        <Thead><Tr><Th>Request</Th><Th>模型</Th><Th>階段</Th><Th className="text-right">輸入 / 快取</Th><Th className="text-right">輸出</Th><Th className="text-right">經過</Th><Th>詳情</Th></Tr></Thead>
        <Tbody>
          {visible.map((request) => (
            <Tr key={request.id}>
              <Td><span className="font-mono text-[11px]">{request.id}</span><span className="ml-2 text-[10px] text-muted-foreground">更新 {request.updatedAgo}</span></Td>
              <Td><span className="block max-w-32 truncate text-xs">{modelName(request.modelId)}</span></Td>
              <Td><Badge variant={statusVariant(request.status)}>{requestStatusLabels[request.status]}</Badge></Td>
              <Td className="text-right font-mono text-[11px]">{formatInt(request.promptTokens)} / {request.cachedPromptTokens != null ? formatInt(request.cachedPromptTokens) : "—"}</Td>
              <Td className="text-right font-mono text-[11px]">{formatInt(request.outputTokens)}</Td>
              <Td className="text-right font-mono text-[11px]">{request.elapsedSeconds.toFixed(1)}s</Td>
              <Td><Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-[11px]" onClick={(event) => { event.currentTarget.focus(); setDetail(request); }}>查看</Button></Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {visible.length === 0 ? <div className="px-4 py-3"><EmptyState title={emptyTitle} description={emptyDescription} /></div> : null}
      {maxRows && shown.length > maxRows ? <p className="border-t border-border/50 px-4 py-3 text-xs text-muted-foreground">目前顯示 {maxRows} 筆，篩選結果共 {shown.length} 筆。</p> : null}

      <Sheet open={!!detail} onClose={() => setDetail(null)} title={detail?.id ?? "請求詳情"} closeLabel="關閉請求詳情">
        {detail ? (
          <div className="space-y-5 p-5">
            <div className="flex flex-wrap items-center gap-2"><Badge variant={statusVariant(detail.status)}>{requestStatusLabels[detail.status]}</Badge><Badge variant="outline">示範資料</Badge><span className="font-mono text-xs text-muted-foreground">更新 {detail.updatedAgo}</span></div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
              <div><dt className="text-xs text-muted-foreground">模型</dt><dd className="mt-1 break-all">{modelName(detail.modelId)}</dd></div>
              <div><dt className="text-xs text-muted-foreground">經過時間</dt><dd className="mt-1 font-mono">{detail.elapsedSeconds.toFixed(1)}s</dd></div>
              <div><dt className="text-xs text-muted-foreground">輸入 tokens</dt><dd className="mt-1 font-mono">{formatInt(detail.promptTokens)}</dd></div>
              <div><dt className="text-xs text-muted-foreground">快取重用 tokens</dt><dd className="mt-1 font-mono">{detail.cachedPromptTokens != null ? formatInt(detail.cachedPromptTokens) : "尚未觀測"}</dd></div>
              <div><dt className="text-xs text-muted-foreground">輸出 tokens</dt><dd className="mt-1 font-mono">{formatInt(detail.outputTokens)}</dd></div>
              <div><dt className="text-xs text-muted-foreground">首 token 延遲</dt><dd className="mt-1 font-mono">{detail.ttftMs != null ? `${detail.ttftMs}ms` : "—"}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Prefill 樣本</dt><dd className="mt-1 font-mono">{detail.prefillTps != null ? `${detail.prefillTps} tok/s` : "—"}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Decode 樣本</dt><dd className="mt-1 font-mono">{detail.decodeTps != null ? `${detail.decodeTps} tok/s` : "—"}</dd></div>
            </dl>
            {detail.error ? <p role="status" className="rounded-lg border border-error-soft bg-error-soft px-3 py-2 text-xs leading-relaxed text-error">{detail.error}</p> : null}
            <p className="text-xs leading-5 text-muted-foreground">此筆 request 欄位是本機靜態示範樣本，不是從服務位址讀取，也不代表真實推理結果。</p>
          </div>
        ) : null}
      </Sheet>
    </Card>
  );
}

function MetricTile({
  icon,
  label,
  value,
  sparkTone,
  series,
  footnote,
  sparkLabel,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  sparkTone: "accent" | "success" | "info" | "warning";
  series: number[];
  footnote: string;
  sparkLabel: string;
}) {
  return (
    <StatCard
      compact
      valueFirst
      icon={icon}
      label={label}
      value={value}
      subtext={<div className="flex min-w-0 flex-col items-start justify-between gap-2 sm:flex-row sm:items-end"><span className="min-w-0 text-[10px] leading-4">{footnote}</span><Sparkline className="w-20 shrink-0" data={series} tone={sparkTone} label={sparkLabel} /></div>}
    />
  );
}

function ratioPercent(numerator: number, denominator: number): number | undefined {
  return denominator ? numerator / denominator : undefined;
}

function DashboardDataTable({ points, metric }: { points: readonly (typeof demoTelemetry)[DashboardRange]["points"][number][]; metric: ThroughputMetric }) {
  const metricName = metric === "decodeTps" ? "Decode" : "Prefill";
  const tableId = useId();
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3 rounded-lg border border-border/60 px-3 py-2 text-xs">
      <Button type="button" variant="ghost" size="sm" className="h-7 px-1 text-xs" aria-expanded={open} aria-controls={open ? tableId : undefined} onClick={() => setOpen((value) => !value)}>{open ? "收合圖表數值" : "檢視圖表數值"}<ChevronDown aria-hidden="true" size={13} className={open ? "rotate-180" : ""} /></Button>
      {open ? <div id={tableId} className="mt-2 max-h-56 overflow-auto">
        <Table scrollLabel="吞吐量圖表資料表">
          <Thead><Tr><Th>區間結束</Th><Th className="text-right">Decode tok/s</Th><Th className="text-right">Prefill tok/s</Th><Th className="text-right">Requests</Th></Tr></Thead>
          <Tbody>{points.map((point) => <Tr key={point.label}><Td>{point.label}</Td><Td className="text-right font-mono">{formatRate(point.decodeTps)}</Td><Td className="text-right font-mono">{formatRate(point.prefillTps)}</Td><Td className="text-right font-mono">{point.requests}</Td></Tr>)}</Tbody>
        </Table>
      </div> : null}
      <p className="mt-2 text-[10px] text-muted-foreground">圖表目前顯示 {metricName}；表格同時列出兩種速率。</p>
    </div>
  );
}

function CacheDataTable({ points }: { points: readonly (typeof demoTelemetry)[DashboardRange]["points"][number][] }) {
  const tableId = useId();
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-2 rounded-lg border border-border/60 px-3 py-2 text-xs">
      <Button type="button" variant="ghost" size="sm" className="h-7 px-1 text-xs" aria-expanded={open} aria-controls={open ? tableId : undefined} onClick={() => setOpen((value) => !value)}>{open ? "收合 cache 時間序列" : "檢視 cache 時間序列（表格）"}<ChevronDown aria-hidden="true" size={13} className={open ? "rotate-180" : ""} /></Button>
      {open ? <div id={tableId} className="mt-2 max-h-52 overflow-auto"><Table scrollLabel="Prefix cache 樣本資料表"><Thead><Tr><Th>區間結束</Th><Th className="text-right">Prompt</Th><Th className="text-right">重用 tokens</Th><Th className="text-right">Token 重用率</Th><Th className="text-right">Request hit</Th></Tr></Thead><Tbody>{points.map((point) => <Tr key={point.label}><Td>{point.label}</Td><Td className="text-right font-mono">{formatInt(point.promptTokens)}</Td><Td className="text-right font-mono">{formatInt(point.cachedPromptTokens)}</Td><Td className="text-right font-mono">{(point.cachedPromptTokens / point.promptTokens * 100).toFixed(1)}%</Td><Td className="text-right font-mono">{point.requestsWithPrefixReuse}/{point.requests}</Td></Tr>)}</Tbody></Table></div> : null}
    </div>
  );
}

export function DashboardView({ endpoint, items, loaded, navigate }: DashboardViewProps) {
  const [range, setRange] = useState<DashboardRange>("1h");
  const [metric, setMetric] = useState<ThroughputMetric>("decodeTps");
  const [scenario, setScenario] = useState<DashboardScenario>("snapshot");
  const modelOptions = useMemo(() => items.map((item) => ({ id: item.id, name: item.name })), [items]);
  const modelName = loaded ? modelOptions.find((model) => model.id === loaded)?.name ?? loaded : null;
  const allPoints = demoTelemetry[range].points;
  const requestPoints = scenario === "snapshot" ? allPoints : [];
  const memoryPoints = scenario === "offline" ? [] : allPoints;
  const windowRequests = requestPoints.reduce((sum, point) => sum + point.requests, 0);
  const meanDecode = weightedRate(requestPoints, "decodeTps");
  const meanPrefill = weightedRate(requestPoints, "prefillTps");
  const reusedTokens = requestPoints.reduce((sum, point) => sum + point.cachedPromptTokens, 0);
  const promptTokens = requestPoints.reduce((sum, point) => sum + point.promptTokens, 0);
  const tokenReuse = ratioPercent(reusedTokens, promptTokens);
  const latestMemory = memoryPoints.at(-1);
  const selectedMetric = metric === "decodeTps" ? "decodeTps" : "prefillTps";
  const metricAverage = metric === "decodeTps" ? meanDecode : meanPrefill;
  const latestRate = requestPoints.at(-1)?.[selectedMetric];
  const chartData = requestPoints.map((point) => ({ value: point[selectedMetric], label: point.label }));
  const tokenReuseData = requestPoints.map((point) => ({ value: (ratioPercent(point.cachedPromptTokens, point.promptTokens) ?? 0) * 100, label: point.label }));
  const totalRequestSamples = requestPoints.reduce((sum, point) => sum + point.requests, 0);
  const requestCacheReuse = ratioPercent(requestPoints.reduce((sum, point) => sum + point.requestsWithPrefixReuse, 0), totalRequestSamples);
  const engineAllocatedGb = latestMemory ? latestMemory.modelWeightsGb + latestMemory.activeKvGb + latestMemory.runtimeCacheGb : undefined;
  const engineAllocatedPercent = engineAllocatedGb != null ? (engineAllocatedGb / demoMemoryCapacityGb) * 100 : 0;
  const sampleRequests = scenario === "snapshot" ? demoRequests : [];
  const phaseCounts = sampleRequests.reduce<Record<RequestSample["status"], number>>((counts, request) => {
    counts[request.status] += 1;
    return counts;
  }, { queued: 0, prefill: 0, decode: 0, complete: 0, failed: 0 });
  const timeWindow = demoTelemetry[range];
  const visibleMemory = latestMemory;

  return (
    <section className="mx-auto w-full max-w-7xl space-y-5 px-4 py-6 sm:px-7 sm:py-8" data-testid="overview">
      <PageHeader
        title="推理引擎總覽"
        description="觀察服務資源、請求階段與吞吐量樣本。"
        actions={<div className="flex flex-wrap items-center gap-2"><Badge variant="warning">示範數據</Badge><Button type="button" variant="secondary" size="sm" onClick={() => navigate("/api")}>API 接入<ArrowRight size={13} /></Button></div>}
      />

      <Card className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3"><Server size={17} className="shrink-0 text-muted-foreground"/><div className="min-w-0"><p className="break-all font-mono text-xs">{endpoint}</p><p className="mt-1 text-[11px] text-muted-foreground">未連線 · 以下顯示固定示範快照</p></div></div>
        <div className="flex flex-wrap items-center gap-3"><SegmentedSelect aria-label="切換示範情境" value={scenario} onChange={setScenario} options={SCENARIO_OPTIONS}/><Button size="sm" variant="ghost" onClick={() => navigate("/settings")}>連線設定<ArrowRight size={13}/></Button></div>
      </Card>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <MetricTile icon={Activity} label="請求總數" value={scenario === "snapshot" ? formatInt(windowRequests) : scenario === "empty" ? "0" : "—"} sparkTone="accent" series={requestPoints.map((point) => point.requests)} footnote={scenario === "snapshot" ? `${timeWindow.title} · 總數` : scenario === "empty" ? "空請求示範" : "資料不可用"} sparkLabel="示範窗口內每區間請求數" />
        <MetricTile icon={Zap} label="Decode 平均" value={meanDecode != null ? `${formatRate(meanDecode)} tok/s` : "—"} sparkTone="success" series={requestPoints.map((point) => point.decodeTps)} footnote={meanDecode != null && latestMemory ? `依請求加權 · 最新區間 ${formatRate(requestPoints.at(-1)!.decodeTps)}` : "沒有速率樣本"} sparkLabel="示範窗口 Decode 速率採樣" />
        <MetricTile icon={Cpu} label="Prefill 平均" value={meanPrefill != null ? `${formatInt(meanPrefill)} tok/s` : "—"} sparkTone="info" series={requestPoints.map((point) => point.prefillTps)} footnote={meanPrefill != null ? `依請求加權 · 最新區間 ${formatInt(requestPoints.at(-1)!.prefillTps)}` : "沒有速率樣本"} sparkLabel="示範窗口 Prefill 速率採樣" />
        <MetricTile icon={Database} label="前綴快取重用率" value={tokenReuse != null ? `${(tokenReuse * 100).toFixed(1)}%` : "—"} sparkTone="warning" series={tokenReuseData.map((point) => point.value)} footnote={tokenReuse != null ? "重用 tokens ÷ prompt tokens" : "沒有 token 樣本"} sparkLabel="示範窗口 prefix token 重用率" />
      </div>

      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(340px,0.9fr)]">
        <Card className="min-w-0 p-4 sm:p-5">
          <div className="flex flex-col gap-4 border-b border-border/60 pb-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="text-sm font-semibold">推理吞吐量</h2><Badge variant="outline">{timeWindow.interval}採樣</Badge></div><p className="mt-1 text-xs text-muted-foreground">區分 Prefill 處理與 Decode 生成速度。</p></div>
            <div className="flex flex-wrap items-center gap-3 sm:justify-end">
              <div className="flex items-center gap-2"><span className="text-[11px] text-muted-foreground">指標</span><SegmentedSelect aria-label="選擇吞吐量指標" value={metric} onChange={setMetric} options={METRIC_OPTIONS} /></div>
              <div className="flex items-center gap-2"><span className="text-[11px] text-muted-foreground">範圍</span><SegmentedSelect aria-label="選擇吞吐量時間範圍" value={range} onChange={setRange} options={RANGE_OPTIONS} /></div>
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-3 py-4">
            <div><p className="text-[11px] text-muted-foreground">{metric === "decodeTps" ? "Decode" : "Prefill"} · {timeWindow.title}</p><p className="mt-1 text-2xl font-semibold tracking-tight">{metricAverage != null ? `${formatRate(metricAverage)} tok/s` : "—"}</p><p className="mt-1 text-[11px] text-muted-foreground">依請求數加權平均</p></div>
            <div className="text-right"><p className="text-[11px] text-muted-foreground">最新區間平均</p><p className="mt-1 font-mono text-sm">{latestRate != null ? `${formatRate(latestRate)} tok/s` : "—"}</p><p className="mt-1 text-[11px] text-muted-foreground">{requestPoints.at(-1)?.label ?? "無資料"}</p></div>
          </div>

          <AreaChart
            data={chartData}
            tone={metric === "decodeTps" ? "accent" : "info"}
            height={178}
            showGrid
            showTooltip
            ariaLabel={`${metric === "decodeTps" ? "Decode" : "Prefill"} tokens per second across ${timeWindow.title}`}
            noDataLabel={scenario === "empty" ? "此示範情境沒有請求採樣" : "示範資料不可用"}
            formatValue={(value) => `${formatRate(value)} tok/s`}
          />
          {chartData.length > 1 ? <p className="mt-1 flex justify-between text-[10px] text-muted-foreground"><span>{chartData[0]?.label}</span><span>{chartData.at(-1)?.label}</span></p> : null}
          <DashboardDataTable points={requestPoints} metric={metric} />
        </Card>

        <Card className="min-w-0 p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-4"><div><h2 className="text-sm font-semibold">記憶體配置</h2><p className="mt-1 text-xs text-muted-foreground">64 GB 示範裝置 · 各項配置占比</p></div><Badge variant="outline">{visibleMemory ? `${formatGb(demoMemoryCapacityGb)} 容量` : "無快照"}</Badge></div>
          {visibleMemory ? (
            <>
              <div className="flex items-center gap-4 py-4">
                <Gauge value={engineAllocatedPercent} size={82} thickness={7} tone="accent" ariaLabel={`示範引擎 allocator 使用 ${formatGb(engineAllocatedGb ?? 0)}，總容量 ${formatGb(demoMemoryCapacityGb)}`} label={<span className="text-[10px] font-semibold">{Math.round(engineAllocatedPercent)}%</span>} />
                <div className="min-w-0"><p className="text-[11px] text-muted-foreground">引擎記憶體配置</p><p className="mt-1 text-lg font-semibold">{formatGb(engineAllocatedGb ?? 0)}</p><p className="mt-1 text-[11px] text-muted-foreground">權重 + 活躍 KV + runtime cache</p></div>
              </div>
              <div className="space-y-3 border-t border-border/60 pt-4">
                {[
                  { label: "模型權重", value: visibleMemory.modelWeightsGb, tone: "accent" as const },
                  { label: "活躍 KV 配置", value: visibleMemory.activeKvGb, tone: "info" as const },
                  { label: "Runtime cache 配置", value: visibleMemory.runtimeCacheGb, tone: "warning" as const },
                  { label: "其他程序", value: visibleMemory.otherProcessGb, tone: "neutral" as const },
                  { label: "示範剩餘容量", value: visibleMemory.demoRemainingGb, tone: "success" as const },
                ].map((part) => <div key={part.label}><div className="mb-1 flex items-baseline justify-between gap-2 text-[11px]"><span className="text-muted-foreground">{part.label}</span><span className="font-mono tabular-nums text-foreground">{formatGb(part.value)} <span className="text-muted-foreground">({(part.value / demoMemoryCapacityGb * 100).toFixed(1)}%)</span></span></div><Progress label={part.label} value={part.value / demoMemoryCapacityGb * 100} className="h-1.5" /></div>)}
              </div>
              <div className="mt-4 rounded-lg border border-border/60 bg-muted/30 p-3"><div className="flex items-baseline justify-between gap-3"><p className="text-xs font-medium">引擎記憶體趨勢</p><p className="font-mono text-xs">{formatGb(engineAllocatedGb ?? 0)} / {formatGb(demoMemoryCapacityGb)}</p></div><AreaChart data={memoryPoints.map((point) => ({ value: point.modelWeightsGb + point.activeKvGb + point.runtimeCacheGb, label: point.label }))} tone="warning" height={88} showGrid={false} ariaLabel="示範引擎 allocator 記憶體配置趨勢" formatValue={(value) => formatGb(value)} noDataLabel="記憶體樣本不可用" /></div>
            </>
          ) : <EmptyState icon={<Cpu size={20} />} title="記憶體樣本不可用" description="切回快照或無請求示範情境查看獨立 allocator 樣本。" />}
        </Card>
      </div>

      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <Card className="min-w-0 p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-sm font-semibold">前綴快取效率</h2><p className="mt-1 text-xs text-muted-foreground">分別觀察重用的 token 比例與受益的請求比例。</p></div><Badge variant="outline">{timeWindow.title}</Badge></div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-border/70 bg-muted/20 p-3"><p className="text-[11px] text-muted-foreground">Token 重用率</p><p className="mt-1 text-xl font-semibold">{tokenReuse != null ? `${(tokenReuse * 100).toFixed(1)}%` : "—"}</p><p className="mt-1 font-mono text-[10px] text-muted-foreground">{!promptTokens ? "—" : `${formatInt(reusedTokens)} / ${formatInt(promptTokens)} prompt tokens`}</p></div>
            <div className="rounded-lg border border-border/70 bg-muted/20 p-3"><p className="text-[11px] text-muted-foreground">有重用的 request 比率</p><p className="mt-1 text-xl font-semibold">{requestCacheReuse != null ? `${(requestCacheReuse * 100).toFixed(1)}%` : "—"}</p><p className="mt-1 font-mono text-[10px] text-muted-foreground">{!totalRequestSamples ? "—" : `${requestPoints.reduce((sum, point) => sum + point.requestsWithPrefixReuse, 0)} / ${formatInt(totalRequestSamples)} requests`}</p></div>
          </div>
          <AreaChart data={tokenReuseData} tone="success" height={126} showXAxis={false} ariaLabel="KV prefix cached prompt token reuse ratio by sample interval" formatValue={(value) => `${value.toFixed(1)}%`} noDataLabel="此情境沒有 cache 樣本" />
          <CacheDataTable points={requestPoints} />
        </Card>

        <Card className="min-w-0 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3"><div><h2 className="text-sm font-semibold">請求階段</h2><p className="mt-1 text-xs text-muted-foreground">最近 10 筆示範記錄的狀態分布</p></div><Badge variant="outline">{sampleRequests.length} 筆樣本</Badge></div>
          {sampleRequests.length ? <div className="mt-4 space-y-3">{(Object.keys(requestStatusLabels) as RequestSample["status"][]).map((status) => { const count = phaseCounts[status]; const percent = count / sampleRequests.length * 100; return <div key={status}><div className="mb-1 flex items-center justify-between gap-2 text-[11px]"><span className="text-muted-foreground">{requestStatusLabels[status]}</span><span className="font-mono tabular-nums text-foreground">{count} <span className="text-muted-foreground">({percent.toFixed(0)}%)</span></span></div><Progress label={`${requestStatusLabels[status]} 示範 request 數量`} value={percent} className="h-1.5" /></div>; })}</div> : <EmptyState icon={<Activity size={20} />} title={scenario === "empty" ? "此快照沒有請求" : "請求樣本不可用"} description="這個狀態只切換前端示範，不會連線引擎。" />}
          <Button type="button" variant="ghost" size="sm" className="mt-4" onClick={() => navigate("/requests")}>開啟請求工作區<ArrowRight size={13} /></Button>
        </Card>
      </div>

      <RequestActivity
        requests={sampleRequests}
        modelOptions={modelOptions}
        title="最近請求"
        description="搜尋、篩選、匯出目前結果，或開啟單筆詳情。"
        maxRows={6}
        emptyTitle={scenario === "snapshot" ? "沒有符合條件的請求" : scenario === "empty" ? "此示範情境沒有請求" : "示範資料目前不可用"}
        emptyDescription={scenario === "snapshot" ? "調整搜尋或篩選條件。" : "切換回快照，查看示範記錄。"}
      />
      <p className="text-xs text-muted-foreground">圖表快照與模型庫操作獨立。模型庫目前模擬載入：{modelName ?? "無"}。<Button variant="ghost" size="sm" onClick={() => navigate("/models")}>管理模型<ArrowRight size={13}/></Button></p>
    </section>
  );
}
