"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { trackAnalyticsEvent } from "@/components/tracked-link";
import type { WaitlistContent } from "@/i18n/content";
import type { Locale } from "@/i18n/locales";
import {
  currentSignupAttribution,
  type SignupAttribution,
} from "@/lib/signup-attribution";
import { joinWaitlist } from "./actions";

const emptyAttribution: SignupAttribution = {
  signup_landing_path: "/",
  signup_referrer_host: "direct",
  signup_utm_source: "",
  signup_utm_medium: "",
  signup_utm_campaign: "",
};

export function WaitlistForm({
  copy,
  locale,
}: {
  copy: WaitlistContent;
  locale: Locale;
}) {
  const [state, action, isPending] = useActionState(joinWaitlist, null);
  const [email, setEmail] = useState("");
  const [attribution, setAttribution] =
    useState<SignupAttribution>(emptyAttribution);
  const signupTracked = useRef(false);
  const errorTracked = useRef<typeof state>(null);
  const errorMessage =
    state && !state.success
      ? (copy.errors[state.errorCode] ?? copy.fallbackError)
      : null;
  const emailInputId = `release-updates-email-${locale}`;
  const purposeId = `${emailInputId}-purpose`;
  const errorId = `${emailInputId}-error`;
  const describedBy = errorMessage ? `${purposeId} ${errorId}` : purposeId;

  useEffect(() => {
    setAttribution(currentSignupAttribution());
  }, []);

  useEffect(() => {
    if (!state?.success || signupTracked.current) return;
    signupTracked.current = true;
    trackAnalyticsEvent({
      eventName: "waitlist_signup",
      placement: "home-footer",
      locale,
      context: "home",
    });
  }, [locale, state]);

  useEffect(() => {
    if (!state || state.success || state === errorTracked.current) return;
    errorTracked.current = state;
    trackAnalyticsEvent({ eventName: "waitlist_error", placement: "home-footer", locale, context: "home", detail: state.errorCode });
  }, [locale, state]);

  if (state?.success) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="animate-fade-up flex items-center gap-3 rounded-lg border border-[var(--o-sage)]/20 bg-[var(--o-sage)]/5 px-6 py-3.5"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--o-sage)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0">
          <path d="M20 6 9 17l-5-5" />
        </svg>
        <span className="text-sm text-[var(--o-text)]">
          {copy.successMessage}
        </span>
      </div>
    );
  }

  return (
    <form action={action} aria-busy={isPending} className="min-w-0 w-full max-w-md">
      <input type="hidden" name="locale" value={locale} />
      {Object.entries(attribution).map(([name, value]) => (
        <input
          key={name}
          type="hidden"
          name={name}
          value={value}
        />
      ))}
      <label htmlFor={emailInputId} className="sr-only">
        {copy.emailLabel}
      </label>
      <p id={purposeId} className="mb-3 text-xs leading-relaxed text-[var(--o-text-muted)]">
        {copy.purpose}
      </p>
      <div className="flex min-w-0 flex-wrap gap-2">
        <input
          id={emailInputId}
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          maxLength={254}
          autoComplete="email"
          aria-describedby={describedBy}
          aria-invalid={errorMessage ? true : undefined}
          placeholder={copy.emailPlaceholder}
          disabled={isPending}
          className="min-w-0 flex-1 rounded-lg border border-[var(--o-border)] bg-[var(--o-input-bg)] px-4 py-3 text-sm text-[var(--o-text)] placeholder-[var(--o-text-muted)] outline-none transition-colors duration-150 focus:border-[var(--o-warm)]/40 focus:bg-[var(--o-input-focus-bg)] disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isPending}
          className="shrink-0 rounded-lg bg-gradient-to-r from-[var(--o-warm)] to-[var(--o-warm-hover)] px-5 py-3 text-sm font-semibold text-[var(--o-btn-text)] transition-all duration-150 hover:-translate-y-0.5 disabled:opacity-50"
        >
          {isPending ? (
            <span className="inline-flex items-center gap-2">
              <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
              </svg>
              <span aria-live="polite">{copy.pendingLabel}</span>
            </span>
          ) : (
            copy.submitLabel
          )}
        </button>
      </div>
      {errorMessage && (
        <p id={errorId} role="alert" aria-live="polite" className="mt-2 text-sm text-[var(--o-warm)]">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
