export type Locale = "tr" | "en";

export const dictionaries = {
  tr: {
    home: "Ana sayfa",
    projects: "Projeler",
    about: "Hakkında",
    contact: "İletişim",
    cv: "CV",
    reachOut: "Bana ulaş",
    seeProjects: "Projeleri gör",
    selectedWork: "Seçili işler",
    all: "Tümü",
    skills: "Yetenekler",
    skillsTitle: "Ne ile çalışıyorum",
    education: "Eğitim",
    educationExperience: "Eğitim & deneyim",
    journey: "Yolculuk",
    more: "Daha fazla",
    contactTitle: "Birlikte çalışalım",
    contactLead:
      "Formu gönderince mesajın MySQL veri tabanına kaydolur ve admin panelinde görünür.",
    location: "Konum",
    email: "E-posta",
    phone: "Telefon",
    send: "Mesajı gönder",
    thanks: "Teşekkürler",
    thanksBody: "Mesajın kaydedildi. Admin → Mesajlar sekmesinde görebilirsin.",
    newMessage: "Yeni mesaj",
    portfolio: "Portfolyo",
    downloadCv: "CV indir",
    printCv: "Yazdır / PDF kaydet",
    themeLight: "Açık",
    themeDark: "Koyu",
    visits: "Ziyaret",
    fullStack: "Full Stack",
    heroBadge: "Portfolyo",
    heroPanelText: "Web arayüzleri, MySQL ve temiz kod ile kullanıcı odaklı çözümler.",
    featured: "Öne çıkan",
    view: "İncele",
    backToProjects: "← Projeler",
    liveSite: "Canlı site",
    noLiveLink: "Bu proje için canlı link bulunmuyor (ders / yerel demo).",
    projectsLead: "Web arayüzleri, ders laboratuvarları ve C++ uygulamalarından seçilmiş çalışmalar.",
    noProjects: "Henüz proje yok.",
    fullName: "Ad Soyad",
    namePlaceholder: "Adın",
    subject: "Konu",
    subjectPlaceholder: "Proje / iş teklifi",
    message: "Mesaj",
    messagePlaceholder: "Kısaca yaz...",
    phoneHint: "Zorunlu · sadece rakam · 10–11 hane",
    phonePlaceholder: "05421234567",
    phoneTitle: "Sadece rakam, 10 veya 11 hane",
    emailPlaceholder: "ornek@mail.com",
    unreadMessages: "okunmamış mesaj",
    newBadge: "yeni",
    levelBeginner: "Başlangıç",
    levelIntermediate: "Orta",
    levelGood: "İyi",
    errName: "Ad en az 2 karakter olmalı",
    errEmail: "Geçerli bir e-posta gir",
    errPhone: "Telefon zorunlu · sadece 10–11 rakam (örn. 05421234567)",
    errSubject: "Konu gerekli",
    errMessage: "Mesaj en az 10 karakter olmalı",
    errRateLimited: "Çok fazla istek gönderildi. Lütfen biraz bekleyip tekrar dene.",
    siteDescription:
      "Ankara Üniversitesi Bilgisayar Programcılığı öğrencisi. Web arayüzleri, veri tabanı ve uygulama geliştirme portfolyosu.",
    downloadPdf: "PDF indir",
  },
  en: {
    home: "Home",
    projects: "Projects",
    about: "About",
    contact: "Contact",
    cv: "CV",
    reachOut: "Contact me",
    seeProjects: "View projects",
    selectedWork: "Selected work",
    all: "All",
    skills: "Skills",
    skillsTitle: "What I work with",
    education: "Education",
    educationExperience: "Education & experience",
    journey: "Journey",
    more: "More",
    contactTitle: "Let's work together",
    contactLead:
      "When you submit the form, your message is saved to MySQL and appears in the admin panel.",
    location: "Location",
    email: "Email",
    phone: "Phone",
    send: "Send message",
    thanks: "Thank you",
    thanksBody: "Your message was saved. You can see it under Admin → Messages.",
    newMessage: "New message",
    portfolio: "Portfolio",
    downloadCv: "Download CV",
    printCv: "Print / Save PDF",
    themeLight: "Light",
    themeDark: "Dark",
    visits: "Visits",
    fullStack: "Full Stack",
    heroBadge: "Portfolio",
    heroPanelText: "User-focused solutions with web interfaces, MySQL, and clean code.",
    featured: "Featured",
    view: "View",
    backToProjects: "← Projects",
    liveSite: "Live site",
    noLiveLink: "No live link for this project (course / local demo).",
    projectsLead: "Selected work across web interfaces, course labs, and C++ applications.",
    noProjects: "No projects yet.",
    fullName: "Full name",
    namePlaceholder: "Your name",
    subject: "Subject",
    subjectPlaceholder: "Project / collaboration",
    message: "Message",
    messagePlaceholder: "Write briefly...",
    phoneHint: "Required · digits only · 10–11 digits",
    phonePlaceholder: "05421234567",
    phoneTitle: "Digits only, 10 or 11 digits",
    emailPlaceholder: "you@example.com",
    unreadMessages: "unread messages",
    newBadge: "new",
    levelBeginner: "Beginner",
    levelIntermediate: "Intermediate",
    levelGood: "Advanced",
    errName: "Name must be at least 2 characters",
    errEmail: "Enter a valid email",
    errPhone: "Phone required · digits only · 10–11 digits (e.g. 05421234567)",
    errSubject: "Subject is required",
    errMessage: "Message must be at least 10 characters",
    errRateLimited: "Too many requests. Please wait a bit and try again.",
    siteDescription:
      "Computer Programming student at Ankara University. Portfolio of web interfaces, databases, and application development.",
    downloadPdf: "Download PDF",
  },
} as const;

export type Dictionary = (typeof dictionaries)[Locale];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.tr;
}

/** İngilizce içerik karşılıkları (DB metinleri TR tutuluyor) */
export const contentEn = {
  title: "Full Stack Developer",
  bio: "I am a Computer Programming student at Ankara University and a software developer. I build modern web interfaces and dynamic systems with C++, HTML, CSS, and JavaScript. I focus on user-centered, practical solutions with project management and clean code principles.",
  location: "Ankara",
  experiences: {
    "Ankara Üniversitesi|Bilgisayar Programcılığı Öğrencisi": {
      organization: "Ankara University",
      role: "Computer Programming Student",
      description:
        "I build applied projects through software development, database, and cybersecurity coursework.",
    },
  } as Record<string, { organization: string; role: string; description?: string }>,
  projects: {
    "focus-frame": {
      title: "Focus.Frame",
      summary:
        "A responsive marketing site for a photography school — courses, mentors, and contact.",
      description:
        "Focus.Frame is a static website that presents a photography school's brand and training offer. It covers composition basics, landscape and portrait courses, the mentor team, and student reviews in one flow. It aims for a modern, section-by-section experience with semantic HTML and careful CSS.",
      role: "Frontend development / design implementation",
    },
    "gorsel-hesap-makinesi": {
      title: "Advanced visual calculator",
      summary:
        "A visual C++ calculator built with teammates that handles advanced math operations.",
      description:
        "A visual calculator written in C++. Beyond the four basic operations, it supports advanced math; the UI and calculation logic were designed together as a team project for desktop use.",
      role: "Team project — C++ development",
    },
    "siber-guvenlik-farkindalik": {
      title: "Cybersecurity awareness lab",
      summary:
        "A controlled educational demo on phishing / social engineering awareness using a banking-style interface for a cybersecurity course.",
      description:
        "An educational awareness project prepared for Ankara University's cybersecurity course. It was presented in class to show how users can spot fake login pages. It is not hosted live; it was used only within the course.",
      role: "Team / course project",
    },
  } as Record<string, { title: string; summary: string; description: string; role: string }>,
  skillLevels: {
    Başlangıç: "Beginner",
    Orta: "Intermediate",
    İyi: "Advanced",
  } as Record<string, string>,
  skillCategories: {
    Frontend: "Frontend",
    "Veri tabanı": "Database",
    Dil: "Language",
    Diğer: "Other",
  } as Record<string, string>,
  skillNames: {
    "Yapay Zeka": "Artificial Intelligence",
  } as Record<string, string>,
};

export function localizeLevel(locale: Locale, level: string | null | undefined) {
  if (!level) return null;
  if (locale === "en") return contentEn.skillLevels[level] ?? level;
  return level;
}

export function localizeSkillName(locale: Locale, name: string) {
  if (locale === "en") return contentEn.skillNames[name] ?? name;
  return name;
}

export function localizeCategory(locale: Locale, category: string | null | undefined) {
  if (!category) return null;
  if (locale === "en") return contentEn.skillCategories[category] ?? category;
  return category;
}

export function localizeExperience<
  T extends { organization: string; role: string; description?: string | null },
>(locale: Locale, exp: T): T {
  if (locale !== "en") return exp;
  const key = `${exp.organization}|${exp.role}`;
  const mapped = contentEn.experiences[key];
  if (!mapped) return exp;
  return {
    ...exp,
    organization: mapped.organization ?? exp.organization,
    role: mapped.role ?? exp.role,
    description: mapped.description ?? exp.description,
  };
}
