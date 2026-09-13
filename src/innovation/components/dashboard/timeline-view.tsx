"use client";

import { useMemo, useState } from "react";
import { Brain, SmilePlus, ThermometerSun, Waves, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { DashboardEvent, TimelineFilter } from "@/lib/dashboard-data";
import { timelineCopy, timelineFilters } from "@/lib/dashboard-data";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const icons: Record<DashboardEvent["kind"], LucideIcon> = {
  crying: SmilePlus,
  insight: Brain,
  motion: Zap,
  teether: Waves,
  temperature: ThermometerSun,
};

type TimelineViewProps = {
  events: DashboardEvent[];
};

export function TimelineView({ events }: TimelineViewProps) {
  const [activeFilter, setActiveFilter] = useState<TimelineFilter>("All");
  const visibleEvents = useMemo(
    () =>
      activeFilter === "All"
        ? events
        : events.filter((event) => event.period === activeFilter),
    [activeFilter, events],
  );

  return (
    <Card className="p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">{timelineCopy.label}</p>
          <h2 className="mt-1 text-2xl font-semibold">{timelineCopy.title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {timelineCopy.body}
          </p>
        </div>
        <div aria-label="Timeline filters" className="flex gap-2 overflow-x-auto pb-1">
          {timelineFilters.map((filter) => (
            <button
              aria-pressed={activeFilter === filter}
              className={cn(
                "rounded-full border border-border bg-surface-elevated px-4 py-2 text-sm font-semibold text-muted-foreground transition",
                activeFilter === filter && "border-primary bg-primary text-primary-foreground",
              )}
              key={filter}
              onClick={() => setActiveFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {visibleEvents.map((event) => {
          const Icon = icons[event.kind];

          return (
            <div className="grid grid-cols-[4.5rem_1fr] gap-3" key={event.id}>
              <p className="pt-2 text-xs font-bold text-muted-foreground">{event.time}</p>
              <div className="relative rounded-2xl border border-border bg-surface-elevated/82 p-4">
                <div className="flex gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
                    <Icon aria-hidden="true" className="size-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{event.title}</h3>
                      <span className="rounded-full bg-coral/18 px-2.5 py-1 text-xs font-bold text-accent-foreground">
                        {event.period}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
