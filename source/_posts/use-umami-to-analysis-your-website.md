---
title: 使用 Umami 统计个人网站访问数据
abbrlink: 9393cc03
date: 2022-08-21 15:21:21
updated: 2022-08-21 15:21:21
description:
tags: [Umami, Analysis]
categories: Notes
---

> 没有人喜欢自己的隐私数据被收集、被利用，也没有人喜欢自己被跨网站、跨设备的跟踪浏览行为、制作用户画像、精准投递广告。作为一个非商用的小站，是时候向诸如谷歌统计、百度统计、51La 等说再见了，只关注关键的几个数据，全程匿名化处理，隐私至上。

<!-- more -->

## 关于 Umami

Umami 是一个开源的、以隐私为中心的 Google Analytics 替代方案。Umami 提供强大的网络分析解决方案，不会侵犯用户隐私。此外，当自行托管 Umami 时，可以完全控制自己的数据。

> Umami 基于 Node.js 开发，支持 Mysql 和 Postgresql 数据库，除服务器外，它甚至可以部署在 Serverless 中。自部署的好处在于某些商业服务滥用用户数据，当数据保存在自己手中时可以确保不会分享给第三方（如果你查阅 Umami 的数据库，你甚至可以发现它连用户 IP 都没有收集）。

> 此外由于现有的商用统计分析系统过于臭名昭著，绝大部分隐私拦截插件（如隐私獾）都对其脚本进行了过滤，在保护了访客隐私的同时却导致了统计数据不精准，而 Umami 可以重写脚本名称及绑定用户自己的域名，最大程度上避免被误拦截（因为本身不收集隐私、理直气壮）。

查看 Umami 功能示例：🔗[Live Demo](https://app.umami.is/share/8rmHaheU/umami.is) 。

## 如何搭建

本文使用 Serverless 平台来搭建 Umami，应用部署在 [Vercel](https://vercel.com/)，数据库使用 [PlanetScale](https://planetscale.com/)，其他平台参见 [官网文档](https://umami.is/docs)

### 数据库部分

[PlanetScale](https://planetscale.com/) 是一个兼容 MySQL 的无服务器数据库平台。 PlanetScale 平台不支持外键，因此需要修改 `schema.mysql.sql` 。

其他数据库参见官网文档  [Hosting](https://umami.is/docs/hosting) `Managed databases` 部分。

1. 使用魔法登录 PlanetScale 并创建一个数据库，名字假如为 umami-db ，获取连接字符串，`连接方式` 要选择 `Prisma`，字符串形如：`mysql://username:password@host/umami-db?sslaccept=strict` ，然后初始密码看不到，要自己新建一个数据库密码

  ![图 1](https://upload-bbs.mihoyo.com/upload/2022/08/21/260511332/00b728940b873dc3d3e940fc268dd2e5_2276870465142348577.png)

2. 打开 [schema.mysql.sql](https://github.com/umami-software/umami/blob/master/sql/schema.mysql.sql) ，删除所有以外键 (`-- AddForeignKey`) 开头的行，并确保逗号准确。
3. 初始化数据库

  - 打开 PlanetScale Web 控制台，从 `Branches` > `main` > `Console` 进入，复制 `schema.mysql.sql` 中语句，每次运行一条语句

    ![图 2](https://upload-bbs.mihoyo.com/upload/2022/08/21/260511332/b102b6200c907411994c8b9bec6e3bb4_2303785330596306678.png)

  - 另外也可以使用 [PlanetScale CLI](https://github.com/planetscale/cli/releases) 来初始化

    1. 使用 `pscale auth login` 登录
    2. 在项目根目录运行 `pscale shell umami-db main < sql/schema.mysql.sql`

4. 查看表是否已经建好，或者去 `Schema` 页面查看

  ![图 3](https://upload-bbs.mihoyo.com/upload/2022/08/21/260511332/f151de781d0cf1d13f359e841f0117e3_1731019309529313289.png)

### Vercel 部分

此时数据库已经初始化完毕，接下来将应用部署在 Vercel 上。

1. <a href="https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fmikecao%2Fumami&amp;env=DATABASE_URL,HASH_SALT&amp;envDescription=These%20values%20are%20defined%20in%20the%20configure%20Umami%20step%20from%20Install&amp;envLink=https%3A%2F%2Fumami.is%2Fdocs%2Finstall&amp;project-name=umami&amp;repo-name=umami">点击一键部署</a>

2. 手动部署

  - Fork Umami 的仓库: https://github.com/umami-software/umami 到自己的 GitHub
  - 注册一个 Vercel 帐户并登录（已有跳过）。
  - 访问 https://vercel.com/new 页面，从 GitHub 上导入项目。
  - 添加所需的环境变量 DATABASE_URL 和 HASH_SALT（随机字符串）。

    ![图 4](https://upload-bbs.mihoyo.com/upload/2022/08/21/260511332/36850ff2abe78ddf57596b20c524bc61_8099389476793374314.png)

  - 点击部署按钮，然后可以访问 `<deploy-id>.vercel.app` 查看效果。
  - 后续可以在 `Settings` > `Environment Variables` 编辑环境变量，需要重新部署服务生效

## 如何使用

### 接入网站

> 配置完成网站后打开，使用初始用户名密码登录 admin:umami。登录完成后可在右上角个人资料，更新密码处修改默认信息。接着个人资料，网站，添加网址处接入待统计的网站，如果勾选了启用共享链接，代表可以将该网站的统计数据分享给他人查看。

> 添加网站后，在网站列表的获取跟踪代码按钮处点击，复制具体内容到标签中，注：如果开启了自定义脚本名称，此处的链接文件需要手动替换。

### 跟踪事件

> Umami 的自定义跟踪事件有些鸡肋，只能做到统计数量。支持两类：一是 CSS 类，也就是 `umami--<event>--<event-name>` 打标方式；另一种是在加载完成 Umami 文件后，提供了 umami 对象，可以调用一些方法，两种方式其实都挺勉强。

#### 使用 CSS 类名

```html
<button id="signup-button" class="button umami--click--signup-button">Sign up</button>
```

格式：`umami--<event>--<event-name>`，`<event>` 取值见 https://developer.mozilla.org/en-US/docs/Web/Events

注意不要使用一些频繁触发的事件，如 `scroll` 或 `drag`

#### 使用 JavaScript

在 umami 加载完成后：

```js
const button = document.getElementById('signup-button');

button.onclick = () => umami('Signup button click');
```

详情见官网文档：https://umami.is/docs/track-events

### 在 hexo 中使用

如果主题没有适配 umami 的话，可以使用 [hexo injector](https://hexo.io/zh-cn/api/injector) 直接注入，hexo 版本需要大于 5

```js
// <博客项目根目录>/scripts/injector.js
hexo.extend.injector.register('head_end', '<script async defer data-website-id="<your-website-id>" src="<your-umami-url>"></script>');
```

## Reference

[Umami Documentation](https://umami.is/docs/getting-started)

[枋柚梓 - 自建个人网站数据统计分析系统](https://inkss.cn/blog/f7886cf2)

---
*fin.*
