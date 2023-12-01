---
title: Linux工作流（二）
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
categories: 工具链
keywords: 文章关键词
updated: ''
img: /medias/featureimages/41.webp
date:
summary: 实用工具
---
# Linux工作流
## Linux实用工具
### 1.VIM编辑器
#### 1.1工作模式
>**普通模式**：**刚进入**`VIM`或者**从其他模式**按下`ESC`退出
{%list%}
在该模式下，可以使用某些控制键或者按下冒号:并输入相关指令进行操作，如退出q、保存w和撤销u
{%endlist%}
{%right%}
该模式下，还可以使用kjhl代替上下左右
{%endright%}
>**插入模式**：**普通模式**按下**某些按键**进入，**常常**是`i`

>**可视模式**：可以**选中一块区域**进行**编辑**

#### 1.2常用操作
{%warning%}
这里的操作都是在普通模式下的，如果处于其他模式，需要退回到普通模式
{%endwarning%}
**①插入操作**
>`i`：进入**插入模式**，并从**光标当前位置**开始**输入文本**
{%list%}
a类似于i，不过是从光标下一位置开始输入文本
{%endlist%}

>`s`：**删除光标当前位置字符**，并进入**插入模式**
{%list%}
x类似s，但是不会进入插入模式
{%endlist%}
>`o`：在**光标下方开新行**并进入**插入模式**
{%right%}
shift+i进行行首插入，shift+a进行行尾插入，shift+o在光标上方开新行插入
{%endright%}
**②复制粘贴**
>`d`：**剪切**，该操作需要**指定一个范围**，`dd`剪切**整行**
{%list%}
常用的范围有d+数字+左/右方向键、d+w、d+i+[符号]
{%endlist%}
>`dh5`表示从**当前光标处**，**向左**剪切**五个字符**，`dw`表示**从当前光标处**到**下一个词头**，`di"`表示**从当前光标的前一个"到后一个"**

>`y`：**复制**，**操作原理**同`d`

>`p`：**粘贴**

**③搜索**
>`f[x]`：将**光标**移动到其后**下一个x字符处**

>`:/[xxx]`：将**光标**移动到其后**下一个匹配的xxx处**
{%list%}
匹配完成后，使用N/n跳转到上/下一个匹配处
{%endlist%}
#### 1.3配置文件
**①配置文件生成**
>在**家目录**下创建`.vim`**目录**并在**该目录**下**使用VIM**创建`vimrc`文件
{%list%}
vim在每次启动时会加载并更新配置文件，如果想要修改配置文件后立马更新，可以输入:source $MYVIMRC命令
{%endlist%}
**②常用语法**
>`noremap [新键位] [原键位]`：**键位映射**，即按下**新键位**，`vim`会**认为**按下**原键位**
{%list%}
map类似于noremap，但是map可以递归，即map a b,map b c相当于map a c
{%endlist%}
{%right%}
键位可以不止一个键，而是一连串操作，可以用于设置快捷键，也可以将其替换为<nop>，逻辑上删除该键
{%endright%}
>如`map S :w<CR>`设置**快速退出**，`map s <nop>`**逻辑上删除**`s`键

>`syntax on`：打开**代码高亮**

>`set [设置选项]`：**打开/关闭**某项设置，**常用选项**如下
```
set number 开启行号
set relaivenumber 显示各行的相对距离
set cursorline 光标下划线
set wrap 让自不会超出窗口
set showcmd
set wildmenu 补全选择
set hlsearch 高亮搜索
set incsearch 边输入边高亮
忽略大小写
set ignorecase
set smartcase
```
**③插件安装**
>在github上下载`vim-plug`，为`vim`的一个**插件管理**

>根据说明在**配置文件**中输入**以下代码**，再使用`:pluginstall`即可**下载插件**

```
call plug#begin()

Plug 'nsf/gocode' //nsf/gocode为插件完整库名

call plug#end()
```
### 2.编译与调试
#### 2.1GCC/G++编译器
**①编译过程**
{%right%}
gcc用于编译C文件，g++用于编译C++文件，以C++为例，C语言将g++换为gcc即可
{%endright%}

>**预处理**：`g++ -E test.cpp -o test.i`

>**编译**：`g++ -S test.i -o test.s`

>**汇编**：`g++ -c test.s -o test.o`

>**链接**：`g++ test.o -o test`
{%list%}
-E、-S、-c限制编译过程停在对应步骤，-o指定输出文件名，以上四步可合并为g++ test.cpp -o test
{%endlist%}
**②常用选项**
>`-g`：编译**带调试信息**的可执行文件

>`-O[n]`：**优化代码**，`n`表示**不同等级**
{%list%}
0表示不优化，1表示默认优化，23会进行一些对应的优化操作
{%endlist%}
>`-l`：指定**库文件**

>`-L`：指定**库文件路径**
{%list%}
默认去/lib、/usr/lib和/usr/local/lib中找对应库文件，如果没有，则需要用-L指定库文件路径
{%endlist%}
>`g++ -L/home/zfk/mylib -ltestlib test.cpp`

>`-I`：指定**头文件路径**
{%list%}
编译器默认在当前编译目录、/usr/include和/usr/local/include寻找对应头文件
{%endlist%}
>`-Wall`：打印**警告信息**，可以使用`-w`**关闭**

>`-std=c++11`：指定**编译标准**

>`-D[宏名]`：**定义宏**

>`-U[宏名]`：**取消**对应**宏的定义**

**③库文件生成**
{%list%}
当编译多个源文件时，可以将其一起编译，也可以将一部分源文件制作为动态库/静态库引入
{%endlist%}
>**静态库**：先生成对应源文件的**二进制文件**，再将其**转化为静态库文件**
{%warning%}
转化为二进制的过程和正常的编译过程一样，若其在非默认位置包含头文件，也需要指明头文件路径
{%endwarning%}
```
g++ -c test.cpp 
ar rs libTest.a test.o
```
>**动态库**：先生成对应源文件的**二进制文件**，再将其**转化为动态库文件**
{%warning%}
动态库文件若不在默认位置，执行链接该动态库的可执行文件时，需要手动说明
{%endwarning%}
>`LD_LIBRARY_PATH=src ./sharemain`
```
gcc -c -fPIC test.cpp  
gcc -shared -o libTest.so test.o
```
#### 2.2GDB调试
**①基础操作**
>`gdb [可执行文件名]`：用**gdb打开**该可执行文件并**进入gdb界面**
{%warning%}
该可执行文件在编译时需要有-g选项，否则无法使用gdb打开
{%endwarning%}
>`h [gdb命令]`：查看**命令帮助**

>`q`：**退出**gdb


**②过程控制**
>`start`：**重新开始**运行文件，并停在**第一行执行语句**

>`r`：**重新开始**运行文件，直到**程序结束**或者**遇到断点**

>`n`：执行**下一条语句**，如果下一条是函数则会**直接执行该函数**

>`s`：执行**下一条语句**，如果下一条是函数则会**进入该函数**

>`c`：**继续执行**，直到**程序结束**或者**遇到断点**

>`b [行号n]`：在**第n行**设置**断点**

>`enable/disable/delete b [断点号]`：**启用/禁用/删除**断点


**③显示查看**

>`l [行号n]/[函数名fun]`：查看**源文件第n行附近代码**/**函数内容**

>`p [变量]`：**打印变量的值**


>`i [对象]`：查看**对应内容**，默认为**函数内部局部变量的数值**，若对象为`b`,则查看**所有断点**，当对象为`watch`时查看**观察点**

>`display/undisplay [变量]`：**追踪/取消追踪变量**，即**每次**都会**显示**该变量的值

>`watch [变量]`：**观察**某变量，当该变量**变化**时，**打印显示**

>`x/[数目][单位][进制]	[地址]`：查看**对应地址开头的内存内容**，**数目x单位**表示**向后查看的长度**
{%list%}
单位中b/h/w/g分别为单/双/四/八字节，d/t/o/x分别表示十/二/八/十六进制
{%endlist%}
**④函数管理**
>`finish`：结束**当前函数**，返回到**函数调用点**

>`bt`：查看函数的**调用的栈帧**，并显示**层级关系**

>`f`：**切换**函数的**栈帧**

**⑤辅助功能**

>`run [参数1] [参数2]...[参数N]`：进行命令行传参，传递给`argv[1] argv[2]...argv[N]`

>`set`：**修改/创建**变量

### 3.VSCode
#### 3.1引言
**①概述**
>一款**轻量级且跨平台**的**IDE**

**②打开**
>**终端**中输入`code [工程目录路径]`，或者直接在**UI界面**打开**工程目录**

**③界面组成**
{%list%}
主要由菜单栏、侧边栏、状态栏和编辑区组成，主要使用的是侧边栏，其余主要使用快捷键替代
{%endlist%}
>**资源管理器**：显示**工程目录**、**已打开文件**、**操作历史**

>**搜索**：搜索对应**文件**、**变量**等对象
{%right%}
支持大小写区分、全字匹配和正则表达式，手动开启关闭
{%endright%}
>**Git**：版本控制，需要**安装Git依赖**

>**Debug**：运行与调试，需要**安装GDB等依赖**

>**扩展**：安装**插件**，如**C/C++**、**CMake**、**CMake Tools**、**Python**等

#### 3.2常用快捷键
**①窗口显示**
>`ctrl+反引号`：打开**终端**
{%list%}
反引号即`
{%endlist%}
>`ctrl+shift+E/F/G/D/U`：显示侧边栏中的**资源管理器/搜索/Git/Debug/Output**
{%list%}
均采用ctrl+b关闭或者再次开启
{%endlist%}
>`ctrl+n/w`：**新建/关闭**当前文件
{%list%}
加上shift则是新建/关闭一个VSCode窗口
{%endlist%}
>`ctrl+p`：显示**跳转窗口**
{%list%}
再加上shift则是打开命令面板
{%endlist%}
>`ctrl+\`：**新建**一个**编辑器**并**分屏**，仅有**当前文件**，位于**窗口左边**
**②跳转窗口**
{%list%}
在跳转窗口输入不同的提示符会显示不同的内容
{%endlist%}
>`?`：显示当前**可执行的操作**

>`!`：显示`Errors`或`Warnings`
{%list%}
按下F8跳转到下一个
{%endlist%}
>`:`：后接**数字**，跳转**当前文件**的**对应行**

>`#`：显示**所有**的`symbol`

>`@`：显示**当前文件**的`symbol`

**③选取操作**
>`Home/End`：将光标置于**行首/尾**
{%list%}
加上ctrl则是将光标置于文件首/尾部
{%endlist%}

>`shift+Home/End`：选择从**光标处**到**行首/尾**的所有内容
{%list%}
加上ctrl则是选择从光标处到文件首/尾部的所有内容
{%endlist%}

>`alt+UP/Down`：将**光标所在行**上下移

>`ctrl+shift+l`：同时选中**所有**和**已选中内容相同**的字段

>`shift+alt+Left/Right`：**扩展/缩小**选取范围

**④辅助功能**

>`shift+alt+f`：代码**格式化**

>`F2`：同时修改**所有对应变量**，先**选中对应变量**再按下`F2`

>`F12`：跳转到**变量定义处**，先**选中对应变量**再按下`F12`

>`ctrl+tab`：在**已打开文件**中进行**切换**

>`ctrl+c/v/s/f/z`：**复制/粘贴/保存/查找/撤销**
{%list%}
ctrl+shift+f表示在整个工程目录下查找
{%endlist%}

#### 3.3配置文件
**①常用宏**
>`${workspaceFolder}`：**当前工程目录**的绝对路径

>`${fileDirname}`：**当前文件**所在**目录路径**

>`${fileBasenameNoExtension}`：**当前文件**的**文件名**

**②`launch.json`文件**
>在**Debug侧边栏**创建，进入`launch.json`文件并点击**右下角**的**添加配置**按钮
{%list%}
用于配置该项目的调试功能，此处选择的配置为(gdb) 管道启动
{%endlist%}
>修改`program`为**需要调试的可执行文件**的绝对路径
{%right%}
如果后续需要添加task.json文件，则需要添加preLaunchTask项，其后跟task.json的label项
{%endright%}
```
{
    "configurations": [
    {
        "name": "(gdb) 启动",
        "type": "cppdbg",
        "request": "launch",
        "program": "${workspaceFolder}/test",
        "args": [],
        "stopAtEntry": false,
        "cwd": "${fileDirname}",
        "environment": [],
        "externalConsole": false,
        "MIMode": "gdb",
        "setupCommands": [
            {
                "description": "为 gdb 启用整齐打印",
                "text": "-enable-pretty-printing",
                "ignoreFailures": true
            },
            {
                "description": "将反汇编风格设置为 Intel",
                "text": "-gdb-set disassembly-flavor intel",
                "ignoreFailures": true
            }
        ]
    }
    ]
}
```
**③`task.json`文件**
{%list%}
设置调试前进行的构建工作，以便于修改文件后立马进行调试
{%endlist%}
>在**命令窗口中**输入`task`，选择`Tasks:Configure Task`，在根据**编译器**选择**对应模板**即可
{%right%}
task.json的本质就是一条命令，以下为以g++的例子，如果需要执行Cmake也是类似
{%endright%}
>`args`为传给`command`的**命令行参数**，以下`task`文件相当于执行`g++ -g [文件路径] -o [输出文件]`

```
{
	"version": "2.0.0",
	"tasks": [
		{
			"type": "cppbuild",
			"label": "C/C++: g++ 生成活动文件",
			"command": "/usr/bin/g++",
			"args": [
				"-g",
				"${file}",
				"-o",
				"${fileDirname}/${fileBasenameNoExtension}"
			],
			"options": {
				"cwd": "${fileDirname}"
			},
			"problemMatcher": [
				"$gcc"
			],
			"group": "build",
			"detail": "编译器: /usr/bin/g++"
		}
	]
}
```