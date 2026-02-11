# dobroizlo.com.ua — Hugo Rebuild: Project Overview

**Version:** 1.0
**Date:** February 11, 2026
**Author:** Joshua Steele (with Claude AI assistance)

---

## Purpose

Rebuild [dobroizlo.com.ua](https://dobroizlo.com.ua), the Ukrainian-language
landing page for the *Good and Evil* Bible comic book (*Добро і зло*), from
Nuxt.js 2 to Hugo. The site is a compact marketing site with 5 pages, a
contact form, and a book request/enrollment form.

---

## Goals

- **Preserve all existing content** — page text, images, forms, and PDF links
- **Preserve the existing URL structure** for SEO continuity
- **Embrace Hugo idioms** — build in whatever way is natural for Hugo, not as
  a port of the Nuxt architecture
- **Use the same tech stack as OFReport.com** — Hugo, Tailwind CSS v4,
  Alpine.js, Netlify
- **Refresh subtle design elements** — spacing, typography, alignment, and
  whitespace improvements using Tailwind Plus design philosophy
- **Simplify** — reduce JavaScript dependency and overall complexity
- **Enable learning** — same developer-directed approach as OFReport.com

---

## Non-Goals

- Complete visual redesign (the color scheme aligns with the physical book)
- Rebuilding or modifying any graphic assets (book covers, illustrations)
- Adding a CMS or admin interface
- Multilingual support (the site is Ukrainian-only by design)
- Blog, RSS, pagination, or any content management features

---

## Related Projects

This project exists within a constellation of related web properties managed
by Euro Team Outreach:

### ComixDistro (Rails App)

ComixDistro is a Rails 8 application for managing the *Good and Evil*
distributor program in Ukraine. It enables independent distributors to request
books, plan outreach events, and submit accountability reports. The static
site (dobroizlo.com.ua) and the Rails app are intended to share a domain:

| Property | URL |
|----------|-----|
| Hugo site (public-facing) | `dobroizlo.com.ua` |
| ComixDistro (distributor portal) | `app.dobroizlo.com.ua` |

While the ComixDistro app targets large-scale distribution management, the
static site serves individual Ukrainians who want to receive a single free
copy of the book.

### OFReport.com (Hugo Rebuild)

OFReport.com is a missionary family blog, also being rebuilt from Nuxt 2 to
Hugo. While the content and purpose are unrelated to dobroizlo.com.ua, the
technology stack and development patterns are identical. The conventions,
standards, and architecture established during the OFReport.com rebuild
directly inform this project:

- Same Hugo + Tailwind CSS v4 + Alpine.js stack
- Same Netlify hosting and forms approach
- Same modular PRD structure
- Same developer-directed, AI-assisted development workflow
- Same GitHub Issues workflow and Conventional Commits

The dobroizlo.com.ua rebuild is significantly smaller in scope — no blog, no
content migration, no pagination, no RSS — making it a straightforward
application of patterns already established.

---

## Development Approach

### Developer-Directed, AI-Assisted

This project uses Claude Code as a development tool, but the developer
(Joshua) directs all decisions and seeks to understand each step. The
philosophy is **learning-focused pair programming**, not autonomous code
generation.

**Principles:**

- **Explain before building.** Claude Code should explain Hugo concepts, Go
  template syntax, and architectural rationale before generating code. The
  developer should understand *why* something is built a certain way.
- **Incremental progress.** Build one feature or template at a time. Verify
  understanding before moving to the next step.
- **No black boxes.** Every file in the project should be understood by the
  developer. If something is unclear, pause and explain.
- **Developer makes decisions.** When there are multiple valid approaches,
  Claude Code presents options with trade-offs and lets the developer choose.
- **Leverage existing knowledge.** The developer has already built foundational
  Hugo skills through the OFReport.com project. This project can move faster
  where concepts are already understood.

### Tailwind Plus Workflow

The developer has a Tailwind Plus (UI Components) subscription. Licensed
component snippets are used as design references, not copied verbatim into
the codebase.

**Workflow:**

1. A `docs/tailwind_plus/` directory exists in the project root (gitignored)
2. When building a UI element, Claude Code may request a reference snippet
   from Tailwind Plus
3. The developer pastes the relevant example into `docs/tailwind_plus/`
4. Claude Code reads the snippet to understand design patterns, spacing, and
   Tailwind class usage
5. Claude Code builds the actual Hugo template using those patterns as a
   reference — not a direct copy

**Important:** The `docs/tailwind_plus/` directory must be listed in
`.gitignore` since Tailwind Plus components are licensed and must not be
committed to the repository.

---

## PRD Structure

This PRD is split across multiple files for easier navigation:

| File | Focus |
|------|-------|
| `00-overview.md` | Project goals, development approach (this file) |
| [`01-architecture.md`](./01-architecture.md) | Architectural decisions |
| [`02-design.md`](./02-design.md) | Design philosophy and visual identity |
| [`03-site-structure.md`](./03-site-structure.md) | Content organization, URLs, Hugo configuration |
| [`04-templates.md`](./04-templates.md) | Layout and template specifications |
| [`05-deployment.md`](./05-deployment.md) | Source control, Netlify config, deployment |
| [`06-risks-and-future.md`](./06-risks-and-future.md) | Future features, risks, out-of-scope items |
| [`ROADMAP.md`](./ROADMAP.md) | Build phases and progress tracking |
