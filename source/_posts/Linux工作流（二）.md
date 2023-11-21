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
# Linux工作流（二）
## 实用工具
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

>**可视模式**：

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
#### 2.1编译
**①编译过程**
{%right%}
对于C语言，将g++修改为gcc即可
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
{%warning%}
只有使用该选项生成的可执行文件才能被gdb调试
{%endwarning%}
>`-O[n]`：**优化代码**，`n`表示**不同等级**
{%list%}
0表示不优化，1表示默认优化，23会进行一些对应的优化操作
{%endlist%}
>`-l`：指定**库文件**
{%list%}
默认去/lib、/usr/lib和/usr/local/lib中找对应库文件，如果没有，则需要用-L指定库文件路径
{%endlist%}
>`g++ -L/home/zfk/mylib -lmytest test.cpp`

>`-I`：指定**头文件路径**

>`-Wall`：打印**警告信息**，可以使用`-w`**关闭**

>`-std=c++11`：指定**编译标准**

>`-D[宏名]`：**定义宏**

#### 2.2调试
```
## 以下命令后括号内为命令的简化使用，比如run（r），直接输入命令 r 就代表命令run

$(gdb)help(h)	# 查看命令帮助，具体命令查询在gdb中输入help + 命令

$(gdb)run(r)	# 重新开始运行文件（run-text：加载文本文件，run-bin：加载二进制文件）

$(gdb)start		# 单步执行，运行程序，停在第一行执行语句

$(gdb)list(l) 	# 查看原代码（list-n,从第n行开始查看代码。list+ 函数名：查看具体函数）

$(gdb)set		# 设置变量的值

$(gdb)next(n)   # 单步调试（逐过程，函数直接执行）

$(gdb)step(s)	# 单步调试（逐语句：跳入自定义函数内部执行）

$(gdb)backtrace(bt)	# 查看函数的调用的栈帧和层级关系

$(gdb)frame(f) 	# 切换函数的栈帧

$(gdb)info(i) 	# 查看函数内部局部变量的数值

$(gdb)finish	# 结束当前函数，返回到函数调用点

$(gdb)continue(c)	# 继续运行

$(gdb)print(p)	# 打印值及地址

$(gdb)quit(q) 	# 退出gdb

$(gdb)break+num(b)			# 在第num行设置断点

$(gdb)info breakpoints		# 查看当前设置的所有断点

$(gdb)delete breakpoints num(d)	# 删除第num个断点

$(gdb)display				# 追踪查看具体变量值

$(gdb)undisplay				# 取消追踪观察变量

$(gdb)watch					# 被设置观察点的变量发生修改时，打印显示

$(gdb)i watch				# 显示观察点

$(gdb)enable breakpoints	# 启用断点

$(gdb)disable breakpoints	# 禁用断点

$(gdb)x						# 查看内存x/20xw 显示20个单元，16进制，4字节每单元

$(gdb)run argv[1] argv[2]	# 调试时命令行传参

$(gdb)set follow-fork-mode child#Makefile项目管理：选择跟踪父子进程（fork()）

```
