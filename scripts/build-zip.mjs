// 打出可分发的 Skill zip（零依赖、可复现）。
// 用法: node scripts/build-zip.mjs
// 产物: dist/workbuddy-guide-skill-<version>.zip
// 解压后得到 workbuddy-guide/，直接放进 ~/.agents/skills/ 或 <repo>/.agents/skills/
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { crc32, deflateRawSync } from "node:zlib";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SKILL_DIR = join(ROOT, "skills", "workbuddy-guide");
const PACKAGING_DIR = join(ROOT, "packaging");
const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));

const VERSION = pkg.version;
const OUT = join(ROOT, "dist", `${pkg.name}-${VERSION}.zip`);
const PREFIX = "workbuddy-guide"; // 解压后的目录名（= skill name）

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

/** 生成内容的正文（其余条目直接从磁盘读） */
function dataFor(name) {
  if (name === `${PREFIX}/README.md`) return readTemplate("README.md");
  if (name === `${PREFIX}/README.en.md`) return readTemplate("README.en.md");
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
  for (const abs of walk(SKILL_DIR)) {
    files.set(`${PREFIX}/${relative(SKILL_DIR, abs).split(sep).join("/")}`, abs);
  }
  for (const name of ["LICENSE", "NOTICE.md", "CHANGELOG.md"]) {
    files.set(`${PREFIX}/${name}`, join(ROOT, name));
  }
  for (const name of ["README.md", "README.en.md"]) {
    files.set(`${PREFIX}/${name}`, null); // 由 packaging/ 注入版本号生成
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
const zip = makeZip(entries);
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, zip);

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const total = entries.reduce((sum, [name, abs]) => sum + bytesOf(abs, name), 0);
console.log(`打包完成: ${relative(ROOT, OUT).split(sep).join("/")}`);
console.log(`条目 ${entries.length} 个 · zip ${kb(zip.length)} · 解压后 ${kb(total)}`);
console.log(`解压后目录名: ${PREFIX}/ · 包内说明书版本: v${VERSION} (${GENERATED_AT})`);
