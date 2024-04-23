---
title: Linux内核（三）
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
summary: 锁、信号量
---
# Linux内核
## Linux内核（三）
### 1.同步与竞争
#### 1.1引言
**①临界区**
>**概述**：访问和操作**共享数据**的代码段，如果多个线程可能**同时**处于**同一个临界区**，称为**竞争**
{%list%}
保护共享资源，防止其被并发访问的行为称为同步
{%endlist%}
{%right%}
中断、中断下半部、抢占以及对称多处理都会造成竞争
{%endright%}
>当一个线程处于**临界区**时，若**发生切换**且**切换后的线程**也访问**同一个临界区**，也是一种竞争
{%warning%}
必须保证临界区的代码原子地执行，否则可能出现各个线程之间相互覆盖共享数据的情况
{%endwarning%}
**②锁**
>**概述**：一种机制，使得在**某一个时间点**上，只能有**一个线程**进入临界区代码
{%list%}
锁是采用原子操作实现的，给数据加锁而不是给代码加锁
{%endlist%}
{%warning%}
锁的作用是使进程以串行方式对资源进行访问，所以锁会降低系统的性能
{%endwarning%}
>锁的**颗粒度越粗**，系统**性能降低**越明显，锁的**颗粒度越细**，其造成的**开销越大**
{%right%}
一开始采用粗颗粒的锁，当该锁争用明显时，细化锁的颗粒度
{%endright%}
**③死锁**
>**概述**：当一个或多个线程都在**等待被对方占用的资源**，则他们永远都**不会释放**已经占有的资源并**一直等待**
{%list%}
如一个线程试图获取自己持有的锁，或者A试图获取B占有的锁，同时B也试图获取A的锁
{%endlist%}
{%right%}
使用嵌套的锁时，多个线程应该按照同样的顺序加锁，最好能记录下锁的顺序，供其他进程使用
{%endright%}
{%warning%}
不要重复请求一个锁，锁的设计应该要简单
{%endwarning%}
**④原子操作**
>**概述**：该操作执行的过程中**不会被打断**，Linux提供了两组处理**整数和单独的位**的原子操作
{%list%}
整数原子操作只能对atomic_t/atomic64_t类型的数据进行处理，位原子操作以操作任何数据类型的任何一位
{%endlist%}
>可见`<asm/atomic.h>`和`<asm/bitops.h>`头文件
{%right%}
原子操作通常是内嵌汇编指令的内联函数
{%endright%}
```c
typedef struct{
  volatile int counter;
}atomic_t;
typedef struct{
  volatile long counter;
}atomic64_t;
```
**⑤屏障**
>**概述**：有时会要求程序代码以**指定的顺序**读写内存，而**编译器和处理器**可能会对读写顺序进行**重新排列**
{%list%}
可以通过屏障指令指示编译器不要对给定点周围的指令序列重新排列，屏障前的指令不会排列到屏障后的指令之后
{%endlist%}
>常用屏障有**读屏障**`rmb()`、**写屏障**`wmb()`和**读写屏障**`mb()`

#### 1.2常用锁
**①自旋锁**
>**概述**：只能被**一个线程**持有，当一个线程试图获取一个**已经被持有的锁**，会**一直循环**等待锁直到其被释放
{%list%}
linux内获取自旋锁时会关闭抢占和本地中断，因为切换后的线程可能会试图获取当前线程持有的锁造成死锁
{%endlist%}
>详细代码可见`<asm/spinlock.h>`和`<linux/spinlock.h>`
{%right%}
可调用preempt_disable()关闭抢占，可以递归调用
{%endright%}
{%warning%}
linux实现的自旋锁是不能递归的，不能试图获取被自己持有的自旋锁，且不应该被长时间持有
{%endwarning%}
```c
//静态创建自旋锁
DEFINE_SPINLOCK(my_lock);
unsigned long flags;
//动态创建自旋锁
spin_lock_init(&a_spinlock_t)//a_spinlock_t为spinlock_t结构

//保存当前中断状态并禁止本地中断随后获取锁
spin_lock_irqsave(&my_lock,flags);
/*临界区*/
spin_unlock_irqrestore(&my_lock,flags);//解锁并恢复中断状态
```
```c
preempt_disable()；//增加抢占计数
/*抢占被禁止*/
preempt_enable()；//减小抢占计数
```
**②读写锁**
>**概述**：有时**锁的用途**可以明确地分为**读取和写入**，**写入时**其他进程**不能读写**，**读取时**其他进程**可以读取**
{%list%}
读锁可以被多个读线程持有，写锁只能被一个写线程拥有，写锁会不断自旋等待所有读锁被释放
{%endlist%}
{%warning%}
读写锁中写线程的优先级很低，极端情况下甚至可能出现写进程饿死的情况
{%endwarning%}
```c
//静态创建读写锁
DEFINE_RWLOCK(my_rwlock);
//动态创建读写锁
rwlock_init(&a_spinlock_t)
read_lock(&my_rwlock);
/*读临界区*/
read_unlock(&my_rwlock);

write_lock(&my_rwlock);
/*写临界区*/
write_unlock(&my_rwlock);
```
**③顺序锁**
>**概述**：类似于**读写锁**，主体是一个**序列计数器**，数据被**写入前后**序列值会增加
{%list%}
读线程只有当序列号为偶数时才能获取读锁，保证写入操作已经完成，且读取前后序列值不一致会取消读操作
{%endlist%}
>读加锁**不使用同步机制**，甚至都**不需要禁止内核抢占**，因为读者**只读取锁变量**，写操作使用`spinlock`进行**互斥**
{%right%}
顺序锁中写者的优先级始终高于读者，写者可以任意时刻打断读者
{%endright%}
```c
seqlock_t my_seq_lock = DEFINE_SEQLOCK(my_seq_lock);

write_seqlock(&my_seq_lock);
/*写临界区*/
write_sequnlock(&my_seq_lock);

unsigned long seq;

do{

  seq = read_seqbegin(&my_seq_lock);
  /*读临界区*/
}while(read_seqretry(&my_seq_lock,seq));

```
#### 1.3信号量
**①信号量**
>**概述**：当一个线程试图获取一个**不可用的信号量**时，会进入**等待队列**睡眠，可以允许**任意数量的持有者**
{%list%}
对应信号量被释放时，对应任务会被唤醒并获取该信号量
{%endlist%}
>信号量的实现与**具体结构**相关，详细可见`<asm/semaphore.h>`中
{%right%}
相比于自旋锁，信号量可以更好地处理器利用率，但是开销更大
{%endright%}
{%warning%}
只有在进程上下文中才能使用，因为中断上下文不允许调度，且占用信号量的同时不能同时占用自旋锁
{%endwarning%}
```c
//静态创建
struct semaphore name;
same_init(&name,count);
//动态创建
sema_init(sem,count);
down()//对信号量计数减一，如果大于等于0，则进入临界区，反之则放入等待队列
up()//用于释放信号量，增加信号量的计数值唤醒等待队列的任务并获得信号量
```
**②读写信号量**
>**概述**：类似于**读写锁**，没有写者时**获取读信号量**的**读者数不限**，没有读者时只有**一个写者**可以获得**写信号量**
{%list%}
与读写锁不同，写信号量可以转换为读信号量
{%endlist%}
```c
//静态定义读写信号量
DECLEAR_RWSEM(my_rwsem);
//动态定义读写信号量
init_rwsem(&sem);//rw_semaphore结构指针

down_read(&my_rwsem);
/*只读临界区*/
up_read(&my_rwsem);

down_write(&my_rwsem);
/*读写临界区*/
up_write(&my_rwsem);
```
**③互斥体**
>**概述**：类似**计数为1的信号量**，但操作接口更**简单**，实现更**高效**，**限制更强**
{%list%}
持有一个互斥体时进程不能退出，不能在中断或者下半部使用，只能通过官方API管理
{%endlist%}
{%right%}
通过特殊的调式模式检查互斥体的限制，打开内核配置选项CONFIG_DEBUG_MUTEXES即可
{%endright%}
{%warning%}
只有一个任务可以持有互斥量，不能在一个上下文中给互斥量上锁，在另一个上下文解锁
{%endwarning%}

```c
//静态初始化互斥体
DEFINE_MUTEX(name);
//动态初始化互斥体
mutex_init(&mutex);
//获取互斥体
mutex_lock(&mutex);
//释放互斥体
mutex_unlock(&mutex);


```
**④完成变量**
>概述：当一个任务需要通知另一个任务**发生了某个特定事件**时，使用完成变量
{%list%}
完成变量用completion结构表示
{%endlist%}
>定义在`<linux/completion.h>`中
```c
//静态创建完成变量
DECLEAR_COMPLETION(my_comp);
//动态创建完成变量
init_completion(&my_comp)
//需要等待的任务
wait_for_completion();
//产生事件的任务
complete();
```
### 2.定时任务
#### 2.1引言
**①基本概念**
>**系统定时器**：一种可编程芯片，以**固定频率**产生中断，中断处理程序负责**更新系统时间**并**周期性地处理事务**

>**实时时钟**：持久存放**系统时间**的设备，系统启动时，读取`RTC`初始化**墙上时间**

>**墙上时间**：记录**系统运行**时间，记录在`xtime`中，为一`timespec`结构变量
{%list%}
xtime.tv_sec记录自1970年1月1日以来经过的秒数，xtime.tv_nsec记录自上一秒开始经历的ns数量
{%endlist%}
```c
struct timespec{
  _kernel_time_t tv_sec;
  long tv_nsec;
}
```
**②节拍率**
>**概述**：**系统定时器**产生中断的频率，两次中断的**间隔时间**称为**节拍**，
{%list%}
节拍率是静态预定义的，体系结构不同，节拍率不同
{%endlist%}
>定义在`<asm/param.h>`中，可以调节
{%right%}
节拍率越高，进程抢占等依赖于时钟中断的任务准确度越高，但是会加重系统负担，通常是1000HZ
{%endright%}
>Linux提供`CONFIG_HZ`配置选项，可**动态调节**节拍率
{%warning%}
内核空间的节拍率为HZ，而用户空间的节拍率为USER_HZ，两者可能是不相等的
{%endwarning%}
>可以使用`jiffies_to_clock_t()`将一个`HZ`表示的**节拍数**转化为`USER_HZ`表示的**节拍数**

**③`jiffies`**
>**概述**：记录**系统启动**以来**节拍总数**的**全局变量**，为一`volatile`修饰的**无符号长整型**
{%list%}
volatile提示编译器每次访问该变量都从主内存中获得，而不是通过寄存器中的别名来访问
{%endlist%}
>因为每次**时钟中断**都会增加该变量的值，而C编译器通常**只将变量装载一次**
{%right%}
为了防止jiffies在32位系统上溢出，通常还会设置jiffies_64变量，jiffies取其32低位
{%endright%}
#### 2.2定时器
**①定义**
>**概述**：用于在**指定的时间点**完成某个工作，由结构`timer_list`表示，定义在`<linux/timer.h>`中
{%list%}
定时器处理函数格式必须符合该结构成员
{%endlist%}
{%warning%}
内核可能会在超时后马上运行，也可能推迟到下一次时钟节拍，所以不能使用定时器实现硬实时任务
{%endwarning%}
```c
struct timer_list{
  struct list_head entry;          //定时器链表的入口
  unsigned long expires;           //以jiffies为单位的定时值，当jiffies大于等于该成员，执行处理函数
  void (*function)(unsigned long); //定时器处理函数
  unsigned long data;              //传给处理函数的数据
  struct tvec_t_base_s *base;      //定时器内部值
}
```
**②使用**
>**概述**：先**创建并初始化**`timer_list`结构变量，随后**填充并激活**对应定时器即可
{%list%}
填充定时器只需要填充推迟时间、处理函数和处理函数数据即可
{%endlist%}
{%warning%}
可能在删除定时器过程中，定时器已经在其他处理器上面运行了，从而并发访问该定时器结构
{%endwarning%}
>所以通常调用`del_timer_sync(&my_timer)`，该函数会等待**其他处理器上正在运行的定时器处理程序**都退出
{%right%}
时钟中断处理程序的下半部会调用函数挂起TIMER_SOFTIRQ软件中断，从而处理所有的超时定时器
{%endright%}

```c
//创建定时器
struct timer_list my_timer;

//初始化定时器
init_timer(&my_timer);

//填充定时器结构
my_timer.expires = jiffies+delay;
my_timer.data = 0;
my_timer.function = my_function;

//激活定时器
add_timer(&my_timer);
//更改并激活定时器
mod_timer(&my_timer,new_delay_time);
//删除定时器
del_timer(&my_timer);
```
#### 2.3延迟执行
**①忙等待**
>**概述**：比较当前`jiffies`和**指定时间**，当没有到指定时间就**一直循环**，在循环中调用`cond_resched()`
{%list%}
只要设置了need_resched标志，cond_resched()就会调度一个新的程序投入运行
{%endlist%}
{%right%}
Linux定义了四个宏用于比较节拍计数以很好地处理回绕情况
{%endright%}
>定义在`<linux/jiffies.h>`中
```c
unsigned long delay = jiffies + 5*HZ;
while(time_before(jiffies,delay)){
  cond_resched();
}
```
```c
//当前jiffies是否小于、大于、小于等于、大于等于指定数值
time_before(jiffies,delay)
time_after(jiffies,delay)
time_before_eq(jiffies,delay)
time_after_eq(jiffies,delay)
```
**②延迟函数**
>**概述**：Linux提供了处理`ms`、`ns`和`us`级别的**延迟函数**，定义在`<linux/delay.h>`和`<asm/delay.h>`中
{%list%}
这些函数不是通过jiffies实现的，而是依靠处理器不断做循环
{%endlist%}
{%right%}
内核知道处理器一秒内能执行多少次循环，根据延迟时间执行对应次数循环即可
{%endright%}
{%warning%}
应当只在小延迟中调用，因为会一直占用处理器
{%endwarning%}
```c
void udelay(unsigned long usecs);
void ndelay(unsigned long nsecs);
void mdelay(unsigned long msecs);
```
**③`schedule_timeout()`**
>**概述**：让延迟执行的任务**睡眠**指定时间，到达指定时间后**唤醒任务**并将其放回**运行队列**
{%list%}
本质上还是基于定时器完成的
{%endlist%}
{%warning%}
掉永该函数的代码必须处于进程上下文中，并且不能持有锁
{%endwarning%}
```c
//将任务设置为可中断睡眠状态
set_current_state(TASK_INTERRUPTIBLE);
//s秒后唤醒
schedule_timeout(s*HZ)
```














