"use client";

import { useActionState, useEffect, useRef } from "react";
import type { ActionState } from "@/lib/validation";

type Props = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  submitLabel?: string;
  className?: string;
  /** Kosongkan form setelah sukses (untuk form "tambah"). */
  resetOnSuccess?: boolean;
};

// Form server action dengan pesan sukses/error dan status loading.
export default function ActionForm({ action, children, submitLabel = "Simpan", className, resetOnSuccess }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok && resetOnSuccess) ref.current?.reset();
  }, [state, resetOnSuccess]);

  return (
    <form ref={ref} action={formAction} className={className ?? "space-y-4"}>
      {children}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
        >
          {pending ? "Menyimpan..." : submitLabel}
        </button>
        {state?.error && (
          <p role="alert" className="text-sm text-red-600">
            {state.error}
          </p>
        )}
        {state?.ok && <p className="text-sm text-green-700">{state.message ?? "Tersimpan."}</p>}
      </div>
    </form>
  );
}
