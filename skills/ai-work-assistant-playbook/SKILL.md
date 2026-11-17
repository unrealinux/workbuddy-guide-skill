---
name: ai-work-assistant-playbook
version: "2.0.1"
display_name: "AI办公助手指南合集"
display_name_en: "AI-Office-Assistant-Playbook"
description_zh: "AI 办公助手指南合集：腾讯 WorkBuddy 与字节 豆包工作怎么用。《WorkBuddy 实战蓝皮书》28 章 + 附录 + 8 个社区案例，《豆包工作蓝皮书》50 篇，共约 700 KB 正文装到本地，提问即判断产品并路由到对应章节，给出带章节号的可执行步骤。覆盖安装登录、加载 Skill、专家团、连接器/MCP、微信/飞书/钉钉助理、外部 API、Office 三件套、会议、资讯、知识管理、投研、视频、自媒体、定时任务、多 Agent 设计。"
description_en: "An AI office assistant guide collection: how to use Tencent WorkBuddy and ByteDance Doubao Work. Ships both playbooks' full text locally (28 chapters with appendices and 8 community cases, plus 50 Doubao Work articles), detects which product a question is about, routes to the right chapter, and answers with chapter-numbered, executable steps. Covers install and login, loading Skills, expert teams, connectors/MCP, WeChat/Feishu/DingTalk assistants, external APIs, Office docs, meetings, news digests, knowledge management, investing, video, self-media, scheduled tasks, and multi-agent design."
description: "Use when the question is about an AI office assistant — 腾讯 WorkBuddy or 字节 豆包工作 (Doubao Work) — how to use it, or what 《WorkBuddy 实战蓝皮书》/《豆包工作蓝皮书》 say. Covers install/login, loading Skills, expert teams, connectors/MCP, WeChat/Feishu/DingTalk assistants, Office docs, meetings, news digests, knowledge bases, investing, video, self-media growth, scheduled automation, multi-agent design, plus 30+ task recipes. Chinese triggers: WorkBuddy 怎么用, 豆包工作怎么用, 教程/安装/下载/登录, 加载 Skill, 专家团, 连接器, 小程序/微信/飞书/钉钉助理, 接入外部 API, 自动化任务, 多 Agent 系统设计, 工作流可靠性, 岗位/行业路线图, 场景速查, 蓝皮书章节, 社区案例. English triggers: WorkBuddy or Doubao Work how-to, tutorial, install, login, load a Skill, expert teams, connector/MCP, WeChat/Feishu/DingTalk assistant, external API integration, scheduled automation, multi-agent design, role & industry roadmaps, community cases. Do NOT load for generic LLM/agent questions unrelated to these products. Ships both books' full text locally, so no network read is needed."
license: MIT
metadata:
  upstream: "AlephAITech/WorkBuddyGuide + AlephAITech/DoubaoWorkGuide"
  upstreamLicense: "MIT (WorkBuddy Guide Contributors; DoubaoWork Guide Contributors)"
  upstreamCommit: "WorkBuddyGuide e510a2c8 / DoubaoWorkGuide a7f87fe4"
  syncedAt: "2026-09-26 / 2026-10-16"
  requires: "正文无依赖；仅 scripts/sync.mjs、scripts/sync-doubao.mjs 需要 Node.js 20+"
---

# AI 办公助手指南（合集）

两本蓝皮书的完整正文都在本地，不靠模型记忆：

- **分册一 · 腾讯 WorkBuddy**：<https://github.com/AlephAITech/WorkBuddyGuide>（3.2k star，MIT），28 章 + 附录 + 8 个社区案例 → `workbuddy/`
- **分册二 · 字节 豆包工作**：<https://github.com/AlephAITech/DoubaoWorkGuide>（MIT），50 篇 → `doubao/`

回答前先判断用户问的是哪个产品，再查对应分册的本地文件。

## 0. 核心原则（不可违背）

1. **先判断产品，再路由**：问的是腾讯 WorkBuddy 还是字节 豆包工作？判不出来就先问一句，别猜。两者都叫"AI 办公助手"，界面、连接器、能力完全不同。
2. **先路由，再回答**：按对应分册的路由表读**最相关的 1–2 个文件**再开口。禁止不读文件就描述界面、按钮、菜单或价格。
3. **标注出处**：回答里给出章节号/标题与文件路径，例如"见第 7 章 连接器（`workbuddy/part1-ch07.md`）"。
4. **时效性声明**：正文整理于 2026 年，产品界面/价格/权限会变。涉及这些内容时加一句"以官方渠道为准"，并给原文链接。
5. **不编造操作路径**：原文没写的按钮名、菜单项、API 参数，不要补。只写"原文未覆盖，建议在官方渠道确认"。
6. **区分三层**：官方文档 / 蓝皮书（社区实践） / 案例里的个人实测。案例不是官方保证，引用时说清是哪一层。
7. **中文回答**，除非用户要求英文。

## 1. 选哪个分册

| 用户提到 | 读 |
| --- | --- |
| WorkBuddy、腾讯、workbuddy.homes、《WorkBuddy 实战蓝皮书》 | 分册一 → `workbuddy/` |
| 豆包、豆包工作、doubaowork.homes、字节、《豆包工作蓝皮书》 | 分册二 → `doubao/` |
| 只说"AI 办公助手"，没提产品 | 先问一句用哪个；要对比就两边各读 1 篇 |

## 2. 分册一路由表：腾讯 WorkBuddy

### 想用 WorkBuddy（第一篇 · 使用手册）

| 用户在问 | 读 |
| --- | --- |
| 这是什么 / 能干什么 / 与聊天机器人的区别 | `workbuddy/part1-ch01.md` |
| 下载、安装、登录、更新 | `workbuddy/part1-ch02.md` |
| 主界面、任务、工作区 | `workbuddy/part1-ch03.md` |
| 第一次跑通一个任务（照着做） | `workbuddy/part1-ch04.md` |
| 怎么装/加载一个 Skill | `workbuddy/part1-ch05.md` |
| 专家、专家团（多角色协作） | `workbuddy/part1-ch06.md` |
| 连接器（把外部系统接进来） | `workbuddy/part1-ch07.md` |
| 小程序、微信/飞书/钉钉助理 | `workbuddy/part1-ch08.md` |
| 飞书端到端实战（含权限、事件回调、发布） | `workbuddy/part1-ch08-2.md` |
| 接入外部 API / 自定义工具 | `workbuddy/part1-ch09.md` |
| 自动化任务（定时、触发、任务模板） | `workbuddy/part1-ch10.md` |
| 想先理解整体设计（AI 工作系统是什么） | `workbuddy/part1-extra.md` |

### 想解决具体工作（第二篇 · 案例篇）

| 用户在问 | 读 |
| --- | --- |
| Word / Excel / PPT 三件套 | `workbuddy/part2-ch11.md` |
| 整理桌面/文件、批量改名归档 | `workbuddy/part2-ch12.md` |
| 远程控制电脑、不在电脑前干活 | `workbuddy/part2-ch13.md` |
| 生活助手、减少琐碎 | `workbuddy/part2-ch14.md` |
| 资讯整合、每日通知 | `workbuddy/part2-ch15.md` |
| 收藏/知识库"能再次用起来" | `workbuddy/part2-ch16.md` |
| 会议纪要、会后跟进 | `workbuddy/part2-ch17.md` |
| 投资分析日常化 | `workbuddy/part2-ch18.md` |
| AI 视频（一句话召唤团队） | `workbuddy/part2-ch19.md` |
| 自媒体增长闭环 | `workbuddy/part2-ch20.md` |
| GEO / 让 AI 搜索引用你 | `workbuddy/part2-ch21.md` |

### 想做深 / 做团队级（第三、四篇）

| 用户在问 | 读 |
| --- | --- |
| 把书/视频蒸馏成可执行 Skill | `workbuddy/part3-ch22.md` |
| 更多零散实操玩法 | `workbuddy/part3-ch23.md` |
| 多 Agent 系统设计 | `workbuddy/part3-ch24.md` |
| 自动化工作流可靠性、失败回退 | `workbuddy/part3-ch25.md` |
| 某个岗位怎么用（路线图） | `workbuddy/part4-ch26.md` |
| 某个行业怎么落地 | `workbuddy/part4-ch27.md` |
| 直接要提示词模板 | `workbuddy/appendix-a.md` |
| 按场景速查 | `workbuddy/appendix-b.md` |

### 其他

| 用户在问 | 读 |
| --- | --- |
| 该按什么顺序读 | `workbuddy/guide-reading.md` → `workbuddy/INDEX.md` |
| 全部章节清单（含体积、重复章节号说明） | `workbuddy/INDEX.md` |
| 真实落地案例（东莞城市指南、茶叶店销售分析、Vibe 简历…） | `workbuddy/case-*.md`（8 个） |
| 想投稿一个案例 | `workbuddy/guide-case-contributing.md` |
| 共建规则、PR 流程 | `workbuddy/guide-contributing.md` |
| **想自己搭一个同样的文档站**（VitePress + SEO + 流量管道 + 投稿漏斗） | `workbuddy/playbook-guide-site.md` |

## 3. 分册二路由表：字节 豆包工作

### 想用起来（使用篇 · 12 篇）

| 用户在问 | 读 |
| --- | --- |
| 这是什么 / 能干什么 / 和普通聊天有什么差别 | `doubao/part1-01.md` |
| 下载、安装、登录 | `doubao/part1-02.md` |
| 主界面、任务、项目的区别 | `doubao/part1-03.md` |
| 第一次跑通一个任务（照着做） | `doubao/part1-04.md` |
| 连接器怎么用 | `doubao/part1-05.md` |
| Skill 怎么选、怎么用 | `doubao/part1-06.md` |
| 工作伙伴 / 工作小队，什么时候直接用新任务 | `doubao/part1-07.md` |
| 手机操控电脑端 | `doubao/part1-08.md` |
| API 服务和连接器怎么选 | `doubao/part1-09.md` |
| 定时任务怎么建才稳定 | `doubao/part1-10.md` |
| 多 Agent（工作小队）怎么用 | `doubao/part1-11.md` |
| 要现成的指令/提示词模板 | `doubao/part1-12.md` |

### 日常小事（入门篇 · 6 篇）

| 用户在问 | 读 |
| --- | --- |
| 一份材料接着做 Word / Excel / PPT | `doubao/part2-01.md` |
| 飞书端到端实战（读文档、写回飞书文档） | `doubao/part2-02.md` |
| 整理桌面 / 动文件前该注意什么 | `doubao/part2-03.md` |
| 出门后用手机接着跑电脑任务 | `doubao/part2-04.md` |
| 生活琐事（生活助手） | `doubao/part2-05.md` |
| 每天早上自动收到资讯简报 | `doubao/part2-06.md` |

### 具体工作场景（场景篇 · 5 类 31 个任务）

**个人提效**（`doubao/part3-personal-*`）

| 用户在问 | 读 |
| --- | --- |
| 收件箱 / 邮件里挑出今天必须处理的事 | `doubao/part3-personal-01.md` |
| 会议：会前准备到待办落地 | `doubao/part3-personal-02.md` |
| Word 校对润色到排版交付 | `doubao/part3-personal-03.md` |
| Excel 数据分析 | `doubao/part3-personal-04.md` |
| 临时调研到正式报告 | `doubao/part3-personal-05.md` |
| 自动总结工作日报 | `doubao/part3-personal-06.md` |
| 快速读一本书、蒸馏技能 | `doubao/part3-personal-07.md` |
| 做个人网站包装自己 | `doubao/part3-personal-08.md` |

**自媒体**（`doubao/part3-media-*`）

| 用户在问 | 读 |
| --- | --- |
| 选题：热点、同行、本周写什么 | `doubao/part3-media-01.md` |
| 从热点到公众号成稿 | `doubao/part3-media-02.md` |
| 一份内容改成多平台版本 | `doubao/part3-media-03.md` |
| 长文转口播与分镜 | `doubao/part3-media-04.md` |
| 音视频转写、字幕、高光切片 | `doubao/part3-media-05.md` |
| 从评论区找下一篇、复盘 | `doubao/part3-media-06.md` |
| 个人 IP 做 GEO 体检 | `doubao/part3-media-07.md` |
| 公众号爆款转短视频 | `doubao/part3-media-08.md` |

**知识管理**（`doubao/part3-knowledge-*`）

| 用户在问 | 读 |
| --- | --- |
| 随手收藏到以后能搜到 | `doubao/part3-knowledge-01.md` |
| 重复文件、冲突版本看差异 | `doubao/part3-knowledge-02.md` |
| 项目结束沉淀文件/决策/交付物 | `doubao/part3-knowledge-03.md` |
| 把飞书知识库/老同事经验变成可复用 Skill | `doubao/part3-knowledge-04.md` |
| 一句话查企业制度并带出处 | `doubao/part3-knowledge-05.md` |
| 把大批提示词/资料重新归类 | `doubao/part3-knowledge-06.md` |
| 找出过期知识并找 Owner 确认 | `doubao/part3-knowledge-07.md` |

**电商**（`doubao/part3-ecommerce-*`）

| 用户在问 | 读 |
| --- | --- |
| 一张产品原图 → 整套主图 | `doubao/part3-ecommerce-01.md` |

**金融研究**（`doubao/part3-finance-*`）

| 用户在问 | 读 |
| --- | --- |
| 收盘后复盘 → 明天研究清单 | `doubao/part3-finance-01.md` |
| 财报：先看增长再看增长质量 | `doubao/part3-finance-02.md` |
| 第一次研究一家公司（商业模式 + 八种追问） | `doubao/part3-finance-03.md` |
| 筛选到估值（统一口径再比较） | `doubao/part3-finance-04.md` |
| 股东、管理层、治理结构 | `doubao/part3-finance-05.md` |
| 多空分歧、研报事实审计 | `doubao/part3-finance-06.md` |
| 从 K 线图做投研评审会 | `doubao/part3-finance-07.md` |

> 上面的 `doubao/part3-*.md` 都在 `doubao/` 下。

### 其他

| 用户在问 | 读 |
| --- | --- |
| 该按什么顺序读 / 想通读全文 | 本文件第 4 节 + `doubao/INDEX.md` |
| 全部章节清单（含在线链接、体积） | `doubao/INDEX.md` |
| 这个蓝皮书/网站本身怎么做出来的 | 上游 README（仓库根目录） |

## 4. 通读路线


用户要"完整读完/系统学习"时，按顺序读，**一次一到两篇**，读完一篇把标题和要点复述一句再继续：

1. 使用篇 `doubao/part1-01` → `doubao/part1-12`：能力边界、安装、界面、首个任务、连接器、Skill、小队、手机、API、定时任务、多 Agent、指令模板。
2. 入门篇 `doubao/part2-01` → `doubao/part2-06`：Office 三件套、飞书、文件整理、远程任务、生活事务、资讯简报。
3. 场景篇 `doubao/part3-index` → 按 `personal` → `media` → `knowledge` → `ecommerce` → `finance` 的顺序读 31 个任务。

通读时不要一次把全部 50 个文件塞进上下文；读一篇、答一篇，需要时再回 `doubao/INDEX.md` 定位。

## 5. 回答形状

1. **先给可执行的一步**（点哪个入口/装哪个 Skill/复制哪段提示词），再解释。
2. **引用章节号 + 文件路径**。
3. 涉及界面截图时：原文用 `![](https://raw.githubusercontent.com/...)` 指向上游图片，可以直接把该链接给用户。
4. 超过 1 步的操作写成编号列表，每步一个动作。
5. 一次只读 1–2 章。第 18 章（投资，31 KB）和飞书实战（17 KB）很大，只截取相关小节。

## 6. 仓库地图

```text
ai-work-assistant-playbook/
├─ SKILL.md                      # 本文件：产品判定 + 两套路由表 + 通读路线
├─ workbuddy/                    # 分册一：腾讯 WorkBuddy（49 个文件，约 500 KB）
│  ├─ INDEX.md                   # 章节索引（章节号 → 文件）
│  ├─ .source.json               # 同步版本 + 每个上游文件的内容哈希
│  ├─ .tree.json                 # 文件清单缓存（API 限流时的降级用）
│  ├─ playbook-guide-site.md     # 手写：如何复刻这个文档站的做法
│  └─ part1-ch01.md …            # 28 章 + 附录 + 8 个案例 + 导读
├─ doubao/                       # 分册二：字节 豆包工作（50 个文件，约 165 KB）
│  ├─ INDEX.md                   # 索引（标题 → 文件 + 在线链接）
│  ├─ .source.json               # 同步版本 + 每篇正文的内容哈希
│  └─ part1-01.md …              # 使用篇 / 入门篇 / 场景篇
└─ scripts/
   ├─ sync.mjs                   # 重新同步 WorkBuddy 上游（增量、幂等、带重试）
   └─ sync-doubao.mjs            # 重新同步豆包上游（拆单文件 site-content.json）
```

## 7. 更新本地正文

WorkBuddy（上游是 markdown 树）：

```bash
node scripts/sync.mjs --check   # 上游有新提交吗（API 限流时自动改用内容哈希）
node scripts/sync.mjs           # 增量同步（只写变化的文件，幂等）
node scripts/sync.mjs --force   # 强制重写全部章节
node scripts/sync.mjs --dry     # 只看映射，不写盘
```

豆包（上游是单个 site-content.json，脚本负责拆章、改写媒体链接、生成 INDEX）：

```bash
node scripts/sync-doubao.mjs --check
node scripts/sync-doubao.mjs
node scripts/sync-doubao.mjs --force
node scripts/sync-doubao.mjs --from x.json   # 离线：用本地 site-content.json 生成
```

`GITHUB_TOKEN=xxx` 可避免 GitHub API 60 次/小时的限流。已同步 commit：WorkBuddyGuide `e510a2c8`、DoubaoWorkGuide `a7f87fe4`。

**不要手改 `workbuddy/`、`doubao/` 下的正文**，会被覆盖；要改就改对应的 sync 脚本。

## 8. 边界

- **不收录** 上游的截图/视频本体：WorkBuddy 保留 jsDelivr 链接（原文 178 MB），豆包保留 doubaowork.homes 链接（原文约 700 MB）。打开图片/视频需要联网。
- **WorkBuddy 章节号有两套**：目录编号从第 8 章起比正文标题小 1，以 `workbuddy/INDEX.md` 为准。
- **豆包不分章节号**，按篇组织（使用篇 12 / 入门篇 6 / 场景篇 31），以 `doubao/INDEX.md` 为准。
- 两本上游都可能在产品界面/价格上滞后；用各自的 `--check` 确认。
- 本 Skill 与 AlephAITech、腾讯、字节均无关联，非官方。上游 MIT，本 Skill 保留其版权与许可。
