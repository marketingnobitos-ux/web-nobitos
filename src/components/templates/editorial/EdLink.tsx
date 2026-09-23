import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  /** Link keluar (Maps, WhatsApp): buka tab baru. */
  external?: boolean;
  track?: string;
};

/** Link minimal template Editorial: teks + panah ↗, garis bawah tergambar saat hover. */
export default function EdLink({ href, children, className = "", external, track }: Props) {
  const inner = (
    <>
      {children}
      <span className="ed-arrow" aria-hidden>
        ↗
      </span>
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" data-track={track} className={`ed-link ${className}`}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} data-track={track} className={`ed-link ${className}`}>
      {inner}
    </Link>
  );
}
