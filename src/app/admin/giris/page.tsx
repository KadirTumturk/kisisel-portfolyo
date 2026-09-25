import { loginAdminAction } from "./actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ hata?: string }>;
}) {
  const params = await searchParams;
  const hasError = params.hata === "1";

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4">
      <h1 className="font-heading text-3xl text-ink">Admin girişi</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Mesajları ve içerikleri yönetmek için şifreni gir.
      </p>
      <form
        action={loginAdminAction}
        className="mt-8 space-y-4 rounded-2xl border border-border bg-white p-6 shadow-sm"
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
            className="h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-clay focus-visible:ring-2 focus-visible:ring-clay/30"
          />
        </div>
        {hasError ? (
          <p className="text-sm text-destructive">
            Şifre hatalı. Doğru şifre: <span className="font-mono">Ktby0128_</span> (K ve T büyük)
          </p>
        ) : null}
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-clay px-4 text-sm font-medium text-white hover:bg-clay/90"
        >
          Giriş yap
        </button>
      </form>
      <p className="mt-4 text-xs text-muted-foreground">
        Not: Şifre büyük/küçük harfe duyarlıdır. İlk harfler <strong>K</strong> ve{" "}
        <strong>T</strong> büyük olmalı.
      </p>
    </div>
  );
}
