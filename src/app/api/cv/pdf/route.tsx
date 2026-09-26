import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireProfile } from "@/lib/data";
import {
  contentEn,
  getDictionary,
  localizeExperience,
  localizeLevel,
  localizeSkillName,
} from "@/lib/i18n";

export const runtime = "nodejs";

export async function GET() {
  const jar = await cookies();
  const locale = jar.get("locale")?.value === "en" ? "en" : "tr";
  const dict = getDictionary(locale);
  const profile = await requireProfile();

  const title = locale === "en" ? contentEn.title : profile.title;
  const bio = locale === "en" ? contentEn.bio : profile.bio;
  const location = locale === "en" ? contentEn.location : profile.location;

  const { Document, Page, Text, View, StyleSheet, renderToBuffer } = await import(
    "@react-pdf/renderer"
  );

  const styles = StyleSheet.create({
    page: {
      paddingTop: 40,
      paddingBottom: 44,
      paddingHorizontal: 44,
      fontSize: 11,
      color: "#0b0d10",
      fontFamily: "Helvetica",
      lineHeight: 1.35,
    },
    h1: { fontSize: 24, fontWeight: 700 },
    h2: { fontSize: 13, fontWeight: 700, marginTop: 18, marginBottom: 8 },
    muted: { color: "#5b6472" },
    row: { display: "flex", flexDirection: "row", justifyContent: "space-between", gap: 12 },
    pill: {
      border: "1 solid #e2e6ee",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      marginRight: 6,
      marginBottom: 6,
    },
    hr: { height: 1, backgroundColor: "#e2e6ee", marginTop: 12 },
  });

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.row}>
          <View>
            <Text style={styles.h1}>{profile.name}</Text>
            <Text style={{ marginTop: 4, fontSize: 12, color: "#1d4fff" }}>{title}</Text>
            <Text style={{ marginTop: 6, ...styles.muted }}>
              {location}
              {profile.email ? ` · ${profile.email}` : ""}
              {profile.phone ? ` · ${profile.phone}` : ""}
            </Text>
          </View>
          <View>
            {profile.githubUrl ? <Text style={{ ...styles.muted }}>{profile.githubUrl}</Text> : null}
            {profile.linkedinUrl ? (
              <Text style={{ marginTop: 4, ...styles.muted }}>{profile.linkedinUrl}</Text>
            ) : null}
          </View>
        </View>

        <Text style={{ marginTop: 12, ...styles.muted }}>{bio}</Text>
        <View style={styles.hr} />

        <Text style={styles.h2}>{dict.skills}</Text>
        <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
          {profile.skills.map((s) => {
            const level = localizeLevel(locale, s.level);
            const name = localizeSkillName(locale, s.name);
            return (
              <View key={s.id} style={styles.pill}>
                <Text>
                  {name}
                  {level ? ` · ${level}` : ""}
                </Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.h2}>{dict.education}</Text>
        {profile.experiences.map((e) => {
          const exp = localizeExperience(locale, e);
          return (
            <View key={e.id} style={{ marginBottom: 10 }}>
              <Text style={styles.muted}>
                {e.startYear}
                {e.endYear ? `–${e.endYear}` : "–"}
              </Text>
              <Text>
                {exp.organization} — {exp.role}
              </Text>
              {exp.description ? <Text style={styles.muted}>{exp.description}</Text> : null}
            </View>
          );
        })}

        <Text style={styles.h2}>{dict.projects}</Text>
        {profile.projects.map((p) => {
          const en = contentEn.projects[p.slug];
          const titleText = locale === "en" && en ? en.title : p.title;
          const summaryText = locale === "en" && en ? en.summary : p.summary;
          const tech = p.technologies.map((t) => t.technology.name).join(" · ");
          return (
            <View key={p.id} style={{ marginBottom: 10 }}>
              <Text>
                {titleText} <Text style={styles.muted}>({p.year})</Text>
              </Text>
              <Text style={styles.muted}>{summaryText}</Text>
              {tech ? <Text style={{ marginTop: 2, ...styles.muted }}>{tech}</Text> : null}
            </View>
          );
        })}
      </Page>
    </Document>
  );

  const buffer = await renderToBuffer(doc);
  const filename = `Kadir-Tumturk-CV-${locale.toUpperCase()}.pdf`;

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=\"${filename}\"`,
      "Cache-Control": "no-store",
    },
  });
}

