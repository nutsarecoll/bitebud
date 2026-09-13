import { Activity, Baby, Bluetooth, CircleDot, Thermometer, Waves } from "lucide-react";
import { Card } from "@/components/ui/card";
import { productVisualCopy } from "@/lib/content";

export function ProductSystemVisual() {
  return (
    <Card className="relative overflow-hidden bg-surface p-5 sm:p-7">
      <div className="absolute inset-x-8 top-1/2 h-px bg-gradient-to-r from-transparent via-primary/28 to-transparent" />
      <div className="relative grid gap-5 sm:grid-cols-2">
        <div className="min-w-0 rounded-2xl border border-border bg-surface-elevated/88 p-5 shadow-soft">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground">
              {productVisualCopy.capTitle}
            </span>
            <Thermometer aria-hidden="true" className="size-5 text-primary" />
          </div>
          <div className="mx-auto flex aspect-square max-w-48 items-center justify-center rounded-full bg-gradient-to-br from-[#dce9e6] via-white to-[#f3cabc] p-5">
            <div className="flex size-32 items-center justify-center rounded-full border border-primary/18 bg-surface-elevated/82">
              <Baby aria-hidden="true" className="size-16 text-primary" />
            </div>
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-2 text-center text-xs font-semibold text-muted-foreground">
            {productVisualCopy.capSignals.map((signal) => (
              <span className="max-w-full rounded-full bg-muted px-3 py-2 [overflow-wrap:anywhere]" key={signal}>
                {signal}
              </span>
            ))}
          </div>
        </div>

        <div className="min-w-0 rounded-2xl border border-border bg-surface-elevated/88 p-5 shadow-soft">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground">
              {productVisualCopy.teetherTitle}
            </span>
            <Waves aria-hidden="true" className="size-5 text-coral" />
          </div>
          <div className="mx-auto flex aspect-square max-w-48 items-center justify-center">
            <div className="relative h-36 w-28 rounded-[2.2rem] border border-coral/30 bg-gradient-to-b from-[#ffe3d8] to-white shadow-soft">
              <div className="absolute left-1/2 top-5 size-10 -translate-x-1/2 rounded-full border border-coral/24 bg-surface-elevated/76" />
              <div className="absolute bottom-7 left-1/2 h-12 w-20 -translate-x-1/2 rounded-full border border-primary/14 bg-[#e4efed]" />
            </div>
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-2 text-center text-xs font-semibold text-muted-foreground">
            {productVisualCopy.teetherSignals.map((signal) => (
              <span className="max-w-full rounded-full bg-muted px-3 py-2 [overflow-wrap:anywhere]" key={signal}>
                {signal}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-5 flex max-w-sm items-center justify-center gap-3 rounded-full border border-border bg-surface-elevated/90 px-4 py-3 text-sm font-semibold shadow-line">
        <Bluetooth aria-hidden="true" className="size-4 text-primary" />
        <span>{productVisualCopy.connectedLabel}</span>
        <CircleDot aria-hidden="true" className="size-4 text-sage" />
      </div>

      <div className="mt-5 rounded-2xl border border-primary/12 bg-primary px-5 py-4 text-primary-foreground">
        <div className="flex items-start gap-3">
          <Activity aria-hidden="true" className="mt-1 size-5 shrink-0" />
          <p className="text-sm leading-6">
            {productVisualCopy.aiNote}
          </p>
        </div>
      </div>
    </Card>
  );
}
