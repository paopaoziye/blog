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
sudo apt-get update  //更新软件包来源
sudo apt-get upgrade //更新所有能更新的软件
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
### 2.操作系统接口
#### 2.1进程和内存
>`int fork()`：创建一个**内存**与其**完全相同**的**子进程**，即**指令**、**数据**和**堆栈**
{%list%}
在父进程中，返回值为子进程的PID，在子进程中，返回值为0
{%endlist%}

>`exit(int status)`：**销毁**当前进程并**释放资源**
{%list%}
主动结束进程，当status为0时，表示正常结束，1表示发生错误并结束
{%endlist%}

>`void wait(void *)`：进程**立刻阻塞**，若其有**子进程主动退出或者被杀死**，返回**子进程PID**，反之则**一直等待**
{%list%}
传入参数为一返回地址，用于接受子进程退出状态，如果不关心该信息，传入一个0地址（int*）0
{%endlist%}
{%right%}
对于父子进程共享的信息，可以先让父进程wait，让子进程先访问
{%endright%}
>`void exec(char* filename，char* argv)`：在**进程内部**执行一个**可执行文件**
{%list%}
filename用于提供文件路径，argv用于提供字符串参数数组，其中对应文件必须有特定的格式
{%endlist%}

#### 2.2I/O操作
>**文件描述符**：本质上是一个**小整型**，用于将**文件**、**目录**和**设备**等抽象为**字节流**
{%list%}
各个进程的文件描述符是相互隔离的，每个进程都至少有一个标准输入0，标准输出1和标准错误2
{%endlist%}

>`int read(int fd,char* buf,int n)`：从`fd`中**最多读取n字节**，并复**制到缓冲区**`buf`中，返回**读取的字节数**
{%warning%}
读取字节数为0表示到达文件末尾
{%endwarning%}
>`write(fd，buf，n)`：将**缓冲区**`buf`中的**n个字节**写入`fd`中，返回**写入的字节数**
{%list%}
每个文件都会记录其字节流所在位置信息，所以每次读写的起始位置是不同的
{%endlist%}
{%warning%}
若写入字节小于n，则表示发生了错误
{%endwarning%}

>`close(int fd)`：**释放**文件描述符，使其可以被**重新分配**

>`int open(char* filename,MACRO)`：为文件**分配文件描述符**，并指定**字节流特性**
{%list%}
新分配的文件描述符号，总是当前进程最小的
{%endlist%}
{%right%}
常用的宏有O_RDONLY只读、O_WRONLY	只写、O_RDWR可读可写
{%endright%}
>还有`O_CREAT`若文件**不存在**则**创建该文件**、`O_TRUNC`将文件**截断为零长度**

>`int dup(int fd)`:接受一个**文件描述符**，返回一个**新文件描述符**，**一同**指向**对应文件**
{%list%}
父进程和子进程，以及dup得到的文件描述符和原文件描述符之间的字节流位置偏移是共享的
{%endlist%}
#### 2.3管道

#### 2.4

shell的实现：getcmd读取命令行内容，fork创建一个shell进程的副本，父进程调用wait，子进程根据用户输入的命令执行对应操作，通常是使用exec跑一个命令脚本
错误文件描述符的I/O重定向？？？



管道是一对公开的小型内核缓冲区，一个用于读取，一个用于写入
pipe(int* p)：创建一个新的管道，并在数组p中记录读写文件描述服
数组p的长度为2
```
int p[2];
char *argv[2];
argv[0] = "wc";
argv[1] = 0;
pipe(p);
if (fork() == 0) {
    close(0);
    dup(p[0]);
    close(p[0]);
    close(p[1]);
    exec("/bin/wc", argv);
} else {
    close(p[0]);
    write(p[1], "hello world\n", 12);
    close(p[1]);
}
```


抽象硬件并提供接口
程序共用硬件资源并且相互之间隔离，可以协同，共享数据，也可以防止别的进程访问
拥有完整硬件

当程序阻塞时，记录进程的状态CPU寄存器，等下一次执行时回复
使用fork创建新进程，调用fork的称为父进程，子进程内存内容与父进程完全相同，在父进程中，返回子进程的PID，在子进程中，返回0
exit停止对应进程并释放资源
wait返回当前进程已退出的子进程的PID
