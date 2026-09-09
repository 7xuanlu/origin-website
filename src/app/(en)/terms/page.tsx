import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Wenlan",
  description: "Terms for Wenlan's website and hosted query connector, including content ownership, acceptable use, and software license boundaries.",
  alternates: { canonical: "https://wenlan.app/terms" },
  robots: { index: false, follow: true },
};

const sections = [
  {
    title: "Who provides Wenlan",
    paragraphs: [
      "Wenlan is independently developed by Qi-Xuan Lu (QIXUAN LU), not by OpenAI. These terms cover the wenlan.app website and any Wenlan-operated query connector made available to you. They do not state that a connector is currently available in every AI client, region, or plugin directory, or that a directory operator endorses Wenlan.",
      "Using the website or a Wenlan-operated connector means accepting these terms for that service. Downloadable software remains governed by its own license. These terms do not replace the agreement between you and your AI client or model provider.",
    ],
  },
  {
    title: "The query connector",
    paragraphs: [
      "The query connector retrieves saved knowledge, existing project Briefs, and sources supporting knowledge pages from a connected Wenlan library. It does not provide tools to create, edit, or delete that knowledge. Searches may record local activity as described in the Privacy Policy.",
      "You are responsible for configuring your Wenlan installation and connecting only content you are authorized to share. A local connection may be unavailable when your device, daemon, or network is offline. Local storage does not mean that results returned to a remote AI client stay on your device.",
    ],
  },
  {
    title: "Your content stays yours",
    paragraphs: [
      "You retain your rights in the content you connect. You permit Wenlan to process requests and return relevant content only as needed to provide the connector functionality you request, subject to the Privacy Policy and your access permissions. This does not give Wenlan a general right to publish your library or use it for unrelated purposes.",
      "You must have the rights and authority to provide connected content to the AI client receiving the results. Do not connect another person's library or use a connection to bypass access restrictions.",
    ],
  },
  {
    title: "Acceptable use",
    paragraphs: [
      "Do not use the service unlawfully, infringe other people's rights, attempt unauthorized access, circumvent security controls, or interfere with service operation. Do not submit authentication secrets, payment-card data, protected health information, or government identifiers through queries or connected content. The connector is not intended for children under 13. Follow your AI client's eligibility and content restrictions, including its rules on children's personal information.",
      "Keep connection credentials and private access URLs confidential. Do not post credentials, private knowledge, or unredacted logs in public support channels.",
    ],
  },
  {
    title: "Results and other services",
    paragraphs: [
      "Retrieved knowledge and AI-generated answers can be incomplete, outdated, or incorrect. Source references help you inspect evidence; they do not guarantee that an answer is true. Check important results before relying on them. Wenlan is not a substitute for qualified medical, legal, or financial advice.",
      "Your AI client and its provider process the results they receive under their own terms and data controls. Disconnecting Wenlan does not delete copies already received by those services. Third-party availability and terms are separate from Wenlan's.",
    ],
  },
  {
    title: "Open-source software",
    paragraphs: [
      "Wenlan's runtime, CLI, MCP server, and local plugin files are licensed under Apache-2.0. The desktop app and its shipped frontend are licensed under AGPL-3.0-only. Third-party components retain their accompanying licenses. These terms do not restrict rights granted by those licenses.",
    ],
  },
  {
    title: "Availability and ending use",
    paragraphs: [
      "A hosted connector may be changed, interrupted, or discontinued. Access may be restricted to address abuse, security risks, or legal requirements. No continuous availability or particular plugin-directory placement is promised. You can stop using the connector, disconnect it in your AI client, and stop Remote Access on your device.",
      "Disconnecting or uninstalling is not the same as deleting your local knowledge, backups, activity history, or data already held by another service. Consult the Privacy Policy for the separate data-deletion steps. Nothing in these terms excludes rights or remedies that applicable law does not allow to be excluded.",
    ],
  },
  {
    title: "Changes to these terms",
    paragraphs: [
      "Revisions will be published on this page with an updated version. Changes apply prospectively, not retroactively. Where applicable law requires additional notice or consent, that requirement still applies. If you do not accept revised service terms, stop using the affected service; your existing open-source software rights remain unchanged.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main id="main-content" className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <nav aria-label="Breadcrumb" className="mb-10 text-sm text-[var(--o-text-secondary)]">
        <Link href="/" className="underline underline-offset-4">Wenlan</Link>
        <span aria-hidden="true"> / </span>
        <span>Terms of Service</span>
      </nav>
      <article className="[overflow-wrap:anywhere]">
        <header className="mb-10 border-b border-[var(--o-border-subtle)] pb-8">
          <h1 className="text-3xl font-semibold tracking-normal">Terms of Service</h1>
          <p className="mt-3 text-sm text-[var(--o-text-secondary)]">Wenlan · Version 1.0</p>
        </header>
        {sections.map((section) => (
          <section key={section.title} className="mb-9">
            <h2 className="mb-3 text-xl font-semibold tracking-normal">{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mb-3 text-base leading-7 text-[var(--o-text-secondary)]">{paragraph}</p>
            ))}
          </section>
        ))}
        <section className="mb-9">
          <h2 className="mb-3 text-xl font-semibold tracking-normal">Privacy and contact</h2>
          <p className="mb-3 text-base leading-7 text-[var(--o-text-secondary)]">
            Read the <a className="underline underline-offset-4" href="https://github.com/7xuanlu/wenlan/blob/main/docs/PRIVACY.md">Wenlan Privacy Policy</a> for data handling, recipients, retention, and deletion information.
          </p>
          <p className="text-base leading-7 text-[var(--o-text-secondary)]">
            General questions can be raised in the <a className="underline underline-offset-4" href="https://github.com/7xuanlu/wenlan/issues">Wenlan issue tracker</a>. It is public: ask for a private contact method before sharing information about an individual data request. Do not include private content in the initial issue.
          </p>
        </section>
      </article>
    </main>
  );
}
