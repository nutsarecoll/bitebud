import Link from "@/components/site/link";
import { footerCopy, navItems, productName } from "@/lib/content";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-elevated/64 px-5 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="text-lg font-bold">{productName}</p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            {footerCopy.body}
          </p>
        </div>
        <nav className="grid grid-cols-2 gap-3 text-sm" aria-label="Footer navigation">
          {navItems.map((item) => (
            <Link className="font-medium text-muted-foreground hover:text-foreground" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
