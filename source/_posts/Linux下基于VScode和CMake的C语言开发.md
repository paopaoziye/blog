---
title: Linux下基于VScode和CMake的C/C++开发
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
  - 软技能
  - 代码开发实战
categories: 代码实战
keywords: 文章关键词
updated: ''
img: /medias/featureimages/8.webp
date:
summary: Linux下C/C++开发概述
---

# 代码开发实战（一）
## Linux下基于VScode和CMake的C/C++开发
### 1.Linux系统概述
**1.1Linux系统简介：**一个开源的**多用户多任务**的操作系统
{%right%}
Linux中一切皆文件
{%endright%}
**1.2目录结构**
>/：根目录，最顶层的目录
bin：全称binary，含义是二进制。该目录中存储的都是一些**二进制文件**，文件都是可以被运行的。
dev：该目录中主要存放的是**外接设备**，例如盘、其他的光盘等。在其中的外接设备是不能直接被使用的，需要挂载（类似window下的分配盘符）。
etc：该目录主要存储一些**配置文件**。
home：表示“家”，表示除了root用户以外**其他用户的家目录**，类似于windows下的User/用户目录。
proc：全称process，表示进程，该目录中存储的是Linux运行时候的**进程**。
root：该目录是**root用户**自己的家目录。
sbin：全称super binary，该目录也是存储一些可以被执行的**二进制文件**，但是必须得有**super权限**的用户才能执行。
tmp：表示“临时”的，当系统运行时候产生的**临时文件**会在这个目录存着。
usr：存放的是用户**系统自带文件**。类似于windows下的program files。
var：存放的程序/系统的**日志文件**的目录。
mnt：当外接设备需要**挂载**的时候，就需要挂载到mnt目录下。
boot：**内核文件**及引导加载程序（**开机文件**）
opt: 存放可选软件的安装目录，一些**第三方应用程序**可能会安装在这个目录下。

**1.3指令与选项**
①指令格式：`指令 [选项] [对象]`
>选项和操作对象都可以没有，也可以是**多个**

②路径相关指令
>`pwd`：打印当前终端**所在的目录**
`ls [选项] [路径]`：列出指定路径下的文件/文件夹的名称，并以指定的格式进行显示（不指定路径就是当前路径）
`cd [路径]`：切换到对应路径下（不指定路径即为当前用户家目录）

③文件相关指令
>`mkdir`：创建目录
`touch`：创建新文件/将指定文件的修改时间设置为当前时间
`rm`：删除文件/目录
`cp`：复制文件/文件夹到指定的位置
`mv`：移动文件到新的位置，或者重命名文件
`vi`：编辑文件

③辅助指令
>`man`：打开Linux下的命令手册
`reboot`：重启系统
`shutdown`：关机

**1.4开发环境搭建**
①安装GCC，GDB
```
sudo apt update
# 通过以下命令安装编译器和调试器
sudo apt install build-essential gdb
```
②安装Cmake和VSCode
```
sudo apt install cmake
sudo apt install code
```

### 2.GCC/G++编译器
**2.1概述：**gcc编译器用于编译C语言，g++用于编译C++语言
{%warning%}
虽然g++可以编译C代码，但它会将源代码解析为C++代码进行编译，某些特定的C++功能和语法可能会被启用
{%endwarning%}
**2.2编译过程及指令**
①预处理：`g++  -E test.cpp  -o test.i`
>-E选项指示编译器仅对输入文件进行预处理

②编译：`g++  -S test.i  -o   test.s`
>-S编译选项告诉g++在为C++代码产生了汇编语言文件后停止编译
g++产生的汇编语言文件的缺省扩展名是.s

③汇编：`g++  -c test.s  -o test.o`
>-c选项告诉g++仅把源代码编译为机器语言的目标代码
缺省时g++建立的目标代码文件有一个.o的扩展名。

④链接：`g++ test.o  -o test`
>-o编译选项来为将产生的可执行文件用指定的文件名

{%right%}
以上四个过程可以合并为g++ test.cpp -o test
{%endright%}

**2.3重要编译参数**
①`-g`：编译带调试信息的可执行文件
②`-O[n]`：优化源代码
>`-O`选项告诉g++对源代码进行基本优化。这些优化在大多数情况下都会使程序执行的更快。 
`-O0`表示不做优化
`-O1`为默认优化
`-O2`除了完成`-O1`的优化之外，还进行一些额外的调整工作，如指令调整等。
`-O3`则包括循环展开和其他一些与处理特性相关的优化工作。

③`-l`：指定库文件
>`-l`参数(小写)就是用来指定程序要链接的库，`-l`参数紧接着就是库名
在`/lib`和`/usr/lib`和`/usr/local/lib`里的库直接用`-l`参数就能链接

④`-L`：指定库文件路径
>如果库文件没放在上面三个目录里，需要使用`-L`参数(大写)指定库文件所在目录
`-L`参数跟着的是库文件所在的目录名

⑤-I：指定头文件搜索目录
>`/usr/include`目录一般是不用指定的，gcc知道去那里找，但是如果头文件**不在**`/usr/icnclude`里我们就要用`-I`参数指定了，比如头文件放在`/myinclude`目录里，那编译命令行就要加上`I/myinclude` 参数了

⑥`-Wall`：打印警告信息
⑦`-w`：关闭警告信息
⑧`-std=[语言版本]`:设置编译标准
⑨`-o`：指定输出文件名
{%warning%}
注意-o参数和其他参数位置不同，其他参数在g++和编译文件之间，-o在编译文件之后，并接空格和文件名
{%endwarning%}
⑩`-D`：定义宏
>`g++ -DVERSION=2.0 main.cpp -o program`：将`main.cpp文`件中的`VERSION`宏定义为2
{%right%}
-DDEBUG定义DEBUG宏，可能文件中有DEBUG宏部分的相关信息，用个DDEBUG来选择开启或关闭DEBUG
{%endright%}

**2.4编译过程**
①目录结构
```
# 最初目录结构
.
├── include
│   └── Swap.h
├── main.cpp
└── src
   └── Swap.cpp
```
②直接编译：g++ main.cpp src/Swap.cpp -Iinclude
③链接静态库编译
```
## 进入src目录下
$cd src
# 汇编，生成Swap.o文件
g++ Swap.cpp -c -I../include
# 生成静态库libSwap.a
ar rs libSwap.a Swap.o
## 回到上级目录
$cd ..
# 链接，生成可执行文件:staticmain
g++ main.cpp -Iinclude -Lsrc -lSwap -o staticmain
```
④链接动态库编译
```
## 进入src目录下
$cd src
# 生成动态库libSwap.so
g++ Swap.cpp -I../include -fPIC -shared -o libSwap.so
## 上面命令等价于以下两条命令
# gcc Swap.cpp -I../include -c -fPIC
# gcc -shared -o libSwap.so Swap.o
## 回到上级目录
$cd ..
# 链接，生成可执行文件:sharemain
g++ main.cpp -Iinclude -Lsrc -lSwap -o sharemain
```
{%warning%}
运行动态库文件时，需要指定动态库所在位置：LD_LIBRARY_PATH=src ./sharemain
{%endwarning%}

### 3.GDB调试器
**3.1概述：**
①简介：GDB是一个用来调试C/C++程序的功能强大的调试器，是Linux系统开发C/C++最常用的调试器
②主要功能
>设置**断点**：使程序在指定的代码行上暂停执行，便于观察
**单步执行**程序，便于调试
查看程序中**变量值的变化**
动态改变程序的**执行环境**
分析崩溃程序产生的**core文件**

③使用：在命令行中输入`gdb [exefilename]`即可启动GDB调试器
{%warning%}
编译程序时需要加上-g，之后才能用gdb进行调试：gcc -g main.c -o main
{%endwarning%}
**3.2常用指令**
>`help(h)`：查看命令帮助，具体命令查询在gdb中输入help + 命令
`run(r)`：重新开始运行文件（run-text：加载文本文件，run-bin：加载二进制文件）
`start`：单步执行，运行程序，停在第一行执行语句
`list(l)`：查看原代码（list-n,从第n行开始查看代码。list+ 函数名：查看具体函数）
`set`：设置变量的值
`next(n)`：单步调试（逐过程，函数直接执行）
`step(s)`：单步调试（逐语句：跳入自定义函数内部执行）
`backtrace(bt)`：查看函数的调用的栈帧和层级关系
`frame(f)`：切换函数的栈帧
`info(i)`：查看函数内部局部变量的数值
`finish`：结束当前函数，返回到函数调用点
`continue(c)`：继续运行
`print(p)`：打印值及地址
`quit(q)`：退出gdb
`break+num(b)`：在第num行设置断点
`info breakpoints`：查看当前设置的所有断点
`delete breakpoints num(d)`：删除第num个断点
`display`：追踪查看具体变量值
`undisplay`：取消追踪观察变量
`watch`：被设置观察点的变量发生修改时，打印显示
`i watch`：显示观察点
`enable breakpoint`：启用断点
`disable breakpoints`：禁用断点
`x`：查看内存x/20xw 显示20个单元，16进制，4字节每单元
`run argv[1] argv[2]`：调试时命令行传参
`set follow-fork-mode child`：Makefile项目管理：选择跟踪父子进程fork()
{%right%}
回车键：重复上一命令
{%endright%}

### 4.IDE(VSCode)
**4.1简介**
①界面可分为四部分
>侧边栏
菜单栏
编辑区
状态栏

②插件安装
>C/C++
CMake
CMake Tools

③项目文件夹结构：一般将头文件放在`include`文件夹中，将源文件（记得要包含对应头文件）放在`src`文件夹中，随后`main`函数独立于这两个文件夹，**包含对应头文件**即可
{%right%}
在头文件中，可以添加#pragma once防止头文件重复编译
{%endright%}
**4.2快捷键**
①常用快捷键
>`Ctrl + P`：转到文件/其他常用操作 
`Ctrl + W`：关闭当前文件
`Ctrl + Shift + P`：打开命令面板
`Alt + Up/Down`当前行上移/下移
`F2`：变量统一重命名 
`Ctrl + B`：关闭侧边栏  
`F12`：转到定义处
`Ctrl+C`：复制文本  
`Ctrl+V`：粘贴文本 
`Ctrl+S`：保存文件
`Ctrl+Z`：撤销操作 
{%right%}
Ctrl +\`：打开终端
{%endright%}

②`Ctrl + P`窗口相关操作
>直接输入文件名，跳转到文件
`?`：列出当前可执行的动作
`!`：显示`Errors`或`Warnings`，也可以`Ctrl+Shift+M`
`:`：跳转到行数，也可以`Ctrl+G`直接进入
`@`：跳转到`symbol`（搜索变量或者函数），也可以`Ctrl+Shift+O`直接进入
`@`：根据分类跳转`symbol`，查找属性或函数，也可以`Ctrl+Shift+O`后输入`:`进入
`#`：根据名字查找`symbol`，也可以`Ctrl+T`

③编辑器与窗口管理
>`Ctrl+Shift+N`：打开一个新窗口
`Ctrl+Shift+W`：关闭窗口
`Ctrl+N`：新建文件 
`Ctrl+Tab`：文件之间切换
`Ctrl+\`：切出一个新的编辑器（最多 3 个） 
`Ctrl+1 Ctrl+2 Ctrl+3`：左中右3个编辑器的快捷键 
`Ctrl+k然后按Left或Right`：编辑器换位置

④代码格式调整
>代码行缩进：`Ctrl+[`、`Ctrl+]`
代码格式化：`Shift+Alt+F`
上下移动一行：`Alt+Up`或`Alt+Down`
向上向下复制一行：`Shift+Alt+Up`或`Shift+Alt+Down`
在当前行下边插入一行：`Ctrl+Enter`
在当前行上方插入一行：`Ctrl+Shift+Enter`

⑤光标相关
>移动到行首：`Home`
移动到行尾：`End`
移动到文件结尾：`Ctrl+End`
移动到文件开头：`Ctrl+Home`
移动到定义处：`F12`
定义处缩略图（只看一眼而不跳转过去）：`Alt+F12`
移动到后半个括号：`Ctrl+Shift+]`
选择从光标到行尾：`Shift+End`
选择从行首到光标处：`Shift+Home`
删除光标右侧的所有字：`Ctrl+Delete`
扩展/缩小选取范围：`Shift+Alt+Left`和`Shift+Alt+Right`
同时选中所有匹配：`Ctrl+Shift+L`，`Ctrl+D`下一个匹配的也被选中

⑥代码重构
>找到所有的引用：`Shift+F12`
同时修改本文件中所有匹配的：`Ctrl+F12`
重命名：比如要修改一个方法名，可以选中后按`F2`，输入新的名字，回车，会发现所有的文件都修改了
跳转到下一个Error或Warning：当有多个错误时可以按`F8`逐个跳转
查看diff：在`explorer`里选择文件右键`Set file to compare`，然后需要对比的文件上右键选择`Compare with file_name_you_chose`

⑦查找替换
>查找：`Ctrl+F`
查找替换：`Ctrl+H`
整个文件夹中查找：`Ctrl+Shift+F`

⑧显示相关
>全屏：`F11`
zoomIn/zoomOut：`Ctrl +/-`
侧边栏显/隐：`Ctrl+B`
显示资源管理器：`Ctrl+Shift+E`
显示搜索：`Ctrl+Shift+F`
显示Git：`Ctrl+Shift+G`
显示Debug：`Ctrl+Shift+D`
显示Output：`Ctrl+Shift+U`

**4.3Jason文件配置**

### 5.CMake
**5.1概述**
①简介：CMake是一个**跨平台**的安装编译工具，可以使用相同的`CMakeLists.txt`文件在多个操作系统（如Windows、Linux、macOS等）上生成适应不同编译器和构建工具的构建脚本
>如果不使用CMake的话，就要自己写针对不同平台的构建脚本，修改项目时，就十分麻烦


②基本语法格式：`指令(参数1 参数n)`
>参数之间使用**空格**或者**分号**隔开
指令时大小写无关的，参数是大小写相关的
变量使用`${变量}`方式取值，但是在`IF`控制语句中是**直接使用变量名**

③目录结构
>项目主目录存在一个`CMakeLists.txt`文件
**包含源文件的子文件夹**包含`CMakeLists.txt`文件:主目录的`CMakeLists.txt`通过`add_subdirectory`添加子目录即可；
**包含源文件的子文件夹**未包含`CMakeLists.txt`文件:子目录编译规则体现在主目录的`CMakeLists.txt`中；

④编译流程
>手动编写`CMakeLists.txt`
执行命令`cmake PATH`生成`Makefile`(`PATH`是**顶层CMakeLists.txt**所在的目录)。
执行命令`make`进行编译。

⑤外部构建(out-of-source build)
```
## 外部构建
# 1. 在项目顶层目录下，创建build文件夹
mkdir build
# 2. 进入到build文件夹
cd build
# 3. 编译上级目录的CMakeLists.txt，生成Makefile和其他文件
cmake ..
# 4. 执行make命令，生成target
make
```
>内部构建会在同级目录下产生一大堆中间文件，这些中间文件并不是我们最终所需要的，和工程源文件放在一起会显得杂乱无章，不推荐使用


**5.2常用语法**
①`cmake_minimum_required`：指定CMake的**最小版本要求**
>语法：`cmake_minimum_required(VERSION versionNumber [FATAL_ERROR])`
示例：`cmake_minimum_required(VERSION 2.8.3)` 
#CMake最小版本要求为2.8.3

②`project`：定义**工程名称**，并可指定工程支持的语言
>语法：`project(projectname [CXX] [C] [Java])`
示例：`project(HELLOWORLD) ` 
#指定工程名为HELLOWORLD

③`set`：显式的定义变量
>语法：`set(VAR [VALUE] [CACHE TYPE DOCSTRING [FORCE]])`
示例：`set(SRC sayhello.cpp hello.cpp)` 
#定义SRC变量，其值为sayhello.cpp hello.cpp，即两个文件


④`include_directories`：向工程添加多个特定的**头文件搜索路径**
>语法：`include_directories([AFTER|BEFORE] [SYSTEM] dir1 dir2 ...)`
示例：`include_directories(/usr/include/myincludefolder ./include) `
#将/usr/include/myincludefolder 和 ./include 添加到头文件搜索路径，绝对路径和相对路径均可

⑤`link_directories`：向工程添加多个特定的**库文件搜索路径**
>语法：`link_directories(dir1 dir2 ...)`
示例：`link_directories(/usr/lib/mylibfolder ./lib)`
#将/usr/lib/mylibfolder 和 ./lib 添加到库文件搜索路径

⑥`add_library`：生成**库文件**
>语法：`add_library(libname [SHARED|STATIC|MODULE] [EXCLUDE_FROM_ALL] source1 source2 ... sourceN)`
示例：`add_library(hello SHARED ${SRC})`
#通过变量SRC生成libhello.so共享库

⑦`add_compile_options`：添加**编译参数**
>语法：`add_compile_options(<options>)`
示例：`add_compile_options(-Wall -std=c++11 -O2)`
#添加编译参数 -Wall -std=c++11 -O2

⑧`add_executable`：生成**可执行文件**
>语法：`add_executable(exename source1 source2 ... sourceN)`
示例：`add_executable(main main.cpp)`
#编译main.cpp生成可执行文件main

⑨`target_link_libraries`：为target**添加需要链接的共享库**
>语法：`target_link_libraries(target library1<debug | optimized> library2...)`
示例：`target_link_libraries(main hello)`
#将hello动态库文件链接到可执行文件main

⑩`add_subdirectory`：向当前工程**添加存放源文件的子目录**，并可以指定中间二进制和目标二进制存放的位置
>语法：`add_subdirectory(source_dir [binary_dir] [EXCLUDE_FROM_ALL])`
示例：`add_subdirectory(src)`
#添加src子目录，src中**需有一个CMakeLists.txt**

⑪`aux_source_directory`：发现**一个目录下所有的源代码文件**并将列表存储在一个变量中，这个指令临时被用来自动构建源文件列表
>语法：`aux_source_directory(dir VARIABLE)`
示例：
`aux_source_directory(. SRC)` #定义SRC变量，其值为当前目录下所有的源代码文件
`add_executable(main ${SRC})` #编译SRC变量所代表的源代码文件，生成main可执行文件

**5.3常用变量**
①`CMAKE_C_FLAGS`：gcc编译选项
②`CMAKE_CXX_FLAGS`：g++编译选项
>`set( CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11")`
#在CMAKE_CXX_FLAGS编译选项后追加-std=c++11
③`CMAKE_C_COMPILER`：指定C编译器
④`CMAKE_CXX_COMPILER`：指定C++编译器
⑤`EXECUTABLE_OUTPUT_PATH`：可执行文件输出的存放路径
⑥`LIBRARY_OUTPUT_PATH`：库文件输出的存放路径

