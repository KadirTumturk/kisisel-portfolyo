import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.message.deleteMany();
  await prisma.projectTechnology.deleteMany();
  await prisma.project.deleteMany();
  await prisma.technology.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.profile.deleteMany();

  const profile = await prisma.profile.create({
    data: {
      name: "Kadir Tümtürk",
      title: "Full Stack Developer",
      bio: "Ankara Üniversitesi Bilgisayar Programcılığı öğrencisi ve yazılım geliştiriciyim. C++, HTML, CSS ve JavaScript teknolojileriyle modern web arayüzleri ve dinamik sistemler inşa ediyorum. Proje yönetimi ve temiz kod prensipleriyle kullanıcı odaklı, işlevsel çözümler üretmeye odaklanıyorum.",
      location: "Ankara",
      email: "kdrtumturk98@gmail.com",
      phone: "0542 389 84 05",
      githubUrl: "https://github.com/KadirTumturk",
      linkedinUrl: "https://www.linkedin.com/in/kadir-t%C3%BCmt%C3%BCrk/",
    },
  });

  const techNames = [
    { name: "HTML", category: "Frontend" },
    { name: "CSS", category: "Frontend" },
    { name: "JavaScript", category: "Frontend" },
    { name: "C++", category: "Dil" },
    { name: "MySQL", category: "Veri tabanı" },
  ];

  const techs = await Promise.all(
    techNames.map((t) =>
      prisma.technology.create({
        data: t,
      }),
    ),
  );

  const byName = Object.fromEntries(techs.map((t) => [t.name, t.id]));

  const focus = await prisma.project.create({
    data: {
      profileId: profile.id,
      title: "Focus.Frame",
      slug: "focus-frame",
      summary:
        "Fotoğrafçılık okulu için responsive tanıtım sitesi; kurslar, eğitmenler ve iletişim odaklı.",
      description:
        "Focus.Frame, bir fotoğrafçılık okulunun markasını ve eğitim teklifini anlatan statik bir web sitesi. Kompozisyon temelleri, manzara ve portre kurslarını; mentor kadrosunu ve öğrenci yorumlarını tek akışta sunuyor. Semantik HTML ve özenli CSS ile modern, bölüm bölüm okunan bir tanıtım deneyimi hedefleniyor.",
      year: 2026,
      role: "Frontend geliştirme / tasarım uygulaması",
      liveUrl: "https://kadirtumturk.github.io/HTML-CSS-PROJECT/",
      repoUrl: "https://github.com/KadirTumturk/HTML-CSS-PROJECT",
      featured: true,
      sortOrder: 1,
    },
  });

  const calc = await prisma.project.create({
    data: {
      profileId: profile.id,
      title: "İleri seviye görsel hesap makinesi",
      slug: "gorsel-hesap-makinesi",
      summary:
        "C++ ile arkadaşlarla geliştirilen, ileri düzey matematik işlemlerini yapan görsel arayüzlü hesap makinesi.",
      description:
        "C++ ile yazılmış görsel hesap makinesi. Temel dört işlemin ötesinde ileri düzey matematik işlemlerini destekler; arayüz ve hesaplama mantığı arkadaşlarla birlikte kurgulandı. Masaüstü ortamında çalışan, kullanıcı dostu bir araç olarak tasarlandı.",
      year: 2025,
      role: "Ekip projesi — C++ geliştirme",
      featured: true,
      sortOrder: 2,
    },
  });

  const cyber = await prisma.project.create({
    data: {
      profileId: profile.id,
      title: "Siber güvenlik farkındalık laboratuvarı",
      slug: "siber-guvenlik-farkindalik",
      summary:
        "Siber güvenlik dersi kapsamında, bankacılık arayüzü üzerinden phishing / sosyal mühendislik farkındalığı için kontrollü eğitim demosu.",
      description:
        "Ankara Üniversitesi siber güvenlik dersi için hazırlanan eğitim amaçlı farkındalık çalışması. Kullanıcıların sahte giriş sayfalarını nasıl ayırt edebileceğini göstermek üzere sınıf ortamında sunulan bir demo. Canlı ortamda barındırılmıyor; yalnızca ders kapsamında kullanıldı.",
      year: 2025,
      role: "Ekip / ders projesi",
      featured: true,
      sortOrder: 3,
    },
  });

  await prisma.projectTechnology.createMany({
    data: [
      { projectId: focus.id, technologyId: byName.HTML },
      { projectId: focus.id, technologyId: byName.CSS },
      { projectId: cyber.id, technologyId: byName.HTML },
      { projectId: cyber.id, technologyId: byName.CSS },
      { projectId: cyber.id, technologyId: byName.JavaScript },
      { projectId: calc.id, technologyId: byName["C++"] },
    ],
  });

  await prisma.skill.createMany({
    data: [
      { profileId: profile.id, name: "HTML", level: "İyi", category: "Frontend", sortOrder: 1 },
      { profileId: profile.id, name: "CSS", level: "İyi", category: "Frontend", sortOrder: 2 },
      { profileId: profile.id, name: "JavaScript", level: "Orta", category: "Frontend", sortOrder: 3 },
      { profileId: profile.id, name: "MySQL", level: "Orta", category: "Veri tabanı", sortOrder: 4 },
      { profileId: profile.id, name: "C++", level: "Orta", category: "Dil", sortOrder: 5 },
      { profileId: profile.id, name: "Yapay Zeka", level: "Başlangıç", category: "Diğer", sortOrder: 6 },
    ],
  });

  await prisma.experience.create({
    data: {
      profileId: profile.id,
      organization: "Ankara Üniversitesi",
      role: "Bilgisayar Programcılığı Öğrencisi",
      description:
        "Yazılım geliştirme, veri tabanı ve siber güvenlik dersleriyle uygulamalı projeler üretiyorum.",
      type: "education",
      startYear: 2025,
      endYear: 2027,
      sortOrder: 1,
    },
  });

  console.log("Seed tamamlandı:", profile.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
