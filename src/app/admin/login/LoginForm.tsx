"use client";

import { useActionState, useState } from "react";
import { loginAction } from "./actions";

export default function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction, pending] = useActionState(loginAction, undefined);
  const [show, setShow] = useState(false);

  return (
    <form action={formAction} className="flex flex-col gap-[18px]">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Email
        <input name="email" type="email" autoComplete="username" required placeholder="nama@nobitos.id" className="adm-input !h-[52px] !rounded-2xl !text-base" />
      </label>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-semibold">
          Password
        </label>
        <span className="flex h-[52px] items-center rounded-2xl border border-[#c9ccbc] bg-white pl-4 pr-1.5 focus-within:border-[#45593c] focus-within:shadow-[0_0_0_2px_rgba(69,89,60,0.35)]">
          <input
            id="password"
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className="min-w-0 flex-1 bg-transparent text-base text-[#141414] outline-none"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
            aria-pressed={show}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-[#5b6157] hover:text-[#141414]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
              <circle cx="12" cy="12" r="3" />
              {show && <path d="M4 4l16 16" />}
            </svg>
          </button>
        </span>
      </div>
      {state?.error && (
        <p role="alert" className="rounded-2xl bg-red-100 px-3.5 py-2.5 text-sm font-semibold text-red-800">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="adm-btn-dark !h-14 !text-[17px]">
        {pending ? "Masuk..." : "Masuk"}
      </button>
    </form>
  );
}
