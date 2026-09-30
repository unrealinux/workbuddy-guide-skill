---
name: workbuddy-guide
description: "Use when the question is about WorkBuddy (腾讯 WorkBuddy / WorkBuddy 工作助手) — how to use it, or what 《WorkBuddy 实战蓝皮书》 says — or when you need an AI work-assistant workflow for Office docs, meetings, news digests, knowledge bases, investing, video, self-media growth or GEO. Chinese triggers: WorkBuddy 怎么用, 教程/安装/下载/登录, 加载 Skill, 专家团, 连接器, 小程序/微信/飞书/钉钉助理, 接入外部 API, 自动化任务, 多 Agent 系统设计, 工作流可靠性, 岗位/行业路线图, 场景速查, 蓝皮书章节, 社区案例. English triggers: WorkBuddy how-to/tutorial/install/login, load a Skill, expert teams, connector/MCP, WeChat/Feishu/DingTalk assistant, external API integration, scheduled automation, multi-agent design, workflow reliability, role & industry roadmaps, community cases. Also load to build or refactor an open-source product guide site (VitePress + SEO + case submissions + organic traffic) with this repo as the reference implementation. Do NOT load for generic LLM/agent questions unrelated to WorkBuddy/this repo. Ships the full 28-chapter text locally, so no network read is needed."
license: MIT
metadata:
  version: "1.0.1"
  upstream: "AlephAITech/WorkBuddyGuide"
  upstreamLicense: "MIT (Copyright (c) 2026 WorkBuddy Guide Contributors)"
  upstreamCommit: "e510a2c8"
  syncedAt: "2026-09-26"
  requires: "正文无依赖；仅 skills/workbuddy-guide/scripts/sync.mjs 需要 Node.js 20+"
---

# WorkBuddy 蓝皮书 — 本地知识库

上游 <https://github.com/AlephAITech/WorkBuddyGuide>（3.2k star，MIT）的**完整正文**已同步到本 Skill 的 `references/chapters/`。回答 WorkBuddy 问题时**先查本地文件，不要凭记忆编**。

## 0. 核心原则（不可违背）

1. **先路由，再回答**：按下面的路由表读**最相关的 1–2 个文件**再开口。禁止不读文件就描述 WorkBuddy 的界面、按钮、菜单或价格。
2. **标注出处**：回答里给出章节号与文件路径，例如"见第 7 章 连接器（`chapters/part1-ch07.md`）"。用户能顺着点回原文。
3. **时效性声明**：上游整理于 2026 年，产品界面/价格/权限会变。涉及这些内容时加一句"以 WorkBuddy 官方渠道为准"，并给出原文链接。
4. **不编造操作路径**：原文没写的按钮名、菜单项、API 参数，不要补。只写"原文未覆盖，建议在官方渠道确认"。
5. **区分三层**：官方文档 / 本蓝皮书（社区） / 案例投稿（个人经验）。案例不是官方保证，引用时说清是哪一层。
6. **中文回答**，除非用户要求英文（英文入口 `README_en.md`、`CONTRIBUTING_en.md` 在上游）。

## 1. 路由表（意图 → 读哪个文件）

### 想用 WorkBuddy（第一篇 · 使用手册）

| 用户在问 | 读 |
| --- | --- |
| 这是什么 / 能干什么 / 与聊天机器人的区别 | `references/chapters/part1-ch01.md` |
| 下载、安装、登录、更新 | `references/chapters/part1-ch02.md` |
| 主界面、任务、工作区 | `references/chapters/part1-ch03.md` |
| 第一次跑通一个任务（照着做） | `references/chapters/part1-ch04.md` |
| 怎么装/加载一个 Skill | `references/chapters/part1-ch05.md` |
| 专家、专家团（多角色协作） | `references/chapters/part1-ch06.md` |
| 连接器（把外部系统接进来） | `references/chapters/part1-ch07.md` |
| 小程序、微信/飞书/钉钉助理 | `references/chapters/part1-ch08.md` |
| 飞书端到端实战（含权限、事件回调、发布） | `references/chapters/part1-ch08-2.md` |
| 接入外部 API / 自定义工具 | `references/chapters/part1-ch09.md` |
| 自动化任务（定时、触发、任务模板） | `references/chapters/part1-ch10.md` |
| 想先理解整体设计（AI 工作系统是什么） | `references/chapters/part1-extra.md` |

### 想解决具体工作（第二篇 · 案例篇）

| 用户在问 | 读 |
| --- | --- |
| Word / Excel / PPT 三件套 | `references/chapters/part2-ch11.md` |
| 整理桌面/文件、批量改名归档 | `references/chapters/part2-ch12.md` |
| 远程控制电脑、不在电脑前干活 | `references/chapters/part2-ch13.md` |
| 生活助手、减少琐碎 | `references/chapters/part2-ch14.md` |
| 资讯整合、每日通知 | `references/chapters/part2-ch15.md` |
| 收藏/知识库"能再次用起来" | `references/chapters/part2-ch16.md` |
| 会议纪要、会后跟进 | `references/chapters/part2-ch17.md` |
| 投资分析日常化 | `references/chapters/part2-ch18.md` |
| AI 视频（一句话召唤团队） | `references/chapters/part2-ch19.md` |
| 自媒体增长闭环 | `references/chapters/part2-ch20.md` |
| GEO / 让 AI 搜索引用你 | `references/chapters/part2-ch21.md` |

### 想做深 / 做团队级（第三、四篇）

| 用户在问 | 读 |
| --- | --- |
| 把书/视频蒸馏成可执行 Skill | `references/chapters/part3-ch22.md` |
| 更多零散实操玩法 | `references/chapters/part3-ch23.md` |
| 多 Agent 系统设计 | `references/chapters/part3-ch24.md` |
| 自动化工作流可靠性、失败回退 | `references/chapters/part3-ch25.md` |
| 某个岗位怎么用（路线图） | `references/chapters/part4-ch26.md` |
| 某个行业怎么落地 | `references/chapters/part4-ch27.md` |
| 直接要提示词模板 | `references/chapters/appendix-a.md` |
| 按场景速查 | `references/chapters/appendix-b.md` |

### 其他

| 用户在问 | 读 |
| --- | --- |
| 该按什么顺序读 | `references/chapters/guide-reading.md` → `references/INDEX.md` |
| 全部章节清单（含体积、重复章节号说明） | `references/INDEX.md` |
| 真实落地案例（东莞城市指南、茶叶店销售分析、Vibe 简历…） | `references/chapters/case-*.md`（8 个） |
| 想投稿一个案例 | `references/chapters/guide-case-contributing.md` |
| 共建规则、PR 流程 | `references/chapters/guide-contributing.md` |
| **想自己搭一个同样的文档站**（VitePress + SEO + 流量管道 + 投稿漏斗） | `references/playbook-guide-site.md` |

## 2. 回答形状

1. **先给可执行的一步**（点哪个入口/装哪个 Skill/复制哪段提示词），再解释。
2. **引用章节号 + 文件路径**。
3. 涉及界面截图时：原文用 `![](https://raw.githubusercontent.com/...)` 指向上游图片，可以直接把该链接给用户。
4. 超过 1 步的操作写成编号列表，每步一个动作。
5. 一次只读 1–2 章。第 18 章（投资，31 KB）和飞书实战（17 KB）很大，只截取相关小节。

## 3. 仓库地图

```text
workbuddy-guide/
├─ SKILL.md                      # 本文件：原则 + 路由表
├─ references/
│  ├─ INDEX.md                   # 49 篇章节索引（章节号 → 文件）
│  ├─ .source.json               # 同步版本 + 每个上游文件的内容哈希
│  ├─ .tree.json                 # 文件清单缓存（API 限流时的降级用）
│  ├─ playbook-guide-site.md     # 手写：如何复刻这个文档站的做法
│  └─ chapters/                  # 上游正文，49 个文件，约 500 KB
│     ├─ part1-ch01..ch10, part1-extra        # 第一篇 使用手册
│     ├─ part2-ch11..ch21                     # 第二篇 案例篇
│     ├─ part3-ch22..ch25                     # 第三篇 进阶篇
│     ├─ part4-ch26..ch27                     # 第四篇 岗位与行业
│     ├─ appendix-a, appendix-b               # 附录
│     ├─ case-*.md                            # 8 个社区投稿案例
│     ├─ guide-reading / guide-contributing / guide-case-contributing
│     └─ index-bluebook / index-cases / part*-index / appendix-index
└─ scripts/sync.mjs              # 重新同步上游（增量、幂等、带重试）
```

## 4. 更新本地正文

```bash
node scripts/sync.mjs --check   # 上游有新提交吗（API 限流时自动改用内容哈希，不需要 API）
node scripts/sync.mjs           # 增量同步（只写变化的文件，幂等）
node scripts/sync.mjs --force   # 忽略内容对比，强制重写全部章节
node scripts/sync.mjs --dry     # 只看映射，不写盘
GITHUB_TOKEN=xxx node scripts/sync.mjs   # 带 token 可避免 GitHub API 60 次/小时的限流
```

已同步 `commit e510a2c8`。同步时自动改写：图片/视频 → **jsDelivr 并钉到该 commit**（比 raw 快，raw 被封锁时也能用）、跨章节链接 → 本地文件名、站内 `/xxx` → workbuddy.homes。

取文件清单的降级顺序：GitHub API → git 浅克隆 → 本地缓存 `.tree.json` → 从已有文件表头重建（最后一档发现不了上游新增/删除的章节）。**不要手改 `references/chapters/`**，会被覆盖；要改就改 `scripts/sync.mjs`。

## 5. 边界

- **不收录** 上游 178 MB 的截图/视频本体，只保留 jsDelivr 链接——打开图片需要联网；host 不可达时可换回 `raw.githubusercontent.com`（见 `scripts/sync.mjs` 的 `MEDIA_BASE`）。
- **上游章节号有两套**：目录编号从第 8 章起比正文标题小 1（目录里有两个"第 8 章"），正文标题是连续的 1–28 章。文件名沿用目录编号（`references/chapters/part1-ch08-2.md` = 正文第 8 章 飞书实战），**回答时以 `references/INDEX.md` 里的章节号为准**。
- 上游已 3 个月无实质更新（最后推送 2026-09-18），产品细节可能滞后；用 `--check` 确认。
- 本 Skill 与 AlephAITech 无关联，非官方。上游 MIT，本 Skill 保留其版权与许可。
