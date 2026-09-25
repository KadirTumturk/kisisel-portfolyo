import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Dictionary, Locale } from "@/lib/i18n";

export function SiteHeader({
  name,
  dict,
  locale,
  theme,
  unreadCount = 0,
}: {
  name: string;
  dict: Dictionary;
  locale: Locale;
  theme: "light" | "dark";
  unreadCount?: number;
}) {
  const links = [
    { href: "/", label: dict.home },
    { href: "/projeler", label: dict.projects },
    { href: "/hakkinda", label: dict.about },
    { href: "/cv", label: dict.cv },
    { href: "/iletisim", label: dict.contact },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
        <Link
          href="/"
          className="font-heading text-lg font-semibold tracking-tight text-ink sm:text-xl"
        >
          {name}
          <span className="ml-1 text-clay">.</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-0.5 text-sm sm:gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-mist hover:text-ink sm:px-3",
              )}
            >
              {link.label}
            </Link>
          ))}
          {unreadCount > 0 ? (
            <Link
              href="/admin"
              className="ml-1 rounded-full bg-clay px-2.5 py-1 text-xs font-medium text-white"
              title="Okunmamış mesaj"
            >
              {unreadCount} yeni
            </Link>
          ) : null}
          <form action="/api/prefs" method="post" className="ml-1">
            <input type="hidden" name="locale" value={locale === "tr" ? "en" : "tr"} />
            <button
              type="submit"
              className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground hover:text-ink"
            >
              {locale === "tr" ? "EN" : "TR"}
            </button>
          </form>
          <form action="/api/prefs" method="post">
            <input type="hidden" name="theme" value={theme === "dark" ? "light" : "dark"} />
            <button
              type="submit"
              className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground hover:text-ink"
            >
              {theme === "dark" ? dict.themeLight : dict.themeDark}
            </button>
          </form>
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
    <footer className="mt-auto border-t border-border bg-background/60">
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
