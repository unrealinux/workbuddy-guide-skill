<!-- 由 scripts/sync.mjs 自动生成，请勿手改；改上游或改脚本。 -->

> 上游: [`docs/bluebook/第二篇 案例篇：从一项任务到一支 AI 团队/第 12 章 从整理桌面文件这些小事做起/index.md`](https://github.com/AlephAITech/WorkBuddyGuide/blob/main/docs/bluebook/%E7%AC%AC%E4%BA%8C%E7%AF%87%20%E6%A1%88%E4%BE%8B%E7%AF%87%EF%BC%9A%E4%BB%8E%E4%B8%80%E9%A1%B9%E4%BB%BB%E5%8A%A1%E5%88%B0%E4%B8%80%E6%94%AF%20AI%20%E5%9B%A2%E9%98%9F/%E7%AC%AC%2012%20%E7%AB%A0%20%E4%BB%8E%E6%95%B4%E7%90%86%E6%A1%8C%E9%9D%A2%E6%96%87%E4%BB%B6%E8%BF%99%E4%BA%9B%E5%B0%8F%E4%BA%8B%E5%81%9A%E8%B5%B7/index.md) · 站点: [https://workbuddy.homes](https://workbuddy.homes/) · 同步自 commit `e510a2c8`

# 第 13 章 从整理桌面文件这些小事做起

## 整理桌面发票，不再回电脑前翻文件

桌面发票是典型的“电脑在替人承受混乱”的场景：电子发票、截图、PDF、微信下载文件、邮件附件混在一起，命名方式各不相同。人不在电脑前时，最烦的不是不知道怎么报销，而是不知道哪几张发票已经在电脑里、哪些字段还缺、哪些文件可能重复。

### 场景痛点

- 发票散落在桌面、下载目录、微信文件目录，格式可能是 PDF、JPG、PNG。
- 文件名经常只叫“发票.pdf”“image.png”“微信图片_2026xxxx.jpg”。
- 报销真正需要的是结构化字段：抬头、税号、金额、开票日期、发票号码、销售方。
- 远程批量整理最怕误删、覆盖、移动原件，导致后面找不回来。



```text
请帮我整理电脑里的发票，但不要删除、移动或覆盖原文件。
扫描范围只包括桌面、Downloads 和微信文件接收目录，时间范围为最近 30 天。
候选条件：文件名包含“发票”“电子发票”“invoice”，或内容识别为发票的 PDF、JPG、PNG。
第一步先返回候选清单和数量。
第二步识别抬头、税号、金额、开票日期、发票号码、销售方、文件路径。
第三步生成 invoice-ledger.xlsx，并列出“重复发票”和“无法识别字段”的人工确认清单。
```

执行后仅新增台账文件，桌面原发票不移动、不改名、不删除

![](https://cdn.jsdelivr.net/gh/AlephAITech/WorkBuddyGuide@e510a2c89114efef2c3031d86ac9c31b36ff8b80/docs/bluebook/%E7%AC%AC%E4%BA%8C%E7%AF%87%20%E6%A1%88%E4%BE%8B%E7%AF%87%EF%BC%9A%E4%BB%8E%E4%B8%80%E9%A1%B9%E4%BB%BB%E5%8A%A1%E5%88%B0%E4%B8%80%E6%94%AF%20AI%20%E5%9B%A2%E9%98%9F/%E7%AC%AC%2012%20%E7%AB%A0%20%E4%BB%8E%E6%95%B4%E7%90%86%E6%A1%8C%E9%9D%A2%E6%96%87%E4%BB%B6%E8%BF%99%E4%BA%9B%E5%B0%8F%E4%BA%8B%E5%81%9A%E8%B5%B7/assets/001_image_J9BUbk5hHo.png)