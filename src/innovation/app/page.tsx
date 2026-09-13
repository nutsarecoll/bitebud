import { ArrowRight, CheckCircle2 } from "lucide-react";
import { AppPreviewPanel } from "@/components/marketing/app-preview-panel";
import { BenefitsGrid } from "@/components/marketing/benefits-grid";
import { CtaBand } from "@/components/marketing/cta-band";
import { DataFlow } from "@/components/marketing/data-flow";
import { PageHero } from "@/components/marketing/page-hero";
import { ProductSystemVisual } from "@/components/marketing/product-system-visual";
import { SafetyGrid } from "@/components/marketing/safety-grid";
import { SectionShell } from "@/components/site/section-shell";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { marketingPages } from "@/lib/content";

export default function HomePage() {
  const copy = marketingPages.home;

  return (
    <>
      <PageHero
        description={copy.hero.description}
        eyebrow={copy.hero.eyebrow}
        showCtas
        title={copy.hero.title}
      >
        <ProductSystemVisual />
      </PageHero>

      <SectionShell
        description={copy.connectedSystem.description}
        eyebrow={copy.connectedSystem.eyebrow}
        title={copy.connectedSystem.title}
      >
        <BenefitsGrid />
      </SectionShell>

      <SectionShell
        className="bg-surface-elevated/48"
        description={copy.dataFlow.description}
        eyebrow={copy.dataFlow.eyebrow}
        title={copy.dataFlow.title}
      >
        <DataFlow />
      </SectionShell>

      <SectionShell
        description={copy.appPreview.description}
        eyebrow={copy.appPreview.eyebrow}
        title={copy.appPreview.title}
      >
        <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="space-y-4">
              {copy.appPreview.bullets.map((item) => (
                <div className="flex gap-3" key={item}>
                  <CheckCircle2 aria-hidden="true" className="mt-1 size-5 shrink-0 text-primary" />
                  <p className="text-base leading-7 text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <ButtonLink href="/app-preview" variant="secondary">
                {copy.appPreview.cta}
                <ArrowRight aria-hidden="true" className="ml-2 size-4" />
              </ButtonLink>
            </div>
          </div>
          <AppPreviewPanel />
        </div>
      </SectionShell>

      <SectionShell
        className="bg-surface-soft/72"
        description={copy.trust.description}
        eyebrow={copy.trust.eyebrow}
        title={copy.trust.title}
      >
        <SafetyGrid />
      </SectionShell>

      <SectionShell
        description={copy.peaceOfMind.description}
        eyebrow={copy.peaceOfMind.eyebrow}
        title={copy.peaceOfMind.title}
      >
        <Card className="grid gap-6 overflow-hidden p-6 md:grid-cols-3">
          {copy.peaceOfMind.moments.map(([title, momentCopy]) => (
            <div className="rounded-2xl bg-muted/70 p-5" key={title}>
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-primary">{title}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{momentCopy}</p>
            </div>
          ))}
        </Card>
      </SectionShell>

      <CtaBand />
    </>
  );
}
