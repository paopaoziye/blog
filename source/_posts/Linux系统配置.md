---
title: Linux系统配置
seo_title: seo名称
toc: true
indent: true
top: false
comments: true
archive: true
cover: false
mathjax: false
pin: false
top_meta: false
bottom_meta: false
sidebar:
  - toc
tag:
  - Linux
categories: 软技能
keywords: 文章关键词
updated: ''
img: /medias/featureimages/16.webp
date:
summary: Ubuntu虚拟机配置
---
# Linux系统配置（Ubuntu22.04）
### 1.基本配置
**1.1安装VMware-tools or open-vm-tools**：https://blog.csdn.net/baidu_38797690/article/details/124191747
**1.2更换软件源**：在**软件和更新**中替换
### 2.软件安装
**2.1包管理器安装**：大多数Linux发行版都提供了自己的包管理器，例如Ubuntu自带的apt、第三方包管理器sanp（需要自己下载）等。使用包管理器可以方便地从官方软件仓库中安装、更新和卸载软件
```
sudo apt-get update    # 更新软件源
sudo apt-get install 软件包名   # 安装软件
sudo apt-get remove 软件包名    #卸载软件
```
**2.2源码安装**：有些软件可能不在官方软件仓库中，或者需要手动安装特定版本的软件。在这种情况下，你可以从软件官网上下载安装包，然后**解压缩、编译和安装**
①安装底层依赖，比如python
①到对应网站上下载自己想要的版本的源码：`wget`+下载地址
③解压到任意目录
④在解压目录下配置（./configure）并编译（make）安装（make install）
⑤修改用户主目录下名为.bash_profile的文件，配置PATH环境变量并使其生效
⑥激活环境变量：source .bash_profile

### 3.C/C++环境配置
https://blog.csdn.net/zcteo/article/details/117528089
### 4.python环境配置
**4.1python解释器安装**：使用源码编译安装时需要提前安装底层依赖
**4.2IDE安装**：pycharm or visual studio code


