import Link from "next/link";
import { notFound } from "next/navigation";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import { Card } from "@/components/admin/fields";
import { getBrandForAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { deleteBranch, updateBranch } from "../actions";
import BranchForm from "../BranchForm";

export const metadata = { title: "Ubah Cabang" };

export default async function EditBranchPage({ params }: { params: Promise<{ id: string; branchId: string }> }) {
  const { id, branchId } = await params;
  const brand = await getBrandForAdmin(id);
  const branch = await prisma.branch.findFirst({ where: { id: branchId, brandId: brand.id } });
  if (!branch) notFound();

  return (
    <div className="space-y-6">
      <Card title={`Ubah: ${branch.name}`} actions={<Link href={`/admin/brands/${brand.id}/branches`} className="text-sm hover:underline">← Kembali</Link>}>
        <BranchForm action={updateBranch.bind(null, brand.id, branch.id)} branch={branch} />
      </Card>
      <Card>
        <form action={deleteBranch.bind(null, brand.id, branch.id)}>
          <ConfirmSubmit message={`Hapus cabang "${branch.name}"?`}>Hapus cabang</ConfirmSubmit>
        </form>
      </Card>
    </div>
  );
}
