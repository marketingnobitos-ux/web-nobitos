import type { CSSProperties } from "react";
import type { Metadata } from "next";
import BrandHeader from "@/components/public/BrandHeader";
import { getActiveBrand, requireActiveBrand } from "@/lib/active-brand";

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getActiveBrand();
  if (!brand) return {};
  return {
    title: { default: brand.name, template: `%s · ${brand.name}` },
    description: brand.tagline ?? undefined,
    icons: brand.faviconUrl ? { icon: brand.faviconUrl } : undefined,
  };
}

// Layout situs publik: menerapkan identitas brand aktif sebagai CSS variables.
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const brand = await requireActiveBrand();

  const brandVars = {
    "--color-primary": brand.colorPrimary,
    "--color-secondary": brand.colorSecondary,
    "--color-accent": brand.colorAccent ?? brand.colorPrimary,
  } as CSSProperties;

  return (
    <div style={brandVars} className="min-h-screen">
      <BrandHeader brand={brand} />
      <main>{children}</main>
    </div>
  );
}
