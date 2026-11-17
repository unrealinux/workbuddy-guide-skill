#!/usr/bin/env node
/**
 * sync-doubao.mjs — 把 AlephAITech/DoubaoWorkGuide 的正文同步成本 Skill 的 doubao 目录。
 *
 * 上游不是 markdown 树，而是单个 site/content/site-content.json（58 个节点，含完整正文）。
 * 本脚本把它拆成一章一个文件，改好媒体链接，并写出 INDEX.md 与 .source.json。
 *
 * 用法:
 *   node scripts/sync-doubao.mjs                 # 增量同步（只写有变化的文件）
 *   node scripts/sync-doubao.mjs --check         # 只看上游有没有新提交
 *   node scripts/sync-doubao.mjs --dry           # 只打印将写入的文件清单
 *   node scripts/sync-doubao.mjs --force         # 忽略对比，全部重写
 *   node scripts/sync-doubao.mjs --from x.json   # 离线：用本地 site-content.json 生成
 *
 * 依赖: Node.js 20+（只用 node: 内置模块）
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = 'AlephAITech/DoubaoWorkGuide';
const REF = 'main';
const SITE = 'https://doubaowork.homes';
const CONTENT_PATH = 'site/content/site-content.json';
// 媒体只从线上站点取：上游单文件里写的是站内路径 /media/xxx
const MEDIA_BASE = `${SITE}/media/`;
const SOURCES = [
  (p) => `https://raw.githubusercontent.com/${REPO}/${REF}/${p}`,
  (p) => `https://gcore.jsdelivr.net/gh/${REPO}@${REF}/${p}`,
  (p) => `https://cdn.jsdelivr.net/gh/${REPO}@${REF}/${p}`,
];
const API = `https://api.github.com/repos/${REPO}`;

const HERE = dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = resolve(HERE, '..');
const REF_DIR = join(SKILL_ROOT, 'doubao');
const OUT_DIR = join(REF_DIR, 'chapters');
const STATE = join(REF_DIR, '.source.json');

const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const CHECK_ONLY = args.includes('--check');
const FORCE = args.includes('--force');
const FROM = args.includes('--from') ? args[args.indexOf('--from') + 1] : null;

const SCENES = {
  个人提效场景: 'personal',
  自媒体场景: 'media',
  知识管理场景: 'knowledge',
  电商场景: 'ecommerce',
  金融场景: 'finance',
};
const PART_TITLES = ['part1', 'part2', 'part3'];

const HEADERS = { 'user-agent': 'doubaowork-guide-skill' };

async function withRetry(fn, label, tries = 4) {
  let last;
  for (let i = 1; i <= tries; i++) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      if (i < tries) await new Promise((r) => setTimeout(r, 800 * i));
    }
  }
  throw new Error(`${label} 连续 ${tries} 次失败: ${last.message}`);
}

async function getText(path) {
  let last;
  for (const src of SOURCES) {
    const url = src(path.split('/').map(encodeURIComponent).join('/'));
    try {
      return await withRetry(async () => {
        const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(20_000) });
        if (!res.ok) throw new Error(`${res.status} ${url}`);
        return res.text();
      }, `raw ${path}`, 2);
    } catch (e) {
      last = e;
    }
  }
  // 最后退到 GitHub API（未登录 60 次/小时，够单文件用）
  const res = await fetch(`${API}/contents/${path}`, { headers: HEADERS, signal: AbortSignal.timeout(20_000) });
  if (!res.ok) throw new Error(`镜像与 API 均失败: ${last?.message}; API ${res.status}`);
  const json = await res.json();
  return Buffer.from(json.content, 'base64').toString('utf8');
}

async function getCommit() {
  const res = await fetch(`${API}/commits/${REF}`, { headers: HEADERS, signal: AbortSignal.timeout(20_000) });
  if (!res.ok) return REF;
  return (await res.json()).sha;
}

/** 站内链接与自定义组件 → 可读 markdown */
function safeDecode(s) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

function clean(text) {
  let out = text
    .replace(/(\]\()\/media\//g, `$1${MEDIA_BASE}`)
    .replace(/^::video\[([^\]]*)\]\(([^)]+)\)/gm, (m, title, url) => `[▶ 视频 ${safeDecode(title)}](${url})`)
    .replace(/<\/?(?:grid|column)(?:\s[^>]*)?>/g, '')
    .replace(/<title>([\s\S]*?)<\/title>/g, '# $1')
    .replace(/<(?:sheet|bitable)[^>]*>(?:<\/(?:sheet|bitable)>)?/g, '')
    .replace(/<callout[^>]*>\s*([\s\S]*?)\s*<\/callout>/g, (m, inner) =>
      inner
        .split('\n')
        .map((l) => `> ${l}`)
        .join('\n'),
    );
  // 没剥干净的自定义组件统一消掉，避免污染 markdown
  out = out.replace(/<\/?(?:grid|column|callout|sheet|bitable)[^>]*>/g, '');
  return out.trim() + '\n';
}

/** 树 → 文件计划 */
function buildPlan(docs) {
  const childrenOf = (p) => docs.filter((d) => d.parentToken === p).sort((a, b) => a.order - b.order);
  const root = docs.find((d) => !d.parentToken);
  if (!root) throw new Error('site-content.json 里找不到根节点');
  const plan = [];
  childrenOf(root.nodeToken).forEach((part, pi) => {
    const partNo = pi + 1;
    const name = PART_TITLES[pi] || `part${partNo}`;
    const kids = childrenOf(part.nodeToken);
    if (partNo <= 2) {
      kids.forEach((d, i) =>
        plan.push({ file: `${name}-${String(i + 1).padStart(2, '0')}.md`, doc: d }),
      );
    } else {
      if (part.content.replace(/^#.*$/m, '').trim()) plan.push({ file: `${name}-index.md`, doc: part });
      kids.forEach((scene) => {
        const slug = SCENES[scene.title] || 'other';
        childrenOf(scene.nodeToken).forEach((d, i) =>
          plan.push({ file: `${name}-${slug}-${String(i + 1).padStart(2, '0')}.md`, doc: d }),
        );
      });
    }
  });
  return plan;
}

function headerFor(doc, commit) {
  const online = `${SITE}/#/p/${String(doc.nodeToken).replace(/^doc-/, '')}`;
  return (
    `<!-- 由 scripts/sync.mjs 自动生成，请勿手改；改上游或改脚本。 -->\n\n` +
    `> 在线: [${doc.title}](${online}) · 上游: [\`${CONTENT_PATH}\`](https://github.com/${REPO}/blob/${REF}/${CONTENT_PATH}) · 同步自 \`${commit.slice(0, 8)}\`\n\n`
  );
}

function onlineHref(doc) {
  return `${SITE}/#/p/${String(doc.nodeToken).replace(/^doc-/, '')}`;
}

function kb(n) {
  return `${Math.max(1, Math.round(n / 1024))} KB`;
}

function buildIndex(docs, plan, commit) {
  const byFile = new Map(plan.map((p) => [p.doc.nodeToken, p.file]));
  const childrenOf = (p) => docs.filter((d) => d.parentToken === p).sort((a, b) => a.order - b.order);
  const root = docs.find((d) => !d.parentToken);
  const row = (d, extra = '') => {
    const file = byFile.get(d.nodeToken);
    return `| [${d.title}](${onlineHref(d)})${extra} | \`${file}\` | ${kb(d.content.length)} |`;
  };
  const lines = [
    '# 章节索引',
    '',
    `> 由 \`scripts/sync.mjs\` 生成 · 上游 \`${REPO}@${commit.slice(0, 8)}\` · 共 ${plan.length} 篇`,
    '',
    '回答前先读这里，再按 SKILL.md 的路由表读**一到两章**，不要一次读多章。',
    '',
  ];
  childrenOf(root.nodeToken).forEach((part, pi) => {
    const partNo = pi + 1;
    const name = PART_TITLES[pi] || `part${partNo}`;
    lines.push(`## ${part.title}`, '');
    lines.push('| 章节 | 文件 | 体积 |', '| --- | --- | --- |');
    const kids = childrenOf(part.nodeToken);
    if (partNo <= 2) {
      kids.forEach((d) => lines.push(row(d)));
    } else {
      kids.forEach((scene) => {
        lines.push(`| **${scene.title}** | | |`);
        childrenOf(scene.nodeToken).forEach((d) => lines.push(row(d)));
      });
      if (byFile.has(part.nodeToken)) lines.push(row(part, '（场景篇导读）'));
    }
    lines.push('');
  });
  return lines.join('\n');
}

async function main() {
  const recorded = existsSync(STATE) ? JSON.parse(await readFile(STATE, 'utf8')) : null;

  const now = FROM ? 'local' : await getCommit();
  const commit = now === 'local' ? recorded?.commit || 'local' : now;
  if (CHECK_ONLY) {
    if (FROM || recorded?.commit === commit) console.log(`已是最新：${commit.slice(0, 8)}`);
    else console.log(`上游有新提交：${commit.slice(0, 8)}（当前 ${String(recorded?.commit).slice(0, 8) || '无'}）`);
    return;
  }

  const raw = FROM ? await readFile(FROM, 'utf8') : await getText(CONTENT_PATH);
  const docs = JSON.parse(raw).documents;
  const plan = buildPlan(docs);

  const files = new Map();
  for (const { file, doc } of plan) {
    files.set(join(OUT_DIR, file), headerFor(doc, commit) + clean(doc.content));
  }
  files.set(join(REF_DIR, 'INDEX.md'), buildIndex(docs, plan, commit) + '\n');

  if (DRY) {
    for (const [abs, body] of files) console.log(`${String(body.length).padStart(7)}  ${abs.slice(SKILL_ROOT.length + 1)}`);
    return;
  }

  await mkdir(OUT_DIR, { recursive: true });
  const hashes = {};
  let written = 0;
  for (const [abs, body] of files) {
    if (!FORCE && existsSync(abs) && (await readFile(abs, 'utf8')) === body) continue;
    await writeFile(abs, body, 'utf8');
    written++;
  }

  for (const { file, doc } of plan) hashes[file] = createHash('sha256').update(doc.content).digest('hex').slice(0, 16);
  await writeFile(
    STATE,
    JSON.stringify(
      {
        repo: REPO,
        branch: REF,
        commit,
        syncedAt: new Date().toISOString(),
        files: plan.length,
        source: CONTENT_PATH,
        media: MEDIA_BASE,
        hashes,
      },
      null,
      2,
    ) + '\n',
    'utf8',
  );
  console.log(`同步完成：${plan.length} 篇，更新 ${written} 个文件，commit ${commit.slice(0, 8)}`);
}

await main();
