<!-- 由 scripts/sync.mjs 自动生成，请勿手改；改上游或改脚本。 -->

> 在线: [定时任务怎么建，才能稳定产出结果](https://doubaowork.homes/#/p/6bf2eed0f3516a85) · 上游: [`site/content/site-content.json`](https://github.com/AlephAITech/DoubaoWorkGuide/blob/main/site/content/site-content.json) · 同步自 `a7f87fe4`

# 定时任务怎么建，才能稳定产出结果

定时任务最适合重复、规则稳定、结果好验收的工作。

资讯简报、周报草稿、竞品监控都可以；付款、发布和删除数据别交给无人值守流程。

![左侧打开定时任务](https://doubaowork.homes/media/Nfy1wYTr-01-fb143cc1190a.png)

![标题、任务说明、时间和环境都要填](https://doubaowork.homes/media/Nfy1wYTr-02-d411c83096c0.png)

当然，除了手动配置定时任务，还可以直接在对话框告诉豆包工作，让它帮忙创建

#### 提示词示例

```text
每天 8:30 检索过去 24 小时内的 AI 产品与 Agent 重要动态。
只保留 8 条；同一事件合并；每条包含发生时间、两条来源、影响判断和可继续写的角度。
来源不足或有效条目少于 5 条时，停止生成正式简报，返回失败原因和重试建议。不要拿旧闻补数量，不要自动发送或发布。
```



![](https://doubaowork.homes/media/Nfy1wYTr-03-0e7c45e06317.png)


![](https://doubaowork.homes/media/Nfy1wYTr-04-e97bfbfa3eae.png)



![](https://doubaowork.homes/media/Nfy1wYTr-05-e62ebf1625cc.png)

## 保存前要做好检查

时间范围、时区、数据源、失败处理、运行环境。本地电脑执行时还要保证开机联网。

第一次先手动跑通流程，结果合格后再定时。运行以后需要定期抽查，规则变了就改提示词，另外不要让一条不合格的旧任务在后台默默跑半年，这样会很浪费token的。
