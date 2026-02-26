# Site Structure

---

## Content Organization

```text
dobroizlo.com.ua/
├── assets/
│   ├── css/
│   │   └── main.css             # Tailwind CSS entry point
│   └── img/                     # SVGs for inlining via Hugo pipes
│       └── dobro-i-zlo-vertical-logo.svg
├── content/
│   ├── _index.md                # Homepage
│   ├── pro-nas.md               # About page
│   ├── kontakty/
│   │   ├── _index.md            # Contact form page
│   │   └── diakuiemo.md         # Contact thank-you page
│   ├── zamovyty-knyzhku/
│   │   ├── _index.md            # Book request form page
│   │   └── diakuiemo.md         # Book request thank-you page
│   └── dystrybutoram/
│       └── _index.md            # Distributor Network overview page
├── docs/
│   ├── prd/                     # PRD documents (this directory)
│   └── tailwind_plus/           # Tailwind Plus reference snippets (see NOTICE)
├── layouts/
│   ├── _default/
│   │   ├── baseof.html          # Base template
│   │   └── single.html          # Default single page template
│   ├── page/
│   │   ├── home.html            # Homepage template
│   │   ├── about.html           # About page template
│   │   ├── contact.html         # Contact form template
│   │   ├── contact-thanks.html  # Contact thank-you template
│   │   ├── book-request.html    # Book request form template
│   │   ├── book-request-thanks.html  # Book request thank-you template
│   │   └── distributor.html     # Distributor Network overview template
│   ├── partials/
│   │   ├── head.html            # <head> contents (meta, fonts, favicons)
│   │   ├── header.html          # Site header & navigation
│   │   ├── footer.html          # Site footer
│   │   ├── css.html             # Tailwind CSS processing
│   │   ├── seo.html             # OG tags, Twitter cards, robots
│   │   └── analytics.html       # Analytics script (swappable)
│   └── 404.html                 # Custom 404 page
├── static/
│   ├── img/                     # Static images (photos, PNGs, backgrounds)
│   │   ├── ge-cover-glow-520h.png
│   │   ├── hero-book.svg
│   │   ├── ge-76-77-spread-500w.png
│   │   ├── elijah-chariot-run-700w.jpg
│   │   ├── ge-cover-600h.png
│   │   ├── ge-cover-2-150h.png
│   │   ├── bf-cover-uk-150h.png
│   │   ├── comic-spread-dark-fade-1500w.jpg
│   │   ├── 124-beige-fade-1500w.jpg
│   │   ├── battle-horizon-1500w.jpg
│   │   ├── eto-cover-700w.jpg
│   │   ├── 404.svg
│   │   └── dobro-i-zlo-fb-og-1200w.jpg
│   ├── favicon.ico
│   └── robots.txt               # If custom robots needed (Hugo can generate)
├── hugo.toml                    # Site configuration
├── netlify.toml                 # Netlify deployment config
├── package.json                 # npm dependencies (Tailwind, Alpine)
├── .gitignore
├── CLAUDE.md                    # Claude Code guidance
└── README.md
```

### Notes on Directory Structure

**Why `page/` layout directory?** Since this site has no blog or content
sections, every page is unique. Using `type: "page"` + `layout: "home"` (etc.)
in frontmatter allows each page to have its own dedicated template while
keeping the layouts directory clean. This avoids the single-template-fits-all
problem of `_default/single.html`.

> **Hugo note:** The `layout` frontmatter field is a template *name*, not a
> path. To resolve a template at `layouts/page/home.html`, use `type: "page"`
> (selects the directory) and `layout: "home"` (selects the template) as
> separate fields. `layout: "page/home"` does **not** work.

**Why `static/img/` for most images?** These are fixed assets referenced
directly in templates and CSS. They don't need Hugo's asset pipeline (no
transformations, no fingerprinting needed for static marketing images).
SVGs that should be inlined go in `assets/img/`.

**Alternate approach — `assets/img/` for all images:** If fingerprinting or
other Hugo pipe features are desired for cache-busting, images could live in
`assets/img/` instead and be referenced via `resources.Get`. This is a
decision that can be revisited during implementation.

---

## Page Inventory

| Page | URL | Content File | Layout | Notes |
|------|-----|-------------|--------|-------|
| Homepage | `/` | `content/_index.md` | `page/home.html` | Hero, content sections, CTA |
| About | `/pro-nas/` | `content/pro-nas.md` | `page/about.html` | ETO info, PDF link |
| Contact | `/kontakty/` | `content/kontakty/_index.md` | `page/contact.html` | Netlify form |
| Contact Thanks | `/kontakty/diakuiemo/` | `content/kontakty/diakuiemo.md` | `page/contact-thanks.html` | noindex |
| Book Request | `/zamovyty-knyzhku/` | `content/zamovyty-knyzhku/_index.md` | `page/book-request.html` | Netlify form, out-of-stock toggle |
| Book Request Thanks | `/zamovyty-knyzhku/diakuiemo/` | `content/zamovyty-knyzhku/diakuiemo.md` | `page/book-request-thanks.html` | noindex |
| Distributor Network | `/dystrybutoram/` | `content/dystrybutoram/_index.md` | `page/distributor.html` | CTA → app.dobroizlo.com.ua |
| 404 | N/A | N/A | `404.html` | Custom error page |

---

## URL Structure

All existing URLs must be preserved for SEO continuity:

| Current URL | Hugo Content Path | Notes |
|-------------|-------------------|-------|
| `/` | `content/_index.md` | Homepage |
| `/pro-nas/` | `content/pro-nas.md` | Hugo generates `/pro-nas/` from filename |
| `/kontakty/` | `content/kontakty/_index.md` | Section index |
| `/kontakty/diakuiemo/` | `content/kontakty/diakuiemo.md` | Nested under section |
| `/zamovyty-knyzhku/` | `content/zamovyty-knyzhku/_index.md` | Section index |
| `/zamovyty-knyzhku/diakuiemo/` | `content/zamovyty-knyzhku/diakuiemo.md` | Nested under section |
| `/dystrybutoram/` | `content/dystrybutoram/_index.md` | Section index (post-launch) |

Hugo's default URL generation from content file paths produces the exact URLs
needed — no custom permalink configuration required.

---

## Content File Format

Each content file uses YAML frontmatter with minimal metadata. The actual page
content is largely rendered by dedicated templates rather than markdown body
content.

**Homepage (`content/_index.md`):**

```yaml
---
title: "Добро і зло — Біблія-комікс — Захопливий гостросюжетний роман"
description: >-
  Жертва. Війна. Спокуса. Зрада. Надія. Спасіння. Перемога. Відкрийте для
  себе біблійну історію по-новому з цим чудовим, повноколірним виданням
  графічного роману Майкла Перла Добро і зло.
type: "page"
layout: "home"
---
```

**About page (`content/pro-nas.md`):**

```yaml
---
title: "Про нас"
description: >-
  Euro Team Outreach — це благодійна неприбуткова організація, діяльність
  якої пов'язана з поширенням Євангелії Ісуса Христа.
type: "page"
layout: "about"
---
```

**Thank-you pages:**

```yaml
---
title: "Дякуємо!"
type: "page"
layout: "contact-thanks"
robots: "noindex,nofollow"
sitemap:
  disable: true
---
```

---

## Hugo Configuration (`hugo.toml`)

```toml
baseURL = "https://dobroizlo.com.ua/"
languageCode = "uk"
title = "Добро і зло — Біблія-комікс"

# No taxonomies needed for this site
[taxonomies]

# No pagination needed
[pagination]
  pagerSize = 100

# Site parameters
[params]
  description = "Жертва. Війна. Спокуса. Зрада. Надія. Спасіння. Перемога. Відкрийте для себе біблійну історію по-новому з цим чудовим, повноколірним виданням графічного роману Майкла Перла Добро і зло."
  titleBase = "Добро і зло — Біблія-комікс — Захопливий гостросюжетний роман"
  author = "Euro Team Outreach, Inc."
  twitterSite = "@eto_ukraine"
  ogImage = "/img/dobro-i-zlo-fb-og-1200w.jpg"
  pdfBase = "https://d2ppgd6w5akw3v.cloudfront.net/pdf/"
  googleSiteVerification = "y1SQFy6s4FDs3ojWSkiJ1dAum7pBC0kIQpbFsWaWwH8"

  # Book request form toggle
  bookFormEnabled = true  # Set to false when out of stock

# Navigation menus
[menus]
  [[menus.main]]
    name = "Про нас"
    url = "/pro-nas/"
    weight = 10
  [[menus.main]]
    name = "Контакти"
    url = "/kontakty/"
    weight = 20

# Build stats for Tailwind CSS
[build]
  [build.buildStats]
    enable = true
  [[build.cachebusters]]
    source = 'assets/notwatching/hugo_stats\.json'
    target = 'css'
  [[build.cachebusters]]
    source = '(postcss|tailwind)\.config\.js'
    target = 'css'

[module]
  [[module.mounts]]
    source = 'assets'
    target = 'assets'
  [[module.mounts]]
    disableWatch = true
    source = 'hugo_stats.json'
    target = 'assets/notwatching/hugo_stats.json'

# Markup configuration
[markup.goldmark.renderer]
  unsafe = true  # Allow raw HTML in markdown if needed
```

### Notes on Configuration

- **`languageCode = "uk"`** — Ukrainian, matching the site's language
- **`[taxonomies]`** — empty block explicitly disables Hugo's default
  taxonomy generation (no tags, categories, etc.)
- **`bookFormEnabled`** — the out-of-stock toggle, documented in
  [`01-architecture.md`](./01-architecture.md)
- **Navigation** — only 2 menu items (Про нас, Контакти). The homepage
  is reached via the logo/site name.
- **`titleBase`** — used in templates for the title tag suffix pattern
