import { flattenLeafStrings } from "./hash";

const tokenPatterns = [
  /\bWenlan\b/g,
  /\bObsidian\b/g,
  /\bNotion\b/g,
  /\bClaude Code\b/g,
  /\bCodex\b/g,
  /\bGitHub\b/g,
  /\/plugin\s+(?:marketplace\s+add|install)\s+[A-Za-z0-9@/_-]+/g,
  /\/setup/g,
  /\/distill\b/g,
  /\bnpx\s+-y\s+wenlan\s+setup\b/g,
  /~\/\.[A-Za-z0-9_-]+\/bin\/[A-Za-z0-9_-]+(?:\s+[A-Za-z0-9_-]+){0,6}/g,
  /~\/\.wenlan(?:\/[A-Za-z0-9._/-]*)?/g,
  /\bcrates\/[A-Za-z0-9._/-]+/g,
  /\b[A-Z][A-Z0-9_-]+\.md\b/g,
  /https?:\/\/[^\s`"'<>),，。]+/g,
  /\bv?\d+\.\d+\.\d+(?:[-+][A-Za-z0-9.-]+)?\b/g,
  /@[a-z0-9][a-z0-9._-]*\/[a-z0-9][a-z0-9._-]*/gi,
  /\b[a-z0-9][a-z0-9._-]*@[a-z0-9][a-z0-9._-]*\b/gi,
  /\b[a-z0-9][a-z0-9._-]*\/[a-z0-9][a-z0-9._-]*\b/gi,
  /\bWENLAN_[A-Z0-9_]+\b/g,
  /\bLME_[A-Za-z0-9_]+\b/g,
  /\b\d+(?:,\d{3})*\s+tokens\s+\/\s+query\b/g,
  /\b\d+(?:\.\d+)?%/g,
  /\b\d+\.\d{3}\b/g,
  /\bApache-2\.0\b/g,
  /\bQi-Xuan Lu\b/g,
  /\b7xuanlu\b/g,
] as const;

export function extractProtectedTokens(source: unknown): string[] {
  const tokens: string[] = [];
  const seen = new Set<string>();

  for (const { value } of flattenLeafStrings(source)) {
    collectProtectedTokens(value, tokens, seen);
  }

  return tokens;
}

export function assertProtectedTokensPreserved(
  source: unknown,
  translated: unknown,
  label: string,
): void {
  const translatedLeaves = new Map(
    flattenLeafStrings(translated).map(({ path, value }) => [path, value]),
  );
  const missing: string[] = [];

  for (const sourceLeaf of flattenLeafStrings(source)) {
    const translatedValue = translatedLeaves.get(sourceLeaf.path) ?? "";

    if (isExactProtectedLeafPath(sourceLeaf.path)) {
      if (translatedValue !== sourceLeaf.value) {
        missing.push(formatMissingToken(sourceLeaf.path, sourceLeaf.value));
      }
      continue;
    }

    for (const token of extractProtectedTokens(sourceLeaf.value)) {
      if (!translatedValue.includes(token) && !hasApprovedLocalizedAlias(sourceLeaf.path, token, translatedValue, label)) {
        missing.push(formatMissingToken(sourceLeaf.path, token));
      }
    }
  }

  if (missing.length > 0) {
    throw new Error(`Protected tokens missing in ${label}: ${missing.join(", ")}`);
  }
}

function hasApprovedLocalizedAlias(
  path: string,
  token: string,
  translatedValue: string,
  label: string,
): boolean {
  if (path !== "redesign.hero.description" || token !== "Wenlan") return false;

  const expectedAlias = label.startsWith("zh-TW.")
    ? "文瀾"
    : label.startsWith("zh-CN.")
      ? "文澜"
      : null;

  return expectedAlias !== null && translatedValue.includes(expectedAlias);
}

function isExactProtectedLeafPath(path: string): boolean {
  return path === "href" || path.endsWith(".href");
}

function collectProtectedTokens(
  source: string,
  tokens: string[],
  seen: Set<string>,
): void {
  for (const pattern of tokenPatterns) {
    for (const match of source.matchAll(pattern)) {
      const token = cleanToken(match[0]);
      if (token && !seen.has(token)) {
        seen.add(token);
        tokens.push(token);
      }
    }
  }
}

function formatMissingToken(path: string, token: string): string {
  return path ? `${path}: ${token}` : token;
}

function cleanToken(token: string): string {
  return token.trim().replace(/[.,;:!?]+$/g, "");
}
