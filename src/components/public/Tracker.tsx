"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type Payload = { type: "pageview" | "click"; path: string; target?: string; referrer?: string; brandSlug: string };

function send(payload: Payload) {
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true, // tetap terkirim walau halaman berpindah
    credentials: "same-origin",
  }).catch(() => {});
}

/**
 * Script tracking first-party (PRD Bagian 11):
 * - pageview setiap kali path berubah,
 * - click untuk elemen yang punya atribut data-track.
 */
export default function Tracker({ brandSlug }: { brandSlug: string }) {
  const pathname = usePathname();
  const last = useRef<{ path: string; at: number } | null>(null);
  const first = useRef(true);

  useEffect(() => {
    // Cegah pageview ganda (React StrictMode menjalankan effect 2x di dev).
    const now = Date.now();
    if (last.current?.path === pathname && now - last.current.at < 1000) return;
    last.current = { path: pathname, at: now };

    send({
      type: "pageview",
      path: pathname,
      referrer: first.current ? document.referrer || undefined : undefined,
      brandSlug,
    });
    first.current = false;
  }, [pathname, brandSlug]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = (e.target as Element | null)?.closest?.("[data-track]");
      const target = el?.getAttribute("data-track");
      if (target) send({ type: "click", target, path: window.location.pathname, brandSlug });
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [brandSlug]);

  return null;
}
