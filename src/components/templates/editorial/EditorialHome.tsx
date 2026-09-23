import type { Brand } from "@prisma/client";
import EdChapters, { type Chapter } from "@/components/templates/editorial/EdChapters";
import EdClosing from "@/components/templates/editorial/EdClosing";
import EdHero from "@/components/templates/editorial/EdHero";
import EdOutlets from "@/components/templates/editorial/EdOutlets";
import EdProductList from "@/components/templates/editorial/EdProductList";
import EdStatement from "@/components/templates/editorial/EdStatement";
import { getSections } from "@/lib/content";
import { mapsLink, whatsappUrl } from "@/lib/format";
import { EDITORIAL_PLACEHOLDER, realPhoto } from "@/lib/placeholder";
import { prisma } from "@/lib/prisma";
import { branchLabel, parseChapters, shortHours } from "@/lib/site";

/**
 * Beranda template Editorial (mis. Bolu Sunyaragi): sinematik, lega, gerak kalem.
 * Produk hanya nama + harga; foto khusus untuk suasana (hero, cerita, outlet).
 */
export default async function EditorialHome({ brand }: { brand: Brand }) {
  const [homeSections, storySections, items, branches] = await Promise.all([
    getSections(brand.id, "home"),
    getSections(brand.id, "story"),
    prisma.menuItem.findMany({
      where: { brandId: brand.id, isAvailable: true },
      orderBy: [{ isFeatured: "desc" }, { category: { order: "asc" } }, { order: "asc" }],
      take: 6,
      select: { id: true, name: true, price: true },
    }),
    prisma.branch.findMany({ where: { brandId: brand.id }, orderBy: { order: "asc" } }),
  ]);

  const section = (list: typeof homeSections, key: string) => list.find((s) => s.key === key)?.data;
  const hero = section(homeSections, "hero") ?? {};
  const intro = section(homeSections, "intro");
  const process = section(homeSections, "chapters");
  const story = (key: string) => section(storySections, key);

  // Babak cerita: dari admin ("Judul | isi"), atau disusun dari konten Cerita yang sudah ada.
  const fromAdmin = parseChapters(process?.items);
  const fallback = [
    story("history") && { title: story("history")?.title ?? "Awal mulanya", body: story("history")?.body ?? "" },
    story("profile") && { title: story("profile")?.title ?? `Tentang ${brand.name}`, body: story("profile")?.body ?? "" },
    story("atmosphere") && { title: story("atmosphere")?.title ?? "Suasana", body: story("atmosphere")?.body ?? "" },
  ].filter((c): c is { title: string; body: string } => Boolean(c));
  const chapterImages = [realPhoto(process?.imageUrl), ...EDITORIAL_PLACEHOLDER.chapters].filter((u): u is string => Boolean(u));
  const chapters: Chapter[] = (fromAdmin.length ? fromAdmin : fallback).map((c, i) => ({
    ...c,
    image: chapterImages[i % chapterImages.length],
  }));

  const wa = branches.find((b) => b.whatsapp);
  const waHref = wa?.whatsapp ? whatsappUrl(wa.whatsapp, `Halo ${brand.name}, saya mau pesan.`) : null;

  const outlets = branches.map((b, i) => ({
    id: b.id,
    name: branchLabel(b.name),
    address: b.address,
    hours: shortHours(b.openHours),
    mapsUrl: mapsLink(b),
    photo: EDITORIAL_PLACEHOLDER.outlets[i % EDITORIAL_PLACEHOLDER.outlets.length],
  }));

  return (
    <>
      <EdHero
        title={hero.title ?? brand.name}
        subtitle={hero.subtitle ?? brand.tagline}
        imageUrl={realPhoto(hero.imageUrl) ?? EDITORIAL_PLACEHOLDER.hero}
        videoUrl={hero.videoUrl}
        primary={{ href: "/menu", label: "Lihat menu" }}
        secondary={waHref ? { href: waHref, label: "Pesan lewat WhatsApp", external: true } : { href: "/cabang", label: "Kunjungi toko" }}
      />

      <EdStatement label="Tentang kami" text={intro?.body ?? story("profile")?.body ?? brand.tagline ?? brand.name} />

      {items.length > 0 && <EdProductList items={items} />}

      {chapters.length > 0 && <EdChapters heading="Cerita & proses" chapters={chapters} />}

      {outlets.length > 0 && <EdOutlets outlets={outlets} />}

      <EdClosing
        href={waHref ?? "/cabang"}
        external={Boolean(waHref)}
        label={waHref ? "Pesan lewat WhatsApp" : "Kunjungi toko kami"}
        note={waHref ? "Pesan dulu, tinggal ambil. Atau minta dikirim ke rumah." : "Datang langsung, bolu selalu baru tiap pagi."}
      />
    </>
  );
}
