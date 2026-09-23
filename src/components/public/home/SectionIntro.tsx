import Reveal from "@/components/animations/Reveal";

type Props = { id?: string; eyebrow?: string; title: string; description?: string | null; align?: "center" | "left"; tone?: "ink" | "light" };

/** Judul section gaya editorial: eyebrow kecil, judul besar tebal, deskripsi singkat. */
export default function SectionIntro({ id, eyebrow, title, description, align = "center", tone = "ink" }: Props) {
  const center = align === "center";
  const light = tone === "light";
  return (
    <Reveal className={`${center ? "mx-auto text-center" : ""} max-w-2xl`}>
      {eyebrow && (
        <p className={`mb-3 text-xs font-bold uppercase tracking-[0.22em] ${light ? "text-white/75" : "text-primary"}`}>{eyebrow}</p>
      )}
      <h2 id={id} className={`font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl ${light ? "text-white" : "text-ink"}`}>
        {title}
      </h2>
      {description && <p className={`mt-4 text-base sm:text-lg ${light ? "text-white/85" : "text-ink/70"}`}>{description}</p>}
    </Reveal>
  );
}
