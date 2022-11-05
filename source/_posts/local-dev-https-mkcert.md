---
title: 本地 https 环境解决方案
tags:
  - mkcert
  - https
  - nginx
categories: Notes
abbrlink: d845bf65
date: 2022-09-24 23:13:01
updated: 2022-09-24 23:13:01
description:
---

> 本文记录如何使用 mkcert 与 nginx 快速搭建本地 https 环境，并且没有浏览器警告

<!-- more -->

## 前言

以前本地开发搭建 https 环境时，使用的是自签证书，由于浏览器不信任自签证书，经常需要在警告页面点击继续访问，有些麻烦：

![图 1](https://upload-bbs.mihoyo.com/upload/2022/09/24/260511332/ebfd14c62279607cb9ebc1141f6a0826_2814762419453775092.png)

有时甚至没有继续访问的按钮，就需要到 `chrome://net-internals/#hsts` 里删除相关域名，更麻烦了，而且过段时间后还需要重复操作：

![图 2](https://upload-bbs.mihoyo.com/upload/2022/09/24/260511332/364475124c4888811626d048e87ba2cd_3644725119622854697.png)

为了不这么麻烦，需要我们将自签证书使用的根证书添加到系统的可信 CA 证书中，这样就不会出现警告了。当然了达到这个效果需要执行一堆 `openssl` 命令，确实繁琐，好在已经有了封装了这些的小工具 —— [mkcert](https://github.com/FiloSottile/mkcert) 。

## mkcert 介绍

> [mkcert](https://github.com/FiloSottile/mkcert) 是一个使用 go 语言编写的生成本地自签证书的小程序，具有跨平台、使用简单、支持多域名、自动信任 CA 等一系列方便的特性可供本地开发时快速创建 https 环境使用。

![图 3](https://upload-bbs.mihoyo.com/upload/2022/09/24/260511332/b70a9ba56304e657d9e1d30f3e8032c5_2994465346230218279.png)

## mkcert 安装

### Windows

   - 使用 [Chocolatey](https://chocolatey.org/) 或 [Scoop](https://github.com/ScoopInstaller/scoop)

     ```sh
     choco install mkcert
     # 或者
     scoop bucket add extras
     scoop install mkcert
     ```

   - 或者直接下载编译好的文件

     访问 [GitHub Releases](https://github.com/FiloSottile/mkcert/releases) 下载（[备用链接](https://download.fastgit.org/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-windows-amd64.exe)）

     然后可以重命名文件为 `mkcert.exe` ，所在路径放到环境变量 Path 里，方便直接以 `mkcert` 命令运行

     如果运行时有问题的话，切换为以管理员运行

     ![image-20220923104612775](https://pic.rmb.bdstatic.com/bjh/events/acf80e912da3366b41ebf37d0d02befb5924.png)

### macOS / Linux

使用 [Homebrew](https://brew.sh/) / [Homebrew on Linux](https://docs.brew.sh/Homebrew-on-Linux)

   ```
   brew install mkcert
   brew install nss # 如果使用 Firefox
   ```

## 信任 CA 证书

<div class="warning">

> ⚠ Warning
>
> mkcert 自动生成的 `rootCA-key.pem` 文件提供了拦截来自本机安全请求的完整能力。不要分享这个文件。

</div>

将 mkcert 使用的根证书加入本地可信 CA 中，以后由该 CA 签发的证书在**本地**都是可信的

```sh
mkcert -install
```

<img src="https://upload-bbs.mihoyo.com/upload/2022/10/16/260511332/f2b0f191e6cfcec5a3f65557900d5498_8039913934619601376.png" alt="Screenshot_2022-09-23_09-25-20">

可能不支持火狐浏览器

<img src="https://upload-bbs.mihoyo.com/upload/2022/09/24/260511332/f8b0365166f9ba08b5257e8f8c232956_6431625309180978405.png" alt="Screenshot_2022-09-23_09-26-21">

然后可以在 Windows 的可信 CA 列表找到该证书：

<img src="https://pic.rmb.bdstatic.com/bjh/events/61d4365a7898b0ed4b445e8249d597d39598.png" alt="Screenshot_2022-09-23_09-31-26">

## 安装 nginx

去官网 [下载 nginx](http://nginx.org/en/download.html) 或使用包管理器安装，具体步骤不再赘述

## 生成证书

```sh
mkcert localhost 127.0.0.1
# 或者使用域名配合 hosts
mkcert *.example.com
```

<img src="https://upload-bbs.mihoyo.com/upload/2022/09/24/260511332/3f1bd55b5bb32729bd9172a9d5092bac_4626938331097778786.png" alt="image-20220923112751149">

会在当前目录生成证书文件和私钥文件，然后就可以用在 nginx 上了

## 使用证书

修改 nginx 配置如下

```nginx
server {
    listen 443 ssl;
    # 修改为所需域名或者 localhost
    server_name *.example.com;
    index index.html index.htm index.php default.html default.htm default.php;
    root html;

    # 修改为生成文件目录
    ssl_certificate "cert/_wildcard.example.com.pem";
    # 修改为生成文件目录
    ssl_certificate_key "cert/_wildcard.example.com-key.pem";
    ssl_session_cache shared:SSL:1m; ssl_session_timeout 5m;
    ssl_ciphers HIGH:!aNULL:!MD5; ssl_prefer_server_ciphers on;

    # 此处为个人需求，代理请求到 80 端口
    location / {
        proxy_pass http://127.0.0.1;
        proxy_set_header Host $proxy_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Via "nginx";
    }
}
```

## 检查是否生效

运行 nginx 后访问，没有警告页面

![图 7](https://upload-bbs.mihoyo.com/upload/2022/09/25/260511332/aa62a8b8c8c2f8016116e624574b5aa3_7510037431628871874.png)

![图 6](https://upload-bbs.mihoyo.com/upload/2022/09/25/260511332/edf0d9805fcaeae09992cade6f504c79_2133465381961921180.png)

之后如果证书过期的话再重新执行一遍命令即可

## mkcert 其他选项

```
-cert-file FILE, -key-file FILE, -p12-file FILE
  自定义输出路径/文件名。

-client
  生成用于客户端身份验证的证书。

-ecdsa
  使用 ECDSA 密钥生成证书。

-pkcs12
  生成 PKCS12 格式的证书。Java 程序通常不支持 PEM 格式的证书，但是支持 PKCS12 格式的证书。

-csr CSR
  根据提供的 CSR 生成证书。与除 -install 和 -cert-file 之外的所有其他选项冲突。
```

注意：需要将这些选项放在域名之前

例子：

```sh
mkcert -key-file key.pem -cert-file cert.pem example.com *.example.com
```

## 局域网内使用

参照 https://blog.dteam.top/posts/2019-04/%E6%9C%AC%E5%9C%B0https%E5%BF%AB%E9%80%9F%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88mkcert.html#%E5%B1%80%E5%9F%9F%E7%BD%91%E5%86%85%E4%BD%BF%E7%94%A8 ：

> 有时候我们需要在局域网内测试 https 应用，这种环境可能不对外，因此也无法使用像 `Let's encrypt` 这种免费证书的方案给局域网签发一个可信的证书，而且 `Let's encrypt` 本身也不支持认证 ip。
>
> 先来回忆一下证书可信的三个要素：
>
> - 由可信的 CA 机构签发
> - 访问的地址跟证书认证地址相符
> - 证书在有效期内
>
> 如果期望我们自签证书在局域网内使用，以上三个条件都需要满足。很明显自签证书一定可以满足证书在有效期内，那么需要保证后两条。我们签发的证书必须匹配浏览器的地址栏，比如局域网的 ip 或者域名，此外还需要信任 CA。
>
> 我们先重新签发一下证书，加上本机的局域网 ip 认证：
>
> ```powershell
> PS C:\Users\abcfy> mkcert localhost 127.0.0.1 ::1 192.168.31.170
> Using the local CA at "C:\Users\abcfy\AppData\Local\mkcert" ✨
>
> Created a new certificate valid for the following names 📜
>  - "localhost"
>  - "127.0.0.1"
>  - "::1"
>  - "192.168.31.170"
>
> The certificate is at "./localhost+3.pem" and the key at "./localhost+3-key.pem" ✅
> ```
>
> 再次验证发现使用 `https://192.168.31.170` 本机访问也是可信的。然后我们需要将 CA 证书发放给局域网内其他的用户。
>
> ```powershell
> PS C:\Users\abcfy> mkcert -CAROOT
> C:\Users\abcfy\AppData\Local\mkcert
> ```
>
> 使用 `mkcert -CAROOT` 命令可以列出 CA 证书的存放路径
>
> ```powershell
> PS C:\Users\abcfy> ls $(mkcert -CAROOT)
>
>     目录：C:\Users\abcfy\AppData\Local\mkcert
>
> Mode                LastWriteTime         Length Name
> ----                -------------         ------ ----
> -a----  2019-04-09-星期二  上午 1           2484 rootCA-key.pem
>                              2:16
> -a----  2019-04-09-星期二  上午 1           1651 rootCA.pem
>                              2:16
> ```
>
> 可以看到 CA 路径下有两个文件 `rootCA-key.pem` 和 `rootCA.pem` 两个文件，用户需要信任 `rootCA.pem` 这个文件。将 `rootCA.pem` 拷贝一个副本，并命名为 `rootCA.crt`（因为 windows 并不识别 `pem` 扩展名，并且 Ubuntu 也不会将 `pem` 扩展名作为 CA 证书文件对待），将 `rootCA.crt` 文件分发给其他用户，手工导入。
>
> windows 导入证书的方法是双击这个文件，在证书导入向导中将证书导入 `受信任的根证书颁发机构` :
>
> ![image.png](https://upload-bbs.mihoyo.com/upload/2022/09/25/260511332/5656eac6b3d34035834f4f8a18392181_3504489147586877598.png)
>
> MacOS 的做法也一样，同样选择将 CA 证书导入到受信任的根证书颁发机构。
>
> Ubuntu 的做法可以将证书文件（必须是`crt`后缀）放入 `/usr/local/share/ca-certificates/` ，然后执行 `sudo update-ca-certificates`
>
> Android 和 iOS 信任 CA 证书的做法参考 [官方文档](https://github.com/FiloSottile/mkcert#mobile-devices)。
>
> 在局域网其他计算机就可以访问 https 而不报警了。我在另一台虚拟机 Ubuntu 上使用 curl 测试结果：
>
> ```bash
> $ curl -I https://192.168.31.170
> HTTP/1.0 200 OK
> Server: SimpleHTTP/0.6 Python/3.6.8
> Date: Tue, 09 Apr 2019 05:22:12 GMT
> Content-type: text/html; charset=utf-8
> Content-Length: 1794
> ```
>
> 无警告，加上 `-v` 参数输出还会告诉证书是可信的。

## Reference

https://github.com/FiloSottile/mkcert

https://www.jianshu.com/p/7cb5c2cffaaa

---
*fin.*
