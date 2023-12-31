---
title: linux内核设计与实现（二）
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
categories: Linux内核
keywords: 文章关键词
updated: ''
date:
img: /medias/featureimages/3.webp
summary: 进程管理和进程调度
---
# Linux内核设计与实现（二）
## 进程管理

### 1.进程和线程
**1.1进程**：**正在执行**的程序的**实时结果**
①进程不仅仅是一段可执行程序代码，还包含其他资源，如打开的文件、挂起的信号、内核内部数据、处理器状态、一个或多个具有内存映射的内存地址空间、执行线程和存放全局变量的数据段等
②进程和程序不是一对一关系，可能多个进程执行的是一个程序
**1.2线程**：在**进程中活动的对象**，每个线程都拥有独立的程序计数器、进程栈和一组进程寄存器
①**内核调度的对象**是线程，不是进程
②在Linux中，线程被看作是**特殊的进程**
③线程可以**共享虚拟内存**，但是有其**各自的虚拟处理器**
**1.3内核线程**：独立运行在**内核空间**的标准进程，但是没有独立的地址空间，只能**由内核线程创建**
**1.4进程上下文**：

### 2.进程描述符（task_struct）
**2.1定义**：内核将进程的列表存放在名为**任务队列**的**双向循环链表**中，链表的每一项就是进程描述符，包含了**内核管理一个进程的所有信息**，类型为`task_struct`，定义在<linxu/sched.h>中
**2.2分配**
①通过**slab分配器**分配进程描述符，能达到**对象复用**和**缓存着色**的目的
②slab分配器分配进程描述符后，在**进程内核栈的尾端**创建`thread_info`结构，其中`task`域存放指向**其进程描述符的指针**
**2.3访问**：内核通过访问进程描述符处理进程
①thread_info结构：采用**硬件体系结构对应的current宏**访问thread_info结构访问其task域
②特殊寄存器：有的硬件体系结构拿出**一个专门寄存器**存放指向当前进程task_struct的指针
**2.4PID**：每个进程的标志，PID号的最大值表示系统中允许同时存在的进程的最大数目
**2.5进程状态**：进程描述符中的**state域**描述了进程当前状态
①TASK_RUNNING（运行）：正在执行或者在运行队列中等待执行
②TASK_INTERRUPTIBLE（可中断）：进程被**阻塞（睡眠）**，**等待某些条件的达成**状态便改为运行，可能**被某些信号提前唤醒**
③TASK_UNINTERRUPTIBLE（不可中断）：进程在等待时必须不受干扰，或者等待的事件很快就会发生，**不对信号做出响应**
④_TASK_TRACED（被跟踪）：被一些进程监视
⑤_TASK_STOPPED（停止）：**没有投入运行也不能投入运行**，进程退出运行，在接收到某些信号或者在调试时接收到任何信号便会变为这种状态
#进程状态可以通过某些函数调整，如`set_task_state()`函数
**2.6父子进程**：每个进程描述符中都包含一个`parent`指针指向其父进程，也有一个名为`children`的子进程列表
#所有进程都是`init`进程的子进程

### 3.进程的创建
**3.1Unix进程创建概述**：`fork()`**拷贝当前进程**创建一个子进程，该子进程和父进程区别仅仅在于PID和PPID（父进程号）和某些资源，`exec()`读取**进程对应可执行文件**将其载入地址空间运行
#Linux的`fork()`系统调用采用的是**写时拷贝**，不复制整个父进程的进程地址空间（**父进程占用的内存页**），而是和父进程**共享**，只有当**需要写入时**才创建自己的内存页,**在不写入的情况下，`fork()`函数只是复制了父进程的页表项和给子进程创建唯一的PID**
**3.2fork()**
①过程概述：`fork()`→`clone()`系统调用→`do_fork()`→调用`copy_process()`
②copy_process过程
- 为新进程创建一个内核栈、`thread_info`结构和`task_struct`结构，和父进程相同
- 检查是否超出了资源的限制
- 子进程`task_struct`的一些信息被清零或初始化，以便和父进程相区分，并将状态设置为“不可中断”，防止其投入运行
- 更新子进程`task_struct`中的`flag`标志，去掉子进程的**超级用户权限**，设置其“没有调用过`exec()`”对应的标志，并分配一个PID
- 根据`fork()`传递给`clone()`的标志判断其是否能**共享公共资源**，如果不能，则拷贝一份
- 扫尾工作，并返回一个指向子进程的指针，返回成功则**先将子进程投入运行**，因为子进程会运行`exec()`进行写时拷贝，防止父进程运行后写入改变地址空间
#如果创建的是线程的话，每个线程都有**各自的进程描述符**，描述**地址空间**、**文件资源系统**等**共享资源**，**线程本身**再去描述其**独占**的资源，需要传递参数标志给clone()指明需要共享的资源（查阅相关表格）
#
③vfork():除了不拷贝父进程的页表项外，其余和`fork()`功能一致，可以通过向`clone()`传递特殊标志实现`vfork()`

### 4.进程的终结
**4.1终结的产生**：进程调用exit()系统调用
①主动调用
②程序主函数返回：C语言会在函数的返回点后调用
③接收到不能处理与忽略的信号和异常
**4.2exit()**
①概述：调用exit（）后，只与该进程相关的所有资源全部被释放，成为僵死进程，只剩下内存栈、thread_info结构和task_struct结构，等待父进程调用wait（）将其释放，父进程退出后，需要给子进程在当前线程组或者找一个线程或者init作为父进程
②详细过程：LKD P31页
父进程退出后，需要给子进程在当前线程组或者找一个线程或者init作为父进程

### 5.进程调度