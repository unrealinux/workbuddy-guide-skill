# 来源与归属

本仓库是一个 **Agent Skill** 形态的本地知识库，正文内容来自上游开源项目：

- 上游仓库：[AlephAITech/WorkBuddyGuide](https://github.com/AlephAITech/WorkBuddyGuide)
- 上游许可：MIT
- 同步版本：commit `e510a2c8`（同步时间见 `references/.source.json`）
- 上游站点：[https://workbuddy.homes](https://workbuddy.homes/)

## 本仓库做了什么

- 把上游 28 章正文 + 附录 + 8 个社区案例（49 个文件）同步到 `skills/workbuddy-guide/references/chapters/`
- 新增 `skills/workbuddy-guide/SKILL.md`：只做**意图路由**（问什么 → 读哪个文件），正文按需加载
- 新增 `skills/workbuddy-guide/scripts/sync.mjs`：把上游 Markdown 增量同步到本地，幂等、带重试；同步时自动改写图片/视频链接为 jsDelivr 并钉到该 commit，跨章节链接改写为本地文件名
- 上游 MIT 许可与版权声明予以保留，见 `LICENSE`

## 边界声明

- 本仓库与 AlephAITech、与腾讯 WorkBuddy 官方**均无关联**，非官方项目
- 不收录上游约 178 MB 的截图与视频本体，只保留 jsDelivr 链接（查看图片需要联网）
- 上游正文整理于 2026 年，产品界面、价格、权限可能已变化，以 WorkBuddy 官方渠道为准

## 版权

- 上游正文与图片：© AlephAITech/WorkBuddyGuide 贡献者，MIT
- 本仓库的 Skill 层（`skills/workbuddy-guide/SKILL.md`、`skills/workbuddy-guide/scripts/sync.mjs`、本文件）：© 2026 xieyingfei，MIT
