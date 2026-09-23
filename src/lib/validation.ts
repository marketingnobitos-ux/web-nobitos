// Skema Zod untuk form admin + helper parsing FormData.
import { z } from "zod";

export type ActionState = { ok?: boolean; error?: string; message?: string } | undefined;

const trimmed = (v: unknown) => (typeof v === "string" ? v.trim() : v);
const emptyToNull = (v: unknown) => {
  const t = trimmed(v);
  return t === "" || t === undefined ? null : t;
};

export const requiredText = (label: string, max = 200) =>
  z.preprocess(trimmed, z.string({ required_error: `${label} wajib diisi.` }).min(1, `${label} wajib diisi.`).max(max, `${label} maksimal ${max} karakter.`));

export const nullableText = (label: string, max = 500) =>
  z.preprocess(emptyToNull, z.string().max(max, `${label} maksimal ${max} karakter.`).nullable());

export const checkbox = z.preprocess((v) => v === "on" || v === "true", z.boolean());

export const intField = (label: string, min = 0, max = 1_000_000_000) =>
  z.preprocess(
    (v) => (v === "" || v == null ? 0 : Number(String(v).replace(/[^\d-]/g, ""))),
    z.number({ invalid_type_error: `${label} harus angka.` }).int().min(min, `${label} minimal ${min}.`).max(max),
  );

const nullableNumber = (label: string, min: number, max: number) =>
  z.preprocess(
    (v) => (emptyToNull(v) === null ? null : Number(String(v).replace(",", "."))),
    z.number({ invalid_type_error: `${label} harus angka.` }).min(min).max(max).nullable(),
  );

/** URL gambar: path lokal ("/uploads/...") atau http(s). Menolak skema lain (mis. javascript:). */
export const imageUrl = z.preprocess(
  emptyToNull,
  z
    .string()
    .max(500)
    .regex(/^(\/[\w\-./]+|https?:\/\/\S+)$/, "URL gambar tidak valid.")
    .nullable(),
);

const hexColor = (label: string) => z.preprocess(trimmed, z.string().regex(/^#[0-9a-fA-F]{6}$/, `${label} harus format #RRGGBB.`));

// Tanggal dari <input type="date"> ditafsirkan sebagai zona WIB.
const dateField = (endOfDay: boolean) =>
  z.preprocess(
    (v) => {
      const t = emptyToNull(v);
      if (t === null) return null;
      return new Date(`${t}T${endOfDay ? "23:59:59" : "00:00:00"}+07:00`);
    },
    z.date({ invalid_type_error: "Tanggal tidak valid." }).nullable(),
  );

export const brandSchema = z.object({
  name: requiredText("Nama brand", 100),
  slug: z.preprocess(
    (v) => (typeof v === "string" ? v.trim().toLowerCase() : v),
    z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya huruf kecil, angka, dan tanda minus (mis. bolu-sunyaragi).").max(50),
  ),
  tagline: nullableText("Tagline", 200),
  logoUrl: imageUrl,
  faviconUrl: imageUrl,
  colorPrimary: hexColor("Warna primary"),
  colorSecondary: hexColor("Warna secondary"),
  colorAccent: z.preprocess(emptyToNull, z.string().regex(/^#[0-9a-fA-F]{6}$/, "Warna accent harus format #RRGGBB.").nullable()),
  fontHeading: nullableText("Font judul", 100),
  fontBody: nullableText("Font isi", 100),
  isPublished: checkbox,
});

export const categorySchema = z.object({
  name: requiredText("Nama kategori", 100),
  order: intField("Urutan"),
});

export const menuItemSchema = z.object({
  categoryId: requiredText("Kategori", 50),
  name: requiredText("Nama menu", 150),
  description: nullableText("Deskripsi", 1000),
  price: intField("Harga", 0, 100_000_000),
  portion: nullableText("Porsi", 100),
  imageUrl,
  isFeatured: checkbox,
  isAvailable: checkbox,
  order: intField("Urutan"),
});

export const albumSchema = z.object({
  title: requiredText("Judul album", 150),
  order: intField("Urutan"),
});

export const photoSchema = z.object({
  caption: nullableText("Keterangan", 300),
  order: intField("Urutan"),
});

export const promoSchema = z
  .object({
    title: requiredText("Judul promo", 150),
    description: nullableText("Deskripsi", 1000),
    imageUrl,
    startsAt: dateField(false),
    endsAt: dateField(true),
    isActive: checkbox,
    order: intField("Urutan"),
  })
  .refine((p) => !p.startsAt || !p.endsAt || p.endsAt >= p.startsAt, {
    message: "Tanggal selesai harus setelah tanggal mulai.",
  });

const phone = (label: string) =>
  z.preprocess(emptyToNull, z.string().regex(/^[+\d][\d\s-]{6,20}$/, `${label} tidak valid.`).nullable());

export const branchSchema = z.object({
  name: requiredText("Nama cabang", 150),
  address: requiredText("Alamat", 500),
  mapsUrl: z.preprocess(emptyToNull, z.string().url("Link Google Maps tidak valid.").max(1000).regex(/^https?:\/\//, "Link harus http(s).").nullable()),
  lat: nullableNumber("Latitude", -90, 90),
  lng: nullableNumber("Longitude", -180, 180),
  openHours: nullableText("Jam buka", 200),
  whatsapp: phone("Nomor WhatsApp"),
  phone: phone("Nomor telepon"),
  order: intField("Urutan"),
});

export const sectionSchema = z.object({
  title: nullableText("Judul", 200),
  subtitle: nullableText("Subjudul", 300),
  body: nullableText("Isi", 5000),
  imageUrl,
  items: z.preprocess(
    (v) =>
      typeof v === "string"
        ? v
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    z.array(z.string().max(200)).max(20),
  ),
  isVisible: checkbox,
});

export const profileSchema = z.object({ name: nullableText("Nama", 100) });

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Password lama wajib diisi."),
    newPassword: z.string().min(8, "Password baru minimal 8 karakter.").max(200),
    confirmPassword: z.string(),
  })
  .refine((p) => p.newPassword === p.confirmPassword, { message: "Konfirmasi password tidak sama." });

/** Parse FormData dengan skema; kembalikan data atau pesan error pertama. */
export function parseForm<T extends z.ZodTypeAny>(
  schema: T,
  formData: FormData,
): { success: true; data: z.infer<T> } | { success: false; error: string } {
  const raw = Object.fromEntries([...formData.entries()].filter(([, v]) => typeof v === "string"));
  const result = schema.safeParse(raw);
  if (result.success) return { success: true, data: result.data };
  return { success: false, error: result.error.issues[0]?.message ?? "Data tidak valid." };
}
