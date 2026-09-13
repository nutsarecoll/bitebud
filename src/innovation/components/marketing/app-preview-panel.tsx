import { BellOff, Brain, ChevronRight, Moon, ThermometerSun } from "lucide-react";
import { appMetrics, appPreviewPanelCopy } from "@/lib/content";
import { Card } from "@/components/ui/card";

export function AppPreviewPanel() {
  return (
    <Card className="overflow-hidden bg-surface p-4 sm:p-6">
      <div className="mx-auto max-w-sm rounded-[2rem] border border-border bg-primary p-3 shadow-soft">
        <div className="rounded-[1.55rem] bg-background p-4">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {appPreviewPanelCopy.eyebrow}
              </p>
              <h3 className="text-xl font-semibold">{appPreviewPanelCopy.title}</h3>
            </div>
            <span className="rounded-full bg-sage/30 px-3 py-1 text-xs font-bold text-primary">
              {appPreviewPanelCopy.status}
            </span>
          </div>

          <div className="rounded-2xl bg-surface-elevated p-4 shadow-line">
            <div className="flex items-start gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-muted text-primary">
                <Brain aria-hidden="true" className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">{appPreviewPanelCopy.summaryLabel}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {appPreviewPanelCopy.summary}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            {appMetrics.map((metric) => (
              <div className="rounded-2xl bg-surface-elevated p-4 shadow-line" key={metric.label}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                      {metric.label}
                    </p>
                    <p className="mt-1 text-lg font-semibold">{metric.value}</p>
                  </div>
                  <ChevronRight aria-hidden="true" className="size-5 text-muted-foreground" />
                </div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{metric.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-primary/12 bg-surface-soft p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <BellOff aria-hidden="true" className="size-4 text-primary" />
              {appPreviewPanelCopy.notificationMode}
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {appPreviewPanelCopy.notificationDetail}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface-elevated/82 p-4">
          <ThermometerSun aria-hidden="true" className="mb-3 size-5 text-coral" />
          {appPreviewPanelCopy.temperatureNote}
        </div>
        <div className="rounded-2xl border border-border bg-surface-elevated/82 p-4">
          <Moon aria-hidden="true" className="mb-3 size-5 text-primary" />
          {appPreviewPanelCopy.motionNote}
        </div>
      </div>
    </Card>
  );
}
