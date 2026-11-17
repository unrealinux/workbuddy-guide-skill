// 打出可分发的 Skill zip（零依赖、可复现）。
// 用法: node scripts/build-zip.mjs            # 目录包裹包：解压得 ai-work-assistant-playbook/
//       node scripts/build-zip.mjs --flat     # 平铺包：SKILL.md 在 zip 根，供平台上传（如 SkillPay）
// 产物: dist/<skill name>-<version>[-skillpay].zip
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { crc32, deflateRawSync } from "node:zlib";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SKILL_DIR = join(ROOT, "skills", "ai-work-assistant-playbook");
const PACKAGING_DIR = join(ROOT, "packaging");
const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));

const VERSION = pkg.version;
// --only <workbuddy|doubao>：只出单册包（SKILL.md 由合集版裁剪生成）
const ONLY = (() => {
  const i = process.argv.indexOf("--only");
  return i > -1 ? process.argv[i + 1] : null;
})();
const VOLUMES = JSON.parse(readFileSync(join(PACKAGING_DIR, "volumes.json"), "utf8"));
if (ONLY && !VOLUMES[ONLY]) throw new Error(`--only 只支持: ${Object.keys(VOLUMES).join(" / ")}`);
const VOL = ONLY ? VOLUMES[ONLY] : null;
const FLAT = process.argv.includes("--flat"); // 平铺包：SKILL.md 在 zip 根；剔除同步缓存
// 产物名跟随技能名（合集）或分册名，与 npm 包名解耦
const ARTIFACT = VOL ? VOL.artifact : readFileSync(join(SKILL_DIR, "SKILL.md"), "utf8").match(/^name:\s*(.+)$/m)[1].trim();
const PREFIX = FLAT ? "" : ARTIFACT; // 普通包解压后的目录名（= skill name）
const OUT = join(ROOT, "dist", `${ARTIFACT}-${VERSION}${FLAT ? "-skillpay" : ""}.zip`);

// 可复现：所有条目用同一个时间戳（SOURCE_DATE_EPOCH 可覆盖）
const epoch =
  Number(process.env.SOURCE_DATE_EPOCH || 0) ||
  Math.floor(new Date("2026-09-29T00:00:00Z").getTime() / 1000);
const GENERATED_AT = new Date(epoch * 1000).toISOString().slice(0, 10);
const dosTime = (() => {
  const d = new Date(epoch * 1000);
  return {
    time: (d.getUTCHours() << 11) | (d.getUTCMinutes() << 5) | (d.getUTCSeconds() >> 1),
    date: ((d.getUTCFullYear() - 1980) << 9) | ((d.getUTCMonth() + 1) << 5) | d.getUTCDate(),
  };
})();

/** 包内说明书：正文在 packaging/，只注入版本号与构建日期 */
const readTemplate = (file) =>
  readFileSync(join(PACKAGING_DIR, file), "utf8")
    .replaceAll("{{VERSION}}", VERSION)
    .replaceAll("{{DATE}}", GENERATED_AT);

/** 单册包的 SKILL.md：从合集版裁出「核心原则 + 该册路由 + 回答形状」，frontmatter 换成单册信息 */
function volumeSkillMd(vol) {
  const raw = readFileSync(join(SKILL_DIR, "SKILL.md"), "utf8");
  const parts = raw.slice(raw.indexOf("\n---\n", 4) + 5).split(/^## /m).slice(1);
  /** 取出某小节正文（去掉标题行） */
  const sec = (prefix) => {
    const hit = parts.find((p) => p.startsWith(prefix));
    if (!hit) throw new Error(`SKILL.md 缺少小节「${prefix}」，单册包无法生成`);
    return hit.split("\n").slice(1).join("\n").trim();
  };
  const core = sec("0. 核心原则")
    .replace(/^1\. \*\*先判断产品，再路由\*\*.*$/m, `1. **本技能只收 ${vol.product} 的正文**：问到别的产品就直接说没有收录，不要凭记忆编。`)
    .replace(/^3\. \*\*标注出处\*\*.*$/m, vol.example_line);
  const md = `---
name: ${vol.name}
version: "${VERSION}"
display_name: "${vol.display_name}"
display_name_en: "${vol.display_name_en}"
description_zh: "${vol.description_zh}"
description_en: "${vol.description_en}"
description: "${vol.description}"
license: MIT
metadata:
  upstream: "${vol.upstream}"
  upstreamLicense: "${vol.upstreamLicense}"
  upstreamCommit: "${vol.upstreamCommit}"
  syncedAt: "${vol.syncedAt}"
  requires: "正文无依赖；仅 ${vol.script} 需要 Node.js 20+"
---

## 0. 核心原则（不可违背）

${core}

## 1. 路由表（意图 → 读哪个文件）

${sec(vol.routing)}

## 2. 回答形状

${sec("5. 回答形状")}
`;
  // 单册包不能引用另一册的文件，否则平台会报「缺少必需资源」
  if (md.includes(`\`${vol.other}/`)) throw new Error(`单册包混入了 ${vol.other}/ 的引用，检查 SKILL.md 的公共小节`);
  return md;
}

/** 生成内容的正文（其余条目直接从磁盘读） */
function dataFor(name) {
  const key = (x) => (PREFIX ? `${PREFIX}/${x}` : x);
  if (VOL && name === key("SKILL.md")) return volumeSkillMd(VOL);
  if (name === key("README.md")) return readTemplate("README.md");
  if (name === key("README.en.md")) return readTemplate("README.en.md");
  throw new Error(`未知生成条目: ${name}`);
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1))) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) walk(abs, out);
    else if (entry.isFile()) out.push(abs);
  }
  return out;
}

/** 打包进去的内容：Skill 本体 + 许可与归属 + 变更记录 + 包内说明书 */
function collect() {
  const files = new Map();
  if (VOL) {
    files.set(FLAT ? "SKILL.md" : `${PREFIX}/SKILL.md`, null); // 由 volumeSkillMd 生成
    for (const abs of walk(join(SKILL_DIR, VOL.dir))) {
      const rel = relative(join(SKILL_DIR, VOL.dir), abs).split(sep).join("/");
      if (FLAT && rel.endsWith(".tree.json")) continue;
      files.set(`${PREFIX ? PREFIX + "/" : ""}${VOL.dir}/${rel}`, abs);
    }
    const script = join(SKILL_DIR, VOL.script);
    files.set(`${PREFIX ? PREFIX + "/" : ""}${VOL.script}`, script);
    for (const name of ["LICENSE", "NOTICE.md"]) files.set(FLAT ? name : `${PREFIX}/${name}`, join(ROOT, name));
    return [...files.entries()].sort(([a], [b]) => (a < b ? -1 : 1));
  }
  for (const abs of walk(SKILL_DIR)) {
    const rel = relative(SKILL_DIR, abs).split(sep).join("/");
    // 平铺包面向商品上传：只剔除同步缓存 .tree.json（平台校验文档里引用的文件必须存在，故保留 scripts/ 与 .source.json）
    if (FLAT && rel.endsWith(".tree.json")) continue;
    files.set(FLAT ? rel : `${PREFIX}/${rel}`, abs);
  }
  const rootFiles = FLAT ? ["LICENSE", "NOTICE.md"] : ["LICENSE", "NOTICE.md", "CHANGELOG.md"];
  for (const name of rootFiles) {
    files.set(FLAT ? name : `${PREFIX}/${name}`, join(ROOT, name));
  }
  if (!FLAT) {
    for (const name of ["README.md", "README.en.md"]) {
      files.set(`${PREFIX}/${name}`, null); // 由 packaging/ 注入版本号生成
    }
  }
  return [...files.entries()].sort(([a], [b]) => (a < b ? -1 : 1));
}

const bytesOf = (abs, name) => (abs ? statSync(abs).size : Buffer.byteLength(dataFor(name), "utf8"));

function makeZip(entries) {
  const local = [];
  const central = [];
  let offset = 0;

  for (const [name, abs] of entries) {
    const data = abs === null ? Buffer.from(dataFor(name), "utf8") : readFileSync(abs);
    const nameBuf = Buffer.from(name, "utf8");
    const crc = crc32(data) >>> 0;
    const deflated = deflateRawSync(data, { level: 9 });
    const useDeflate = deflated.length < data.length;
    const body = useDeflate ? deflated : data;
    const method = useDeflate ? 8 : 0;

    const lfh = Buffer.alloc(30);
    lfh.writeUInt32LE(0x04034b50, 0);
    lfh.writeUInt16LE(20, 4); // version needed
    lfh.writeUInt16LE(0x0800, 6); // UTF-8 文件名
    lfh.writeUInt16LE(method, 8);
    lfh.writeUInt16LE(dosTime.time, 10);
    lfh.writeUInt16LE(dosTime.date, 12);
    lfh.writeUInt32LE(crc, 14);
    lfh.writeUInt32LE(body.length, 18);
    lfh.writeUInt32LE(data.length, 22);
    lfh.writeUInt16LE(nameBuf.length, 26);
    lfh.writeUInt16LE(0, 28);
    local.push(lfh, nameBuf, body);

    const cdh = Buffer.alloc(46);
    cdh.writeUInt32LE(0x02014b50, 0);
    cdh.writeUInt16LE(20, 4); // version made by
    cdh.writeUInt16LE(20, 6);
    cdh.writeUInt16LE(0x0800, 8);
    cdh.writeUInt16LE(method, 10);
    cdh.writeUInt16LE(dosTime.time, 12);
    cdh.writeUInt16LE(dosTime.date, 14);
    cdh.writeUInt32LE(crc, 16);
    cdh.writeUInt32LE(body.length, 20);
    cdh.writeUInt32LE(data.length, 24);
    cdh.writeUInt16LE(nameBuf.length, 28);
    cdh.writeUInt16LE(0, 30); // extra
    cdh.writeUInt16LE(0, 32); // comment
    cdh.writeUInt16LE(0, 34); // disk
    cdh.writeUInt16LE(0, 36); // internal attrs
    cdh.writeUInt32LE((0o100644 << 16) >>> 0, 38); // external attrs: -rw-r--r--
    cdh.writeUInt32LE(offset, 42);
    central.push(cdh, nameBuf);

    offset += lfh.length + nameBuf.length + body.length;
  }

  const cd = Buffer.concat(central);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(cd.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...local, cd, eocd]);
}

const entries = collect();

// 平铺包硬校验：SKILL.md 必须在 zip 根，且不能出现外层目录（腾讯云 450019 / 通用平台规范）
if (FLAT) {
  const names = entries.map(([name]) => name);
  if (!names.includes("SKILL.md")) throw new Error("平铺包缺少根目录 SKILL.md");
  const wrapped = names.find((name) => name.startsWith("ai-work-assistant-playbook/"));
  if (wrapped) throw new Error(`平铺包出现了外层目录: ${wrapped}`);
}

const zip = makeZip(entries);
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, zip);

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const total = entries.reduce((sum, [name, abs]) => sum + bytesOf(abs, name), 0);
console.log(`打包完成: ${relative(ROOT, OUT).split(sep).join("/")}`);
console.log(`条目 ${entries.length} 个 · zip ${kb(zip.length)} · 解压后 ${kb(total)}`);
console.log(
  FLAT
    ? `模式: 平铺（平台上传）· SKILL.md 在根 · 含 scripts/sync.mjs 与 .source.json · v${VERSION} (${GENERATED_AT})`
    : `模式: 目录包裹（手动安装）· 解压后目录名: ${PREFIX}/ · 包内说明书版本: v${VERSION} (${GENERATED_AT})`,
);
