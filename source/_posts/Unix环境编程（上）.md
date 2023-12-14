---
title: Unix环境编程（上）
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
  - 《Unix环境高级编程》
  - Unix
categories: 工具链
keywords: 文章关键词
updated: ''
img: /medias/featureimages/13.webp
date:
summary: Unix环境介绍
---
# Unix环境编程
## Unix环境编程（上）
### 1.Unix系统简介
#### 1.1引言
**①定义**
>**概述**：一种**多用户、多进程**的计算机操作系统，由**贝尔实验室**开发，目前已经渐渐成为**一种标准**
{%list%}
常见的类Unxi系统有Linux、MacOS和BSD等
{%endlist%}
**②相关标准**
{%list%}
L
{%endlist%}
>**ISO C**：由**ISO/IEC**维护和开发，规定了**C语言**的**语义**和**语法**，并定义了其**标准库**，以提供C语言的**可移植性**

>**POSIX**：由**IEEE**制定，**符合该规定的操作系统**必须包含的一系列**操作系统接口**，以及一些**可选接口**
{%list%}
XSI描述了哪些可选接口是Unix系统必须支持的
{%endlist%}

>**SUS**：在**POSIX标准**基础上，定义了一些**附加接口**

#### 1.2限制
**①定义**
>**概述**：**Unix系统实现**定义了很多**幻数**和**常量**用于限制其行为，可分为**编译时限制**和**运行时限制**
{%list%}
不同的标准定义了不同的限制，其中可能会有冲突，通常取较为合理的一种
{%endlist%}
>如**ISO C标准**定义了`FILENAME_MAX`，但是推荐使用**POSIX标准**定义的`NAME_MAX`和`PATH_MAX`

**②获取**
>**编译时限制**：通常是**固定**的，定义在**头文件**中，如**短整型的最大值**
{%list%}
以上三种标准的编译时限制大部分定义在limits.h头文件中，其余头文件也包含少许相关限制
{%endlist%}
{%right%}
有些编译时限定只限制了其最小值，而实际可能根据系统等采用不同的值
{%endright%}
>如**POSIX标准**的**信号量最大值**，在`limits.h`中有_`POSIX_SEM_VALUE_MAX`和`SEM_VALUE_MAX`，后者为**实际值**

>**运行时限制**：通常是**动态**的，需要进程**运行时**调用一个**函数**获得，如**文件名最大字符数**，由**文件系统**决定
{%list%}
运行时限制分为与文件和目录相关/无关两种，前者通过函数pathconf和pathconf获取，后者通过函数sysconf获取
{%endlist%}
{%warning%}
有些限制值是不确定的，在这种情况下，需要自定义某个值顶替
{%endwarning%}                                                                                                                            