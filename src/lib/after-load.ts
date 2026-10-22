/**
 * Jalankan `cb` setelah halaman selesai dimuat dan browser senggang (maks. 2 detik menunggu).
 * Untuk kerja yang tidak perlu untuk tampilan pertama (smooth scroll, kiriman tracking), supaya tidak
 * berebut CPU & jaringan dengan judul/gambar utama (LCP). Mengembalikan fungsi pembatal untuk cleanup useEffect.
 */
export function afterLoad(cb: () => void): () => void {
  let idle: number | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const run = () => {
    if ("requestIdleCallback" in window) idle = window.requestIdleCallback(cb, { timeout: 2000 });
    else timer = setTimeout(cb, 1);
  };
  if (document.readyState === "complete") run();
  else window.addEventListener("load", run, { once: true });
  return () => {
    window.removeEventListener("load", run);
    if (idle !== undefined) window.cancelIdleCallback(idle);
    if (timer !== undefined) clearTimeout(timer);
  };
}
