import { Card } from "@/components/admin/fields";

export const metadata = { title: "Domain" };

// Kelola domain per brand dibangun di Milestone 6.
export default function AdminDomainsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Kelola Domain</h1>
      <Card>
        <p className="text-sm text-gray-600">Pemetaan domain ke brand, instruksi DNS, dan cek status hadir di Milestone 6.</p>
      </Card>
    </div>
  );
}
