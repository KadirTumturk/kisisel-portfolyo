import { ContactForm } from "@/components/contact-form";
import { requireProfile } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "İletişim",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; hata?: string }>;
}) {
  const profile = await requireProfile();
  const params = await searchParams;

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-24 pt-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-clay">İletişim</p>
        <h1 className="font-heading mt-2 text-4xl tracking-tight text-ink sm:text-5xl">
          Birlikte çalışalım
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          Proje, staj veya iş birliği için formu doldurman yeterli. Mesajın doğrudan veri
          tabanıma düşer; admin panelinden görürüm.
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
      <ContactForm
        initialOk={params.ok === "1"}
        initialError={params.hata ? decodeURIComponent(params.hata) : undefined}
      />
    </div>
  );
}
