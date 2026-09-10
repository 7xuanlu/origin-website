import { unstable_cache } from "next/cache";
import { cache } from "react";

import { WENLAN_RELEASE } from "./releases";
import {
  RELEASE_API,
  RELEASE_REVALIDATE_SECONDS,
  fetchPublishedRelease,
  type WenlanRelease,
} from "./release-manifest";

// release-manifest validates the bundled source shape and exact repository/tag
// URLs at module load. Keep its audited historical values as the fallback; do
// not synthesize support-asset evidence that was not present in source.
const BUNDLED_RELEASE: WenlanRelease = {
  version: WENLAN_RELEASE.version,
  tag: WENLAN_RELEASE.tag,
  publishedAt: WENLAN_RELEASE.publishedAt,
  releaseUrl: WENLAN_RELEASE.releaseUrl,
  setupGuideUrl: WENLAN_RELEASE.setupGuideUrl,
  assets: WENLAN_RELEASE.assets.map((asset) => ({ ...asset })),
};

const getCachedLatestRelease = unstable_cache(
  () => fetchPublishedRelease(),
  ["wenlan-release-manifest-v1", RELEASE_API],
  { revalidate: RELEASE_REVALIDATE_SECONDS },
);

// `server-only` is not a dependency in this checkout. This module is imported
// only by server-side routes, and has no process-local cache pretending to be durable.
export const getReleaseResolution = cache(async () => {
  try {
    return { release: await getCachedLatestRelease(), source: "github-cache" as const };
  } catch {
    // A cold start may have no persistent Next cache yet; use the validated
    // bundled release while retaining the last-good cached value on failures.
    console.warn("[release] GitHub resolution unavailable; serving bundled fallback");
    return { release: BUNDLED_RELEASE, source: "bundled-fallback" as const };
  }
});

export const getLatestRelease = cache(async (): Promise<WenlanRelease> =>
  (await getReleaseResolution()).release,
);
