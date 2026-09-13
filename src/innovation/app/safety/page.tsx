import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { SafetyGrid } from "@/components/marketing/safety-grid";
import { SectionShell } from "@/components/site/section-shell";
import { Card } from "@/components/ui/card";
import { marketingPages } from "@/lib/content";

export default function SafetyPage() {
  const copy = marketingPages.safety;

  return (
    <>
      <PageHero
        description={copy.hero.description}
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
      >
        <Card className="bg-surface-elevated/90 p-6">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-primary">
            {copy.boundaryCard.eyebrow}
          </p>
          <h2 className="mt-4 text-3xl font-semibold">{copy.boundaryCard.title}</h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            {copy.boundaryCard.body}
          </p>
        </Card>
      </PageHero>

      <SectionShell
        description={copy.trust.description}
        eyebrow={copy.trust.eyebrow}
        title={copy.trust.title}
      >
        <SafetyGrid />
      </SectionShell>

      <SectionShell
        className="bg-surface-elevated/48"
        description={copy.alertLanguage.description}
        eyebrow={copy.alertLanguage.eyebrow}
        title={copy.alertLanguage.title}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {copy.alertLanguage.cards.map(([title, cardCopy]) => (
            <Card className="p-5" key={title}>
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{cardCopy}</p>
            </Card>
          ))}
        </div>
      </SectionShell>

      <CtaBand />
    </>
  );
}
