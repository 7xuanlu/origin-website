"use client";

import { useActionState } from "react";
import { joinWaitlist } from "./actions";

export function WaitlistForm() {
  const [state, action, isPending] = useActionState(joinWaitlist, null);

  if (state?.success) {
    return (
      <div className="animate-fade-up flex items-center gap-3 rounded-lg border border-[var(--o-sage)]/20 bg-[var(--o-sage)]/5 px-6 py-3.5">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--o-sage)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0">
          <path d="M20 6 9 17l-5-5" />
        </svg>
        <span className="text-sm text-[var(--o-sage)]">
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
          className="flex-1 rounded-lg border border-[var(--o-border)] bg-[var(--o-input-bg)] px-4 py-3 text-sm text-[var(--o-text)] placeholder-[var(--o-text-muted)] outline-none transition-colors duration-150 focus:border-[var(--o-warm)]/40 focus:bg-[var(--o-input-focus-bg)] disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isPending}
          className="shrink-0 rounded-lg bg-gradient-to-r from-[var(--o-warm)] to-[var(--o-warm-hover)] px-5 py-3 text-sm font-semibold text-[var(--o-btn-text)] transition-all duration-150 hover:shadow-[0_0_20px_var(--o-glow-warm)] disabled:opacity-50"
        >
          {isPending ? (
            <span className="inline-flex items-center gap-2">
              <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
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
