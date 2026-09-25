import { loginAdminAction } from "./actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ hata?: string }>;
}) {
  const params = await searchParams;
  const hasError = params.hata === "1";

  return (
    <div className="relative flex min-h-[78vh] items-center justify-center px-4 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-24 top-10 size-72 rounded-full bg-clay/10 blur-3xl" />
        <div className="absolute -right-16 bottom-0 size-80 rounded-full bg-ink/5 blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-clay">Yönetim</p>
          <h1 className="font-heading mt-3 text-4xl tracking-tight text-ink">Admin girişi</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Mesajları ve içerikleri yönetmek için oturum aç.
          </p>
        </div>

        <form
          action={loginAdminAction}
          className="space-y-5 rounded-3xl border border-border bg-white/90 p-7 shadow-[0_24px_60px_-32px_rgba(29,79,255,0.35)] backdrop-blur"
        >
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-ink">
              Şifre
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className="h-11 w-full rounded-xl border border-input bg-mist/40 px-3.5 text-sm outline-none transition focus-visible:border-clay focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-clay/25"
            />
          </div>
          {hasError ? (
            <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
              Şifre hatalı. Tekrar dene.
            </p>
          ) : null}
          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-clay text-sm font-medium text-white transition hover:bg-clay/90"
          >
            Giriş yap
          </button>
        </form>
      </div>
    </div>
  );
}
