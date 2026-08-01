# dobroizlo.com.ua

Ukrainian-language marketing site for the _Good and Evil_ (Добро і зло) Bible
comic book, rebuilt with Hugo.

**Status:** Live in production at [dobroizlo.com.ua](https://dobroizlo.com.ua), hosted on Netlify.

[![Netlify Status](https://api.netlify.com/api/v1/badges/619abfcf-f63a-47af-adb9-51e808f43337/deploy-status)](https://app.netlify.com/projects/dobro-i-zlo/deploys)

## Tech Stack

- [Hugo](https://gohugo.io/) 0.162.1 — static site generator
- [Tailwind CSS v4](https://tailwindcss.com/) — utility-first CSS
- [Alpine.js](https://alpinejs.dev/) — lightweight JS for interactivity
- [Netlify](https://www.netlify.com/) — hosting and contact-form handling
- [Cloudinary](https://cloudinary.com/) — image CDN with on-the-fly optimization
- [ComixDistro API](https://app.dobroizlo.com.ua) — backend for book-request submissions
- [Umami](https://umami.is/) — self-hosted, privacy-friendly analytics (production only)
- Multilingual: Ukrainian (default) + English

## Prerequisites

- [Hugo](https://gohugo.io/) 0.162.1 (extended edition)
- [Node.js](https://nodejs.org/) 22

## Build Commands

```bash
# Install dependencies
npm install

# Development server (with drafts)
hugo server -D

# Production build
hugo --gc --minify

# Lint (Markdown + JS formatting)
npm run lint

# Auto-format JS
npm run format
```

## Project Structure

```text
content/          # Markdown content files
layouts/          # Hugo templates
assets/           # CSS, inline SVGs (processed by Hugo Pipes)
static/           # Images, fonts, other static files
docs/prd/         # Product requirements documentation
```

## CI

GitHub Actions runs on every push and PR to `main`:

- **Hugo Build** — verifies the site compiles with `hugo --gc --minify`
- **Markdown Lint** — checks Markdown files with markdownlint-cli2

## Documentation

Detailed specs live in `docs/prd/`. Start with
[00-overview.md](docs/prd/00-overview.md) for project goals and philosophy, and
see [ROADMAP.md](docs/prd/ROADMAP.md) for the build plan.

## License

All rights reserved. Content and design are proprietary to
[Euro Team Outreach, Inc.](https://euroteamoutreach.org/)

This repository is public, but the [Tailwind Plus](https://tailwindcss.com/plus)
reference snippets used during development are **not** included — they are kept
local-only per their license. See [`NOTICE`](NOTICE) for details.
