import type { NextConfig } from "next";

const NOINDEX_FOLLOW = [
  { key: "X-Robots-Tag", value: "noindex, follow" },
];

const NOINDEX_ASSET = [
  { key: "X-Robots-Tag", value: "noindex" },
];

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  turbopack: {
    root: process.cwd(),
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
    ];
  },
  async redirects() {
    return [
      {
        source: "/learn/ai-memory-app",
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
        source: "/docs/guides/:slug",
        destination: "/learn/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
