# WorkBuddy 蓝皮书 Skill（v{{VERSION}}）

《WorkBuddy 实战蓝皮书》的完整正文 + 路由层，装成本地 Agent Skill。回答 WorkBuddy 问题时直接读本地原文，不靠模型记忆、不联网。

- 内容：28 章正文 + 附录 + 8 个社区案例，共 49 篇（约 540 KB）
- 结构：`SKILL.md` 只负责路由（问题 → 读哪一章），正文按需加载，不占 context
- 回答带章节号与文件路径，能回溯到原文

## 1. 安装

把 `workbuddy-guide/` 整个目录放到 agent 读取的技能目录下：

| 场景 | 目标位置 |
| --- | --- |
| 给本机所有项目用（推荐，跨工具） | `~/.agents/skills/` |
| 只给 pi 用 | `~/.pi/agent/skills/` |
| 只给某个项目用 | `<项目>/.agents/skills/` |

解压（macOS / Linux / Git Bash）：

```bash
unzip workbuddy-guide-skill-{{VERSION}}.zip -d ~/.agents/skills/
```

Windows PowerShell：

```powershell
Expand-Archive .\workbuddy-guide-skill-{{VERSION}}.zip -DestinationPath "$env:USERPROFILE\.agents\skills"
```

也可以不用 zip：

```bash
pi install git:github.com/unrealinux/workbuddy-guide-skill
git clone https://github.com/unrealinux/workbuddy-guide-skill ~/.agents/skills/workbuddy-guide
```

## 2. 验证装好了

1. 看文件在不在（少一层、多一层都会加载不到）：

   ```bash
   ls ~/.agents/skills/workbuddy-guide/SKILL.md
   ```

2. 在 agent 里问一句 WorkBuddy 的问题，看它有没有读 `references/chapters/` 下的文件并在回答里标章节号。
   pi 用户可以用 `/skill:workbuddy-guide <问题>` 强制加载。

3. 没反应时：确认技能目录名是 `workbuddy-guide`、与别的技能没有重名，然后重启 agent（技能列表在启动时扫描）。

## 3. 怎么用

直接问就行，不用先声明“用这个技能”。典型问法：

| 你问 | 它会读 | 你会看到 |
| --- | --- | --- |
| WorkBuddy 里 Skill 和 Prompt 有什么区别？ | 第 5 章 `references/chapters/part1-ch05.md` | 先给可执行的一步，再引原文对比小节 |
| 连接器怎么建？怎么把公司系统接进来？ | 第 7 章 `references/chapters/part1-ch07.md` | MCP 是什么 + 加载/新建连接器步骤，标章节号 |
| 开完会怎么自动跟进待办？ | 第 18 章 `references/chapters/part2-ch17.md` | 会前定决定 → 建腾讯会议 → 会后录音/转写 |

回答习惯：一次只读 1–2 章；界面、价格、权限这类会变的内容会加“以 WorkBuddy 官方渠道为准”并给原文链接；正文没有的操作步骤不会编。

## 4. 更新

重新下载 zip 覆盖解压，或 `git -C ~/.agents/skills/workbuddy-guide pull`（clone 安装的）。
当前版本看 `SKILL.md` 里的 `metadata.version`，变更见 `CHANGELOG.md`。

上游正文有更新时，用仓库里的 `scripts/sync.mjs`（需 Node.js 20+）：
`npm run sync:check` / `npm run sync`。

## 5. 卸载

删掉目录即可：`rm -rf ~/.agents/skills/workbuddy-guide`。Skill 不改动系统其它地方，没有残留注册项。

## 6. 排障

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| agent 完全不知道有这个技能 | 目录层级不对 | 必须是 `~/.agents/skills/workbuddy-guide/SKILL.md`；解压出了两层 `workbuddy-guide/workbuddy-guide/` 就删掉外层 |
| 提示技能重名 | 装了两份 | 只保留一处（比如同时存在 `git clone` 和 zip 解压的） |
| 回答很短、不引章节 | 没触发路由 | 问题里带上“WorkBuddy”，或用 `/skill:workbuddy-guide` 强制加载 |
| 图片打不开 | 图片本体没打进包（上游 178 MB） | 图片是 jsDelivr 链接，需要联网；当前网络打不开时可换成 `raw.githubusercontent.com` 同路径 |
| 章节号对不上目录 | 上游有两套编号 | 以 `references/INDEX.md` 为准：目录编号从第 8 章起比正文标题小 1 |

## 7. 目录结构

```text
workbuddy-guide/
├─ SKILL.md              # 路由表：问题 → 读哪个文件
├─ README.md / README.en.md
├─ CHANGELOG.md
├─ LICENSE / NOTICE.md
└─ references/
   ├─ INDEX.md           # 49 篇清单（章节号、文件、体积）
   ├─ .source.json       # 同步版本与内容哈希
   └─ chapters/          # 49 篇正文
```

## 8. 版本与许可

- 版本：`{{VERSION}}`（生成于 {{DATE}}）
- 正文来源：AlephAITech/WorkBuddyGuide，MIT，版权人 `Copyright (c) 2026 WorkBuddy Guide Contributors`，声明已原样保留
- 本 Skill 层：MIT，见 `LICENSE`；完整归属见 `NOTICE.md`
- 与 AlephAITech、腾讯 WorkBuddy 官方均无关联，非官方项目；产品界面/价格/权限以官方渠道为准
