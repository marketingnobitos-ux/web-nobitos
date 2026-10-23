// JSON-LD tambahan per halaman (audit F6.14): WebSite + Organization di Beranda, Menu di /menu, BreadcrumbList di halaman lain.
import type { Brand } from "@prisma/client";
import { breadcrumbJsonLd, menuJsonLd, siteJsonLd } from "@/lib/jsonld";

const TITLES: Record<string, string> = { "/menu": "Menu", "/cabang": "Cabang", "/cerita": "Cerita", "/galeri": "Galeri" };

function Script({ data }: { data: unknown }) {
  // "<" di-escape supaya teks data tidak bisa menutup tag <script>.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }} />;
}

export default async function PageJsonLd({ brand, path }: { brand: Brand; path: "/" | keyof typeof TITLES }) {
  if (path === "/") return <Script data={await siteJsonLd(brand)} />;
  const [crumbs, menu] = await Promise.all([
    breadcrumbJsonLd(brand, [{ name: TITLES[path], path }]),
    path === "/menu" ? menuJsonLd(brand) : Promise.resolve(null),
  ]);
  return (
    <>
      <Script data={crumbs} />
      {menu && <Script data={menu} />}
    </>
  );
}
