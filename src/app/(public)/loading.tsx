// Indikator saat pindah halaman publik (header & footer brand tetap tampil).
export default function PublicLoading() {
  return (
    <div role="status" aria-label="Memuat halaman" className="mx-auto max-w-6xl animate-pulse px-4 py-10 sm:py-14">
      <div className="h-9 w-2/3 max-w-md rounded-lg bg-primary/15" />
      <div className="mt-3 h-4 w-1/2 max-w-sm rounded bg-gray-200" />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-gray-100">
            <div className="aspect-[4/3] bg-primary/10" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-4 w-1/3 rounded bg-primary/15" />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Memuat...</span>
    </div>
  );
}
