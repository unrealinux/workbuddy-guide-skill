<!-- 由 scripts/sync.mjs 自动生成，请勿手改；改上游或改脚本。 -->

> 在线: [一份 Word，从校对润色到排版交付](https://doubaowork.homes/#/p/d391cd676baf43dd) · 上游: [`site/content/site-content.json`](https://github.com/AlephAITech/DoubaoWorkGuide/blob/main/site/content/site-content.json) · 同步自 `a7f87fe4`

# 一份 Word，从校对润色到排版交付

一份 Word 真正折腾人的时候，常常都在交付前。

错别字刚改完，标题样式又乱了；页码补好了，表格一跨页，版面又得重新收拾。

校对、润色、排版、脱敏和版本核对，看起来都在改文档，动的地方却各不相同。到底只改文字，还是连版式一起整理？

先把边界说清楚，再让豆包工作动手，返工会少很多。

## Word一键美化

一键美化适合内容已经定稿、排版还停留在默认样式的文档。最常见的问题是标题层级不清、字号混乱、段落太挤，以及页眉页脚和页码缺失。把这些要求一次写清楚，模型就能围绕同一套版式处理全文。

```Plain Text
请美化我上传的Word报告。

要求统一标题、一级标题、二级标题和正文样式，调整字体、字号、行距、段前段后间距和页面边距。增加简洁封面、页码和页眉，保留原文内容不变，输出一份正式的商务报告。
```

![](https://doubaowork.homes/media/UYOKwu8M-01-87453d7b0c16.png)

美化后的文件增加了封面、页眉、页脚和统一样式。可以连续查看各页，重点留意标题是否一致、正文有没有被截断、分页是否自然。

[▶ 视频 20260829204817.mp4](https://doubaowork.homes/media/UYOKwu8M-video-AGvBb6JvDowp.mp4)

版式完成以后还要抽查正文。挑几处数字、表格和长段落与原文件对照，确认内容、顺序和含义都没有变化。

## 两个版本对比

不知道版本之间的差距，直接对比，让其交付带修订记录的文件和差异摘要。版本很多时，差异摘要比逐页翻文件更省时间。

```Plain Text
请比较初稿和修改稿。

生成一份带修订记录的Word，清楚标记新增、删除和替换内容；同时生成差异摘要，按“内容变化、数字变化、责任人变化、时间变化”分类说明。不要只比较格式差异。
```

![](https://doubaowork.homes/media/UYOKwu8M-02-925fcadf7cbc.png)

![](https://doubaowork.homes/media/UYOKwu8M-03-a86e0fec6004.png)

结果区标出了新增、删除和替换内容。差异摘要还要单独列出数字、责任人和时间变化，方便读者先判断影响，再回到正文查看上下文。

![](https://doubaowork.homes/media/UYOKwu8M-04-4990d136fa9d.png)

## 隐私脱敏

脱敏任务最怕漏掉一处，也怕处理过度后无法继续使用。应当明确敏感信息的类型、保留规则和交付用途。姓名、手机、邮箱、证件号和详细地址可以分别使用不同的遮盖方式。

```Plain Text
请对这份Word进行隐私脱敏。

将姓名替换为“某先生”或“某女士”，手机号码保留前3位和后4位，邮箱隐藏用户名部分，身份证号只保留后4位，详细地址隐藏门牌信息。保持文档结构和排版不变，并输出脱敏内容清单。
```

![](https://doubaowork.homes/media/UYOKwu8M-05-026ec542280b.png)

**执行过程，**系统会按提示词里的规则逐类替换敏感信息，同时保留文档结构和排版。

![](https://doubaowork.homes/media/UYOKwu8M-06-d2e65b05aeff.png)

**结果显示，所有的敏感信息均被**遮盖，同时输出脱敏清单用来核对。

![](https://doubaowork.homes/media/UYOKwu8M-07-4894c81723de.png)

![](https://doubaowork.homes/media/UYOKwu8M-08-7f211d94f89b.png)

准备对外发送以前，可以再搜索一次手机号片段、邮箱符号、证件号后四位和地址关键词。搜索没有遗漏，脱敏文件才适合进入下一步流转。
