import type { NextConfig } from "next";

const NOINDEX_FOLLOW = [
  { key: "X-Robots-Tag", value: "noindex, follow" },
];

const NOINDEX_ASSET = [
  { key: "X-Robots-Tag", value: "noindex" },
];

const CANONICAL_ORIGIN = "https://wenlan.app";
const BRIDGE_HOSTS = [
  "www.wenlan.app",
  "useorigin.app",
  "www.useorigin.app",
] as const;

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    globalNotFound: true,
  },
  async headers() {
    return [
      { source: "/llms.txt", headers: NOINDEX_FOLLOW },
      { source: "/llms-full.txt", headers: NOINDEX_FOLLOW },
      { source: "/feed.xml", headers: NOINDEX_FOLLOW },
      { source: "/humans.txt", headers: NOINDEX_FOLLOW },
      { source: "/manifest.webmanifest", headers: NOINDEX_FOLLOW },
      { source: "/.well-known/security.txt", headers: NOINDEX_FOLLOW },
      { source: "/_next/static/media/:path*", headers: NOINDEX_ASSET },
      { source: "/examples/:path*", headers: NOINDEX_ASSET },
    ];
  },
  async redirects() {
    return [
      ...BRIDGE_HOSTS.map((host) => ({
        source: "/:path*",
        has: [{ type: "host" as const, value: host }],
        destination: `${CANONICAL_ORIGIN}/:path*`,
        permanent: true,
      })),
      {
        source: "/learn/origin-for-claude-code",
        destination: "/learn/wenlan-for-claude-code",
        permanent: true,
      },
      {
        source: "/learn/claude-code-memory-command-vs-origin",
        destination: "/learn/claude-code-memory-command-vs-wenlan",
        permanent: true,
      },
      {
        source: "/learn/where-origin-stores-claude-code-memory",
        destination: "/learn/where-wenlan-stores-claude-code-memory",
        permanent: true,
      },
      {
        source: "/learn/origin-vs-basic-memory",
        destination: "/learn/wenlan-vs-basic-memory",
        permanent: true,
      },
      {
        source: "/learn/origin-vs-claude-mem",
        destination: "/learn/wenlan-vs-claude-mem",
        permanent: true,
      },
      {
        source: "/learn/origin-vs-superlocal-memory",
        destination: "/learn/wenlan-vs-superlocal-memory",
        permanent: true,
      },
      {
        source: "/learn/origin-codex-workflow",
        destination: "/learn/wenlan-codex-workflow",
        permanent: true,
      },
      {
        source: "/learn/origin-cursor-workflow",
        destination: "/learn/wenlan-cursor-workflow",
        permanent: true,
      },
      {
        source: "/learn/origin-claude-desktop-workflow",
        destination: "/learn/wenlan-claude-desktop-workflow",
        permanent: true,
      },
      {
        source: "/learn/origin-gemini-cli-workflow",
        destination: "/learn/wenlan-gemini-cli-workflow",
        permanent: true,
      },
      {
        source: "/learn/origin-vscode-mcp-workflow",
        destination: "/learn/wenlan-vscode-mcp-workflow",
        permanent: true,
      },
      {
        source: "/learn/origin-vs-mcp-memory-service",
        destination: "/learn/wenlan-vs-mcp-memory-service",
        permanent: true,
      },
      {
        source: "/learn/origin-vs-chatgpt-memory",
        destination: "/learn/wenlan-vs-chatgpt-memory",
        permanent: true,
      },
      {
        source: "/learn/origin-vs-obsidian-ai-memory",
        destination: "/learn/wenlan-vs-obsidian-ai-memory",
        permanent: true,
      },
      {
        source: "/learn/origin-vs-notion-ai",
        destination: "/learn/wenlan-vs-notion-ai",
        permanent: true,
      },
      {
        source: "/learn/origin-vs-mem0",
        destination: "/learn/wenlan-vs-mem0",
        permanent: true,
      },
      {
        source: "/learn/ai-memory-app",
        destination: "/learn/ai-work-memory",
        permanent: true,
      },
      {
        source: "/guides/ai-memory-app",
        destination: "/learn/ai-work-memory",
        permanent: true,
      },
      {
        source: "/guides",
        destination: "/learn",
        permanent: true,
      },
      {
        source: "/guides/:slug",
        destination: "/learn/:slug",
        permanent: true,
      },
      {
        source: "/docs/guides",
        destination: "/learn",
        permanent: true,
      },
      {
        source: "/docs/guides/ai-memory-app",
        destination: "/learn/ai-work-memory",
        permanent: true,
      },
      {
        source: "/docs/guides/:slug",
        destination: "/learn/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
