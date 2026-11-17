<!-- 由 scripts/sync.mjs 自动生成，请勿手改；改上游或改脚本。 -->

> 在线: [五分钟跑完第一个豆包工作任务](https://doubaowork.homes/#/p/46d9abfe47e97b62) · 上游: [`site/content/site-content.json`](https://github.com/AlephAITech/DoubaoWorkGuide/blob/main/site/content/site-content.json) · 同步自 `a7f87fe4`

# 五分钟跑完第一个豆包工作任务

## 快速创建一个豆包工作任务

点击左侧“新工作任务”。

![](https://doubaowork.homes/media/QeVVwy1S-01-ccb3aabf776b.png)

点击输入框左侧“+”或使用“@ 添加资料”，加入本次任务需要的文件、文件夹或其他资料。

特别的是豆包工作可以使用飞书云盘数据，可以@飞书联系人，如下，

![](https://doubaowork.homes/media/QeVVwy1S-02-70224f62e0a9.png)

确认底部选择的是“工作任务”，可以选择不同的项目，以及权限内容“始终询问”、“按需确认”、“全部允许”。

![](https://doubaowork.homes/media/QeVVwy1S-03-2e87470d333a.png)

模型一般保持 Auto 即可；可按任务复杂度选择Turbo或者Pro，推理强度选择低中高。

![](https://doubaowork.homes/media/QeVVwy1S-04-020348d32b3c.png)

```text
请读取我添加的三份工作记录，整理成一页周报。
结构为：本周完成、关键数据、问题与风险、下周计划。
只使用材料里明确出现的信息；无法确认的内容放进“待确认”，不要补写。
输出 Markdown，同时保留每条关键结论对应的材料名。
```

![](https://doubaowork.homes/media/QeVVwy1S-05-2dcbbcb2d84f.png)

发送以后看它有没有先读材料，再生成结果。如果一上来就写周报，说明提示词还可以再加一句“先列出材料清单和时间范围”。

![](https://doubaowork.homes/media/QeVVwy1S-06-45414867e230.png)

![](https://doubaowork.homes/media/QeVVwy1S-07-16795419fa6b.png)

验收只看四件事：事实有没有写错、数字能不能对上、待确认项有没有留着、格式能不能继续编辑。第一单跑通以后，再慢慢加技能和连接器。

产物可以继续修改、下载或按需要分享。分享前先确认内容不含敏感或涉密信息，并按公司规范选择共享范围。

## 入门任务 A：整理文件

```text
目标：整理 input 目录中的练习文件，便于按类型查找。
```

## 入门任务 B：生成会议纪要

```text
请把 input/meeting.txt 整理为结构化会议纪要。
```

## 入门任务 C：Word 转 PPT

```text
把 input/项目汇报.docx 转成 10 页以内的内部汇报 PPT。
```
