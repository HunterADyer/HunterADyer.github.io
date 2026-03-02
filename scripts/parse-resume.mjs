#!/usr/bin/env node
/**
 * Parses Hunter's LaTeX resume into YAML files for the Astro site.
 *
 * Usage:
 *   node scripts/parse-resume.mjs [path/to/resume.tex]
 *
 * Default path: ../resume/resume.tex (sibling repo)
 * Outputs into src/content/resume/*.yaml
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const texPath = process.argv[2] || resolve(ROOT, '..', 'resume', 'resume.tex');
const outDir = resolve(ROOT, 'src', 'content', 'resume');

let tex;
try {
  tex = readFileSync(texPath, 'utf-8');
} catch {
  console.error(`Could not read ${texPath}`);
  console.error('Provide the path as an argument or clone the resume repo next to this project.');
  process.exit(1);
}

// ── Helpers ──────────────────────────────────────────────────────────

/** Strip common LaTeX markup, keeping readable text. */
function clean(s) {
  return s
    .replace(/\\textbf\{([^}]*)\}/g, '$1')
    .replace(/\\textit\{([^}]*)\}/g, '$1')
    .replace(/\\href\{[^}]*\}\{([^}]*)\}/g, '$1')
    .replace(/``/g, '\u201c')       // opening double quotes
    .replace(/''/g, '\u201d')       // closing double quotes
    .replace(/`/g, '\u2018')        // opening single quote
    .replace(/'/g, '\u2019')        // closing single quote
    .replace(/\\&/g, '&')
    .replace(/\\%/g, '%')
    .replace(/---/g, '\u2014')
    .replace(/--/g, '\u2013')
    .replace(/~/g, ' ')
    .replace(/\\,/g, ' ')
    .replace(/\\;/g, ' ')
    .replace(/\\\\/g, '')
    .replace(/\\[a-zA-Z]+\s*/g, '')  // remaining commands
    .replace(/[{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Extract text between \section*{name} and the next \section* (or \end{document}). */
function getSection(name) {
  // Match the section header and capture everything until the next section or end
  const pattern = new RegExp(
    `\\\\section\\*\\{${name}\\}([\\s\\S]*?)(?=\\\\section\\*\\{|\\\\end\\{document\\})`,
  );
  const m = tex.match(pattern);
  return m ? m[1] : '';
}

// ── Experience ───────────────────────────────────────────────────────

function parseExperience() {
  const raw = getSection('Experience');
  // Split on \role{...}{...}{...}{...}
  const rolePattern = /\\role\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}/g;
  const roles = [];
  let match;
  const rolePositions = [];

  while ((match = rolePattern.exec(raw)) !== null) {
    rolePositions.push({
      title: clean(match[1]),
      dates: clean(match[2]),
      company: clean(match[3]),
      location: clean(match[4]),
      index: match.index,
      end: rolePattern.lastIndex,
    });
  }

  for (let i = 0; i < rolePositions.length; i++) {
    const role = rolePositions[i];
    const nextStart = i + 1 < rolePositions.length ? rolePositions[i + 1].index : raw.length;
    const block = raw.slice(role.end, nextStart);

    // Extract itemize items
    const itemPattern = /\\item\s+([\s\S]*?)(?=\\item|\\end\{itemize\})/g;
    const highlights = [];
    let itemMatch;
    while ((itemMatch = itemPattern.exec(block)) !== null) {
      const text = clean(itemMatch[1]);
      if (text) highlights.push(text);
    }

    // Parse dates into startDate / endDate
    const dateParts = role.dates.split(/–|--/);
    const startDate = dateParts[0]?.trim() || role.dates;
    const endDate = dateParts[1]?.trim() || 'Present';

    roles.push({
      title: role.title,
      company: role.company,
      location: role.location,
      startDate,
      endDate,
      description: '',
      highlights,
    });
  }

  return roles;
}

// ── Education ────────────────────────────────────────────────────────

function parseEducation() {
  const raw = getSection('Education');
  const entries = [];

  // Pattern: \hdr{Institution}{} \\ \subhdr{Degree}{Year}
  const pattern = /\\hdr\{([^}]*)\}\{([^}]*)\}[\s\\]*\\subhdr\{([^}]*)\}\{([^}]*)\}/g;
  let match;
  while ((match = pattern.exec(raw)) !== null) {
    entries.push({
      degree: clean(match[3]),
      institution: clean(match[1]),
      location: '',
      startDate: '',
      endDate: clean(match[4]),
      description: '',
      highlights: [],
    });
  }

  return entries;
}

// ── Skills ───────────────────────────────────────────────────────────

function parseSkills() {
  const raw = getSection('Technical Skills');
  const groups = [];

  // Pattern: \textbf{Category:} & Skills \\
  const pattern = /\\textbf\{([^}]*?)(?::)?\}\s*&\s*([\s\S]*?)(?:\\\\|$)/g;
  let match;
  while ((match = pattern.exec(raw)) !== null) {
    const category = clean(match[1]).replace(/:$/, '');
    const skillsRaw = clean(match[2]);
    const skills = skillsRaw
      .split(',')
      .map((s) => s.replace(/\([^)]*\)/g, '').trim()) // remove parenthetical notes
      .filter(Boolean);

    if (category && skills.length) {
      groups.push({ category, skills });
    }
  }

  return groups;
}

// ── Publications ─────────────────────────────────────────────────────

function parsePublications() {
  const raw = getSection('Publications');
  const pubs = [];

  // Split on \textbf{Title}
  const pattern = /\\textbf\{([^}]+)\}\.\s*([\s\S]*?)(?=\\textbf\{|$)/g;
  let match;
  while ((match = pattern.exec(raw)) !== null) {
    const title = clean(match[1]);
    const rest = match[2].replace(/\\vspace\{[^}]*\}/g, '').trim();

    // Split on newlines and tabs to separate venue from authors
    const parts = rest.split(/[\n\t]+/).map((l) => l.trim()).filter(Boolean);

    let venue = '';
    let year = '';
    let authors = [];

    // First part: venue info (contains year in parens or after comma)
    const venueLine = clean(parts[0] || '');

    // Extract year
    const yearMatch = venueLine.match(/\b(20\d{2})\b/);
    if (yearMatch) {
      year = yearMatch[1];
      venue = venueLine.replace(/,?\s*\d{4}\.?/, '').replace(/\.$/, '').trim();
    } else {
      venue = venueLine;
    }

    // Remaining parts: author list(s)
    const authorLine = parts.slice(1).map(clean).join(', ');
    if (authorLine) {
      authors = authorLine
        .split(/,\s*(?=[A-Z])/)
        .map((a) => a.replace(/\.$/, '').trim())
        .filter(Boolean);
    }

    if (title) {
      pubs.push({
        title,
        venue: venue || 'Unknown',
        year: parseInt(year) || 0,
        authors: authors.length ? authors : ['Hunter A. Dyer'],
        description: '',
        status: 'published',
      });
    }
  }

  return pubs;
}

// ── YAML serialiser (no dependency) ──────────────────────────────────

function toYaml(items) {
  function escapeVal(v) {
    if (typeof v !== 'string') return String(v);
    if (/[:#\[\]{}&*!|>'"%@`]/.test(v) || v.includes('\n') || v.startsWith(' ') || v.endsWith(' ')) {
      return `"${v.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
    }
    return v;
  }

  function renderObj(obj, indent) {
    const pad = '  '.repeat(indent);
    let out = '';
    for (const [k, v] of Object.entries(obj)) {
      if (Array.isArray(v)) {
        if (v.length === 0) {
          out += `${pad}${k}: []\n`;
        } else if (typeof v[0] === 'object') {
          out += `${pad}${k}:\n`;
          for (const item of v) {
            const keys = Object.keys(item);
            out += `${pad}  - ${keys[0]}: ${escapeVal(item[keys[0]])}\n`;
            for (const rk of keys.slice(1)) {
              if (Array.isArray(item[rk])) {
                if (item[rk].length === 0) {
                  out += `${pad}    ${rk}: []\n`;
                } else {
                  out += `${pad}    ${rk}:\n`;
                  for (const sv of item[rk]) {
                    out += `${pad}      - ${escapeVal(sv)}\n`;
                  }
                }
              } else {
                out += `${pad}    ${rk}: ${escapeVal(item[rk])}\n`;
              }
            }
          }
        } else {
          out += `${pad}${k}:\n`;
          for (const item of v) {
            out += `${pad}  - ${escapeVal(item)}\n`;
          }
        }
      } else {
        out += `${pad}${k}: ${escapeVal(v)}\n`;
      }
    }
    return out;
  }

  return renderObj({ items }, 0);
}

// ── Main ─────────────────────────────────────────────────────────────

const experience = parseExperience();
const education = parseEducation();
const skills = parseSkills();
const publications = parsePublications();

writeFileSync(resolve(outDir, 'experience.yaml'), toYaml(experience));
writeFileSync(resolve(outDir, 'education.yaml'), toYaml(education));
writeFileSync(resolve(outDir, 'skills.yaml'), toYaml(skills));
writeFileSync(resolve(outDir, 'publications.yaml'), toYaml(publications));

console.log(`Parsed resume from ${texPath}`);
console.log(`  Experience: ${experience.length} entries`);
console.log(`  Education:  ${education.length} entries`);
console.log(`  Skills:     ${skills.length} groups`);
console.log(`  Publications: ${publications.length} entries`);
