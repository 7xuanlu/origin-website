import { buildRootMetadata, viewport } from "@/i18n/metadata";
import { TRANSLATED_LOCALES, type TranslatedLocale } from "@/i18n/locales";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RootDocument from "../root-document";
import "../globals.css";

type LocaleLayoutParams = {
  locale: string;
};

export const revalidate = 300;

function translatedLocaleOrNotFound(locale: string): TranslatedLocale {
  if (!TRANSLATED_LOCALES.includes(locale as TranslatedLocale)) {
    notFound();
  }

  return locale as TranslatedLocale;
}

export function generateStaticParams() {
  return TRANSLATED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<LocaleLayoutParams>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildRootMetadata(translatedLocaleOrNotFound(locale));
}

export { viewport };

export default async function LocaleRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<LocaleLayoutParams>;
}) {
  const { locale } = await params;

  return (
    <RootDocument locale={translatedLocaleOrNotFound(locale)}>
      {children}
    </RootDocument>
  );
}
