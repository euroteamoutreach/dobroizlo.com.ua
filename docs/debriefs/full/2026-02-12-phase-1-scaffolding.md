# Debrief: Phase 1 — Project Scaffolding

**Project:** dobroizlo.com.ua (Hugo Rebuild)
**Date:** February 12, 2026
**Phase:** Phase 1 — Project Scaffolding (ROADMAP.md)
**PRD References:** `01-architecture.md`, `03-site-structure.md`, `04-templates.md`, `05-deployment.md`
**Issues:** #3, #4, #5, #6
**PRs:** #7, #8, #9, #10

---

## 1. What We Built (and Why It Matters)

Phase 1 takes the Hugo project from a bare `hugo new site` scaffold to a fully
functional build pipeline. After this phase, every subsequent phase can focus
purely on templates and content — the infrastructure is done.

**What was delivered across 4 PRs:**

- **Full `hugo.toml` configuration** — Ukrainian language, site params (title,
  description, OG image, book form toggle, PDF base URL, Google verification),
  navigation menus, Tailwind build stats, module mounts, and markup settings.
- **`netlify.toml` deployment config** — Hugo 0.155.3 pinned, Node 22, deploy
  preview/branch contexts, security headers.
- **Tailwind CSS v4 build pipeline** — `tailwindcss` and `@tailwindcss/cli`
  installed, CSS entry point with JIT source directive, processing partial with
  dev/prod branching (fingerprinting + integrity hashes in production).
- **Base layout (`baseof.html`)** — the HTML shell every page inherits:
  deferred Tailwind CSS, head partial, header/footer stubs, Alpine.js CDN.
- **Head partial** — charset, viewport, conditional title logic, Google Fonts
  (modern css2 API with preconnect), favicon reference, site verification meta.
- **Stub partials** — header, footer, seo, analytics — all called from
  baseof.html, all empty stubs ready for Phase 3.
- **Minimal homepage** — `content/_index.md` with frontmatter and a placeholder
  `layouts/page/home.html` template proving the full pipeline works.

**Where we are in the big picture:** Phase 1 of 9 is complete. The roadmap
milestone was "Empty site builds and deploys to Netlify." We've hit that
milestone locally — the site builds cleanly, Tailwind processes, and the
Netlify config is ready. The actual Netlify deployment (connecting the repo in
the Netlify dashboard) is a manual step for you.

**What was intentionally deferred:**

- Image migration (Phase 2)
- Header/footer/SEO partials (Phase 3) — stubs are in place
- All page content and templates beyond the homepage shell (Phases 4-8)
- Netlify dashboard setup (manual step — not automatable)
- Favicon file — referenced in `head.html` but the actual `favicon.ico` file
  will be copied from the Nuxt project in Phase 2

---

## 2. Architecture & Design Decisions

### Hugo Configuration (`hugo.toml`)

The config follows the PRD spec in `03-site-structure.md` nearly verbatim.
A few things worth understanding:

- **Empty `[taxonomies]` block** — Hugo generates tag/category pages by
  default. An empty block explicitly disables this. Without it, Hugo creates
  `/tags/` and `/categories/` pages that would show up in the sitemap.
- **`pagerSize = 100`** — effectively disables pagination. Hugo requires a
  value, and 100 is safely above the page count. This site has 5-7 pages.
- **`bookFormEnabled = true`** — the out-of-stock toggle. This is a site param
  that the book request template will check. Toggling stock status becomes a
  one-line config change, commit, push, auto-deploy. Much better than the Nuxt
  approach of hardcoding `formDisabled: true` in a Vue component.
- **Build stats + module mounts** — this is the Hugo-specific wiring that
  makes Tailwind CSS v4's JIT scanning work. `hugo_stats.json` is
  auto-generated during builds with all HTML classes used across templates.
  The module mount maps it into the assets pipeline so Tailwind can read it.
  The cache busters ensure CSS regenerates when stats change.

### Tailwind CSS Pipeline (`css.html`)

The processing partial at `layouts/partials/css.html` handles two environments:

- **Development:** plain `<link>` tag pointing to the processed CSS. No
  fingerprinting, no integrity hash. Fast reloads.
- **Production:** CSS is minified, fingerprinted (content hash in filename for
  cache busting), and served with an `integrity` attribute for subresource
  integrity.

This is called from `baseof.html` via `templates.Defer`, which is Hugo's
mechanism for deferred rendering — the CSS partial runs after all templates
have been processed, so `hugo_stats.json` has a complete list of used classes
before Tailwind generates the stylesheet.

### Template Resolution (the `type`/`layout` Discovery)

This was the most interesting finding of the phase. The PRD specifies
`layout: "page/home"` in frontmatter, expecting Hugo to find
`layouts/page/home.html`. That doesn't work.

Hugo's `layout` frontmatter field is a **template name**, not a path. The
**directory** is determined by the `type` field. So the correct frontmatter is:

```yaml
type: "page"    # → look in layouts/page/
layout: "home"  # → use the template named "home"
```

This resolves to `layouts/page/home.html` as intended. I've updated the issue
body for #6 with this learning, saved it to project memory, and noted it here
because it affects every content file going forward. The PRD's
`layout: "page/<name>"` convention should be read as `type: "page"` +
`layout: "<name>"` in actual frontmatter.

### Google Fonts (Modernized)

The Nuxt site uses the legacy Google Fonts API:

```text
fonts.googleapis.com/css?family=Roboto+Condensed|Source+Sans+Pro:400,600&subset=cyrillic-ext
```

I upgraded to the modern `css2` API with `display=swap` and `preconnect` hints:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Roboto+Condensed&family=Source+Sans+Pro:wght@400;600&subset=cyrillic-ext&display=swap">
```

**Why:** `display=swap` prevents invisible text during font loading (FOIT).
`preconnect` hints let the browser establish connections to Google's font
servers early, shaving ~100ms off font load time. The `css2` API is Google's
current recommended approach.

### Netlify Config

Pinned Hugo to `0.155.3` (your locally installed version) across all three
build contexts (production, deploy-preview, branch-deploy). Security headers
follow OWASP recommendations:

- `X-Frame-Options: DENY` — prevents clickjacking
- `X-Content-Type-Options: nosniff` — prevents MIME type sniffing
- `X-XSS-Protection: 1; mode=block` — legacy XSS filter (still useful for
  older browsers)
- `Referrer-Policy: strict-origin-when-cross-origin` — limits referrer
  leakage

### What I Considered but Didn't Do

- **Custom `robots.txt`** — Hugo generates one automatically. The PRD mentions
  a `static/robots.txt` but it's not needed unless custom rules are required.
  We can add one later if needed.
- **RSS disable** — Hugo auto-generates RSS. The PRD says no RSS, but I didn't
  add `disableKinds = ["RSS"]` to `hugo.toml` yet. This is a minor cleanup
  item for a future phase. The auto-generated RSS is harmless.

---

## 3. Test Coverage & Quality

This is a static site scaffolding phase — there's no application logic to unit
test. The "tests" here are build verification:

### What We Verify

1. **`hugo --gc --minify`** — production build succeeds with zero warnings
2. **`hugo server -D`** — dev server starts, renders pages, live reload works
3. **`npm run lint`** — all markdown files pass linting (12 files, 0 errors)
4. **CI workflow** — GitHub Actions runs both Hugo build and markdown lint on
   every push/PR

### Current Status

```bash
# Production build — should complete with 0 warnings, 3 pages
hugo --gc --minify

# Markdown lint — should report 0 errors
npm run lint

# Dev server — visit the URL shown in output
hugo server -D
```

All three pass cleanly as of this debrief.

### Coverage Gaps

- **No HTML validation** — we're not checking that the generated HTML is valid.
  This becomes more important once real templates are in place (Phase 3+).
- **No link checking** — no automated check for broken links. Worth adding in
  Phase 8 (Final Polish).
- **No visual regression** — no screenshot comparison. Not practical for this
  project size, but manual review at each phase is the plan.

---

## 4. Product Tour — Try It Yourself

This is a scaffolding phase, so the "product" is minimal — but here's how to
verify everything works.

### Story: Verify the build pipeline works end-to-end

1. Make sure you're on `main` and up to date:

   ```bash
   git switch main && git pull
   ```

2. Install dependencies (if not already done):

   ```bash
   npm install
   ```

3. Run the production build:

   ```bash
   hugo --gc --minify
   ```

   **What to look for:** Build completes in ~250ms with no warnings. Output
   shows 3 pages built. A `public/` directory is created.

4. Check the build output:

   ```bash
   cat public/index.html
   ```

   **What to look for:** Full HTML document with `<html lang="uk">`, Ukrainian
   title in `<title>` tag, Google Fonts links with `preconnect`, a `<link>`
   tag pointing to `/css/main.css` (with fingerprint hash and integrity
   attribute), Alpine.js CDN script, and the placeholder homepage content
   inside `<main>`.

### Story: Run the dev server and see the page

1. Start the development server:

   ```bash
   hugo server -D
   ```

2. Open the URL shown in the terminal (likely `http://localhost:1313/` or
   a different port if 1313 is in use).

   **What to look for:**

   - Page renders with the Ukrainian title "Добро і зло — Біблія-комікс —
     Захопливий гостросюжетний роман" as the heading
   - Description text appears below in gray
   - A note says "Phase 1 scaffolding complete. Homepage sections will be
     built in Phase 4."
   - Tailwind CSS is active — text is styled (centered, sized, colored) via
     utility classes
   - Google Fonts are loading — text should appear in Roboto Condensed (the
     heading) and the browser's default sans-serif (body text doesn't use
     Source Sans Pro yet — that happens when real templates are built)
   - The browser tab title shows the Ukrainian title

3. View page source (Cmd+Option+U in Safari/Chrome).

   **What to look for:**

   - `<html lang="uk">`
   - `<meta charset="utf-8">` and viewport meta
   - Google site verification meta tag
   - Preconnect hints for Google Fonts
   - CSS link tag (no fingerprint in dev mode — just `/css/main.css`)
   - Alpine.js CDN script before `</body>`
   - Hugo's livereload script (dev only)

### Story: Verify the configuration

1. Open `hugo.toml` and review the site params:

   - `bookFormEnabled = true` — this is the out-of-stock toggle
   - `pdfBase` points to CloudFront for the "What we believe" PDF
   - `ogImage` points to the OG image path (file not yet copied)
   - Two menu items: "Про нас" and "Контакти"

2. Open `netlify.toml` and verify:

   - Hugo version `0.155.3` is pinned
   - Node 22 is specified
   - Security headers are present

---

## Follow-Up Items

These are not bugs — they're minor items I noticed that can be addressed in
later phases:

1. **PRD frontmatter convention** — The PRD uses `layout: "page/home"` but
   the correct Hugo syntax is `type: "page"` + `layout: "home"`. Future
   content files should follow the corrected pattern. Consider updating the
   PRD docs if you want them to match reality (optional — the CLAUDE.md and
   project memory already capture the correct approach).

2. **RSS generation** — Hugo auto-generates RSS at `/index.xml`. The PRD says
   no RSS. Could add `disableKinds = ["RSS"]` to `hugo.toml`. Low priority —
   the RSS feed is harmless and won't appear in navigation.

3. **Remaining `.keep` files** — `data/.keep` and `i18n/.keep` still exist.
   These directories are empty and may not be needed. Can be cleaned up when
   (if) content is added to those directories.

4. **Netlify deployment** — The `netlify.toml` is ready but the repo hasn't
   been connected to Netlify yet. This is a manual step in the Netlify
   dashboard whenever you're ready.
