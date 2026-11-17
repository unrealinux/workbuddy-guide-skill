<!-- 由 scripts/sync.mjs 自动生成，请勿手改；改上游或改脚本。 -->

> 在线: [连接器怎么用，先跑一个能验收的小任务](https://doubaowork.homes/#/p/e28eab1096b616fb) · 上游: [`site/content/site-content.json`](https://github.com/AlephAITech/DoubaoWorkGuide/blob/main/site/content/site-content.json) · 同步自 `a7f87fe4`

# 连接器怎么用，先跑一个能验收的小任务

**MCP**指的是 **Model Context Protocol（模型上下文协议），**是由 Anthropic 于 2024 年底推出并开源的一个开放标准协议，目前已经成为 AI 领域最热门的基础设施之一。

用一个通俗的比喻：**MCP 就是 AI 世界的USB-C 接口”。**

## 为什么需要 MCP？

在过去，如果你想让一个 AI 助手（Agent）连接外部工具（比如 GitHub、本地文件系统、PostgreSQL 数据库、Slack 等），开发者必须为“每一个 AI 应用”和“每一个工具”编写专门的对接代码。如果有 10 个 AI 应用和 10 个工具，就需要写 100 个接口（N × M 的集成噩梦）。

有了 MCP，工具开发者只需要按照 MCP 标准开发一个“MCP Server”（相当于 USB-C 设备），而任何支持 MCP 的 AI 应用（如 Cursor、各类 Agent 框架）只需内置“MCP Client”（相当于 USB-C 接口），就能**即插即用**。这就把 N × M 的复杂开发工作，简化成了 N + M。

本地与远程连接的安全性，连接器的数据路径和安全边界取决于具体实现、鉴权方式和服务提供方。使用前应检查连接器来源、授权账号、可访问范围和写入权限；涉及敏感数据时，遵循组织的数据安全要求，不要默认所有连接器都只在本地处理。

## 加载一个连接器

**豆包工作当前提供企业微信、钉钉、腾讯会议、腾讯文档、Notion、百度网盘、地图、金融数据等多类连接器。**

![](https://doubaowork.homes/media/UgjLw2m4-01-759bf4047a2a.png)

例如需要使用腾讯会议，可以在“技能·连接器·伙伴”页面搜索“腾讯会议”，点击右侧“+”添加，并按页面提示完成授权。

## 新建连接器

在“技能·连接器·伙伴”页面点击右上角“新建”，选择“新建自定义连接器”，再按引导配置服务地址和鉴权方式。授权前要确认服务来源、访问范围、写入能力和凭据保管方式。

连接器的作用很直接：让豆包工作读取或调用外部工具。你不用先背 MCP、JSON-RPC 和一堆术语，先看它能不能把真实数据拿回来。

![](https://doubaowork.homes/media/UgjLw2m4-02-8965661b75ca.png)

## 搜索、授权、测试

找到连接器后，先看来源、权限范围和支持的动作。能只读就别先开写入；能用测试资料就别先碰正式数据。

![](https://doubaowork.homes/media/UgjLw2m4-03-a72af7e3e057.png)

```text
请使用已连接的二维码工具，把我提供的公开网址生成二维码。
生成后请自行解码检查一次，确认解码结果与原网址完全一致，再把图片和校验结果一起交付。
不要缩短、改写或跳转网址。
```

![](https://doubaowork.homes/media/UgjLw2m4-04-25401a16f65c.png)

![](https://doubaowork.homes/media/UgjLw2m4-05-0ad329366991.png)

如果你要接企业内部系统，优先做自定义连接器的测试环境版本。凭证别贴进提示词，权限按最小范围给，写入和删除动作保留人工确认。
