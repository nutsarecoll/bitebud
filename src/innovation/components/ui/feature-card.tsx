import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type FeatureCardItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type FeatureCardProps = FeatureCardItem & {
  headingLevel?: "h2" | "h3";
  className?: string;
};

export function FeatureCard({
  className,
  description,
  headingLevel = "h3",
  icon: Icon,
  title,
}: FeatureCardProps) {
  const Heading = headingLevel;

  return (
    <Card className={cn("h-full p-5", className)}>
      <div className="mb-5 flex size-11 items-center justify-center rounded-full bg-muted text-primary">
        <Icon aria-hidden="true" className="size-5" />
      </div>
      <Heading className="text-lg font-semibold">{title}</Heading>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
    </Card>
  );
}
