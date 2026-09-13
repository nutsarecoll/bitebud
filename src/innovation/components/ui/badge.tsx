import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border border-border bg-surface-elevated/76 px-3 py-1 text-eyebrow uppercase text-muted-foreground shadow-line",
        className,
      )}
      {...props}
    />
  );
}
