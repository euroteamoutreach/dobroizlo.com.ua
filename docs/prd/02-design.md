# Design & Visual Identity

---

## Design Philosophy

The Hugo rebuild should **preserve the site's visual identity** while
**refreshing subtle design details**. The color scheme is intentionally aligned
with the physical _Good and Evil_ book and must not change significantly.
However, spacing, typography, alignment, whitespace, and component styling
are all open for improvement.

**What to preserve:**

- Overall color scheme (dark theme with warm accent colors matching the book)
- General page layout structure (hero, content sections, footer)
- All graphic assets (book covers, illustrations, background images, logos)
- The site's tone: professional but inviting, Ukrainian-language throughout

**What is open for improvement:**

- Spacing and whitespace — improve breathing room and visual hierarchy
- Typographic scale — refine heading/body size relationships
- Component styling — buttons, form fields, cards, the flow diagram
- Mobile experience — improve responsive behavior with modern Tailwind
- Font choices — currently Roboto Condensed + Source Sans Pro; may be
  refreshed later in the design process
- Color shade refinement — the exact hex values for backgrounds, accents,
  and text can be tuned while staying within the book's palette

---

## Design Reference (Current Site)

These values are documented for reference. They are **not** requirements to
replicate exactly — they establish the baseline.

### Color Palette

The current site uses a dark, dramatic palette that evokes the book's cover
art. Key colors identified from the CSS and design:

| Usage | Description | Notes |
| ------- | ------------- | ------- |
| Hero/battle backgrounds | Dark, dramatic imagery | CSS background images with overlays |
| Primary accent | Orange-red | Used for CTAs ("Отримати книжку", "Надіслати") |
| Secondary accent | Blue | Used for secondary buttons ("На головну") |
| Text on dark | White | Hero section, battle section |
| Text on light | Dark gray/near-black | Content sections, forms |
| Form backgrounds | White with light gray inputs | Clean, high-contrast form styling |
| Footer | Dark background | Contains logo and legal text |

**Button colors from current CSS classes:**

- `.btn-blue` — blue accent, used for navigation/secondary actions
- `.btn-orange` — orange-red accent, used for primary CTAs

### Fonts (via Google Fonts)

| Font | Current Usage | Weight(s) |
|------|---------------|-----------|
| Roboto Condensed | Headings, UI elements | 400 |
| Source Sans Pro | Body text | 400, 600 |

Both fonts include the `cyrillic-ext` subset for Ukrainian text rendering.

**Note:** These fonts may be refreshed later during the design phase. For the
initial rebuild, they will be preserved to keep the scope focused.

### Current Responsive Behavior

The current site uses Tailwind v1 breakpoints:

| Name | Width |
| ------ | ------- |
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |

Tailwind v4 uses the same default breakpoints, so responsive behavior
should translate naturally.

### Section Layout Patterns

The homepage uses a distinctive alternating layout:

1. **Hero** — Full-width background image, centered content, book cover,
   CTA button
2. **Big Picture** — Light background, text + image side by side (image
   right on desktop, stacked on mobile)
3. **Heroes** — Light background with subtle image overlay, text + image
   side by side (image left on desktop, stacked on mobile)
4. **Battle** — Full-width dark background image, centered white text
5. **How to Get** — Light background, book cover + instructional text +
   ordered list + CTA button

This alternating light/dark, left/right pattern creates visual rhythm and
should be preserved in the rebuild.

---

## Tailwind Plus as Design Reference

The developer has a **Tailwind Plus** (UI Components) subscription. Licensed
component examples should be used as design references when building UI
elements — particularly for forms, buttons, navigation, and section layouts.

See the Tailwind Plus Workflow section in
[`00-overview.md`](./00-overview.md) for details on how to use Tailwind Plus
snippets with Claude Code.

---

## Design Decisions to Defer

The following visual decisions will be made during implementation, not in
the PRD:

- Exact Tailwind color configuration (custom theme colors in `main.css`)
- Heading size scale and line heights
- Button border-radius, padding, and hover states
- Form field styling details
- Footer layout refinement
- Mobile navigation style (hamburger menu vs. other patterns)

These are best resolved with Tailwind Plus references in hand, during the
actual template-building phases.
