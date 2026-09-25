import Link from "next/link";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Ana sayfa" },
  { href: "/projeler", label: "Projeler" },
  { href: "/hakkinda", label: "Hakkında" },
  { href: "/iletisim", label: "İletişim" },
];

export function SiteHeader({ name }: { name: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link
          href="/"
          className="font-heading text-lg font-semibold tracking-tight text-ink sm:text-xl"
        >
          {name}
          <span className="ml-1 text-clay">.</span>
        </Link>
        <nav className="flex items-center gap-0.5 text-sm sm:gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-mist hover:text-ink",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  return (
    <footer className="mt-auto border-t border-border bg-white/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {new Date().getFullYear()} {name}
        </p>
        <a href={`mailto:${email}`} className="transition-colors hover:text-clay">
          {email}
        </a>
      </div>
    </footer>
  );
}
