import { buildRootMetadata, viewport } from "@/i18n/metadata";
import RootDocument from "../root-document";
import "../globals.css";

export const metadata = buildRootMetadata("en");
// Also retry after a cold-cache GitHub failure; never freeze the fallback build.
export const revalidate = 300;
export { viewport };

export default function EnglishRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
