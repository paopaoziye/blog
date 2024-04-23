---
title: Linux驱动（一）
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
  - Linux驱动
  - 设备驱动
categories: Linux
keywords: 文章关键词
updated: ''
img: /medias/featureimages/28.webp
date:
summary: Linux驱动基础
---
# Linux驱动（一）
## 快速入门
### 1.驱动基础
#### 1.1引言
**①定义**
>**概述**：根据设备**工作原理**，读写**寄存器**，完成设备的**轮询**、**中断处理**、**DMA通信**等，使设备顺利完成工作
{%list%}
没有操作系统时，可以自定义接口，通常为一个头文件和一堆源文件，有操作系统时，需要根据架构设计驱动
{%endlist%}
{%right%}
无操作系统的单任务架构，通常为一个无限循环中夹杂着对设备中断的检测或者对设备的轮询
{%endright%}
**②设备**
>**概述**：主要可分为**字符设备**、**块设备**和**网络设备**，字符设备需要**串行访问**，块设备可以**随机访问**
{%list%}
网络设备面向数据包的接收和发送而设计
{%endlist%}

**③内核编译**
常用的方法有make config make menuconfig make xconfig make gconfig
后两者分别依赖QT和GTK+
解压在源码目录输入上述命令即可
会生成一个.config配置文件，记录哪些被编译进内核，哪些被编译进内核模块

arch/arm/configs/xxx_defconfig包含了许多电路板的默认配置，运行make ARCH=arm xxx_defconfig即可

编译内核和模块
make ARCH=arm zImage
make ARCH=arm modules
在源代码根目录下得到未压缩的内核映像vmlinux和内核符号表文件System.map
在arch/arm/boot下会得到压缩的内核映像zImage

#### 1.2Linux内核模块
**①定义**
>**概述**：一段可以**动态加载**到内核的代码，主要由**加载函数**、**卸载函数**和**模块信息**等组成
{%list%}
除此之外，还可定义模块参数和导出内核符号
{%endlist%}
{%right%}
Linux内核驱动以模块的形式出现，本身并不被编译到内核映像
{%endright%}
**②加载函数和卸载函数**
>**概述**：模块**装载/卸载**时**自动调用**的函数，需要调用`module_init()/module_exit()`**标记**对应函数
{%list%}
加载函数需要以__init标识修饰，卸载函数需要以__exit标识修饰
{%endlist%}
>被`__init`修饰的**函数**如果直接被**编译入内核**，会被存放在`.init.text`区段中，内核**初始化完成**后会被**释放**
{%right%}
只在加载过程中使用的数据可以使用__initdata标识，只在卸载过程中使用的数据可以使用__exitdata标识
{%endright%}
```c
static int __init init_fun(void)
{
  /*初始化代码*/
}
module_init(init_fun);
```
```c
static void __exit exit_fun(void)
{
  /*释放代码*/
}
module_exit(exit_fun);
```
**③参数和符号**
>**概述**：**参数**即在模块**加载过程**中可以**传递给模块**的值，**符号**则是可以**共享**给其他模块的**变量和函数**等
{%list%}
/sys/module/模块名/parameters记录了参数信息，/proc/kallsyms记录了符号和符号内存地址
{%endlist%}
{%right%}
可以在加载模块时给参数赋予新值，如果模块被编译入内核，则需要在bootloader的bootargs设置参数的新值
{%endright%}
>加载模块时，使用`insmode 模块名 参数名=参数值`指令即可**修改参数的值**
```c
//参数设置，调用module_param(参数名，参数类型，参数读写权限)定义一个参数
//若参数为数组，则需要调用module_param_array(数组名，数组类型，数组长，读写权限)
static int a_num = 4000;
module_param(a_num,int,S_IRUGO);
```
```c
//符号设置
EXPORT_SYMBOL(符号名);
EXPORT_SYMBOL_GPL(符号名)；
```
**④模块信息**
>**概述**：通过下列宏设置对应的**模块信息**，其中**许可证信息**是**每个模块**都需要的
{%list%}
描述内核模块的许可权限，通常使用MODULE_LICENSE("GPL v2")，不声明模块将无法使用
{%endlist%}
```c
MODULE_AUTHOR(作者名);
MODULE_DESCRIPTION(描述信息);
MODULE_VERSION(版本);
MODULE_DEVICE_TABLE(设备表);
MODULE_ALIAS(别名)；
MODULE_LICENSE(许可证);
```
**⑤hello模块**
>**概述**：模块的**源文件**和`makefile`**文件**如下，`make`编译后产生`hello.ko`文件
{%list%}
可以调用insmod和rmmode加载和卸载，并调用和lsmod查看模块已经加载的模块以及依赖关系
{%endlist%}
>`insmod ./hello.ko`加载该模块，`rmmode hello`卸载该模块
{%right%}
调用modprobe加载/卸载模块时会加载/卸载与其有依赖关系的模块
{%endright%}
>`modprobe ./hello.ko`**加载**模块，`modprobe -r./hello.ko`**卸载**模块
```c
#include <linux/init.h>
#include <linux/module.h>

static int __init hello_init(void)
{
  printk(KERN_INFO"Hello world enter\n");
  return 0;
}
module_init(hello_init);
static void __exit hello_exit(void)
{
  printk(KERN_INFO"Hello world exit\n");
}
module_exit(hello_exit);
MODULE_AUTHOR("zfk");
MODULE_DESCRIPTION("a simple module");
MODULE_VERSION("GPL v2");
```

```makefile
KVERS = $(shell uname -r)
# Kernel modules
obj-m += hello.o
# Specify flags for the module compilation
#EXTRA_CFLAGS=-g -O0
build: kernel_modules
kernel_modules:
    make -C /lib/modules/$(KVERS)/build M=$(CURDIR) modules
clean:
    make -C /lib/modules/$(KVERS)/build M=$(CURDIR) clean
```
#### 1.3GUNC扩展特性
**①零长度和变量长度数组**
>**概述**：数组长度可以是`0`或者**一个变量**，如下为**零长度数组**的一个技巧
{%list%}
没有给data数组分配内存，所以sizeof(strcut var_data)=sizeof(int)
{%endlist%}
{%right%}
可以通过data[index]访问变量len之后的第index个地址
{%endright%}

```c
struct var_data{
  int len;
  char data[0];
};
```
**②范围case**
>**概述**：`case x...y`表示**区间**`[x,y]`中的值都会满足这个`case`的条件
```c
switch (ch) {
case '0'...'9' : c -= '0';
break;
case 'a'...'z' : c -= 'a';
break;
}
```
**③语句表达式**
>**概述**：将包含在**括号内**的**复合语句**看作是**一个表达式**
```c
//相比#define min(x,y) ((x) < (y) ? (x) : (y))
//以下宏定义不会有副作用
#define min_t(type,x,y) \
({type __x = (x);type __y = (y);__x<__y?__x:__y;})
```
**④`do{}while(0)`语句**
>**概述**：作用类似于**语句表达式**，常常用于**宏定义**中，以防止任何可能的**副作用**
```c
#define SAFE_FREE(p) do{free(p);p = NULL;}while(0)
#define SAFE_FREE(p) {free(p);p = NULL;}
//实例
if(p != NULL)
  SAFE_FREE(p);
else
  ...
//对于do{}while(0)语句，展开如下，代码逻辑不受影响
if(p != NULL)
  do{free(p);p = NULL;}while(0)；
else
  ...
//语句表达式，展开如下，会导致else没有从属的if
if(p != NULL)
  {free(p);p = NULL;}；
else
  ...
```

**⑤`typeof()`**
>**概述**：获得对应变量的**类型**，如下所示，`(void) (&_x == &_y)`的作用是判断两变量**类型是否相同**
```c
#define min(x,y) ({         \
  const typeof(x) _x = (x); \
  const typeof(y) _y = (y); \
  (void) (&_x == &_y);      \
  _x < _y ? _x : _y;        \
})
```
**⑥可变参数宏**
>**概述**：如下所示，`arg`表示**其余的参数**，可以有**零个或多个**参数，用**逗号**隔开
{%list%}
##为了处理零个参数的情况，会丢弃之前的逗号
{%endlist%}
```c
#define pr_debug(fmt,arg...) printk(fmt,##arg)
//以下宏会被扩展为printk("success!\n")而不是printk("success!\n",)
pr_debug("success!\n");
```

**⑦特殊属性声明**
>**概述**：允许为**函数**、**变量**和**类型**声明**特殊属性**，以便**手动优化代码**和**定制代码检查**的方法
{%list%}
在声明后添加__attribute__((ATTRIBUTE))即可，如果存在多个属性则用逗号分隔
{%endlist%}
>如`aligned`指定**变量**和**结构体**的**对齐方式**
{%right%}
合适的边界对齐可以加快CPU的内存访问速度
{%endright%}
```c
struct example_struct{
  char a;
  int b;
  long c;
}__attribute__((aligned(4)));
```

**⑧内建函数**
>**概述**：`GUNC`提供了大量的**内建函数**，除了和**标准C库**对应的部分，其余函数通常以`__builtin`开头
```c
//返回当前函数或者其调用者的返回地址
//LEVEL表明调用栈的级数，如0为当前函数的返回地址，1为其调用者的返回地址
__builtin_return_address(LEVEL)
//判断EXP是否是编译时常数
__builtin_constant_p(EXP)
//为编译器提供分支预警信息
__builtin_expect(EXP,C)
```









### 2.串口通信
#### 2.1UART
**①简介**
>**概述**：`UART`发送端将**并行数据**转换为**串行形式**，给其添加**起始位**、**校验位**和**停止位**，传递给`UART`接受端
{%list%}
UART数据包包含有一个起始位，5到9个数据位，一个可选择的奇偶检验位以及一个或两个停止位
{%endlist%}
{%right%}
UART属于异步双工通信，没有时钟信号，通过起始位和停止位通知接收端开始/停止接收数据
{%endright%}
**②传输原理**
>**概述**：发送端传输数据时，`UART`**数据传输线**由**高电平变为低电平**，同时接收端开始以**波特率**的频率**读取数据**
{%right%}
当UART读取数据帧后，检查其1的总数是奇数还是偶数，是否与奇偶检验位匹配
{%endright%}
{%warning%}
两个UART必须以大约相同的波特率工作，发送的接收UART之间的波特率只能相差约10%
{%endwarning%}
#### 2.2SPI
**①简介**
>**概述**：将设备分为**主机**和**从机**，有`MOSI`信号线、`MISO`信号线、`SCLK`**时钟信号线**和`SS/CS`**片选信号线**
{%list%}
MOSI信号线用于主机向从机输入，MISO用于从机向主机输入
{%endlist%}
{%right%}
SPI属于同步双工通信，每个时钟周期传输一位数据
{%endright%}
**②传输原理**
>**概述**：主机输出**时钟信号**，**拉低从机**的`SS/CS`**片选信号线**激活从机，并通过`MOSI`和`MISO`信号线传递数据
{%list%}
时钟信号由于是主机配置生成的，因此SPI通信始终由主机启动
{%endlist%}
{%right%}
主机可以存在多个CS/SS引脚，从而与多个从机进行通信
{%endright%}
{%warning%}
SPI没有任何形式的错误检查
{%endwarning%}
#### 2.3I2C
**①简介**
>**概述**：可以将**多个主机**连接到从机，也可以将**多个从机**连接到主机，有`SDA`**数据线**和`SCL`**时钟线**
{%list%}
I2C数据包包含从机二进制地址帧、一个/多个数据帧、开始/停止条件，读/写位和数据帧之间的ACK/NACK位
{%endlist%}
{%right%}
I2C属于同步半双工通信，每个时钟周期传输一位数据，因为只有一根数据线所以同一时间只能进行单向通信
{%endright%}
**②传输原理**
>**概述**：`SCL`线为**高电平**时，**主机拉低**`SDA`线即**开始条件**启动总线通信
{%list%}
空闲时SCL线和SDA线都是高电平
{%endlist%}
>主机向总线发送**从机的地址**以及**读写位**，如果**地址匹配**，则**拉低**`SDA`线返回一个`ACK`位，反之则拉高
{%list%}
地址帧通常为7/9位，读写位为一位数据，如果主机是向从机发送数据则为低电平，请求数据则为高电平
{%endlist%}
>主机发送/接受**数据帧**，每次传输**一个数据帧**，**接收方**返回一个`ACK`位，原理同上
{%warning%}
每个数据帧的大小限制为8位
{%endwarning%}
>传输完毕后，主机将`SCL`线**切换为高电平**，然后再将`SDA线`切换为**高电平**，从而向从机发送**停止条件**

