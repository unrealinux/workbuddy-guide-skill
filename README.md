# workbuddy-guide

把 [AlephAITech/WorkBuddyGuide](https://github.com/AlephAITech/WorkBuddyGuide)（《WorkBuddy 实战蓝皮书》，MIT，3.2k star）**完整本地化**的 Agent Skill。

- 28 章正文 + 附录 + 8 个社区案例 → `references/chapters/`（49 个文件，约 500 KB）
- `SKILL.md` 只做**路由**（意图 → 读哪个文件），正文按需加载
- `scripts/sync.mjs` 增量同步上游，幂等、带重试

## 安装

把整个 `workbuddy-guide/` 目录放到 `~/.agents/skills/`（或项目的 `.agents/skills/`）即可被识别。正文已随 Skill 同步好，**不需要上游仓库、也不需要联网**就能回答。

## 更新正文

```bash
node scripts/sync.mjs --check   # 上游有变化吗（限流时自动改用内容哈希）
node scripts/sync.mjs           # 增量同步，只写变化的文件
node scripts/sync.mjs --force   # 强制重写全部 49 篇
GITHUB_TOKEN=xxx node scripts/sync.mjs   # 带 token 解除 GitHub API 60 次/小时限流
```

同步时自动完成：图片/视频链接 → jsDelivr（钉到同步的 commit）；跨章节链接 → 本地文件名；站内 `/xxx` → workbuddy.homes。
取文件清单的降级顺序：GitHub API → git 浅克隆 → `.tree.json` 缓存 → 从已有文件表头重建。
`references/chapters/` 是生成物，**不要手改**——会被下次同步覆盖，要改就改 `scripts/sync.mjs`。

## 为什么不是"把 49 个 md 丢进一个 prompt"

| 做法 | 问题 |
| --- | --- |
| 全部塞进 context | 约 500 KB 正文，浪费 token 且稀释注意力 |
| 只做一个摘要 | 丢掉"哪一章讲了什么"的可追溯性，容易编 |
| **本方案：路由 + 按需读** | 成本低，且每条回答都能指回原文章节 |

## 许可与归属

- 上游内容：MIT，版权归 AlephAITech 及各位作者（见上游 `LICENSE`、README 作者名单）。
- 本 Skill 的脚本、SKILL.md、`references/playbook-guide-site.md`：MIT。
- 本 Skill 与 AlephAITech 无隶属关系，非官方；产品功能、价格、权限等时效信息以官方渠道为准。

## 已知限制

1. 不收录上游截图/视频本体（178 MB），只保留 jsDelivr 链接，看图需联网。
2. 上游有两套章节号：目录编号从第 8 章起比正文标题小 1，正文标题是连续的 1–28 章；文件名用目录编号，以 `references/INDEX.md` 为准。
3. 上游最后实质更新为 2026-09-18，产品细节可能滞后。
