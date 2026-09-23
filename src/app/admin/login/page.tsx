import LoginForm from "./LoginForm";

export const metadata = { title: "Login" };

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-md sm:p-8">
        <h1 className="text-xl font-bold">Admin Nobitos</h1>
        <p className="mb-6 mt-1 text-sm text-gray-600">Masuk untuk mengelola semua brand.</p>
        <LoginForm callbackUrl={callbackUrl ?? "/admin"} />
        <p className="mt-6 text-xs text-gray-500">
          Lupa password? Reset lewat server: <code className="rounded bg-gray-100 px-1">npm run admin:set-password -- email</code>
        </p>
      </div>
    </div>
  );
}
