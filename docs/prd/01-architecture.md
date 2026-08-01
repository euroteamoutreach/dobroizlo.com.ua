# Architectural Decisions

This document records the key technology and architecture decisions for the
Hugo rebuild. Each section follows a Decision → Rationale → Implementation
pattern.

---

## CSS: Tailwind CSS v4

**Decision:** Use Tailwind CSS v4 via Hugo's built-in `css.TailwindCSS`
function. Same setup as OFReport.com.

**Setup (per Hugo official docs):**

1. Install dependencies: `npm install --save-dev tailwindcss @tailwindcss/cli`
2. Create `assets/css/main.css`:

   ```css
   @import "tailwindcss";
   @source "hugo_stats.json";
   ```

3. Add `buildStats`, cache busters, and module mounts to `hugo.toml`
   (see [`03-site-structure.md`](./03-site-structure.md))

4. Create `layouts/partials/css.html`:

   ```go-html-template
   {{ with resources.Get "css/main.css" }}
     {{ $opts := dict "minify" (not hugo.IsDevelopment) }}
     {{ with . | css.TailwindCSS $opts }}
       {{ if hugo.IsDevelopment }}
         <link rel="stylesheet" href="{{ .RelPermalink }}">
       {{ else }}
         {{ with . | fingerprint }}
           <link rel="stylesheet" href="{{ .RelPermalink }}"
                 integrity="{{ .Data.Integrity }}" crossorigin="anonymous">
         {{ end }}
       {{ end }}
     {{ end }}
   {{ end }}
   ```

5. Include in base template with deferred execution:

   ```go-html-template
   <head>
     {{ with (templates.Defer (dict "key" "global")) }}
       {{ partial "css.html" . }}
     {{ end }}
   </head>
   ```

---

## JavaScript: Alpine.js (Minimal)

**Decision:** Use Alpine.js for interactive behaviors. No heavy JavaScript
framework.

**Rationale:**

- Consistent with OFReport.com stack
- Alpine.js (~17KB) is designed for adding interactivity to server-rendered
  HTML — exactly what a Hugo site needs
- Handles this site's specific needs: mobile menu toggle, form validation,
  collapsible sections, and the book request form's conditional disabled state
- Familiar to Vue.js developers (Alpine was inspired by Vue)

**Use cases on this site:**

- Mobile hamburger menu toggle
- Contact form client-side validation
- Book request form client-side validation
- Book request form "out of stock" disabled state (or could be Hugo param —
  see Out of Stock Toggle section below)

**Implementation:**

- Load via CDN in the base layout before `</body>`:

  ```html
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3/dist/cdn.min.js"></script>
  ```

---

## Image Strategy: Local Files + Cloudinary

**Decision:** Structural assets (SVGs, backgrounds, OG image) are stored
locally. Photographic images are served via Cloudinary CDN for automatic
format negotiation and responsive sizing.

**Rationale:**

- The site has a small, fixed set of structural images (book covers,
  illustrations, background images, logos) that work well as local files
- Photographic images benefit from Cloudinary's automatic WebP/AVIF
  conversion, responsive sizing, and CDN delivery
- A Hugo partial (`layouts/partials/cloudinary-img.html`) abstracts
  Cloudinary URL construction; the cloud name is configured via
  `cloudinaryCloudName` in `hugo.toml`

**Implementation:**

- `static/img/` — backgrounds, OG image, and assets referenced by direct URL
- `assets/img/` — SVGs that need inlining via Hugo pipes
- Cloudinary — photographic images via `cloudinary-img.html` partial
  (accepts `publicId`, `transforms`, `alt`, `class`, `width`, `height`,
  `loading` parameters)

**Image inventory from current site:**

| Image | Usage | Format |
| ------- | ------- | -------- |
| `ge-cover-glow-520h.png` | Hero section book cover | PNG |
| `hero-book.svg` | Hero section title graphic | SVG |
| `ge-76-77-spread-500w.png` | "Big picture" section spread | PNG |
| `elijah-chariot-run-700w.jpg` | "Heroes" section illustration | JPG |
| `ge-cover-600h.png` | "How to get" section cover | PNG |
| `ge-cover-2-150h.png` | Book request flow diagram | PNG |
| `bf-cover-uk-150h.png` | Bible First cover (book request) | PNG |
| `comic-spread-dark-fade-1500w.jpg` | Hero background | JPG |
| `124-beige-fade-1500w.jpg` | "Heroes" section background | JPG |
| `battle-horizon-1500w.jpg` | "Battle" section background | JPG |
| `eto-cover-700w.jpg` | About page ETO image | JPG |
| `DiZ-mini-white-logo.svg` | Header nav logo (inlined via `icons/logo.html`) | SVG |
| `dobro-i-zlo-vertical-logo.svg` | Footer logo | SVG |
| `404.svg` | 404 page graphic | SVG |
| `dobro-i-zlo-fb-og-1200w.jpg` | Open Graph preview image | JPG |

---

## Icons: Heroicons

**Decision:** Replace Font Awesome Pro with Heroicons.

**Rationale:**

- Font Awesome Pro is a paid dependency with heavy package weight
- Current icon usage on the site is minimal: download icon (About page),
  directional arrows (book request flow diagram), chevron (oblast dropdown),
  and social media icons (footer)
- Heroicons is MIT-licensed, pairs naturally with Tailwind CSS, and is
  designed by the Tailwind team
- Inline SVGs keep the site lightweight with zero external icon dependencies

**Implementation:**

- Use Heroicons as inline SVGs in templates
- For social media icons (if needed in footer), use simple inline SVGs
- The book request flow diagram arrows can use Heroicons arrow icons or
  simple CSS/SVG arrows
- The oblast dropdown chevron can use a Heroicon or native CSS styling

---

## Contact Form: Netlify Forms

**Decision:** Replace Formspree with Netlify Forms. Same approach as
OFReport.com.

**Current form (Formspree):**

- Posts to `formspree.io/f/meqvqqyq`
- CC emails to nathan@ and tetiana@ (set via JS to avoid scraping)
- Fields: Full Name (required), Email (required), Message (required)
- Honeypot field (`_gotcha`) for spam prevention
- Client-side validation via Vuelidate

**New implementation (Netlify Forms + AJAX):**

- HTML `<form>` with `data-netlify="true"` attribute
- Netlify honeypot field: `netlify-honeypot="bot-field"`
- AJAX submission via `fetch()` in `assets/js/contact.js`
- On success: inline "Дякуємо!" message replaces the form (no redirect)
- Fields: Full Name (required), Email (required), Message (required)
- Netlify free tier: 100 submissions/month — more than sufficient (only
  the contact form uses Netlify Forms now)

**Email notifications:** Netlify Forms supports email notifications to
multiple addresses, configured in the Netlify dashboard. This replaces the
Formspree CC field approach.

---

## Book Request Form: ComixDistro API

**Decision:** Submit book requests to the ComixDistro Rails API instead of
Netlify Forms. This centralizes request data in the ComixDistro app where it
can be managed alongside distributor workflows.

**API endpoint:** `POST /api/v1/book_requests` on the ComixDistro app
(configurable via `bookRequestApiUrl` in `hugo.toml`).

**Form fields:**

| Field | Type | Required | Notes |
| ------- | ------ | ---------- | ------- |
| Last Name (Прізвище) | text | Yes | |
| First Name (Ім'я) | text | Yes | |
| Email (Електронна скринька) | email | At least one of email/phone | |
| Phone (Телефон) | text | At least one of email/phone | |
| Address (Адреса) | text | Yes | |
| Region (Район) | text | No | |
| City (Місто) | text | Yes | |
| Oblast (Область) | select | Yes | 24 Ukrainian oblasts |
| Postal Code (Індекс) | text | Yes | |
| Nova Poshta Depot (Відділення Нової Пошти) | text | No | |
| Study Format | radio | — | Online (default) or Paper |
| Referral Source | textarea | No | |
| Comments | textarea | No | |
| Terms Checkbox | checkbox | Yes | Consent to Bible First enrollment |

**Implementation:**

- Alpine.js `fetch()` in `assets/js/book-request.js`
- JSON payload with `book_request` wrapper object
- Hidden `website_url` honeypot field (offscreen-positioned, silently
  discarded server-side)
- Server-side rate limiting at 5 requests/hour per IP (Rack::Attack)
- `201 Created` → inline success message replaces the form
- `422 Unprocessable Entity` → field-level validation errors displayed inline
- Out of Stock toggle via Hugo site parameter (see below)

→ See `06-risks-and-future.md` §"Book Request Form → ComixDistro API" for
CORS, spam protection, and API details.

---

## Form Validation: Alpine.js + HTML5

**Decision:** Use Alpine.js for client-side validation, paired with HTML5
`required` attributes as a baseline.

**Rationale:**

- Replaces Vuelidate (Vue-specific, not available in Hugo)
- Alpine.js is already in the stack for other interactive behavior
- HTML5 `required`, `type="email"`, and `maxlength` attributes provide
  browser-native validation as a first layer
- Alpine.js adds custom validation UX: inline error messages, field
  highlighting, and form-level error summary (matching the current site's
  behavior)
- Keeps validation logic co-located with form HTML via Alpine's declarative
  syntax

**Implementation pattern:**

```html
<form x-data="contactForm()" @submit.prevent="submitForm">
  <div :class="{ 'invalid': errors.fullName }">
    <label for="fullName">Ім'я та прізвище</label>
    <input name="fullName" x-model="fullName" required maxlength="100">
    <p x-show="errors.fullName" x-text="errors.fullName" class="error"></p>
  </div>
  <!-- ... -->
</form>
```

**Note:** The specific Alpine.js validation implementation will be refined
during the template-building phase. The pattern above illustrates the general
approach.

---

## Out of Stock Toggle

**Decision:** Implement the book request form's disabled state as a Hugo
site parameter, controllable from `hugo.toml`.

**Rationale:**

- The current implementation hardcodes `formDisabled: true` in the Vue
  component's data — a code change is required to toggle it
- A Hugo site parameter makes this a configuration change, not a code change
- Toggling stock status becomes: edit one line in `hugo.toml`, commit, push,
  and Netlify auto-deploys
- The template conditionally renders either the form or the "out of stock"
  message based on the parameter

**Implementation:**

In `hugo.toml`:

```toml
[params]
  bookFormEnabled = true  # Set to false when out of stock
```

In the book request template:

```go-html-template
{{ if .Site.Params.bookFormEnabled }}
  {{/* Render the book request form */}}
{{ else }}
  {{/* Render the "out of stock" notice with link to contact page */}}
{{ end }}
```

**Improvement over current approach:**

- No code changes needed to toggle
- The out-of-stock message can be a well-designed, standalone section rather
  than a bolted-on banner above the form
- The disabled form fields are not rendered at all (cleaner than disabling
  a submit button)
- Could be extended later to read from an external source (e.g., ComixDistro
  API) if automated stock tracking is desired

---

## External Assets: CloudFront

**Decision:** Keep the "What we believe" PDF on CloudFront. Move the OG
image into the Hugo project.

**Rationale:**

- The PDF (`symvol-viry.pdf`) is a standalone document hosted at
  `d2ppgd6w5akw3v.cloudfront.net/pdf/symvol-viry.pdf`. No reason to move
  it — it works, the URL doesn't need to change, and PDFs don't belong in
  a Git repo.
- The OG image (`dobro-i-zlo-fb-og-1200w.jpg`) is a single static file
  that logically belongs with the site. Moving it to `static/img/` makes the
  site fully self-contained for its core assets.

---

## Analytics: Deferred

**Decision:** Use a free, privacy-friendly analytics tool. The specific tool
will be chosen later, likely matching whatever is selected for OFReport.com.

**Candidates:**

- **GoatCounter** — free for non-commercial use, open source, lightweight
- **Umami** — open source, self-hostable on free-tier platforms
- **Plausible Community Edition** — open source, self-hosted

**Implementation:**

- Create a swappable partial (`partials/analytics.html`) that contains the
  analytics script tag
- Conditional loading: only in production
  (`{{ if hugo.IsProduction }}...{{ end }}`)
- Designed so switching tools means changing only this one file

**Note:** The current site uses Google Analytics Universal (`UA-71158009-4`),
which is deprecated. This will not be carried over.

---

## Sitemap

**Decision:** Use Hugo's built-in sitemap generation.

**Implementation:**

- Hugo auto-generates `sitemap.xml` with no custom template needed
- All public pages are included; no exclusions are needed (the former
  thank-you pages have been removed in favor of inline success messages)

---

## Summary of Technology Decisions

| Concern | Decision |
| --------- | ---------- |
| Static site generator | Hugo |
| CSS framework | Tailwind CSS v4 via `css.TailwindCSS` |
| JavaScript | Alpine.js (CDN) |
| Form handling | Contact: Netlify Forms (AJAX); Book request: ComixDistro API |
| Form validation | Alpine.js + HTML5 attributes |
| Icons | Heroicons (inline SVGs) |
| Images | Local files + Cloudinary CDN (photographic images) |
| Fonts | Google Fonts: Roboto Condensed + Source Sans Pro |
| Analytics | Deferred (privacy-friendly, free) |
| Hosting | Netlify |
| PDF hosting | CloudFront (existing) |
| Spam prevention | Netlify honeypot |
