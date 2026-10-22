import Link from "next/link";
import type { Gap } from "@/lib/brand-health";

/** Badge kekurangan data brand; tiap badge menuju halaman untuk melengkapinya. */
export default function GapBadges({ gaps, max }: { gaps: Gap[]; max?: number }) {
  if (!gaps.length) {
    return <span className="inline-flex rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">Data lengkap</span>;
  }
  const shown = max ? gaps.slice(0, max) : gaps;
  const rest = gaps.length - shown.length;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Data yang belum lengkap">
      {shown.map((g) => (
        <li key={g.key}>
          <Link href={g.href} className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900 hover:bg-amber-200">
            {g.label}
          </Link>
        </li>
      ))}
      {rest > 0 && <li className="px-1 py-0.5 text-xs text-gray-500">+{rest} lainnya</li>}
    </ul>
  );
}
