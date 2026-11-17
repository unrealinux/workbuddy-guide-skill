<!-- 由 scripts/sync.mjs 自动生成，请勿手改；改上游或改脚本。 -->

> 在线: [从一张产品原图到整套主图](https://doubaowork.homes/#/p/647e43d8091dbeb6) · 上游: [`site/content/site-content.json`](https://github.com/AlephAITech/DoubaoWorkGuide/blob/main/site/content/site-content.json) · 同步自 `a7f87fe4`

# 从一张产品原图到整套主图

# 这个技能帮你做什么

它是一套「电商视觉生产工作流」，不是简单的生图口令。你给产品和目标，它负责拆参考、锁事实、定视觉、写生产级提示词、校对成品。两种工作模式：

| 模式 | 适用情况 | 它做的事 |
|-|-|-|
| 模式一·参考图反推（本教程重点） | 你有产品图 + 几张喜欢的参考图 | 拆开参考图的构图/信息结构/风格，迁移到你的产品上生成新图 |
| 模式二·从零策划 | 没有参考图，只有产品 | 从产品身份与买家决策路径推导视觉方向，给 2-4 个可选方向 |

按你手上的材料，它的产出不同：

| 你手上有什么 | 能帮你产出 |
|-|-|
| 只有产品原图、没有方向 | 调研卖点、从零策划主图或详情页 |
| 产品原图 + 几张参考图 | 拆解参考、迁移手法、生成成套新图 |
| 已有完整文案和卖点 | 直接编译成可复制的生产级生图提示词 |

# 安装技能

技能已开源：[AlephAITech/moyuxl-ecom-image-prompt](https://github.com/AlephAITech/moyuxl-ecom-image-prompt)，在支持 Agent Skills 的环境里一条命令安装：

```text
npx skills add https://github.com/AlephAITech/moyuxl-ecom-image-prompt --skill moyuxl-ecom-image-prompt
```

也可以在仓库里下载整个技能文件夹或 ZIP，直接导入豆包使用。

![](https://doubaowork.homes/media/Ij6GwSFp-01-eeb65a1deb68.png)

# 实战：1 张手持产品图 → 7 张主图

## 起点：一张「没有设计」的产品原图

![](https://doubaowork.homes/media/Ij6GwSFp-02-30aa42183f3f.png)

本次输入只有一张手持产品、背景是绿植的随手拍，本身没有任何版式设计

![](https://doubaowork.homes/media/Ij6GwSFp-03-d5377eb99296.jpg)

## 四张参考图分别「借什么」

不是照抄某一张，而是各取一类机制，再用自己的产品和视觉系统重组：

| 参考图 | 借它的机制 | 明确不搬 |
|-|-|-|
| 棚拍对称式 | 产品居中、左右对称的稳定首图构图（L） | 它的产品、配色与文案 |
| 原料浸没式 | 产品「泡进」原料中的融合手法（L/S） | 它的瓶型与专属画面 |
| 信息图式 | 分栏、卡片、流程线的信息骨架（T） | 它的原始数据与措辞 |
| 航拍产地式 | 产地氛围与空间叙事（S） | 它的具体面积/产量数字 |



![](https://doubaowork.homes/media/Ij6GwSFp-04-d3fae3b445d7.jpg)


![](https://doubaowork.homes/media/Ij6GwSFp-05-6695f9416145.jpg)





![](https://doubaowork.homes/media/Ij6GwSFp-06-c8d268fa8fe8.jpg)


![](https://doubaowork.homes/media/Ij6GwSFp-07-a446b5e93208.jpg)



## 先发散：低成本探索多个方向

不急着定稿，围绕同一产品、按构图/场景/信息/色调各试一组方向，再挑。下面是其中两张探索稿，可见同一产品在不同方向下的差异

![](https://doubaowork.homes/media/Ij6GwSFp-08-1fb5bacfc8d3.png)

齐参考图一的棚拍手法，分别尝试忠实迁移、构图升级、场景叙事、信息设计四个方向。忠实迁移版产品保真与构图稳定度最高。



![① 忠实迁移基准](https://doubaowork.homes/media/Ij6GwSFp-09-5af5f7f3ac11.jpg)


![② 构图升级](https://doubaowork.homes/media/Ij6GwSFp-10-88b5ba18d98b.jpg)





![③ 场景叙事](https://doubaowork.homes/media/Ij6GwSFp-11-c72258492000.jpg)


![④ 信息设计](https://doubaowork.homes/media/Ij6GwSFp-12-0f81400c75a1.jpg)



## 第二批：原料浸没式（3 变体）

对齐参考图二，产品被红富士苹果环绕。斜插版最贴近参考范式且标签品牌名准确；近景正立产品占比最大；侧躺版动态感最强。



![A 斜插苹果堆](https://doubaowork.homes/media/Ij6GwSFp-13-f1a0527b543b.jpg)


![B 近景正立](https://doubaowork.homes/media/Ij6GwSFp-14-7745c4f62806.jpg)


![C 侧躺融入](https://doubaowork.homes/media/Ij6GwSFp-15-03cdc6bb01c6.jpg)



## 第三批：信息图式（3 变体）

![](https://doubaowork.homes/media/Ij6GwSFp-16-7f6a693f2533.png)

对齐参考图三，真实果园背景加四象限信息与手绘箭头。果园四象限版信息布局最清晰，苹果枝画框版产品最突出，行间透视版纵深感最强。



![A 果园四象限](https://doubaowork.homes/media/Ij6GwSFp-17-71fa3d096345.jpg)


![B 苹果枝画框](https://doubaowork.homes/media/Ij6GwSFp-18-b9f8dde56a04.jpg)


![C 行间透视圆台](https://doubaowork.homes/media/Ij6GwSFp-19-3810b5f52d2a.jpg)



## 第四批：航拍产地式（3 变体）

对齐参考图四的产地叙事。竞品的种植面积、冷库吨位等具体数据不可继承，统一替换为本品已确认的「源自烟台、当季红富士、100% 鲜苹果汁」等真实信息，不编造规模数字。



![A 航拍大字报](https://doubaowork.homes/media/Ij6GwSFp-20-60811a079ce9.jpg)


![B 果园加产品](https://doubaowork.homes/media/Ij6GwSFp-21-a422d6645a67.jpg)


![C 低角度斜航拍](https://doubaowork.homes/media/Ij6GwSFp-22-b15176a11209.jpg)



## 第五批：原创风格（5 方向）

![](https://doubaowork.homes/media/Ij6GwSFp-23-4cd8b8f3f4d8.png)

脱离参考图后做的原创方向探索，覆盖从极简到动态、从清凉到温暖、从日常到高端的完整风格光谱，用于反推最终套系的调性取舍。



![① 极简白棚拍](https://doubaowork.homes/media/Ij6GwSFp-24-175f7576dfe8.jpg)


![② 悬浮飞溅](https://doubaowork.homes/media/Ij6GwSFp-25-7146df7bd5c5.jpg)


![③ 冰块清凉](https://doubaowork.homes/media/Ij6GwSFp-26-37282cb70492.jpg)
