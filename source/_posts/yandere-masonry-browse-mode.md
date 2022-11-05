---
title: 利用用户脚本优化 Yandere/Konachan 站点浏览体验
tags:
  - booru
  - yandere
  - konachan
  - userscript
  - tampermonkey
abbrlink: 854aec20
date: 2022-07-25 20:09:28
updated: 2022-07-25 20:09:28
description:
categories: Original
---

> 中文标签、缩略图放大、双击翻页与瀑布流浏览模式，更舒服的 Booru 站点浏览体验

<!-- more -->

## 前言

[Y 站](https://yande.re/post) 与 [K 站](https://konachan.com/post) 都是寻找壁纸的好网站，日常必备，只可惜浏览体验不是很好，网站界面与标签都是英文，图片列表页面缩略图也比较小。这个时候自然要无敌的油猴脚本出马了，我便立马打开了 [Greasy Fork](https://greasyfork.org) 进行搜索。排除掉一些比较久远并且失效的脚本，我发现了 yande-re-chinese-patch，说实话这个脚本对页面的一些修改比如 sidebar 显隐、键盘翻页啥的我不是很感冒，但是这个流体布局浏览模式让我眼前一亮，用起来不错，而且翻译了一些常用的标签，终于不用整天划词了 w。于是便在这个脚本基础上进行了修改并对代码进行了重构，使用 [vite](http://vitejs.dev/) 与 [vite-plugin-tm-userscript](https://github.com/asadahimeka/vite-plugin-tm-userscript) 进行构建，然后支持了一些其他图站，利用 [@himeka/booru](https://www.npmjs.com/package/@himeka/booru) 库来获取各 booru 站点数据。访问 [GitHub](https://github.com/asadahimeka/yandere-masonry) 查看源码。

## 安装

### PC 端

- 如何安装用户脚本管理器插件不再赘述，可以参照 [Greasy Fork](https://greasyfork.org) 首页提示安装浏览器插件。
- 脚本已发布在 [Greasy Fork](https://greasyfork.org/zh-CN/scripts/444885) 上，可以点进页面直接安装。
- 如果没登 Greasy Fork 账号的话，可以访问 [Sleazy Fork](https://sleazyfork.org/scripts/444885) 进行安装。
- 建议安装 [大人的 Greasyfork](https://greasyfork.org/zh-CN/scripts/23840) 脚本在访问匿名不可用脚本时跳转至 Sleazyfork。
- 也可以直接从 [GitHub 仓库文件](https://github.com/asadahimeka/yandere-masonry/raw/main/dist/yandere-masonry.user.js) 安装。

### Android

- 使用 Yandex、Kiwi 或 Firefox 等浏览器安装 Tampermonkey 插件，然后再安装本脚本。
- 或者直接使用第三方原生应用 [Flexbooru](https://github.com/flexbooru/flexbooru) / [Mbooru](https://github.com/sin3hz/Mbooru/releases)。

## 特性

### 缩略图放大

对列表页的缩略图进行放大 [Y 站 / K 站]

![图 3](https://img2022.cnblogs.com/blog/1091021/202207/1091021-20220725230919755-1736331692.png)

![图 4](https://pic.rmb.bdstatic.com/bjh/events/623ccf465ad72b55bf1258e52da78a85538.png)

### 双击翻页

双击页面左侧任意区域进入上一页，双击页面右侧任意区域进入下一页 [Y 站 / K 站]

### 访问标记

会在点击过详情页面的图片下方标注一条横线，利用的是 a 标签 :visited 特性，清除缓存后失效 [Y 站 / K 站]

![图 2](https://pic.rmb.bdstatic.com/bjh/events/a5c5df323ed6a9f9f4a8975aa178f09e.png)

### 标签中文翻译

添加 Y 站 与 K 站 标签的中文翻译，翻译文件来自 yande-re-chinese-patch ，翻译了出现频率较高的 100 多个标签。

欢迎 [PR](https://github.com/asadahimeka/yandere-masonry/edit/main/src/data/tags_cn.json) 补充或校正翻译。

![图 1](https://upload-bbs.mihoyo.com/upload/2022/07/25/260511332/618d4ddd3684de719729f9a1f4d7ee73_8311796271489441122.png)

### 瀑布流模式

点击右上角按钮进入瀑布流模式

![图 5](https://pic.rmb.bdstatic.com/bjh/events/e5bf86ebbc68be5748b697197db1de93.png)

#### 输出下载地址

瀑布流模式下可使用 `输出下载地址` 功能保存图片地址 TXT 后使用迅雷、IDM、wget 等批量下载，见 [FoXZilla/Pxer#8](https://github.com/FoXZilla/Pxer/issues/8)

![图 6](https://upload-bbs.mihoyo.com/upload/2022/07/25/260511332/aa8aa8eb0105b7022d56ec0c7698301d_4922268873480853883.png)

#### 顶部操作

- 站点切换，打开侧栏操作，支持站点见下方所述
- 打开个人页面或收藏夹（Y 站/K 站），侧栏里操作
- 瀑布流显示列数切换，列数选择非自动且列数小于 6 时图片会以 sample_url （即点击详情的大小） 展示。
- 批量选择
- 查看下载列表
- 深色模式切换

#### 详情查看

点击缩略图可查看详情，可进行以下操作

- 收藏（Y 站/K 站）
- 打开源站详情页面
- 打开来源地址
- 查看原图
- 下载/加入下载列表
- 打开源站标签页面
- 点击图片控制按钮与标签显示

![图 8](https://pic.rmb.bdstatic.com/bjh/events/b4e794b26a64e0d89080627268fe7076.png)

## 提示

Moebooru 站点（Y 站、K 站）可通过设置查询参数 `locale` 或者设置 cookie 里的 `locale` 项来指定界面语言

如： https://konachan.net/post?locale=zh_CN

本脚本在访问 Y 站或 K 站时已默认指定语言为 `zh_CN`

## 站点支持

主要支持站点为 Y 站 和 K 站，其他站点为基本支持。

本脚本主要是为了方便图片浏览，其他功能如下载为简单支持，不保证完全可用。

另，存在源站页面图片列表与 API 返回列表不一致的情况，请悉知。

缩略图放大与双击翻页支持的站点为 Y 站 和 K 站，瀑布流模式支持的 Booru 站点见 [sites.json](https://github.com/asadahimeka/booru/blob/master/src/sites.json) （其中有 CSP 限制的站点暂未支持）。

## 预览

瀑布流模式的简单预览效果可以前往 https://www.nanoka.top/illust/konachan.html 查看

## 本地开发

1. `git clone https://github.com/asadahimeka/yandere-masonry.git`
2. `cd yandere-masonry`
3. `yarn install`
4. `yarn dev`

### Vue 3 + TypeScript + Vite

本项目使用 TypeScript + Vue 3 `<script setup>` 语法编写，并使用 Vite 构建，具体查阅文档：[script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup)。

P.S. Vue 2.7 以上版本已支持`<script setup>` 与 Composition-api，本项目使用的 Vue 版本为 2.6.14，如何在 2.7 以下版本使用`<script setup>`语法 与 Composition-api 可参照 [Vite + Vue2 + Vuetify2 + script setup + TypeScript 搭配开发项目](https://www.nanoka.top/posts/fb7525a/)。

### 推荐 IDE 与插件

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

### TypeScript 中 `.vue` 文件的类型支持

由于 TypeScript 无法处理 `.vue` 导入的类型信息，因此默认情况下被填充为通用 Vue 组件类型。如果希望在 `.vue` 导入中获取实际的参数类型（如，在使用 `h(...)` 时获取参数验证），可以按照以下步骤启用 Volar 的 Take Over 模式：

1. 从 VS Code 的命令面板运行 `Extensions: Show Built-in Extensions`，查找 `TypeScript and JavaScript Language Features`，然后右键单击并选择 `Disable (Workspace)`。 默认情况下，如果默认 TypeScript 扩展被禁用，Take Over 模式将自行启用。
2. 通过从命令面板运行`Developer: Reload Window` 重新加载 VS Code 窗口。

可以在 [此处](https://github.com/johnsoncodehk/volar/discussions/471) 了解有关 Take Over 模式的更多信息。

## Related

yande-re-chinese-patch

[@himeka/booru](https://www.npmjs.com/package/@himeka/booru)

[vite-plugin-tm-userscript](https://github.com/asadahimeka/vite-plugin-tm-userscript)

有问题或建议请到 GitHub [反馈](https://github.com/asadahimeka/yandere-masonry/issues)

---
*fin.*
