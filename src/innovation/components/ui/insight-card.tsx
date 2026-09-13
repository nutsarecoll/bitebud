import { Brain, Sparkles } from "lucide-react";
import type { Insight } from "@/lib/dashboard-data";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type InsightCardProps = {
  insights: Insight[];
  title: string;
  description: string;
  featured?: boolean;
  className?: string;
};

export function InsightCard({
  className,
  description,
  featured = false,
  insights,
  title,
}: InsightCardProps) {
  const Icon = featured ? Sparkles : Brain;

  return (
    <Card
      className={cn(
        featured ? "bg-primary p-5 text-primary-foreground" : "brand-panel p-5",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-full",
            featured ? "bg-surface-elevated/14" : "bg-surface-soft text-primary",
          )}
        >
          <Icon aria-hidden="true" className="size-5" />
        </div>
        <div>
          <p
            className={cn(
              "text-sm font-semibold",
              featured ? "text-primary-foreground/72" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-normal">{title}</h2>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {insights.map((insight) => (
          <div
            className={cn(
              "rounded-xl p-4",
              featured ? "bg-surface-elevated/10" : "bg-surface-soft/68",
            )}
            key={insight.title}
          >
            <h3 className="font-semibold">{insight.title}</h3>
            <p
              className={cn(
                "mt-2 text-sm leading-6",
                featured ? "text-primary-foreground/78" : "text-muted-foreground",
              )}
            >
              {insight.body}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
