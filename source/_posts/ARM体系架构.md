---
title: ARM体系结构
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
  - 体系结构
  - ARM
  - 精简指令集
categories: 编程语言
keywords: 文章关键词
updated: ''
img: /medias/featureimages/16.webp
date:
summary: ARM体系结构
---
# ARM体系结构
## ARM体系结构（一）
{%list%}
主要介绍的是运行在AArch64状态的ARMv8结构
{%endlist%}
### 1.引言
#### 1.1ARM体系结构
**①定义**
>**概述**：一种**硬件规范**，约定**芯片内部体系结构**以及**指令集的格式规范**，并**不关心**具体的**硬件实现**
{%list%}
ARM授权体系结构或者处理IP，前者可自行设计与之兼容的处理器，后者为一个设计方案
{%endlist%}
**②分类**
>**A系列**：面向**性能密集型系统**的应用处理器内核

>**R系列**：面向**实时应用**的高性能内核

>**M系列**：面向各种**嵌入式**用的**微控制器内核**

**③基本概念**
>**执行状态**：运行时的**环境**，可分为`AArch64`和`AArch32`
{%list%}
主要区别在于寄存器的位宽、支持的指令集、异常模型和内存模型等
{%endlist%}
>**指令集**：不同的**执行状态**可执行不同的**指令集**，`AArch64`状态有`A64`指令集，`AArch32`状态有`A32`和`T32`指令集
{%list%}
A64、A32、T32分别提供64位指令、32位指令、32位和16位指令支持
{%endlist%}
{%warning%}
A64和A32是不兼容的，且A64的指令宽度是32位
{%endwarning%}

>**异常等级**：当前运行的**特权等级**，可分为`EL0`、`EL1`、`EL2`、`EL3`，其中`EL0`为**用户特权**，`EL1`为**系统特权**
{%list%}
EL2运行虚拟化扩展的虚拟机监控器，EL3运行安全世界的安全监控器
{%endlist%}

#### 1.2寄存器
**①通用寄存器**
>**概述**：`AArch64`支持**31**个通用寄存器`X0~X30`，可以用`Wn`表示**n号**通用寄存器**低32位数据**

**②特殊寄存器**
{%list%}
仅介绍一些常用的特殊寄存器，其余可自行查询手册
{%endlist%}
>**PC指针寄存器**：指向**当前运行指令**的**下一条指令**的地址

>**SP寄存器**：每个**特权等级**对应一个**专门的SP寄存器**`SP_ELn`
{%right%}
异常等级高于EL0时，不仅可以访问自己的SP寄存器，还可以访问SP_EL0寄存器，可以将其作为一个临时寄存器
{%endright%}
>**PSTATE寄存器**：用于保存**处理器当前状态**
{%list%}
如条件标志、执行状态、异常掩码和访问权限
{%endlist%}
>**SPSR寄存器**：当出现**中断**时，会将**PSTATE寄存器**中内容保存到**SPSR寄存器**中，**中断返回时**再**写回**

**③系统寄存器**
>**概述**：通过**访问和设置**系统寄存器完成**处理器功能的配置**
{%list%}
如系统控制、调试、性能监控、定时器等
{%endlist%}
{%warning%}
不同的异常登记可以访问不同的系统寄存器，大部分系统寄存器在EL0状态无法访问
{%endwarning%}
#### 1.3实验环境搭建