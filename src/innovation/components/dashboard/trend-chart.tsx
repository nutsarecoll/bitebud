import type { TrendPoint } from "@/lib/dashboard-data";
import { chartLegendCopy } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

type TrendChartProps = {
  data: TrendPoint[];
  variant?: "line" | "bar";
  suffix?: string;
};

export function TrendChart({ data, suffix = "", variant = "line" }: TrendChartProps) {
  const values = data.flatMap((point) => [point.value, point.baseline]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);
  const width = 320;
  const height = 150;
  const xStep = width / Math.max(data.length - 1, 1);
  const yFor = (value: number) => height - ((value - min) / range) * 106 - 22;
  const linePath = data
    .map((point, index) => `${index === 0 ? "M" : "L"} ${index * xStep} ${yFor(point.value)}`)
    .join(" ");
  const baselinePath = data
    .map((point, index) => `${index === 0 ? "M" : "L"} ${index * xStep} ${yFor(point.baseline)}`)
    .join(" ");

  if (variant === "bar") {
    const barWidth = 24;

    return (
      <div className="mt-5">
        <div className="flex h-40 items-end justify-between gap-2 rounded-2xl bg-muted/50 px-4 py-4">
          {data.map((point) => {
            const heightPercent = 24 + ((point.value - min) / range) * 68;
            const baselinePercent = 24 + ((point.baseline - min) / range) * 68;

            return (
              <div className="flex min-w-0 flex-1 flex-col items-center gap-2" key={point.label}>
                <div className="relative flex h-28 w-full items-end justify-center">
                  <span
                    className="absolute left-1/2 w-8 -translate-x-1/2 border-t border-dashed border-primary/45"
                    style={{ bottom: `${baselinePercent}%` }}
                  />
                  <span
                    aria-label={`${point.label}: ${point.value}${suffix}`}
                    className="block rounded-t-full bg-primary"
                    style={{ height: `${heightPercent}%`, width: `${barWidth}px` }}
                  />
                </div>
                <span className="truncate text-[0.68rem] font-semibold text-muted-foreground">
                  {point.label}
                </span>
              </div>
            );
          })}
        </div>
        <ChartLegend />
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-2xl bg-muted/50 p-4">
      <svg
        aria-label="Trend chart compared with baseline"
        className="h-40 w-full overflow-visible"
        preserveAspectRatio="none"
        role="img"
        viewBox={`0 0 ${width} ${height}`}
      >
        <path d={baselinePath} fill="none" stroke="rgba(42, 72, 77, 0.35)" strokeDasharray="5 5" strokeWidth="2" />
        <path d={linePath} fill="none" stroke="#2f646b" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        {data.map((point, index) => (
          <circle cx={index * xStep} cy={yFor(point.value)} fill="#2f646b" key={point.label} r="4" />
        ))}
      </svg>
      <div className="mt-2 flex justify-between gap-2">
        {data.map((point) => (
          <span className="text-[0.68rem] font-semibold text-muted-foreground" key={point.label}>
            {point.label}
          </span>
        ))}
      </div>
      <ChartLegend />
    </div>
  );
}

function ChartLegend() {
  return (
    <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold text-muted-foreground">
      <span className="inline-flex items-center gap-2">
        <span className="size-2 rounded-full bg-primary" />
        {chartLegendCopy.today}
      </span>
      <span className="inline-flex items-center gap-2">
        <span className={cn("h-px w-5 border-t border-dashed border-primary/50")} />
        {chartLegendCopy.baseline}
      </span>
    </div>
  );
}
