import type { Metadata } from "next";
import { Fraunces, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

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
      className={`${fraunces.variable} ${instrumentSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-[#1a1a2e] text-[#e8e8f0] antialiased">
        {children}
      </body>
    </html>
  );
}
