# Netlify Setup Guide

Step-by-step instructions for deploying the Hugo site to Netlify with a
preview URL. This completes the final Phase 1 checklist item.

---

## Prerequisites

- A Netlify account (free tier is sufficient)
- The repo is pushed to GitHub at
  `https://github.com/joshukraine/dobroizlo.com.ua-hugo`

---

## Step 1: Create a New Site on Netlify

1. Log in to [app.netlify.com](https://app.netlify.com)
2. Click **"Add new site"** > **"Import an existing project"**
3. Choose **GitHub** as the Git provider
4. Authorize Netlify to access your GitHub account (if not already authorized)
5. Search for and select the **`dobroizlo.com.ua-hugo`** repository

---

## Step 2: Configure Build Settings

Netlify should auto-detect settings from `netlify.toml`, but verify these
values on the configuration screen:

| Setting | Value |
|---------|-------|
| Branch to deploy | `main` |
| Build command | `npm install && hugo --gc --minify` |
| Publish directory | `public` |

You should **not** need to set environment variables manually — they're
defined in `netlify.toml`:

- `HUGO_VERSION = "0.155.3"`
- `HUGO_ENV = "production"`
- `NODE_VERSION = "22"`

Click **"Deploy site"** to start the first build.

---

## Step 3: Verify the Build

1. Netlify will assign a random subdomain like
   `random-name-12345.netlify.app`
2. Watch the deploy log — it should show:
   - `npm install` completing successfully
   - Hugo building with output like `Total in XXX ms`
   - Deploy finishing with "Published"
3. Visit the preview URL to confirm the site loads

**What you should see:** The minimal homepage with "Добро і зло" heading,
styled with Tailwind CSS. There's no nav or footer yet — that's Phase 3.

---

## Step 4: Rename the Site (Optional but Recommended)

The random subdomain is hard to remember. To set a friendlier name:

1. Go to **Site configuration** > **Site information** > **Change site name**
2. Set it to something like `dobroizlo-hugo-preview`
3. Your preview URL becomes: `dobroizlo-hugo-preview.netlify.app`

---

## Step 5: Verify Deploy Previews Work

Netlify automatically builds deploy previews for pull requests. To confirm:

1. The `netlify.toml` already has a `[context.deploy-preview]` section that
   uses `$DEPLOY_PRIME_URL` as the base URL
2. When you open a PR on GitHub, Netlify will post a comment with a unique
   preview URL for that PR
3. This is useful for reviewing changes before merging

---

## What NOT to Do Yet

- **Don't set up a custom domain** — the `dobroizlo.com.ua` domain stays
  pointed at Amazon/CloudFront until the site is ready for launch (Phase 9)
- **Don't configure forms** — Netlify Forms are set up when we build the
  contact and book request pages (Phases 6-7)
- **Don't enable analytics** — that's a post-launch task

---

## Troubleshooting

### Build fails with "Hugo not found"

Netlify should install Hugo automatically based on the `HUGO_VERSION`
environment variable in `netlify.toml`. If it doesn't:

1. Go to **Site configuration** > **Environment variables**
2. Add `HUGO_VERSION` = `0.155.3`

### Build fails with "extended version required"

Netlify provides the Hugo extended version by default when you set
`HUGO_VERSION`. No extra configuration needed.

### Build succeeds but site looks unstyled

This likely means Tailwind CSS didn't process correctly. Check the build log
for errors from `@tailwindcss/cli`. Ensure `package.json` and
`node_modules` dependencies are correct.

---

## After Setup

Once Netlify is deployed and the preview URL works, check off the final
Phase 1 item in `docs/prd/ROADMAP.md`:

```text
- [x] Deploy to Netlify (preview URL) and verify build succeeds
```

Then Phase 1 is complete and we can move on to Phase 2: Image Migration &
Static Assets.
