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
    journey: "Journey",
    more: "More",
    contactTitle: "Let's work together",
    contactLead:
      "Messages are saved to MySQL and appear in the admin panel.",
    location: "Location",
    email: "Email",
    phone: "Phone",
    send: "Send message",
    thanks: "Thank you",
    thanksBody: "Your message was saved. Check Admin → Messages.",
    newMessage: "New message",
    portfolio: "Portfolio",
    downloadCv: "Download CV",
    printCv: "Print / Save PDF",
    themeLight: "Light",
    themeDark: "Dark",
    visits: "Visits",
  },
} as const;

export type Dictionary = (typeof dictionaries)[Locale];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.tr;
}
