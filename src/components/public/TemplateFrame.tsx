"use client";

import dynamic from "next/dynamic";
import type { ComponentProps, ComponentType } from "react";
import type { BrandTemplate } from "@prisma/client";

type FrameProps = ComponentProps<"div">;

// Font (next/font) & CSS khusus tiap template ada di modul frame-nya sendiri. next/dynamic di komponen client memecah
// tiap frame jadi chunk terpisah (CSS-nya tetap ikut di-SSR sebagai <link> render-blocking di <head>), jadi brand hanya
// mengunduh font & gaya template-nya sendiri. next/dynamic di server component tidak memecah chunk (catatan F1.3b),
// karena itu pemilihnya komponen client.
const FRAMES: Record<BrandTemplate, ComponentType<FrameProps>> = {
  BOLD: dynamic(() => import("@/components/public/BoldFrame")),
  EDITORIAL: dynamic(() => import("@/components/templates/editorial/EditorialFrame")),
  ANGLO: dynamic(() => import("@/components/templates/anglo/AngloFrame")),
  TUNGKU: dynamic(() => import("@/components/templates/tungku/TungkuFrame")),
  DADAK: dynamic(() => import("@/components/templates/dadak/DadakFrame")),
  GERABAH: dynamic(() => import("@/components/templates/gerabah/GerabahFrame")),
};

/** Pembungkus situs publik: elemen akar brand + font & gaya template aktif. */
export default function TemplateFrame({ template, ...props }: FrameProps & { template: BrandTemplate }) {
  const Frame = FRAMES[template];
  return <Frame {...props} />;
}
