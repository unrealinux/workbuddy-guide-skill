<!-- 由 scripts/sync.mjs 自动生成，请勿手改；改上游或改脚本。 -->

> 上游: [`docs/bluebook/第一篇 使用手册：先把 WorkBuddy 用起来/第 3 章 WorkBuddy 的主界面、任务与工作区/index.md`](https://github.com/AlephAITech/WorkBuddyGuide/blob/main/docs/bluebook/%E7%AC%AC%E4%B8%80%E7%AF%87%20%E4%BD%BF%E7%94%A8%E6%89%8B%E5%86%8C%EF%BC%9A%E5%85%88%E6%8A%8A%20WorkBuddy%20%E7%94%A8%E8%B5%B7%E6%9D%A5/%E7%AC%AC%203%20%E7%AB%A0%20WorkBuddy%20%E7%9A%84%E4%B8%BB%E7%95%8C%E9%9D%A2%E3%80%81%E4%BB%BB%E5%8A%A1%E4%B8%8E%E5%B7%A5%E4%BD%9C%E5%8C%BA/index.md) · 站点: [https://workbuddy.homes](https://workbuddy.homes/) · 同步自 commit `e510a2c8`

# 第 3 章 WorkBuddy 的主界面、任务与工作区

WorkBuddy 主界面可以理解为三个区域：左侧（侧边栏）管理任务，中间（对话区）下达和追踪任务，右侧（结果区）查看文件、变更、预览和最终产物。

![](https://cdn.jsdelivr.net/gh/AlephAITech/WorkBuddyGuide@e510a2c89114efef2c3031d86ac9c31b36ff8b80/docs/bluebook/%E7%AC%AC%E4%B8%80%E7%AF%87%20%E4%BD%BF%E7%94%A8%E6%89%8B%E5%86%8C%EF%BC%9A%E5%85%88%E6%8A%8A%20WorkBuddy%20%E7%94%A8%E8%B5%B7%E6%9D%A5/%E7%AC%AC%203%20%E7%AB%A0%20WorkBuddy%20%E7%9A%84%E4%B8%BB%E7%95%8C%E9%9D%A2%E3%80%81%E4%BB%BB%E5%8A%A1%E4%B8%8E%E5%B7%A5%E4%BD%9C%E5%8C%BA/assets/001_image_MuLCbdPyDo.png)



## 三个区域分别做什么

| 区域 | 主要用途 | 使用时重点检查 |
|-|-|-|
| 侧边栏 | 新建、搜索、切换和管理任务 | 是否进入了正确任务 |
| 对话区 | 描述需求、补充信息、确认计划 | 目标和约束是否完整 |
| 结果区 | 查看产物、全部文件、变更与预览 | 文件名、路径和改动是否符合预期 |

侧边栏的“任务”和“工作空间”的区别，在于你是否设置了“工作空间”目录。

“工作空间”是 WorkBuddy 为了管理任务而设置的目录，每个任务都有一个对应的目录空间，任务可以在目录空间内进行操作。

若未设置，会在默认安装的目录下执行任务，对话保存在“任务”目录下。

## 为什么要隔离工作目录

工作目录既是效率设置，也是安全边界。把发票、周报、客户材料混在同一个大目录里，会增加误读、误改和信息串用的风险。

推荐按任务建目录空间。

同时，可以对目录空间的权限进行设置，当开启“允许完全访问”（开启完全访问后智能体可读写授权目录外文件，请谨慎使用并优先按任务限定目录。）

![](https://cdn.jsdelivr.net/gh/AlephAITech/WorkBuddyGuide@e510a2c89114efef2c3031d86ac9c31b36ff8b80/docs/bluebook/%E7%AC%AC%E4%B8%80%E7%AF%87%20%E4%BD%BF%E7%94%A8%E6%89%8B%E5%86%8C%EF%BC%9A%E5%85%88%E6%8A%8A%20WorkBuddy%20%E7%94%A8%E8%B5%B7%E6%9D%A5/%E7%AC%AC%203%20%E7%AB%A0%20WorkBuddy%20%E7%9A%84%E4%B8%BB%E7%95%8C%E9%9D%A2%E3%80%81%E4%BB%BB%E5%8A%A1%E4%B8%8E%E5%B7%A5%E4%BD%9C%E5%8C%BA/assets/002_image_DtASbQcrto.png)



## 三种工作模式

WorkBuddy 提供三种工作模式：

| 模式 | 中文界面 | 能做什么 | 适合场景 |
|-|-|-|-|
| Ask | 问一问 | 问答、理解和查看，不修改文件 | 先了解资料、确认需求 |
| Craft | 做一做 | 可直接操作本地文件、运行代码及系统指令 | 路径清楚、风险较低的任务 |
| Plan | 想一想 | 先生成计划，确认后再执行 | 多步骤、跨系统、重要文件任务 |

![](https://cdn.jsdelivr.net/gh/AlephAITech/WorkBuddyGuide@e510a2c89114efef2c3031d86ac9c31b36ff8b80/docs/bluebook/%E7%AC%AC%E4%B8%80%E7%AF%87%20%E4%BD%BF%E7%94%A8%E6%89%8B%E5%86%8C%EF%BC%9A%E5%85%88%E6%8A%8A%20WorkBuddy%20%E7%94%A8%E8%B5%B7%E6%9D%A5/%E7%AC%AC%203%20%E7%AB%A0%20WorkBuddy%20%E7%9A%84%E4%B8%BB%E7%95%8C%E9%9D%A2%E3%80%81%E4%BB%BB%E5%8A%A1%E4%B8%8E%E5%B7%A5%E4%BD%9C%E5%8C%BA/assets/003_image_W7VqbwVeJo.png)



## 选择不同的模型

默认为自动模式，可以指定你想使用的模型，不同模型积分消耗不同。

![](https://cdn.jsdelivr.net/gh/AlephAITech/WorkBuddyGuide@e510a2c89114efef2c3031d86ac9c31b36ff8b80/docs/bluebook/%E7%AC%AC%E4%B8%80%E7%AF%87%20%E4%BD%BF%E7%94%A8%E6%89%8B%E5%86%8C%EF%BC%9A%E5%85%88%E6%8A%8A%20WorkBuddy%20%E7%94%A8%E8%B5%B7%E6%9D%A5/%E7%AC%AC%203%20%E7%AB%A0%20WorkBuddy%20%E7%9A%84%E4%B8%BB%E7%95%8C%E9%9D%A2%E3%80%81%E4%BB%BB%E5%8A%A1%E4%B8%8E%E5%B7%A5%E4%BD%9C%E5%8C%BA/assets/004_image_OzThbMYn5o.png)

| 任务特征 | 优先关注 |
|-|-|
| 大量文本与长资料 | 上下文长度，比如 100 万 tokens（1M） |
| 图片与截图 | 需要有视觉理解能力 |
| 高频简单任务 | 优先选择响应速度快、成本较低的模型 |
