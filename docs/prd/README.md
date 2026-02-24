# dobroizlo.com.ua — Product Requirements Document

This directory contains the modular PRD for the dobroizlo.com.ua Hugo rebuild. Each file is a self-contained specification that can be referenced independently during implementation.

## How to Use This PRD

**For Claude Code / AI-assisted implementation:** Reference the specific PRD section relevant to your current task. Start here to find the right file, then consult the referenced section for requirements.

**For human reviewers:** Read `00-overview.md` for context, then dive into the feature spec that matters to you.

## File Index

| File | Contents | Consult When... |
| --- | --- | --- |
| `CHANGELOG.md` | Material deviations from the PRD discovered during implementation | Reviewing or recording a "never silently deviate" decision |
| `ROADMAP.md` | Implementation phases, progress tracking | Planning sprints, checking phase boundaries |
| `00-overview.md` | Vision, goals, related projects, development approach | Onboarding to the project, understanding goals |
| `01-architecture.md` | Technology decisions and rationale | Making infrastructure or tooling decisions |
| `02-design.md` | Color palette, fonts, section layout patterns | Building templates, choosing styles |
| `03-site-structure.md` | Content organization, URLs, Hugo configuration | Adding pages, configuring Hugo, URL questions |
| `04-templates.md` | Layout and template specifications for all pages | Building or modifying any template |
| `05-deployment.md` | Netlify config, DNS, CI/CD | Deployment setup, build configuration |
| `06-risks-and-future.md` | Risks, ComixDistro integration, out-of-scope items | Evaluating risk, planning future work |

## Conventions

- **"MUST", "SHALL", "REQUIRED"** — non-negotiable for MVP launch.
- **"SHOULD"** — expected for MVP unless a specific technical constraint prevents it.
- **"MAY"** — nice to have; implement if straightforward, otherwise defer.
- **"TBD"** — explicitly unresolved; document in an open items file with context and resolution guidance.
- **Cross-references** use the format `→ See 07-feature.md §3 "Section Heading"` to point to other PRD sections. Always include the filename and quoted heading.
