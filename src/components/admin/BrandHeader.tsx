"use client";

import { usePathname } from "next/navigation";
import { brandSectionLabel } from "./AdminNav";

type Props = {
  brandId: string;
  name: string;
  logoUrl: string | null;
  color: string;
  published: boolean;
  meta: string;
  site: { href: string; label: string };
};

/** Kepala halaman brand: logo bulat, judul = bagian yang dibuka (mis. "Daftar Menu"), lalu nama brand & status. */
export default function BrandHeader({ brandId, name, logoUrl, color, published, meta, site }: Props) {
  const pathname = usePathname();
  const title = brandSectionLabel(pathname, brandId);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3 lg:gap-[18px]">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt="" className="h-[52px] w-[52px] shrink-0 rounded-full border-2 border-[#f4f3ea] bg-white object-contain p-1 lg:h-[72px] lg:w-[72px] lg:border-[3px]" />
        ) : (
          <span className="h-[52px] w-[52px] shrink-0 rounded-full border-2 border-[#f4f3ea] lg:h-[72px] lg:w-[72px] lg:border-[3px]" style={{ background: color }} />
        )}
        <div className="min-w-0">
          <h1 className="adm-title">{title}</h1>
          <p className="mt-1.5 truncate text-[13px] text-[#d4dcc8] lg:text-[15px]">
            {name} · {meta} · {published ? "Tayang" : "Draft"}
          </p>
        </div>
      </div>
      <a href={site.href} target="_blank" rel="noopener noreferrer" className="adm-btn-outline">
        {site.label}
      </a>
    </div>
  );
}
