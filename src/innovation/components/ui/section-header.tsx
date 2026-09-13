import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
};

export function SectionHeader({ className, description, eyebrow, title }: SectionHeaderProps) {
  if (!eyebrow && !title && !description) {
    return null;
  }

  return (
    <div className={cn("mb-10 max-w-3xl", className)}>
      {eyebrow ? <Badge>{eyebrow}</Badge> : null}
      {title ? (
        <h2 className="mt-4 text-3xl font-semibold tracking-normal text-foreground sm:text-4xl">
          {title}
        </h2>
      ) : null}
      {description ? (
        <p className="mt-4 text-body text-muted-foreground sm:text-lead">{description}</p>
      ) : null}
    </div>
  );
}
