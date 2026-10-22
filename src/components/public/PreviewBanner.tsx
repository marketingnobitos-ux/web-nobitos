// Penanda kecil "Mode preview" untuk admin yang membuka situs brand lewat /preview di host admin (ROADMAP F6.7).
// Gaya inline (tanpa kelas template) supaya tampil sama di semua template dan tidak memengaruhi CSS brand.
export default function PreviewBanner({ brandName, published }: { brandName: string; published: boolean }) {
  return (
    <div
      role="status"
      style={{
        position: "fixed",
        left: 12,
        bottom: 12,
        zIndex: 2147483000,
        display: "flex",
        alignItems: "center",
        gap: 10,
        maxWidth: "calc(100vw - 24px)",
        padding: "8px 12px",
        borderRadius: 999,
        background: "#111827",
        color: "#fff",
        font: "500 13px/1.3 system-ui, sans-serif",
        boxShadow: "0 4px 16px rgba(0,0,0,.25)",
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: 999, background: published ? "#22c55e" : "#f59e0b", flexShrink: 0 }} />
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        Mode preview · {brandName} {published ? "" : "(Draft)"}
      </span>
      <a href="/admin/brands" style={{ color: "#d1d5db", textDecoration: "underline", flexShrink: 0 }}>
        Kembali ke Admin
      </a>
    </div>
  );
}
