import { benefits } from "@/lib/content";
import { FeatureCard } from "@/components/ui/feature-card";
import { MotionReveal } from "@/components/site/motion-reveal";

export function BenefitsGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {benefits.map((benefit, index) => (
        <MotionReveal delay={index * 0.04} key={benefit.title}>
          <FeatureCard {...benefit} />
        </MotionReveal>
      ))}
    </div>
  );
}
