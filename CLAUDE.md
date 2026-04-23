# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Dev server with Turbopack
pnpm build        # Production build
pnpm lint         # ESLint via next lint
```

No test framework is configured.

## Architecture

Single-page marketing site for [Origin](https://useorigin.app) built with **Next.js 16** (App Router) + **React 19** + **Tailwind CSS 4**. Deployed on Vercel.

### Layout

- `src/app/page.tsx` — the entire landing page (Hero → Problem → Solution → Benchmarks → Features → FAQ → CTA)
- `src/app/layout.tsx` — root layout: Google Fonts (Fraunces serif, Instrument Sans, JetBrains Mono), theme flash-prevention script, JSON-LD schema, Umami analytics
- `src/components/` — extracted sections (FAQ, Problem/Solution)

### Theming

Dark/light toggle via `data-theme` attribute on `<html>`, not Tailwind's `dark:` class. All theme colors are CSS custom variables prefixed `--o-` defined in `globals.css` with `:root` (dark default) and `[data-theme="light"]` overrides. The `ThemeProvider` context (`theme-provider.tsx`) persists choice to `localStorage("origin-theme")`.

A blocking `<script>` in `layout.tsx` `<head>` reads `localStorage` before paint to prevent flash.

### Design tokens

Accent palette: `--color-origin-warm` (#d4884a), `--color-origin-indigo` (#7b7be8), `--color-origin-sage` (#8ab892), `--color-origin-amber` (#e0a850). These are static across themes; semantic tokens (`--o-bg`, `--o-text`, `--o-card-bg`, etc.) change per theme.

### Animations

Scroll-triggered reveals use `IntersectionObserver` hooks in `use-scroll-reveal.tsx` (`useScrollReveal`, `useScrollProgress`). CSS keyframes for float, glow-pulse, fade-up are in `globals.css`.

### Server Actions

`src/app/actions.ts` — waitlist signup via **Resend** email API. Needs `RESEND_API_KEY` and `RESEND_AUDIENCE_ID` env vars (see `.env.example`).

### Style rules

- No left border accent stripes on cards — use other visual treatments instead
- Path alias: `@/*` maps to `./src/*`
