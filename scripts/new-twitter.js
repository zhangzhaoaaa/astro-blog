#!/usr/bin/env node
/**
 * Create a new Tweet template aligned with src/content/config.ts tweets schema.
 * Parameter-first CLI with interactive fallback.
 * Content placeholder is TEXT-ONLY per clarification.
 *
 * Outputs absolute path of the created file.
 */

const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2);
      const v = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
      args[k] = v;
    }
  }
  return args;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function uniquePath(baseDir, baseName) {
  let target = path.join(baseDir, baseName);
  if (!fs.existsSync(target)) return target;
  const ext = path.extname(baseName);
  const name = path.basename(baseName, ext);
  let i = 1;
  while (true) {
    const candidate = path.join(baseDir, `${name}-${i}${ext}`);
    if (!fs.existsSync(candidate)) return candidate;
    i++;
  }
}

function formatDateTime(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm}`; // matches existing tweets examples
}

// Non-interactive: fill defaults when missing
async function promptMissing(current) {
  if (!current.sourceUrl) current.sourceUrl = 'https://example.com/your/source';
  // title/tags are optional; keep as-is
  return current;
}

function createFrontmatter({ pubDatetime, title, tags, draft, featured, sourceUrl }) {
  const yaml = [];
  yaml.push('---');
  yaml.push(`pubDatetime: ${JSON.stringify(pubDatetime)}`); // string per schema
  if (title) yaml.push(`title: ${JSON.stringify(title)}`);
  yaml.push(`draft: ${typeof draft === 'boolean' ? draft : false}`);
  yaml.push(`featured: ${typeof featured === 'boolean' ? featured : false}`);
  if (Array.isArray(tags)) {
    const arr = `[${tags.map(t => JSON.stringify(t)).join(', ')}]`;
    yaml.push(`tags: ${arr}`);
  } else {
    yaml.push('tags: []');
  }
  yaml.push(`sourceUrl: ${JSON.stringify(sourceUrl || '')}`);
  yaml.push('---');
  return yaml.join('\n');
}

function createBody() {
  return `\n写下你的想法（纯文本占位）…\n\n`;
}

async function main() {
  try {
    const args = parseArgs(process.argv);
    const baseDir = path.resolve(process.cwd(), 'src/content/tweets');
    ensureDir(baseDir);

    const now = new Date();
    const pubDatetime = typeof args.date === 'string' ? args.date : formatDateTime(now);

    let meta = {
      title: typeof args.title === 'string' ? args.title : undefined,
      tags: typeof args.tags === 'string' ? args.tags.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      draft: typeof args.draft === 'string' ? args.draft === 'true' : undefined,
      featured: typeof args.featured === 'string' ? args.featured === 'true' : undefined,
      sourceUrl: typeof args.sourceUrl === 'string' ? args.sourceUrl : undefined,
    };

    if (!meta.sourceUrl) {
      meta = await promptMissing(meta);
    }

    const fm = createFrontmatter({
      pubDatetime,
      title: meta.title,
      tags: meta.tags,
      draft: typeof meta.draft === 'boolean' ? meta.draft : false,
      featured: typeof meta.featured === 'boolean' ? meta.featured : false,
      sourceUrl: meta.sourceUrl || 'https://example.com/your/source',
    });
    const body = createBody();
    const content = `${fm}\n${body}`;

    const targetPath = uniquePath(baseDir, 'twitter.md');
    fs.writeFileSync(targetPath, content, 'utf8');
    console.log(path.resolve(targetPath));
  } catch (err) {
    console.error('创建推特模板失败：', err && err.message ? err.message : err);
    process.exit(1);
  }
}

main();
