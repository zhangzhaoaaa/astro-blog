#!/usr/bin/env node
/**
 * Create a new Blog post template file aligned with src/content/config.ts schema.
 * Parameter-first CLI with interactive fallback when missing key fields.
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

function slugify(input) {
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, '')
      .replace(/\s+/g, '-');
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

  function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function parseDateArg(input) {
    if (typeof input !== 'string' || !input) return null;
    // Accept YYYY-MM-DD or YYYY/MM/DD
    const m = input.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
    if (!m) return null;
    const y = Number(m[1]);
    const mo = Number(m[2]);
    const d = Number(m[3]);
    const dt = new Date(y, mo - 1, d);
    if (Number.isNaN(dt.getTime())) return null;
    return formatDate(dt);
  }

  function createFrontmatter({ title, description, tags, pubDateStr, draft }) {
    const yamlLines = [];
    yamlLines.push('---');
    yamlLines.push(`title: ${JSON.stringify(title)}`);
    yamlLines.push(`pubDatetime: ${pubDateStr}`);
    yamlLines.push(`description: ${JSON.stringify(description)}`);
    if (Array.isArray(tags) && tags.length) {
      const arr = `[${tags.map(t => JSON.stringify(t.trim())).join(', ')}]`;
      yamlLines.push(`tags: ${arr}`);
    } else {
      yamlLines.push(`tags: ["others"]`);
    }
    if (typeof draft === 'boolean') {
      yamlLines.push(`draft: ${draft}`);
    }
    yamlLines.push('---');
    return yamlLines.join('\n');
  }

  function createBody(title) {
    return `\n# ${title || '待填写标题'}\n\n> 在这里写正文…\n\n`;
  }

  // Non-interactive: fill defaults when missing
  async function promptMissing(current) {
    if (!current.title) current.title = '待填写标题';
    if (!current.description) current.description = '待填写摘要';
    // tags: keep undefined to use default ["others"] in frontmatter builder
    return current;
  }

  async function main() {
    try {
      const args = parseArgs(process.argv);
      const baseDir = path.resolve(process.cwd(), 'src/content/blog');
      ensureDir(baseDir);
    const now = new Date();
    let pubDateStr = formatDate(now);

      let meta = {
        title: typeof args.title === 'string' ? args.title : undefined,
        description: typeof args.description === 'string' ? args.description : undefined,
        tags: typeof args.tags === 'string' ? args.tags.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        draft: typeof args.draft === 'string' ? args.draft === 'true' : undefined,
      };

      if (args.date) {
        const parsed = parseDateArg(args.date);
        if (parsed) pubDateStr = parsed; else console.warn('[blog] 无效的 --date，已回退为今天');
      }

      if (!meta.title || !meta.description) {
        meta = await promptMissing(meta);
      }

      const fm = createFrontmatter({
        title: meta.title || '待填写标题',
        description: meta.description || '待填写摘要',
        tags: meta.tags,
        pubDateStr,
        draft: typeof meta.draft === 'boolean' ? meta.draft : false,
      });
    const body = createBody(meta.title);
    const content = `${fm}\n${body}`;

    const baseName = meta.title ? `${slugify(meta.title)}.md` : 'blog.md';
    const targetPath = uniquePath(baseDir, baseName);
      fs.writeFileSync(targetPath, content, 'utf8');
      console.log(path.resolve(targetPath));
    } catch (err) {
      console.error('创建博客模板失败：', err && err.message ? err.message : err);
      process.exit(1);
    }
  }

  main();
