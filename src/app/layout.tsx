import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Origin — One memory, every agent",
  description:
    "Open-source personal memory layer that makes every AI tool you use smarter. Local-first, privacy-first, MCP-native. You own the data.",
  openGraph: {
    title: "Origin — One memory, every agent",
    description:
      "Open-source personal memory layer that makes every AI tool you use smarter.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} dark`}
    >
      <body className="bg-zinc-950 text-zinc-100 antialiased">{children}</body>
    </html>
  );
}
