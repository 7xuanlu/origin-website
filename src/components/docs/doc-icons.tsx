import type { ComponentType } from "react";
import {
  ArrowClockwiseIcon,
  BookOpenIcon,
  GearSixIcon,
  PlugIcon,
  ShieldCheckIcon,
  TerminalIcon,
  TrayArrowDownIcon,
  WrenchIcon,
} from "@/components/icons";

type IconComponent = ComponentType<{ className?: string }>;

const SETUP_IDS = new Set([
  "get-started",
  "install-runtime",
  "windows-download",
  "all-downloads",
  "try-first",
]);

const FLOW_IDS = new Set([
  "daily-workflow",
  "updates-and-uninstall",
  "upgrade-notes",
  "backup-and-migration",
]);

const CAPTURE_IDS = new Set([
  "capture-quality",
  "import-and-portability",
  "local-git-history",
]);

const TRUST_IDS = new Set([
  "review-and-trust",
  "security",
  "data-and-privacy",
  "evaluation",
]);

const TOOLING_IDS = new Set([
  "commands",
  "cli-and-service",
  "configuration",
  "environment-variables",
  "build-from-source",
  "testing-and-ci",
  "experimental-flags",
  "advanced-retrieval",
  "models-and-keys",
  "architecture",
  "desktop-app",
]);

const CONNECT_IDS = new Set([
  "http-api",
  "api-examples",
  "typed-clients",
  "mcp-clients",
  "claude-code-plugin",
  "codex",
  "chatgpt-web",
  "other-mcp-clients",
  "agent-profiles",
  "packages-and-registries",
  "platforms",
]);

const FIX_IDS = new Set(["troubleshooting", "diagnostics-and-issue-reports"]);

function iconForDocId(id: string): IconComponent {
  if (SETUP_IDS.has(id)) return TerminalIcon;
  if (FLOW_IDS.has(id)) return ArrowClockwiseIcon;
  if (CAPTURE_IDS.has(id)) return TrayArrowDownIcon;
  if (TRUST_IDS.has(id)) return ShieldCheckIcon;
  if (TOOLING_IDS.has(id)) return GearSixIcon;
  if (CONNECT_IDS.has(id)) return PlugIcon;
  if (FIX_IDS.has(id)) return WrenchIcon;
  return BookOpenIcon;
}

export function DocItemIcon({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  const Icon = iconForDocId(id);
  return <Icon className={className} />;
}
