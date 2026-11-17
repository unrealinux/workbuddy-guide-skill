# ai-work-assistant-playbook

把两本社区蓝皮书**完整本地化**的 Agent Skill：腾讯 WorkBuddy 与字节 豆包工作。

- [AlephAITech/WorkBuddyGuide](https://github.com/AlephAITech/WorkBuddyGuide)《WorkBuddy 实战蓝皮书》（MIT，3.2k star）→ 28 章 + 附录 + 8 个社区案例，49 个文件，约 500 KB
- [AlephAITech/DoubaoWorkGuide](https://github.com/AlephAITech/DoubaoWorkGuide)《豆包工作蓝皮书》（MIT）→ 50 篇，约 165 KB
- `SKILL.md` 先判断问的是哪个产品，再按**路由表**（意图 → 读哪个文件）取用，正文按需加载
- 两个 `sync.mjs` 各自增量同步上游，幂等、带重试

英文说明：[README.en.md](README.en.md)

## 效果示例

它不靠记忆回答，而是先判断产品、再路由到原文的某一篇，最后带出处引用：

| 你问 | 它会去读 | 回答里会有什么 |
| --- | --- | --- |
| “WorkBuddy 里 Skill 和 Prompt 有什么区别？” | 第 5 章 `workbuddy/part1-ch05.md` | 先给一步怎么做，再引「Skill 跟 Prompt 到底有什么区别」小节 |
| “连接器怎么建？怎么把公司系统接进来？” | 第 7 章 `workbuddy/part1-ch07.md` | MCP 是什么、加载与新建连接器的步骤，标章节号 |
| “豆包工作怎么建定时任务才不失败？” | `doubao/part1-10.md` | 建任务的关键设置 + 稳定性注意事项 |
| “豆包和 WorkBuddy 该用哪个？” | 两边各读 1 篇 | 先按产品定位分层，再给各自的适用场景 |

界面、价格、权限这类会变的内容，回答会加一句“以官方渠道为准”，并给出原文链接。

## 安装

四种方式，选一个即可。四种方式都会把正文一起装上，**不需要上游仓库、也不需要联网**就能回答。

**1. pi 包（推荐）**

```bash
pi install git:github.com/unrealinux/workbuddy-guide-skill
pi list          # 确认已装上
```

**2. npm**

```bash
npm install -g workbuddy-guide-skill   # 或 pi install npm:workbuddy-guide-skill
```

**3. 直接放进 Agent Skills 目录**

```bash
git clone https://github.com/unrealinux/workbuddy-guide-skill \
  ~/.agents/skills/ai-work-assistant-playbook
```

项目内安装就把目标换成 `<你的仓库>/.agents/skills/ai-work-assistant-playbook`。

**4. zip（不用命令行工具，可以直接转发）**

到 [Releases](https://github.com/unrealinux/workbuddy-guide-skill/releases/latest) 下载 `ai-work-assistant-playbook-<版本>.zip`，解压到 Agent Skills 目录：

```bash
unzip ai-work-assistant-playbook-*.zip -d ~/.agents/skills/
```

Windows PowerShell：

```powershell
Expand-Archive .\ai-work-assistant-playbook-*.zip -DestinationPath "$env:USERPROFILE\.agents\skills"
```

解压后结构必须是 `~/.agents/skills/ai-work-assistant-playbook/SKILL.md`（多一层或少了都加载不到）。包内自带中英文说明书 `README.md` / `README.en.md`，以及 `LICENSE`、`NOTICE.md`、`CHANGELOG.md`，收到 zip 的人不需要本仓库也能装能用。

## 更新

```bash
pi update --extensions          # pi 包方式
git -C ~/.agents/skills/ai-work-assistant-playbook pull   # clone 方式
# zip 方式：重新下载覆盖解压（版本看 SKILL.md 的 version）
```

## 更新正文（上游有新提交时）

在本仓库内：

```bash
npm run sync:check              # WorkBuddy 上游有变化吗
npm run sync                    # 增量同步，只写变化的文件
npm run sync:doubao:check       # 豆包上游有变化吗
npm run sync:doubao             # 增量同步豆包 50 篇
GITHUB_TOKEN=xxx npm run sync   # 带 token 解除 GitHub API 60 次/小时限流
```

等价于直接调用：

```bash
node skills/ai-work-assistant-playbook/scripts/sync.mjs [--check|--force|--dry]
node skills/ai-work-assistant-playbook/scripts/sync-doubao.mjs [--check|--force|--dry|--from x.json]
```

WorkBuddy 同步时：图片/视频 → jsDelivr（钉到 commit）、跨章节链接 → 本地文件名、站内 `/xxx` → workbuddy.homes。
豆包同步时：单个 `site-content.json` 拆成 50 篇、`/media/...` → doubaowork.homes 链接、站内组件 → 可读 markdown、重新生成 `INDEX.md`。

`workbuddy/` 与 `doubao/` 是生成物，**不要手改**——会被下次同步覆盖。

## 三种包

`npm run release` 一次出三种（各含平铺版与解压版）：

| 包 | 内容 | 上传名 |
| --- | --- | --- |
| 合集 | 两册 + 两个同步脚本，共 109 个文件 | `ai-work-assistant-playbook-<版本>-skillpay.zip` |
| 腾讯篇 | 仅 workbuddy/ + scripts/sync.mjs，56 个文件 | `ai-work-assistant-tencent-<版本>-skillpay.zip` |
| 字节篇 | 仅 doubao/ + scripts/sync-doubao.mjs，56 个文件 | `ai-work-assistant-bytedance-<版本>-skillpay.zip` |

单册包的 SKILL.md 由合集版裁剪生成（核心原则 + 该册路由 + 回答形状），frontmatter 换成单册名称与描述，元数据在 `packaging/volumes.json`。
`npm run zip:workbuddy` / `npm run zip:doubao` 可单独出。

## 仓库结构

```text
workbuddy-guide-skill/
├─ package.json
├─ LICENSE / NOTICE.md / CHANGELOG.md
├─ packaging/                    # 随 zip 分发的说明书（构建时注入版本号）
├─ scripts/                      # 发布工具：build-zip.mjs、check-version.mjs
└─ skills/
   └─ ai-work-assistant-playbook/
      ├─ SKILL.md                 # 产品判定 + 两套路由表
      ├─ workbuddy/               # 49 篇正文 + 索引 + 同步缓存（约 500 KB）
      │  └─ part1-ch01.md …       # 与 INDEX.md 同层，没有 chapters/ 子目录
      ├─ doubao/                  # 50 篇正文 + 索引 + 同步缓存（约 165 KB）
      │  └─ part1-01.md …
      └─ scripts/
         ├─ sync.mjs              # WorkBuddy 增量同步
         └─ sync-doubao.mjs       # 豆包增量同步
```

## 为什么不是"把 99 个 md 丢进一个 prompt"

| 做法 | 问题 |
| --- | --- |
| 全部塞进 context | 约 700 KB 正文，浪费 token 且稀释注意力 |
| 只做一个摘要 | 丢掉"哪一章讲了什么"的可追溯性，容易编 |
| **本方案：先判产品 + 路由 + 按需读** | 成本低，且每条回答都能指回原文章节 |

## 许可与归属

- 上游内容均为 MIT：
  - `WorkBuddy Guide Contributors` — Copyright (c) 2026，见 `LICENSE`
  - `DoubaoWork Guide Contributors` — Copyright (c) 2026，见 `LICENSE`
- 本 Skill 的脚本、SKILL.md、`workbuddy/playbook-guide-site.md`：MIT。
- 本 Skill 与 AlephAITech、腾讯、字节均无隶属关系，非官方；产品功能、价格、权限等时效信息以官方渠道为准。
- 完整归属声明见 `NOTICE.md`。

## 已知限制

1. 不收录上游截图/视频本体（WorkBuddy 约 178 MB，豆包约 700 MB），只保留链接，看图/视频需联网。
2. WorkBuddy 有两套章节号：目录编号从第 8 章起比正文标题小 1，文件名用目录编号，以 `workbuddy/INDEX.md` 为准。
3. 豆包不分章节号，按篇组织（使用篇 12 / 入门篇 6 / 场景篇 31），以 `doubao/INDEX.md` 为准。
4. 两本上游都可能在产品界面上滞后，用各自的 `--check` 确认。
