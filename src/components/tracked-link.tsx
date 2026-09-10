"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import type { Locale } from "@/i18n/locales";
import { localizedHrefForLocale } from "@/i18n/navigation";
import { currentSignupAttribution } from "@/lib/signup-attribution";
import { launchEventProperties } from "@/lib/launch-campaign";
import { inferReleaseDownload } from "@/lib/release-manifest";
import { sendSiteEvent } from "@/lib/site-event-client";

export type AnalyticsEventName =
  | "get_started_click"
  | "github_outbound"
  | "learn_article_click"
  | "setup_path_click"
  | "waitlist_signup"
  | "video_play_click"
  | "waitlist_error"
  | "scenario_select"
  | "comparison_select"
  | "product_view_select"
  | "product_image_open"
  | "source_expand";

export type AnalyticsPlacement =
  | "home-hero"
  | "home-acquisition"
  | "home-download"
  | "home-footer"
  | "home-demo"
  | "download-page"
  | "learn-search-path"
  | "learn-grid"
  | "learn-footer"
  | "learn-article"
  | "docs-get-started"
  | "docs-article"
  | "home-scenario"
  | "home-comparison"
  | "home-product-views";

export type AnalyticsContext =
  | "home"
  | "concepts"
  | "comparisons"
  | "workflows"
  | "setup";

type AnalyticsDestinationCategory = "email" | "github" | "learn" | "setup" | "video" | "example" | "comparison" | "product";

type AnalyticsEventData = {
  readonly placement: AnalyticsPlacement;
  readonly locale: Locale;
  readonly context: AnalyticsContext;
  readonly destination_category: AnalyticsDestinationCategory;
  readonly campaign_source?: string;
  readonly campaign_medium?: string;
  readonly campaign?: string;
  readonly asset_id?: string;
  readonly release_tag?: string;
  readonly detail?: string;
};

declare global {
  interface Window {
    umami?: {
      track: (eventName: AnalyticsEventName, data: AnalyticsEventData) => void | Promise<unknown>;
    };
  }
}

const destinationCategoryByEvent: Record<
  AnalyticsEventName,
  AnalyticsDestinationCategory
> = {
  get_started_click: "setup",
  github_outbound: "github",
  learn_article_click: "learn",
  setup_path_click: "setup",
  waitlist_signup: "email",
  video_play_click: "video",
  waitlist_error: "email",
  scenario_select: "example",
  comparison_select: "comparison",
  product_view_select: "product",
  product_image_open: "product",
  source_expand: "example",
};

type TrackingProps = {
  readonly eventName: AnalyticsEventName;
  readonly placement: AnalyticsPlacement;
  readonly locale: Locale;
  readonly context: AnalyticsContext;
  readonly detail?: string;
};

export function trackAnalyticsEvent({
  eventName,
  placement,
  locale,
  context,
  href,
  detail,
}: TrackingProps & { href?: string }) {
  if (typeof window === "undefined" || window.navigator?.doNotTrack === "1" || window.navigator?.doNotTrack === "yes" ||
      (window.navigator as Navigator & { globalPrivacyControl?: boolean })?.globalPrivacyControl) return;
  try {
    const attribution = window.location ? currentSignupAttribution() : null;
    const campaign = attribution ? launchEventProperties(attribution.signup_utm_source, attribution.signup_utm_medium, attribution.signup_utm_campaign) : {};
    const asset = eventName === "github_outbound" && href ? inferReleaseDownload(href) : undefined;
    sendSiteEvent({ event: eventName, placement, locale, context,
      ...(detail ? { detail } : {}),
      ...(asset ?? {}),
    }, attribution);
    const pending = window.umami?.track(eventName, {
      placement, locale, context,
      destination_category: destinationCategoryByEvent[eventName],
      ...campaign,
      ...(asset ?? {}),
      ...(detail ? { detail } : {}),
    });
    pending?.catch(() => {});
  } catch { /* A blocked analytics provider must never prevent the user action. */ }
}

type TrackedLinkProps = Omit<ComponentProps<typeof NextLink>, "href" | "onClick"> &
  TrackingProps & {
    readonly href: string;
  };

export function TrackedLink({
  eventName,
  placement,
  locale,
  context,
  detail,
  ...props
}: TrackedLinkProps) {
  return (
    <NextLink
      {...props}
      onClick={() =>
        trackAnalyticsEvent({ eventName, placement, locale, context, detail, href: props.href })
      }
    />
  );
}

type TrackedLocalizedLinkProps = Omit<TrackedLinkProps, "href"> & {
  readonly href: string;
};

export function TrackedLocalizedLink({
  href,
  locale,
  ...props
}: TrackedLocalizedLinkProps) {
  return (
    <TrackedLink
      {...props}
      href={localizedHrefForLocale(locale, href)}
      locale={locale}
    />
  );
}
