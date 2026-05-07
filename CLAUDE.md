# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # Production build → /dist
npm run preview   # Preview production build
npm run check     # Svelte + TypeScript type checking
```

Deployment is automatic via GitHub Actions (`.github/workflows/main.yml`) on push to `main` — builds and deploys to GitHub Pages at `https://samlee-dedeboy.github.io/portfolio/`.

## Architecture

**Svelte 4 + TypeScript + Vite SPA**, styled with Tailwind CSS and custom CSS variables. No SvelteKit, no router — single scrollable page. Base path is `/portfolio/` (configured in `vite.config.ts` for GitHub Pages).

### Structure

- `src/App.svelte` — root component, assembles all sections in order
- `src/lib/sections/` — full-page sections (`AboutMyself`, `MajorProjects`, `Education`, `JustTransition`, `COEQWAL`)
- `src/lib/components/` — reusable atoms (`ResearchProjectEntry`, `ExpandableProject`, `EducationEntry`)
- `src/theme_colors.css` — CSS custom properties for dark (default) and light mode themes
- `public/` — images and SVG icons referenced directly by components

### Content Management

All content is hardcoded in `.svelte` files — there is no CMS, data files, or backend. To add a publication or project, edit the relevant section component directly (`MajorProjects.svelte` for papers and side projects, `AboutMyself.svelte` for news/bio). Project images go in `public/`.

### Theming

Themes are defined in `src/theme_colors.css` as `[data-theme="name"]` blocks and switched via the `theme` store in `src/lib/theme.ts` (which sets `document.documentElement.dataset.theme`). Each theme defines exactly 5 variables plus `--bg-surface`:

- `--theme-color` — page background color (the defining color of the theme)
- `--pair-color` — accent / highlight (links, active states, toggler)
- `--text-1` / `--text-2` / `--text-3` — primary / secondary / muted text
- `--bg-surface` — card / panel background (slightly offset from `--theme-color`)

To add a theme: add a `[data-theme="name"]` block to `theme_colors.css`, add the name to `THEMES` and the `Theme` union in `theme.ts`.

Components use hardcoded Tailwind gray classes (`text-gray-500`, etc.) which are overridden per-theme in `app.css` via `[data-theme="dark"] .text-gray-500` rules. Avoid `@apply` with color utilities in scoped `<style>` blocks — use `var(--text-*)` directly instead.

### ExpandableProject pattern

`ExpandableProject.svelte` is a generic expandable card used to render detailed project pages (e.g., `JustTransition.svelte`, `COEQWAL.svelte`) via Svelte `<slot>`. The section components pass props and slot their detail content into it.

### Author highlight

`ResearchProjectEntry.svelte` bolds/highlights the string `"Sam Yu-Te Lee"` in gold among the authors array — keep this string exact when adding new publications.
