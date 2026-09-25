"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  body: string;
  read: boolean;
  createdAt: string;
};

type Project = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  year: number;
  role: string | null;
  liveUrl: string | null;
  repoUrl: string | null;
  featured: boolean;
  sortOrder: number;
  technologies: { technology: { name: string } }[];
};

const fieldClass =
  "h-10 w-full rounded-xl border border-input bg-white px-3 text-sm outline-none focus-visible:border-clay focus-visible:ring-2 focus-visible:ring-clay/20";
const areaClass =
  "w-full rounded-xl border border-input bg-white px-3 py-2 text-sm outline-none focus-visible:border-clay focus-visible:ring-2 focus-visible:ring-clay/20";

export function AdminDashboard({
  messages,
  projects,
}: {
  messages: Message[];
  projects: Project[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"messages" | "projects">("messages");
  const [form, setForm] = useState({
    id: "",
    title: "",
    slug: "",
    summary: "",
    description: "",
    year: String(new Date().getFullYear()),
    role: "",
    liveUrl: "",
    repoUrl: "",
    featured: false,
    sortOrder: "10",
    technologies: "",
  });
  const [error, setError] = useState<string | null>(null);

  const unread = messages.filter((m) => !m.read).length;

  async function logout() {
    window.location.href = "/admin/cikis";
  }

  async function toggleRead(id: string, read: boolean) {
    await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });
    router.refresh();
  }

  async function deleteMessage(id: string) {
    if (!confirm("Mesaj silinsin mi?")) return;
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    router.refresh();
  }

  function editProject(p: Project) {
    setForm({
      id: p.id,
      title: p.title,
      slug: p.slug,
      summary: p.summary,
      description: p.description,
      year: String(p.year),
      role: p.role ?? "",
      liveUrl: p.liveUrl ?? "",
      repoUrl: p.repoUrl ?? "",
      featured: p.featured,
      sortOrder: String(p.sortOrder),
      technologies: p.technologies.map((t) => t.technology.name).join(", "),
    });
    setTab("projects");
  }

  async function saveProject(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const payload = {
      ...form,
      year: Number(form.year),
      sortOrder: Number(form.sortOrder),
    };
    const res = await fetch("/api/admin/projects", {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error ?? "Kayıt başarısız");
      return;
    }
    setForm({
      id: "",
      title: "",
      slug: "",
      summary: "",
      description: "",
      year: String(new Date().getFullYear()),
      role: "",
      liveUrl: "",
      repoUrl: "",
      featured: false,
      sortOrder: "10",
      technologies: "",
    });
    router.refresh();
  }

  async function deleteProject(id: string) {
    if (!confirm("Proje silinsin mi?")) return;
    await fetch("/api/admin/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6">
      <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-ink via-[#152038] to-clay p-6 text-white shadow-[0_30px_60px_-35px_rgba(29,79,255,0.55)] sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-white/60">Kontrol paneli</p>
            <h1 className="font-heading mt-2 text-3xl tracking-tight sm:text-4xl">Admin</h1>
            <p className="mt-2 text-sm text-white/70">Mesaj kutusu ve proje içerikleri</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-white/25 px-4 py-2 text-sm text-white/90 transition hover:bg-white/10"
          >
            Çıkış
          </button>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
            <p className="text-xs text-white/60">Toplam mesaj</p>
            <p className="mt-1 font-heading text-2xl">{messages.length}</p>
          </div>
          <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
            <p className="text-xs text-white/60">Okunmamış</p>
            <p className="mt-1 font-heading text-2xl">{unread}</p>
          </div>
          <div className="col-span-2 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur sm:col-span-1">
            <p className="text-xs text-white/60">Proje</p>
            <p className="mt-1 font-heading text-2xl">{projects.length}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 inline-flex rounded-full border border-border bg-white p-1 shadow-sm">
        <button
          type="button"
          onClick={() => setTab("messages")}
          className={`rounded-full px-4 py-2 text-sm transition ${
            tab === "messages" ? "bg-clay text-white" : "text-muted-foreground hover:text-ink"
          }`}
        >
          Mesajlar {unread > 0 ? `(${unread})` : ""}
        </button>
        <button
          type="button"
          onClick={() => setTab("projects")}
          className={`rounded-full px-4 py-2 text-sm transition ${
            tab === "projects" ? "bg-clay text-white" : "text-muted-foreground hover:text-ink"
          }`}
        >
          Projeler
        </button>
      </div>

      {tab === "messages" ? (
        <div className="mt-8 space-y-4">
          {messages.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-white/70 px-6 py-16 text-center text-muted-foreground">
              Henüz mesaj yok. İletişim formundan gelenler burada listelenir.
            </div>
          ) : (
            messages.map((m) => (
              <article
                key={m.id}
                className={`rounded-3xl border border-border bg-white p-5 shadow-[0_16px_40px_-30px_rgba(11,13,16,0.35)] sm:p-6 ${
                  m.read ? "opacity-75" : "ring-1 ring-clay/20"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-heading text-xl text-ink">{m.subject}</h2>
                      {!m.read ? (
                        <span className="rounded-full bg-clay/10 px-2 py-0.5 text-xs font-medium text-clay">
                          Yeni
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {m.name} · {m.email}
                      {m.phone ? ` · ${m.phone}` : ""}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(m.createdAt).toLocaleString("tr-TR")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => toggleRead(m.id, !m.read)}
                      className="rounded-full border border-border px-3 py-1.5 text-xs hover:bg-mist"
                    >
                      {m.read ? "Okunmadı yap" : "Okundu"}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMessage(m.id)}
                      className="rounded-full border border-destructive/30 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10"
                    >
                      Sil
                    </button>
                  </div>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-ink/90">
                  {m.body}
                </p>
              </article>
            ))
          )}
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <form
            onSubmit={saveProject}
            className="space-y-3 rounded-3xl border border-border bg-white p-5 shadow-[0_16px_40px_-30px_rgba(11,13,16,0.35)] sm:p-6"
          >
            <h2 className="font-heading text-2xl text-ink">
              {form.id ? "Proje düzenle" : "Yeni proje"}
            </h2>
            {(
              [
                ["title", "Başlık"],
                ["slug", "Slug (ornek-proje)"],
                ["year", "Yıl"],
                ["role", "Rol"],
                ["liveUrl", "Canlı URL"],
                ["repoUrl", "Repo URL"],
                ["sortOrder", "Sıra"],
                ["technologies", "Teknolojiler (virgülle)"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="space-y-1.5">
                <label htmlFor={key} className="text-sm font-medium text-ink">
                  {label}
                </label>
                <input
                  id={key}
                  className={fieldClass}
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  required={key === "title" || key === "slug" || key === "year"}
                />
              </div>
            ))}
            <div className="space-y-1.5">
              <label htmlFor="summary" className="text-sm font-medium text-ink">
                Özet
              </label>
              <textarea
                id="summary"
                className={areaClass}
                value={form.summary}
                onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                required
                rows={3}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="description" className="text-sm font-medium text-ink">
                Açıklama
              </label>
              <textarea
                id="description"
                className={areaClass}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                required
                rows={5}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              />
              Öne çıkan
            </label>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <button
              type="submit"
              className="inline-flex h-10 items-center rounded-xl bg-clay px-4 text-sm font-medium text-white hover:bg-clay/90"
            >
              Kaydet
            </button>
          </form>

          <div className="space-y-3">
            {projects.map((p) => (
              <div
                key={p.id}
                className="rounded-3xl border border-border bg-white p-5 shadow-[0_16px_40px_-30px_rgba(11,13,16,0.35)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-heading text-lg text-ink">{p.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      /{p.slug} · {p.year}
                      {p.featured ? " · Öne çıkan" : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => editProject(p)}
                      className="rounded-full border border-border px-3 py-1.5 text-xs hover:bg-mist"
                    >
                      Düzenle
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProject(p.id)}
                      className="rounded-full border border-destructive/30 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
