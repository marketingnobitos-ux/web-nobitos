import type { CSSProperties } from "react";
import type { Metadata } from "next";
import BrandFooter from "@/components/public/BrandFooter";
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
    <div style={brandVars} className="flex min-h-screen flex-col bg-white text-gray-900">
      <BrandHeader brand={brand} />
      <main className="flex-1">{children}</main>
      <BrandFooter brand={brand} />
    </div>
  );
}
