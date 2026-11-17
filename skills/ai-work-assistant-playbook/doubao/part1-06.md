<!-- 由 scripts/sync.mjs 自动生成，请勿手改；改上游或改脚本。 -->

> 在线: [豆包工作的 Skill 怎么选，怎么用](https://doubaowork.homes/#/p/471007565e980292) · 上游: [`site/content/site-content.json`](https://github.com/AlephAITech/DoubaoWorkGuide/blob/main/site/content/site-content.json) · 同步自 `a7f87fe4`

# 豆包工作的 Skill 怎么选，怎么用

## Skill 是什么

豆包工作 本身负责理解任务和组织执行；Skill 则是一组可复用的说明、脚本、参考资料和资源，告诉 Agent 某类任务应该怎样做、调用什么工具、交付什么格式。

Anthropic 在 2025 年 10 月正式推出 Agent Skills，2025 年 12 月将其发布为开放标准。

一个最标准的 Skill，大概长这样：

```Plain Text
my-skill/
├── SKILL.md
├── scripts/
│   └── check.py
├── references/
│   └── guide.md
└── assets/
    └── template.pptx
```

其中只有 `SKILL.md` 是必须的。

```Markdown
---
name: tech-article-writing
description: 用于撰写 AI 产品、模型评测和科技行业相关文章
---

收到写作任务后：

1. 先确认文章核心角度
2. 查找一手资料
3. 对核心事实交叉验证
4. 根据用户写作风格完成初稿
5. 检查禁用句式和 AI 味表达
```

还可以带上：

```Plain Text
references/style.md
```

## Skill 是怎么工作的

Skill 最关键的设计，其实不是 SKILL.md，而是 Progressive Disclosure，渐进式披露。

假设你的 Agent 装了 100 个 Skill。

它不会一上来把 100 个 Skill 的完整内容全部塞进上下文。这样不仅浪费 Token，还会让模型被大量无关指令干扰。

标准做法分三层。

第一层，Agent 启动时只看所有 Skill 的名称和 description。

比如：

```Plain Text
pptx
处理 PowerPoint 创建、编辑、读取任务

pdf
处理 PDF 提取、合并、编辑、填写任务

tech-article-writing
撰写 AI 和科技行业文章
```

第二层，当用户说：

```Plain Text
帮我写一篇 豆包工作 的公众号文章
```

Agent 根据 description 判断 `tech-article-writing` 可能相关，这时才加载完整的 `SKILL.md`。

第三层，执行过程中发现需要模仿你的写作风格，才继续读取：

```Plain Text
references/style.md
```

需要检查 AI 味，才执行：

```Plain Text
scripts/check-ai-phrases.py
```

标准规范建议，所有 Skill 启动时只加载数十至上百Token的元数据，Skill 激活后再加载完整说明，其他资料和脚本继续按需读取。OpenAI Codex 也采用类似机制，先向模型暴露 Skill 的名称、描述和路径，再在模型决定使用时读取完整内容。

所以 Skill 解决了一个长期困扰 Agent 的问题：

**怎么给 Agent 很多知识和工作方法，又不把所有东西永远塞在 Prompt 里。**

## Skill 有哪些作用

**第一个作用，是给模型补充程序性知识。**大模型往往知道大量知识，但未必知道你的事情具体应该怎么做，比如它知道 SQL，但它不知道你公司的：

```Plain Text
canonical user_id 在哪张表
subscriptions 表是 append-only
查询退款时必须排除某个状态
Grafana 对应 dashboard ID 是多少
```

这些知识非常适合做 Skill，Anthropic 在内部使用了数百个 Skill，最终发现主要集中在 API 和内部库使用、产品验证、数据分析、业务流程自动化、代码脚手架、代码审查、CI/CD、故障 Runbook 和基础设施运维九类场景。

**第二个作用，是固定复杂工作流，**比如做一次行业调研。

普通 Prompt 可能是：

```Plain Text
详细调研一下 豆包工作
```

模型每一次都会重新思考：

```Plain Text
去哪里找资料
先查什么
怎么验证
跟谁对比
输出什么结构
```

Skill 可以把流程固定下来：

```Plain Text
1. 官方网站
2. 官方公众号和发布会
3. 产品文档
4. 实际产品测试
5. 同类产品对比
6. 核心观点提炼
7. 事实核验
```

这种能力称为 Encoded Preference Skill。模型本来能完成每一个单独步骤，但 Skill 把这些步骤按照团队或个人的工作方式组织起来。

另一类是 Capability Uplift Skill，给模型补充它原本做不好或不稳定的能力，例如复杂文档、PDF 和 PPT 处理。

**第三个作用，是减少重复 Prompt。**

你现在跟 AI 合作，其实有大量内容是在重复说，比如你经常告诉我：

```Plain Text
不要写得太 AI
长短句结合
不要过度点列
要有自己的判断
技术内容要克制
不要编造例子
```

这些其实已经天然适合做成一个 `writing-style` Skill。

以后你的 Prompt 只需要：

```Plain Text
写一篇 豆包工作 文章
```

写作习惯、资料标准、禁用表达、文章流程，都由 Skill 提供。

**第四个作用，是把个人经验和组织经验资产化。**

传统 Prompt 最大的问题是容易散落在：

```Plain Text
聊天记录
飞书文档
Notion
个人脑子里
```

Skill 是文件，所以它可以：

```Plain Text
Git 管理
版本回滚
团队共享
A/B 测试
自动评测
持续更新
```

这件事情很关键。

## 在豆包工作中找到合适的 Skill

打开左侧“技能·连接器·伙伴”，可以按金融、法律、新媒体创作、办公协作、编程、学术等分类浏览，也可以在顶部搜索框按名称或需求搜索技能。

![](https://doubaowork.homes/media/UuUswky3-01-6bebff643243.png)

找到合适的技能后，可以点击右侧“+”添加；部分技能也提供“在对话中试用”。已添加的技能统一在“我的技能”中管理。

![](https://doubaowork.homes/media/UuUswky3-02-ac84f71f54a2.png)

除了直接添加豆包工作推荐的技能，也可以新建或上传自己的技能。

点击页面右上角“新建”，可以选择“与豆包对话新建技能”或“上传技能”。上传时选择准备好的技能包，并在导入前检查来源、脚本和权限范围。

![](https://doubaowork.homes/media/UuUswky3-03-033b5bdff64c.png)

## 使用 Skill 解决一个任务

例如，文章需要降低 AI 痕迹时，可以在技能市场搜索“去AI味”技能，添加后回到工作任务中使用。

在输入框中输入“/”或点击“更多技能”，选择对应技能，再附上需要处理的文章和具体要求。

![](https://doubaowork.homes/media/UuUswky3-04-8b9eb60cc156.png)

豆包工作会根据技能说明决定处理步骤，并在任务中展示执行过程和结果。

![](https://doubaowork.homes/media/UuUswky3-05-f9c3590176b0.png)

完成后重点核对技能要求是否真正落实，例如是否删除指定句式、保留事实和语气、没有误改专有名词。
