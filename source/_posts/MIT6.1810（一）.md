---
title: MIT6.1810（一）
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
  - 操作系统
  - MIT6.1810
categories: 项目实战
keywords: 文章关键词
updated: ''
img: /medias/featureimages/40.webp
date:
summary: 手搓操作系统
---
# 项目实战
## MIT6.1810（一）
### 1.环境配置
#### 1.1工具链安装
{%list%}
以Ubuntu20.04.1为例
{%endlist%}
>在**命令行**输入**以下代码**
```
sudo apt-get update 
sudo apt-get upgrade
sudo apt-get install git build-essential gdb-multiarch qemu-system-misc gcc-riscv64-linux-gnu binutils-riscv64-linux-gnu
```
>`git`：**版本控制**工具，并且可以将**Lab文件夹**保存到**github**

>`build-essential`：编译`c/c++`所需要的**所有工具**的**软件包**，如`gdb`、`gcc`和`make`等

>`gdb-multiarch`：为`gdb`的**多架构版本**，支持**多种CPU架构**

>`qemu`：一个支持**跨平台虚拟化**的虚拟机，如在**x86架构**平台上虚拟出一个**ARM架构**平台

>`gcc-riscv64-linux-gnu`:是**基于GCC**的**跨平台编译工具**，可以在**某架构**如X86，平台上将**C/C++代码**编译成**RISC-V指令集**的**汇编码**、**机器码**，并做出相应的**程序分析**

>`binutils-riscv64-linux-gnu`：针对**RISC-V架构**的**GNU Binutils工具集**的特定变体

#### 1.2课程源码编译
>在**命令行**输入**以下代码**，`ctrl-a x`，即**先同时**按住`ctrl`和`a`,**随后**按下`x`即可**退出**
{%list%}
第一次需要输入以下三行代码，以后只需要在对应目录下输入make qemu即可
{%endlist%}
```
git clone git://g.csail.mit.edu/xv6-labs-2023
cd xv6-labs-2023
make qemu
```
### 2.Lab1实现
