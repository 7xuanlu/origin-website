import { readFileSync } from "node:fs";
import { join } from "node:path";

export type WelcomeEmailLocale = "en" | "zh-TW" | "zh-CN";

export type WelcomeEmailOptions = {
  /** Defaults to Traditional Chinese for backwards compatibility. */
  locale?: WelcomeEmailLocale;
  /** Defaults to the App's light palette; explicit dark version for previews/senders. */
  theme?: "light" | "dark";
  /** An absolute HTTP(S) unsubscribe endpoint supplied by the caller. */
  unsubscribeUrl?: string;
  /** Adds a visible marker for local previews and test renders. */
  includeTestFooter?: boolean;
};

export type WelcomeEmail = {
  subject: string;
  html: string;
  text: string;
  /** Pass with html/text to resend.emails.send so the logo is embedded, not remotely fetched. */
  attachments: { filename: string; content: string; contentId: string }[];
};

type WelcomeEmailCopy = {
  htmlLang: string;
  subject: string;
  preheader: string;
  logoAlt: string;
  brandName: string;
  title: string;
  greeting: string;
  introduction: string;
  introductionHtml: string;
  reviewNote: string;
  ctaLabel: string;
  setupNote: string;
  setupNoteHtml: string;
  nextLabel: string;
  nextDescription: string;
  docsLabel: string;
  githubLabel: string;
  homeLabel: string;
  footer: string;
  unsubscribePrompt: string;
  unsubscribeLabel: string;
  testFooter: string;
  textSeparator: string;
  homePath: string;
  docsPath: string;
  getStartedPath: string;
};

const BASE_URL = "https://wenlan.app";
const GITHUB_URL = "https://github.com/7xuanlu/wenlan";

const LOCALE_COPY = {
  en: {
    htmlLang: "en",
    subject: "Welcome to Wenlan",
    preheader: "Turn your documents and decisions into a source-backed AI work knowledge base.",
    logoAlt: "Wenlan logo",
    brandName: "Wenlan",
    title: "Welcome to Wenlan",
    greeting: "Thanks for joining Wenlan.",
    introduction:
      "Wenlan is a source-backed knowledge wiki for AI work. Turn documents, notes, and the decisions you make along the way into readable, searchable Pages—and find them again through your connected AI tools.",
    introductionHtml:
      "Wenlan is a source-backed knowledge wiki for AI work. Turn documents, notes, and the decisions you make along the way into readable, searchable Pages—and find them again through your connected AI tools.",
    reviewNote:
      "Follow each source and revision trail yourself so important work stays reviewable and your judgment stays in your hands.",
    ctaLabel: "Get started →",
    setupNote:
      "After installation, save one useful work note, then try finding it again from your AI tool.",
    setupNoteHtml:
      "After installation, save one useful work note, then try finding it again from your AI tool.",
    nextLabel: "What to explore next",
    nextDescription:
      "Start with the docs to see how Wenlan turns source material into citable Pages and a reusable AI workflow.",
    docsLabel: "Browse docs",
    githubLabel: "View on GitHub",
    homeLabel: "Back to Wenlan",
    footer: "Wenlan · LLM wiki for AI work",
    unsubscribePrompt: "Don't want these emails? ",
    unsubscribeLabel: "Unsubscribe",
    testFooter: "This is the welcome email test you requested; automatic sending is not enabled.",
    textSeparator: ":",
    homePath: "/",
    docsPath: "/docs",
    getStartedPath: "/docs/get-started",
  },
  "zh-TW": {
    htmlLang: "zh-Hant",
    subject: "歡迎來到文瀾｜Wenlan 文瀾",
    preheader: "把文件與決策整理成有來源依據的 AI 工作知識庫。",
    logoAlt: "文瀾標誌",
    brandName: "Wenlan 文瀾",
    title: "歡迎來到文瀾",
    greeting: "謝謝你來到 Wenlan 文瀾。",
    introduction:
      "文瀾是為 AI 工作設計的、有來源依據的知識 Wiki。你可以把文件、筆記與工作中累積的決策，整理成可閱讀、可搜尋的頁面，再透過已連接的 AI 工具找回。",
    introductionHtml:
      "文瀾是為 AI 工作設計的、有來源依據的<span style=\"white-space:nowrap;\">知識 Wiki</span>。你可以把文件、筆記與工作中累積的<span style=\"white-space:nowrap;\">決策</span>，整理成可閱讀、可搜尋的頁面，再透過已連接的 <span style=\"white-space:nowrap;\">AI 工具找回。</span>",
    reviewNote: "重要內容可沿著來源與修訂脈絡自行核對，保留你的判斷與審查主動權。",
    ctaLabel: "開始使用 →",
    setupNote: "安裝後，先保存一則工作紀錄，再試著從 AI 工具找回它。",
    setupNoteHtml:
      "安裝後，先保存一則工作紀錄，再試著從 AI 工具<span style=\"white-space:nowrap;\">找回它。</span>",
    nextLabel: "接下來可以看看",
    nextDescription: "從文件開始，理解 Wenlan 的有來源引用的知識頁與 AI 工作流程。",
    docsLabel: "瀏覽文件",
    githubLabel: "查看 GitHub",
    homeLabel: "回到 Wenlan",
    footer: "Wenlan 文瀾 · AI 工作的 LLM wiki",
    unsubscribePrompt: "不想再收到這類信件？",
    unsubscribeLabel: "取消訂閱",
    testFooter: "這封信是你要求的歡迎郵件測試，未啟用自動群發。",
    textSeparator: "：",
    homePath: "/zh-TW",
    docsPath: "/zh-TW/docs",
    getStartedPath: "/zh-TW/docs/get-started",
  },
  "zh-CN": {
    htmlLang: "zh-Hans",
    subject: "欢迎来到文澜｜Wenlan 文澜",
    preheader: "把文档与决策整理成有来源依据的 AI 工作知识库。",
    logoAlt: "文澜标志",
    brandName: "Wenlan 文澜",
    title: "欢迎来到文澜",
    greeting: "谢谢你来到 Wenlan 文澜。",
    introduction:
      "文澜是为 AI 工作设计的、有来源依据的知识 Wiki。你可以把文档、笔记与工作中积累的决策，整理成可阅读、可搜索的页面，再通过已连接的 AI 工具找回。",
    introductionHtml:
      "文澜是为 AI 工作设计的、有来源依据的知识 Wiki。你可以把文档、笔记与工作中积累的决策，整理成可阅读、可搜索的页面，再通过已连接的 <span style=\"white-space:nowrap;\">AI 工具找回。</span>",
    reviewNote: "重要内容可以沿着来源与修订脉络自行核对，保留你的判断与审核主动权。",
    ctaLabel: "开始使用 →",
    setupNote: "安装后，先保存一条工作记录，再试着从 AI 工具找回它。",
    setupNoteHtml: "安装后，先保存一条工作记录，再试着从 AI 工具找回它。",
    nextLabel: "接下来可以看看",
    nextDescription: "从文档开始，了解 Wenlan 的有来源引用的知识页面与 AI 工作流程。",
    docsLabel: "浏览文档",
    githubLabel: "查看 GitHub",
    homeLabel: "回到 Wenlan",
    footer: "Wenlan 文澜 · AI 工作的 LLM wiki",
    unsubscribePrompt: "不想再收到这类邮件？",
    unsubscribeLabel: "取消订阅",
    testFooter: "这封信是你要求的欢迎邮件测试，未启用自动群发。",
    textSeparator: "：",
    homePath: "/zh-CN",
    docsPath: "/zh-CN/docs",
    getStartedPath: "/zh-CN/docs/get-started",
  },
} as const satisfies Record<WelcomeEmailLocale, WelcomeEmailCopy>;

export const WELCOME_EMAIL_SUBJECT = LOCALE_COPY["zh-TW"].subject;

// App source: wenlan/src/index.css, light/dark --mem-* and --accent tokens.
// Logo is the unmodified wenlan/app/icons/128x128@2x.png asset, bundled with the email.
const PALETTES = {
  light: {
    background: "#FCFCFB", paper: "#FFFFFF", ink: "#1A1A2E",
    muted: "#586174", quiet: "#5D687A", line: "#E3E7EE",
    accent: "#5E58C8", accentText: "#514BB5", panel: "#F4F5FA", onAccent: "#FFFFFF",
  },
  dark: {
    background: "#11131A", paper: "#171A23", ink: "#F1EFE8",
    muted: "#C9C8D1", quiet: "#969BAD", line: "#2B3140",
    accent: "#8FB3EA", accentText: "#A5C3F3", panel: "#202432", onAccent: "#11131A",
  },
} as const;
type Palette = (typeof PALETTES)[keyof typeof PALETTES];
const LOGO_CONTENT_ID = "wenlan-welcome-logo";

const FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans TC', 'PingFang TC', sans-serif";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return character;
    }
  });
}

function normalizeUnsubscribeUrl(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;

  if (
    typeof value !== "string" ||
    value.length === 0 ||
    value !== value.trim() ||
    /[\u0000-\u001f\u007f]/.test(value)
  ) {
    throw new TypeError("unsubscribeUrl must be an absolute HTTP(S) URL");
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new TypeError("unsubscribeUrl must be an absolute HTTP(S) URL");
  }

  if (
    (url.protocol !== "http:" && url.protocol !== "https:") ||
    !url.hostname ||
    url.username ||
    url.password
  ) {
    throw new TypeError("unsubscribeUrl must be an absolute HTTP(S) URL");
  }

  return url.toString();
}

function link(href: string, label: string, color: string): string {
  return `<a href="${escapeHtml(href)}" style="color:${color};text-decoration:underline;text-underline-offset:3px;">${label}</a>`;
}

function ctaLink(href: string, label: string, colors: Palette): string {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;padding:14px 22px;border-radius:8px;background:${colors.accent};color:${colors.onAccent};font-size:15px;font-weight:700;line-height:1.4;text-decoration:none;white-space:nowrap;">${label}</a>`;
}

function buildUnsubscribeHtml(
  url: string | undefined,
  COLORS: Palette,
  copy: WelcomeEmailCopy,
): string {
  if (!url) return "";

  return `<p style="margin:18px 0 0;color:${COLORS.quiet};font-size:12px;line-height:1.6;">${copy.unsubscribePrompt}${link(url, copy.unsubscribeLabel, COLORS.muted)}</p>`;
}

function buildUnsubscribeText(url: string | undefined, copy: WelcomeEmailCopy): string {
  return url ? `${copy.unsubscribeLabel}${copy.textSeparator} ${url}` : "";
}

function buildTestFooterHtml(
  includeTestFooter: boolean,
  COLORS: Palette,
  copy: WelcomeEmailCopy,
): string {
  if (!includeTestFooter) return "";

  return `<p style="margin:18px 0 0;padding:10px 12px;border:1px solid ${COLORS.line};color:${COLORS.muted};font-size:12px;line-height:1.6;">${copy.testFooter}</p>`;
}

function buildTestFooterText(includeTestFooter: boolean, copy: WelcomeEmailCopy): string {
  return includeTestFooter ? copy.testFooter : "";
}

export function buildWelcomeEmail(options: WelcomeEmailOptions = {}): WelcomeEmail {
  const locale = options.locale ?? "zh-TW";
  const copy = LOCALE_COPY[locale];
  const COLORS = PALETTES[options.theme ?? "light"];
  const unsubscribeUrl = normalizeUnsubscribeUrl(options.unsubscribeUrl);
  const includeTestFooter = options.includeTestFooter === true;
  const homeUrl = `${BASE_URL}${copy.homePath}`;
  const docsUrl = `${BASE_URL}${copy.docsPath}`;
  const getStartedUrl = `${BASE_URL}${copy.getStartedPath}`;
  const escapedHomeUrl = escapeHtml(homeUrl);
  const escapedDocsUrl = escapeHtml(docsUrl);
  const escapedGetStartedUrl = escapeHtml(getStartedUrl);
  const escapedGithubUrl = escapeHtml(GITHUB_URL);

  const html = `<!doctype html>
<html lang="${copy.htmlLang}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${copy.subject}</title>
    <style>
      @media only screen and (max-width: 640px) {
        .email-shell { width:100% !important; }
        .email-pad { padding-left:24px !important; padding-right:24px !important; }
        .email-title { font-size:32px !important; }
        .email-links { display:block !important; }
        .email-link-cell { display:block !important; padding:5px 0 !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:${COLORS.background};color:${COLORS.ink};font-family:${FONT_STACK};-webkit-text-size-adjust:100%;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${copy.preheader}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;background:${COLORS.background};">
      <tr>
        <td align="center" style="padding:28px 12px 40px;">
          <table role="presentation" class="email-shell" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;border-collapse:collapse;background:${COLORS.paper};">
            <tr>
              <td class="email-pad" style="padding:24px 44px;border-bottom:1px solid ${COLORS.line};">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                  <td width="60" valign="middle"><a href="${escapedHomeUrl}"><img src="cid:${LOGO_CONTENT_ID}" width="48" height="48" alt="${copy.logoAlt}" style="display:block;width:48px;height:48px;border:0;"></a></td>
                  <td valign="middle"><a href="${escapedHomeUrl}" style="color:${COLORS.ink};font-size:19px;font-weight:700;letter-spacing:.01em;text-decoration:none;">${copy.brandName}</a></td>
                </tr></table>
              </td>
            </tr>
            <tr>
              <td class="email-pad" style="padding:46px 44px 34px;">
                <h1 class="email-title" style="margin:0;color:${COLORS.ink};font-family:${FONT_STACK};font-size:40px;font-weight:700;letter-spacing:-.03em;line-height:1.15;">${copy.title}</h1>
                <p style="margin:24px 0 0;color:${COLORS.ink};font-size:17px;line-height:1.85;">${copy.greeting}</p>
                <p style="margin:12px 0 0;color:${COLORS.muted};font-size:15px;line-height:1.9;">${copy.introductionHtml}</p>
                <p style="margin:12px 0 0;color:${COLORS.muted};font-size:15px;line-height:1.9;">${copy.reviewNote}</p>
              </td>
            </tr>
            <tr>
              <td class="email-pad" style="padding:0 44px 38px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
                  <tr>
                    <td>${ctaLink(escapedGetStartedUrl, copy.ctaLabel, COLORS)}</td>
                  </tr>
                </table>
                <p style="margin:18px 0 0;color:${COLORS.quiet};font-size:13px;line-height:1.7;">${copy.setupNoteHtml}</p>
              </td>
            </tr>
            <tr>
              <td class="email-pad" style="padding:0 44px 40px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;background:${COLORS.panel};">
                  <tr>
                    <td style="padding:20px 22px 18px;">
                      <p style="margin:0 0 10px;color:${COLORS.accentText};font-size:12px;font-weight:700;letter-spacing:.08em;">${copy.nextLabel}</p>
                      <p style="margin:0;color:${COLORS.ink};font-size:14px;line-height:1.8;">${copy.nextDescription}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="email-pad" style="padding:0 44px 40px;">
                <table role="presentation" class="email-links" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
                  <tr>
                    <td class="email-link-cell" style="padding:0 20px 0 0;font-size:13px;line-height:1.6;">${link(escapedDocsUrl, copy.docsLabel, COLORS.accentText)}</td>
                    <td class="email-link-cell" style="padding:0 20px 0 0;font-size:13px;line-height:1.6;">${link(escapedGithubUrl, copy.githubLabel, COLORS.accentText)}</td>
                    <td class="email-link-cell" style="padding:0;font-size:13px;line-height:1.6;">${link(escapedHomeUrl, copy.homeLabel, COLORS.accentText)}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="email-pad" style="padding:22px 44px 30px;border-top:1px solid ${COLORS.line};">
                <p style="margin:0;color:${COLORS.quiet};font-size:12px;line-height:1.7;">${copy.footer}</p>
                ${buildUnsubscribeHtml(unsubscribeUrl, COLORS, copy)}
                ${buildTestFooterHtml(includeTestFooter, COLORS, copy)}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>\n`;

  const textParts = [
    copy.brandName,
    copy.title,
    "",
    copy.greeting,
    copy.introduction,
    copy.reviewNote,
    "",
    `${copy.ctaLabel.replace(/\s*→$/, "")}${copy.textSeparator}${getStartedUrl}`,
    copy.setupNote,
    "",
    copy.nextLabel,
    copy.nextDescription,
    `${copy.docsLabel}${copy.textSeparator}${docsUrl}`,
    `${copy.githubLabel}${copy.textSeparator}${GITHUB_URL}`,
    `${copy.homeLabel}${copy.textSeparator}${homeUrl}`,
    "",
    copy.footer,
    buildUnsubscribeText(unsubscribeUrl, copy),
    buildTestFooterText(includeTestFooter, copy),
  ];

  return {
    subject: copy.subject,
    html,
    text: textParts.filter((part, index) => part !== "" || index === 0 || textParts[index - 1] !== "").join("\n"),
    attachments: [{
      filename: "wenlan-logo.png",
      contentId: LOGO_CONTENT_ID,
      // A statically traceable server attachment, guarded by the postbuild trace check.
      content: readFileSync(join(process.cwd(), "src/lib/email/wenlan-logo.png")).toString("base64"),
    }],
  };
}
