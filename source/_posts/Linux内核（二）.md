---
title: Linux内核（二）
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
  - Linux内核
categories: Linux
keywords: 文章关键词
updated: ''
img: /medias/featureimages/29.webp
date:
summary: 陷入内核
---
# Linux内核
## Linux内核（二）
### 1.系统调用
#### 1.1引言
**①定义**
>**概述**：用户进程**和内核交互**的接口，从而让用户进程**受限地访问硬件设备**、申请**操作系统资源**等
{%right%}
系统调用提供了硬件的抽象接口，保证了系统的稳定和安全
{%endright%}
**②`API`**
>**概述**：也称为**应用编程接口**，应用程序通过调用`API`**间接**调用系统调用而不是**直接**调用系统调用
{%list%}
API可能会调用系统调用，也可能不会调用系统调用，UNIX系统中的API通常是给予POSIX标准实现的
{%endlist%}
{%right%}
API在不同的操作系统上形式相同，但是实现可能迥异
{%endright%}
**③系统调用号**
>**概述**：每个系统调用都有**对应的系统调用号**，进程使用该系统调用号关联对应系统调用
{%list%}
每个体系结构都定义了sys_call_table数组，在系统调用号对应位置存放已经注册的系统调用
{%endlist%}
{%warning%}
系统调用号一旦分配就不能变更，系统调用被删除后，对应的系统调用号也不能被回收利用
{%endwarning%}
{%right%}
需要使用sys_ni_syscall()补充空位，除了返回-ENOSYS之外不做其他工作，提示该系统调用被删除
{%endright%}
**④直接调用**
>**概述**：Linux系统提供**一组宏**直接使用**系统调用**，即`_syscalln()`
{%list%}
n的范围从0到6，表示需要传递给系统调用的参数个数
{%endlist%}
{%warning%}
此外还需要按照格式定义对应宏传递系统调用号
{%endwarning%}
```c
//原系统调用
long open(const char *filename,int flags,int mode)
//使用宏调用系统调用
#define _NR_open 5
_syscall3(long,open,const *char,filename,int,flags,int,mode)
```
#### 1.2工作流程
**①引言**
>**概述**：以`getpid()`为例，其在内核中实现为`SYSCALL_DEFINE0(getpid)`
{%list%}
其本质上是一个定义无参数系统调用的宏，会展开为asmlinkage long sys_getpid(void)
{%endlist%}
{%right%}
为了保证32/64位系统的兼容，系统调用在用户空间和内核空间返回值类型不同，在用户空间/内核空间为int/long
{%endright%}
{%warning%}
asmlinkage通知编译器仅从栈中提取函数的参数，所有系统调用都需要这个限定词{%endwarning%}
**②执行**
>**概述**：通过**软中断**执行，软中断引发**异常**使得系统切换到**内核态**执行**异常处理程序**，即**系统调用处理程序**
{%list%}
X86架构软中断指令为int $0x86，对应中断处理程序为system_call()，随后根据系统调用号执行对应代码
{%endlist%}
{%right%}
系统通过寄存器传递数据，如系统调用号、参数和返回值，X86架构通过exa寄存器传递系统调用号
{%endright%}
**③添加系统调用**
>**准备工作**：确定系统调用的**用途**、**参数**、**返回值**和**错误码**，并确保其**稳定**、**通用**、**可移植**

>**参数检查**：检查参数的**有效性**和**安全性**，不能随便访问**内核数据**、**其他进程数据**、以及绕过**内存访问限制**

>**权能检查**：是否有**对应的权能**，如`reboot()`系统调用只有拥有`CAP_SYS_REBOOT`权能的进程**才能调用**

>**注册系统调用**：在**系统调用表**添加对应表项，添加**系统调用号**
{%list%}
通常情况下，系统调用表和系统调用号分别定义于体系结构文件夹下的entry.s和unistd.h文件夹中
{%endlist%}
{%warning%}
系统调用代码不能被编译为模块，通常放在kernel/sys.c文件中
{%endwarning%}

### 2.中断
#### 2.1引言
**①定义**
>**中断**：本质上是一个**电信号**，硬件在**需要的时候**向**处理器**发送中断信号

>**异常**：当处理器遇到**必须依靠内核处理**的错误，如**缺页**时就会产生**异常信号**
{%list%}
处理器速度通常远快于外围硬件设备速度，所以采用中断机制，而不是让处理器轮询硬件
{%endlist%}
{%warning%}
中断并不考虑与处理器的时钟同步
{%endwarning%}
{%right%}
内核对异常的处理和中断类似，但是异常在产生时必须考虑与处理器时钟同步，也称为同步中断
{%endright%}

**②流程**
>**概述**：设备产生中断并将**中断信号**传递给**中断处理器**，如果对应**中断线是激活**的，再传递给**处理器**
{%list%}
处理器停止正在进行的操作，并跳转到中断线对应内存特定位置执行代码，也称为初始入口点
{%endlist%}
>初始入口点保存**中断线编号**`IRQ`和**当前寄存器的值**到栈中

>随后调用`do_IRQ()`对中断进行**应答**，并**禁止当前线**的中断传递，随后调用`handle_IRQ_event()`
{%right%}
C语言函数从栈的顶端提取函数参数，所以do_IRQ()可以提取irq号和寄存器的值
{%endright%}
>`handle_IRQ_event()`先打开中断，随后运行**对应中断处理程序**，最后**关闭中断**并返回到`do_IRQ()`

>`do_IRQ()`做**清理工作**并返回到**初始入口点**，并跳转到`ret_from_intr()`函数

>`ret_from_intr()`判断是否需要发生**内核抢占/用户抢占**，如果是则调用`schedule()`，否则返回**曾经中断的点**

**③中断控制**
>**概述**：可以调用**对应函数**禁止**当前处理器的所有中断**或者**指定中断线的中断**
{%list%}
若开启中断时中断已被开启有潜在危险，所以采用所以在禁止中断前记录中断状态，准备激活中断时恢复中断状态
{%endlist%}
{%warning%}
禁止多个中断处理程序共享的中断线是不合适的
{%endwarning%}
#### 2.2中断处理程序
**①中断上下文**
>**概述**：当执行一个**中断处理程序**时，内核处于**中断上下文**中，也称为**原子上下文**，因为在执行过程中**不可阻塞**
{%list%}
中断随时都可能发生，且会打断其他代码的执行，所以中断处理程序需要快速执行
{%endlist%}
{%warning%}
中断处理程序不能睡眠，因为其没有后续进程
{%endwarning%}
**②注册和卸载**
>**注册**：调用`request_irq()`注册一个**中断处理程序**，分配一个`IRQ`线并建立对应**中断处理函数**的映射

>**卸载**：调用`free_irq()`注销**中断处理程序**，释放`IRQ`线并取消对应**中断处理函数**的映射
{%list%}
注册中断处理程序时需要设置对应的标志，常用标志如下
{%endlist%}
{%warning%}
request_irq()可能会睡眠，所以不能在中断上下文和其他不允许阻塞的代码中调用该函数
{%endwarning%}
>`IRQ_DISABLED`：意味着内核在处理该中断程序期间**禁止所有其他中断**，通常用于快速执行的**轻量级中断**

>`IRQF_SAMPLE_RANDOM`：将来自该中断的**间隔时间**填充到**熵池**

>`IRQF_SHARED`：表明多个中断处理程序之间**共享中断线**

**③程序设计**
>**格式**：`static irqreturn_t [函数名](int iqr,void *dev,...)`
{%list%}
函数参数分别为中断线号、设备结构和其他参数，其中每个设备的设备结构是唯一的，可以用作区分中断源
{%endlist%}
>中断处理程序的栈称为**中断栈**，大小为**一页**，原先与**被中断的进程**共用其**内核栈**，内核栈大小通常为**两页**

>接收一个中断后，将**依次调用**该中断线上注册的**每一个处理程序**

>返回类型为`irqreturn_t`，当**中断源不符**时返回`IQR_NONE`，符合返回`IRQ_HANDLED`
{%warning%}
中断会打断其他代码并屏蔽对应中断线，且在中断过程中不能阻塞，所以需要快速执行，只完成必要工作
{%endwarning%}
>中断处理程序通常完成**时间要求高**、**硬件相关**且要求**不能被打断**的工作，如告知**中断已经收到**，**拷贝硬件数据**等
{%right%}
其他可以推迟执行的工作放在所谓的中断下半部中
{%endright%}
### 3.中断下半部
#### 3.1软件中断
**①引言**
>**概述**：一组**静态定义**的接口，由`softirq_action`结构表示，定义在`<linux/interrupt.h>`中
{%list%}
在kernel/softirq.c中定义了数组，每项代表一个被注册的软件中断最多可有32个，每个软件中断都需要静态注册
{%endlist%}
{%right%}
软件中断可以同时在所有处理器上同时执行，即使其类型完全相同
{%endright%}
{%warning%}
只有中断处理程序才能抢占软件中断
{%endwarning%}
```c
struct softirq_action{
  //只包含一个处理软件中断的函数指针
  void (*action)(struct softirq_action *);
}
```
```c
static struct softirq_action softirq_vec[NR_SOFTIRQS]；
```
**②注册**
>**概述**：在`<linux/interrupt.h>`定义的**枚举类型**中添加软件中断声明，调用`open_softirq()`注册**软件中断**
{%list%}
open_softirq()主要是建立软件中断索引和对应处理程序的映射
{%endlist%}
{%right%}
枚举类型从0开始，索引越小优先级越高，每个软件中断都对应一个索引项
{%endright%}
{%warning%}
软件中断处理程序需要按照对应的格式书写
{%endwarning%}
```c
void softirq_handler(struct softirq_action *my_softirq)
```
**③执行**
>**概述**：当**硬件中断返回**时，会自动调用`do_softirq()`遍历`softirq_vec`，执行**待处理的软件中断**
{%list%}
一个软件中断必须被挂起才会被执行，中断处理程序会在返回前调用raise_softirq()挂起对应软件中断
{%endlist%}
>挂起前需要先**禁止中断**，挂起后再**恢复中断状态**
{%right%}
使用32位变量pending保存软件中断的位图，如果从右向左第n位为1，则表明第n个中断处理程序待处理
{%endright%}
{%warning%}
由于一个软件中断可以在多个处理器上同时被触发，所以需要对共享数据进行保护，但是加锁又会限制性能
{%endwarning%}
>Linux会采用**单处理器数据**，即**仅仅属于某个处理器**的数据避免**显式地加锁**

**④`ksoftiqrd`**
>**概述**：**每个cpu**都会有一个`ksoftirqd/n`线程，其中`n`为**处理器的编号**，会不断调用`do_softirq()`
{%list%}
只要do_softirq()发现已经执行过的软件中断重新触发了自己，该内核线程就会被唤醒，在最低的优先级上面运行
{%endlist%}
{%warning%}
当出现大量软中断时，导致用户空间进程无法获得足够的处理器时间
{%endwarning%}
>一些软件中断**出现频率高**且能**重新触发自己**，如**网络子系统**
#### 3.2tasklet
**①引言**
>**概述**：本质是索引为`HI_SOFTIRQ`和`TASKLET_SOFTIRQ`的软件中断，由`tasklet_struct`结构表示
{%list%}
tasklet的状态可为0，TASKLET_STATE_SCHED（被调度）和TASKLET_STATE_RUN（被执行）
{%endlist%}
>`count`为`0`时，`tasklet`才被激活，并且需要挂起才能运行
{%right%}
已经调度的tasklet存放在两个单处理器数据结构tasklet_vec和tasklet_hi_vec中，为tasklet_struct结构链表
{%endright%}
{%warning%}
两个不同类型的tasklet可以在不同的处理器上同时执行，但类型相同的tasklet不能
{%endwarning%}
```c
struct tasklet_struct{
  struct tasklet_struct *next;  //下一个tasklet
  unsigned long state;          //状态
  atomic_t count;               //引用计数
  void (*func)(unsigned long);  //处理函数
  unsigned long data;           //处理函数的参数
}
```
**②创建**
>**概述**：编写对应的**处理函数**，并调用以下**宏/函数**创建对应的`tasklet_struct`结构
{%list%}
处理函数的格式需要为void tasklet_handler(unsigned long data)
{%endlist%}
{%warning%}
tasklet本质上还是软件中断，所以处理函数不能睡眠，即使用信号量或者其他会阻塞的函数
{%endwarning%}
```c
//静态创建
DECLARE_TASKLET(name,func,data);
DECLARE_TASKLET_DISABLED(name,func,data);//会将count设置为非0
//动态创建
tasklet_init(t,tasklet_handler,dev);
```
**③调度**
>**概述**：调用`tasklet_schedule()/tasklet_hi_schedule()`调度`HI_SOFTIRQ`和`TASKLET_SOFTIRQ`类型
{%list%}
将需要调度的tasklet放到对应链表中，并唤起HI_SOFTIRQ和TASKLET_SOFTIRQ类型的软件中断
{%endlist%}
{%warning%}
在调度tasklet期间，需要禁止中断
{%endwarning%}
**④执行**
>**概述**：`HI_SOFTIRQ`和`TASKLET_SOFTIRQ`类的处理函数分别为`tasklet_action()`和`tasklet_hig_action()`
{%list%}
读取对应tasklet链表，遍历链表并处理count为0且状态为TASKLET_STATE_SCHED的tasklet
{%endlist%}
>**开始处理之前**需要将状态修改为`TASKLET_STATE_RUN`，表示该`tasklet`已经被执行
{%right%}
跳过状态为TASKLET_STATE_RUN的tasklet，以防止相同类型的tasklet同时执行
{%endright%}
{%warning%}
在执行tasklet期间，需要禁止中断
{%endwarning%}
#### 3.3工作队列
**①引言**
>**概述**：将工作交给**工作者线程**执行，**缺省**的工作者线程叫做`events/n`，其中`n`为**处理器的编号**
{%list%}
由于交给内核线程执行，所以运行在进程上下文中，允许重新调度甚至是睡眠
{%endlist%}
>当需要获取**大量内存**、**信号量**、执行**阻塞式I/O操作**时，使用工作队列
{%right%}
驱动等子系统可以创建自己的工作者线程
{%endright%}
**②架构**
>**概述**：**每种**工作者线程由结构`workqueue_struct`表示，**每个**工作者线程由结构`cpu_workqueue_struct`表示
{%list%}
对于指定类型的工作者线程，每个CPU都只有一个，缺省情况下有event类型
{%endlist%}
{%right%}
每个工作者线程都包含一个任务列表，每个任务由work_struct表示
{%endright%}
```c
struct workqueue_struct{
  struct cpu_workqueue_struct cpu_wq[NR_CPUS];
  struct list_head_list;
  const char *name;
  int sinqlethread;
  int freezeable;
  int rt;
} 
```
```c
struct cpu_workqueue_struct{
  spinlock_t lock;
  struct list_head worklist;
  wait_queue_head_t more_work;
  struct work_struct *current_struct;
  struct workqueue_struct *wq;
  task_t *thread;
}
```
```c
struct work_struct{
  atomic_long_t data;
  struct list_head entry;
  work_func_t func;
}
```
**③创建**
>**概述**：调用`create_workqueue()`创建新的**工作者线程**，调用`DECLEAR_WORK()`或者`INIT_WORK()`创建**工作**
{%list%}
创建工作的主要内容是编写对应处理函数
{%endlist%}
{%right%}
create_workqueue()会给每个cpu都创建一个对应的工作者线程
{%endright%}
{%warning%}
使用缺省的工作者线程和自己创建的工作者线程的接口是不一样的
{%endwarning%}
**④流程**
>**概述**：工作者线程**创建后**会开始**休眠**，当**有任务被插入**到工作队列时被**唤醒**，主要调用`worker_thread()`函数
{%list%}
该函数将线程设置为睡眠并置于等待队列，如果工作队列为空，则调用schedule()，反之遍历工作队列处理工作
{%endlist%}
{%warning%}
工作队列的工作会在工作者线程下一次被唤醒的时候执行，如果希望快速完成，可以调用对应函数刷新工作队列
{%endwarning%}
















