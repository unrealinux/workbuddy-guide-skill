# workbuddy-guide

把 [AlephAITech/WorkBuddyGuide](https://github.com/AlephAITech/WorkBuddyGuide)（《WorkBuddy 实战蓝皮书》，MIT，3.2k star）**完整本地化**的 Agent Skill。

- 28 章正文 + 附录 + 8 个社区案例 → `skills/workbuddy-guide/references/chapters/`（49 个文件，约 500 KB）
- `SKILL.md` 只做**路由**（意图 → 读哪个文件），正文按需加载
- `sync.mjs` 增量同步上游，幂等、带重试

英文说明：[README.en.md](README.en.md)

## 效果示例

它不靠记忆回答，而是先把问题路由到原文的某一章，再带章节号引用：

| 你问 | 它会去读 | 回答里会有什么 |
| --- | --- | --- |
| “WorkBuddy 里 Skill 和 Prompt 有什么区别？” | 第 5 章 `references/chapters/part1-ch05.md` | 先给一步怎么做，再引「Skill 跟 Prompt 到底有什么区别」小节 |
| “怎么把公司系统接进来？连接器怎么建？” | 第 7 章 `references/chapters/part1-ch07.md` | MCP 是什么、加载与新建连接器的步骤，标章节号 |
| “开完会怎么自动跟进待办？” | 第 18 章 `references/chapters/part2-ch17.md` | 会前定决定 → 建腾讯会议 → 会后录音/转写的主线流程 |

界面、价格、权限这类会变的内容，回答会加一句“以 WorkBuddy 官方渠道为准”，并给出原文链接。

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
  ~/.agents/skills/workbuddy-guide
```

项目内安装就把目标换成 `<你的仓库>/.agents/skills/workbuddy-guide`。

**4. zip（不用命令行工具，可以直接转发）**

到 [Releases](https://github.com/unrealinux/workbuddy-guide-skill/releases/latest) 下载 `workbuddy-guide-skill-<版本>.zip`，解压到 Agent Skills 目录：

```bash
unzip workbuddy-guide-skill-1.0.0.zip -d ~/.agents/skills/
```

Windows PowerShell：

```powershell
Expand-Archive .\workbuddy-guide-skill-1.0.0.zip -DestinationPath "$env:USERPROFILE\.agents\skills"
```

解压后结构必须是 `~/.agents/skills/workbuddy-guide/SKILL.md`（多一层或少了都加载不到）。zip 里自带 `LICENSE`、`NOTICE.md`、`INSTALL.md`，收到 zip 的人不需要仓库也能装。

## 更新

```bash
pi update --extensions          # pi 包方式
git -C ~/.agents/skills/workbuddy-guide pull   # clone 方式
# zip 方式：重新下载覆盖解压（版本看 SKILL.md 的 metadata.version）
```

## 更新正文（蓝皮书上游有新提交时）

在本仓库内：

```bash
npm run sync:check              # 上游有变化吗（限流时自动改用内容哈希）
npm run sync                    # 增量同步，只写变化的文件
npm run sync -- --force         # 强制重写全部 49 篇
GITHUB_TOKEN=xxx npm run sync   # 带 token 解除 GitHub API 60 次/小时限流
```

等价于直接调用 `node skills/workbuddy-guide/scripts/sync.mjs [--check|--force|--dry]`。

同步时自动完成：图片/视频链接 → jsDelivr（钉到同步的 commit）；跨章节链接 → 本地文件名；站内 `/xxx` → workbuddy.homes。
取文件清单的降级顺序：GitHub API → git 浅克隆 → `.tree.json` 缓存 → 从已有文件表头重建。
`references/chapters/` 是生成物，**不要手改**——会被下次同步覆盖，要改就改 `sync.mjs`。

## 仓库结构

```text
workbuddy-guide-skill/
├─ package.json
├─ LICENSE / NOTICE.md / CHANGELOG.md
├─ scripts/                      # 发布工具：build-zip.mjs、check-version.mjs
└─ skills/
   └─ workbuddy-guide/
      ├─ SKILL.md                 # 路由表：意图 → 读哪个文件
      ├─ references/              # 49 篇正文 + 索引 + 同步缓存
      └─ scripts/sync.mjs         # 增量同步上游
```

## 为什么不是"把 49 个 md 丢进一个 prompt"

| 做法 | 问题 |
| --- | --- |
| 全部塞进 context | 约 500 KB 正文，浪费 token 且稀释注意力 |
| 只做一个摘要 | 丢掉"哪一章讲了什么"的可追溯性，容易编 |
| **本方案：路由 + 按需读** | 成本低，且每条回答都能指回原文章节 |

## 许可与归属

- 上游内容：MIT。上游 `LICENSE` 声明的版权人为 `Copyright (c) 2026 WorkBuddy Guide Contributors`，本仓库原样保留该声明。
- 本 Skill 的脚本、SKILL.md、`references/playbook-guide-site.md`：MIT。
- 本 Skill 与 AlephAITech 无隶属关系，非官方；产品功能、价格、权限等时效信息以官方渠道为准。
- 完整归属声明见 `NOTICE.md`。

## 已知限制

1. 不收录上游截图/视频本体（178 MB），只保留 jsDelivr 链接，看图需联网。
2. 上游有两套章节号：目录编号从第 8 章起比正文标题小 1，正文标题是连续的 1–28 章；文件名用目录编号，以 `references/INDEX.md` 为准。
3. 上游最后实质更新为 2026-09-18，产品细节可能滞后。
