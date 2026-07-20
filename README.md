# Juanjo Navarro — Ops Workstation

A static, Linux-inspired portfolio for Juan José Navarro Villegas, focused on Data Engineering,
production reliability and open-source systems.

## Stack

- Astro and TypeScript
- Locally hosted Manrope and JetBrains Mono variable fonts
- Hand-authored CSS and inline SVG diagrams
- Interactive terminal with filesystem navigation, command history and tab completion
- Webster, a contextual pixel-art spider guide with persistent mute and minimize controls
- URL-addressable documents inside a responsive tiling-window interface
- Session-aware boot sequence and mobile terminal/document switching
- Playwright browser tests

The site has no backend, analytics, cookies or runtime dependency on the GitHub API.
Motion-heavy details are disabled automatically when the visitor prefers reduced motion.

## Local development

Requirements: Node.js 22 or newer and pnpm 11.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:4321`.

## Validation

```bash
pnpm check
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

The browser suite checks terminal commands, file navigation, URL state, the boot sequence,
responsive layouts, reduced-motion behavior, horizontal overflow and that private CV details are
not shipped.

## Publishing

The production build is fully static:

```bash
PUBLIC_SITE_URL=https://your-domain.example pnpm build
```

Upload the generated `dist/` directory to any static host such as GitHub Pages, Cloudflare Pages,
Netlify or Vercel. Set `PUBLIC_SITE_URL` to the final public origin so canonical and social metadata
use the correct URL.

For a project deployed below a subpath on GitHub Pages, add the matching Astro `base` option in
`astro.config.mjs` before building. A root user site (`username.github.io`) does not need it.

## Content

Portfolio copy is stored in `src/data/portfolio.ts`. The public version intentionally includes the
email address, GitHub and LinkedIn, while excluding the phone number and downloadable CV.
