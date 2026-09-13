import type { DashboardMetric } from "@/lib/dashboard-data";
import { StatCard } from "@/components/ui/stat-card";

type MetricCardProps = {
  metric: DashboardMetric;
  active: boolean;
  onSelect: () => void;
};

export function MetricCard({ active, metric, onSelect }: MetricCardProps) {
  return (
    <button
      aria-pressed={active}
      className="h-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      onClick={onSelect}
      type="button"
    >
      <StatCard
        active={active}
        comparison={metric.comparison}
        detail={metric.detail}
        icon={metric.icon}
        title={metric.title}
        tone={metric.tone}
        value={metric.value}
      />
    </button>
  );
}
