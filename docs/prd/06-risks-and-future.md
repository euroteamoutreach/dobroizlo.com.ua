# Risks & Future Considerations

---

## ComixDistro Integration

The static site and the ComixDistro Rails app will eventually share the
`dobroizlo.com.ua` domain:

| Property | URL |
|----------|-----|
| Hugo site (public-facing) | `dobroizlo.com.ua` |
| ComixDistro (distributor portal) | `app.dobroizlo.com.ua` |

**Current impact on the Hugo rebuild:** None. The two properties are
completely independent at the DNS level. The Hugo site does not need to know
about ComixDistro during development or at launch.

**Future consideration:** Once ComixDistro is live, the static site could
link to the distributor portal (e.g., a "For Distributors" link in the
footer or nav). This is a minor template change and doesn't affect
architecture.

**Potential future integration — automated stock toggle:** If ComixDistro
tracks book inventory, the out-of-stock toggle could theoretically be
automated (e.g., a webhook from ComixDistro triggers a Netlify rebuild with
an updated parameter, or a client-side API call checks stock status). This
is speculative and not planned — the manual `hugo.toml` toggle is the
current solution.

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
  Pro ($19/month for 1000 submissions) if needed.
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
