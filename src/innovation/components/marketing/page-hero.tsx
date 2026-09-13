import type { ReactNode } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { MotionReveal } from "@/components/site/motion-reveal";
import { commonCtas } from "@/lib/content";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  showCtas?: boolean;
};

export function PageHero({ children, description, eyebrow, showCtas = false, title }: PageHeroProps) {
  return (
    <section className="surface-grid px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
        <MotionReveal>
          <Badge>
            <Sparkles aria-hidden="true" className="mr-2 size-3.5" />
            {eyebrow}
          </Badge>
          <h1 className="mt-5 text-display font-semibold text-foreground">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lead text-muted-foreground">{description}</p>
          {showCtas ? (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/bitebud">
                View BiteBud project
                <ArrowRight aria-hidden="true" className="ml-2 size-4" />
              </ButtonLink>
              <ButtonLink href="/contact" variant="secondary">
                {commonCtas.joinWaitlist}
              </ButtonLink>
            </div>
          ) : null}
        </MotionReveal>
        {children ? <MotionReveal delay={0.1}>{children}</MotionReveal> : null}
      </div>
    </section>
  );
}
