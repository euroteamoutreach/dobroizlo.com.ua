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

### Distributor Portal Link

Now that ComixDistro is live, the Hugo site SHOULD include a "Для
дистриб'юторів" link (footer or nav) pointing to
`https://app.dobroizlo.com.ua`. This is a minor template change — see
Post-Launch in `ROADMAP.md`. Can be added during Phase 8 polish or
post-launch.

### Book Request Form → ComixDistro API (Planned)

ComixDistro Phase 12 (`11-individual-book-requests.md`) specifies a public
JSON API that will replace the Hugo site's Netlify Form for book requests.
This integration is **not yet built** on the ComixDistro side, but the Hugo
form design should anticipate it.

**API endpoint:** `POST https://app.dobroizlo.com.ua/api/v1/book_requests`

**Key constraints:**

- **CORS:** The Rails API will allow requests only from `dobroizlo.com.ua`
  and `www.dobroizlo.com.ua`. Netlify preview URLs will be rejected.
- **Honeypot:** The Hugo form must include a hidden honeypot field matching
  the API's expectation. Submissions with the honeypot populated are
  silently discarded.
- **Spam protection:** Server-side rate limiting at 5 requests/hour per IP
  via Rack::Attack.
- **Payload:** JSON with fields: `first_name`, `last_name`, `email`,
  `phone`, `city`, `address`, `nova_poshta_depot`.
- **Responses:** `201 Created` (success) or `422 Unprocessable Entity`
  (validation errors with detail).

**Success message change:** The current thank-you page is a simple redirect.
With the API integration, the confirmation must explain: "You will receive
your book after registering for Bible First Online and completing Lesson 1."
This is a product requirement from the ComixDistro PRD.

**Implementation approach:** Replace the Netlify Form `action` with an
Alpine.js `fetch()` call to the API endpoint. Alpine.js is already in the
stack for client-side validation, so this is a natural extension. The
Netlify Form can remain as a fallback during the transition or be removed
entirely.

**Timeline:** Blocked on ComixDistro Phase 12 (API not yet built). The Hugo
site launches with Netlify Forms (Phase 7 as currently spec'd). The API
switchover happens post-launch when ComixDistro Phase 12 ships.

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
  month. This is likely sufficient for a Ukrainian-language niche site, but
  if the book request form generates unexpected volume, the limit could be
  reached. **Mitigation:** Monitor submission counts; upgrade to Netlify
  Pro ($19/month for 1000 submissions) if needed. Long-term, the book
  request form will migrate to the ComixDistro API (see §"Book Request
  Form → ComixDistro API" above), which eliminates this limit for book
  requests — only the contact form would remain on Netlify Forms.
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
