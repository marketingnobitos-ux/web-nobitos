"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, m } from "framer-motion";
import { imageSrcSet } from "@/lib/image";
import { formatRupiah } from "@/lib/format";

export type PickerItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  portion: string | null;
  photo: string;
  category: string;
  isFeatured: boolean;
};

type Spice = "pedas" | "sedang" | "aman";
type Hunger = "banget" | "biasa";
type Answers = { spice?: Spice; lauk?: string; hunger?: Hunger };

const DRINK_RE = /minum|drink|\bes\b|\bteh\b|jeruk|kopi|jus|wedang|susu/i;
const SPICY_RE = /sambal|sambel|pedas|pedes|geprek|korek|balado|cabai|cabe|rica/i;
const BIG_RE = /paket|jumbo|komplit|utuh|besar|kenyang|double|spesial/i;

// Lauk yang dikenali dari nama/kategori menu; hanya yang ada di DB brand yang ditampilkan.
const LAUK = [
  { key: "lele", label: "Lele", re: /lele/i },
  { key: "ayam", label: "Ayam", re: /ayam/i },
  { key: "bebek", label: "Bebek", re: /bebek|itik/i },
  { key: "ikan", label: "Ikan lain", re: /ikan|nila|gurame|patin/i },
  { key: "tahu-tempe", label: "Tahu tempe", re: /tahu|tempe/i },
];

const text = (i: PickerItem) => `${i.name} ${i.category} ${i.description ?? ""}`;

/** Skor tiap menu terhadap jawaban; yang tertinggi direkomendasikan. */
function recommend(foods: PickerItem[], a: Answers): PickerItem | null {
  if (foods.length === 0) return null;
  const prices = foods.map((f) => f.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const lauk = LAUK.find((l) => l.key === a.lauk);

  const scored = foods.map((f) => {
    const t = text(f);
    let score = f.isFeatured ? 1 : 0;
    if (lauk) score += lauk.re.test(t) ? 10 : -4;
    const spicy = SPICY_RE.test(t);
    if (a.spice === "pedas") score += spicy ? 3 : 0;
    if (a.spice === "aman") score += spicy ? -1 : 2;
    const rel = max > min ? (f.price - min) / (max - min) : 0.5;
    if (a.hunger === "banget") score += rel * 3 + (BIG_RE.test(t) ? 3 : 0);
    if (a.hunger === "biasa") score += (1 - rel) * 3;
    return { f, score };
  });
  scored.sort((x, y) => y.score - x.score);
  return scored[0].f;
}

/**
 * "Lagi pengen apa?": 3 pertanyaan singkat, lalu satu rekomendasi menu dari DB.
 * Mirip panduan produk interaktif; animasi antar langkah pakai Framer Motion.
 */
export default function MenuPicker({ items }: { items: PickerItem[] }) {
  const foods = useMemo(() => items.filter((i) => !DRINK_RE.test(`${i.category} ${i.name}`)), [items]);
  const drink = useMemo(() => items.find((i) => DRINK_RE.test(`${i.category} ${i.name}`)), [items]);
  const laukOptions = useMemo(() => LAUK.filter((l) => foods.some((f) => l.re.test(text(f)))), [foods]);

  const steps = [
    {
      key: "spice" as const,
      question: "Kuat pedes?",
      options: [
        { value: "pedas", label: "Pedes pol", note: "Sambel dobel, gas" },
        { value: "sedang", label: "Sedeng bae", note: "Pedesnya pas" },
        { value: "aman", label: "Ora kuat", note: "Sambel dipisah ya" },
      ],
    },
    ...(laukOptions.length > 1
      ? [
          {
            key: "lauk" as const,
            question: "Lauknya apa?",
            options: [...laukOptions.map((l) => ({ value: l.key, label: l.label, note: "" })), { value: "", label: "Terserah", note: "Kasih kejutan" }],
          },
        ]
      : []),
    {
      key: "hunger" as const,
      question: "Seberapa lapar?",
      options: [
        { value: "banget", label: "Lapar pisan", note: "Porsi mantep" },
        { value: "biasa", label: "Biasa bae", note: "Yang pas aja" },
      ],
    },
  ];

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const done = step >= steps.length;
  const result = done ? recommend(foods, answers) : null;

  const choose = (key: keyof Answers, value: string) => {
    setAnswers((a) => ({ ...a, [key]: value || undefined }));
    setStep((s) => s + 1);
  };
  const reset = () => {
    setAnswers({});
    setStep(0);
  };

  if (foods.length === 0) return null;
  const current = steps[step];

  return (
    <div className="relative min-h-[34rem] md:min-h-[30rem]">
      {/* Progres langkah */}
      <div className="mb-8 flex items-center gap-2" aria-hidden>
        {steps.map((s, i) => (
          <span key={s.key} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i < step || done ? "bg-paper" : "bg-paper/15"}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!done && current ? (
          <m.div
            key={current.key}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4, ease: [0.2, 0.75, 0.15, 1] }}
          >
            <p className="mb-3 text-sm text-paper/60">
              {step + 1} / {steps.length}
            </p>
            <h3 className="display text-[clamp(28px,4vw,48px)]" aria-live="polite">
              {current.question}
            </h3>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {current.options.map((o) => (
                <button
                  key={o.value || "any"}
                  type="button"
                  onClick={() => choose(current.key, o.value)}
                  data-track={`picker-${current.key}-${o.value || "bebas"}`}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-paper/20 px-5 py-5 text-left transition hover:border-paper hover:bg-paper hover:text-ink"
                >
                  <span>
                    <span className="display block text-2xl">{o.label}</span>
                    {o.note && <span className="mt-1 block text-sm text-paper/60 group-hover:text-ink/70">{o.note}</span>}
                  </span>
                  <span className="text-2xl transition-transform group-hover:translate-x-1" aria-hidden>
                    →
                  </span>
                </button>
              ))}
            </div>
            {step > 0 && (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="mt-6 text-sm text-paper/60 underline-offset-4 hover:text-paper hover:underline">
                ← Balik
              </button>
            )}
          </m.div>
        ) : result ? (
          <m.div
            key="result"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.2, 0.75, 0.15, 1] }}
            className="grid items-center gap-8 md:grid-cols-[1fr_1.1fr]"
            aria-live="polite"
          >
            <div className="relative aspect-[4/3.4] overflow-hidden rounded-[1.75rem] md:aspect-[4/4.2]">
              <m.img
                src={result.photo}
                srcSet={imageSrcSet(result.photo)}
                sizes="(min-width: 768px) 45vw, 100vw"
                alt={result.name}
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.2, ease: [0.2, 0.75, 0.15, 1] }}
                className="h-full w-full object-cover"
              />
              <span className="absolute left-4 top-4 rotate-[-4deg] rounded-full bg-accent px-4 py-2 text-sm font-semibold">Cocok buat kamu</span>
            </div>
            <div>
              <p className="text-paper/60">Menurut kita, pesen ini:</p>
              <h3 className="display mt-2 text-[clamp(32px,5vw,64px)]">{result.name}</h3>
              <p className="mt-4 inline-flex rounded-full bg-accent px-4 py-1.5 text-lg font-bold">{formatRupiah(result.price)}</p>
              {result.description && <p className="mt-4 max-w-md text-paper/75">{result.description}</p>}
              {answers.spice === "aman" && <p className="mt-2 text-sm text-paper/60">Tenang, sambelnya bisa minta dipisah.</p>}
              {drink && <p className="mt-2 text-sm text-paper/60">Tambah {drink.name} biar adem.</p>}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={`/menu/${result.id}`}
                  data-track="picker-hasil"
                  className="inline-flex h-13 items-center rounded-full bg-paper px-7 font-semibold text-ink transition hover:bg-paper/85"
                >
                  Lihat menunya
                </Link>
                <button type="button" onClick={reset} className="inline-flex h-13 items-center rounded-full border border-paper/30 px-7 font-semibold transition hover:bg-paper/10">
                  Ulang lagi
                </button>
              </div>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
