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
│   │   └── _index.md            # Contact form page
│   ├── zamovyty-knyzhku/
│   │   └── _index.md            # Book request form page
│   └── dystrybutoram/
│       └── _index.md            # Distributor Network overview page
├── docs/
│   ├── prd/                     # PRD documents (this directory)
│   └── tailwind_plus/           # Tailwind Plus snippets (local-only, git-ignored; see NOTICE)
├── layouts/
│   ├── _default/
│   │   ├── baseof.html          # Base template
│   │   └── single.html          # Default single page template
│   ├── page/
│   │   ├── home.html            # Homepage template
│   │   ├── about.html           # About page template
│   │   ├── contact.html         # Contact form template
│   │   ├── book-request.html    # Book request form template
│   │   └── distributor.html     # Distributor Network overview template
│   ├── partials/
│   │   ├── head.html            # <head> contents (meta, fonts, favicons)
│   │   ├── header.html          # Site header & navigation
│   │   ├── footer.html          # Site footer
│   │   ├── css.html             # Tailwind CSS processing
│   │   ├── seo.html             # OG tags, Twitter cards, robots
│   │   ├── cloudinary-img.html  # Cloudinary image helper
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

> **Hugo note:** The `layout` frontmatter field is a template _name_, not a
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
| ------ | ----- | ------------- | -------- | ------- |
| Homepage | `/` | `content/_index.md` | `page/home.html` | Hero, content sections, CTA |
| About | `/pro-nas/` | `content/pro-nas.md` | `page/about.html` | ETO info, PDF link |
| Contact | `/kontakty/` | `content/kontakty/_index.md` | `page/contact.html` | Netlify Forms (AJAX), inline success |
| Book Request | `/zamovyty-knyzhku/` | `content/zamovyty-knyzhku/_index.md` | `page/book-request.html` | ComixDistro API, out-of-stock toggle, inline success |
| Distributor Network | `/dystrybutoram/` | `content/dystrybutoram/_index.md` | `page/distributor.html` | CTA → app.dobroizlo.com.ua |
| 404 | N/A | N/A | `404.html` | Custom error page |

---

## URL Structure

All existing URLs must be preserved for SEO continuity:

| Current URL | Hugo Content Path | Notes |
| ------------- | ------------------- | ------- |
| `/` | `content/_index.md` | Homepage |
| `/pro-nas/` | `content/pro-nas.md` | Hugo generates `/pro-nas/` from filename |
| `/kontakty/` | `content/kontakty/_index.md` | Section index |
| `/zamovyty-knyzhku/` | `content/zamovyty-knyzhku/_index.md` | Section index |
| `/dystrybutoram/` | `content/dystrybutoram/_index.md` | Section index (new, not on Nuxt site) |

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
title: "Біблія-комікс «Добро і зло» — Захопливий гостросюжетний роман"
description: >-
  Жертва. Війна. Спокуса. Зрада. Надія. Спасіння. Перемога. Відкрийте для
  себе біблійну історію по-новому з цим чудовим, повноколірним виданням
  графічного роману Майкла Перла «Добро і зло».
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

**Distributor Network page (`content/dystrybutoram/_index.md`):**

```yaml
---
title: "Дистриб'юторам"
description: >-
  Станьте частиною мережі розповсюдження Біблії-коміксу Добро і зло.
type: "page"
layout: "distributor"
---
```

**Note:** Thank-you pages previously existed at `/kontakty/diakuiemo/` and `/zamovyty-knyzhku/diakuiemo/` but have been replaced by inline success messages. No separate content files or templates exist for post-submission pages.

---

## Hugo Configuration (`hugo.toml`)

```toml
baseURL = "https://dobroizlo.com.ua/"
defaultContentLanguage = "uk"
enableRobotsTXT = true

# No taxonomies needed for this site
[taxonomies]

# No pagination needed
[pagination]
  pagerSize = 100

# Languages (Ukrainian default; English scoped to the distributor page)
[languages]
  [languages.uk]
    locale = "uk-UA"
    label = "Українська"
    title = "Біблія-комікс «Добро і зло»"
    weight = 1
    [[languages.uk.menus.main]]
      name = "Про нас"
      url = "/pro-nas/"
      weight = 10
    [[languages.uk.menus.main]]
      name = "Контакти"
      url = "/kontakty/"
      weight = 20
    [[languages.uk.menus.main]]
      name = "Дистриб'юторам"
      url = "/dystrybutoram/"
      weight = 30
  [languages.en]
    locale = "en-US"
    label = "English"
    weight = 2

# Site parameters
[params]
  description = "Жертва. Війна. Спокуса. Зрада. Надія. Спасіння. Перемога. Відкрийте для себе біблійну історію по-новому з цим чудовим, повноколірним виданням графічного роману Майкла Перла «Добро і зло»."
  titleBase = "Біблія-комікс «Добро і зло» — Захопливий гостросюжетний роман"
  author = "Euro Team Outreach, Inc."
  twitterSite = "@eto_ukraine"
  ogImage = "/img/dobro-i-zlo-fb-og-1200w.jpg"
  pdfBase = "https://d2ppgd6w5akw3v.cloudfront.net/pdf/"
  googleSiteVerification = "y1SQFy6s4FDs3ojWSkiJ1dAum7pBC0kIQpbFsWaWwH8"

  # Book request form toggle
  bookFormEnabled = true  # Set to false when out of stock

  # Cloudinary cloud name for image hosting
  cloudinaryCloudName = "euro-team-outreach"

  # ComixDistro API endpoint for book request form submissions
  bookRequestApiUrl = "https://app.dobroizlo.com.ua/api/v1/book_requests"

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

- **`defaultContentLanguage = "uk"`** — Ukrainian is the default language; its
  pages live at the site root (e.g. `/pro-nas/`)
- **`[languages]`** — multilingual config. `uk` (default, weight 1) carries the
  full site; `en` (weight 2) is scoped to the distributor page at
  `/en/distributors/`. Each language sets `locale` and `label` (used by the
  language switcher); `title` and the navigation menu are nested per-language
  under `[languages.uk]`
- **`enableRobotsTXT = true`** — Hugo generates `robots.txt`
- **`[taxonomies]`** — empty block explicitly disables Hugo's default
  taxonomy generation (no tags, categories, etc.)
- **`bookFormEnabled`** — the out-of-stock toggle, documented in
  [`01-architecture.md`](./01-architecture.md)
- **`cloudinaryCloudName`** — Cloudinary cloud name for the image helper partial
- **`bookRequestApiUrl`** — ComixDistro API endpoint for book request submissions
- **Navigation** — 3 menu items (Про нас, Контакти, Дистриб'юторам) nested
  under `[languages.uk.menus.main]`. The homepage is reached via the logo/site
  name.
- **`titleBase`** — used in templates for the title tag suffix pattern
