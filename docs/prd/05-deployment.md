# Deployment & Source Control

---

## Development Repository

**Decision:** Develop the Hugo site in a **new, separate repository** under
the Euro Team Outreach GitHub organization.

**Rationale:**

- Keeps the existing Nuxt site intact and deployable throughout development
- Provides a clean Git history for the Hugo project
- Avoids branch confusion and merge complexity
- The existing repo remains available as a reference

**Recommended approach:**

1. **During development:** Create a new repo under `euroteamoutreach`
   (e.g., `dobroizlo-hugo` or similar) for all Hugo development work
2. **At launch:** When the Hugo site is ready to go live:
   - Archive or rename the old Nuxt repo
   - Rename the Hugo repo to `dobroizlo.com.ua` (or push to a fresh repo
     with that name)
   - Update Netlify to build from the new repo
3. **Post-launch:** The old repo remains archived as a historical reference

---

## `.gitignore`

```text
# Hugo build output
public/
resources/_gen/

# Node modules
node_modules/

# Hugo stats (regenerated on build)
hugo_stats.json

# OS files
.DS_Store
Thumbs.db

# Environment files
.env
```

---

## Netlify Configuration (`netlify.toml`)

```toml
[build]
  publish = "public"
  command = "npm install && hugo --gc --minify"

[build.environment]
  HUGO_VERSION = "0.145.0"
  HUGO_ENV = "production"
  NODE_VERSION = "22"

[context.deploy-preview]
  command = "npm install && hugo --gc --minify --buildFuture -b $DEPLOY_PRIME_URL"

[context.deploy-preview.environment]
  HUGO_VERSION = "0.145.0"

[context.branch-deploy]
  command = "npm install && hugo --gc --minify -b $DEPLOY_PRIME_URL"

[context.branch-deploy.environment]
  HUGO_VERSION = "0.145.0"

# Security headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

**Note:** The Hugo version should be pinned to whatever is current at the
time of project scaffolding. The value above is a placeholder.

---

## Domain & DNS

**Current state:**

- Site hosted on AWS S3 + CloudFront
- Domain: `dobroizlo.com.ua`

**Migration plan:**

1. Build and test the Hugo site on Netlify (using a Netlify preview URL
   or temporary subdomain)
2. When ready to go live, update DNS records to point `dobroizlo.com.ua`
   to Netlify
3. Netlify handles SSL certificate provisioning automatically
4. Verify the site is accessible and all forms work

**Future subdomain:** When ComixDistro is ready for deployment,
`app.dobroizlo.com.ua` will be configured to point to the Rails app's
hosting (Fly.io). This is a separate DNS record and does not affect the
static site.

---

## CI: GitHub Actions

**Decision:** Set up a GitHub Actions workflow for build verification,
consistent with OFReport.com.

**Workflow checks:**

1. **Hugo build** — `hugo --gc --minify` succeeds with zero warnings
2. **Markdown lint** — all markdown files pass linting (if applicable)

**Configuration:** A `.github/workflows/ci.yml` file that runs on every
push and pull request.

---

## Build Performance

Hugo builds are near-instant for a 5-page site. Expected build time:
well under 1 second for Hugo itself, plus a few seconds for Tailwind CSS
processing via npm.
