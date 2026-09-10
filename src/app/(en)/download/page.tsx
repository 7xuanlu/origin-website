import { getCoreContent } from "@/i18n/content";
import { buildPageMetadata } from "@/i18n/metadata";
import { DownloadPage } from "../../_pages/download";
import { getLatestRelease } from "@/lib/release-server";

export const metadata = buildPageMetadata(
  "en",
  "/download",
  getCoreContent("en").home.content.download.page.seo,
);

export default async function EnglishDownloadPage() {
  return <DownloadPage locale="en" release={await getLatestRelease()} />;
}
