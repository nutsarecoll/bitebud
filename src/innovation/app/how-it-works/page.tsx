import { CtaBand } from "@/components/marketing/cta-band";
import { DataFlow } from "@/components/marketing/data-flow";
import { PageHero } from "@/components/marketing/page-hero";
import { ProductSystemVisual } from "@/components/marketing/product-system-visual";
import { SectionShell } from "@/components/site/section-shell";
import { FeatureCard } from "@/components/ui/feature-card";
import { marketingPages } from "@/lib/content";

export default function HowItWorksPage() {
  const copy = marketingPages.howItWorks;

  return (
    <>
      <PageHero
        description={copy.hero.description}
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
      >
        <ProductSystemVisual />
      </PageHero>

      <SectionShell
        description={copy.systemView.description}
        eyebrow={copy.systemView.eyebrow}
        title={copy.systemView.title}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {copy.systemView.cards.map((item) => (
            <FeatureCard
              description={item.description}
              headingLevel="h2"
              icon={item.icon}
              key={item.title}
              title={item.title}
            />
          ))}
        </div>
      </SectionShell>

      <SectionShell
        className="bg-surface-elevated/48"
        description={copy.dataFlow.description}
        eyebrow={copy.dataFlow.eyebrow}
        title={copy.dataFlow.title}
      >
        <DataFlow />
      </SectionShell>

      <CtaBand />
    </>
  );
}
