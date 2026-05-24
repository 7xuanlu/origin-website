# Security Policy

This is the security policy for the **origin-website** repo, which hosts the marketing + docs source for [useorigin.app](https://useorigin.app). The Origin product (daemon, CLI, MCP server) has its own policy in [7xuanlu/origin/SECURITY.md](https://github.com/7xuanlu/origin/blob/main/SECURITY.md).

## Reporting a vulnerability

Use any of these channels. Do not file public issues for vulnerabilities.

- GitHub Security Advisories: [open a private advisory on this repo](https://github.com/7xuanlu/origin-website/security/advisories/new)
- Email: security@useorigin.app
- Machine-discoverable: see [`/.well-known/security.txt`](https://useorigin.app/.well-known/security.txt) (per RFC 9116)

## What's in scope

- The deployed marketing site at useorigin.app (XSS, leaked secrets in the bundle, misconfigured headers, broken auth on any future protected endpoints).
- The Vercel deployment pipeline configuration in this repo (`vercel.json`, `next.config.ts`).
- Build-time scripts in `scripts/`.

## What's out of scope

- The Origin product binaries, daemon, CLI, MCP server (file those at [7xuanlu/origin](https://github.com/7xuanlu/origin/security)).
- Third-party services we link to (GitHub, npm, crates.io, Vercel, YouTube).
- Reports that require physical access, social engineering, or compromise of unrelated accounts.

## Response

Best-effort acknowledgment within 72 hours. Critical issues addressed by hot-fix deploy ahead of standard release cadence.
