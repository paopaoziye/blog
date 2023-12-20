---
title: C语言学习笔记（三）
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
  - C语言
  - 《C和指针》
categories: 编程语言
keywords: 文章关键词
updated: ''
img: /medias/featureimages/0.webp
date:
summary: 预处理器
---
# C语言学习笔记（三）
## C语言进阶
### 1.预处理
#### 1.1引言
**①概述**
>在源代码**编译前**对其进行一些**文本性质**操作
{%list%}
如删除注释，处理预处理命令
{%endlist%}
**②预定义符号**
{%list%}
预处理器定义的符号，都有各自对应的含义
{%endlist%}
>`__FILE__`：进行编译的**源文件名**

>`__LINE__`：文件当前行的**行号**

>`__DATE__`：文件**被编译的日期**

>`__TIME__`：文件**被编译的时间**

>`__STDC__`：若**编译器**遵循`ANSI C`，返回1

**③常用预处理命令**
>`#define name stuff`：将**其后**的`name`**替换**为`stuff`
{%list%}
name全部大写，与普通变量相区分，若stuff太长，可以将其分为几行，除最后一行每行末尾添加一个反斜杠/
{%endlist%}
{%right%}
使用宏定义类型，只需要修改宏的值就可改变类型
{%endright%}
{%warning%}
stuff末尾不应该包含分号，否则可能会多出一条空语句
{%endwarning%}
>`#error message`：生成**错误信息**，其中`message`为**错误提示信息**

>`#line number "strings"`：定义**下一行行号**`number`，文件名`"strings"`
{%list%}
"strings"为可选选项，且该命令会修改__LINE__和__FILE__
{%endlist%}
>`#progma`：用于支持**因编译器而异**的特性，如向一个函数插入**内联的汇编代码**
{%warning%}
预处理器会忽略它不认识的#progma指令
{%endwarning%}
>`#undef name`：移除**宏定义**
#### 1.2宏
**①引言**
>**格式**：`#define name(parameter-list) stuff`
{%list%}
parameter-list为参数列表，参数之间用逗号,相隔，类似于函数的形参，stuff为包含参数列表中参数的表达式
{%endlist%}

#name会被预处理器处理为"name"，a##b会被预处理器处理为ab
**②实例**
>定义宏`#define SQUARE(x) ((x) * (x))`，在**代码块**中输入`SQUARE(a)`，在**预处理阶段**会被替换为`((5) * (5))`
{%list%}
宏中可以出现其他宏定义的符号，但是不能包含自身
{%endlist%}
{%warning%}
宏本质上还是简单的替换操作，所以要避免其与正文中的其他操作符发生预料之外的作用
{%endwarning%}
{%right%}
可以像上述一样采用()对每个参数和整体进行隔离
{%endright%}
{%wrong%}
name和(parameter-list)之间不能有空格
{%endwrong%}
**③带副作用的宏参数**
{%warning%}
当宏参数在宏定义中出现不止一次时，若宏参数具有副作用，可能会带来无法预料的后果
{%endwarning%}
{%list%}
副作用指永久性的效果，如x+1和x++，后者会永久改变x的值
{%endlist%}
>**以下程序**运行后结果`x = 6,y = 10,z = 9`，这是因为`z = MAX(x++,y++)`被替换为`z = ((x++)>(y++)?(x++):(y++))`，其中`y++`**执行了两次**
```
#define MAX(a,b) ((a)>(b)?(a):(b))
x=5;
y=8;
z = MAX(x++,y++);
```
{%right%}
为了避免这种情况，可以将宏需要使用的数据存储到临时变量中
{%endright%}

**④命令行控制宏**
{%list%}
在命令行编译时添加编译选项对宏进行定义和修改
{%endlist%}
>如`cc -DARRAY_SIZE=100 prog.c`，则就是将`ARRAY_SIZE`**修改**为`100`

>其他的选项还有`-Uname`（**忽略宏**`name`）以及`-Dname`（**定义宏**`name`）

**⑥宏的利与弊**
{%list%}
宏比较适用于频繁使用的小型简单代码，因为函数的调用和返回也需要开支
{%endlist%}
{%right%}
宏是与类型无关的，有些参数无法传递给函数，比如说传递参数的类型
{%endright%}
>如`#define MALLOC(n,type) ((type*)malloc((n)*sizeof(type)))`
{%warning%}
宏会使得代码变得更长，因为宏的本质就是插入代码副本
{%endwarning%}

#### 1.3条件编译
**①定义**
>选择**一部分代码**在编译时是被**正常编译**还是被**忽略**

**②格式**
>`constant-expression`：为**常量表达式**，当其为**非零值**时，`statement`被**正常编译**，反之则被**忽略**
{%right%}
常常为宏，并和命令行控制宏一同使用
{%endright%}
{%list%}
elif、else子句出现的次数可以不限，只有当其前面所有常量表达式均为假，且自身常量表达式为真，才被正常编译
{%endlist%}
{%warning%}
记住要以#endif结束条件编译
{%endwarning%}
```
#if constant-expression
  statement0
#elif constant-expression
  statement1
#else
  statement2
#endif
```
**③定义判断**

>`#if defined(symbol)`、`#ifdef symbol`
{%list%}
若symbol被定义则为真
{%endlist%}

>`#if !defined(symbol)`、`#ifndef symbol`
{%list%}
若symbol没有被定义则为真
{%endlist%}
#### 1.4文件包含
**①格式**
>`#include <filename>`/`#include "filename"`
{%list%}
前者表示在编译器定义的标准位置寻找相关文件，后者表示优先在源文件所在目录寻找相关文件，没有再去标准位置
{%endlist%}
{%right%}
include的实质就是将对应文件内容复制到对应位置
{%endright%}
**②嵌套包含**
{%warning%}
有些头文件中还会包含其他的头文件，可能会导致某些头文件被包含多次
{%endwarning%}
{%right%}
可以使用条件编译避免这种情况
{%endright%}
>如下，`_TOUWENJIAN_H`为这个**头文件的代号**，当头文件被**第一次被包含**时，其被**定义**为`1`，**第二次被包含**时，通过**条件编译**，**忽略**其内容

```
#ifndef _TOUWENJIAN_H
#define _TOUWENJIAN_H 1
    All the stuff that you want in the header file
#endif 
```
{%wrong%}
应该避免多重包含，因为上述做法只能忽略重复读入内容，该文件还是会被多次读取
{%endwrong%}
#### 1.5命令行参数
>`main`**函数**有**两个形参**用于接收**命令行参数**，`int main (int argc,char **argv)`

>`argc`：命令行参数的**数目**

>`argv`：本质上是一个**指向字符指针的指针**，将**命令行参数**看作为一个**字符指针数组(以空指针结尾)**，该参数指向该数组的**第一个参数**

{%list%}
命令行第一个参数固定是程序的名称，不需要用户输入
{%endlist%}
{%warning%}
注意命令行参数是字符数组，在C中，没有字符串
{%endwarning%}
![命令行参数](/image/C_5.png)

***

### 2.I/O函数
{%list%}
包含stdio.h头文件
{%endlist%}
#### 2.1基本概念
**①流**
>**定义**：**I/O操作**就是从程序**移进或移出字节**，这个**字节流**称为**流**
{%list%}
流本质上是一个指向FILE数据结构的指针，每个流都有一个相应的FILE文件与它关联
{%endlist%}
>**标准流**：**标准输入**`stdin`，**标准输出**`stdout`和**标准错误**`stderr`
{%list%}
通常标准输入设备为键盘，标准输出/错误设备为终端或者屏幕
{%endlist%}

>**文本流**：零个或者多个**字符**，以**换行符**结束（**UNIX系统**）
{%right%}
文本流的结束形式在不同的系统上可能不同，但是库函数会将标准形式（换行符）转化为对应的形式
{%endright%}
>**二进制流**：完全根据**程序编写它们的形式**输入/出

**②缓冲区**
>**定义**：**流**并不是**直接**从**输入端**到**输出端**，而是要**经过**一块称为**缓冲区**的**内存区域**
{%list%}
缺省情况下，I/O函数库为流动态分配一个缓冲区
{%endlist%}
>**输出缓冲区**：在**被写满**的时候才会被**写入（刷新）**到**设备**或者**文件**中

>**输入缓冲区**：同理，输入缓冲区**为空时**才会从**设备**或**文件**中**读取数据**
{%list%}
上述的缓冲为完全缓冲，但是通常情况下，流的缓冲状态由编译器决定，通常是请求输入的同时刷新输出缓冲区
{%endlist%}
{%right%}
可以使用int fflush(FILE *stream)使输出缓冲区立即刷新
{%endright%}
**③标准I/O常量**
>`EOF`：**提示**到达了**文件末尾**，所选择的实际值**比一个字符要多几位**

>`FOPEN_MAX`：一个程序**最多**能**打开文件的数量**，**至少是8**（包括**三个标准流**）

>`FILENAME_MAX`：**合法文件名**的**最大长度**

**④临时文件**
>**定义**：使用一个文件**临时保存数据**，当**程序结束**时，该文件就被**删除**

>`FILE *tmpfile(void)`：创建了一个**临时文件**，以`"wb+"`模式打开，当**文件被关闭或程序终止**时，文件便被**删除**
{%list%}
若该文件需要需以其他模式打开，或者需要由一个程序打开，由另一个程序读取，都不适用临时文件
{%endlist%}
>`char *tmpnam(char *name)`：给临时文件**命名**，参数需是一个指向**长度至少**为`L_tmpnam`的**字符数组的指针**
{%list%}
若参数为NULL，函数返回一个静态数组的指针，该数组包含了文件名
{%endlist%}
**⑤错误报告**
>`void perror(char const *message)`：若`message`不为`NULL`，则该函数**打印出这个字符串**，后面跟**一个分号**和**一个空格**，并打印出**当前errno**以及**对应的信息**
{%list%}
errno位错误代码，定义在errno.h头文件中
{%endlist%}
{%warning%}
只有当库函数失败时才会刷新errno，故需要在一些可能出错的地方判断错误是否发生，再调用该函数提示错误信息
{%endwarning%}
#### 2.2流的操控
**①创建流**
{%list%}
调用fopen函数创建一个流，指定访问的文件/设备以及他们的访问方式，并初始化FILE结构
{%endlist%}
>**函数原型**：`FILE *fopen(char const *name,char const *mode);`

>其中`name`是**希望打开**的**设备和文件的名字**
{%warning%}
时刻检查fopen的返回值，若为空则表示没有创建成功
{%endwarning%}
>`mode`提示**流**的**操作模式**以及**分类**

>**文本流**：`"r"`**只读** 、`"w"`**只写**、`"a"`**添加**

>**二进制流**：`"rb"`**只读**、`"wb"`**只写**、`"ab"`**添加**

**②操作模式**
>**读**：访问文件**必须已经存在**

>**写**：访问文件**存在**，**原来的内容就会被删除**，若**不存**在，则会**新创建一个**

>**添加**：类似于写，但是**不会覆盖内容**，而是在**尾部**写入**新内容**

**②重新打开一个流**
>`FILE *freopen(char const *filename,char const *mode,FILE *stream)`
{%list%}
该函数试图关闭stream对应的流，并重新打开它
{%endlist%}


**④流的位置控制**
>`long ftell(FILE *stream)`：返回**下一个读写将要开始位置**距离**文件起始位置**的偏移量
{%list%}
对于二进制流，这个偏移量为字节数，对于文本流，这个值取决于系统（由于行末字符映射）
{%endlist%}

>`int fseek(FILE *stream,long offset,int from)`：改变**下一次读写的起始位置**，由`from`和`offset`决定
{%list%}
from参数有三种值
{%endlist%}
>`SEEK_SET`：从流的**起始位置**起`offset`个字节，`offset`必须是一个**非负值**

>`SEEK_CUR`：从流的**当前位置**起`offset`个字节，`offset`**可正可负**

>`SEEK_END`：从流的**尾部位置**起`offset`个字节，`offset`**可正可负**，当其为**正数**时，**写入**将**扩展这个文件**，**读取**将获得一条**到达文件尾的信息**
{%list%}
为了其可移植性，from为SEEK_END或者SEEK_CUR时，offset需为0，from为SEEK_SET时，offset需为同一个流中之前调用ftell获得的返回值
{%endlist%}
{%warning%}
二进制流中，SEEK_END定位可能不被支持
{%endwarning%}
{%wrong%}
调用fseek之后，行末指示字符将会被清除
{%endwrong%}

**⑤改变缓冲方式**
{%list%}
只有当指定流被打开但是还没有对其进行操作时，才能调用这些函数
{%endlist%}
>`void setbuf(FILE *stream,char *buf)`：为**流**设置了**一个数组**作为其**缓冲区**
{%list%}
若数组指针为空，则关闭流的所有缓冲方式，按照程序规定的方式读取写入（操作系统有自己的缓冲方式）
{%endlist%}
{%warning%}
该数组长度必须为BUFSIZ，定义在stdio.h中
{%endwarning%}

>`int setvbuf(FILE *stream,char *buf,int mode,size_t size)`：其中，`mode`用于指定**缓冲的类型**，`buf`用于指向**缓冲区**，`size`用于指定**缓冲区大小**
{%list%}
mode的参数类型有三种
{%endlist%}
>`_IOFBF`：**完全缓冲**

>`_IONBF`：**不缓冲**

>`_IOLBF`：**行缓冲**，即每当**换行符被写入缓冲区**时，缓冲区便**刷新**
{%right%}
缓冲区的大小最好是BUFSIZ的整数倍（与磁盘簇大小相匹配），否则可能会需要一些额外的磁盘操作
{%endright%}

**⑥状态判断**
>`int feof(FILE *stream)`：若流处于**文件尾**，则返回真

>`int ferror(FILE *stream)`：若流出现**读写错误**，函数返回真

>`int clearerr(FILE *stream)`：**重置**流的错误状态

**⑦关闭流**
>`int fclose(FILE *f);`：调用`fclose`**关闭对应流**，并**释放**`FILE`文件。如果**执行成功**，返回**零值**，**否则**返回`EOF`
{%list%}
如果关闭的是输出流，那么这个函数还会刷新缓冲区
{%endlist%}
{%warning%}
及时释放流，防止流对应的文件被访问修改
{%endwarning%}

#### 2.3I/O函数
{%list%}
依据处理数据的类型将其分为单个字符、文本行和二进制数据三种
{%endlist%}
**①字符I/O**
>**读取**：`int getchar(void)`、`int getc(FILE *stream)`、`int fgetc(FILE *stream)`
{%list%}
每次从流中读取下一个字符，如果不存在更多的字符，则返回EOF，其中getchar从标准输入读取字符
{%endlist%}
>**写入**：`int putchar(int character)`、`int putc(int character,FILE *stream)`、`int fputc(int character,FILE *stream)`
{%list%}
从流中输出一个字符，其中putchar写入到标准输出中
{%endlist%}
{%warning%}
在打印前，这些函数会整型参数裁剪为一个无符号字符型
{%endwarning%}
{%right%}
其中fgetc和fputc是函数，其余是宏
{%endright%}
>**字符回退**：`int ungetc(int character,FILE *stream)`
{%list%}
将一个字符返回到流中，以便于重新读入，退回到流和写入到流是不同的，前者类似于压栈，后者类似于队列的增长
{%endlist%}
{%warning%}
如果流的位置之后被改变，则退回的字符会被丢弃
{%endwarning%}

**②未格式化行I/O**
>**读取**：`char *fgets(char *buffer,int buff_size,FILE *stream)`、`char *gets(char *buffer)`

>从`stream`**流**中**读取字符**并**复制**到`buffer`中，当读取到**一个换行符**或者**字符数达到**`buffer_size-1个`时就**停止读取**

>在**缓冲区结尾**添加一个`nul`，使其**成为一个字符串**
{%list%}
gets函数没有缓冲区长度，所以很可能导致缓冲区溢出，只适用于玩具程序
{%endlist%}
{%right%}
若没有读取到字符，即到了文章尾，就返回NULL，否则返回buffer对应的指针
{%endright%}
{%warning%}
gets与fgets类似，是从标准输入中读取，但是gets不会存储换行符
{%endwarning%}

>**写入**：`int fputs(char const *buffer,FILE *stream)`、`int puts(char const *buffer)`

>传递给`fputs`的缓冲区**必须包含一个字符串**，并将该字符串**逐字符**写入**流**中，如果写入时发生了**错误**，则返回`EOF`
{%list%}
puts与fputs类似，写入到标注输入中，且puts在写入一个字符串后，会再输出一个换行符
{%endlist%}

**③二进制I/O**
>**读取**：`size_t fread(void *buffer,size_t size,size_t count,FILE *stream)`

>**写入**：`size_t fwrite(void *buffer,size_t size,size_t count,FILE *stream)`

>其中`buffer`指向用于**保存数据的内存位置**，`size`为缓冲区**每个元素的字节数**（使用sizeof计算即可），`count`为**读取或者写入的元素数**，`stream`为**指定的流**
{%right%}
二进制I/O的效率非常高，省去了转换的开销
{%endright%}
#### 2.4格式化读取
{%list%}
内容较多且重要，故单列出来
{%endlist%}
**①scanf家族**
>`int fscanf(FILE *stream,char const *format,...)`

>`int scanf(char const *format,...)`

>`int sscanf(char const *string,char const *format,...)`

>从**某输入源**读入数据，其中`fscanf`为`stream`**指定的流**，`scanf`为**标准输入**，`sscanf`为`string`**指向的字符串**

>当**格式化字符串**到达**末尾**或者读取的输入**不再与格式匹配**时，**输入停止**，返回**转化的输入值的数目**，若**没有读取**输入值，则返回`EOF`
{%list%}
其中...表示一个可变长度的指针列表，从输入源读取的数据转化后就存储在这些指针指向的位置
{%endlist%}
{%right%}
format为一个字符串，可以控制读取过程
{%endright%}
**②format字符串**
{%list%}
format字符串可能包含三种内容，即空白字符、格式代码和其他字符
{%endlist%}

>**空白字符**：**丢弃**输入中的**所有空白字符**

>**格式代码**：指定**如何解释**接下来的**输入字符**

>**其他字符**：当出现**其他字符**时，**下一个输入字符**必须与他匹配，若**匹配**，该字符被**丢弃**，若**不匹配**，则**直接结束**

**③scanf格式代码详解**
{%list%}
以%开头，后面接一个可选的星号（`*`）、可选的宽度、可选的限定符和格式代码
{%endlist%}
>**星号（`*`）**：使**转换后的值**被**丢弃**而不是被存储
{%right%}
可以用于跳过不需要的字符
{%endright%}
>**宽度**：用于**限制**读取的输入字符的**个数**
{%list%}
若没有限定宽度，则遇到空白字符停止
{%endlist%}
>**限定符**：修改一些**格式代码的含义**，主要是指定**参数的长度**，有`h`、`l`、`L`

>`h`修饰**整型**和**无符号数**，表示`short`和`unsigned short`

>`l`修饰**整型**、**无符号数**和**浮点型**表示`long`、`unsigned long`和`double`

>`L`修饰**浮点型**表示`long double`
{%right%}
在转换short、long和long double时，采用适当的限定符，提高程序可移植性
{%endright%}
>**格式代码**：一个**单字符**，表明**如何解释输入字符**
{%list%}
c表示char，d表示十进制int，u表示十进制无符号数，f表示浮点数等等
{%endlist%}

#### 2.5格式化写入
**①printf家族**
>`int fprintf(FILE *stream,char const *format,...)`

>`int printf(char const *format,...)`

>`int sprintf(char const *buffer,char const *format,...)`

>根据`format`**字符串**将参数列表的值**格式化**，并**输出**到一定的**输出源**中，**返回值**为**实际输出的字符数**
{%list%}
其中fprintf为stream指定的流，printf为标准输入，sprintf为buffer指向的缓冲区
{%endlist%}
{%warning%}
使用sprintf要注意缓冲区的溢出问题
{%endwarning%}

**②format格式代码**
{%list%}
由%开头，后跟零个或多个标志字符、可选的最小字段宽度、可选的精度、可选的修改符以及转换类型
{%endlist%}

>**标志字符**：决定其**表现形式**，如**对齐**、**填充格式**等

>**字段宽度**：指定出现在结果中的**最小字符数**，如果**值的字符数小于该值**，则对其进行**填充**

>**精度**：以**一个句号开头**，后跟一个可选的**十进制整数**，不同**转换类型**的格式也不尽相同，对于`f`是规定**小数点后的位数**，对于`s`则是指定被转换的**最多字符**

>**修改符**：类似于`scanf`格式代码中的**限定符**，指定**长短类型**

>**转换类型**：转化为那种**数据类型**、**格式**和**进制**等，常用的有整数`d`、字符串`s`和浮点数`f`
{%right%}
其中字段宽度和精度可以用星号替代，由print的下一个参数指定
{%endright%}
{%warning%}
当字符或短整数作为printf的参数时，会被先转化为整数，需要使用修改符，修改符在转换发生之前将其转换为对应类型，同样在长整型和int长度不同的环境中也需要对应的修改符指明其长度
{%endwarning%}

***
### 3.标准函数库
#### 3.1整型函数
**①算数**
>`int abs(int value)`：返回**绝对值**

>`div_t div(int x,int y)`：将**第二个参数**除以**第一个参数**，产生**商**和**余数**
{%list%}
其中商是最靠近精确解的整数，其中div_t是一个结构，其中quot是商，rem是余数
{%endlist%}
{%right%}
都有对应的处理长整型的版本
{%endright%}
{%warning%}
/操作符的除法运算结果并未精确定义，当其操作数任一为负数且不能整除时，商和精确解的舍入关系取决于编译器
{%endwarning%}
**②随机数**
>`int rand (void)`：返回一个`0`至`RAND_MAX`**区间内**的**伪随机数**
{%right%}
为了得到特定范围的伪随机数，可以对其进行取模并添加偏移量
{%endright%}
>`void srand(unsigned int seed)`：利用`seed`对`rand`进行**初始化**
{%right%}
seed常常采用每天的时间，即srand((unsigned int)time(0))
{%endright%}


#### 3.2浮点型函数
**①算数**
>`double sqrt(double x)`：取**平方根**

>`double exp(double x)`：返回以`e`的`x`**次幂**

>`double floor(double x)`：返回**不大于参数**的**最大整数**

>`double ceil(double x)`：返回**不小于参数**的**最小整数**

>`double fabs(double x)`：返回参数的**绝对值**

>`double fmod(double x,double y)`：返回`x`除以`y`的**余数**
{%wrong%}
参数需要在定义域内，结果需要在double所能表示的范围内
{%endwrong%}
**②三角函数**
>`sin`、`cos`、`tan`、`asin`、`acos`、`atan`
{%list%}
这些函数接收返回均为double，sin、cos、tan的参数是弧度，asin、acos、atan的参数范围从-1至1
{%endlist%}
**③对数和指数函数**
>`double exp(double x)`：`e`的`x`次幂

>`double pow(double x,double y)`：`x`的`y`次幂，其中`x`不能是**负数**，`y`必须是**整数**

>`double log(double x)`：以`e`为底的**对数**

>`double log10(double x)`：以`10`为底的**对数**
{%right%}
可以采用换底公式计算任意底数的对数
{%endright%}
**④浮点数表示**
>`double frexp(double value,int *exponent)`：该函数返回`fraction`，并将`exponent`存储到第二个参数**指定位置**，其中`fraction*2^exponent = value`

>`double ldexp(double fraction,int exponent)`：配合以上函数，**还原该浮点数**
{%right%}
用于浮点格式不兼容的机器之间传递浮点数
{%endright%}
{%warning%}
要记得包含math.h头文件，绝大部分参数和返回值都是double类型
{%endwarning%}
#### 3.3时间与日期函数
{%list%}
要记得包含time.h头文件
{%endlist%}
**①处理器时间**
>`clock_t clock(void)`：返回从**程序开始**起**处理器**消耗的时间
{%list%}
clock_t由编译器定义，通常是处理器时钟滴答的次数，可以将其除以CLOCKS_PER_SEC转化为秒
{%endlist%}
{%right%}
如果想要精确的执行时间，可以在程序（某段语句）开始处与结尾处，各放置一个clock()，将结果相减
{%endright%}
{%warning%}
若操作系统不能追踪处理器时间，则返回已经流逝的实际时间数量
{%endwarning%}
**②当天时间**
>`time_t time(time_t *returned_value)`：返回**当前**的**时期**和**时间**，并存储到**参数指向位置**，当**机器无法提供时间**或者**时间值太大**，就返回`-1`
{%list%}
不同的编译器格式不同，常见的形式是从某一特定时间开始流逝的秒数，在UNIX中，这个时间为1970年1月1日零点
{%endlist%}
**③日期和时间的转换**

>`double difftime(time_t time1,time_t time2)`：计算`time1-time2`，并将其**转化为秒**
{%warning%}
不要直接调用两次time函数并相减
{%endwarning%}
>`struct tm *gmtime(time_t const *time_value)`：将时间转换为**世界协调时间**

>`struct tm *localtime(time_t const *time_value)`：将时间转换为**当地时间**
{%list%}
tm结构包含了很多与时间有关的成员
{%endlist%}
>`char *ctime(time_t const *time_value)`：接收一个`time_t`的指针，返回一个对应时间的字符串

>`char *asctime(struct tm const *tm_ptr)`：将`tm`结构转化为与`ctime`结果一样的字符串
{%list%}
字符串格式是固定的，编译器通常将其保存在一个静态数组中，如果想要特定格式的字符串，可以调用strftime()
{%endlist%}
**3.4非本地跳转**
{%list%}
要记得包含setjmp.h头文件
{%endlist%}
**①定义**
>类似于`goto`语句，但是**不局限于一个函数的作用域**之内

**②相关函数**
>`int setjmp(jmp_buf state)`：**初始化**一个`jmp_buf`变量，并将**程序的状态信息**保存到**跳转缓冲区**
{%list%}
调用setjmp的函数称为顶层函数
{%endlist%}
>`void longjmp(jump_buf state,int value)`：使得**跳转缓冲区的状态被恢复**，从而**立即跳转**到**顶层函数**

**3.5信号**
{%list%}
要记得包含signal.h头文件
{%endlist%}
**①含义**
>一种**非程序本身**引发的事件

**②标准定义的信号**
>`SIGABRT`：**程序请求异常终止**，由`abort`函数引发，常见的错误是**算数溢出**以及**除零错误**

>`SIGFPE`：发生一个**算数错误**

>`SIGILL`：检测到**非法指令**，比如**指令版本不同**

>`SIGSEGV`：检测到**对内存的非法访问**，比如访问**未分配给该程序的内存**，或者出现**边界对齐错误**

>`SIGINT`：收到一个**交互性注意信号**

>`SIGTERM`：收到到一个**终止程序的请求**

**③信号处理**
>`int raise(int sig)`：显示地**引发一个信号**

>`void (*signal(int sig,void(*handler)(int))) (int)`：将**某信号的处理函数**指定为`handler`
{%list%}
将函数简化为void(*signal()) (int)，则signal是一个返回类型为函数指针（对应信号以前的处理函数）的函数，其所接受参数sig为标准定义的信号，handler为希望信号发生时调用的函数，当函数调用失败时，返回SIG_ERR
{%endlist%}


{%right%}
还可以将signal函数第二个参数替换为SIG_DFL，恢复对该信号的缺省反应；或者替换为SIG_IGN，使该信号被忽略
{%endright%}

#### 3.6执行环境
**①终止程序**
>`void abort(void)`：引发`SIGABRT`信号，若**没有**在程序中为其**设置信号处理函数**，则**程序终止**

>`void atexit(void(func)(void))`：把**一些函数**注册为**退出函数**，当程序**正常终止（调用`exit()`函数）**，**退出函数**将被调用
{%warning%}
注意该退出函数的格式
{%endwarning%}
>`void exit(int status)`：当**该函数被调用**时，所有被`atexit()`**注册的函数**将按照他们**注册的顺序**被**反序**调用，随后**刷新所有缓冲区**，**关闭所有文件**，并**删除所有临时文件**
{%list%}
main函数return语句相当将返回值传递给exit()并调用它
{%endlist%}
{%wrong%}
由atexit()注册的函数中不能包含exit()，其结果是未定义的
{%endwrong%}
**②断言**
>`void assert(int expression)`：当`expression`为假时，向**标准错误**打印一条**诊断信息**并**终止程序**
{%list%}
本质上是一个宏，其诊断信息的格式由编译器定义
{%endlist%}
{%right%}
可以通过定义NDEBUG宏消除所有断言，可以将其定义为任意值
{%endright%}
**③环境与系统**
>`char *getenv(char const *name)`：在**环境**中查找一个**特定的名字**，如果**找到**则返回一个**不能修改**的**字符指针**，否则返回`NULL`
{%list%}
环境：一个由编译器定义的名字/值对的列表
{%endlist%}
>`void system(char const *command)`：将字符串传递给**操作系统**，将其作为一条命令，由**系统的命令处理器**运行

**④排序与查找**
>`qsort()`：以**升序**的方式**对数组进行排序**，与**类型无关**

>**函数原型**：`void qsort(void *base,size_t n_elements,size_t el_size,int(*compare)(void const *,void const *))`
{%list%}
其中第一个参数指向需要排序的数组，第二个参数指定数组中元素的数目，第三个参数指定每个元素的长度，第四个参数时一个用于比较的函数指针
{%endlist%}
>`bsearch()`：在一个已经**排好序**的数组中用**二分法**查找一个**特定的元素**

>**函数原型**：`void *bsearch(void const *key,void const *base,size_t n_elements,size_t el_size,int(*compare)(void const *,void const *))`
{%list%}
其中第一个参数时需要查找的值，第二个参数指向查找的数组，第三个参数指定数组的数目，第四个参数是每个元素的长度，最后一个参数是用于比较的函数指针
{%endlist%}

**3.7本地化**
{%list%}
详细见《C与指针》p347-349
{%endlist%}
**①`locale`**
>一组**特定的参数**，每个**国家**和**地区**都**不同**

**②设置`locale`**

>`char *setlocale(int category,char const *locale)`

>其中，`category`用于指定`locale`的**哪个部分**需要被修改，`locale`指定新的`locale`，若该参数为`NULL`，则返回当前的`locale`

**③`setlocale`参数列表**

>`LC_ALL`：整个`locale`

>`LC_COLLATE`：**字符集对照序列**，将影响`strcoll`和`strxfrm`函数的行为

>`LC_CTYPE`：定义于`ctype.h`中的函数所使用的**字符类型分类**信息

>`LC_MONETARY`：**格式化货币值**使用的**相关字符**

>`LC_NUMERIC`：**格式化非货币值**使用的**相关字符**

>`LC_TIME`：`strftime`**函数的行为**


assert(expression)，若表达式为假，则输出信息并终止程序运行，否则就当无事发生
属于预处理器管理
只有在定义了DEBUG预处理变量，assert才正常工作

#ifndef DEBUG
//debug专属代码
#endif
