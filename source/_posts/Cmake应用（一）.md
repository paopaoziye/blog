---
title: Cmake应用（一）
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
  - 代码工具
  - Cmake
categories: 软技能
keywords: 文章关键词
updated: ''
img: /medias/featureimages/23.webp
date:
summary: Cmake代码构建工具
---
# Cmake
## Cmake应用（一）
### 1.引言
#### 1.1`Cmke`概述
>一个**跨平台**的**项目构建工具**，根据`CMakeLists.txt`**文件**自动生成（`cmake`命令）**本地化**的`makefile`，最后只需要`make`命令即可获得**目标文件**
{%list%}
使用Cmke本质上就是在项目文件夹中编写CMakeLists.txt
{%endlist%}
#### 1.2基本指令
{%list%}
CMake支持大写、小写、混合大小写的命令
{%endlist%}
**①注释**
>**单行注释**：以`#`开头，以**换行符**结束
**多行注释**：以`#[[`开头，以`]]`结尾

**②`cmake_minimum_required`**
>指定`Cmake`的**最低版本**
**格式**：`cmake_minimum_required(VERSION 3.0.0)`

**③`project`**
>指定**工程信息**，包括**名字**、**版本**、**描述**、**web主页地址**和**支持的语言**等
{%list%}
只有项目的名字是必须的，其余都可忽略，缺省情况下支持所有CMake支持的语言
{%endlist%}
>**格式**
```
# PROJECT 指令的语法是：
project(<PROJECT-NAME> [<language-name>...])
project(<PROJECT-NAME>
       [VERSION <major>[.<minor>[.<patch>[.<tweak>]]]]
       [DESCRIPTION <project-description-string>]
       [HOMEPAGE_URL <url-string>]
       [LANGUAGES <language-name>...])
```
**④`add_executable`**
>生成**可执行文件**，需要指定**可执行文件名**和**源文件**
**格式**：`add_executable(可执行文件名 源文件名称)`
{%list%}
源文件名可以是一个也可以是多个，如有多个可用空格或;间隔
{%endlist%}
**⑤`message`**
>**显示一条信息**
**格式**：`message([STATUS|WARNING|AUTHOR_WARNING|FATAL_ERROR|SEND_ERROR] "message to display" ...)`
{%list%}
CMake警告和错误消息的文本显示使用的是一种简单的标记语言，文本没有缩进，超过长度的行会回卷，段落之间以新行做为分隔符。
{%endlist%}
>**状态**
`(无)` ：**重要**消息
`STATUS` ：**非重要**消息
`WARNING`：**警告**
`AUTHOR_WARNING`：**警告(dev)**
`SEND_ERROR`：**错误**， **继续执行**，但是会**跳过生成的步骤**
`FATAL_ERROR`：**错误**， **终止所有处理过程**

**⑥`add_definitions`**
>定义宏
格式：`add_definitions(-D宏名称)`
{%list%}
在对应程序中定义宏，而不是在CMakeLists中定义宏
{%endlist%}
#### 1.3例子
**①概述**
>有四个**源文件**`main.cc`、`a.cc`、`b.cc`、`c.cc`，以及一个**头文件**`head.h`，其中`main.cc`**调用**了另外三个源文件，`head.h`中包含了对应**声明**

**②CmakeLists文件编写**
```
#CMake最低版本为3.15
cmake_minimum_required(VERSION 3.15)
#项目名称为example
project(example)
#将main.cc a.cc b.cc c.cc编译为可执行文件main
add_executable(main main.cc a.cc b.cc c.cc)
```
**③生成可执行文件**
>在**终端**执行`cmake CmakeLists所在路径`命令，会在**当前路径**生成`makefile`等文件，再执行`make`命令即可
{%right%}
通常在项目文件文件夹中建造一个build文件夹，在该路径下执行上述命令，将相关文件和源文件分开
{%endright%}
{%warning%}
在使用Cmke指令时，需要保证其后接路径下不能有相关文件
{%endwarning%}

*** 

### 2.变量
#### 2.1创建与使用
**①`set`**
>**定义/修改变量**，参数分别为**变量名**、**变量的值（可以是多个）**以及一些**自定义选项（非必须）**
**格式**：`SET(VAR [VALUE] [CACHE TYPE DOCSTRING [FORCE]])`
{%list%}
缺省情况下，Cmake中的变量都是字符串（ITEM）或者字符串列表（LIST）
{%endlist%}
{%right%}
可以通过set进行变量的拼接
{%endright%}
>`set(变量名1 ${变量名1} ${变量名2} ...)`

**②变量的使用**
>`${变量名}`：将**变量名**转化为**对应的值**
```
set(SRC_LIST main.cc a.cc b.cc c.cc)
add_executable(main  ${SRC_LIST})
```
{%list%}
Cmake中，给变量赋值时，空格会被当作分隔符，如果想要使得变量中包含空格，则需要用双引号包围
{%endlist%}
>以下程序输出`abc`和`a b c`
```
set(WORD1 a b c)        #WORD1是一个字符串列表
set(WORD2 "a b c")      #WORD2是一个字符串
message(STATUS ${WORD1}) 
message(STATUS ${WORD2}) 
```

#### 2.2变量操作
**①`list`**
>根据**操作码**对**列表**进行**不同的操作**

**②追加**
>**格式**：`list (APPEND <list> [<value> ...])`
`<list>`：当前操作的**列表**
`<element>`：可以是**字面值**，也可以是**变量的值**

**③移除**
>**格式**：`list (REMOVE_ITEM <list> <value> [<value> ...])`


**④读取**
>**格式**：`list(GET <list> <element index> [<element index> ...] <output variable>)`
`<element index>`：列表元素的**索引**，从`0`开始，若为**负数**，则表示**倒数**第几个元素

{%list%}
其他操作可查询官网
{%endlist%}

#### 2.3预定义宏
**①`CMAKE_CXX_STANDARD`**
>**C++标准**
```
#增加-std=c++11
set(CMAKE_CXX_STANDARD 11)
```
**②`EXECUTABLE_OUTPUT_PATH`**
>**可执行文件输出路径**
```
#定义一个变量用于存储一个绝对路径
set(HOME /home/robin/Linux/Sort)
#将拼接好的路径值设置给EXECUTABLE_OUTPUT_PATH宏
set(EXECUTABLE_OUTPUT_PATH ${HOME}/bin)
```
{%list%}
如果路径不存在，则会自动创建
{%endlist%}
{%right%}
最好使用绝对路径，如果使用相对路径，则./代表的是makefile所在路径
{%endright%}
**③`PROJECT_SOURCE_DIR`**
>**Cmke指令后接的路径**

**④`CMAKE_CURRENT_SOURCE_DIR`**
>`CmakeLists`**文件所在路径**

### 3.结构化
#### 3.1文件搜索
**①`aux_source_directory`**
>查找**某个路径**下的**所有源文件**，并将源文件列表**存储到对应变量中**
**格式**：`aux_source_directory(< dir > < variable >)`
```
# 搜索当前目录下的源文件
aux_source_directory(${CMAKE_CURRENT_SOURCE_DIR} SRC_LIST)
```
**②`file`**
>查找**某个路径**下的所有**指定格式**的文件
**格式**：`file(GLOB/GLOB_RECURSE 变量名 要搜索的文件路径和文件类型)`
{%list%}
GLOB表示只搜索当前路径，GLOB_RECURSE还会递归搜索当前路径下的所有子目录
{%endlist%}
```
#搜索对应路径下的源文件
file(GLOB MAIN_SRC ${CMAKE_CURRENT_SOURCE_DIR}/src/*.cpp)
#搜索对应路径下的头文件
file(GLOB MAIN_HEAD ${CMAKE_CURRENT_SOURCE_DIR}/include/*.h)
```
#### 3.2头文件路径
**①引言**
{%list%}
通常，大型项目将源文件、头文件等分开放，如下所示
{%endlist%}
```
$ tree
.
├── build
├── CMakeLists.txt
├── include
│   └── head.h
└── src
    ├── main.cc
    ├── a.cc
    ├── b.cc
    └── c.cc
```
**②`include_directories`**
{%list%}
由于#include " "指令只在当前目录下寻找头文件，以上情况需要添加头文件路径
{%endlist%}
>**格式**：`include_directories (headpath)`，`headpath`为**头文件路径**

#### 2.3改进后的CmakeLists
```
cmake_minimum_required(VERSION 3.15)
project(example)
#添加C++11标准
set(CMAKE_CXX_STANDARD 11)
#设置头文件路径
include_directories(${PROJECT_SOURCE_DIR}/include)
#搜索所有源文件
file(GLOB SRC_LIST ${CMAKE_CURRENT_SOURCE_DIR}/src/*.cpp)
#生成可运行文件
add_executable(main  ${SRC_LIST})
```

### 4.动态库和静态库
#### 4.1引言
{%list%}
库文件本质上是源文件的二进制格式
{%endlist%}
**①静态库**
>**优点**：**打包到应用程序中**，加载速度快，移植方便
**缺点**：内存中可能出现**多份静态库**（多个链接该库的程序一起运行），且如果**静态库更新**，则项目需要**重新编译**

**②动态库**
>**优点**：**多个进程共享**，只有**在调用时才被载入内存**，动态库更新**无需重新编译程序**
**缺点**：加载**速度比静态库慢（可忽略）**，发布程序需要**提供依赖的动态库**
{%list%}
动态库有可执行权限，而静态库没有
{%endlist%}

**③文件架构**
```
.
├── build
├── lib
├── CMakeLists.txt
├── include           # 头文件目录
│   └── head.h
├── main.cc           # 用于测试的源文件
└── src               # 源文件目录
    ├── a.cc
    ├── b.cc
    └── c.cc
```
#### 4.2制作库
**①`add_library`**
>将对应**源文件**制作为**静态库/动态库**
**格式**：`add_library(库名称 STATIC/SHARED 源文件1 [源文件2] ...)`
{%list%}
其中计算机中的库名由三部分组成lib+库名+后缀，命令中只需要指定库名即可，其余计算机自动填充
{%endlist%}
**②指定输出路径**
>通过指定**系统变量**`LIBRARY_OUTPUT_PATH`
**例子**：`set(LIBRARY_OUTPUT_PATH ${PROJECT_SOURCE_DIR}/lib)`
{%list%}
不指定则生成到当前路径中
{%endlist%}
{%right%}
其中，动态库的生成路径还可以通过改变EXECUTABLE_OUTPUT_PATH，因为动态库是一个可执行文件
{%endright%}
**③对应CmakeLists文件**
>将`src`**文件夹**中文件构建为**库文件**
```
cmake_minimum_required(VERSION 3.15)
project(example)
include_directories(${PROJECT_SOURCE_DIR}/include)
file(GLOB SRC_LIST "${CMAKE_CURRENT_SOURCE_DIR}/src/*.cpp")
# 设置动态库/静态库生成路径
set(LIBRARY_OUTPUT_PATH ${PROJECT_SOURCE_DIR}/lib)
# 生成动态库，将SHARED修改为STATIC即可生成静态库
#add_library(abc SHARED ${SRC_LIST})
```

#### 4.3使用库文件
{%warning%}
库文件的生成和库文件的使用是两个项目
{%endwarning%}
**①`link_libraries`**
>**链接静态库**
**格式**：`link_libraries(<static lib> [<static lib>...])`
{%list%}
其中static lib可以写全名，也可以只写中间部分
{%endlist%}
{%warning%}
由于静态库是可执行文件的一部分，故需要在可执行文件生成前链接
{%endwarning%}

**②`target_link_libraries`**
>**链接动态库**
**格式**：如下所示，`target`为**链接动态库的文件**，`PRIVATE|PUBLIC|INTERFACE`为动态库的**访问权限**，**缺省**为`PUBLIC`
{%list%}
`target`可能是可执行文件、源文件或者动态库文件
{%endlist%}
{%warning%}
由于动态库不是可执行文件的一部分，故需要在可执行文件生成后链接
{%endwarning%}
```
target_link_libraries(
    <target> 
    <PRIVATE|PUBLIC|INTERFACE> <item>... 
    [<PRIVATE|PUBLIC|INTERFACE> <item>...]...)
```
{%right%}
动态库链接具有传递性，如果动态库 A 链接了动态库B、C，动态库D链接了动态库A，此时动态库D相当于也链接了动态库B、C，并可以使用动态库B、C中定义的方法（PUBLIC情况下）
{%endright%}
>**访问权限**
`PUBLIC`：在`PUBLIC`后面的库会被**链接**到前面的`target`中，并且里面的符号也会被导出
`PRIVATE`：在`PRIVATE`后面的库**仅被链接到前面的`target`中**，**不会传递**
`INTERFACE`：在`INTERFACE`后面引入的库**不会被链接到前面的target中**，只会导出**符号**，并**不知道库的信息**，同样也**不会传递**
{%list%}
动态库和静态库也可以相互链接，相互之间不会影响各自特性
{%endlist%}
**③`link_directories`**
>**指定库的路径**
**格式**：`link_directories(lib_path)`
{%list%}
如果使用非系统提供的库文件，则需要指明库文件路径，便于编译器找到
{%endlist%}

#### 4.4例子
**①文件架构**
{%list%}
使用库文件还需要包含相关头文件（包含库文件使用的函数声明）
{%endlist%}
```
.
├── build
├── CMakeLists.txt
├── include
│   └── head.h              #库文件对应的头文件
├── lib
│   └── libabc.a（.so）     # 制作出的静态库（动态库）的名字
└── src
    └── main.cpp
```
**②静态库版本**
```
cmake_minimum_required(VERSION 3.15)
project(example)
# 搜索指定目录下源文件
file(GLOB SRC_LIST ${CMAKE_CURRENT_SOURCE_DIR}/src/*.cpp)
# 包含头文件路径
include_directories(${PROJECT_SOURCE_DIR}/include)
# 包含静态库路径
link_directories(${PROJECT_SOURCE_DIR}/lib)
# 链接静态库
link_libraries(abc)
add_executable(main ${SRC_LIST})
```
**③动态库版本**
```
cmake_minimum_required(VERSION 3.15)
project(example)
file(GLOB SRC_LIST ${CMAKE_CURRENT_SOURCE_DIR}/*.cpp)
# 指定源文件或者动态库对应的头文件路径
include_directories(${PROJECT_SOURCE_DIR}/include)
# 指定要链接的动态库的路径
link_directories(${PROJECT_SOURCE_DIR}/lib)
# 添加并生成一个可执行程序
add_executable(main ${SRC_LIST})
# 指定要链接的动态库，其中libpthread.so为系统提供的线程库
target_link_libraries(main pthread abc)
```

