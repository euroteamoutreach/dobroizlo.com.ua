# dobroizlo.com.ua — Implementation Roadmap

This document tracks implementation progress through phased delivery. Phases are ordered by dependency: each phase builds on the infrastructure established by previous phases.

**Progress key:** `[ ]` Not started · `[~]` In progress · `[x]` Complete · `[—]` Deferred / descoped

## Phase Overview

| Phase | Name | Dependencies | Status |
| --- | --- | --- | --- |
| 1 | Project Scaffolding | — | Complete |
| 2 | Image Migration & Static Assets | Phase 1 | Complete |
| 3 | Navigation & Footer | Phase 2 | Complete |
| 4 | Homepage | Phase 3 | Complete |
| 5 | About Page | Phase 3 | Complete |
| 6 | Contact Form | Phase 3 | Complete |
| 7 | Book Request Form | Phase 3 | Complete |
| 8 | 404 Page & Final Polish | Phases 4–7 | Complete |
| 9 | Distributor Network Page | Phase 3 | Complete |
| 10 | Launch | Phases 8–9 | In progress |

---

## Phase 1: Project Scaffolding

Set up the Hugo project structure, configuration, and build pipeline.

- [x] Initialize Hugo project (`hugo new site`)
- [x] Configure `hugo.toml` (language, params, menus, build stats)
- [x] Set up `package.json` with Tailwind CSS v4 and @tailwindcss/cli
- [x] Create `assets/css/main.css` with Tailwind import
- [x] Create `layouts/partials/css.html` (Tailwind processing partial)
- [x] Create base layout (`baseof.html`) with head, body structure
- [x] Create `layouts/partials/head.html` (meta, fonts, favicon)
- [x] Create `layouts/partials/analytics.html` (empty placeholder)
- [x] Add Alpine.js CDN script to base layout
- [x] Create `netlify.toml`
- [x] Create `.gitignore`
- [x] Create `CLAUDE.md` guidance file
- [x] Verify `hugo server` runs with a minimal page
- [x] Deploy to Netlify (preview URL) and verify build succeeds

**Milestone:** Empty site builds and deploys to Netlify.

---

## Phase 2: Image Migration & Static Assets

Transfer all images and static assets from the Nuxt project.

- [x] Copy all images to `static/img/`
- [x] Move OG image from CloudFront URL to `static/img/`
- [x] Copy SVG assets to `assets/img/` (for inlining)
- [x] Add favicon files to `static/`
- [x] Verify all images are accessible at expected URLs

**Milestone:** All static assets are in place and accessible.

---

## Phase 3: Navigation & Footer

Build the shared layout components that appear on every page.

- [x] Build `header.html` partial (logo, nav links, mobile menu)
- [x] Implement mobile hamburger menu with Alpine.js
- [x] Implement transparent-to-opaque scroll behavior (homepage only)
- [x] Build `footer.html` partial (logo, legal text, copyright)
- [x] Create `seo.html` partial (OG tags, Twitter card, robots)
- [x] Style header and footer with Tailwind (use Tailwind Plus references)

**Milestone:** Every page has consistent header, footer, and SEO meta tags.

---

## Phase 4: Homepage

Build the homepage with all five content sections.

- [x] Create `content/_index.md` with frontmatter
- [x] Create `layouts/page/home.html` template
- [x] Build Hero section (background image, book cover, title SVG, CTA)
- [x] Build Big Picture section (text + image, responsive layout)
- [x] Build Heroes section (background image, text + image, responsive)
- [x] Build Battle section (dark background, centered text)
- [x] Build How to Get section (book cover, steps, CTA, disclaimer)
- [x] Implement smooth scroll for hero CTA → `#getYourCopy` anchor
- [x] Test responsive behavior at all breakpoints

**Milestone:** Homepage matches the current site's content and layout.

---

## Phase 5: About Page

- [x] Create `content/pro-nas.md` with frontmatter
- [x] Create `layouts/page/about.html` template
- [x] Add ETO description text and linked image
- [x] Add "What we believe" PDF download button (Heroicons download icon)
- [x] Style with Tailwind

**Milestone:** About page complete and matching current content.

---

## Phase 6: Contact Form

- [x] Create `content/kontakty/_index.md` with frontmatter
- [x] Create `layouts/page/contact.html` template
- [x] Build Netlify form (name, email, message fields)
- [x] Add honeypot spam prevention
- [x] Implement Alpine.js client-side validation
- [x] Create `content/kontakty/diakuiemo.md` (thank-you page)
- [x] Create `layouts/page/contact-thanks.html` template
- [x] Set `noindex` and sitemap exclusion on thank-you page
- [x] Test form submission on Netlify preview deploy
- [x] Configure email notifications in Netlify dashboard

**Milestone:** Contact form submits successfully, thank-you page displays,
email notifications work.

---

## Phase 7: Book Request Form

The most complex phase — the multi-field form with out-of-stock toggle.

- [x] Create `content/zamovyty-knyzhku/_index.md` with frontmatter
- [x] Create `layouts/page/book-request.html` template
- [x] Build the flow diagram (Fill Form → Lesson 1 → Get Book)
- [x] Build the full Netlify form with all fields
- [x] Implement oblast dropdown with all 24 oblasts
- [x] Implement study format radio buttons (online/paper)
- [x] Implement terms checkbox with consent text
- [x] Implement Alpine.js validation for all required fields
- [x] Implement out-of-stock toggle (`bookFormEnabled` parameter)
- [x] Build the out-of-stock notice (disabled state)
- [x] Create `content/zamovyty-knyzhku/diakuiemo.md` (thank-you page)
- [x] Create `layouts/page/book-request-thanks.html` template
- [x] Set `noindex` and sitemap exclusion on thank-you page
- [x] Test both form states (enabled and disabled)
- [x] Test form submission on Netlify preview deploy
- [x] Configure email notifications in Netlify dashboard

**Milestone:** Book request form works in both states, submissions
received, thank-you page displays correctly.

---

## Phase 8: 404 Page & Final Polish

- [x] Create `layouts/404.html` with SVG graphic and home link
- [x] Review all pages at all breakpoints (mobile, tablet, desktop)
- [x] Verify all internal links work
- [x] Verify all external links work (euroteamoutreach.org, CloudFront PDF)
- [x] Verify sitemap.xml is correct (excludes thank-you pages)
- [x] Verify robots.txt is correct
- [x] Test OG images (use Facebook Sharing Debugger or similar)
- [x] Lighthouse audit (performance, accessibility, SEO, best practices)
- [x] Cross-browser check (Chrome, Firefox, Safari)

**Milestone:** Site is complete and ready for launch review.

---

## Phase 9: Distributor Network Page

Build the "Become a Distributor" marketing page for the Distributor Network.

- [x] Create `content/dystrybutoram/_index.md` with overview of the Distributor Network drawn from `docs/distributor-network-content.md` §A (condensed for marketing audience)
- [x] Create `layouts/page/distributor.html` template with CTA button linking to `https://app.dobroizlo.com.ua`
- [x] Add navigation link to the new page (secondary nav item, footer link, or both)

**Milestone:** Distributor Network page is live and linked from site navigation.

---

## Phase 10: Launch

- [x] Final review with developer (Joshua)
- [x] Lower DNS TTL on dobroizlo.com.ua (if possible, 24-48 hours before) — N/A: apex/www are CloudFront alias records (~60s effective TTL), so no pre-lowering or waiting period was needed
- [x] Update DNS to point to Netlify
- [x] Verify SSL certificate provisioning on Netlify
- [x] Verify site is live at dobroizlo.com.ua
- [x] Test all forms on production domain
- [x] Verify email notifications on production
- [x] Test OG image sharing on Telegram, Facebook, Viber
- [x] Enable analytics (when tool is selected)
- [ ] Archive old Nuxt repository
- [ ] Rename Hugo repository to `dobroizlo.com.ua`

**Milestone:** Site is live. 🎉

---

## Post-Launch

- [ ] Monitor Netlify Forms submission counts (100/month free tier)
- [ ] Toggle `bookFormEnabled` as needed when stock changes
- [x] Select and implement analytics solution (coordinate with OFReport.com)
- [ ] Consider font refresh if desired
- [x] Switch book request form from Netlify Forms to ComixDistro API (→ See `06-risks-and-future.md` §"Book Request Form → ComixDistro API")
