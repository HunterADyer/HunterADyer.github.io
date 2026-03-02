# HunterADyer.com

Personal site and research blog. Built with [Astro](https://astro.build), deployed to [GitHub Pages](https://pages.github.com/).

## Quick Start

```bash
npm install
npm run dev          # localhost:4321
npm run build        # static site → dist/
npm run preview      # preview build locally
```

## Updating Content

### Resume

Resume data is parsed from a LaTeX `.tex` file. Source of truth is the `resume` repo cloned alongside this one.

```bash
# Clone the resume repo next to this project (if not already)
cd .. && git clone git@github.com:HunterADyer/resume.git

# Parse .tex → YAML (generates src/content/resume/*.yaml)
npm run resume

# Or specify a custom path
node scripts/parse-resume.mjs /path/to/resume.tex
```

The parser extracts experience, education, skills, and publications from the `.tex` file. Commit the generated YAML files after running.

### Projects

Projects are auto-generated from your GitHub repos.

```bash
# Public repos only
npm run projects

# Include private repos (create a token at github.com/settings/tokens)
GITHUB_TOKEN=ghp_xxx npm run projects
```

This creates MDX files in `src/content/projects/`. The website repo and resume repo are excluded automatically.

If you've already written a custom writeup for a project, re-running the sync will **preserve your writeup content** and only update the frontmatter (name, description, tags, status).

To add a custom writeup, edit the generated `.mdx` file below the `---` frontmatter block.

### Blog Posts

Create `.mdx` files in the appropriate category folder:

```
src/content/blog/professional/my-post.mdx
src/content/blog/personal/my-post.mdx
src/content/blog/random/my-post.mdx
```

Frontmatter:

```yaml
---
title: "Post Title"
description: "Short summary for cards and SEO."
pubDate: 2026-03-01
category: professional   # professional | personal | random
tags:
  - reverse-engineering
  - machine-learning
draft: false              # true to hide from build
---
```

Optional fields: `heroImage`, `githubRepo`, `series`, `seriesOrder`, `updatedDate`, `unlisted`.

## Deployment

Push to `main` triggers GitHub Actions (`.github/workflows/deploy.yml`):

1. `npm ci`
2. `npm run build`
3. Deploy `dist/` to GitHub Pages

No secrets needed — resume and project data are committed to the repo.

## Directory Layout

```
src/
├── content/
│   ├── blog/{professional,personal,random}/*.mdx
│   ├── projects/*.mdx          # auto-generated via npm run projects
│   └── resume/*.yaml           # auto-generated via npm run resume
├── layouts/
│   ├── BaseLayout.astro        # <html>, ViewTransitions, SEO
│   ├── LandingLayout.astro     # Nav + Footer wrapper
│   └── BlogPostLayout.astro    # Post page with ToC, tags, prose
├── components/
│   ├── global/                 # Nav, Footer
│   ├── landing/                # Hero, FeaturedProjects, ProjectCard, SocialLinks
│   ├── blog/                   # CategoryTabs, PostCard, PostList, TagCloud, ToC
│   └── resume/                 # Timeline.tsx, TraditionalResume, ViewToggle
├── pages/                      # File-based routing
├── styles/
│   ├── global.css              # Reset, tokens, base
│   ├── landing.css             # Theme variables & components
│   └── code.css                # Code block overrides
├── lib/utils.ts                # formatDate, readingTime, slugify, getUniqueTags
scripts/
├── parse-resume.mjs            # LaTeX → YAML
└── sync-projects.mjs           # GitHub API → MDX
```

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | Astro 5 (static) |
| Content | MDX |
| Interactivity | React 19 islands |
| Syntax highlighting | Expressive Code + Shiki |
| Styling | Vanilla CSS, red accent (`#dc2626`) |
| Fonts | Inter + JetBrains Mono (self-hosted) |
| Deploy | GitHub Actions → GitHub Pages |
