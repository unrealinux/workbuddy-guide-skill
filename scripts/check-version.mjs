// 发布前自检：版本一致 + frontmatter 合规。不联网。
// 用法: node scripts/check-version.mjs
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SKILL_DIR = join(ROOT, "skills", "workbuddy-playbook");
const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
const skill = readFileSync(join(SKILL_DIR, "SKILL.md"), "utf8");

const fail = [];
const ok = [];

const m = skill.match(/^---\n([\s\S]*?)\n---/);
if (!m) {
  console.error("FAIL  SKILL.md 缺少 frontmatter");
  process.exit(1);
}
const fm = m[1];

const field = (name) => {
  const re = new RegExp(`^${name}:\\s*(?:"([^"]*)"|'([^']*)'|(.*))$`, "m");
  const hit = fm.match(re);
  return hit ? (hit[1] ?? hit[2] ?? hit[3] ?? "").trim() : null;
};

// 1. 版本一致
const skillVersion = field("version");
if (!skillVersion) fail.push("SKILL.md version 缺失");
else if (skillVersion !== pkg.version) {
  fail.push(`版本不一致: package.json=${pkg.version} vs SKILL.md=${skillVersion}`);
} else ok.push(`版本一致: ${pkg.version}`);

// 2. frontmatter 必填与长度（Agent Skills 规范：name/description 必填，description ≤ 1024 字符）
const name = field("name");
const description = field("description");
if (name !== "workbuddy-playbook") fail.push(`SKILL.md name 应为 workbuddy-playbook，实际 ${name}`);
else ok.push(`name 合规: ${name}`);
if (!description) fail.push("SKILL.md description 缺失");
else {
  const len = [...description].length;
  if (len > 1024) fail.push(`description 过长: ${len} > 1024 字符`);
  else ok.push(`description 长度合规: ${len}/1024`);
}

// 3. 平台上传必填（SkillPay / WorkBuddy 平台解析 SKILL.md frontmatter）
const platformFields = ["version", "display_name", "display_name_en", "description_zh", "description_en"];
for (const key of platformFields) {
  if (!field(key)) fail.push(`frontmatter 缺少平台必填字段: ${key}`);
}
if (platformFields.every((k) => field(k))) ok.push(`平台字段齐全: ${platformFields.join(", ")}`);

// 平台付费资产名称仅允许中英文、数字、- 和 —（不能有空格）
const nameCharset = /^[\u4e00-\u9fa50-9A-Za-z\-—]+$/;
for (const key of ["name", "display_name", "display_name_en"]) {
  const v = field(key);
  if (v && !nameCharset.test(v)) fail.push(`${key} 含平台不允许的字符（仅中英文、数字、- 、—）: ${v}`);
}

// 4. 非标准字段（pi 只读 name/description；其他 loader 会忽略，但别再加回来）
const allowed = new Set(["name", "description", "license", "metadata", ...platformFields]);
const topLevel = [...fm.matchAll(/^([a-zA-Z][a-zA-Z0-9-]*):/gm)].map((x) => x[1]);
for (const key of topLevel) {
  if (!allowed.has(key)) fail.push(`frontmatter 出现非标准字段: ${key}（并进 description 或删掉）`);
}
if (topLevel.every((k) => allowed.has(k))) ok.push(`frontmatter 字段合规: ${topLevel.join(", ")}`);

// 5. npm 包必备
for (const key of ["name", "version", "license", "description"]) {
  if (!pkg[key]) fail.push(`package.json 缺少 ${key}`);
}
if (pkg.keywords?.includes("pi-package")) ok.push("package.json 带 pi-package 关键词");
else fail.push("package.json 缺少 pi-package 关键词（pi.dev 画廊不会收录）");

// 6. skill 正文存在
try {
  readFileSync(join(SKILL_DIR, "SKILL.md"));
  ok.push("skills/workbuddy-playbook/SKILL.md 存在");
} catch {
  fail.push("skills/workbuddy-playbook/SKILL.md 不存在");
}

for (const line of ok) console.log(`ok    ${line}`);
for (const line of fail) console.error(`FAIL  ${line}`);
process.exit(fail.length ? 1 : 0);
