---
title: xv6源码阅读（二）
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
summary: xv6的初始化
---

# MIT6.1810
## xv6源码阅读（二）
### 1.xv6的初始化
#### 1.1引言
**①mian函数**
{%right%}
详细可见上一章节，这里主要作为背景参考
{%endright%}
```c
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
**②终端初始化**
>**概述**：初始化对应**自旋锁**，初始化`uart`，并设置终端的**读写处理函数**
{%list%}
uartinit()初始化UART的波特率和FIFO缓冲区，并允许UART发送中断信号，最后初始化了对应的锁
{%endlist%}
{%right%}
xv6利用devsw结构数组管理设备，其中devsw中保存了对应设备的读写处理函数指针
{%endright%}
```c
struct devsw {
  int (*read)(int, uint64, int);
  int (*write)(int, uint64, int);
};
```
```c
void
consoleinit(void)
{
  initlock(&cons.lock, "cons");
  uartinit();
  // connect read and write system calls
  // to consoleread and consolewrite.
  devsw[CONSOLE].read = consoleread;
  devsw[CONSOLE].write = consolewrite;
}
```
```c
void
uartinit(void)
{
  // disable interrupts.
  WriteReg(IER, 0x00);

  // special mode to set baud rate.
  WriteReg(LCR, LCR_BAUD_LATCH);

  // LSB for baud rate of 38.4K.
  WriteReg(0, 0x03);

  // MSB for baud rate of 38.4K.
  WriteReg(1, 0x00);

  // leave set-baud mode,
  // and set word length to 8 bits, no parity.
  WriteReg(LCR, LCR_EIGHT_BITS);

  // reset and enable FIFOs.
  WriteReg(FCR, FCR_FIFO_ENABLE | FCR_FIFO_CLEAR);

  // enable transmit and receive interrupts.
  WriteReg(IER, IER_TX_ENABLE | IER_RX_ENABLE);

  initlock(&uart_tx_lock, "uart");
}
```
**③打印初始化**
>**概述**：初始化`pr`结构的**自旋锁**，并将其**状态**置为`1`
{%right%}
这个自旋锁主要是用于避免并发的printf函数之间相互交叉输出
{%endright%}
```c
void
printfinit(void)
{
  initlock(&pr.lock, "pr");
  pr.locking = 1;
}
```
```c
// lock to avoid interleaving concurrent printf's.
static struct {
  struct spinlock lock;
  int locking;
} pr;
```
#### 1.2内存初始化
**①用户空间**
>**概述**：初始化`kmem`结构对应的**自旋锁**，并调用`freerange()`释放所有的**用户空间内存**
{%list%}
end为链接器定义的内核代码尾位置，kmem用于描述空闲内存，本质上是一个空闲页链表
{%endlist%}
{%right%}
freerange()中调用PGROUNDUP进行边界对齐
{%endright%}
```c
void
kinit()
{
  initlock(&kmem.lock, "kmem");
  freerange(end, (void*)PHYSTOP);
}
```
```c
extern char end[]; // first address after kernel,defined by kernel.ld.
struct {
  struct spinlock lock;
  struct run *freelist;
} kmem;
```
```c
void
freerange(void *pa_start, void *pa_end)
{
  char *p;
  p = (char*)PGROUNDUP((uint64)pa_start);
  for(; p + PGSIZE <= (char*)pa_end; p += PGSIZE)
    kfree(p);
}
```
**②内核空间**
>**概述**：调用`kvmmake()`创建**内核页表**，`kvmmake()`调用`kvmmap()`进行**映射填充**
{%list%}
kvmmake()还会调用proc_mapstacks()为每个进程创建内核栈，易知内核栈大小为一页
{%endlist%}
>`UART0`、`KERNBASE`和`KSTACK`等**物理内存相关宏定义**位于`kernel/memlayout.c`中
```c
// Initialize the one kernel_pagetable
void
kvminit(void)
{
  kernel_pagetable = kvmmake();
}
```
```c
// Make a direct-map page table for the kernel.
pagetable_t
kvmmake(void)
{
  pagetable_t kpgtbl;
  //为内核页表分配内存并清除内容
  kpgtbl = (pagetable_t) kalloc();
  memset(kpgtbl, 0, PGSIZE);

  // uart registers
  kvmmap(kpgtbl, UART0, UART0, PGSIZE, PTE_R | PTE_W);

  // virtio mmio disk interface
  kvmmap(kpgtbl, VIRTIO0, VIRTIO0, PGSIZE, PTE_R | PTE_W);

  // PLIC
  kvmmap(kpgtbl, PLIC, PLIC, 0x400000, PTE_R | PTE_W);

  // map kernel text executable and read-only.
  kvmmap(kpgtbl, KERNBASE, KERNBASE, (uint64)etext-KERNBASE, PTE_R | PTE_X);

  // map kernel data and the physical RAM we'll make use of.
  kvmmap(kpgtbl, (uint64)etext, (uint64)etext, PHYSTOP-(uint64)etext, PTE_R | PTE_W);

  // map the trampoline for trap entry/exit to
  // the highest virtual address in the kernel.
  kvmmap(kpgtbl, TRAMPOLINE, (uint64)trampoline, PGSIZE, PTE_R | PTE_X);

  // allocate and map a kernel stack for each process.
  proc_mapstacks(kpgtbl);
  
  return kpgtbl;
}
```
```c
void
proc_mapstacks(pagetable_t kpgtbl)
{
  struct proc *p;
  
  for(p = proc; p < &proc[NPROC]; p++) {
    char *pa = kalloc();
    if(pa == 0)
      panic("kalloc");
    uint64 va = KSTACK((int) (p - proc));
    kvmmap(kpgtbl, va, (uint64)pa, PGSIZE, PTE_R | PTE_W);
  }
}
```
**③开启分页**
>**概述**：调用`sfence_vma()`**刷新**整个`TLB`，并调用`w_satp()`设置`satp`**寄存器**的值
{%list%}
satp寄存器一部分用于指定当前页表的格式，一部分用于存储当前页表的地址
{%endlist%}
{%warning%}
TLB为高速缓存，存储了一系列虚拟地址和物理地址的映射信息，页表修改了，所以也需要刷新TLB
{%endwarning%}
```c
// Switch h/w page table register to the kernel's page table,
// and enable paging.
void
kvminithart()
{
  // wait for any previous writes to the page table memory to finish.
  sfence_vma();

  w_satp(MAKE_SATP(kernel_pagetable));

  // flush stale entries from the TLB.
  sfence_vma();
}
```
```c
// flush the TLB.
static inline void
sfence_vma()
{
  // the zero, zero means flush all TLB entries.
  asm volatile("sfence.vma zero, zero");
}
```
```c
// use riscv's sv39 page table scheme.
#define SATP_SV39 (8L << 60)

#define MAKE_SATP(pagetable) (SATP_SV39 | (((uint64)pagetable) >> 12))
// supervisor address translation and protection;
// holds the address of the page table.
static inline void 
w_satp(uint64 x)
{
  asm volatile("csrw satp, %0" : : "r" (x));
}
```
**④缓冲区初始化**
>**概述**：初始化**整个缓冲区**`bcache`和**每个缓冲块**的锁，并将缓冲区的**所有缓冲块**组织为**双向链表**
```c
void
binit(void)
{
  struct buf *b;

  initlock(&bcache.lock, "bcache");

  // Create linked list of buffers
  bcache.head.prev = &bcache.head;
  bcache.head.next = &bcache.head;
  for(b = bcache.buf; b < bcache.buf+NBUF; b++){
    b->next = bcache.head.next;
    b->prev = &bcache.head;
    initsleeplock(&b->lock, "buffer");
    bcache.head.next->prev = b;
    bcache.head.next = b;
  }
}
```

#### 1.3中断初始化
**①打开中断**
>**概述**：`trapinit()`初始化`tickslock`自旋锁，`trapinithart()`设置**内核中断处理向量**
{%list%}
stvec是RISC-V处理器中的一个特殊寄存器，用于设置异常处理的基址
{%endlist%}
```c
void
trapinit(void)
{
  initlock(&tickslock, "time");
}
// set up to take exceptions and traps while in the kernel.
void
trapinithart(void)
{
  w_stvec((uint64)kernelvec);
}
```
```c
static inline void 
w_stvec(uint64 x)
{
  asm volatile("csrw stvec, %0" : : "r" (x));
}
```
**②`PLIC`初始化**
>**概述**：`plicinit()`设置`UART`和`VIRTIO`的**中断优先级**为`1`，`plicinithart()`设置**每个处理器**的对应中断
{%list%}
PLIC是一种硬件设备，用于管理和分配来自各种外设的中断请求
{%endlist%}
{%right%}
plicinithart()设置处理器中断优先级阈值，使所有中断都能被处理
{%endright%}
```c
void
plicinit(void)
{
  // set desired IRQ priorities non-zero (otherwise disabled).
  *(uint32*)(PLIC + UART0_IRQ*4) = 1;
  *(uint32*)(PLIC + VIRTIO0_IRQ*4) = 1;
}

void
plicinithart(void)
{
  int hart = cpuid();
  
  // set enable bits for this hart's S-mode
  // for the uart and virtio disk.
  *(uint32*)PLIC_SENABLE(hart) = (1 << UART0_IRQ) | (1 << VIRTIO0_IRQ);

  // set this hart's S-mode priority threshold to 0.
  *(uint32*)PLIC_SPRIORITY(hart) = 0;
}
```
#### 1.4数据结构初始化
**①进程初始化**
>**概述**：初始化`pid_lock`和`wait_lock`，并初始化每个进程的**自旋锁**、**状态**和**内核栈**
```c
// initialize the proc table.
void
procinit(void)
{
  struct proc *p;
  initlock(&pid_lock, "nextpid");
  initlock(&wait_lock, "wait_lock");
  for(p = proc; p < &proc[NPROC]; p++) {
      initlock(&p->lock, "proc");
      p->state = UNUSED;
      p->kstack = KSTACK((int) (p - proc));
  }
}
```
**②文件相关初始化**
>**概述**：`iinit()`初始化了**整个`inode`数组**和**每个`inode`结构**的锁，`fileinit()`类似
```c
struct {
  struct spinlock lock;
  struct inode inode[NINODE];
} itable;
void
iinit()
{
  int i = 0;
  
  initlock(&itable.lock, "itable");
  for(i = 0; i < NINODE; i++) {
    initsleeplock(&itable.inode[i].lock, "inode");
  }
}
```

```c
struct {
  struct spinlock lock;
  struct file file[NFILE];
} ftable;

void
fileinit(void)
{
  initlock(&ftable.lock, "ftable");
}
```
### 2.Linux0.11的初始化
#### 2.1main函数
**①内存划分**
>**概述**：先获取**根设备号**和相关**硬件信息**，并将内存划分为**主内存**、**缓冲区**和**内核程序**三部分
{%list%}
内存大小为1MB+扩展内存大小，根据内存大小的不同，各个区域的边界也不同
{%endlist%}
{%warning%}
Linux0.11内存最大值为16MB，其中1MB用于存放内核程序
{%endwarning%}
```c
 	ROOT_DEV = ORIG_ROOT_DEV;
 	drive_info = DRIVE_INFO;
  // 内存大小=1Mb + 扩展内存(k)*1024 byte
	memory_end = (1<<20) + (EXT_MEM_K<<10);
  // 忽略不到4kb(1页)的内存数
	memory_end &= 0xfffff000;
  // 内存超过16Mb，则按16Mb计
	if (memory_end > 16*1024*1024)              
		memory_end = 16*1024*1024;
  // 如果内存>12Mb,则设置缓冲区末端=4Mb
	if (memory_end > 12*1024*1024) 
		buffer_memory_end = 4*1024*1024;
  // 若内存>6Mb,则设置缓冲区末端=2Mb
	else if (memory_end > 6*1024*1024)
		buffer_memory_end = 2*1024*1024;
  // 否则设置缓冲区末端=1Mb
	else
		buffer_memory_end = 1*1024*1024;        
	main_memory_start = buffer_memory_end;
// 如果在Makefile文件中定义了内存虚拟盘符号RAMDISK,则初始化虚拟盘
#ifdef RAMDISK
	main_memory_start += rd_init(main_memory_start, RAMDISK*1024);
#endif
```
**②初始化**
>**概述**：调用**一系列函数**对操作系统各个部分进行**初始化**，最后**开启中断**
{%list%}
在初始化的过程中会设置一系列中断，所以在初始化后才能开启中断
{%endlist%}
```c
  // 主内存区初始化，mm/memory.c
	mem_init(main_memory_start,memory_end);
  // 陷阱门(硬件中断向量)初始化，kernel/traps.c
	trap_init();
  // 块设备初始化,kernel/blk_drv/ll_rw_blk.c
	blk_dev_init();
  // 字符设备初始化, kernel/chr_drv/tty_io.c
	chr_dev_init();
  // tty初始化，kernel/chr_drv/tty_io.c
	tty_init();
  // 设置开机启动时间startup_time
	time_init();
  // 调度程序初始化，kernel/sched.c
	sched_init();
  // 缓冲管理初始化，fs/buffer.c
	buffer_init(buffer_memory_end);
  // 硬盘初始化，kernel/blk_drv/hd.c
	hd_init();
  // 软驱初始化，kernel/blk_drv/floppy.c
	floppy_init();
  // 所有初始化工作都做完了，开启中断
	sti();
```
**③第一个进程**
>**概述**：转移到**用户模式**，并且创建一个**子进程**运行`init()`启动`shell`，并且**不断调用**`pause()`

```c
  // 下面过程通过在堆栈中设置的参数，利用中断返回指令启动任务0执行。
	move_to_user_mode();                    // 移到用户模式下执行
	if (!fork()) {
		init();
	}
  // pause系统调用会把任务0转换成可中断等待状态，再执行调度函数
	for(;;) pause();
```
#### 2.2功能初始化
**①主内存**
>**概述**：设置`mem_map`数组，记录**内存页**的使用状态，使得**缓冲区**标记为`USED`，**主内存区**标记为`0`
{%warning%}
内存管理只能管理1MB以上的内存，因为1MB以下为内核程序
{%endwarning%}
```c
/* these are not to be changed without changing head.s etc */
// linux0.11内核默认支持的最大内存容量是16MB，可以修改这些定义适合更多的内存。
// 内存低端(1MB)
#define LOW_MEM 0x100000
// 分页内存15 MB，主内存区最多15M.
#define PAGING_MEMORY (15*1024*1024)
// 分页后的物理内存页面数（3840）
#define PAGING_PAGES (PAGING_MEMORY>>12)
// 指定地址映射为页号
#define MAP_NR(addr) (((addr)-LOW_MEM)>>12)
// 页面被占用标志.
#define USED 100

// 全局变量，存放实际物理内存最高端地址
static long HIGH_MEMORY = 0;
// 物理内存映射字节图（1字节代表1页内存）
static unsigned char mem_map [ PAGING_PAGES ] = {0,};

void mem_init(long start_mem, long end_mem)
{
	int i;
  //先mem_map所有成员置为USED
	HIGH_MEMORY = end_mem;                  // 设置内存最高端(16MB)
	for (i=0 ; i<PAGING_PAGES ; i++)
		mem_map[i] = USED;
  //将主内存区对应成员清0
	i = MAP_NR(start_mem);      // 主内存区其实位置处页面号
	end_mem -= start_mem;
	end_mem >>= 12;             // 主内存区中的总页面数
	while (end_mem-->0)
		mem_map[i++]=0;         // 主内存区页面对应字节值清零
}
```
**②中断初始化**
>**概述**：调用`set_trap_gate()`和`set_system_gate()`给对应的中断设置**中断处理程序**
{%list%}
system和trap分别成为中断门和陷阱门，区别在于对应中断描述符的特权级不同
{%endlist%}
{%right%}
其中硬件的中断处理程序为reserved，后续初始化对应硬件时覆盖掉
{%endright%}
```c
void trap_init(void)
{
	int i;
  // 设置除操作出错的中断向量值。
	set_trap_gate(0,&divide_error);
	set_trap_gate(1,&debug);
	set_trap_gate(2,&nmi);
	set_system_gate(3,&int3);	/* int3-5 can be called from all */
	set_system_gate(4,&overflow);
	set_system_gate(5,&bounds);
	set_trap_gate(6,&invalid_op);
	set_trap_gate(7,&device_not_available);
	set_trap_gate(8,&double_fault);
	set_trap_gate(9,&coprocessor_segment_overrun);
	set_trap_gate(10,&invalid_TSS);
	set_trap_gate(11,&segment_not_present);
	set_trap_gate(12,&stack_segment);
	set_trap_gate(13,&general_protection);
	set_trap_gate(14,&page_fault);
	set_trap_gate(15,&reserved);
	set_trap_gate(16,&coprocessor_error);

	for (i=17;i<48;i++)
		set_trap_gate(i,&reserved);
	set_trap_gate(45,&irq13);
	outb_p(inb_p(0x21)&0xfb,0x21);  // 允许8259A主芯片的IRQ2中断请求。
	outb(inb_p(0xA1)&0xdf,0xA1);    // 允许8259A从芯片的IRQ3中断请求。
	set_trap_gate(39,&parallel_interrupt); // 设置并行口1的中断0x27陷阱门的描述符。
}
```
**③进程调度初始化**
>**概述**：初始化**进程0**的`TSS`和`LDT`，并设置`task_struct`结构数组，最后开启**定时器中断**和**系统调用中断**
{%list%}
TSS为任务状态段，用于保存和恢复进程上下文，LDT为局部描述符表，用于描述每个用户进程的地址空间
{%endlist%}
>**每个进程**都会占用一个`TSS`和`LDT`
{%right%}
给tr和ldt寄存器赋值，让CPU知道TSS和LDT的位置
{%endright%}

```c
void sched_init(void)
{
	int i;
	struct desc_struct * p;// 描述符表结构指针

	if (sizeof(struct sigaction) != 16)
		panic("Struct sigaction MUST be 16 bytes");

	set_tss_desc(gdt+FIRST_TSS_ENTRY,&(init_task.task.tss));
	set_ldt_desc(gdt+FIRST_LDT_ENTRY,&(init_task.task.ldt));

	p = gdt+2+FIRST_TSS_ENTRY;
	for(i=1;i<NR_TASKS;i++) {
		task[i] = NULL;
		p->a=p->b=0;
		p++;
		p->a=p->b=0;
		p++;
	}
	__asm__("pushfl ; andl $0xffffbfff,(%esp) ; popfl"); 
	ltr(0);
	lldt(0);

	outb_p(0x36,0x43);		/* binary, mode 3, LSB/MSB, ch 0 */
	outb_p(LATCH & 0xff , 0x40);	/* LSB */
	outb(LATCH >> 8 , 0x40);	/* MSB */

	set_intr_gate(0x20,&timer_interrupt);
	outb(inb_p(0x21)&~0x01,0x21);
	set_system_gate(0x80,&system_call);
}
```
**④缓冲区初始化**
>**概述**：将**缓冲区**用一对对**缓冲头**和**缓冲块**填满，并初始化一**哈希表**，用于判断**要读取的块**是否位于**缓冲区**中
{%list%}
start_buffer为内核代码的末尾地址，由链接器设置
{%endlist%}
{%right%}
缓冲块位于缓冲区高端，缓冲头位于缓冲区低端，缓冲头用于寻找缓冲块，且缓冲头之间用双向队列组织
{%endright%}
```c
void buffer_init(long buffer_end)
{
	struct buffer_head * h = start_buffer;
	void * b;
	int i;
    // 首先根据参数提供的缓冲区高端位置确定实际缓冲区高端位置b。如果缓冲区高端等于1Mb，
    // 则因为从640KB - 1MB被显示内存和BIOS占用，所以实际可用缓冲区内存高端位置应该是
    // 640KB。否则缓冲区内存高端一定大于1MB。
	if (buffer_end == 1<<20)
		b = (void *) (640*1024);
	else
		b = (void *) buffer_end;

	while ( (b -= BLOCK_SIZE) >= ((void *) (h+1)) ) {
		h->b_dev = 0;                       // 使用该缓冲块的设备号
		h->b_dirt = 0;                      // 脏标志，即缓冲块修改标志
		h->b_count = 0;                     // 缓冲块引用计数
		h->b_lock = 0;                      // 缓冲块锁定标志
		h->b_uptodate = 0;                  // 缓冲块更新标志(或称数据有效标志)
		h->b_wait = NULL;                   // 指向等待该缓冲块解锁的进程
		h->b_next = NULL;                   // 指向具有相同hash值的下一个缓冲头
		h->b_prev = NULL;                   // 指向具有相同hash值的前一个缓冲头
		h->b_data = (char *) b;             // 指向对应缓冲块数据块（1024字节）
		h->b_prev_free = h-1;               // 指向链表中前一项
		h->b_next_free = h+1;               // 指向连表中后一项
		h++;                                // h指向下一新缓冲头位置
		NR_BUFFERS++;                       // 缓冲区块数累加
		if (b == (void *) 0x100000)         // 若b递减到等于1MB，则跳过384KB
			b = (void *) 0xA0000;           // 让b指向地址0xA0000(640KB)处
	}
	h--;                                    // 让h指向最后一个有效缓冲块头
	free_list = start_buffer;               // 让空闲链表头指向头一个缓冲快
	free_list->b_prev_free = h;             // 链表头的b_prev_free指向前一项(即最后一项)。
	h->b_next_free = free_list;             // h的下一项指针指向第一项，形成一个环链
    // 最后初始化hash表，置表中所有指针为NULL。
	for (i=0;i<NR_HASH;i++)
		hash_table[i]=NULL;
}	
```

#### 2.3设备初始化
**①块设备初始化**
>**概述**：初始化`request`结构数组，每个成员代表一个**块设备请求**，并通过`next`指针连接为一**链表**
{%list%}
request结构中存储了每次请求的信息，如需要读取哪几个扇区，已经缓冲区存放位置
{%endlist%}
```c
void blk_dev_init(void)
{
	int i;
	for (i=0 ; i<NR_REQUEST ; i++) {
		request[i].dev = -1;
		request[i].next = NULL;
	}
}
```
**②控制台初始化**
>**概述**：调用`rs_init()`和`con_init()`分别初始化**串口**和**屏幕**
{%list%}
con_init()从0x90006获取对应硬件数据，设置显存映射范围以及滚动屏幕需要的参数
{%endlist%}
{%right%}
内存中有部分数据和显存映射，向这些内存中写数据，相当于在屏幕上输出对应数据
{%endright%}
```c
void tty_init(void)
{
  //初始化串行中断程序和串行接口1和2（serial.c）
	rs_init();
  //初始化控制台终端(console.c)
	con_init();
}
```
**③时间初始化**
>**概述**：通过`CMOS_READ`从外设**实时时钟**的**对应端口**获取**时间信息**，经过一系列转换得到**开机时间**
{%list%}
从CMOS的端口获取是时间的BCD码，通过BCD_TO_BIN将读取到的BCD码转化为二进制值
{%endlist%}
{%right%}
kernel_mktime()用于计算从1970年1月1号0时起到开机当日经过的秒数，作为开机时间
{%endright%}
{%warning%}
CMOS的访问速度很慢，为了减少时间误差，读取后如果秒值发生了变化，那么就重新读取所有值
{%endwarning%}
```c
static void time_init(void)
{
	struct tm time;
	do {
		time.tm_sec = CMOS_READ(0);
		time.tm_min = CMOS_READ(2);
		time.tm_hour = CMOS_READ(4);
		time.tm_mday = CMOS_READ(7);
		time.tm_mon = CMOS_READ(8);
		time.tm_year = CMOS_READ(9);
	} while (time.tm_sec != CMOS_READ(0));
	BCD_TO_BIN(time.tm_sec);
	BCD_TO_BIN(time.tm_min);
	BCD_TO_BIN(time.tm_hour);
	BCD_TO_BIN(time.tm_mday);
	BCD_TO_BIN(time.tm_mon);
	BCD_TO_BIN(time.tm_year);
	time.tm_mon--;
	startup_time = kernel_mktime(&time);
}
```
**④硬盘初始化**
>**概述**：设置硬盘的**请求处理函数**和**中断处理函数**，并和**对应端口交互**允许其发送**中断请求**
{%right%}
Linux0.11使用blk_dev数组管理所有块设备，不同的块设备有不同的请求处理函数
{%endright%}
```c
void hd_init(void)
{
	blk_dev[MAJOR_NR].request_fn = DEVICE_REQUEST;
	set_intr_gate(0x2E,&hd_interrupt);
	outb_p(inb_p(0x21)&0xfb,0x21);// 复位接联的主8259A int2的屏蔽位
	outb(inb_p(0xA1)&0xbf,0xA1); // 复位硬盘中断请求屏蔽位(在从片上)
}
```
