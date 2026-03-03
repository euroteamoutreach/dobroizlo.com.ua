# Risks & Future Considerations

---

## ComixDistro Integration

The static site and the ComixDistro Rails app share the `dobroizlo.com.ua`
domain:

| Property | URL | Host |
|----------|-----|------|
| Hugo site (public-facing) | `dobroizlo.com.ua` | Netlify |
| ComixDistro (distributor portal) | `app.dobroizlo.com.ua` | Fly.io |

DNS is managed in AWS Route 53 (Namecheap is registrar only).

**Current status (Feb 2026):** ComixDistro is deployed and operational at
`app.dobroizlo.com.ua`. The two properties are independent at the DNS level.
The Hugo rebuild does not depend on ComixDistro for any current phase.

### Distributor Portal Link (Complete)

The Hugo site includes a "Дистриб'юторам" page (`/dystrybutoram/`) with a
CTA linking to `https://app.dobroizlo.com.ua`, plus a navigation menu item.
Implemented in Phase 9.

### Book Request Form → ComixDistro API (Complete)

The book request form now submits directly to the ComixDistro Rails API via
an Alpine.js `fetch()` call, replacing the original Netlify Forms submission.

**API endpoint:** `POST https://app.dobroizlo.com.ua/api/v1/book_requests`
(configurable via `bookRequestApiUrl` in `hugo.toml`).

**Key details:**

- **CORS:** The Rails API allows requests from `dobroizlo.com.ua` and
  `dobro-i-zlo.netlify.app`. Netlify deploy preview URLs are CORS-blocked.
- **Honeypot:** Hidden `website_url` field (offscreen-positioned).
  Submissions with the honeypot populated are silently discarded server-side.
- **Spam protection:** Server-side rate limiting at 5 requests/hour per IP
  via Rack::Attack.
- **Payload:** JSON `book_request` object with fields: `first_name`,
  `last_name`, `email`, `phone`, `city`, `address`, `nova_poshta_depot`,
  `region`, `oblast`, `postal_code`, `preferred_study_format`, `referral`,
  `comments`, `website_url`.
- **Responses:** `201 Created` (success) or `422 Unprocessable Entity`
  (validation errors with field-level detail).
- **Success UX:** Inline success message replaces the form (no redirect).
- **Validation:** Client-side requires at least one of email or phone,
  plus all address fields. Server-side errors are displayed per-field.

→ See ComixDistro PRD `11-individual-book-requests.md` for the full API
spec and integration guide.

### Automated Stock Toggle (Speculative)

If ComixDistro tracks book inventory, the out-of-stock toggle could
theoretically be automated (e.g., a webhook from ComixDistro triggers a
Netlify rebuild with an updated parameter, or a client-side API call checks
stock status). This is speculative and not planned — the manual `hugo.toml`
toggle is the current solution.

---

## Out of Stock Toggle — Future Improvements

The current implementation (a `bookFormEnabled` parameter in `hugo.toml`)
is already a significant improvement over the Nuxt site's hardcoded
`formDisabled: true` in component data. Possible future enhancements:

1. **Custom out-of-stock page design.** Rather than a simple notice, the
   disabled state could include a "notify me when available" email signup
   (a separate, minimal Netlify form).
2. **Scheduled re-enable.** If stock arrival dates are known, a content
   note could say "We expect new stock in [month]."
3. **API-driven toggle.** As noted above, ComixDistro could drive this
   automatically.

For now, the `hugo.toml` parameter approach is the right balance of
simplicity and functionality.

---

## Known Risks

### Low Risk

- **Font loading.** Google Fonts dependency means a third-party request.
  If Google Fonts ever has issues, text falls back to system fonts. Could
  self-host fonts later if desired.
- **Alpine.js CDN.** Loading Alpine from jsDelivr CDN introduces a
  third-party dependency. Could be vendored (downloaded and served locally)
  if CDN reliability becomes a concern.
- **CloudFront PDF.** The "What we believe" PDF depends on the existing
  CloudFront distribution. If that distribution is ever decommissioned,
  the PDF needs to move (trivial — copy to `static/` or another host).

### Medium Risk

- **Netlify Forms limits.** The free tier allows 100 form submissions per
  month. Now that the book request form submits to the ComixDistro API
  (see §"Book Request Form → ComixDistro API" above), only the contact
  form uses Netlify Forms. The 100/month limit is unlikely to be reached
  for contact-only submissions.
- **Domain transfer logistics.** Switching DNS from AWS CloudFront to
  Netlify requires careful timing to minimize downtime. **Mitigation:**
  Lower DNS TTL in advance; test thoroughly on Netlify preview URL before
  switching.

### Not a Risk

- **SEO impact.** URLs are preserved exactly, so there should be zero
  negative SEO effect from the migration. The site may actually benefit
  from faster load times (static HTML vs. client-rendered Nuxt).

---

## Explicitly Out of Scope

These items are not part of the Hugo rebuild and should not be considered
during development:

- **CMS or admin interface.** Content changes happen via Git commits.
- **Multilingual support.** The site is Ukrainian-only.
- **Blog, articles, or news section.** This is a static landing page.
- **E-commerce or payment processing.** Books are free.
- **User accounts or authentication.** No login functionality.
- **A/B testing.** Not needed for this site's scale and purpose.
- **Automated testing (e2e, visual regression).** The site is too small
  to justify this overhead. Manual testing during development is sufficient.
- **ComixDistro development.** That's a separate project with its own repo,
  stack, and timeline.
