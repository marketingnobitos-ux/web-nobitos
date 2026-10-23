// /favicon.ico per domain (audit F6.14): beberapa crawler & browser selalu meminta file ini walau <link rel="icon"> sudah ada.
// Dialihkan ke favicon brand; host tanpa brand (admin) atau brand tanpa favicon = 404.
import { NextResponse } from "next/server";
import { brandFromHost, siteOrigin } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function GET() {
  const brand = await brandFromHost();
  if (!brand?.faviconUrl) return new NextResponse(null, { status: 404 });
  const origin = await siteOrigin(brand.id);
  return NextResponse.redirect(new URL(brand.faviconUrl, origin), { status: 301 });
}
