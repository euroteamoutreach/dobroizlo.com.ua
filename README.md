# dobroizlo.com.ua

Ukrainian-language marketing site for the *Good and Evil* (Добро і зло) Bible
comic book, rebuilt with Hugo.

**Live site:** [dobroizlo.com.ua](https://dobroizlo.com.ua)

## Tech Stack

- [Hugo](https://gohugo.io/) — static site generator
- [Tailwind CSS v4](https://tailwindcss.com/) — utility-first CSS
- [Alpine.js](https://alpinejs.dev/) — lightweight JS for interactivity
- [Netlify](https://www.netlify.com/) — hosting and form handling

## Build Commands

```bash
# Install dependencies
npm install

# Development server (with drafts)
hugo server -D

# Production build
hugo --gc --minify
```

## Project Structure

```text
content/          # Markdown content files
layouts/          # Hugo templates
assets/           # CSS, inline SVGs (processed by Hugo Pipes)
static/           # Images, fonts, other static files
docs/prd/         # Product requirements documentation
```

## Documentation

Detailed specs live in `docs/prd/`. Start with
[00-overview.md](docs/prd/00-overview.md) for project goals and philosophy, and
see [ROADMAP.md](docs/prd/ROADMAP.md) for the build plan.

## License

All rights reserved. Content and design are proprietary to
[Euro Team Outreach, Inc.](https://euroteamoutreach.org/)
