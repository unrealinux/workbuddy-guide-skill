# Changelog

本文件记录本仓库（Skill 层）的变化。正文变化跟随上游，见 `skills/workbuddy-guide/references/.source.json` 的 `commit`。

版本号在两处必须一致，`npm run check` 会校验：

- `package.json` → `version`
- `skills/workbuddy-guide/SKILL.md` → `metadata.version`

## 1.0.0 — 2026-09-29

首个公开发布。

### Added

- `skills/workbuddy-guide/SKILL.md`：意图 → 章节文件的路由表，附回答形状与边界声明
- `skills/workbuddy-guide/references/`：上游 49 篇正文本地化（28 章 + 附录 + 8 个社区案例）
- `skills/workbuddy-guide/scripts/sync.mjs`：增量同步上游，幂等；取清单降级顺序 GitHub API → git 浅克隆 → `.tree.json` → 本地重建
- `package.json`：pi 包清单（`pi.skills`）、`pi-package` 关键词、`npm run sync` / `sync:check` / `check`
- `scripts/check-version.mjs`：校验版本一致、frontmatter 必填字段、description ≤ 1024 字符
- `scripts/build-zip.mjs` + `npm run zip` / `npm run release`：零依赖、可复现（固定时间戳 + 排序条目）的 zip，解压后为 `workbuddy-guide/`，内含 `LICENSE` / `NOTICE.md` / `INSTALL.md`，可直接转发
- GitHub Release 附件：`workbuddy-guide-skill-1.0.0.zip`（约 229 KB，59 个条目）
- `README.en.md`、`CHANGELOG.md`

### Changed

- 目录结构从根目录平铺改为 `skills/workbuddy-guide/` —— pi 只在包的 `skills/` 下发现 Skill，根目录的 `SKILL.md` 不会被加载
- `SKILL.md` frontmatter：删掉非标准字段 `whenToUse`（并入 `description`），`description` 增加英文触发词
- `LICENSE`：按 MIT 要求原样保留上游版权声明 `Copyright (c) 2026 WorkBuddy Guide Contributors`
- `README.md`：三种安装方式、3 个示例问答、更新与同步说明
- `references/INDEX.md`：附录/指南/案例不再显示「第 undefined 章」
