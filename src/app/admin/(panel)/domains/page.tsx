import type { DomainStatus } from "@prisma/client";
import ActionForm from "@/components/admin/ActionForm";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import { Card, Checkbox, PageHeader, PublishBadge, Select, TextField } from "@/components/admin/fields";
import { listAccessibleBrands, requireAdmin } from "@/lib/admin";
import { serverIp } from "@/lib/domain";
import { prisma } from "@/lib/prisma";
import { checkDomainStatus, createDomain, deleteDomain, setDomainActive, updateDomain } from "./actions";

export const metadata = { title: "Domain" };

const STATUS: Record<DomainStatus, { label: string; cls: string; hint: string }> = {
  PENDING: { label: "PENDING", cls: "bg-amber-100 text-amber-800", hint: "DNS belum mengarah ke server." },
  VERIFIED: { label: "VERIFIED", cls: "bg-blue-100 text-blue-800", hint: "DNS sudah benar. Pasang SSL lalu tandai aktif." },
  ACTIVE: { label: "ACTIVE", cls: "bg-green-100 text-green-800", hint: "Tayang dengan HTTPS." },
  ERROR: { label: "ERROR", cls: "bg-red-100 text-red-800", hint: "Domain gagal di-resolve." },
};

// Kelola domain per brand (PRD Bagian 10.4).
export default async function AdminDomainsPage() {
  const admin = await requireAdmin();
  const accessible = await listAccessibleBrands(admin);
  const brands = await prisma.brand.findMany({
    where: { id: { in: accessible.map((b) => b.id) } },
    orderBy: { name: "asc" },
    include: { domains: { orderBy: [{ isPrimary: "desc" }, { hostname: "asc" }] } },
  });
  const ip = serverIp();
  const brandOptions = brands.map((b) => ({ value: b.id, label: b.name }));

  return (
    <div className="space-y-6">
      <PageHeader title="Kelola Domain" description="Hubungkan domain ke brand, cek DNS, lalu tandai aktif setelah SSL terpasang." />

      <Card title="Instruksi DNS">
        {ip ? (
          <div className="space-y-3 text-sm text-gray-700">
            <p>Di panel registrar domain (tempat membeli domain), buat record berikut untuk setiap domain brand:</p>
            <div className="overflow-x-auto">
              <table className="text-left font-mono text-xs sm:text-sm">
                <thead className="text-gray-500">
                  <tr>
                    <th className="py-1 pr-6">Tipe</th>
                    <th className="py-1 pr-6">Nama / Host</th>
                    <th className="py-1">Nilai</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-1 pr-6">A</td>
                    <td className="py-1 pr-6">@</td>
                    <td className="py-1 font-semibold">{ip}</td>
                  </tr>
                  <tr>
                    <td className="py-1 pr-6">A</td>
                    <td className="py-1 pr-6">www</td>
                    <td className="py-1 font-semibold">{ip}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-600">
              Perubahan DNS bisa butuh beberapa menit sampai 24 jam. Setelah status <strong>VERIFIED</strong>, buat server block
              Nginx & jalankan Certbot untuk domain itu (PRD Bagian 12), lalu klik <strong>Tandai aktif</strong>.
            </p>
          </div>
        ) : (
          <p className="text-sm text-red-700">
            <code>SERVER_IP</code> belum diisi di <code>.env</code>. Instruksi DNS & cek status tidak bisa dipakai.
          </p>
        )}
      </Card>

      <Card title="Tambah domain">
        {brands.length ? (
          <ActionForm action={createDomain} submitLabel="Tambah domain" resetOnSuccess>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Domain" name="hostname" required placeholder="pecelleleaminoto.com" hint="Tanpa http:// dan tanpa garis miring." />
              <Select label="Brand" name="brandId" required options={brandOptions} />
            </div>
            <Checkbox label="Jadikan domain utama brand" name="isPrimary" hint="Domain pertama sebuah brand otomatis jadi domain utama." />
          </ActionForm>
        ) : (
          <p className="text-sm text-gray-500">Belum ada brand.</p>
        )}
      </Card>

      {brands.map((brand) => (
        <Card
          key={brand.id}
          title={brand.name}
          actions={<PublishBadge published={brand.isPublished} />}
        >
          {!brand.isPublished && brand.domains.length > 0 && (
            <p className="mb-3 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Brand masih Draft: domain belum menampilkan situs sampai brand dicentang &quot;Tayangkan&quot; di Info Brand.
            </p>
          )}
          {brand.domains.length === 0 ? (
            <p className="text-sm text-gray-500">Belum ada domain.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {brand.domains.map((d) => {
                const s = STATUS[d.status];
                return (
                  <li key={d.id} className="space-y-3 py-4 first:pt-0 last:pb-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <a href={`https://${d.hostname}`} target="_blank" rel="noopener noreferrer" className="font-mono font-semibold hover:underline">
                        {d.hostname}
                      </a>
                      {d.isPrimary && <span className="rounded-full bg-gray-900 px-2 py-0.5 text-xs text-white">Utama</span>}
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.cls}`}>{s.label}</span>
                      <span className="text-xs text-gray-500">{d.sslIssued ? "SSL terpasang" : "SSL belum"}</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      {s.hint}
                      {ip && d.status !== "ACTIVE" && (
                        <>
                          {" "}
                          A record <code className="rounded bg-gray-100 px-1">{d.hostname}</code> → <code className="rounded bg-gray-100 px-1">{ip}</code>
                        </>
                      )}
                    </p>

                    <div className="flex flex-wrap items-start gap-3">
                      {ip && (
                        <ActionForm action={checkDomainStatus.bind(null, d.id)} submitLabel="Cek status" className="flex flex-wrap items-center gap-3">
                          {null}
                        </ActionForm>
                      )}
                      {d.status === "VERIFIED" && (
                        <form action={setDomainActive.bind(null, d.id, true)}>
                          <button type="submit" className="rounded-md border border-green-600 px-3 py-2 text-sm text-green-700 hover:bg-green-50">
                            Tandai aktif (SSL terpasang)
                          </button>
                        </form>
                      )}
                      {d.status === "ACTIVE" && (
                        <form action={setDomainActive.bind(null, d.id, false)}>
                          <button type="submit" className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            Batalkan status aktif
                          </button>
                        </form>
                      )}
                    </div>

                    <details className="rounded-md border border-gray-200 p-3">
                      <summary className="cursor-pointer text-sm text-gray-700">Ubah / hapus</summary>
                      <div className="mt-3 space-y-4">
                        <ActionForm action={updateDomain.bind(null, d.id)}>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <TextField label="Domain" name="hostname" required defaultValue={d.hostname} hint="Mengubah domain mereset status ke PENDING." />
                            <Select label="Brand" name="brandId" required defaultValue={d.brandId} options={brandOptions} />
                          </div>
                          <Checkbox label="Domain utama brand" name="isPrimary" defaultChecked={d.isPrimary} />
                        </ActionForm>
                        <form action={deleteDomain.bind(null, d.id)}>
                          <ConfirmSubmit message={`Hapus domain ${d.hostname}? Situs brand tidak akan bisa dibuka lewat domain ini.`}>
                            Hapus domain
                          </ConfirmSubmit>
                        </form>
                      </div>
                    </details>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      ))}
    </div>
  );
}
