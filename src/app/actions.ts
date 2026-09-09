"use server";

import { Resend } from "resend";
import { isSupportedLocale, type Locale } from "@/i18n/locales";
import { resendSignupProperties } from "@/lib/signup-attribution";

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

type WaitlistResult =
  | { success: true }
  | { success: false; errorCode: "required" | "invalid" | "notConfigured" | "unknown" };

export async function joinWaitlist(
  _prev: WaitlistResult | null,
  formData: FormData
): Promise<WaitlistResult> {
  const email = formData.get("email");
  const rawLocale = formData.get("locale");

  if (!email || typeof email !== "string") {
    return { success: false, errorCode: "required" };
  }

  const trimmed = email.trim().toLowerCase();
  if (trimmed.length > 254 || trimmed.split("@")[0].length > 64 ||
      /[\u0000-\u001f\u007f]/.test(trimmed) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { success: false, errorCode: "invalid" };
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!process.env.RESEND_API_KEY || !audienceId) {
    console.error("Release subscription is not configured");
    return { success: false, errorCode: "notConfigured" };
  }

  try {
    const resend = getResend();
    const locale: Locale =
      typeof rawLocale === "string" && isSupportedLocale(rawLocale)
        ? rawLocale
        : "en";
    const properties =
      process.env.RESEND_ACQUISITION_PROPERTIES_ENABLED === "1"
        ? resendSignupProperties(formData, locale)
        : undefined;
    const result = await resend.contacts.create({
      email: trimmed,
      audienceId,
      properties,
    });
    if (result.error) {
      // Provider errors may contain the submitted address. Keep it out of logs.
      console.error("Release subscription provider rejected the request");
      return { success: false, errorCode: "unknown" };
    }
    if (!result.data?.id) return { success: false, errorCode: "unknown" };
    return { success: true };
  } catch {
    console.error("Release subscription provider is unavailable");
    return { success: false, errorCode: "unknown" };
  }
}
