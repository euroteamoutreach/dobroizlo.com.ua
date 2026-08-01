# Templates & Layouts

---

## Base Layout (`baseof.html`)

```go-html-template
<!DOCTYPE html>
<html lang="uk">
<head>
  {{ partial "head.html" . }}
  {{ with (templates.Defer (dict "key" "global")) }}
    {{ partial "css.html" . }}
  {{ end }}
</head>
<body>
  {{ partial "header.html" . }}
  <main>
    {{ block "main" . }}{{ end }}
  </main>
  {{ partial "footer.html" . }}
  {{ partial "analytics.html" . }}
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3/dist/cdn.min.js"></script>
</body>
</html>
```

---

## Head Partial (`head.html`)

Includes:

- Character encoding and viewport meta
- Title tag with suffix pattern:
  `{{ .Title }} | {{ .Site.Params.titleBase }}` (homepage uses base title
  only)
- SEO partial (see below)
- Google Fonts: Roboto Condensed + Source Sans Pro (cyrillic-ext)
- Favicon
- Google site verification meta tag

---

## SEO Partial (`seo.html`)

**Meta tags to include:**

- `<meta name="description" content="{{ .Description }}">`
- `<link rel="canonical" href="{{ .Permalink }}">`
- Open Graph: `og:title`, `og:description`, `og:image`, `og:url`
- Twitter Card: `summary_large_image`, `twitter:site` (@eto_ukraine)
- Robots: `index,follow` in production, `noindex,nofollow` otherwise.
  Thank-you pages always `noindex,nofollow` (via frontmatter `robots` field).

**OG image:** Uses `static/img/dobro-i-zlo-fb-og-1200w.jpg` for all pages
(the site has no per-page unique images that would make better OG images).

---

## Navigation Header (`header.html`)

**Current behavior to preserve:**

- Fixed position at top of page
- On homepage: starts transparent, becomes opaque on scroll
- On other pages: always opaque
- Logo/site name links to homepage
- Menu items: Про нас, Контакти, Дистриб'юторам
- Mobile: hamburger menu with Alpine.js toggle

**Notes:**

- The site has 3 nav links, keeping the header simple
- The transparent-to-opaque scroll behavior on the homepage is a nice touch
  that can be replicated with Alpine.js (`@scroll.window`)
- The nav is much simpler than OFReport.com's 7-item menu

---

## Footer (`footer.html`)

**Current footer contains:**

- Vertical _Добро і зло_ SVG logo
- Legal text: "Написав _Добро і зло_ Майкл Перл. Авторські права © 2008,
  2018 Майкл і Дебі Перл."
- Distribution credit: "Друк і розповсюдження книги «Добро і зло» українською
  мовою здійснює організація Euro Team Outreach, Inc."
- Disclaimer: book quantity limitation and order conditions note
- Copyright: `© {{ now.Year }} Euro Team Outreach, Inc.`

**The footer is relatively simple** — no multi-column nav, no social icons,
no Bible verse. Just the logo, legal/copyright text, and disclaimer.

---

## Homepage (`page/home.html`)

The homepage is the most complex template. It consists of five distinct
sections, each with its own layout pattern:

### Section 1: Hero

- Full-width CSS background image (`comic-spread-dark-fade-1500w.jpg`)
- Desktop: book cover image on left, title SVG + description text + CTA
  button on right
- Mobile: title SVG, book cover below, description text, CTA button
- CTA button ("Отримати книжку") scrolls to the "How to Get" section
  (anchor link `#getYourCopy`)
- White text on dark background

### Section 2: Big Picture ("Побачте велику картину")

- Light background
- Desktop: text on left, book spread image on right
- Mobile: heading, image, text (stacked)
- Content: describes the book's chronological Bible narrative

### Section 3: Heroes ("Зустрічайте Божих героїв")

- Light background with subtle CSS background image
  (`124-beige-fade-1500w.jpg`)
- Desktop: Elijah illustration on left, text on right
- Mobile: heading, image, text (stacked)
- Content: describes the book's illustrations and characters

### Section 4: Battle ("Станьте учасником битви між добром і злом")

- Full-width dark CSS background image (`battle-horizon-1500w.jpg`)
- Centered white text, no images
- Content: describes the good vs. evil narrative

### Section 5: How to Get a Copy

- Light background
- Desktop: book cover on left, instructions + CTA on right
- Mobile: heading, book cover, instructions, CTA (stacked)
- Numbered instruction list (3 steps for Bible First enrollment)
- CTA button ("Замовити примірник") links to `/zamovyty-knyzhku/`
- Disclaimer text about Ukraine-only shipping
- Anchor target `#getYourCopy` for the hero CTA scroll

### Content Source

All homepage text is currently hardcoded in the Vue component's `data()`
object. For the Hugo rebuild, this text can be:

- **Hardcoded in the template** (simplest, since the text rarely changes)
- **Stored in frontmatter or data files** (more flexible but unnecessary
  complexity for a single-language landing page)

**Recommendation:** Hardcode in the template for simplicity. If localization
is ever needed, refactor to Hugo i18n files at that point.

---

## About Page (`page/about.html`)

Simple centered layout:

- Heading: "Про нас"
- Description paragraph about Euro Team Outreach
- Linked image of ETO website (`eto-cover-700w.jpg`) — links to
  euroteamoutreach.org
- Text with link to euroteamoutreach.org
- Horizontal rule
- "What we believe" button — links to PDF on CloudFront:
  `https://d2ppgd6w5akw3v.cloudfront.net/pdf/symvol-viry.pdf`
- The button should include a download icon (Heroicons)

---

## Contact Form Page (`page/contact.html`)

- Heading: "Зв'яжіться з нами"
- Subheading: "Маєте запитання? Напишіть нам повідомлення! Ми постараємось
  відповісти якнайшвидше."
- Form with Netlify Forms integration:
  - Full Name (text, required, max 100)
  - Email (email, required, max 100)
  - Message (textarea, required, max 3000)
  - Submit button: "Надіслати"
- Form wrapped in white card with shadow (matching current design)
- Client-side validation via Alpine.js
- Honeypot field for spam prevention
- AJAX submission via `fetch()` (`assets/js/contact.js`)
- On success: inline "Дякуємо!" message replaces the form (no redirect)

**Placeholder text (for reference):**

- Name: "Петро Тимошенко"
- Email: `petro@tymoshenko.ua`
- Message: "Слухаємо уважно..."

---

## Book Request Form Page (`page/book-request.html`)

The most complex page on the site. Two states based on
`Site.Params.bookFormEnabled`:

### Enabled State (form active)

- Heading: "Заявка на отримання книжки «Добро і зло»"
- Subheading explaining free book + one-per-family limit
- Visual flow diagram: Fill Form → Complete Lesson 1 → Get Book
  (with directional arrows, horizontal on desktop, vertical on mobile)
- Explanatory text about Bible First course registration
- Link to contact page for questions
- Full form submitting to ComixDistro API (see field list in
  [`01-architecture.md`](./01-architecture.md))
- Terms checkbox with detailed consent text
- Submit button: "Надіслати"
- Shipping disclaimer: "Надсилаємо фізичні матеріали тільки на адреси
  в межах України."
- AJAX submission via `fetch()` (`assets/js/book-request.js`)
- On success: inline "Дякуємо!" message replaces the form (no redirect)
- On server error (422): field-level validation errors displayed inline

### Disabled State (out of stock)

- Prominent notice: "УВАГА!" heading
- Explanation that book stock is exhausted and orders are paused
- Message of hope that more books will be printed
- Link to contact page for questions
- The form itself is not rendered (not just disabled)

### Oblast Dropdown Values

The oblast select field includes all 24 Ukrainian oblasts:

Вінницька, Волинська, Дніпропетровська, Донецька, Житомирська, Закарпатська,
Запорізька, Івано-Франківська, Київська, Кіровоградська, Луганська, Львівська,
Миколаївська, Одеська, Полтавська, Рівненська, Сумська, Тернопільська,
Харківська, Херсонська, Хмельницька, Черкаська, Чернівецька, Чернігівська

---

## Inline Success Messages

Both forms display inline success messages after submission (no separate thank-you pages). The success message replaces the form content on the same page using Alpine.js conditional rendering.

### Contact Form Success

- Heading: "Дякуємо!"
- Message: confirms the message was sent and a reply is coming
- Button: "На головну" → links to `/`

### Book Request Form Success

- Heading: "Дякуємо!"
- Message: confirms the request was received
- Button: "На головну" → links to `/`

**History:** The original PRD specified separate thank-you pages at `/kontakty/diakuiemo/` and `/zamovyty-knyzhku/diakuiemo/`. These were implemented, then replaced with inline success messages for a smoother UX. The content files and templates were deleted.

---

## Custom 404 Page (`404.html`)

- SVG "404" graphic (port existing `404.svg` asset)
- Heading: "Сторінку не знайдено."
- Button: "На головну" → links to `/`
- Clean, centered layout
