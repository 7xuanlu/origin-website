import { getCoreContent } from "@/i18n/content";
import { buildPageMetadata } from "@/i18n/metadata";
import { HomePage } from "../_pages/home";
import { getLatestRelease } from "@/lib/release-server";

export const metadata = buildPageMetadata(
  "en",
  "/",
  getCoreContent("en").home.content.seo,
);

export default async function LandingPage() {
  return <HomePage locale="en" release={await getLatestRelease()} />;
}
