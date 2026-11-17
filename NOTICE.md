# 来源与归属

本仓库是一个 **Agent Skill** 形态的本地知识库，正文内容来自两个上游开源项目，均为 MIT：

| 上游 | 许可 | 版权人 | 同步 commit | 站点 |
| --- | --- | --- | --- | --- |
| [AlephAITech/WorkBuddyGuide](https://github.com/AlephAITech/WorkBuddyGuide)《WorkBuddy 实战蓝皮书》 | MIT | `Copyright (c) 2026 WorkBuddy Guide Contributors` | `e510a2c8` | <https://workbuddy.homes> |
| [AlephAITech/DoubaoWorkGuide](https://github.com/AlephAITech/DoubaoWorkGuide)《豆包工作蓝皮书》 | MIT | `Copyright (c) 2026 DoubaoWork Guide Contributors` | `a7f87fe4` | <https://doubaowork.homes> |

同步时间与每个文件的内容哈希记录在各分册目录的 source 状态文件里。

## 本仓库做了什么

- 把 WorkBuddy 上游 28 章正文 + 附录 + 8 个社区案例（49 个文件）同步到 workbuddy 分册目录
- 把豆包上游单个 site-content.json（58 个节点）拆成 50 篇正文到 doubao 分册目录
- 新增 SKILL.md：先判断产品，再按**意图路由**（问什么 → 读哪个文件）取用，正文按需加载；单册包则直接按该册路由表取用
- 新增两个同步脚本（scripts 目录）：WorkBuddy 上游 Markdown 增量同步，幂等、带重试，同步时自动改写图片/视频链接为 jsDelivr 并钉到该 commit、跨章节链接改写为本地文件名；豆包上游拆章、改写 /media/ 与站内组件、生成索引
- 上游 MIT 许可与版权声明予以保留，见 LICENSE

## 边界声明

- 本仓库与 AlephAITech、腾讯 WorkBuddy 官方、豆包工作官方**均无关联**，非官方项目
- 不收录上游截图与视频本体（WorkBuddy 约 178 MB、豆包约 700 MB），只保留 jsDelivr / doubaowork.homes 链接（查看需联网）
- 上游正文整理于 2026 年，产品界面、价格、权限可能已变化，以各产品官方渠道为准

## 版权

- 上游正文与图片：MIT，版权人见上表，本仓库原样保留
- 本仓库的 Skill 层（SKILL.md、scripts 目录下的同步脚本、本文件）：© 2026 xieyingfei，MIT
