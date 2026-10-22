// Jam buka terstruktur per hari (ROADMAP F0.4). Bentuknya sama dengan tabel BranchHours, supaya cabang dari DB
// dan dari src/data/brands (template ANGLO) diolah dengan cara yang sama (JSON-LD, nanti status "Buka sekarang" F0.5).

/** Jam satu hari. `dayOfWeek` 1 = Senin ... 7 = Minggu (ISO 8601); jam "HH:MM" WIB. */
export type DayHours = { dayOfWeek: number; isClosed: boolean; opens: string | null; closes: string | null };

export const DAY = { SENIN: 1, SELASA: 2, RABU: 3, KAMIS: 4, JUMAT: 5, SABTU: 6, MINGGU: 7 } as const;

/** Nama hari schema.org, indeks = dayOfWeek - 1. */
export const SCHEMA_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
/** Nama hari Indonesia, indeks = dayOfWeek - 1. */
export const DAY_LABEL = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export const isTime = (t: string) => TIME.test(t);

/** Ketujuh hari terisi & jam yang buka valid. Jam belum lengkap tidak boleh dipakai (JSON-LD, status buka). */
export function isCompleteWeek(hours: DayHours[]): boolean {
  const days = new Set(hours.map((h) => h.dayOfWeek));
  return (
    [1, 2, 3, 4, 5, 6, 7].every((d) => days.has(d)) &&
    hours.every((h) => h.isClosed || (!!h.opens && !!h.closes && TIME.test(h.opens) && TIME.test(h.closes)))
  );
}

const toMinutes = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
/** "16:00" -> "16.00" (gaya penulisan jam Indonesia). */
const show = (t: string) => t.replace(":", ".");

export type OpenStatus = { open: boolean; label: string; detail: string };

/**
 * Status buka cabang pada waktu `now`, dihitung dalam WIB (UTC+7, tanpa DST). Null kalau jam belum lengkap.
 * Jam tutup <= jam buka dianggap lewat tengah malam.
 */
export function openStatus(hours: DayHours[], now: Date): OpenStatus | null {
  if (!isCompleteWeek(hours)) return null;
  const wib = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  const today = wib.getUTCDay() || 7; // 1 = Senin ... 7 = Minggu
  const minutes = wib.getUTCHours() * 60 + wib.getUTCMinutes();
  const day = (d: number) => hours.find((h) => h.dayOfWeek === ((d - 1 + 7) % 7) + 1)!;

  // Sisa jam kemarin yang lewat tengah malam.
  const y = day(today - 1);
  if (!y.isClosed && toMinutes(y.closes!) <= toMinutes(y.opens!) && minutes < toMinutes(y.closes!)) {
    return { open: true, label: "Buka sekarang", detail: `sampai ${show(y.closes!)}` };
  }

  const t = day(today);
  if (!t.isClosed) {
    const opens = toMinutes(t.opens!);
    const closes = toMinutes(t.closes!);
    const overnight = closes <= opens;
    if (minutes >= opens && (overnight || minutes < closes)) {
      return { open: true, label: "Buka sekarang", detail: `sampai ${show(t.closes!)}` };
    }
    if (minutes < opens) return { open: false, label: "Tutup", detail: `buka lagi ${show(t.opens!)}` };
  }

  // Cari hari buka berikutnya.
  for (let i = 1; i <= 7; i++) {
    const next = day(today + i);
    if (next.isClosed) continue;
    const when = i === 1 ? "besok" : DAY_LABEL[next.dayOfWeek - 1];
    return { open: false, label: "Tutup", detail: `buka ${when} ${show(next.opens!)}` };
  }
  return { open: false, label: "Tutup", detail: "" };
}

/**
 * Teks ringkas dari jam 7 hari, mis. "16.00 – 23.00, Rabu libur" atau "08.00 – 21.00 setiap hari".
 * Null kalau jam belum lengkap atau jam buka berbeda antar hari (tulis manual).
 */
export function summarizeWeek(hours: DayHours[]): string | null {
  if (!isCompleteWeek(hours)) return null;
  const open = hours.filter((h) => !h.isClosed);
  if (!open.length) return "Tutup sementara";
  const [first] = open;
  if (open.some((h) => h.opens !== first.opens || h.closes !== first.closes)) return null;
  const range = `${show(first.opens!)} – ${show(first.closes!)}`;
  const closed = hours
    .filter((h) => h.isClosed)
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
    .map((h) => DAY_LABEL[h.dayOfWeek - 1]);
  if (!closed.length) return `${range} setiap hari`;
  return `${range}, ${closed.join(" & ")} libur`;
}

/** Jam sama setiap hari kecuali hari libur -> 7 baris (Senin..Minggu). */
export function weeklyHours(opens: string, closes: string, closedDays: number[] = []): DayHours[] {
  return [1, 2, 3, 4, 5, 6, 7].map((dayOfWeek) =>
    closedDays.includes(dayOfWeek)
      ? { dayOfWeek, isClosed: true, opens: null, closes: null }
      : { dayOfWeek, isClosed: false, opens, closes },
  );
}
