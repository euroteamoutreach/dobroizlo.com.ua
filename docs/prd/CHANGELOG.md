# PRD Changelog

This file tracks material deviations from the PRD discovered during implementation. It is the record of the "never silently deviate" rule.

## Format

Each entry records one deviation or decision:

```text
### YYYY-MM-DD — [file changed]

**What changed:** One-sentence description of the change.

**Why:** The rationale — what was wrong, what was discovered, or what prompted the pivot.

**Category:** Correction | Discovery | Pivot
```

**Categories:**

- **Correction** — The PRD was wrong or inconsistent.
- **Discovery** — Implementation revealed something the PRD didn't anticipate.
- **Pivot** — A deliberate decision to change direction.

## Guidelines

- **Newest entries first** — add new entries at the top of the Entries section.
- Log when the PR is created, not after it's merged.
- The "why" is required — a change without rationale is not useful.
- Skip typo fixes and formatting corrections.
- At natural breakpoints (end of a phase, or 10+ accumulated entries), fold changes back into the PRD files themselves during a sync session.

---

## Entries

### 2026-02-24 — `06-risks-and-future.md`, `ROADMAP.md`

**What changed:** Expanded ComixDistro Integration section to document the planned book request form API integration (ComixDistro Phase 12), updated ComixDistro status to "deployed", added distributor portal link URL and API switchover to post-launch roadmap, cross-referenced Netlify Forms volume risk with the long-term API migration.

**Why:** ComixDistro has progressed through deployment and into operational polish. Its PRD now specifies a public JSON API for individual book requests that will replace the Hugo site's Netlify Form. Documenting this integration now ensures the Phase 7 form design anticipates the future switchover.

**Category:** Discovery
