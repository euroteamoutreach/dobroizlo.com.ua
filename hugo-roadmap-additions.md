# dobroizlo.com.ua ROADMAP Additions

> **Instructions for Claude Code:** This document specifies changes to `docs/prd/ROADMAP.md`. Add a new Post-Launch section for the Distributor Network page, and update `docs/prd/03-site-structure.md` with the new content page entry.

---

## New Post-Launch item: Distributor Network Page

Add the following to the Post-Launch section:

```markdown
- [ ] Create "Become a Distributor" page (`content/dystrybutoram/_index.md`) with overview of the Distributor Network drawn from `docs/distributor-network-content.md` §A (condensed for marketing audience)
- [ ] Create `layouts/page/distributor.html` template with CTA button linking to `https://app.dobroizlo.com.ua`
- [ ] Add navigation link to the new page (secondary nav item, footer link, or both)
- [ ] Update `docs/prd/03-site-structure.md` with the new page in the content tree
```

**Context:** The static marketing site serves as the primary entry point for anyone discovering *Good and Evil*. Its main purpose is the individual book request flow, but it also serves as the gateway to the Distributor Network for visitors who want to get more involved. The new page provides a warm, inviting overview — what the network is, who it's for, how it works — without the detailed terms or obligations (those live in the ComixDistro app during onboarding). See `docs/distributor-network-content.md` §D "Content Placement" for the full rationale and content split between the two sites.

**Note:** This item can be combined with the existing post-launch item "Add distributor portal link → `https://app.dobroizlo.com.ua`" since the new page subsumes a simple link.
