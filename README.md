# dobroizlo.com.ua

Ukrainian-language marketing site for the *Good and Evil* (Добро і зло) Bible
comic book, rebuilt with Hugo.

**Live site:** [dobroizlo.com.ua](https://dobroizlo.com.ua)

[![Netlify Status](https://api.netlify.com/api/v1/badges/619abfcf-f63a-47af-adb9-51e808f43337/deploy-status)](https://app.netlify.com/projects/dobro-i-zlo/deploys)

## Tech Stack

- [Hugo](https://gohugo.io/) 0.156.0 — static site generator
- [Tailwind CSS v4](https://tailwindcss.com/) — utility-first CSS
- [Alpine.js](https://alpinejs.dev/) — lightweight JS for interactivity
- [Netlify](https://www.netlify.com/) — hosting and form handling
- Multilingual: Ukrainian (default) + English

## Prerequisites

- [Hugo](https://gohugo.io/) 0.156.0 (extended edition)
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
