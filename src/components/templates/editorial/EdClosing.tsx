import Reveal from "@/components/animations/Reveal";

type Props = { href: string; label: string; external: boolean; note?: string; track: string };

/** CTA penutup: satu link teks raksasa (mis. "Pesan lewat WhatsApp ↗"). */
export default function EdClosing({ href, label, external, note, track }: Props) {
  return (
    <section className="bg-paper px-5 py-28 sm:px-8 md:px-12 md:py-44">
      <div className="mx-auto max-w-[1440px]">
        {note && (
          <Reveal>
            <p className="mb-8 max-w-sm text-lg text-ink/65">{note}</p>
          </Reveal>
        )}
        <Reveal delay={0.1}>
          <a
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            data-track={track}
            className="ed-link ed-title text-[clamp(40px,7vw,112px)]"
          >
            {label}
            <span className="ed-arrow" aria-hidden>
              ↗
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
