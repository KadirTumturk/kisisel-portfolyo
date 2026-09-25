"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { logoutAdminAction } from "@/app/admin/actions";

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

type Skill = {
  id: string;
  name: string;
  level: string | null;
  category: string | null;
  sortOrder: number;
};

type Experience = {
  id: string;
  organization: string;
  role: string;
  description: string | null;
  type: string;
  startYear: number;
  endYear: number | null;
  sortOrder: number;
};

const fieldClass =
  "h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:border-clay focus-visible:ring-2 focus-visible:ring-clay/20";
const areaClass =
  "w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-clay focus-visible:ring-2 focus-visible:ring-clay/20";

type Tab = "messages" | "projects" | "skills" | "education";

export function AdminDashboard({
  messages,
  projects,
  skills,
  experiences,
  visitCount,
}: {
  messages: Message[];
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  visitCount: number;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("messages");
  const [error, setError] = useState<string | null>(null);
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
  const [skillForm, setSkillForm] = useState({
    id: "",
    name: "",
    level: "",
    category: "",
    sortOrder: "10",
  });
  const [expForm, setExpForm] = useState({
    id: "",
    organization: "",
    role: "",
    description: "",
    type: "education",
    startYear: "2025",
    endYear: "2027",
    sortOrder: "10",
  });

  const unread = messages.filter((m) => !m.read).length;

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
    const res = await fetch("/api/admin/projects", {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, year: Number(form.year), sortOrder: Number(form.sortOrder) }),
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

  async function saveSkill(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/admin/skills", {
      method: skillForm.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...skillForm, sortOrder: Number(skillForm.sortOrder) }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error ?? "Kayıt başarısız");
      return;
    }
    setSkillForm({ id: "", name: "", level: "", category: "", sortOrder: "10" });
    router.refresh();
  }

  async function deleteSkill(id: string) {
    if (!confirm("Yetenek silinsin mi?")) return;
    await fetch("/api/admin/skills", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  }

  async function saveExp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/admin/experiences", {
      method: expForm.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...expForm,
        startYear: Number(expForm.startYear),
        endYear: expForm.endYear ? Number(expForm.endYear) : null,
        sortOrder: Number(expForm.sortOrder),
      }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error ?? "Kayıt başarısız");
      return;
    }
    setExpForm({
      id: "",
      organization: "",
      role: "",
      description: "",
      type: "education",
      startYear: "2025",
      endYear: "2027",
      sortOrder: "10",
    });
    router.refresh();
  }

  async function deleteExp(id: string) {
    if (!confirm("Kayıt silinsin mi?")) return;
    await fetch("/api/admin/experiences", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "messages", label: `Mesajlar${unread ? ` (${unread})` : ""}` },
    { id: "projects", label: "Projeler" },
    { id: "skills", label: "Yetenekler" },
    { id: "education", label: "Eğitim" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6">
      <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-ink via-[#152038] to-clay p-6 text-white shadow-[0_30px_60px_-35px_rgba(29,79,255,0.55)] sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-white/60">Kontrol paneli</p>
            <h1 className="font-heading mt-2 text-3xl tracking-tight sm:text-4xl">Admin</h1>
            <p className="mt-2 text-sm text-white/70">Mesajlar, projeler, yetenekler ve eğitim</p>
          </div>
          <form action={logoutAdminAction}>
            <button
              type="submit"
              className="rounded-full border border-white/25 px-4 py-2 text-sm text-white/90 transition hover:bg-white/10"
            >
              Çıkış yap
            </button>
          </form>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
            <p className="text-xs text-white/60">Mesaj</p>
            <p className="mt-1 font-heading text-2xl">{messages.length}</p>
          </div>
          <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
            <p className="text-xs text-white/60">Okunmamış</p>
            <p className="mt-1 font-heading text-2xl">{unread}</p>
          </div>
          <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
            <p className="text-xs text-white/60">Proje</p>
            <p className="mt-1 font-heading text-2xl">{projects.length}</p>
          </div>
          <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
            <p className="text-xs text-white/60">Ziyaret</p>
            <p className="mt-1 font-heading text-2xl">{visitCount}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-1 rounded-full border border-border bg-card p-1 shadow-sm">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setTab(t.id);
              setError(null);
            }}
            className={`rounded-full px-3 py-2 text-sm transition sm:px-4 ${
              tab === t.id ? "bg-clay text-white" : "text-muted-foreground hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

      {tab === "messages" ? (
        <div className="mt-8 space-y-4">
          {messages.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border px-6 py-16 text-center text-muted-foreground">
              Henüz mesaj yok.
            </div>
          ) : (
            messages.map((m) => (
              <article
                key={m.id}
                className={`rounded-3xl border border-border bg-card p-5 sm:p-6 ${
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
                      className="rounded-full border border-destructive/30 px-3 py-1.5 text-xs text-destructive"
                    >
                      Sil
                    </button>
                  </div>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">{m.body}</p>
              </article>
            ))
          )}
        </div>
      ) : null}

      {tab === "projects" ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <form onSubmit={saveProject} className="space-y-3 rounded-3xl border border-border bg-card p-5 sm:p-6">
            <h2 className="font-heading text-2xl">{form.id ? "Proje düzenle" : "Yeni proje"}</h2>
            {(
              [
                ["title", "Başlık"],
                ["slug", "Slug"],
                ["year", "Yıl"],
                ["role", "Rol"],
                ["liveUrl", "Canlı URL"],
                ["repoUrl", "Repo URL"],
                ["sortOrder", "Sıra"],
                ["technologies", "Teknolojiler (virgülle)"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="space-y-1.5">
                <label className="text-sm font-medium">{label}</label>
                <input
                  className={fieldClass}
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  required={key === "title" || key === "slug" || key === "year"}
                />
              </div>
            ))}
            <textarea
              className={areaClass}
              rows={3}
              placeholder="Özet"
              value={form.summary}
              onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
              required
            />
            <textarea
              className={areaClass}
              rows={5}
              placeholder="Açıklama"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              required
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              />
              Öne çıkan
            </label>
            <button type="submit" className="rounded-xl bg-clay px-4 py-2 text-sm text-white">
              Kaydet
            </button>
          </form>
          <div className="space-y-3">
            {projects.map((p) => (
              <div key={p.id} className="rounded-3xl border border-border bg-card p-5">
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="font-heading text-lg">{p.title}</p>
                    <p className="text-xs text-muted-foreground">
                      /{p.slug} · {p.year}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className="rounded-full border px-3 py-1 text-xs" onClick={() => editProject(p)}>
                      Düzenle
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-destructive/30 px-3 py-1 text-xs text-destructive"
                      onClick={() => deleteProject(p.id)}
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {tab === "skills" ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <form onSubmit={saveSkill} className="space-y-3 rounded-3xl border border-border bg-card p-5">
            <h2 className="font-heading text-2xl">{skillForm.id ? "Yetenek düzenle" : "Yeni yetenek"}</h2>
            {(["name", "level", "category", "sortOrder"] as const).map((key) => (
              <div key={key} className="space-y-1.5">
                <label className="text-sm font-medium">
                  {key === "name"
                    ? "Ad"
                    : key === "level"
                      ? "Seviye"
                      : key === "category"
                        ? "Kategori"
                        : "Sıra"}
                </label>
                <input
                  className={fieldClass}
                  value={skillForm[key]}
                  onChange={(e) => setSkillForm((f) => ({ ...f, [key]: e.target.value }))}
                  required={key === "name"}
                />
              </div>
            ))}
            <button type="submit" className="rounded-xl bg-clay px-4 py-2 text-sm text-white">
              Kaydet
            </button>
          </form>
          <div className="space-y-3">
            {skills.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-3xl border border-border bg-card p-4">
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {[s.category, s.level].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-full border px-3 py-1 text-xs"
                    onClick={() =>
                      setSkillForm({
                        id: s.id,
                        name: s.name,
                        level: s.level ?? "",
                        category: s.category ?? "",
                        sortOrder: String(s.sortOrder),
                      })
                    }
                  >
                    Düzenle
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-destructive/30 px-3 py-1 text-xs text-destructive"
                    onClick={() => deleteSkill(s.id)}
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {tab === "education" ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <form onSubmit={saveExp} className="space-y-3 rounded-3xl border border-border bg-card p-5">
            <h2 className="font-heading text-2xl">{expForm.id ? "Kayıt düzenle" : "Yeni eğitim/deneyim"}</h2>
            {(
              [
                ["organization", "Kurum"],
                ["role", "Rol / bölüm"],
                ["type", "Tür (education/work)"],
                ["startYear", "Başlangıç yılı"],
                ["endYear", "Bitiş yılı"],
                ["sortOrder", "Sıra"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="space-y-1.5">
                <label className="text-sm font-medium">{label}</label>
                <input
                  className={fieldClass}
                  value={expForm[key]}
                  onChange={(e) => setExpForm((f) => ({ ...f, [key]: e.target.value }))}
                  required={key === "organization" || key === "role" || key === "startYear"}
                />
              </div>
            ))}
            <textarea
              className={areaClass}
              rows={3}
              placeholder="Açıklama"
              value={expForm.description}
              onChange={(e) => setExpForm((f) => ({ ...f, description: e.target.value }))}
            />
            <button type="submit" className="rounded-xl bg-clay px-4 py-2 text-sm text-white">
              Kaydet
            </button>
          </form>
          <div className="space-y-3">
            {experiences.map((e) => (
              <div key={e.id} className="rounded-3xl border border-border bg-card p-4">
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="font-medium">{e.organization}</p>
                    <p className="text-sm text-muted-foreground">{e.role}</p>
                    <p className="text-xs text-muted-foreground">
                      {e.startYear}
                      {e.endYear ? `–${e.endYear}` : "–"} · {e.type}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded-full border px-3 py-1 text-xs"
                      onClick={() =>
                        setExpForm({
                          id: e.id,
                          organization: e.organization,
                          role: e.role,
                          description: e.description ?? "",
                          type: e.type,
                          startYear: String(e.startYear),
                          endYear: e.endYear ? String(e.endYear) : "",
                          sortOrder: String(e.sortOrder),
                        })
                      }
                    >
                      Düzenle
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-destructive/30 px-3 py-1 text-xs text-destructive"
                      onClick={() => deleteExp(e.id)}
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
