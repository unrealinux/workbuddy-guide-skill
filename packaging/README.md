# AI 办公助手指南合集（v{{VERSION}}）

两本社区蓝皮书的完整正文 + 路由层，装成本地 Agent Skill：腾讯 WorkBuddy 与字节 豆包工作。回答时直接读本地原文，不靠模型记忆、不联网。

- 分册一 · WorkBuddy：28 章正文 + 附录 + 8 个社区案例，共 49 篇（约 540 KB）
- 分册二 · 豆包工作：50 篇（约 165 KB）
- 结构：`SKILL.md` 先判断产品，再按路由表（问题 → 读哪一篇）取用，正文按需加载，不占 context
- 回答带章节号/标题与文件路径，能回溯到原文

## 1. 安装

把 `ai-work-assistant-playbook/` 整个目录放到 agent 读取的技能目录下：

| 场景 | 目标位置 |
| --- | --- |
| 给本机所有项目用（推荐，跨工具） | `~/.agents/skills/` |
| 只给 pi 用 | `~/.pi/agent/skills/` |
| 只给某个项目用 | `<项目>/.agents/skills/` |

解压（macOS / Linux / Git Bash）：

```bash
unzip ai-work-assistant-playbook-{{VERSION}}.zip -d ~/.agents/skills/
```

Windows PowerShell：

```powershell
Expand-Archive .\ai-work-assistant-playbook-{{VERSION}}.zip -DestinationPath "$env:USERPROFILE\.agents\skills"
```

也可以不用 zip：

```bash
pi install git:github.com/unrealinux/workbuddy-guide-skill
git clone https://github.com/unrealinux/workbuddy-guide-skill ~/.agents/skills/ai-work-assistant-playbook
```

## 2. 验证装好了

1. 看文件在不在（少一层、多一层都会加载不到）：

   ```bash
   ls ~/.agents/skills/ai-work-assistant-playbook/SKILL.md
   ```

2. 在 agent 里问一句 WorkBuddy 或豆包工作的问题，看它有没有读 `workbuddy/` 或 `doubao/` 下的文件。
   pi 用户可以用 `/skill:ai-work-assistant-playbook <问题>` 强制加载。

3. 没反应时：确认技能目录名是 `ai-work-assistant-playbook`、与别的技能没有重名，然后重启 agent（技能列表在启动时扫描）。

## 3. 怎么用

直接问就行，不用先声明“用这个技能”。典型问法：

| 你问 | 它会读 | 你会看到 |
| --- | --- | --- |
| WorkBuddy 里 Skill 和 Prompt 有什么区别？ | 第 5 章 `workbuddy/part1-ch05.md` | 先给可执行的一步，再引原文对比小节 |
| 连接器怎么建？怎么把公司系统接进来？ | 第 7 章 `workbuddy/part1-ch07.md` | MCP 是什么 + 加载/新建连接器步骤，标章节号 |
| 豆包工作怎么建定时任务才不失败？ | `doubao/part1-10.md` | 建任务时的关键设置 + 稳定性注意事项 |
| 豆包和 WorkBuddy 该用哪个？ | 两边各读 1 篇 | 先按产品定位分层，再给各自适用场景 |

回答习惯：一次只读 1–2 篇；界面、价格、权限这类会变的内容会加“以官方渠道为准”并给原文链接；正文没有的操作步骤不会编。

## 4. 更新

重新下载 zip 覆盖解压，或 `git -C ~/.agents/skills/ai-work-assistant-playbook pull`（clone 安装的）。
当前版本看 `SKILL.md` 里的 `version`，变更见 `CHANGELOG.md`。

上游正文有更新时，用仓库里的两个脚本（需 Node.js 20+）：
`npm run sync:check` / `npm run sync`（WorkBuddy）、`npm run sync:doubao:check` / `npm run sync:doubao`（豆包）。

## 5. 卸载

删掉目录即可：`rm -rf ~/.agents/skills/ai-work-assistant-playbook`。Skill 不改动系统其它地方，没有残留注册项。

## 6. 排障

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| agent 完全不知道有这个技能 | 目录层级不对 | 必须是 `~/.agents/skills/ai-work-assistant-playbook/SKILL.md`；解压出了两层 `ai-work-assistant-playbook/ai-work-assistant-playbook/` 就删掉外层 |
| 提示技能重名 | 装了两份 | 只保留一处（比如同时存在 `git clone` 和 zip 解压的） |
| 回答很短、不引章节 | 没触发路由 | 问题里带上产品名（WorkBuddy / 豆包工作），或用 `/skill:ai-work-assistant-playbook` 强制加载 |
| 回答了错误的产品 | 没判产品就路由 | 直接说“我问的是豆包工作”或“我问的是 WorkBuddy” |
| 图片打不开 | 媒体本体没打进包（上游 178 MB / 700 MB） | 链接指向 jsDelivr 与 doubaowork.homes，需要联网 |
| 章节号对不上目录 | WorkBuddy 上游有两套编号 | 以 `workbuddy/INDEX.md` 为准：目录编号从第 8 章起比正文标题小 1 |

## 7. 目录结构

```text
ai-work-assistant-playbook/
├─ SKILL.md              # 产品判定 + 两套路由表
├─ README.md / README.en.md
├─ CHANGELOG.md
├─ LICENSE / NOTICE.md
├─ workbuddy/            # 49 篇（章节号、文件、体积见 INDEX.md）
│  ├─ INDEX.md
│  ├─ .source.json
│  └─ part1-ch01.md …
├─ doubao/               # 50 篇
│  ├─ INDEX.md
│  ├─ .source.json
│  └─ part1-01.md …
└─ scripts/
   ├─ sync.mjs           # WorkBuddy 同步
   └─ sync-doubao.mjs    # 豆包同步
```

## 8. 版本与许可

- 版本：`{{VERSION}}`（生成于 {{DATE}}）
- 正文来源均为 MIT：
  - AlephAITech/WorkBuddyGuide — `Copyright (c) 2026 WorkBuddy Guide Contributors`
  - AlephAITech/DoubaoWorkGuide — `Copyright (c) 2026 DoubaoWork Guide Contributors`
  - 两份声明均已原样保留
- 本 Skill 层：MIT，见 `LICENSE`；完整归属见 `NOTICE.md`
- 与 AlephAITech、腾讯 WorkBuddy 官方、豆包工作官方均无关联，非官方项目；产品界面/价格/权限以官方渠道为准
