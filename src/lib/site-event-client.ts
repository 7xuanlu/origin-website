"use client";

import type { SignupAttribution } from "./signup-attribution";

export const SITE_EVENTS_DISABLED_STORAGE_KEY = "wenlan-site-events-disabled";

// Only coarse, finite labels leave the browser. Never transmit an arbitrary
// referrer, UTM value, form value, URL query, or persistent visitor identifier.
export function eventSource(attribution: SignupAttribution | null): string {
  const host = attribution?.signup_referrer_host?.toLowerCase() ?? "";
  const utm = attribution?.signup_utm_source?.toLowerCase() ?? "";
  const sources: Record<string, string> = {
    "google.com": "google", "www.google.com": "google", "bing.com": "bing", "www.bing.com": "bing",
    "github.com": "github", "chatgpt.com": "chatgpt", "chat.openai.com": "chatgpt",
    "claude.ai": "claude", "gemini.google.com": "gemini", "reddit.com": "reddit", "www.reddit.com": "reddit",
    "youtube.com": "youtube", "www.youtube.com": "youtube", "youtu.be": "youtube",
    "t.co": "social", "x.com": "social", "l.threads.com": "social", "linkedin.com": "social", "www.linkedin.com": "social",
  };
  const campaignSources: Record<string, string> = {
    github: "github", reddit: "reddit", youtube: "youtube", x: "social", threads: "social", linkedin: "social",
    wechat: "social", zhihu: "social", xiaohongshu: "social", bilibili: "social",
    email: "other", producthunt: "other", hackernews: "other", directory: "other",
  };
  if (Object.hasOwn(campaignSources, utm)) return campaignSources[utm];
  if (Object.hasOwn(sources, host)) return sources[host];
  if (utm) return "other";
  return !host || host === "direct" ? "direct" : "other";
}

function hasLocalSiteEventsOptOut(): boolean {
  try {
    if (!("localStorage" in window)) return false;
    return window.localStorage.getItem(SITE_EVENTS_DISABLED_STORAGE_KEY) === "1";
  } catch {
    return true;
  }
}

export function sendSiteEvent(
  payload: { event: string; placement: string; locale: string; context: string; detail?: string; asset_id?: string; release_tag?: string },
  attribution: SignupAttribution | null,
) {
  if (process.env.NEXT_PUBLIC_SITE_EVENTS_ENABLED !== "1" || typeof window === "undefined") return;
  if (hasLocalSiteEventsOptOut()) return;
  if (window.navigator?.doNotTrack === "1" || window.navigator?.doNotTrack === "yes" ||
      (window.navigator as Navigator & { globalPrivacyControl?: boolean })?.globalPrivacyControl) return;
  try {
    const url = new URL(window.location.href);
    const local = process.env.NODE_ENV === "development" && ["localhost", "127.0.0.1"].includes(url.hostname);
    if (url.origin !== "https://wenlan.app" && !local) return;
    // No retry queue: retried requests would inflate anonymous operation counts.
    void fetch("/api/site-events", {
      method: "POST", credentials: "omit", keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, page: url.pathname, source: eventSource(attribution) }),
    }).catch(() => {});
  } catch { /* Optional telemetry must never block a user action. */ }
}
