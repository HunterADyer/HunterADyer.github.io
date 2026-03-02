#!/usr/bin/env node
/**
 * Fetches public repos from GitHub and generates project MDX files.
 * Preserves existing writeup content if the file already exists.
 *
 * Usage:
 *   node scripts/sync-projects.mjs
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const outDir = resolve(ROOT, 'src', 'content', 'projects');

const EXCLUDE = ['HunterADyer.github.io', 'resume'];

// Uses GITHUB_TOKEN env var for private repos, falls back to unauthenticated
const TOKEN = process.env.GITHUB_TOKEN;

async function fetchRepos() {
  const headers = { Accept: 'application/vnd.github+json' };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;

  // Use /user/repos (authenticated) if we have a token, otherwise /users/:user/repos
  const baseUrl = TOKEN
    ? 'https://api.github.com/user/repos?affiliation=owner&per_page=100&sort=updated'
    : 'https://api.github.com/users/HunterADyer/repos?per_page=100&sort=updated';

  const repos = [];
  let page = 1;
  while (true) {
    const res = await fetch(`${baseUrl}&page=${page}`, { headers });
    if (!res.ok) {
      console.error(`GitHub API error: ${res.status} ${res.statusText}`);
      if (!TOKEN) console.error('Hint: set GITHUB_TOKEN env var to access private repos');
      process.exit(1);
    }
    const batch = await res.json();
    if (batch.length === 0) break;
    repos.push(...batch);
    page++;
  }
  return repos.filter((r) => !r.fork && !EXCLUDE.includes(r.name));
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function inferTags(repo) {
  const tags = [];
  if (repo.language) tags.push(repo.language.toLowerCase());
  if (repo.topics?.length) tags.push(...repo.topics);
  return [...new Set(tags)].slice(0, 6);
}

function inferStatus(repo) {
  if (repo.archived) return 'archived';
  const lastPush = new Date(repo.pushed_at);
  const monthsAgo = (Date.now() - lastPush) / (1000 * 60 * 60 * 24 * 30);
  if (monthsAgo > 12) return 'completed';
  return 'active';
}

function buildFrontmatter(repo, sortOrder) {
  const tags = inferTags(repo);
  const tagYaml = tags.length
    ? '\ntags:\n' + tags.map((t) => `  - ${t}`).join('\n')
    : '\ntags: []';

  // Make the name human-readable (kebab-case → Title Case)
  const displayName = repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const desc = repo.description || '';

  return `---
name: "${displayName}"
tagline: "${desc || displayName}"
description: "${desc}"
status: ${inferStatus(repo)}
githubUrl: ${repo.html_url}${tagYaml}
featured: false
sortOrder: ${sortOrder}
---`;
}

function defaultBody(repo) {
  const lines = [`## ${repo.name}`];
  if (repo.description) lines.push('', repo.description);
  if (repo.language) lines.push('', `Primary language: **${repo.language}**`);
  return lines.join('\n') + '\n';
}

async function main() {
  const repos = await fetchRepos();
  console.log(`Found ${repos.length} repos (excluding ${EXCLUDE.join(', ')})`);

  let created = 0;
  let updated = 0;

  for (let i = 0; i < repos.length; i++) {
    const repo = repos[i];
    const slug = slugify(repo.name);
    const filePath = resolve(outDir, `${slug}.mdx`);

    const frontmatter = buildFrontmatter(repo, i + 1);

    if (existsSync(filePath)) {
      // Preserve existing body content, update frontmatter
      const existing = readFileSync(filePath, 'utf-8');
      const bodyMatch = existing.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
      const body = bodyMatch ? bodyMatch[1] : defaultBody(repo);
      writeFileSync(filePath, frontmatter + '\n' + body);
      updated++;
    } else {
      writeFileSync(filePath, frontmatter + '\n' + defaultBody(repo));
      created++;
    }
  }

  console.log(`  Created: ${created}, Updated: ${updated}`);
}

main();
