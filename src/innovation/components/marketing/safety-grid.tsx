import { safetyPrinciples } from "@/lib/content";
import { FeatureCard } from "@/components/ui/feature-card";

export function SafetyGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {safetyPrinciples.map((principle) => (
        <FeatureCard {...principle} key={principle.title} />
      ))}
    </div>
  );
}
