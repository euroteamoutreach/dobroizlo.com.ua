# Debrief — Repo Migration & Post-Launch Housekeeping

- **Date:** 2026-06-23
- **Scope:** Post-launch infrastructure — migrate the live marketing-site repo to the `euroteamoutreach` org, make it public, deploy free on Netlify, and restore project conventions on the fresh repo (ROADMAP Phase 10 / Post-Launch)
- **PRs:** `euroteamoutreach/dobroizlo.com.ua#1` (README refresh); `euroteamoutreach/comix_distro#749` (launch-runbook Phase E)
- **Issues:** Closed `joshukraine/dobroizlo.com.ua#50` and `euroteamoutreach/comix_distro#738`; ticked `comix_distro#707` §5
- **PRD refs:** `ROADMAP.md` "Phase 10: Launch"; `CHANGELOG.md` (2026-06-23 Pivot entry)

## Summary

Resolved the last load-bearing piece of the launch: the live marketing-site repo, stranded in a temporary private "bridge" on a personal account, was migrated to a **public, org-owned `euroteamoutreach/dobroizlo.com.ua`** that deploys free on Netlify. Because licensed Tailwind Plus snippets survived an earlier history rewrite as dangling-but-fetchable commits, the move was done as a **fresh-repo rebuild** — pushing a fresh clone's cleaned `main` into a brand-new repo, which carries only reachable objects and therefore none of the three bad commits. Executed with **zero downtime** (the Netlify site was relinked, not recreated; DNS/SSL/env untouched). The fresh repo was then brought up to convention, and all related docs/issues were synced and closed.

## Key decisions

- **Fresh-repo rebuild over scrubbing.** `git push` only sends reachable objects and a fresh clone never fetches dangling ones — sidesteps GitHub Support GC entirely. Rejected: GC ticket (policy would decline non-credential data), private-transfer + Netlify Pro (~$240/yr and carries the bad commits).
- **Zero-downtime relink.** Same `dobro-i-zlo` Netlify site, swapped only the connected repo; last good build kept serving until the new one went green. No DNS changes.
- **Branch protection requires `Hugo Build` + `Markdown Lint`** (GitHub Actions; run on push *and* PR), not the Netlify deploy-preview check (PR-only — requiring it would have frozen merges). `enforce_admins=false` so the owner can hotfix-push; force-push/deletion blocked.
- **Replace, don't deprecate** on labels — deleted GitHub defaults, installed `feat/fix/chore/docs/test` + triage taxonomy.
- Squash-only merges + auto-delete-branch; metadata set (homepage, topics, wiki off, **Projects kept on** at Josh's request).
- Historical debrief files left intact (older Hugo version numbers are accurate history).

## Verification status

- `hugo --gc --minify` — pass (355 ms local; green in CI on PR #1 and main pushes).
- `npm run lint` — markdownlint 0 errors (30 files); Prettier all-clean.
- Migration safety: clean history confirmed; 3 dangling SHAs return "No commit found" on the new repo while resolving on the old bridge (control); live site apex + all preserved URLs 200, redirects + 404 correct.
- Branch protection observed end-to-end on PR #1 (BLOCKED → CLEAN; squash-merge + auto-delete).

## Follow-ups

- **Optional:** add lightweight uptime / synthetic monitoring for the live site (currently manual verification only). Flagged as a deliberate choice, not a blocker.
- No other open threads — migration, housekeeping, and doc sync are complete; both apps live and cleared to advertise.
