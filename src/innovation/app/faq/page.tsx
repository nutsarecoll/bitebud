import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { SectionShell } from "@/components/site/section-shell";
import { Card } from "@/components/ui/card";
import { faqItems, marketingPages } from "@/lib/content";

export default function FaqPage() {
  const copy = marketingPages.faq;

  return (
    <>
      <PageHero
        description={copy.hero.description}
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
      >
        <Card className="p-6">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-primary">
            {copy.shortVersion.eyebrow}
          </p>
          <p className="mt-4 text-2xl font-semibold leading-snug">
            {copy.shortVersion.body}
          </p>
        </Card>
      </PageHero>

      <SectionShell eyebrow={copy.details.eyebrow} title={copy.details.title}>
        <div className="grid gap-4">
          {faqItems.map((item) => (
            <Card className="p-5" key={item.question}>
              <h2 className="text-lg font-semibold">{item.question}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.answer}</p>
            </Card>
          ))}
        </div>
      </SectionShell>

      <CtaBand />
    </>
  );
}
