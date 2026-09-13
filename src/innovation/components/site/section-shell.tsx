import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/section-header";

type SectionShellProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  id?: string;
};

export function SectionShell({
  children,
  className,
  description,
  eyebrow,
  id,
  title,
}: SectionShellProps) {
  return (
    <section className={cn("px-5 py-section sm:px-6 lg:px-8", className)} id={id}>
      <div className="mx-auto max-w-6xl">
        <SectionHeader description={description} eyebrow={eyebrow} title={title} />
        {children}
      </div>
    </section>
  );
}
