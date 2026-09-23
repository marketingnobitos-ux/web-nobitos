// Brand aktif untuk server components (dibaca dari header yang di-set middleware).
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { BRAND_HEADER, getBrandBySlugCached } from "@/lib/brand";

/** Brand aktif untuk request ini, atau null. Di-cache per request & 60 detik antar request. */
export const getActiveBrand = cache(async () => {
  const slug = (await headers()).get(BRAND_HEADER);
  if (!slug) return null;
  return getBrandBySlugCached(slug);
});

/** Seperti getActiveBrand, tapi redirect ke /brand-not-found kalau tidak ada. */
export async function requireActiveBrand() {
  const brand = await getActiveBrand();
  if (!brand) redirect("/brand-not-found");
  return brand;
}
