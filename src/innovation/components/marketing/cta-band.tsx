import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { commonCtas, ctaBandCopy } from "@/lib/content";

export function CtaBand() {
  return (
    <section className="px-5 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl bg-primary p-8 text-primary-foreground shadow-soft sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary-foreground/72">
              {ctaBandCopy.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal">
              {ctaBandCopy.title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-primary-foreground/78">
              {ctaBandCopy.body}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink className="bg-primary-foreground text-primary hover:bg-primary-foreground" href="/app-preview">
              {commonCtas.appPreview}
              <ArrowRight aria-hidden="true" className="ml-2 size-4" />
            </ButtonLink>
            <ButtonLink
              className="border-primary-foreground/24 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/14"
              href="/contact"
              variant="secondary"
            >
              {commonCtas.joinWaitlist}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
