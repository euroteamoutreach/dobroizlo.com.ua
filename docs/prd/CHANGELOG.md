# PRD Changelog

Log of material changes to the PRD after initial approval.

---

## 2026-02-24: ComixDistro cross-project alignment

**Files changed:** `06-risks-and-future.md`, `ROADMAP.md`

**What changed:**

- Expanded the ComixDistro Integration section in `06-risks-and-future.md` to document the planned book request form API integration (ComixDistro Phase 12). Added API endpoint, CORS constraints, payload format, honeypot requirement, and success message change.
- Updated the ComixDistro status from "future" to "deployed" — the app is live at `app.dobroizlo.com.ua`.
- Added distributor portal link detail to `ROADMAP.md` post-launch (target URL, note that it can be done in Phase 8).
- Added post-launch item for the Netlify Forms → ComixDistro API switchover.
- Cross-referenced the Netlify Forms volume risk with the long-term API migration path.

**Why:** ComixDistro has progressed through deployment and into operational polish (Phase 7). Its PRD now specifies a public API for individual book requests that will replace the Hugo site's Netlify Form. Documenting this planned integration now ensures the Phase 7 book request form design anticipates the future switchover.

**Impact on current work:** None. All current phases (1-7) proceed as originally spec'd. The API integration is a post-launch task blocked on ComixDistro Phase 12.
