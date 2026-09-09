import type { Locale } from "@/i18n/locales";

export const signupAttributionFieldNames = {
  landingPath: "signup_landing_path",
  referrerHost: "signup_referrer_host",
  utmSource: "signup_utm_source",
  utmMedium: "signup_utm_medium",
  utmCampaign: "signup_utm_campaign",
} as const;

export const resendSignupPropertyKeys = {
  locale: "signup_locale",
  landingPath: "signup_landing_path",
  referrerHost: "signup_referrer_host",
  utmSource: "signup_utm_source",
  utmMedium: "signup_utm_medium",
  utmCampaign: "signup_utm_campaign",
} as const;

export type SignupAttribution = Record<
  (typeof signupAttributionFieldNames)[keyof typeof signupAttributionFieldNames],
  string
>;

export const ATTRIBUTION_KEY = "wenlan-acquisition-v1";
export const ATTRIBUTION_TTL_MS = 30 * 60 * 1000;
type AttributionStorage = Pick<Storage, "getItem" | "setItem">;

function safeAttribution(value: SignupAttribution): SignupAttribution {
  return Object.fromEntries(
    Object.entries(signupAttributionFieldNames).map(([name, key]) => [
      key,
      serverSafeAttributionValue(name as keyof typeof resendSignupPropertyKeys, boundedValue(value[key])),
    ]),
  ) as SignupAttribution;
}

// A short-lived first landing, never a persistent visitor identifier.
export function captureSignupAttribution(
  locationHref: string,
  referrer: string,
  storage?: AttributionStorage,
  now = Date.now(),
): SignupAttribution {
  const current = safeAttribution(browserSignupAttribution(locationHref, referrer));
  try {
    const raw = storage?.getItem(ATTRIBUTION_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      if (saved.version === 1 && Number.isFinite(saved.at) && saved.at <= now &&
          now - saved.at < ATTRIBUTION_TTL_MS && saved.data &&
          Object.values(signupAttributionFieldNames).every(key => typeof saved.data[key] === "string")) {
        return safeAttribution(saved.data);
      }
    }
  } catch { /* Private browsing and malformed storage must not break navigation. */ }
  try {
    storage?.setItem(ATTRIBUTION_KEY, JSON.stringify({ version: 1, at: now, data: current }));
  } catch { /* Continue with the current page when storage is unavailable. */ }
  return current;
}

export function currentSignupAttribution(): SignupAttribution {
  if (typeof window === "undefined" || window.navigator?.doNotTrack === "1" || window.navigator?.doNotTrack === "yes" ||
      (window.navigator as Navigator & { globalPrivacyControl?: boolean })?.globalPrivacyControl) {
    return { signup_landing_path: "", signup_referrer_host: "", signup_utm_source: "", signup_utm_medium: "", signup_utm_campaign: "" };
  }
  let storage: AttributionStorage | undefined;
  try { storage = window.sessionStorage; } catch { /* Storage can be denied. */ }
  return captureSignupAttribution(window.location.href, document.referrer, storage);
}

const MAX_ATTRIBUTION_VALUE_LENGTH = 120;
const UTM_VALUE = /^[\p{L}\p{N}][\p{L}\p{N} ._~-]*$/u;

function boundedValue(value: string | null | undefined) {
  return (value ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_ATTRIBUTION_VALUE_LENGTH);
}

function referrerHost(referrer: string) {
  if (!referrer) return "direct";

  try {
    return boundedValue(new URL(referrer).hostname.toLowerCase()) || "direct";
  } catch {
    return "direct";
  }
}

function serverSafeAttributionValue(
  propertyName: keyof typeof resendSignupPropertyKeys,
  value: string,
) {
  if (!value || value.includes("@")) return "";
  if (propertyName === "landingPath") {
    let decoded: string;
    try {
      decoded = decodeURIComponent(value);
    } catch {
      return "";
    }
    if (
      !value.startsWith("/") ||
      value.startsWith("//") ||
      /[?#\\]/.test(value) ||
      decoded.includes("@")
    ) {
      return "";
    }
  }
  if (propertyName === "referrerHost" && value !== "direct") {
    try {
      const parsed = new URL(`https://${value}`);
      if (
        parsed.hostname.toLowerCase() !== value.toLowerCase() ||
        parsed.username ||
        parsed.password ||
        parsed.port
      ) {
        return "";
      }
    } catch {
      return "";
    }
  }
  if (
    (propertyName === "utmSource" ||
      propertyName === "utmMedium" ||
      propertyName === "utmCampaign") &&
    !UTM_VALUE.test(value)
  ) {
    return "";
  }
  return value;
}

export function browserSignupAttribution(
  locationHref: string,
  referrer: string,
): SignupAttribution {
  let url: URL;
  try {
    url = new URL(locationHref);
  } catch {
    url = new URL("https://wenlan.app/");
  }

  return {
    signup_landing_path: boundedValue(url.pathname) || "/",
    signup_referrer_host: referrerHost(referrer),
    signup_utm_source: boundedValue(url.searchParams.get("utm_source")),
    signup_utm_medium: boundedValue(url.searchParams.get("utm_medium")),
    signup_utm_campaign: boundedValue(url.searchParams.get("utm_campaign")),
  };
}

export function resendSignupProperties(formData: FormData, locale: Locale) {
  const properties: Record<string, string> = {
    [resendSignupPropertyKeys.locale]: locale,
  };

  for (const [propertyName, formFieldName] of Object.entries(
    signupAttributionFieldNames,
  )) {
    const rawValue = formData.get(formFieldName);
    if (typeof rawValue !== "string") continue;

    const value = serverSafeAttributionValue(
      propertyName as keyof typeof resendSignupPropertyKeys,
      boundedValue(rawValue),
    );
    if (value) {
      properties[
        resendSignupPropertyKeys[
          propertyName as keyof typeof resendSignupPropertyKeys
        ]
      ] = value;
    }
  }

  return properties;
}
