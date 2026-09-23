import Link from "next/link";

export default function SectionHeading({ title, href, linkLabel }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h2>
      {href && (
        <Link href={href} className="shrink-0 text-sm font-medium text-primary hover:underline">
          {linkLabel ?? "Lihat semua"} →
        </Link>
      )}
    </div>
  );
}
