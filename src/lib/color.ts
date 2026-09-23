// Turunan warna tema dari warna brand di DB (dipakai layout publik).

function hexToHsl(hex: string): [number, number, number] | null {
  const m = hex.trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return null;
  const full = m[1].length === 3 ? [...m[1]].map((c) => c + c).join("") : m[1];
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
}

const hsl = (h: number, s: number, l: number) => `hsl(${h.toFixed(1)} ${(s * 100).toFixed(1)}% ${(l * 100).toFixed(1)}%)`;

/**
 * Warna gelap dominan situs dari warna brand: hue sama, dibuat sangat gelap.
 * Contoh Aminoto #15803d -> ink ≈ #0E3A1E, ink-deep ≈ #0A2915 (hijau tua).
 */
export function darkTones(brandHex: string): { ink: string; inkDeep: string } | null {
  const c = hexToHsl(brandHex);
  if (!c) return null;
  const [h, s] = c;
  const sat = Math.min(s, 0.62);
  return { ink: hsl(h, sat, 0.14), inkDeep: hsl(h, sat, 0.1) };
}
