import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type StatCardTone = "teal" | "coral" | "sage";

type StatCardProps = {
  title: string;
  value: string;
  comparison: string;
  detail: string;
  icon: LucideIcon;
  tone?: StatCardTone;
  active?: boolean;
  eyebrow?: string;
  className?: string;
};

const tones: Record<StatCardTone, string> = {
  coral: "bg-coral/18 text-accent-foreground",
  sage: "bg-sage/22 text-primary",
  teal: "bg-surface-soft text-primary",
};

export function StatCard({
  active = false,
  className,
  comparison,
  detail,
  eyebrow = "vs baseline",
  icon: Icon,
  title,
  tone = "teal",
  value,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "h-full p-4 transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lift",
        active && "border-primary bg-surface-elevated",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={cn("flex size-10 items-center justify-center rounded-full", tones[tone])}>
          <Icon aria-hidden="true" className="size-5" />
        </div>
        <span className="rounded-full bg-surface-elevated/80 px-2.5 py-1 text-xs font-bold text-muted-foreground shadow-line">
          {eyebrow}
        </span>
      </div>
      <p className="mt-5 text-sm font-semibold text-muted-foreground">{title}</p>
      <p className="mt-2 text-3xl font-semibold tracking-normal">{value}</p>
      <p className="mt-2 text-sm font-bold text-primary">{comparison}</p>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{detail}</p>
    </Card>
  );
}
