---
title: xv6源码阅读（一）
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
  - xv6操作系统
  - MIT6.1810
categories: 项目实战
keywords: 文章关键词
updated: ''
img: /medias/featureimages/8.webp
date:
summary: xv6的启动
---
# MIT6.1810
## xv6源码阅读（一）
### 1.xv6的启动
#### 1.1启动
**①引言**
>**概述**：当计算机上电时，**引导加载器**将xv6内核代码装载到内存`0x8000000`处，并**跳转到该位置**执行
{%list%}
此时处理器处于机器模式，分页也是禁用的，所以虚拟内存地址直接映射到物理内存地址
{%endlist%}
>内存的`0x000000-0x8000000`为**I/O设备**
{%right%}
内核链接文件kernel.ld文件定义了程序入口以及各个段
{%endright%}
>如果想要使用**QEMU**，那么**第一个指令地址**必须是`0x8000000`，所以将**内核**装载到该位置
```
OUTPUT_ARCH( "riscv" )
ENTRY( _entry )

SECTIONS
{
  /*
   * ensure that entry.S / _entry is at 0x80000000,
   * where qemu's -kernel jumps.
   */
  . = 0x80000000;

  .text : {
    *(.text .text.*)
    . = ALIGN(0x1000);
    _trampoline = .;
    *(trampsec)
    . = ALIGN(0x1000);
    ASSERT(. - _trampoline == 0x1000, "error: trampoline larger than one page");
    PROVIDE(etext = .);
  }

  .rodata : {
    . = ALIGN(16);
    *(.srodata .srodata.*) /* do not need to distinguish this from .rodata */
    . = ALIGN(16);
    *(.rodata .rodata.*)
  }

  .data : {
    . = ALIGN(16);
    *(.sdata .sdata.*) /* do not need to distinguish this from .data */
    . = ALIGN(16);
    *(.data .data.*)
  }

  .bss : {
    . = ALIGN(16);
    *(.sbss .sbss.*) /* do not need to distinguish this from .bss */
    . = ALIGN(16);
    *(.bss .bss.*)
  }

  PROVIDE(end = .);
}
```
**②`entry.s`**
>**概述**：为**每个CPU**设置了对应的**栈寄存器**`sp`，并跳转到`start.c`执行
{%list%}
kernel.ld将entry.s装载到0x80000000处，所以每个CPU执行的第一段代码就是该文件
{%endlist%}
{%right%}
N号CPU的栈起始位置为stack0+N*4k，stack0预先定义在start.c中，每个CPU栈的大小为4k
{%endright%}
{%warning%}
j spin表示当start返回，会陷入死循环
{%endwarning%}
```nasm
#定义代码段，.text为代码段的标识
.section .text
#定义了全局符号_entry，从而可以被其他文件访问和使用
.global _entry
_entry:
        la sp, stack0
        li a0, 1024*4
        #mhartid寄存器包含了当前CPU的ID
        csrr a1, mhartid
        addi a1, a1, 1
        mul a0, a0, a1
        add sp, sp, a0
        # jump to start() in start.c
        call start
spin:
        j spin
```
**③`start.c`**
>**概述**：将**处理器的特权级**修改为`supervisor mode`，开启**时钟中断**，最后跳转到`main.c`
{%list%}
还有一些其他辅助操作，如暂时禁用分页，将物理内存、中断、异常等权限都交给超级模式
{%endlist%}
{%right%}
通过读写特定寄存器设置处理器的状态
{%endright%}
```c
#include "types.h"
#include "param.h"
#include "memlayout.h"
#include "riscv.h"
#include "defs.h"

void main();
void timerinit();

// 每个CPU都有自己的栈，所有CPU的栈本质上就是一个巨大的字符数组的一部分
// __attribute__ ((aligned (16)))要求stack0按照16字节对齐
__attribute__ ((aligned (16))) char stack0[4096 * NCPU];

// a scratch area per CPU for machine-mode timer interrupts.
// 每个CPU用于存放临时数据的地方
uint64 timer_scratch[NCPU][5];

// assembly code in kernelvec.S for machine-mode timer interrupt.
extern void timervec();

// entry.S jumps here in machine mode on stack0.
void
start()
{
  // 读取并设置当前状态寄存器的值
  // 从机器模式转化为超级模式
  unsigned long x = r_mstatus();
  x &= ~MSTATUS_MPP_MASK;
  x |= MSTATUS_MPP_S;
  w_mstatus(x);

  //将main函数地址压入pc寄存器，返回时就跳转到main中
  w_mepc((uint64)main);

  // 关闭分页机制，虚拟地址就是物理地址
  w_satp(0);

  // 设置中断和异常委托，将其处理权限交给超级用户模式
  w_medeleg(0xffff);
  w_mideleg(0xffff);
  w_sie(r_sie() | SIE_SEIE | SIE_STIE | SIE_SSIE);

  // 将所有物理地址的访问权限都交给超级模式
  w_pmpaddr0(0x3fffffffffffffull);
  w_pmpcfg0(0xf);

  // 初始化时钟中断
  timerinit();

  // keep each CPU's hartid in its tp register, for cpuid().
  int id = r_mhartid();
  w_tp(id);

  //volatile防止编译器优化或者重新排列汇编代码
  //即使只有在完成上述操作再进行跳转
  asm volatile("mret");
}
```
#### 1.2时钟中断
**①引言**
>**概述**：设置了**时钟中断的间隔**`interval`，开启了**机器模式**下的中断，并设置了**处理函数**`timervec`
{%list%}
时钟中断被委托给机器模式，所以时钟中断发生时，处理器从超级用户模式进入机器模式
{%endlist%}
{%right%}
start.c中为每个CPU设置了对应的时钟中断的暂存区timer_scratch，并将其地址保存在mscratch寄存器中
{%endright%}
```c
// arrange to receive timer interrupts.
// they will arrive in machine mode at
// at timervec in kernelvec.S,
// which turns them into software interrupts for
// devintr() in trap.c.
void
timerinit()
{
  // 获取当前处理器ID，从而为每个处理器分配独立的定时器中断源
  int id = r_mhartid();

  // 设置定时器的间隔时间，以及下次时钟中断的时间
  // CLINT_MTIME获取保存当前时间寄存器的地址
  // CLINT_MTIMECMP保存了时钟中断发生时间寄存器的地址
  int interval = 1000000; // cycles; about 1/10th second in qemu.
  *(uint64*)CLINT_MTIMECMP(id) = *(uint64*)CLINT_MTIME + interval;
  
  // 在当前CPU的时钟中断暂存区中存入下一次时钟中断时间和间隔时间
  // 将暂存区地址存入mscratch寄存器中
  uint64 *scratch = &timer_scratch[id][0];
  scratch[3] = CLINT_MTIMECMP(id);
  scratch[4] = interval;
  w_mscratch((uint64)scratch);

  // 设置机器模式的中断处理向量表地址为timervec
  w_mtvec((uint64)timervec);

  // 开启机器模式的中断
  w_mstatus(r_mstatus() | MSTATUS_MIE);

  // 开启机器模式的定时器中断
  w_mie(r_mie() | MIE_MTIE);
}
```
**②中断处理函数**
>**概述**：通过和`timer_scratch`交互，设置了**下一次时钟中断的时间**并触发了对应的**软件中断**
{%list%}
sip寄存器用于控制当前的中断状态，如下修改sip寄存器会触发对应的软件中断，也就是时钟中断后半部
{%endlist%}
{%right%}
时钟中断暂存区的前三个位置是用于保存寄存器a1、a2和a3的值，用于后续恢复对应寄存器
{%endright%}
```nasm
.globl timervec
.align 4
timervec:
        # start.c has set up the memory that mscratch points to:
        # scratch[0,8,16] : register save area.
        # scratch[24] : address of CLINT's MTIMECMP register.
        # scratch[32] : desired interval between interrupts.
        # 时钟中断暂存区的前三个位置是用于保存寄存器的，用于后续恢复寄存器的值
        csrrw a0, mscratch, a0
        sd a1, 0(a0)
        sd a2, 8(a0)
        sd a3, 16(a0)

        # 从时钟中断暂存区读出时钟中断触发时间和时间间隔
        # 并设置下一次的时钟中断时刻
        ld a1, 24(a0) # CLINT_MTIMECMP(hart)
        ld a2, 32(a0) # interval
        ld a3, 0(a1)
        add a3, a3, a2
        sd a3, 0(a1)
        
        # 设置sip寄存器的值
        li a1, 2
        csrw sip, a1
        
        # 恢复寄存器
        ld a3, 16(a0)
        ld a2, 8(a0)
        ld a1, 0(a0)
        csrrw a0, mscratch, a0
        //返回，并根据sip触发一个软中断
        mret
```

#### 1.3main函数
**①工作原理**
>**概述**：**0号CPU**进行一系列**初始化**活动，并启动**第一个用户进程**，随后**其他CPU**才开始初始化
{%list%}
其他内核需要开启分页、安装内核的中断和异常处理程序、初始化中断控制器
{%endlist%}
{%right%}
__sync_synchronize()为GCC内置函数，保证在其之前的操作一定比在其之后的操作早完成
{%endright%}
{%warning%}
volatile告诉编译器变量是不稳定的，每次使用变量时都从内存中重新读取
{%endwarning%}
```c
#include "types.h"
#include "param.h"
#include "memlayout.h"
#include "riscv.h"
#include "defs.h"

volatile static int started = 0;

// start() jumps here in supervisor mode on all CPUs.
void
main()
{
  if(cpuid() == 0){
    consoleinit();
    printfinit();
    printf("\n");
    printf("xv6 kernel is booting\n");
    printf("\n");
    kinit();         // physical page allocator
    kvminit();       // create kernel page table
    kvminithart();   // turn on paging
    procinit();      // process table
    trapinit();      // trap vectors
    trapinithart();  // install kernel trap vector
    plicinit();      // set up interrupt controller
    plicinithart();  // ask PLIC for device interrupts
    binit();         // buffer cache
    iinit();         // inode table
    fileinit();      // file table
    virtio_disk_init(); // emulated hard disk
    userinit();      // first user process
    __sync_synchronize();
    started = 1;
  } else {
    //当第一个CPU完全启动，其他CPU才能开始初始化
    while(started == 0)
      ;
    __sync_synchronize();
    printf("hart %d starting\n", cpuid());
    kvminithart();    // turn on paging
    trapinithart();   // install kernel trap vector
    plicinithart();   // ask PLIC for device interrupts
  }

  scheduler();        
}
```
**②`userinit()`**
>**概述**：`userinit()`为其**分配资源**，并填充其`proc`结构和**用户页**，最后将其状态修改为`RUNNABLE`
{%list%}
一个进程需要的资源即proc结构和地址空间及用户页
{%endlist%}
{%right%}
userinit()将initcode填充入进程的用户页并将pc指针设置为0，从而启动进程
{%endright%}
>`initcode`为`initcode.S`的二进制形式，详细如下所示

>该进程先调用`exec()`执行`init.c`，随后不断**循环调用**`exit()`保证当前进程**一定能退出**
```c
// a user program that calls exec("/init")
// assembled from ../user/initcode.S
// od -t xC ../user/initcode
uchar initcode[] = {
  0x17, 0x05, 0x00, 0x00, 0x13, 0x05, 0x45, 0x02,
  0x97, 0x05, 0x00, 0x00, 0x93, 0x85, 0x35, 0x02,
  0x93, 0x08, 0x70, 0x00, 0x73, 0x00, 0x00, 0x00,
  0x93, 0x08, 0x20, 0x00, 0x73, 0x00, 0x00, 0x00,
  0xef, 0xf0, 0x9f, 0xff, 0x2f, 0x69, 0x6e, 0x69,
  0x74, 0x00, 0x00, 0x24, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00
};

// Set up first user process.
void
userinit(void)
{
  struct proc *p;

  p = allocproc();
  initproc = p;
  
  // allocate one user page and copy initcode's instructions
  // and data into it.
  uvmfirst(p->pagetable, initcode, sizeof(initcode));
  p->sz = PGSIZE;

  // prepare for the very first "return" from kernel to user.
  p->trapframe->epc = 0;      // user program counter
  p->trapframe->sp = PGSIZE;  // user stack pointer

  safestrcpy(p->name, "initcode", sizeof(p->name));
  p->cwd = namei("/");

  p->state = RUNNABLE;

  release(&p->lock);
}
```
```nasm
# Initial process that execs /init.
# This code runs in user space.

#include "syscall.h"

# exec(init, argv)
.globl start
start:
        la a0, init
        la a1, argv
        li a7, SYS_exec
        ecall

# for(;;) exit();
exit:
        li a7, SYS_exit
        ecall
        jal exit

# char init[] = "/init\0";
init:
  .string "/init\0"

# char *argv[] = { init, 0 };
.p2align 2
argv:
  .long init
  .long 0

```
**③第一个用户进程**
>**概述**：打开`console`并设置**标准输出**和**标准错误**，并`fork()`一个`shell`进程，当其退出后**重新打开**`shell`
{%list%}
当shell被创建后会进入内层死循环，而当shell退出后，退出内层死循环并进入外层死循环重新创建shell
{%endlist%}
```c
// init: The initial user-level program

#include "kernel/types.h"
#include "kernel/stat.h"
#include "kernel/spinlock.h"
#include "kernel/sleeplock.h"
#include "kernel/fs.h"
#include "kernel/file.h"
#include "user/user.h"
#include "kernel/fcntl.h"

char *argv[] = { "sh", 0 };

int
main(void)
{
  int pid, wpid;

  if(open("console", O_RDWR) < 0){
    mknod("console", CONSOLE, 0);
    open("console", O_RDWR);
  }
  dup(0);  // stdout
  dup(0);  // stderr

  for(;;){
    printf("init: starting sh\n");
    pid = fork();
    if(pid < 0){
      printf("init: fork failed\n");
      exit(1);
    }
    if(pid == 0){
      exec("sh", argv);
      printf("init: exec sh failed\n");
      exit(1);
    }

    for(;;){
      // this call to wait() returns if the shell exits,
      // or if a parentless process exits.
      wpid = wait((int *) 0);
      if(wpid == pid){
        // the shell exited; restart it.
        break;
      } else if(wpid < 0){
        printf("init: wait returned an error\n");
        exit(1);
      } else {
        // it was a parentless process; do nothing.
      }
    }
  }
}
```
### 2.Linux0.11的启动
#### 2.1bootsect.s
**①引导程序**
>**概述**：计算机上电时，`pc`寄存器被**初始化**为`0xFFFF0`，即`BIOS`所在`ROM`区域
{%list%}
BIOS将启动扇区搬运到内存0x7c00位置，设置pc寄存器跳转到该位置执行，并设置ds段寄存器为0x7c00
{%endlist%}
>若**0盘0道1扇区**的最后两个字节为`0x55`和`0xaa`，则`BIOS`将其视为**启动扇区**，其中为编译后的`bootsect.s`
{%right%}
BIOS还会检查计算机的各个硬件是否能正常工作
{%endright%}
**②内存规划**
>**概述**：将`0x7c00`位置代码**移动**到`0x90000`处，并设置好了`cs`、`ds`、`ss`和`sp`**寄存器**
{%list%}
设置以上寄存器即设置了CPU的代码段cs、数据段ds和栈段ss，做好了初步的内存规划
{%endlist%}
**③代码搬运**
>**概述**：调用**BIOS中断**加载**第二个到第五个扇区**到`0x90200`处，并将**操作系统代码**加载到内存`0x10000`处
{%list%}
第二到第五个扇区存放了setup.s编译后的文件，如果没有成功加载则会一直循环重试
{%endlist%}
{%right%}
最后跳转到0x90200即setup.s处
{%endright%}
#### 2.2setup.s
**①读取硬件信息**
>**概述**：调用**BIOS中断程序**将一系列**硬件信息**存储到**内存指定位置**，并将**操作系统代码**移动到到**0地址**处
{%list%}
最后需要关闭中断，因为现在使用的是BIOS中断，而后续需要重写中断
{%endlist%}
{%right%}
将硬件信息存放到内存指定位置即0x90000处，以便后续的C程序读取使用
{%endright%}
**②描述符表设置**
>**概述**：将**全局描述符表（GDT）**地址存储在`gdtr`**寄存器**中，**中断描述符表（IDT）**地址存储在`idtr`**寄存器**中

>对**可编程中断控制器**进行修改，设置对应**中断号**和**PIC请求号**的关系
{%list%}
全局描述符表存放着保护模式需要的段描述符，中断描述符表存放着中断号和对应处理程序地址的映射
{%endlist%}
{%right%}
GDT和IDT都是操作系统常用数据，所以提供专门的寄存器存放其地址
{%endright%}
**③模式转换**
>**概述**：打开`A20`**地址线**，并设置`cr0`**寄存器**从**实模式**切换**保护模式**，并跳转到**0地址**处，即`head.s`
{%list%}
保护模式下，段寄存器中不再为段地址，而是段选择子，根据段选择子，从全局描述符表找到段描述符
{%endlist%}
>**段描述符**包含的**段基址**加上**偏移地址**为**物理地址**
{%right%}
其中全局描述符表只有代码段描述符和数据段描述符，且其段基质都是0，所以物理地址等于逻辑地址
{%endright%}
{%warning%}
如果不打开A20地址线，则即使地址线有32位，也只能使用其中的20位
{%endwarning%}

#### 2.3head.s
**①内存再规划**
>**概述**：设置**新段寄存器**和`esp`**寄存器**，**段寄存器**指向**数据段描述符**，`esp`指向`use_stack`**尾后元素地址**
{%list%}
use_stack为一段独立的内存空间
{%endlist%}
**②重写描述符表**
>**概述**：重新创建**IDT**和**GDT**，并重新`gdtr`**寄存器**和`idtr`**寄存器**
{%list%}
其中IDT所有中断描述符都被默认初始化，GDT设置了代码段、数据段和系统段
{%endlist%}
>中断描述符的**处理程序**被设置为`ignore_int`，此时中断还**不能正常工作**，后续会在`main`函数中**加载各个中断**
{%right%}
重新设置是因为之前的IDT和GDT位于setup中，而setup对应位置后续要被作为缓冲区
{%endright%}
**③开启分页**
>**概述**：将**页目录表**和**页表**写到**0地址**处，并将**0地址**存储到`cr3`**寄存器**中，设置`cr0`开启**分页机制**

>最后将`main`**函数地址**入栈，在通过`iret`跳转到`main`函数中
{%list%}
Linux0.11采用的是二级目录，32位被分为10位的页目录项、10位的页表项和12位的偏移地址
{%endlist%}
>类似于`gdtr`**寄存器**和`idtr`**寄存器**，`cr3`**寄存器**专门用于存放**页表地址**
{%right%}
Linux0.11内存为16M，所以只有一个页目录表和四个页表，4(页表数)x1024(页表项数)x4kb(一页大小) = 16mb
{%endright%}
>被覆盖的system代码**已经被执行过**，所以可以随便覆盖


