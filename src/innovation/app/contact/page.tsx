import { PageHero } from "@/components/marketing/page-hero";
import { SectionShell } from "@/components/site/section-shell";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FeatureCard } from "@/components/ui/feature-card";
import { commonCtas, marketingPages, productName } from "@/lib/content";

export default function ContactPage() {
  const copy = marketingPages.contact;

  return (
    <>
      <PageHero
        description={copy.hero.description}
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
      >
        <Card className="p-6">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-primary">
            {copy.card.eyebrow}
          </p>
          <h2 className="mt-4 text-3xl font-semibold">{copy.card.title}</h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            {copy.card.body}
          </p>
          <div className="mt-6">
            <ButtonLink href={`mailto:hello@bitebud.example?subject=${productName}%20waitlist`}>
              {commonCtas.joinWaitlist}
            </ButtonLink>
          </div>
        </Card>
      </PageHero>

      <SectionShell
        description={copy.section.description}
        eyebrow={copy.section.eyebrow}
        title={copy.section.title}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {copy.section.cards.map((item) => (
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
    </>
  );
}
