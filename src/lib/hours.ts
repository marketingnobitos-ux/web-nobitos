// Jam buka terstruktur per hari (ROADMAP F0.4). Bentuknya sama dengan tabel BranchHours, supaya cabang dari DB
// dan dari src/data/brands (template ANGLO) diolah dengan cara yang sama (JSON-LD, nanti status "Buka sekarang" F0.5).

/** Jam satu hari. `dayOfWeek` 1 = Senin ... 7 = Minggu (ISO 8601); jam "HH:MM" WIB. */
export type DayHours = { dayOfWeek: number; isClosed: boolean; opens: string | null; closes: string | null };

export const DAY = { SENIN: 1, SELASA: 2, RABU: 3, KAMIS: 4, JUMAT: 5, SABTU: 6, MINGGU: 7 } as const;

/** Nama hari schema.org, indeks = dayOfWeek - 1. */
export const SCHEMA_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

/** Jam sama setiap hari kecuali hari libur -> 7 baris (Senin..Minggu). */
export function weeklyHours(opens: string, closes: string, closedDays: number[] = []): DayHours[] {
  return [1, 2, 3, 4, 5, 6, 7].map((dayOfWeek) =>
    closedDays.includes(dayOfWeek)
      ? { dayOfWeek, isClosed: true, opens: null, closes: null }
      : { dayOfWeek, isClosed: false, opens, closes },
  );
}
