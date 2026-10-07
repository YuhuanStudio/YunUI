"use client";

import {
  BarChart,
  DonutChart,
  Heatmap,
  TimeSeriesChart,
  type ChartDatum,
  type TimeSeriesDefinition,
  type TimeSeriesPoint,
} from "@yuhuanowo/yunui";

export interface YunUIAnalyticsLabels {
  timeSeries: string;
  memoryBars: string;
  requestMix: string;
  modelWindowHeatmap: string;
  empty: string;
  unavailable: string;
  hiddenSeries: string;
  missingValue: string;
  seriesLegend: string;
  keyboardHint: string;
  formatX: (value: number) => string;
  formatSeriesValue: (value: number) => string;
  formatMemoryValue: (value: number) => string;
  formatRequestMixValue: (value: number) => string;
  formatHeatmapValue: (value: number) => string;
}

export interface YunUIAnalyticsProps {
  /** Host-selected, already sampled points. Chart components do not aggregate them. */
  samples: readonly TimeSeriesPoint[];
  series: readonly TimeSeriesDefinition[];
  memory: readonly ChartDatum[];
  requestMix: readonly ChartDatum[];
  modelRows: readonly string[];
  timeColumns: readonly string[];
  modelWindow: readonly (readonly (number | null)[])[];
  labels: YunUIAnalyticsLabels;
  activeX?: number | null;
  onActiveXChange?: (x: number | null) => void;
  onMemorySelect?: (datum: ChartDatum) => void;
  onRequestMixSelect?: (datum: ChartDatum) => void;
  onModelWindowSelect?: (rowIndex: number, columnIndex: number) => void;
}

/**
 * Compose public YunUI analytics charts around host-owned service data.
 * Provide query-scoped aggregates and translated labels from the host; this
 * recipe performs only shape mapping and no polling, fetching, or aggregation.
 */
export function YunUIAnalytics({
  samples,
  series,
  memory,
  requestMix,
  modelRows,
  timeColumns,
  modelWindow,
  labels,
  activeX,
  onActiveXChange,
  onMemorySelect,
  onRequestMixSelect,
  onModelWindowSelect,
}: YunUIAnalyticsProps) {
  return (
    <div className="grid min-w-0 gap-5 xl:grid-cols-2">
      <section className="min-w-0 space-y-2" aria-label={labels.timeSeries}>
        <TimeSeriesChart
          data={samples}
          series={series}
          ariaLabel={labels.timeSeries}
          emptyLabel={labels.empty}
          unavailableLabel={labels.unavailable}
          hiddenLabel={labels.hiddenSeries}
          missingValueLabel={labels.missingValue}
          legendLabel={labels.seriesLegend}
          keyboardHint={labels.keyboardHint}
          formatX={labels.formatX}
          formatY={labels.formatSeriesValue}
          activeX={activeX}
          onActiveXChange={onActiveXChange}
        />
      </section>
      <section className="min-w-0 space-y-2" aria-label={labels.memoryBars}>
        <BarChart
          data={memory}
          ariaLabel={labels.memoryBars}
          emptyLabel={labels.empty}
          unavailableLabel={labels.unavailable}
          formatValue={labels.formatMemoryValue}
          onSelect={onMemorySelect}
        />
      </section>
      <section className="min-w-0 space-y-2" aria-label={labels.requestMix}>
        <DonutChart
          data={requestMix}
          ariaLabel={labels.requestMix}
          emptyLabel={labels.empty}
          unavailableLabel={labels.unavailable}
          formatValue={labels.formatRequestMixValue}
          onSelect={onRequestMixSelect}
        />
      </section>
      <section className="min-w-0 space-y-2" aria-label={labels.modelWindowHeatmap}>
        <Heatmap
          rows={modelRows}
          columns={timeColumns}
          data={modelWindow}
          ariaLabel={labels.modelWindowHeatmap}
          emptyLabel={labels.empty}
          unavailableLabel={labels.unavailable}
          formatValue={labels.formatHeatmapValue}
          onSelect={onModelWindowSelect}
        />
      </section>
    </div>
  );
}
