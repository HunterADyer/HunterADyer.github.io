# HunterADyer.com

Personal site and research blog for Hunter A. Dyer — Security Researcher & Reverse Engineer.

Built with [Astro](https://astro.build), deployed to [GitHub Pages](https://pages.github.com/).

## Quick Start

```bash
npm install        # install dependencies
npm run dev        # start dev server at localhost:4321
npm run build      # build static site to dist/
npm run preview    # preview production build locally
```

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | Astro 5.x (static output) |
| Content | MDX via `@astrojs/mdx` |
| Interactivity | React 19 islands via `@astrojs/react` |
| Syntax highlighting | Expressive Code + Shiki (github-light / tokyo-night) |
| Styling | Vanilla CSS with custom properties & CSS layers |
| Fonts | Inter (landing) + JetBrains Mono (blog/hacker), self-hosted WOFF2 |
| Deployment | GitHub Actions → GitHub Pages |

## Site Structure

```
/                           Landing page (light theme)
/blog/                      All posts (dark hacker theme)
/blog/professional/         Professional research posts
/blog/personal/             Personal interest posts
/blog/random/               Random thoughts
/blog/{category}/{slug}/    Individual post
/blog/tags/{tag}/           Posts filtered by tag
/projects/                  Project gallery (hacker theme)
/resume/                    Resume with timeline/traditional toggle (light theme)
/rss.xml                    RSS feed
```

## Dual Theme System

The site uses two visual themes that crossfade via Astro View Transitions:

- **Landing** (`data-theme="landing"`): Clean white background, Inter font, blue accent (`#2563eb`). Used on `/` and `/resume/`.
- **Hacker** (`data-theme="hacker"`): Dark terminal aesthetic, JetBrains Mono, green accent (`#00ff88`), scanline + CRT vignette overlays. Used on `/blog/*` and `/projects/`.

Theme variables are defined in `src/styles/landing.css` and `src/styles/hacker.css`. Both sets of variables share the same names (`--color-bg`, `--color-accent`, etc.), so all components work in either theme context.

## Directory Layout

```
src/
├── content/                    # Content collections
│   ├── config.ts               # Zod schemas for all collections
│   ├── blog/
│   │   ├── professional/*.mdx  # Professional research posts
│   │   ├── personal/*.mdx      # Personal interest posts
│   │   └── random/*.mdx        # Random thoughts
│   ├── projects/*.yaml         # Project metadata
│   └── resume/                 # Resume data
│       ├── experience.yaml
│       ├── education.yaml
│       ├── skills.yaml
│       └── publications.yaml
├── layouts/
│   ├── BaseLayout.astro        # Root <html>, ViewTransitions, SEO, fonts
│   ├── LandingLayout.astro     # data-theme="landing" + scroll reveals
│   ├── HackerLayout.astro      # data-theme="hacker" + scanlines
│   └── BlogPostLayout.astro    # Post: ToC, tags, GitHub link, prose styles
├── components/
│   ├── global/                 # Nav.astro, Footer.astro
│   ├── landing/                # Hero, FeaturedProjects, ProjectCard, SocialLinks
│   ├── blog/                   # CategoryTabs, PostCard, PostList, TagCloud, ToC
│   ├── resume/                 # Timeline.tsx, TimelineEntry.tsx, ViewToggle
│   └── interactive/            # CodePlayground, D3Visualization, GistEmbed, NotebookEmbed
├── pages/                      # File-based routing
├── styles/
│   ├── global.css              # Reset, layers, tokens, base styles
│   ├── landing.css             # Light theme variables & components
│   ├── hacker.css              # Dark theme variables & effects
│   └── code.css                # Code block / Shiki overrides
└── lib/
    └── utils.ts                # formatDate, readingTime, slugify, getUniqueTags
```

## Writing Blog Posts

Create a new `.mdx` file in the appropriate category folder:

```
src/content/blog/professional/my-new-post.mdx
src/content/blog/personal/my-new-post.mdx
src/content/blog/random/my-new-post.mdx
```

### Frontmatter

```yaml
---
title: "Post Title"
description: "A short description for previews and SEO."
pubDate: 2026-03-01
category: professional          # professional | personal | random
tags:
  - machine-learning
  - reverse-engineering
heroImage: /images/hero.png     # optional
githubRepo: https://github.com/user/repo  # optional, shows repo link
series: "Series Name"           # optional, for multi-part posts
seriesOrder: 1                  # optional
draft: false                    # set true to hide from build
---
```

### Required fields

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Post title |
| `description` | string | Short summary for cards and SEO |
| `pubDate` | date | Publication date (YYYY-MM-DD) |
| `category` | enum | `professional`, `personal`, or `random` |

### Optional fields

| Field | Type | Description |
|-------|------|-------------|
| `tags` | string[] | Tags for filtering (default: `[]`) |
| `heroImage` | string | Path to hero image |
| `githubRepo` | URL | Associated GitHub repository |
| `series` | string | Series name for multi-part posts |
| `seriesOrder` | number | Position within a series |
| `updatedDate` | date | Last update date |
| `draft` | boolean | `true` excludes from build (default: `false`) |

### Using Interactive Components in MDX

Import and use React islands or Astro components directly in MDX:

```mdx
---
title: "Interactive Demo"
# ... frontmatter
---

import CodePlayground from '../../components/interactive/CodePlayground';

## Try It Yourself

<CodePlayground
  client:visible
  initialCode={`const x = 42;\nconsole.log(x * 2);`}
  language="javascript"
  title="Quick Example"
/>
```

## Adding Projects

Create a YAML file in `src/content/projects/`:

```yaml
# src/content/projects/my-project.yaml
name: Project Name
tagline: One-line description
description: >-
  Longer description of the project, what it does,
  and why it matters.
status: active                # active | completed | archived | planned
githubUrl: https://github.com/user/repo  # optional
tags:
  - machine-learning
  - security
featured: true                # shows on landing page
sortOrder: 1                  # display order (lower = first)
```

### Project fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | yes | Project name |
| `tagline` | string | yes | Short one-liner |
| `description` | string | yes | Detailed description |
| `status` | enum | yes | `active`, `completed`, `archived`, `planned` |
| `githubUrl` | URL | no | Link to repository |
| `image` | string | no | Project image path |
| `tags` | string[] | no | Technology tags |
| `featured` | boolean | no | Show on landing page (default: `false`) |
| `sortOrder` | number | no | Display order (default: `0`) |

## Updating Resume Data

Edit the YAML files in `src/content/resume/`:

### experience.yaml

```yaml
items:
  - title: Job Title
    company: Company Name
    location: City, ST
    startDate: "2024-01"
    endDate: present            # or "2025-06"
    description: What you did there.
    highlights:
      - Achievement one
      - Achievement two
```

### education.yaml

```yaml
items:
  - degree: B.S. Computer Science
    institution: University Name
    location: City, ST
    startDate: "2018-08"
    endDate: "2022-05"
    description: Focus areas and research.
    highlights:
      - Notable coursework or accomplishments
```

### skills.yaml

```yaml
items:
  - category: Languages
    skills: [Python, C/C++, Rust]
  - category: ML/AI
    skills: [PyTorch, Transformers]
```

### publications.yaml

```yaml
items:
  - title: "Paper Title"
    venue: Conference Name
    year: 2026
    authors: [Hunter A. Dyer]
    description: Brief summary.
    status: published           # or in-preparation
```

## Interactive Components

### CodePlayground

In-browser JavaScript editor with execution. React island, hydrated on scroll.

```mdx
<CodePlayground
  client:visible
  initialCode={`console.log("hello");`}
  language="javascript"
  title="Demo"
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialCode` | string | `'// Write your code here...'` | Starting code |
| `language` | string | `'javascript'` | Language label (only JS is executable) |
| `title` | string | `'Code Playground'` | Header title |

### D3Visualization

Generic SVG chart container for D3.js visualizations. React island.

```tsx
<D3Visualization
  client:only="react"
  width={600}
  height={400}
  title="My Chart"
  renderChart={(svg, w, h) => {
    // D3 code here — svg is the raw SVGSVGElement
  }}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | number | `600` | SVG width |
| `height` | number | `400` | SVG height |
| `title` | string | `'Visualization'` | Header title |
| `renderChart` | function | required | `(svg, width, height) => void` |

### GistEmbed

Embeds a GitHub Gist.

```astro
<GistEmbed id="username/gist-id" file="specific-file.py" />
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `id` | string | yes | `username/gist-id` |
| `file` | string | no | Specific file from the gist |

### NotebookEmbed

Embeds pre-rendered Jupyter notebook HTML via iframe.

```astro
<NotebookEmbed src="/notebooks/analysis.html" title="Training Analysis" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | string | required | URL or path to notebook HTML |
| `title` | string | `'Notebook'` | Display title |

## CSS Custom Properties

Both themes define the same variable names, enabling theme-agnostic components:

| Variable | Landing | Hacker |
|----------|---------|--------|
| `--color-bg` | `#ffffff` | `#0a0e14` |
| `--color-surface` | `#f8fafc` | `#111820` |
| `--color-text` | `#334155` | `#b0bec5` |
| `--color-heading` | `#0f172a` | `#e0e6ed` |
| `--color-accent` | `#2563eb` | `#00ff88` |
| `--color-muted` | `#94a3b8` | `#546e7a` |
| `--color-border` | `#e2e8f0` | `#1e2a3a` |
| `--font-family` | Inter | JetBrains Mono |

Additional shared variables: `--space-{xs,sm,md,lg,xl,2xl,3xl}`, `--radius-{sm,md,lg}`, `--transition-{fast,base,slow}`, `--max-width`, `--content-width`, `--nav-height`.

## Deployment

### Automatic (GitHub Actions)

Push to `main` triggers the workflow in `.github/workflows/deploy.yml`:

1. Checks out code
2. Installs dependencies (`npm ci`)
3. Builds static site (`npm run build`)
4. Deploys `dist/` to GitHub Pages

### Setup Steps

1. Create a GitHub repo and push this project
2. Go to repo **Settings** → **Pages** → **Source**: select **GitHub Actions**
3. Configure DNS:
   - **A records** pointing to GitHub Pages IPs: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Or a **CNAME** record pointing to `<username>.github.io`
4. Push to `main` — the site deploys automatically

The `public/CNAME` file is set to `hunteradyer.com`.

## Utility Functions

Available in `src/lib/utils.ts`:

```typescript
formatDate(date: Date): string
// "February 28, 2026"

formatDateShort(date: Date): string
// "Feb 28, 2026"

readingTime(content: string): string
// "5 min read" (based on 200 wpm)

slugify(text: string): string
// "My Post Title" → "my-post-title"

getUniqueTags(posts): string[]
// Returns sorted, deduplicated array of all tags
```
