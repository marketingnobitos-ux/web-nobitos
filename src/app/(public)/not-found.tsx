import BrandNotFound from "@/components/public/BrandNotFound";
import { requireActiveBrand } from "@/lib/active-brand";

// notFound() dari halaman brand (mis. /menu/[id] yang tidak ada). Sudah di dalam layout publik (header, footer, tema).
export default async function PublicNotFound() {
  const brand = await requireActiveBrand();
  return <BrandNotFound template={brand.template} />;
}
