# 复刻这个文档站：把"文档"做成增长渠道

来源：对 `AlephAITech/WorkBuddyGuide` 的实现拆解（站点 <https://workbuddy.homes>，上游 MIT）。
适用：你要为一个工具/产品/开源项目做**中文实战文档站**，并希望它能带来自然流量和社区贡献。

## 0. 它到底做了什么（一句话）

用 VitePress 承载内容，用 SEO 拿搜索流量，用"案例投稿 + 帮你解决问卷"把读者变成贡献者，用 Cloudflare Workers + D1 自己攒流量数据——**内容是壳，这四件套是资产**。

## 1. 技术栈与目录（照抄即可）

- VitePress 1.6.4 + Vue 3，`docs/` 作为 srcDir，部署 Cloudflare Pages（连 `main` 分支自动构建）。
- 内容按「篇/章」两层目录，每章一个文件夹：`index.md` + `assets/`。
- 图表用 mermaid（`docs/.vitepress/mermaid-markdown.ts`），图片开 `lazyLoading`，主题配 github-light / github-dark。
- 关键 config 开关：`cleanUrls: true`、`lastUpdated: true`、`sitemap.hostname`、`srcExclude: ["**/source.md","plans/**"]`。

```bash
npm install                 # Node 20–24，推荐 22
npm run docs:dev            # 本地预览（--host 127.0.0.1）
npm run docs:build && npm run docs:preview
npx wrangler pages deploy docs/.vitepress/dist --project-name <name>
```

## 2. 五个部件，按投产顺序

1. **内容层**：27 章按"能不能立刻做完一个任务"组织，不按功能菜单组织。每章统一结构：场景 → 用到的 Skill/连接器 → 提示词 → 操作步骤 → 截图证据 → 验收标准。
2. **SEO 层**：`docs/.vitepress/seo.ts` 在 `transformPageData` 里自动生成每页 description、在 `transformHead` 里注入 canonical / og / JSON-LD；配 `sitemap`、`robots.txt`、百度/Google 验证 meta、`og/` 预览图。**不靠手写 SEO 字段。**
3. **贡献层**：`.github/CASE_TEMPLATE.md`（场景/任务/使用的 Skill/前置条件/操作/提示词/效果/验收/问题/安全/复用）+ `.github/PULL_REQUEST_TEMPLATE/case.md`。案例放在 `docs/cases/submissions/<slug>/index.md`，案例集首页在**构建时自动读取**，不用手改 index。
4. **获客层**：站内"帮你解决"问卷页收集真实场景 → 挑代表性的做成开源 Case → 案例回填站点内容。单向内容变成双向循环。
5. **数据层**（可选，但最见功力）：`workers/traffic-collector.ts` 用 Cron 定时拉 Cloudflare Analytics → 归档进 D1（`migrations/0001_traffic_archive.sql`）→ `functions/api/traffic.ts` 出接口。好处：数据自有、可长期对比、不依赖第三方统计脚本拖慢前端。

## 3. 内容流水线（容易被忽略的一环）

上游用 `scripts/download_feishu_wiki.py` 把飞书知识库拉进仓库；`CONTRIBUTING.md` 里说明 `source.md` / `source.xml` / `metadata.json` 是**本地同步产物、默认不提交**。

启示：**写作在顺手的地方（飞书/Notion），发布在 Git。** 只把渲染后的 `index.md` 提交，源文件进 `.gitignore`，避免仓库被中间产物污染。

## 4. 质量护栏（值得抄）

- `artifacts/design-qa/*.png` + `design-qa.md`：桌面 1488px / 移动 390px 的截图存档，改样式前后可对比。
- vitest 覆盖交互组件与数据逻辑（`HomePage.test.ts`、`ImageLightbox.test.ts`、`traffic-archive.test.ts`）——文档站也做单测。
- 双语：`README.md` / `README_en.md`、`CONTRIBUTING.md` / `CONTRIBUTING_en.md`。
- 免责声明写在 README：产品功能、"价格"、"权限"等时效信息以官方为准。

## 5. 已知的坑（照抄会踩）

1. **仓库体量失控**：548 个文件里 38% 是图片/视频，总 178 MB。图片必须走图床或 CDN，或至少压缩后进 LFS。
2. **章节编号会撞车**：上游第一篇有两个"第 8 章"。编号一旦公开就难改，建议用 `第 N 章` 单一序号源（自动从目录名解析）。
3. **中文目录名**：`第 8 章 飞书办公实战：从接入到交付` 这种路径在 URL、脚本、跨平台工具里都要 encode，容易出错。可读性和工程性要权衡。
4. **无版本发布**：没有 tag/release，外部引用无法锁定版本。内容站也建议打 `content-v1` 之类的 tag。
5. **热度回落**：8/25 之后 3 个月只有 6 次提交，10 个贡献者里 1 人贡献过半。开源内容的长期成本是维护，不是启动。

## 6. 判定是否值得复刻

| 信号 | 结论 |
| --- | --- |
| 你要为**有明确用户群**的工具做中文文档 | 值得，直接抄第 1–4 节 |
| 你只是要一份内部说明 | 不值得，用 wiki 就够 |
| 你指望文档站带来大量获客 | 需要 6–12 个月持续更新 + SEO 见效周期，别当短期渠道 |
| 你想学"社区共创怎么设计" | 重点看第 3 节和第 2 节的第 3 条 |
