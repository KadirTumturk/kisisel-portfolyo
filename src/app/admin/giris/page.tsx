"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error ?? "Şifre hatalı");
        setLoading(false);
        return;
      }
      // Cookie oturumu için soft navigate yerine tam sayfa geçişi
      window.location.assign("/admin");
    } catch {
      setError("Bağlantı hatası. Tekrar dene.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4">
      <h1 className="font-heading text-3xl text-ink">Admin girişi</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Mesajları ve içerikleri yönetmek için şifreni gir.
      </p>
      <form
        onSubmit={onSubmit}
        method="post"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-clay focus-visible:ring-2 focus-visible:ring-clay/30"
          />
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-clay px-4 text-sm font-medium text-white hover:bg-clay/90 disabled:opacity-50"
        >
          {loading ? "Giriş yapılıyor..." : "Giriş yap"}
        </button>
      </form>
    </div>
  );
}
