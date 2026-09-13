import { Baby } from "lucide-react";
import Link from "@/components/site/link";
import { commonCtas, productName, navItems } from "@/lib/content";
import { ButtonLink } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/50 bg-background/86 px-5 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <Link className="flex items-center gap-3" href="/">
          <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Baby aria-hidden="true" className="size-5" />
          </span>
          <span className="text-base font-bold tracking-normal">{productName}</span>
        </Link>

        <nav
          aria-label="Primary navigation"
          className="order-3 flex w-full gap-5 overflow-x-auto pb-1 text-nowrap lg:order-none lg:w-auto lg:items-center lg:overflow-visible lg:pb-0"
        >
          {navItems.map((item) => (
            <Link
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink className="hidden sm:inline-flex" href="/app-preview" variant="secondary">
            {commonCtas.appPreview}
          </ButtonLink>
          <ButtonLink href="/bitebud">View BiteBud project</ButtonLink>
        </div>
      </div>
    </header>
  );
}
