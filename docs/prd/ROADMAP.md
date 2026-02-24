# dobroizlo.com.ua — Implementation Roadmap

This document tracks implementation progress through phased delivery. Phases are ordered by dependency: each phase builds on the infrastructure established by previous phases.

**Progress key:** `[ ]` Not started · `[~]` In progress · `[x]` Complete · `[—]` Deferred / descoped

## Phase Overview

| Phase | Name | Dependencies | Status |
| --- | --- | --- | --- |
| 1 | Project Scaffolding | — | Complete |
| 2 | Image Migration & Static Assets | Phase 1 | Complete |
| 3 | Navigation & Footer | Phase 2 | Complete |
| 4 | Homepage | Phase 3 | Not started |
| 5 | About Page | Phase 3 | Not started |
| 6 | Contact Form | Phase 3 | Not started |
| 7 | Book Request Form | Phase 3 | Not started |
| 8 | 404 Page & Final Polish | Phases 4–7 | Not started |
| 9 | Launch | Phase 8 | Not started |

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
- [ ] Implement smooth scroll for hero CTA → `#getYourCopy` anchor
- [ ] Test responsive behavior at all breakpoints

**Milestone:** Homepage matches the current site's content and layout.

---

## Phase 5: About Page

- [ ] Create `content/pro-nas.md` with frontmatter
- [ ] Create `layouts/page/about.html` template
- [ ] Add ETO description text and linked image
- [ ] Add "What we believe" PDF download button (Heroicons download icon)
- [ ] Style with Tailwind

**Milestone:** About page complete and matching current content.

---

## Phase 6: Contact Form

- [ ] Create `content/kontakty/_index.md` with frontmatter
- [ ] Create `layouts/page/contact.html` template
- [ ] Build Netlify form (name, email, message fields)
- [ ] Add honeypot spam prevention
- [ ] Implement Alpine.js client-side validation
- [ ] Create `content/kontakty/diakuiemo.md` (thank-you page)
- [ ] Create `layouts/page/contact-thanks.html` template
- [ ] Set `noindex` and sitemap exclusion on thank-you page
- [ ] Test form submission on Netlify preview deploy
- [ ] Configure email notifications in Netlify dashboard

**Milestone:** Contact form submits successfully, thank-you page displays,
email notifications work.

---

## Phase 7: Book Request Form

The most complex phase — the multi-field form with out-of-stock toggle.

- [ ] Create `content/zamovyty-knyzhku/_index.md` with frontmatter
- [ ] Create `layouts/page/book-request.html` template
- [ ] Build the flow diagram (Fill Form → Lesson 1 → Get Book)
- [ ] Build the full Netlify form with all fields
- [ ] Implement oblast dropdown with all 24 oblasts
- [ ] Implement study format radio buttons (online/paper)
- [ ] Implement terms checkbox with consent text
- [ ] Implement Alpine.js validation for all required fields
- [ ] Implement out-of-stock toggle (`bookFormEnabled` parameter)
- [ ] Build the out-of-stock notice (disabled state)
- [ ] Create `content/zamovyty-knyzhku/diakuiemo.md` (thank-you page)
- [ ] Create `layouts/page/book-request-thanks.html` template
- [ ] Set `noindex` and sitemap exclusion on thank-you page
- [ ] Test both form states (enabled and disabled)
- [ ] Test form submission on Netlify preview deploy
- [ ] Configure email notifications in Netlify dashboard

**Milestone:** Book request form works in both states, submissions
received, thank-you page displays correctly.

---

## Phase 8: 404 Page & Final Polish

- [ ] Create `layouts/404.html` with SVG graphic and home link
- [ ] Review all pages at all breakpoints (mobile, tablet, desktop)
- [ ] Verify all internal links work
- [ ] Verify all external links work (euroteamoutreach.org, CloudFront PDF)
- [ ] Verify sitemap.xml is correct (excludes thank-you pages)
- [ ] Verify robots.txt is correct
- [ ] Test OG images (use Facebook Sharing Debugger or similar)
- [ ] Lighthouse audit (performance, accessibility, SEO, best practices)
- [ ] Cross-browser check (Chrome, Firefox, Safari)

**Milestone:** Site is complete and ready for launch review.

---

## Phase 9: Launch

- [ ] Final review with developer (Joshua)
- [ ] Lower DNS TTL on dobroizlo.com.ua (if possible, 24-48 hours before)
- [ ] Update DNS to point to Netlify
- [ ] Verify SSL certificate provisioning on Netlify
- [ ] Verify site is live at dobroizlo.com.ua
- [ ] Test all forms on production domain
- [ ] Verify email notifications on production
- [ ] Test OG image sharing on Telegram, Facebook, Viber
- [ ] Enable analytics (when tool is selected)
- [ ] Archive old Nuxt repository
- [ ] Rename Hugo repository to `dobroizlo.com.ua`

**Milestone:** Site is live. 🎉

---

## Post-Launch

- [ ] Monitor Netlify Forms submission counts (100/month free tier)
- [ ] Toggle `bookFormEnabled` as needed when stock changes
- [ ] Select and implement analytics solution (coordinate with OFReport.com)
- [ ] Consider font refresh if desired
- [ ] Add distributor portal link → `https://app.dobroizlo.com.ua` (ComixDistro is deployed; can also be done in Phase 8 polish)
- [ ] Switch book request form from Netlify Forms to ComixDistro API (blocked on ComixDistro Phase 12 — → See `06-risks-and-future.md` §"Book Request Form → ComixDistro API")
