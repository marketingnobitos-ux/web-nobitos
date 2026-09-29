// JSON-LD `Restaurant` per cabang (ROADMAP F0.4). Dipasang di Beranda & Cabang, semua template.
import type { Brand } from "@prisma/client";
import { restaurantJsonLd } from "@/lib/jsonld";

export default async function RestaurantJsonLd({ brand }: { brand: Brand }) {
  const data = await restaurantJsonLd(brand);
  if (!data) return null;
  // "<" di-escape supaya teks data tidak bisa menutup tag <script>.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
