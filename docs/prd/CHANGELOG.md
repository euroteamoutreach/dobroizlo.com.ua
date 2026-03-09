# PRD Changelog

This file tracks material deviations from the PRD discovered during implementation. It is the record of the "never silently deviate" rule.

## Format

Each entry records one deviation or decision:

```text
### YYYY-MM-DD — [file changed]

**What changed:** One-sentence description of the change.

**Why:** The rationale — what was wrong, what was discovered, or what prompted the pivot.

**Category:** Correction | Discovery | Pivot
```

**Categories:**

- **Correction** — The PRD was wrong or inconsistent.
- **Discovery** — Implementation revealed something the PRD didn't anticipate.
- **Pivot** — A deliberate decision to change direction.

## Guidelines

- **Newest entries first** — add new entries at the top of the Entries section.
- Log when the PR is created, not after it's merged.
- The "why" is required — a change without rationale is not useful.
- Skip typo fixes and formatting corrections.
- At natural breakpoints (end of a phase, or 10+ accumulated entries), fold changes back into the PRD files themselves during a sync session.

---

## Entries

### 2026-03-09 — `00-overview.md`, `03-site-structure.md`, `06-risks-and-future.md`

**What changed:** Added English translation of the distributor page using Hugo's built-in multilingual framework. The PRD listed "Multilingual support" as a non-goal. The implementation adds `[languages]` config, filename-based translation (`_index.en.md`), and `i18n/` string files — scoped to the distributor page only. English URL: `/en/distributors/`.

**Why:** The ComixDistro app (app.dobroizlo.com.ua) is fully internationalized in English and Ukrainian. Its sign-up/sign-in pages link back to the distributor info page on this static site. English-speaking donors and potential foreign distributors in Ukraine need to understand the distributor network, making a single-page English translation a practical requirement that the original PRD did not anticipate.

**Category:** Pivot

### 2026-03-03 — PRD sync: multiple files

**What changed:** Bulk PRD sync to reconcile accumulated documentation drift. Updated `01-architecture.md` (book request form → ComixDistro API, Cloudinary image hosting, contact form AJAX), `03-site-structure.md` (removed thank-you pages from tree/inventory, updated nav to 3 items, updated hugo.toml example), `04-templates.md` (replaced Thank-You Pages section with inline success messages, updated contact and book request form specs), `06-risks-and-future.md` (updated API URL, distributor link status), and `CLAUDE.md` (page count, tech stack, forms, URLs, layout table).

**Why:** Multiple implementation changes (contact form AJAX, ComixDistro API pivot, Cloudinary adoption, distributor page) were made across several PRs but the PRD files were not updated in sync. This entry covers the batch documentation update.

**Category:** Correction

### 2026-03-03 — `contact.html`, `contact.js`

**What changed:** Replaced the contact form's redirect-to-thank-you-page flow with AJAX submission via `fetch()` and an inline "Дякуємо!" success message. Deleted `content/kontakty/dyakuyemo.md` and `layouts/page/contact-thanks.html`. The form still submits to Netlify Forms but via JavaScript instead of a native form POST.

**Why:** Inline success messages provide a smoother UX — the user stays on the same page without a redirect/reload cycle. This matches the pattern already established by the book request form's ComixDistro API integration.

**Category:** Pivot

### 2026-03-03 — `cloudinary-img.html`, `hugo.toml`

**What changed:** Added a Cloudinary image partial (`layouts/partials/cloudinary-img.html`) and a `cloudinaryCloudName` parameter in `hugo.toml`. Some images are now served via Cloudinary CDN with on-the-fly transformations instead of exclusively from local `static/img/` files.

**Why:** Cloudinary provides automatic format negotiation (WebP/AVIF), responsive sizing, and CDN delivery — a better approach for photographic images than serving unoptimized originals from the Hugo static directory. Structural SVGs and small assets remain local.

**Category:** Discovery

### 2026-03-03 — `book-request.html`, `hugo.toml`, `ROADMAP.md`, `06-risks-and-future.md`

**What changed:** Replaced Netlify Forms submission on the book request form with an Alpine.js `fetch()` call to the ComixDistro API (`POST /api/v1/book_requests`). Removed all Netlify Forms plumbing (hidden inputs, `data-netlify`, honeypot). Added inline success message (replacing redirect to thank-you page), server-side error display, network error handling, and a new `nova_poshta_depot` field. Validation updated so at least one of email or phone is required (previously email was independently required). API URL is configurable via `bookRequestApiUrl` in `hugo.toml`.

**Why:** ComixDistro Phase 12 API is now live. This eliminates the Netlify Forms 100/month submission limit and centralizes book request data in the ComixDistro app where it can be managed alongside distributor workflows.

**Category:** Pivot

### 2026-02-24 — `06-risks-and-future.md`, `ROADMAP.md`

**What changed:** Expanded ComixDistro Integration section to document the planned book request form API integration (ComixDistro Phase 12), updated ComixDistro status to "deployed", added distributor portal link URL and API switchover to post-launch roadmap, cross-referenced Netlify Forms volume risk with the long-term API migration.

**Why:** ComixDistro has progressed through deployment and into operational polish. Its PRD now specifies a public JSON API for individual book requests that will replace the Hugo site's Netlify Form. Documenting this integration now ensures the Phase 7 form design anticipates the future switchover.

**Category:** Discovery
