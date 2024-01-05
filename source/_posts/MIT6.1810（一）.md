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
  - xv6操作系统
  - MIT6.1810
categories: 项目实战
keywords: 文章关键词
updated: ''
img: /medias/featureimages/40.webp
date:
summary: xv6源码阅读
---
# MIT6.1810
## xv6源码阅读
### 1.引言
#### 1.1启动
**①引言**
>**概述**：当计算机上电时，**引导加载器**将xv6内核代码装载到内存`0x8000000`处，并**跳转到该位置**执行
{%list%}
此时处理器处于机器模式，分页也是禁用的，所以虚拟内存地址直接映射到物理内存地址
{%endlist%}
{%right%}
内存的0x000000-0x8000000为I/O设备
{%endright%}
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
还有一些其他辅助操作，如暂时禁用分页、配置物理内存访问权限和设置中断和异常等
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

// entry.S needs one stack per CPU.每个CPU都有自己的栈
// __attribute__ ((aligned (16)))要求stack0按照16字节对齐
__attribute__ ((aligned (16))) char stack0[4096 * NCPU];

// a scratch area per CPU for machine-mode timer interrupts.
uint64 timer_scratch[NCPU][5];

// assembly code in kernelvec.S for machine-mode timer interrupt.
extern void timervec();

// entry.S jumps here in machine mode on stack0.
void
start()
{
  // set M Previous Privilege mode to Supervisor, for mret.
  unsigned long x = r_mstatus();
  x &= ~MSTATUS_MPP_MASK;
  x |= MSTATUS_MPP_S;
  w_mstatus(x);

  // set M Exception Program Counter to main, for mret.
  // requires gcc -mcmodel=medany
  //将main函数地址压入pc寄存器，返回时就跳转到main中
  w_mepc((uint64)main);

  // disable paging for now，确保不会发生分页，虚拟地址就是物理地址
  w_satp(0);

  // delegate all interrupts and exceptions to supervisor mode.
  // 设置中断和异常委托，将其处理权限交给超级用户模式
  w_medeleg(0xffff);
  w_mideleg(0xffff);
  w_sie(r_sie() | SIE_SEIE | SIE_STIE | SIE_SSIE);

  // configure Physical Memory Protection to give supervisor mode
  // access to all of physical memory.
  w_pmpaddr0(0x3fffffffffffffull);
  w_pmpcfg0(0xf);

  // ask for clock interrupts.
  timerinit();

  // keep each CPU's hartid in its tp register, for cpuid().
  int id = r_mhartid();
  w_tp(id);

  // switch to supervisor mode and jump to main().
  //volatile防止编译器优化或者重新排列汇编代码
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
  // each CPU has a separate source of timer interrupts.
  int id = r_mhartid();

  // ask the CLINT for a timer interrupt.
  //CLINT_MTIME获取保存当前时间寄存器的地址
  //CLINT_MTIMECMP保存了时钟中断发生时间寄存器的地址
  int interval = 1000000; // cycles; about 1/10th second in qemu.
  *(uint64*)CLINT_MTIMECMP(id) = *(uint64*)CLINT_MTIME + interval;

  // prepare information in scratch[] for timervec.
  // scratch[0..2] : space for timervec to save registers.
  // scratch[3] : address of CLINT MTIMECMP register.
  // scratch[4] : desired interval (in cycles) between timer interrupts.
  uint64 *scratch = &timer_scratch[id][0];
  scratch[3] = CLINT_MTIMECMP(id);
  scratch[4] = interval;
  w_mscratch((uint64)scratch);

  // set the machine-mode trap handler.
  w_mtvec((uint64)timervec);

  // enable machine-mode interrupts.
  w_mstatus(r_mstatus() | MSTATUS_MIE);

  // enable machine-mode timer interrupts.
  w_mie(r_mie() | MIE_MTIE);
}
```
**②中断处理函数**
>**概述**：通过和`timer_scratch`交互，设置了**下一次时钟中断的时间**并触发了一个**超级用户中断**
{%list%}
触发的中断不会立即处理，而是等到mret超级用户模式时再作处理
{%endlist%}
```nasm
.globl timervec
.align 4
timervec:
        # start.c has set up the memory that mscratch points to:
        # scratch[0,8,16] : register save area.
        # scratch[24] : address of CLINT's MTIMECMP register.
        # scratch[32] : desired interval between interrupts.
        
        csrrw a0, mscratch, a0
        sd a1, 0(a0)
        sd a2, 8(a0)
        sd a3, 16(a0)

        # schedule the next timer interrupt
        # by adding interval to mtimecmp.
        ld a1, 24(a0) # CLINT_MTIMECMP(hart)
        ld a2, 32(a0) # interval
        ld a3, 0(a1)
        add a3, a3, a2
        sd a3, 0(a1)

        # arrange for a supervisor software interrupt
        # after this handler returns.
        li a1, 2
        csrw sip, a1

        ld a3, 16(a0)
        ld a2, 8(a0)
        ld a1, 0(a0)
        csrrw a0, mscratch, a0

        mret

```
#### 1.3`main.c`函数
**①工作原理**
>**概述**：**0号CPU**进行一系列**初始化**活动，**初始化结束**时，**其他CPU**才开始初始化
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
②③