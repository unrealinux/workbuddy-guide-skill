# Changelog

本文件记录本仓库（Skill 层）的变化。正文变化跟随上游，见 `skills/workbuddy-guide/references/.source.json` 的 `commit`。

版本号在两处必须一致，`npm run check` 会校验：

- `package.json` → `version`
- `skills/workbuddy-guide/SKILL.md` → `version`

## 2.0.1 — 2026-09-29

### Changed

- 目录压平到两级（平台限制「根目录/二级目录/文件」）：正文从 `references/<分册>/chapters/` 移到 `workbuddy/`、`doubao/`，与 `INDEX.md`、`.source.json` 同层
- `scripts/sync.mjs` / `sync-doubao.mjs` 的 `REF_DIR` 与生成的 `INDEX.md` 链接同步去掉 `chapters/` 前缀
- SKILL.md、README、packaging 说明书、NOTICE 的路径与目录树同步更新
- 版本递增到 2.0.1

### Added

- 单册包：`npm run zip:workbuddy` / `zip:doubao`（`--only`），产物 `ai-work-assistant-tencent-*`、`ai-work-assistant-bytedance-*`；SKILL.md 由合集版裁剪生成，元数据在 `packaging/volumes.json`
- `check-version.mjs` 校验单册包元数据（字段齐全、名称字符集、description ≤ 1024）

## 2.0.0 — 2026-09-29

### Added

- 并入《豆包工作蓝皮书》（AlephAITech/DoubaoWorkGuide，MIT，50 篇）：`references/doubao/`，新增 `scripts/sync-doubao.mjs`，`npm run sync:doubao` / `sync:doubao:check`
- `SKILL.md` 新增「先判断产品，再路由」：WorkBuddy 与豆包工作两套路由表 + 豆包通读路线

### Changed

- 目录改为分册结构：`references/workbuddy/`（原 `references/`）+ `references/doubao/`
- `scripts/sync.mjs` 的 `REF_DIR` 指向 `references/workbuddy/`
- 展示名改为「AI办公助手指南合集」/ `AI-Office-Assistant-Playbook`；`description*` 加入豆包关键词
- README、packaging 说明书、NOTICE 覆盖两本蓝皮书与两个上游归属
- 打包产物改名跟随技能名：`ai-work-assistant-playbook-<version>[-skillpay].zip`（npm 包名仍是 `workbuddy-guide-skill`）

## 1.0.5 — 2026-09-29

### Changed

- 技能名 `workbuddy-playbook` → `ai-work-assistant-playbook`，`name` 字段也不再含 `workbuddy`（平台禁词）；目录、解压目录、`/skill:` 调用名、sync 脚本路径同步更新
- 版本递增到 1.0.5

## 1.0.4 — 2026-09-29

### Changed

- 市场展示名去掉 `WorkBuddy` / `buddy` 词汇（平台禁词）：`AI工作助手使用秘笈` / `AI-Work-Assistant-Playbook`
- 版本递增到 1.0.4（平台要求新包版本严格大于已上传版本）

## 1.0.3 — 2026-09-29

### Fixed

- 平铺包补齐文档引用的资源：加入 `scripts/sync.mjs` 与 `references/.source.json`，只剔除 `.tree.json` 缓存（平台校验「文档引用的文件必须存在」）
- `SKILL.md` / `NOTICE.md` 的文件路径改为技能目录相对路径，在仓库与两种 zip 布局下都能解析
- 版本号递增到 1.0.3（平台要求新包版本严格大于已上传版本）

## 1.0.2 — 2026-09-29

### Added

- `SKILL.md` frontmatter：`version`、`display_name`、`display_name_en`、`description_zh`、`description_en`，满足 WorkBuddy / SkillPay 平台上传的解析要求

### Changed

- 版本号从 `metadata.version` 移到顶层 `version`（平台只读顶层）；`scripts/check-version.mjs` 同步校验这 5 个平台字段
- 技能名 `workbuddy-guide` → `workbuddy-playbook`，避开 WorkBuddy 平台已占用的名称（目录同步改为 `skills/workbuddy-playbook/`，解压目录、`/skill:` 调用名一并更新）
- `display_name` 改为「WorkBuddy使用秘笈」，两个展示名去掉空格（平台只允许中英文、数字、`-`、`—`）；`check-version.mjs` 增加字符集校验

## 1.0.1 — 2026-09-29

### Added

- `packaging/README.md` / `packaging/README.en.md`：随包发布的中文/英文说明书（安装位置表、加载自检、示例问法、更新/卸载、排障表、目录结构、许可），构建时自动注入版本号与日期

### Changed

- zip 内不再只有 695 字节的 `INSTALL.md`，改为自带完整中英文说明书：`README.md`、`README.en.md`

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
