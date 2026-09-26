import { requireProfile } from "@/lib/data";
import { contentEn, getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/prefs";

export const dynamic = "force-dynamic";

const fieldClass =
  "h-10 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none focus-visible:border-clay focus-visible:ring-2 focus-visible:ring-clay/30";

export async function generateMetadata() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  return { title: dict.contact };
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; hata?: string }>;
}) {
  const profile = await requireProfile();
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const location = locale === "en" ? contentEn.location : profile.location;
  const params = await searchParams;
  const ok = params.ok === "1";
  const error = params.hata ? decodeURIComponent(params.hata) : null;

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-24 pt-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-clay">{dict.contact}</p>
        <h1 className="font-heading mt-2 text-4xl tracking-tight text-ink sm:text-5xl">
          {dict.contactTitle}
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">{dict.contactLead}</p>
        <dl className="mt-10 space-y-5 text-sm">
          <div>
            <dt className="text-muted-foreground">{dict.email}</dt>
            <dd className="mt-1">
              <a href={`mailto:${profile.email}`} className="font-medium text-ink hover:text-clay">
                {profile.email}
              </a>
            </dd>
          </div>
          {profile.phone ? (
            <div>
              <dt className="text-muted-foreground">{dict.phone}</dt>
              <dd className="mt-1 font-medium text-ink">{profile.phone}</dd>
            </div>
          ) : null}
          <div>
            <dt className="text-muted-foreground">{dict.location}</dt>
            <dd className="mt-1 font-medium text-ink">{location}</dd>
          </div>
        </dl>
      </div>

      {ok ? (
        <div className="space-y-4 rounded-2xl border border-border bg-white p-6 shadow-[0_20px_50px_-30px_rgba(29,79,255,0.35)] sm:p-8">
          <h2 className="font-heading text-2xl text-ink">{dict.thanks}</h2>
          <p className="text-muted-foreground">{dict.thanksBody}</p>
          <a
            href="/iletisim"
            className="inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm hover:bg-mist"
          >
            {dict.newMessage}
          </a>
        </div>
      ) : (
        <form
          action="/api/messages/form"
          method="post"
          className="space-y-5 rounded-2xl border border-border bg-white p-6 shadow-[0_20px_50px_-30px_rgba(11,13,16,0.25)] sm:p-8"
        >
          <div className="hidden" aria-hidden>
            <label htmlFor="company">Company</label>
            <input
              id="company"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              defaultValue=""
              className={fieldClass}
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                {dict.fullName}
              </label>
              <input
                id="name"
                name="name"
                required
                minLength={2}
                maxLength={80}
                placeholder={dict.namePlaceholder}
                className={fieldClass}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                {dict.email}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                maxLength={120}
                placeholder={dict.emailPlaceholder}
                className={fieldClass}
              />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                {dict.phone} <span className="text-destructive">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                inputMode="numeric"
                autoComplete="tel"
                required
                minLength={10}
                maxLength={11}
                pattern="[0-9]{10,11}"
                title={dict.phoneTitle}
                placeholder={dict.phonePlaceholder}
                className={fieldClass}
              />
              <p className="text-xs text-muted-foreground">{dict.phoneHint}</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                {dict.subject}
              </label>
              <input
                id="subject"
                name="subject"
                required
                minLength={2}
                maxLength={120}
                placeholder={dict.subjectPlaceholder}
                className={fieldClass}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="body" className="text-sm font-medium">
              {dict.message}
            </label>
            <textarea
              id="body"
              name="body"
              required
              minLength={10}
              maxLength={2000}
              rows={6}
              placeholder={dict.messagePlaceholder}
              className="w-full rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none focus-visible:border-clay focus-visible:ring-2 focus-visible:ring-clay/30"
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-clay px-4 text-sm font-medium text-white hover:bg-clay/90"
          >
            {dict.send}
          </button>
        </form>
      )}
    </div>
  );
}
