"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import OpenBadge from "@/components/public/OpenBadge";
import { GERABAH_NAV, InstagramIcon, NavIcon, TikTokIcon, WRAP } from "@/components/templates/gerabah/shared";
import { GR } from "@/data/brands/apw-gerabah";
import type { DayHours } from "@/lib/hours";
import { trackName } from "@/lib/track";

type Props = {
  brandName: string;
  logoUrl: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  /** Jam cabang Kesambi untuk badge "Buka sekarang"; null = badge tidak dirender. */
  hours: DayHours[] | null;
};

/**
 * Desktop: rail ikon di kiri (seperti papan referensi) + bar atas transparan di atas blok warna hero.
 * HP: bar atas dengan tombol buka-tutup navigasi.
 */
export default function GerabahHeader({ brandName, logoUrl, instagramUrl, tiktokUrl, hours }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const socials = [
    instagramUrl && { href: instagramUrl, label: "Instagram", track: trackName("ig"), Icon: InstagramIcon },
    tiktokUrl && { href: tiktokUrl, label: "TikTok", track: trackName("tiktok"), Icon: TikTokIcon },
  ].filter((s): s is Exclude<typeof s, null | ""> => !!s);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[var(--gr-rail)] flex-col items-center justify-between border-r border-[var(--gr-line)] bg-[rgb(22_19_17/0.78)] py-5 backdrop-blur-md lg:flex">
        <Link href="/" aria-label={`${brandName}, ke Beranda`} className="block h-11 w-11 overflow-hidden rounded-full ring-1 ring-white/25">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="" width={44} height={44} className="h-full w-full object-cover" />
          ) : (
            <span className="gr-display grid h-full w-full place-items-center bg-[var(--gr-clay)] text-xs">{GR.shortName}</span>
          )}
        </Link>

        <nav aria-label="Navigasi samping" className="flex flex-col gap-2.5">
          {GERABAH_NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                className={`group relative grid h-11 w-11 place-items-center rounded-2xl transition-colors ${
                  active ? "bg-[var(--gr-gold)] text-[var(--gr-char)]" : "text-[var(--gr-cream)]/70 hover:bg-white/10 hover:text-[var(--gr-cream)]"
                }`}
              >
                <NavIcon name={item.icon} />
                <span className="gr-caps pointer-events-none absolute left-[calc(100%+12px)] whitespace-nowrap rounded-full bg-[var(--gr-char)] px-3 py-1.5 text-[var(--gr-cream)] opacity-0 ring-1 ring-white/15 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-col gap-2">
          {socials.map(({ href, label, track, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              data-track={track}
              className="grid h-10 w-10 place-items-center rounded-full text-[var(--gr-cream)]/70 ring-1 ring-white/15 transition-colors hover:text-[var(--gr-gold)] hover:ring-[var(--gr-gold)]"
            >
              <Icon className="h-[18px] w-[18px]" />
            </a>
          ))}
        </div>
      </aside>

      <header className="absolute inset-x-0 top-0 z-30 text-[var(--gr-cream)] lg:pl-[var(--gr-rail)]">
        <div className={`${WRAP} flex items-center justify-between gap-6 border-b border-[var(--gr-line)] py-4`}>
          <Link href="/" aria-label={`${brandName}, ke Beranda`} className="flex min-w-0 items-center gap-3">
            {logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-white/25 lg:hidden" />
            )}
            <span className="min-w-0">
              <span className="gr-display block truncate text-[13px] tracking-[0.02em] sm:text-[17px] sm:tracking-[0.04em]">{brandName}</span>
              <span className="gr-caps mt-1 block text-[10px] text-[var(--gr-cream)]/65">{GR.slogan.replace(/\.$/, "")}</span>
            </span>
          </Link>

          <nav aria-label="Navigasi utama" className="hidden items-center gap-8 md:flex">
            {GERABAH_NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative py-2 text-[14px] font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-[17px] after:h-[2px] after:bg-[var(--gr-gold)] after:transition-transform ${
                    active ? "text-[var(--gr-cream)] after:scale-x-100" : "text-[var(--gr-cream)]/70 after:scale-x-0 hover:text-[var(--gr-cream)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            {hours && <OpenBadge hours={hours} className="gr-glass hidden !rounded-full px-4 py-2 text-[12px] sm:flex" />}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="gr-menu"
              aria-label={open ? "Tutup navigasi" : "Buka navigasi"}
              className="grid h-11 w-11 place-items-center rounded-full ring-1 ring-white/25 md:hidden"
            >
              <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <nav id="gr-menu" aria-label="Navigasi utama" className="mx-4 mt-2 rounded-3xl bg-[var(--gr-char)] p-2 ring-1 ring-white/15 md:hidden">
            {GERABAH_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`gr-display flex items-center justify-between rounded-2xl px-4 py-4 text-[28px] ${isActive(item.href) ? "bg-[var(--gr-clay)]" : ""}`}
              >
                {item.label}
                <NavIcon name={item.icon} className="h-6 w-6 opacity-70" />
              </Link>
            ))}
            {hours && <OpenBadge hours={hours} className="gr-caps px-4 pb-3 pt-4 text-[var(--gr-cream)]/80" />}
          </nav>
        )}
      </header>
    </>
  );
}
