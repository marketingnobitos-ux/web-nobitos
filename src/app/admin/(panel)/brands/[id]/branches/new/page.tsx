import Link from "next/link";
import { Card } from "@/components/admin/fields";
import { getBrandForAdmin } from "@/lib/admin";
import { createBranch } from "../actions";
import BranchForm from "../BranchForm";

export const metadata = { title: "Tambah Cabang" };

export default async function NewBranchPage({ params }: { params: Promise<{ id: string }> }) {
  const brand = await getBrandForAdmin((await params).id);
  return (
    <Card title="Tambah cabang" actions={<Link href={`/admin/brands/${brand.id}/branches`} className="text-sm hover:underline">← Kembali</Link>}>
      <BranchForm action={createBranch.bind(null, brand.id)} submitLabel="Tambah cabang" />
    </Card>
  );
}
