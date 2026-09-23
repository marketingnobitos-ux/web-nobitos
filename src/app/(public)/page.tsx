import Link from "next/link";

// Halaman Utama brand. Dibangun di Milestone 3.
export default function HomePage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Nobitos Kuliner</h1>
      <p className="mt-2">Placeholder Halaman Utama (Milestone 3).</p>
      <p className="mt-4">
        Cek koneksi database:{" "}
        <Link href="/db-check" className="underline">
          /db-check
        </Link>
      </p>
    </div>
  );
}
