---
title: Linux工作流（一）
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
  - 工作流
categories: 工作流
keywords: 文章关键词
updated: ''
img: /medias/featureimages/41.webp
date:
summary: Linux常见命令
---
# Linux工作流（一）
## Linux基础操作
### 1.引言
#### 1.1Linux基本介绍
>一款**开源免费**的操作系统，主要应用在**服务器领域**，借鉴了**unix系统**的思想，有**ubuntu**、**debain**等发行版

#### 1.2Linux安装
**①双系统安装**

**②虚拟机安装**

#### 1.3Linux目录结构
{%right%}
Linux下一切皆文件，包括硬件也会被映射为一个文件
{%endright%}
{%list%}
主要介绍根目录下的各个目录，每个目录存放特定的文件
{%endlist%}
>`bin`：存放**经常使用的命令**，如`cd`等
{%list%}
sbin存放只有管理员才能使用的命令
{%endlist%}
>`home`：存放**普通用户**的**主目录**
{%list%}
root存放管理员的主目录
{%endlist%}
>`lib`：存放**系统**使用的**动态链接库**

>`ect`：存放**系统管理**所需要的**配置文件**

>`usr`：存放**系统自带文件**，其中`usr/local`为**用户使用系统安装**的软件
{%list%}
opt为用户手动安装软件的安装路径
{%endlist%}
>`boot`：Linux**启动**时所需要的**核心文件**

>`tmp`：存放**临时文件**

>`dev`：存放**系统硬件**如CPU的**映射**，类似于windows的**设备管理器**

>`media`：存放**自动挂载**，如**U盘**等
{%list%}
mnt存放手动挂载
{%endlist%}
{%right%}
dev存放U盘的映射，media存放U盘的内容
{%endright%}
>`var`：存放**经常被修改**的东西，如**日志文件**

>`proc`：存储的是Linux运行时的**进程映射**
### 2.基本命令
#### 2.1系统

### 3.环境搭建
#### 3.1基本配置
