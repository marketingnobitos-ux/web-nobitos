// Skeleton konten admin saat pindah halaman.
export default function LoadingSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div role="status" aria-label="Memuat halaman" className="animate-pulse space-y-4">
      <div className="h-12 w-64 rounded-full bg-black/15" />
      <div className="adm-light adm-card">
        <div className="space-y-4">
          {Array.from({ length: rows }, (_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-[#d8dcc9]" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/2 rounded-xl bg-[#d8dcc9]" />
                <div className="h-3 w-1/3 rounded bg-[#e3e6d4]" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">Memuat...</span>
    </div>
  );
}
