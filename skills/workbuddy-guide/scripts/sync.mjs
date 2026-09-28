#!/usr/bin/env node
/**
 * sync.mjs — 把 AlephAITech/WorkBuddyGuide 的正文同步成本 Skill 的 references/。
 *
 * 用法:
 *   node scripts/sync.mjs            # 同步（增量：只写有变化的文件）
 *   node scripts/sync.mjs --check    # 只检查上游是否有新提交
 *   node scripts/sync.mjs --dry      # 只打印将要写入的文件清单
 *
 * 依赖: Node.js 20+（仅用 node: 内置模块，无第三方依赖）
 */
import { mkdir, readFile, writeFile, readdir, rm, mkdtemp } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { tmpdir } from 'node:os';
import { promisify } from 'node:util';

const run = promisify(execFile);
import { existsSync } from 'node:fs';
import { dirname, join, resolve, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = 'AlephAITech/WorkBuddyGuide';
const REF = 'main';
const RAW_HOSTS = [
  (p) => `https://raw.githubusercontent.com/${REPO}/${REF}/${p}`,
  (p) => `https://cdn.jsdelivr.net/gh/${REPO}@${REF}/${p}`,   // 备用镜像，raw 被墙/超时时用
];
/** 图片/视频链接的落地域名；同步完成后会换成 jsDelivr 并钉到具体 commit */
let MEDIA_BASE = `https://raw.githubusercontent.com/${REPO}/${REF}/`;
const SITE = 'https://workbuddy.homes';
const API = `https://api.github.com/repos/${REPO}`;

const HERE = dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = resolve(HERE, '..');
const REF_DIR = join(SKILL_ROOT, 'references');
const OUT_DIR = join(REF_DIR, 'chapters');
const STATE = join(REF_DIR, '.source.json');
const TREE_CACHE = join(REF_DIR, '.tree.json');

const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const CHECK_ONLY = args.includes('--check');
const FORCE = args.includes('--force');   // 忽略内容对比，强制重写全部章节

const PART_NUM = { 一: 1, 二: 2, 三: 3, 四: 4 };

async function withRetry(fn, label, tries = 5) {
  let last;
  for (let i = 1; i <= tries; i++) {
    try { return await fn(); } catch (e) {
      last = e;
      if (i < tries) await new Promise((r) => setTimeout(r, 800 * i));
    }
  }
  throw new Error(`${label} 连续 ${tries} 次失败: ${last.message}`);
}

/** 限并发地跑一批任务（逐文件比对正文时用，串行在 raw 被墙的场景下要跑好几分钟） */
async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) { const i = next++; out[i] = await fn(items[i], i); }
  });
  await Promise.all(workers);
  return out;
}

async function api(path) {
  return withRetry(async () => {
    const headers = { accept: 'application/vnd.github+json', 'user-agent': 'workbuddy-guide-skill' };
    if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;   // 未登录时限流 60 次/小时
    const res = await fetch(API + path, { headers });
    if (!res.ok) throw new Error(`GitHub API ${path} -> ${res.status}`);
    return res.json();
  }, `API ${path}`, 3);
}

/** 上次成功的镜像下标；raw 不通时（被墙/超时）不要让每篇正文都先撞它一次 */
let rawPreferred = 0;
const RAW_TIMEOUT_MS = 10_000;

async function raw(path) {
  const enc = path.split('/').map(encodeURIComponent).join('/');
  const order = RAW_HOSTS.map((_, i) => i).sort((a, b) => (a === rawPreferred ? -1 : b === rawPreferred ? 1 : a - b));
  let last;
  for (const i of order) {
    const url = RAW_HOSTS[i](enc);
    try {
      const text = await withRetry(async () => {
        const res = await fetch(url, {
          headers: { 'user-agent': 'workbuddy-guide-skill' },
          signal: AbortSignal.timeout(RAW_TIMEOUT_MS),
        });
        if (!res.ok) throw new Error(`raw ${path} -> ${res.status}`);
        return res.text();
      }, `raw ${path}`, 2);
      rawPreferred = i;
      return text;
    } catch (e) { last = e; }
  }
  throw new Error(`${last.message}（已尝试 ${RAW_HOSTS.length} 个镜像）`);
}

/** 原始路径 -> 目标文件名 + 元信息 */
function classify(path) {
  const seg = path.split('/');
  const isIndex = seg[seg.length - 1] === 'index.md';

  // docs/bluebook/index.md
  if (path === 'docs/bluebook/index.md') return { file: 'index-bluebook.md', kind: 'index', title: '蓝皮书总目录' };
  if (path === 'docs/cases/index.md') return { file: 'index-cases.md', kind: 'index', title: '社区案例集' };
  if (path === 'docs/reading-guide.md') return { file: 'guide-reading.md', kind: 'guide', title: '如何阅读这本蓝皮书' };
  if (path === 'docs/community/case-contributing.md') return { file: 'guide-case-contributing.md', kind: 'guide', title: 'Case 投稿指南' };
  if (path === 'docs/community/contributing.md') return { file: 'guide-contributing.md', kind: 'guide', title: '社区共创指南' };

  if (path.startsWith('docs/cases/submissions/')) {
    const slug = seg[3];
    return { file: `case-${slug}.md`, kind: 'case', title: slug, dir: posix.dirname(path) };
  }

  if (path.startsWith('docs/bluebook/')) {
    const partDir = seg[2];                       // 第一篇 ... / 附录
    const p = PART_NUM[(partDir.match(/^第(.)篇/) || [])[1]] ?? 0;
    const isPartIndex = seg.length === 4 && seg[3] === 'index.md';   // 篇/附录一级目录的 index.md

    if (p === 0) {
      // 附录篇
      if (isPartIndex) return { file: 'appendix-index.md', kind: 'index', title: partDir, dir: posix.dirname(path) };
      const a = (seg[3].match(/^附录\s*([A-Z])/) || [])[1];
      if (a) return { file: `appendix-${a.toLowerCase()}.md`, kind: 'appendix', title: seg[3], dir: posix.dirname(path) };
      return { file: `misc-${seg[3]}.md`, kind: 'misc', title: seg[3], dir: posix.dirname(path) };
    }

    if (isPartIndex) return { file: `part${p}-index.md`, kind: 'part-index', part: p, title: partDir, dir: posix.dirname(path) };

    const secDir = seg[3];
    const m = secDir.match(/^第\s*(\d+)\s*章\s*(.*)$/);
    if (m) {
      const num = String(m[1]).padStart(2, '0');
      return { file: `part${p}-ch${num}.md`, kind: 'chapter', part: p, chapter: Number(m[1]), title: m[2], dir: posix.dirname(path) };
    }
    const a2 = secDir.match(/^附录\s*([A-Z])/);
    if (a2) return { file: `appendix-${a2[1].toLowerCase()}.md`, kind: 'appendix', title: secDir, dir: posix.dirname(path) };
    return { file: `part${p}-extra.md`, kind: 'extra', part: p, title: secDir, dir: posix.dirname(path) };
  }
  return null;
}

/** 把站内相对资源改写成可点开的绝对地址；跨章节链接改写成同目录文件名 */
function rewriteLinks(text, srcPath, fileMap) {
  const srcDir = posix.dirname(srcPath);

  /** 返回 null 表示不处理（已是绝对地址、纯锚点、或解析不出来） */
  const resolveTarget = (rawTarget) => {
    let t = rawTarget.trim().replace(/\\/g, '/');            // 上游有反斜杠路径
    const hashAt = t.indexOf('#');
    const hash = hashAt >= 0 ? t.slice(hashAt) : '';
    const p0 = hashAt >= 0 ? t.slice(0, hashAt) : t;
    if (!p0) return t ? t : null;                            // 纯锚点
    if (/^(https?:|mailto:|data:|tel:)/i.test(p0)) return null;
    if (p0.startsWith('/')) {                                // 站内绝对路径 -> 线上站点
      let dec = p0; try { dec = decodeURIComponent(p0); } catch {}
      return SITE + dec.split('/').map(encodeURIComponent).join('/') + hash;
    }
    let dec = p0; try { dec = decodeURIComponent(p0); } catch {}
    const abs = posix.normalize(posix.join(srcDir, dec));    // 仓库内绝对路径
    const hit = fileMap.get(abs) || fileMap.get(abs.replace(/\/index\.md$/, ''));
    if (hit) return hit + hash;
    if (abs.startsWith('docs/')) {                           // 未收录的图片/视频 -> CDN
      return MEDIA_BASE + abs.split('/').map(encodeURIComponent).join('/') + hash;
    }
    return null;
  };

  // 1) markdown 链接 / 图片
  let out = text.replace(/\]\(([^)]*)\)/g, (full, t) => {
    const r = resolveTarget(t);
    return r === null ? full : `](${r})`;
  });

  // 2) HTML 里的 src="..."
  out = out.replace(/(<[a-zA-Z]+[^>]*?\ssrc=")([^"]+)(")/g, (full, pre, t, post) => {
    const r = resolveTarget(t);
    return r === null ? full : pre + r + post;
  });

  // 3) 清掉 VitePress 专有组件（在 Markdown 阅读器里是噪音）
  out = out.replace(/^<[A-Z][A-Za-z]*\s*\/>\s*$/gm, '');
  return out;
}

function headerFor(meta, srcPath, versionTag) {
  const links = [
    `上游: [\`${srcPath}\`](https://github.com/${REPO}/blob/${REF}/${srcPath.split('/').map(encodeURIComponent).join('/')})`,
    `站点: [${SITE}](${SITE}/)`,
    `同步自 ${versionTag}`,
  ];
  return `<!-- 由 scripts/sync.mjs 自动生成，请勿手改；改上游或改脚本。 -->\n\n> ${links.join(' · ')}\n\n`;
}

/** GitHub API 限流（未登录 60 次/小时）时的退路：blobless 浅克隆只取提交与树，不下载 178 MB 图片 */
async function treeFromGit() {
  const dir = await mkdtemp(join(tmpdir(), 'wbg-'));
  try {
    await run('git', ['clone', '--depth', '1', '--filter=blob:none', '--no-checkout', '--quiet', `https://github.com/${REPO}.git`, dir]);
    const sha = (await run('git', ['-C', dir, 'rev-parse', 'HEAD'])).stdout.trim();
    const list = (await run('git', ['-C', dir, 'ls-tree', '-r', '-l', 'HEAD'])).stdout.split('\n').filter(Boolean);
    const blobs = list.map((line) => {
      const [meta, ...rest] = line.split('\t');
      const size = meta.trim().split(/\s+/)[3];
      return { type: meta.trim().split(/\s+/)[1], path: rest.join('\t'), size: Number(size) || 0 };
    });
    return { treeSha: sha, commitSha: sha, blobs };
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

/** 最后退路：从已生成文件的表头里重建上游路径清单（可刷新内容，但发现不了上游新增/删除的章） */
async function treeFromLocal() {
  if (!existsSync(OUT_DIR)) return null;
  const blobs = [];
  for (const f of (await readdir(OUT_DIR)).filter((x) => x.endsWith('.md'))) {
    const t = await readFile(join(OUT_DIR, f), 'utf8');
    const m = t.match(/^> 上游: \[`([^`]+)`\]/m);
    if (m) blobs.push({ type: 'blob', path: m[1], size: Buffer.byteLength(t) });
  }
  return blobs.length ? blobs : null;
}

async function main() {
  const prev = existsSync(STATE) ? JSON.parse(await readFile(STATE, 'utf8')) : {};
  const cache = existsSync(TREE_CACHE) ? JSON.parse(await readFile(TREE_CACHE, 'utf8')) : null;

  // 1) 文件清单：优先 GitHub API；限流/离线时退化为本地缓存（无法发现上游新增/删除文件）
  let blobs = null, treeSha = null, apiOk = true, fromGit = false, fromCache = false;
  try {
    const treeRes = await api(`/git/trees/${REF}?recursive=1`);
    blobs = treeRes.tree;
    treeSha = treeRes.sha;
  } catch (e) {
    try {
      console.warn(`⚠ GitHub API 不可用（${e.message}）—— 退化为 git 浅克隆取文件清单。`);
      const g = await treeFromGit();
      blobs = g.blobs; treeSha = g.treeSha; apiOk = true; fromGit = true;
    } catch (e2) {
      apiOk = false;
      let local = null;
      try { local = await treeFromLocal(); } catch { /* ignore */ }
      if (cache) {
        blobs = cache.blobs;
        treeSha = cache.treeSha;
        fromCache = true;
        console.warn(`⚠ GitHub API 与 git 都不可用（${e2.message}）—— 改用本地缓存的文件清单，无法发现上游新增/删除的章节。`);
      } else if (local) {
        blobs = local;
        console.warn(`⚠ GitHub API 与 git 都不可用（${e2.message}）—— 改用本地文件表头里的路径清单：能刷新内容，但发现不了上游新增/删除的章节。`);
      } else {
        throw new Error(`${e.message}；git 退路也失败（${e2.message}），且本地无可重建的清单。`);
      }
    }
  }

  let commitSha = fromGit ? treeSha : null;
  if (apiOk && !fromGit) { try { commitSha = (await api('/commits/' + REF)).sha; } catch { /* 拿不到就用 tree sha */ } }
  // 拿不到上游版本时，沿用上次已知的（内容是否变化由 hashes 判定）
  const knownCommit = commitSha || prev.commit || null;
  const knownTree = treeSha || prev.treeSha || null;
  const version = knownCommit || knownTree || shortHash(blobs.map((x) => x.path).join('|'));
  const versionTag = `${knownCommit ? 'commit' : knownTree ? 'tree' : '清单'} \`${version.slice(0, 8)}\``;
  const commit = commitSha || version;
  // 图片/视频走 jsDelivr 并钉到具体 commit：比 raw.githubusercontent 快，且在 raw 被墙时仍可用
  const mediaPin = commitSha || prev.commit;
  if (mediaPin) MEDIA_BASE = `https://cdn.jsdelivr.net/gh/${REPO}@${mediaPin}/`;

  // 2) --check：先比 tree sha，再比 commit，最后退到逐文件内容哈希（不需要 API）
  //    `.source.json` 里的 treeSha 可能是 null（上次同步走的是离线退路），此时必须继续往下比，
  //    否则会误报「本地无同步记录」。
  if (CHECK_ONLY) {
    const s = (x) => (x ? String(x).slice(0, 8) : '?');
    // 清单来自本地缓存时 treeSha 只反映「上次同步」，不能拿去和自身比较（会谎报已是最新）
    if (!fromCache && treeSha && prev.treeSha && treeSha === prev.treeSha) {
      console.log(`已是最新: ${versionTag}（tree ${s(treeSha)}）`);
      return;
    }
    if (commitSha && prev.commit && commitSha === prev.commit) {
      console.log(`已是最新: ${versionTag}（.source.json 未记录 tree sha，按 commit 判定）`);
      return;
    }
    if (!prev.hashes || !Object.keys(prev.hashes).length) {
      console.log(`上游: ${versionTag}；本地无内容哈希记录（commit ${s(prev.commit)}）。\n重新同步: node scripts/sync.mjs`);
      return;
    }

    const blobsSel = selectBlobs(blobs);
    const upstreamPaths = new Set(blobsSel.map((b) => b.path));
    const added = [], changed = [], removed = [], failed = [];
    const results = await mapLimit(blobsSel, 6, async (b) => {
      const want = prev.hashes[b.path];
      try { return { path: b.path, want, got: shortHash(await raw(b.path)) }; }
      catch { return { path: b.path, want, failed: true }; }
    });
    for (const r of results) {
      if (r.failed) failed.push(r.path);
      else if (!r.want) added.push(r.path);
      else if (r.want !== r.got) changed.push(r.path);
    }
    for (const p of Object.keys(prev.hashes)) if (!upstreamPaths.has(p)) removed.push(p);

    const diff = [
      ...added.map((p) => `  + ${p}`),
      ...changed.map((p) => `  ~ ${p}`),
      ...removed.map((p) => `  - ${p}`),
    ];
    if (!diff.length && !failed.length) {
      const who = commitSha ? `上游有新提交 ${s(commitSha)}，但` : '未取到上游版本号（离线判断），';
      console.log(`已是最新: ${who}收录的 ${blobsSel.length} 篇正文与本地记录一致（已比对内容哈希）`);
      return;
    }
    if (!diff.length) {
      console.log(`无法判断: ${failed.length}/${blobsSel.length} 篇上游正文读取失败（${failed[0]} 等）。\n稍后重试: node scripts/sync.mjs --check`);
      return;
    }
    console.log(`上游有变化: 新增 ${added.length}、修改 ${changed.length}、上游已删除 ${removed.length}`);
    diff.slice(0, 10).forEach((l) => console.log(l));
    if (diff.length > 10) console.log(`  …还有 ${diff.length - 10} 个`);
    if (failed.length) console.log(`  （另有 ${failed.length} 篇读取失败，结果不完整）`);
    console.log('重新同步: node scripts/sync.mjs');
    return;
  }

  const sel = selectBlobs(blobs);

  // 建映射：原始路径 & 目录 → 目标文件名
  const fileMap = new Map();
  const plan = [];
  for (const t of sel) {
    const meta = classify(t.path);
    if (!meta) continue;
    fileMap.set(t.path, meta.file);
    fileMap.set(posix.dirname(t.path), meta.file);
    plan.push({ ...meta, src: t.path, bytes: t.size });
  }
  // 先按上游路径排序：重复章节号的重命名（part1-ch08-2）必须与输入顺序无关
  plan.sort((a, b) => a.src.localeCompare(b.src, 'en'));

  // 上游有重复章节号（第一篇出现过两个「第 8 章」），去重避免互相覆盖
  const seen = new Map();
  for (const item of plan) {
    const n = (seen.get(item.file) || 0) + 1;
    seen.set(item.file, n);
    if (n > 1) {
      const [base, ext] = [item.file.replace(/\.md$/, ''), '.md'];
      item.dupOf = item.file;
      item.file = `${base}-${n}${ext}`;
    }
  }
  for (const item of plan) {
    fileMap.set(item.src, item.file);
    fileMap.set(posix.dirname(item.src), item.file);
  }
  plan.sort((a, b) => a.file.localeCompare(b.file, 'en'));

  if (DRY) { plan.forEach((p) => console.log(p.file, '<-', p.src)); return; }

  if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true });
  // 清掉上次生成但这次不存在的文件
  const keep = new Set(plan.map((p) => p.file));
  for (const f of await readdir(OUT_DIR)) {
    if (f.endsWith('.md') && !keep.has(f)) { await rm(join(OUT_DIR, f)); console.log('  - 删除', f); }
  }

  let written = 0, skipped = 0;
  const hashes = {};
  for (const item of plan) {
    const text = await raw(item.src);
    hashes[item.src] = shortHash(text);
    // 上游目录编号与正文标题从第 8 章起差 1（目录里有两个「第 8 章」），以正文标题为准
    const h1 = text.match(/^#\s+第\s*(\d+)\s*章\s*(.+)$/m);
    if (h1) {
      item.h1Chapter = Number(h1[1]);
      item.h1Title = h1[2].trim();
      item.numMismatch = item.chapter !== item.h1Chapter;
    }
    const body = headerFor(item, item.src, versionTag) + rewriteLinks(text.trimStart(), item.src, fileMap);
    const dest = join(OUT_DIR, item.file);
    let old = null;
    if (existsSync(dest)) old = await readFile(dest, 'utf8');
    // 对比时忽略版本行，避免每次上游提交 / 限流降级都全量重写（.source.json 才是权威版本记录）
    const strip = (s) => s && s.replace(/同步自 (?:commit|tree|清单) `[0-9a-f]{8}`/, '同步自 version');
    if (!FORCE && strip(old) === strip(body)) { skipped++; continue; }
    await writeFile(dest, body, 'utf8');
    written++;
    console.log('  + 写入', item.file, `(${Math.round(item.bytes / 1024)} KB)`);
  }

  await writeFile(join(OUT_DIR, '..', 'INDEX.md'), buildIndex(plan, commit), 'utf8');
  if (apiOk) {
    await writeFile(TREE_CACHE, JSON.stringify({ treeSha, savedAt: new Date().toISOString(), blobs: sel.map((b) => ({ type: 'blob', path: b.path, size: b.size })) }, null, 2) + '\n', 'utf8');
  }
  await writeFile(STATE, JSON.stringify({ repo: REPO, branch: REF, commit: knownCommit, treeSha: knownTree, syncedAt: new Date().toISOString(), files: plan.length, hashes }, null, 2) + '\n', 'utf8');
  console.log(`\n完成: 写入 ${written}, 未变 ${skipped}, 共 ${plan.length} 篇 -> references/chapters/`);
}

/** 只收录正文（上游的 plans/、README 等不进 references）；缓存里的条目没有 type，一并当 blob 看 */
function selectBlobs(blobs) {
  return blobs.filter((x) => (x.type === 'blob' || !x.type) && x.path && x.path.endsWith('.md') &&
    (x.path.startsWith('docs/bluebook/') || x.path.startsWith('docs/cases/') ||
     x.path === 'docs/reading-guide.md' || x.path.startsWith('docs/community/')));
}

function shortHash(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex').slice(0, 16);
}

function buildIndex(plan, commit) {
  const parts = [
    ['part1', '第一篇 · 使用手册：先把 WorkBuddy 用起来'],
    ['part2', '第二篇 · 案例篇：从一项任务到一支 AI 团队'],
    ['part3', '第三篇 · 进阶篇：把案例变成自己的工作系统'],
    ['part4', '第四篇 · 岗位与行业落地'],
  ];
  const label = (p) => {
    const num = p.h1Chapter ?? p.chapter;
    const title = p.h1Title ?? p.title ?? '';
    const flags = [];
    if (p.dupOf) flags.push('上游目录名重复');
    if (p.numMismatch) flags.push(`上游目录写作第 ${p.chapter} 章`);
    return [`第 ${num} 章`, title, flags.length ? `（${flags.join('；')}）` : ''].filter(Boolean).join(' ');
  };
  const rows = (pred) => plan.filter(pred)
    .slice()
    .sort((a, b) => (a.h1Chapter ?? a.chapter ?? 999) - (b.h1Chapter ?? b.chapter ?? 999))
    .map((p) => `| ${label(p)} | \`chapters/${p.file}\` | ${Math.round((p.bytes || 0) / 1024)} KB |`).join('\n');

  let md = `# 章节索引\n\n> 由 \`scripts/sync.mjs\` 生成 · 上游 \`${REPO}@${commit.slice(0, 8)}\` · 共 ${plan.length} 篇\n\n`;
  md += `先读这里的表，再决定读哪一章。不要一次读多章。\n\n`;
  md += `章节号以**正文标题**为准（上游目录编号从第 8 章起与标题差 1，因为目录里有两个「第 8 章」）；文件名里的 \`chNN\` 是上游目录编号。\n\n`;
  for (const [key, label] of parts) {
    md += `## ${label}\n\n| 章节 | 文件 | 体积 |\n| --- | --- | --- |\n${rows((p) => p.file.startsWith(key + '-ch')) || '| — | — | — |'}\n\n`;
    const extras = plan.filter((p) => (p.file === `${key}-index.md` || p.file === `${key}-extra.md`));
    if (extras.length) md += `另: ${extras.map((p) => `${p.title} → \`chapters/${p.file}\``).join(' · ')}\n\n`;
  }
  md += `## 附录与工具\n\n| 内容 | 文件 | 体积 |\n| --- | --- | --- |\n${rows((p) => ['appendix', 'guide', 'index'].includes(p.kind))}\n\n`;
  md += `## 社区案例（\`docs/cases/submissions/\`）\n\n| 案例 | 文件 | 体积 |\n| --- | --- | --- |\n${rows((p) => p.kind === 'case')}\n`;
  return md;
}

main().catch((e) => { console.error('同步失败:', e.message, e.cause ? ('| cause: ' + (e.cause.code || e.cause.message || JSON.stringify(e.cause))) : ''); process.exit(1); });
