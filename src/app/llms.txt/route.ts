// /llms.txt per domain (audit F6.14, opsional): ringkasan brand dalam Markdown untuk asisten AI (ChatGPT, Perplexity, dll).
// Dibuat otomatis dari data brand, cabang & menu andalan, jadi selalu sama dengan situs.
import { brandFromHost, brandCity, siteOrigin } from "@/lib/seo";
import { getAngloBranches } from "@/lib/anglo-branches";
import { formatRupiah } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const brand = await brandFromHost();
  if (!brand) return new Response("Not found", { status: 404 });
  const origin = await siteOrigin(brand.id);
  const url = (path: string) => new URL(path, origin).toString();

  const [city, branches, featured] = await Promise.all([
    brandCity(brand),
    brand.template === "ANGLO"
      ? getAngloBranches(brand.id).then((bs) => bs.map((b) => ({ name: b.name, address: b.address, openHours: b.hours ?? null, whatsapp: b.whatsapp || null, mapsUrl: b.mapsUrl || null })))
      : prisma.branch.findMany({ where: { brandId: brand.id }, orderBy: { order: "asc" }, select: { name: true, address: true, openHours: true, whatsapp: true, mapsUrl: true } }),
    prisma.menuItem.findMany({
      where: { brandId: brand.id, isAvailable: true, isFeatured: true },
      orderBy: [{ category: { order: "asc" } }, { order: "asc" }],
      take: 8,
      select: { name: true, price: true, portion: true },
    }),
  ]);

  const cuisine = brand.servesCuisine.join(", ");
  const lines = [
    `# ${brand.name}`,
    "",
    `> ${[brand.tagline?.replace(/([^.!?])$/, "$1."), cuisine && city ? `${cuisine} di ${city}.` : null].filter(Boolean).join(" ")}`,
    "",
    "Situs ini berisi menu, harga, jam buka, dan lokasi. Tidak ada pemesanan online: datang langsung atau hubungi WhatsApp cabang.",
    "",
    "## Halaman",
    `- [Menu & harga](${url("/menu")})`,
    `- [Cabang, jam buka & kontak](${url("/cabang")})`,
    `- [Cerita](${url("/cerita")})`,
    "",
    "## Cabang",
    ...branches.map((b) =>
      [`- ${b.name}: ${b.address}`, b.openHours && `Jam: ${b.openHours}`, b.whatsapp && `WhatsApp: ${b.whatsapp}`, b.mapsUrl && `Maps: ${b.mapsUrl}`].filter(Boolean).join(". "),
    ),
    ...(featured.length ? ["", "## Menu andalan", ...featured.map((i) => `- ${i.name}: ${formatRupiah(i.price)}${i.portion ? ` (${i.portion})` : ""}`)] : []),
    ...([brand.instagramUrl, brand.tiktokUrl].some(Boolean) ? ["", "## Media sosial", ...[brand.instagramUrl, brand.tiktokUrl].filter(Boolean).map((u) => `- ${u}`)] : []),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
