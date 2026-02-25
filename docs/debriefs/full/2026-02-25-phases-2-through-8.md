# Debrief: Phases 2–8 — Full Site Build

- **Project:** dobroizlo.com.ua (Hugo Rebuild)
- **Date:** February 25, 2026
- **Scope:** Phases 2–8 (Image Migration, Navigation & Footer, Homepage, About, Contact Form, Book Request Form, 404 & Final Polish)
- **PRs:** #14, #18, #19, #20, #26, #27, #28, #29, #30, #32, #34, #36, #42, #43, #44, #45, #46
- **Issues:** #11–13, #15–17, #21–25, #31, #33, #35, #37–41
- **PRD References:** `01-architecture.md`, `02-design.md`, `03-site-structure.md`, `04-templates.md`, `05-deployment.md`, `ROADMAP.md`
- **Previous Debrief:** `2026-02-24-phase-1-completion-and-prd-alignment.md`

---

## 1. What We Built (and Why It Matters)

This debrief covers the entire content build of dobroizlo.com.ua — from an empty Hugo scaffold to a complete, production-ready site. In a single day (February 24), we shipped 17 PRs covering:

- **Phase 2:** Migrated all images and static assets from the Nuxt source
- **Phase 3:** Built the navigation header (with scroll-aware transparency), footer, and SEO meta partial
- **Phase 4:** Built the 5-section homepage (Hero, Big Picture, Heroes, Battle, How to Get)
- **Phase 5:** Built the About page
- **Phase 6:** Built the Contact form with Alpine.js validation and Netlify Forms
- **Phase 7:** Built the Book Request form (12+ fields, oblast dropdown, out-of-stock toggle)
- **Phase 8:** Built the 404 page, verified all links, verified SEO metadata, performed responsive review, and completed a Lighthouse audit

**Where we are now:** Phase 8 is complete. Every checkbox in the ROADMAP is checked through Phase 8. Only Phase 9 (Launch) and Post-Launch items remain. The site is functionally complete and ready for your final review before DNS cutover.

**Scope decisions:**

- All homepage text is hardcoded in templates (as recommended in `04-templates.md` §"Content Source") rather than pulled from frontmatter or data files. This is the right call for a single-language landing page where content rarely changes.
- Analytics remains a placeholder partial — deferred to post-launch per the PRD.
- The ComixDistro distributor portal link and API integration are documented as post-launch items per `06-risks-and-future.md`.

---

## 2. Architecture & Design Decisions

### Layout-Driven Template Architecture

Every page gets its own dedicated template under `layouts/page/`. There's no shared `single.html` doing double duty. Content files use `type: "page"` + `layout: "<name>"` in frontmatter to select their template.

This is architecturally intentional: with only 7 templates total (home, about, contact, contact-thanks, book-request, book-request-thanks, 404), the overhead of separate files is minimal and the clarity is enormous. You can open any template and see exactly what that page renders. No conditional branching, no "is this the homepage?" checks scattered through shared templates.

### Header: Scroll-Aware Transparency via Alpine.js

`layouts/partials/header.html` — The header uses a single Alpine.js component with two pieces of state: `scrolled` and `mobileMenuOpen`.

The key design decision: on non-homepage pages, `scrolled` starts as `true` (the header is always opaque). On the homepage, it starts `false` and the `@scroll.window.passive` listener toggles it at 50px. This avoids a flash of transparent header on page load for inner pages.

Originally the scroll listener used a throttle pattern, but during the Phase 8 responsive review (PR #45), we replaced it with a simple passive scroll listener. The passive flag is important — it tells the browser this handler won't call `preventDefault()`, so it can optimize scroll performance. For a simple boolean check like `window.scrollY > 50`, throttling adds complexity without meaningful benefit.

The mobile menu uses Alpine.js `x-show` with CSS transitions (`translate-x-full` → `translate-x-0`) for a smooth slide-in from the right. A semi-transparent backdrop overlays the page and clicking it closes the menu.

### Forms: Alpine.js Validation + Netlify Forms

Both forms (`layouts/page/contact.html` and `layouts/page/book-request.html`) use the same pattern:

1. **Netlify Forms** for server-side handling: `data-netlify="true"`, honeypot spam prevention via `netlify-honeypot="bot-field"`, hidden `form-name` and `subject` fields
2. **Alpine.js** for client-side validation: an `x-data` object tracks each field's value and a `submitted` flag. Computed getters (e.g., `get lastNameError()`) derive error state. The `validate()` method sets `submitted = true` and calls `e.preventDefault()` only if errors exist.
3. **HTML5 baseline**: `type="email"` for email fields, `maxlength` on all inputs

Why this approach over alternatives:

- **Not using a validation library** (like Vee-Validate or Zod): Alpine.js inline validation is perfectly sufficient for 3–12 fields. Adding a library would mean a build step for JavaScript, which this project doesn't have and doesn't need.
- **Not doing server-only validation**: Netlify Forms provides no custom server-side validation — it accepts whatever is submitted. Client-side validation is the only validation layer we control.
- **Validation triggers on submit, not on blur**: The `submitted` flag pattern means fields don't show errors until the user attempts to submit. This is less aggressive than on-blur validation and matches the original Nuxt site's behavior (which used Vuelidate with a similar pattern).

The book request form's `x-data` object is the largest piece of Alpine.js in the project (~25 lines). It tracks 8 required fields and computes error state for each. The `hasErrors` computed getter aggregates all individual errors, and a global error message ("Будь ласка, виправте виділені поля.") appears next to the submit button when validation fails.

### Out-of-Stock Toggle

`hugo.toml` has a `bookFormEnabled` param. In `book-request.html`, the form is wrapped in `{{ if .Site.Params.bookFormEnabled }}`. When `false`, the form HTML is simply not rendered — it's not hidden with CSS or disabled with JavaScript. The out-of-stock notice renders unconditionally above the heading, but the visual flow diagram and explanatory text still appear to give context about the program.

This was a deliberate choice: toggling a Hugo param and redeploying is simpler and more reliable than a JavaScript-based toggle, and it means the form's HTML/JS isn't even shipped to the client when stock is out.

### SEO Partial

`layouts/partials/seo.html` handles meta description, canonical URL, robots, Open Graph, and Twitter Card tags. Key decisions:

- **Robots meta**: Uses `noindex,nofollow` when `hugo.IsServer` is true (dev mode) or when the page's frontmatter sets `robots`. Thank-you pages set `robots: "noindex,nofollow"` in frontmatter.
- **OG image**: All pages share the same OG image (`/img/dobro-i-zlo-fb-og-1200w.jpg`). Per the PRD, the site has no per-page images that would make better OG images.
- **robots.txt**: Generated from a Hugo template (`layouts/robots.txt`) with `enableRobotsTXT = true` in config. References the sitemap.

### CSS Pipeline

`layouts/partials/css.html` uses Hugo's built-in `css.TailwindCSS` pipe. The setup:

- `assets/css/main.css` imports Tailwind v4 and declares `@source` from `hugo_stats.json`
- Hugo auto-generates `hugo_stats.json` with all CSS classes found in templates (configured via `build.buildStats` in `hugo.toml`)
- In production: minification + fingerprinting + SRI integrity hashes
- In development: none of the above, for fast rebuilds

This means zero JavaScript build tools for CSS. No PostCSS config, no Vite, no webpack. Hugo handles everything natively.

### Typography

Two Google Fonts loaded via `<link>` in `head.html`:

- **Roboto Condensed** (`--font-display` / `font-display`): Used for all headings. Originally rendered with `font-bold`, but during the responsive review (PR #45) we switched display headings to `font-normal` because Roboto Condensed's condensed letterforms already provide visual weight — bold made them look heavy and cramped.
- **Source Sans Pro** (`--font-body` / `font-body`): Used for body text.

### Image Strategy

All images live in the repo — no external hosting, no CDN (except the existing CloudFront PDF link which is preserved). Two directories:

- `static/img/` for photos, PNGs, backgrounds (served at `/img/`)
- `assets/img/` for SVGs that need Hugo pipe inlining (the footer logo)

During the Lighthouse audit (PR #46), we added explicit `width` and `height` attributes to all `<img>` tags and `loading="lazy"` to below-the-fold images. This eliminates CLS (Cumulative Layout Shift) and defers offscreen image loading.

### Color Contrast Iteration

The Lighthouse audit surfaced WCAG AA contrast failures. This led to a focused iteration:

1. Darkened hero CTA button from `bg-sky-500` to `bg-sky-700` for contrast
2. Improved color contrast on all interactive elements
3. Then reverted buttons and links back to `sky-600` after realizing `sky-700` looked too dark against the site's overall palette
4. Softened the header background to `bg-sky-600` (from `sky-500`)

The final palette balances accessibility compliance with the site's bright, inviting visual tone. The sky-600 shade passes WCAG AA for white text.

---

## 3. Test Coverage & Quality

This is a static Hugo site with no application logic, no database, and no server-side code. The testing strategy is pragmatic:

### What we test and how

- **Build verification**: `hugo --gc --minify` must complete with 0 warnings. This catches template syntax errors, missing partials, broken references.
- **Link verification** (PR #44): All internal links and external links were manually verified. Internal links tested via the dev server; external links (euroteamoutreach.org, CloudFront PDF, jsDelivr CDN) verified as reachable.
- **SEO verification** (PR #43): Confirmed `sitemap.xml` excludes thank-you pages, `robots.txt` is generated correctly, OG tags render on all pages.
- **Responsive review** (PR #45): All pages tested at mobile, tablet, and desktop breakpoints in Chrome, Firefox, and Safari.
- **Lighthouse audit** (PR #46): Performance, accessibility, SEO, and best practices audited. Color contrast issues fixed. Image dimensions and lazy loading added.
- **Form testing**: Both forms tested on Netlify preview deploys. Submissions received, thank-you redirects work, email notifications configured.

### Current build status

```text
Build:     hugo --gc --minify ✓ (12 pages, 0 warnings)
Server:    boots OK on localhost:1313
Netlify:   deploy succeeds at https://dobro-i-zlo.netlify.app/
```

### What we didn't test (and why)

- **No automated tests**: There's no test suite. For a 7-template static site with no custom JavaScript modules, the cost of setting up a test framework (Playwright, Cypress, etc.) exceeds the value. The build itself is the test — if Hugo can render all 12 pages without errors, the templates are valid.
- **No automated accessibility tests**: Lighthouse was run manually. For a site this size, automated a11y CI (pa11y, axe) would be nice-to-have but isn't worth the setup.
- **No form validation edge cases**: Alpine.js validation was tested manually. The validation is simple enough (required checks + one email regex) that automated testing would primarily be testing Alpine.js itself.

### Verify it yourself

```bash
# Production build (should produce 12 pages, 0 warnings)
hugo --gc --minify

# Dev server with drafts
hugo server -D
```

---

## 4. Product Tour — Try It Yourself

Start the dev server:

```bash
hugo server -D
```

### Story: First-time visitor explores the site

1. Visit `http://localhost:1313/`
2. You're on the **homepage**. The header is transparent — you can see the comic-spread background through it. Scroll down slowly and watch the header become opaque blue at ~50px.
3. The **Hero section** shows the book cover (desktop: left side; mobile: centered), the SVG title, and a "Отримати книжку" CTA button.
4. Click "Отримати книжку" — the page smooth-scrolls to the **How to Get** section at the bottom. Notice the scroll offset accounts for the fixed header.
5. Scroll back up through **Big Picture**, **Heroes** (note the beige background image), and **Battle** (dark cinematic background). Each section uses a responsive layout — resize your browser window to see desktop (side-by-side) vs. mobile (stacked).
6. In the **How to Get** section, click "Замовити примірник" — this takes you to the book request form.

### Story: Visitor navigates the site

1. From any page, click "Про нас" in the header → takes you to `http://localhost:1313/pro-nas/`
2. The **About page** shows the ETO description, a linked image of the ETO website, and a "У що ми віримо" PDF download button.
3. Click "У що ми віримо" — this opens the CloudFront PDF in a new tab.
4. Click "Контакти" in the header → takes you to `http://localhost:1313/kontakty/`
5. On **mobile width** (< 1024px): click the hamburger menu. The slide-out panel appears from the right with a backdrop. Notice "Головна" with a home icon appears in the mobile menu but not in the desktop nav. Tap the X or the backdrop to close.

### Story: Visitor submits the contact form

1. Visit `http://localhost:1313/kontakty/`
2. Click "Надіслати" without filling anything — three inline error messages appear in red below each field.
3. Type a name, enter an invalid email like "bad", and leave message empty.
4. Click "Надіслати" — the email field now shows "Вкажіть дійсну електронну скриньку." (format error) instead of the "required" error. The message field still shows its required error.
5. Fill in all fields correctly. On the dev server, the form will POST but Netlify Forms won't process it locally. To test the full flow, use the Netlify preview deploy.

### Story: Visitor requests a book

1. Visit `http://localhost:1313/zamovyty-knyzhku/`
2. Note the **flow diagram** at the top: three steps with directional arrows (vertical on mobile, horizontal on desktop).
3. Scroll to the form. Click "Надіслати" without filling anything — errors appear on all 8 required fields. A summary error appears next to the submit button.
4. Fill in Last Name, First Name, a valid email, Address, City, select an Oblast from the dropdown (all 24 Ukrainian oblasts are listed), and enter a Postal Code.
5. Note the **study format radio buttons** — "Online" is pre-selected. Switch to "Paper lessons" and back.
6. Check the terms checkbox (the long consent text about Bible First enrollment).
7. Click "Надіслати" — form submits (won't complete locally, but validation passes).

### Story: Test the out-of-stock state

1. Open `hugo.toml` and change `bookFormEnabled = true` to `bookFormEnabled = false`
2. The dev server live-reloads. Visit `http://localhost:1313/zamovyty-knyzhku/`
3. You see the **out-of-stock notice** ("УВАГА!") at the top explaining that books are unavailable.
4. The flow diagram and explanatory text are still visible, but the form itself is completely gone — not hidden, not disabled, just not rendered.
5. The contact link in the notice works: "зв'яжіться з нами" links to `/kontakty/`.
6. Change `bookFormEnabled` back to `true` when done.

### Story: Hit a 404

1. Visit `http://localhost:1313/this-page-does-not-exist/`
2. You see the **404 page** with an inline SVG graphic, "Сторінку не знайдено." heading, and a "На головну" button linking back to the homepage.
3. Resize the browser — the SVG scales responsively.

### Story: Verify SEO metadata

1. View source on the homepage. In `<head>`, confirm:
   - `<meta name="description" ...>` is set
   - `<link rel="canonical" href="https://dobroizlo.com.ua/">` is present
   - Open Graph tags: `og:title`, `og:description`, `og:image`, `og:url`, `og:locale` (uk_UA)
   - Twitter card tags with `@eto_ukraine`
2. Visit `http://localhost:1313/sitemap.xml` — confirm thank-you pages (`/kontakty/diakuiemo/`, `/zamovyty-knyzhku/diakuiemo/`) are NOT listed.
3. View source on a thank-you page (e.g., `/kontakty/diakuiemo/`) — confirm `<meta name="robots" content="noindex,nofollow">`.

---

## Follow-Up Items

1. **Phase 9 (Launch)**: The site is ready for your final review. When you're satisfied, the launch checklist in `ROADMAP.md` covers DNS, SSL, production form testing, and OG image verification on social platforms.
2. **Post-launch items from ROADMAP**: ComixDistro distributor portal link, analytics implementation, potential font refresh, and the eventual Netlify Forms → ComixDistro API switchover.
3. **Previous debrief follow-ups** (from Feb 24): RSS disable, `.keep` cleanup, and PRD frontmatter convention — all non-blocking and still open.
4. **Form email notifications**: Configured in the Netlify dashboard to send to `nathan@euroteamoutreach.org` and `tetiana@euroteamoutreach.org`. These should be verified again on the production domain after DNS cutover.
