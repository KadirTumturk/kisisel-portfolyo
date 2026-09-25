import { requireProfile } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "İletişim",
};

const fieldClass =
  "h-10 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none focus-visible:border-clay focus-visible:ring-2 focus-visible:ring-clay/30";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; hata?: string }>;
}) {
  const profile = await requireProfile();
  const params = await searchParams;
  const ok = params.ok === "1";
  const error = params.hata ? decodeURIComponent(params.hata) : null;

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-24 pt-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-clay">İletişim</p>
        <h1 className="font-heading mt-2 text-4xl tracking-tight text-ink sm:text-5xl">
          Birlikte çalışalım
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          Formu gönderince mesajın MySQL veri tabanına kaydolur ve admin panelinde görünür.
        </p>
        <dl className="mt-10 space-y-5 text-sm">
          <div>
            <dt className="text-muted-foreground">E-posta</dt>
            <dd className="mt-1">
              <a href={`mailto:${profile.email}`} className="font-medium text-ink hover:text-clay">
                {profile.email}
              </a>
            </dd>
          </div>
          {profile.phone ? (
            <div>
              <dt className="text-muted-foreground">Telefon</dt>
              <dd className="mt-1 font-medium text-ink">{profile.phone}</dd>
            </div>
          ) : null}
          <div>
            <dt className="text-muted-foreground">Konum</dt>
            <dd className="mt-1 font-medium text-ink">{profile.location}</dd>
          </div>
        </dl>
      </div>

      {ok ? (
        <div className="space-y-4 rounded-2xl border border-border bg-white p-6 shadow-[0_20px_50px_-30px_rgba(29,79,255,0.35)] sm:p-8">
          <h2 className="font-heading text-2xl text-ink">Teşekkürler</h2>
          <p className="text-muted-foreground">
            Mesajın kaydedildi. Admin → Mesajlar sekmesinde görebilirsin.
          </p>
          <a
            href="/iletisim"
            className="inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm hover:bg-mist"
          >
            Yeni mesaj
          </a>
        </div>
      ) : (
        <form
          action="/api/messages/form"
          method="post"
          className="space-y-5 rounded-2xl border border-border bg-white p-6 shadow-[0_20px_50px_-30px_rgba(11,13,16,0.25)] sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Ad Soyad
              </label>
              <input
                id="name"
                name="name"
                required
                minLength={2}
                maxLength={80}
                placeholder="Adın"
                className={fieldClass}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                E-posta
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                maxLength={120}
                placeholder="ornek@mail.com"
                className={fieldClass}
              />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Telefon <span className="text-destructive">*</span>
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
                title="Sadece rakam, 10 veya 11 hane"
                placeholder="05421234567"
                className={fieldClass}
              />
              <p className="text-xs text-muted-foreground">Zorunlu · sadece rakam · 10–11 hane</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Konu
              </label>
              <input
                id="subject"
                name="subject"
                required
                minLength={2}
                maxLength={120}
                placeholder="Proje / iş teklifi"
                className={fieldClass}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="body" className="text-sm font-medium">
              Mesaj
            </label>
            <textarea
              id="body"
              name="body"
              required
              minLength={10}
              maxLength={2000}
              rows={6}
              placeholder="Kısaca yaz..."
              className="w-full rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none focus-visible:border-clay focus-visible:ring-2 focus-visible:ring-clay/30"
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-clay px-4 text-sm font-medium text-white hover:bg-clay/90"
          >
            Mesajı gönder
          </button>
        </form>
      )}
    </div>
  );
}
