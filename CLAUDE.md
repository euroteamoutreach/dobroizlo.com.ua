# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Hugo rebuild of [dobroizlo.com.ua](https://dobroizlo.com.ua), a
Ukrainian-language marketing site for the *Good and Evil* (Добро і зло) Bible
comic book. It's a compact site (plus a 404) with no blog and no CMS.
The site supports Ukrainian (default) and English via Hugo's multilingual mode.

**Tech stack:** Hugo + Tailwind CSS v4 + Alpine.js + Netlify hosting + Cloudinary (images) + ComixDistro API (book requests)

**Sister project:** [OFReport.com](https://ofreport.com) uses the identical
stack and conventions. Patterns established there inform this project.

**Reference source:** The original Nuxt 2 site is available at
`../dobroizlo.com.ua-nuxt/` for content and design reference. Use it to verify
text, image usage, and layout behavior — but build in whatever way is natural
for Hugo, not as a mechanical port of the Nuxt architecture.

## Development Approach

This project follows **developer-directed, AI-assisted** development. The
developer (Joshua) directs all decisions and seeks to understand each step.

- **Explain before building** — explain Hugo concepts and rationale before
  generating code
- **Incremental progress** — one feature or template at a time; verify
  understanding before moving on
- **No black boxes** — every file in the project should be understood by
  the developer
- **Present options** — when multiple valid approaches exist, present
  trade-offs and let the developer choose
- **Leverage existing knowledge** — the developer has already built
  foundational Hugo skills through the OFReport.com project; this project
  can move faster where concepts are already understood

See `docs/prd/00-overview.md` for the full development philosophy.

### Tailwind Plus Workflow

The developer has a Tailwind Plus subscription. Licensed snippets are committed
to `docs/tailwind_plus/` as design references. A root `NOTICE` file documents
the license restriction — the repo must not be made public without purging these
files from Git history. Read snippets for design patterns and Tailwind class
usage, then build Hugo templates using those patterns — never copy verbatim.

## Development Workflow

All work flows through GitHub Issues. The full pipeline is:

1. **Plan**: When discussing new features or multi-step work, the output of
   planning should be one or more GitHub issues. Each issue needs a clear
   title, description, and acceptance criteria. Create the issues before
   starting implementation.
2. **Implement**: Use `/resolve-issue <number>` to implement each issue on
   a feature branch with a structured workflow.
3. **Pull Request**: Use `/create-pr --issue <number>` to open a PR linking
   to the resolved issue.
4. **Merge**: PRs should pass build verification (`hugo --gc --minify`)
   before merging.

Additional conventions:

- Commit messages use Conventional Commits format but do NOT reference issue
  numbers. Issue linking happens in the PR description via "Closes #N".
- Small, unrelated housekeeping changes (typos, README updates) can be
  committed directly to main without an issue or PR.

## Label Taxonomy

This project uses a unified labeling system across commits, branches, and
GitHub issues. The same five **work type** terms are used everywhere.

### Work Types

| Type   | Meaning                                    | Branch Prefix |
|--------|--------------------------------------------|---------------|
| `feat` | New user-facing functionality              | `feat/`       |
| `fix`  | Bug or regression                          | `fix/`        |
| `chore`| Maintenance, cleanup, internal improvement | `chore/`      |
| `docs` | Documentation changes                      | `docs/`       |
| `test` | Test additions or updates                  | `test/`       |

### Conventional Commits

Commit messages use the full Conventional Commits spec. Granular types roll
up into the five work types above:

- `feat`, `fix`, `docs`, `test` → map directly
- `chore`, `refactor`, `style`, `perf`, `ci`, `build` → all roll up to `chore`

### Branch Naming

Format: `<type>/gh-<issue#>-<short-description>`

Examples: `feat/gh-12-homepage-template`, `fix/gh-25-form-validation`,
`chore/gh-8-tailwind-config`

## Build Commands

```bash
# Install dependencies
npm install

# Development server (live reload, includes drafts)
hugo server -D

# Production build
hugo --gc --minify

# Full Netlify build (as run in CI)
npm install && hugo --gc --minify
```

Hugo version is pinned in `netlify.toml`. Node 22 is the target runtime.

## Architecture

### Layout-Driven Design

Every page has a dedicated template — there is no shared `single.html` doing
double duty. Content files use `type: "page"` + `layout: "<name>"` in
frontmatter to select their template (Hugo's `layout` field is a template
*name*, not a path):

| Page | Content File | Layout |
|------|-------------|--------|
| Homepage | `content/_index.md` | `page/home.html` |
| About | `content/pro-nas.md` | `page/about.html` |
| Contact | `content/kontakty/_index.md` | `page/contact.html` |
| Book Request | `content/zamovyty-knyzhku/_index.md` | `page/book-request.html` |
| Distributor Network | `content/dystrybutoram/_index.md` | `page/distributor.html` |
| 404 | N/A | `404.html` |

### CSS Pipeline

Tailwind CSS v4 is processed via Hugo's built-in `css.TailwindCSS` function:

- Entry point: `assets/css/main.css`
- Processing partial: `layouts/partials/css.html`
- JIT scanning via `hugo_stats.json` (auto-generated, gitignored)
- Deferred rendering in `<head>` using `templates.Defer`

### JavaScript

Alpine.js v3 loaded from jsDelivr CDN. Per-page scripts are bundled via Hugo's
`js.Build` pipeline with fingerprinting and SRI. Used for:

- Mobile hamburger menu toggle
- Form client-side validation and AJAX submission
- Scroll-aware header behavior (homepage)

### Forms

Two forms, each with Alpine.js client-side validation and inline success messages:

- **Contact form** (3 fields) → Netlify Forms via AJAX `fetch()` (`assets/js/contact.js`)
- **Book request form** (13 fields) → ComixDistro API via `fetch()` (`assets/js/book-request.js`). API endpoint is configurable via `bookRequestApiUrl` in `hugo.toml`.

Client-side validation uses Alpine.js paired with HTML5 `required` attributes
as a baseline. The book request form requires at least one of email or phone.

### Out-of-Stock Toggle

The book request form has an enabled/disabled state controlled by a Hugo param:

```toml
[params]
  bookFormEnabled = true  # Set to false when out of stock
```

When `false`, the template renders an out-of-stock notice instead of the form.
The form itself is not rendered at all (not just visually hidden or disabled).

### Images

- `static/img/` — structural images, backgrounds, OG image (direct URL references)
- `assets/img/` — SVGs that need inlining via Hugo pipes
- Cloudinary — photographic images served via CDN with automatic format/size optimization (`layouts/partials/cloudinary-img.html`, cloud name in `hugo.toml`)
- Icons: Heroicons as inline SVGs (replacing Font Awesome Pro)

## URL Preservation

All URLs must match the existing Nuxt site for SEO continuity:

- `/pro-nas/`
- `/kontakty/`
- `/zamovyty-knyzhku/`
- `/dystrybutoram/` (new page, not present on the Nuxt site)

## Key Configuration

- Language: Ukrainian (`languageCode = "uk"`) — all UI text is in Ukrainian
- No taxonomies, no pagination, no RSS
- Fonts: Google Fonts (Roboto Condensed + Source Sans Pro, `cyrillic-ext`)
- External PDF stays on CloudFront: `d2ppgd6w5akw3v.cloudfront.net/pdf/`
- Analytics: deferred (placeholder partial at `layouts/partials/analytics.html`)

## Key Files

| File | Purpose |
| --- | --- |
| `docs/prd/README.md` | PRD index — start here for any feature question |
| `docs/prd/ROADMAP.md` | Task list with checkboxes, one PR per item |
| `docs/prd/CHANGELOG.md` | PRD deviation log — update before merging any deviation |
| `~/.claude/docs/label-taxonomy.md` | Work type labels, branch naming, board configuration |

**Always consult the relevant PRD file before implementing a feature.**
