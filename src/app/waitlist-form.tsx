"use client";

import { useActionState } from "react";
import { joinWaitlist } from "./actions";

export function WaitlistForm() {
  const [state, action, isPending] = useActionState(joinWaitlist, null);

  if (state?.success) {
    return (
      <div className="animate-fade-up flex items-center gap-3 rounded-lg border border-[#8ab892]/20 bg-[#8ab892]/5 px-6 py-3.5">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#8ab892"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5 shrink-0"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
        <span className="text-sm text-[#8ab892]">
          You&apos;re on the list. We&apos;ll be in touch.
        </span>
      </div>
    );
  }

  return (
    <form action={action} className="w-full max-w-md">
      <div className="flex gap-2">
        <input
          type="email"
          name="email"
          required
          placeholder="you@email.com"
          disabled={isPending}
          className="flex-1 rounded-lg border border-[#2a2a4a] bg-[#16213e]/60 px-4 py-3 text-sm text-[#e8e8f0] placeholder-[#6a6a8a] outline-none transition-colors duration-150 focus:border-[#d4884a]/40 focus:bg-[#16213e] disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isPending}
          className="shrink-0 rounded-lg bg-gradient-to-r from-[#d4884a] to-[#e0a850] px-5 py-3 text-sm font-semibold text-[#1a1a2e] transition-all duration-150 hover:shadow-[0_0_20px_rgba(212,136,74,0.25)] disabled:opacity-50"
        >
          {isPending ? (
            <span className="inline-flex items-center gap-2">
              <svg
                className="size-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="opacity-25"
                />
                <path
                  d="M4 12a8 8 0 018-8"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="opacity-75"
                />
              </svg>
              Joining...
            </span>
          ) : (
            "Join Waitlist"
          )}
        </button>
      </div>
      {state && !state.success && (
        <p className="mt-2 text-xs text-red-400">{state.error}</p>
      )}
    </form>
  );
}

export function WaitlistFormCompact() {
  const [state, action, isPending] = useActionState(joinWaitlist, null);

  if (state?.success) {
    return (
      <span className="flex items-center gap-1.5 text-xs text-[#8ab892]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-3.5"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
        On the list
      </span>
    );
  }

  return (
    <form action={action} className="flex items-center gap-2">
      <input
        type="email"
        name="email"
        required
        placeholder="you@email.com"
        disabled={isPending}
        className="w-40 rounded-md border border-[#2a2a4a] bg-[#16213e]/60 px-3 py-1.5 text-xs text-[#e8e8f0] placeholder-[#6a6a8a] outline-none transition-colors duration-150 focus:border-[#d4884a]/40 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isPending}
        className="shrink-0 rounded-md bg-gradient-to-r from-[#d4884a] to-[#e0a850] px-3 py-1.5 text-xs font-medium text-[#1a1a2e] transition-all duration-150 hover:shadow-[0_0_12px_rgba(212,136,74,0.2)] disabled:opacity-50"
      >
        {isPending ? "..." : "Join"}
      </button>
    </form>
  );
}
