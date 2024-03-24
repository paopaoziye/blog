---
title: Linux工作流（三）
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
summary: Linux常见命令
---
# Linux工作流
## Linux进阶操作
### 1.辅助功能
#### 1.1定时调度
{%right%}
指定系统在指定时间执行指定脚本/指令，脚本文件需要有执行权限
{%endright%}
**①`crontab`命令**
>`crontab [选项]`：`-e/l/r`选项**打开/查询/删除**任务列表，`-r`选项后跟**任务号**删除**特定任务**
{%list%}
先打开任务列表，在其中按照特定格式输入任务即可
{%endlist%}
{%warning%}
使用前使用service crond restart保证crond正在启动
{%endwarning%}
>**任务格式**：`[] [] [] [] [] [指令]/[脚本文件路径]`
{%list%}
每个占位符都有其特殊含义，组合起来表示任务执行的频率
{%endlist%}
>`第一个`：表示**一个小时**的**第几分钟**，**取值范围**为`0-59`

>`第二个`：表示**一天**中的**第几个小时**，**取值范围**为`0-23`

>`第三个`：表示**一个月**中的**第几天**，**取值范围**为`1-31`

>`第四个`：表示**一年**中的**第几个月**，**取值范围**为`1-12`

>`第五个`：表示**一周**中的**星期几**，**取值范围**为`1-7`
{%list%}
每个占位符都有其特殊格式，表示特殊意义
{%endlist%}
>`*`：表示**任何时间**，如第一个`*`表示**一小时的每分钟**

>`,`：表示**不连续的时间**，`0,30 1 * * *`表示**每天的一点和一点半**

>`-`：表示**连续的时间**，如`0-30 1 * * *`，表示**每天的一点到一点半**

>`*/n`：表示**每隔多久执行一次**，如`*/10 1 * * *`，表示**每天的一点到两点每隔十分钟执行一次**

**②`at`命令**

>`at [时间]`：回车后输入**指令**或者**脚本路径**，随后输入**两次**`ctrl+D`**结束输入**
{%list%}
可以使用atq查看未执行的任务队列，并采用atrm 任务编号删除对应任务
{%endlist%}
{%warning%}
需要保证atd正在执行，可以使用ps -ef|grep atd检查
{%endwarning%}
{%right%}
一次性定时任务,时间格式如下
{%endright%}
>`小时:分钟 日/月/年`：在**对应时间**执行，若**只有**`小时:分钟`，则在**当天对应时间**执行
{%list%}
若当天的对应时间过去，则会在第二天的对应时间执行
{%endlist%}
>`now+n 时间单位` ：**多久之后**执行
{%list%}
时间单位有minutes、hours、days和weeks
{%endlist%}

#### 1.2磁盘管理
{%list%}
磁盘可分为硬盘和软盘，现在软盘已经被淘汰了，所以磁盘相当于就是硬盘
{%endlist%}
**①硬盘信息**
>**`lsblk`**：查看**硬盘分区**情况，可以添加`-f`选项查看**详细信息**
{%list%}
NAME、FSTYPE、FSUSE%、MOUNTPOINT分别为磁盘/分区编号、文件系统类型、使用百分比、挂载目录
{%endlist%}
{%right%}
磁盘的每个分区都可以通过挂载和某个目录联系到一起，访问这个目录相当于访问该分区
{%endright%}

**②硬盘分区**
>`fdisk [硬盘路径]`：进入**界面**后，输入`n`、选择**分区类型**、选择**分区数目**即可完成**分区**
{%list%}
linux中硬盘也是文件，存储在/dev目录下，所以磁盘路径通常为/dev/[磁盘编号]
{%endlist%}
{%warning%}
分区后需要书去w进行保存，不保存则按q退出
{%endwarning%}

**③磁盘格式化**
>`mkfs -t [文件系统类型] [分区路径]`：将**对应分区**格式化为对应**文件系统**
{%list%}
硬盘分区也是/dev下的一个文件，通常路径为/dev/[分区编号]
{%endlist%}

**④磁盘挂载**
>`mount [分区路径] [目录路径]`：将对应分区**挂载**到对应目录下
{%list%}
在该目录创建文件后，文件写入到该分区中
{%endlist%}
>`umount [分区路径]/[目录路径]`：**撤销**对应分区/目录的**挂载映射关系**
{%list%}
撤销挂载映射关系后，该目录文件消失，但是分区中文件不会消失
{%endlist%}
{%warning%}
在命令行中挂载/撤销挂载，重启后会失效
{%endwarning%}
{%right%}
可通过修改/etc/fstab文件实现永久挂载，其中UUID可以使用分区路径替代，执行mount -a/重启即可生效
{%endright%}
{%wrong%}
不能在卸载的目录中执行撤销指令
{%endwrong%}
**⑤硬盘使用情况**
>`df -h`：显示硬盘的**整体使用情况**

>`du -h [目录路径]`：显示该目录下**所有文件的大小**，不指定是**当前目录**
{%list%}
-s选项仅仅显示汇总，-c选项同时显示汇总和明细，--max-depth=n指定n为子目录深度
{%endlist%}

#### 1.3网络管理
**①IP获取**
>**自动获取**：**启动后**自动获取IP，可以**避免IP冲突**，但是每次的**地址不同**
{%list%}
在setting的network选项卡中修改
{%endlist%}
>**指定IP**：修改对应**配置文件**，修改`BOOTPROTO="static"`，并新增`IPADDR`、`GATEWAY`、`DNS1`
{%list%}
新增项分别为IP地址、网关地址和域名解析器地址，network restart重启网络服务即可生效
{%endlist%}
{%warning%}
如果使用的是虚拟机，则还需要通过虚拟网络编辑器修改虚拟机的子网和网关等信息
{%endwarning%}
**②主机名映射**
>`hostname`：**查看**主机名，可以在`/etc/hostname`中**修改主机名**
{%list%}
修改etc/hosts，设置主机名和IP地址的映射，输入主机名相当于输入对应IP地址
{%endlist%}
{%right%}
只是简单的替代关系，所以可以在etc/hosts中随意新增映射关系
{%endright%}
{%warning%}
host文件中的映射关系不能乱写，否则很可能找不到正确的IP地址
{%endwarning%}
>在浏览器中**输入网址**后，浏览器依次从**浏览器缓存**、**本地DNS解析缓存**、**hosts文件**、**DNS服务器**查找IP地址

**③网络状态**
>`ping [IP地址]`：测试**能否访问**对应网络地址
{%list%}
ping后可以跟任何可以映射为IP地址的东西，如主机名和URL
{%endlist%}
>`ifconfig`：查看**当前网卡信息**，如**IP地址**、**子网掩码**等
-a查看所有网卡，sudo ifconfig [网卡名] 192.168.1.137设置网卡IP地址

>`netstat -anp`：查看系统**网络连接**状态
{%list%}
Proto网络协议、Local Address本地监听端口、Foreign Address外地请求端口，State端口状态
{%endlist%}

#### 1.4进程管理
**①进程信息**
>`ps -aux`：显示**进程信息**，`-a`选项显示**所有进程**，`-u`以**用户格式**显示 `-x`显示**后台进程**
{%list%}
%CPU、%MEM、STAT和COMMAND分别表示CPU占用、物理内存占用、进程状态和启动进程的命令
{%endlist%}
{%right%}
可以配合管道命令和more或者grep，ps -aux | more，ps -aux | grep xxx
{%endright%}
>`ps -ef`：**全格式**显示所有进程，主要用于查看`PPID`**父进程**、`C`执行**优先级**

>`pstree`：查看**进程树**

**②进程管理**
>`kill [选项] [进程号]`：**终止**进程，但是该请求**可能会被屏蔽**
{%list%}
-9选项强制终止进程
{%endlist%}
{%right%}
kill对应用户使用的ssh进程，从而阻止该用户远程登录
{%endright%}
>`killall [进程名称]`：**终止**进程以及**其子进程**

>`top [选项]`：**动态**显示进程，以及**概述信息**
{%list%}
-dn设置隔n秒更新，默认是3秒，-i不显示闲置和僵死进程，-p [进程号]监控某个进程
{%endlist%}
{%right%}
进入界面后，可按下某键进行交互
{%endright%}
>`M/N/P`：按照**内存占用率/PID/CPU占用率**排序

>`u`：**回车**后输入**用户名**，即可仅查看**某用户进程**

>`k`：**回车**后输入**PID**，**回车**后再输入**信号量如9**，即可**终止**对应进程

>`q`：**退出**


#### 1.5服务管理
**①引言**
>**服务**：一个**后台进程**，**监听**某个**端口**，**等待**其他程序的**请求**

>**运行级别**：系统的**运行状态**，常用的有`3`**有网络的多用户状态**、`5`**图形界面**
{%list%}
不同的运行级别，会有不同的服务开机时自启动
{%endlist%}
>`systemctl get-default`：**获取**运行级别

>`systemctl set-default [运行级别对应字符串]`：**修改**运行级别，**重启生效**

>`systemctl list-unit-files`：查看**当前运行级别**各个服务进程的**自启动状态**

>`systemctl [start/stop/restart/status] [服务名]`：**开始/停止/重启/查看**对应服务

>`systemctl [enable/disable/is-enabled] [服务名]`：**设置**服务进程开机**是/否自启动**，**查询**自启动状态


**②防火墙**
{%list%}
用于管理端口，外界只能访问防火墙允许访问的端口
{%endlist%}
>`telnet [ip地址] [端口号]`：从**某个端口**连接**对应IP地址**

>`sudo ufw allow [端口号]`：**打开**端口

>`sudo ufw delete allow [端口号]`：**关闭**端口

>`sudo ufw status`：查看**已经开启**的端口

>`sudo ufw reload`：防火墙**重启**

**③SSH**
{%list%}
一种建立在应用层和运输层基础上的安全协议，常用于远程登录，分为客户端和服务端，服务端在22号端口监听
{%endlist%}
>`sudo apt-get install openssh-server`：安装SSH**服务端与客户端**，Ubuntu需要要**手动安装**
{%list%}
安装后使用systemctl重启并设置自启动即可
{%endlist%}
>`ssh [用户名]@[IP地址]`：以**某个用户**连接**对应IP地址主机**，需要输入**该用户密码**

>`exit/logout`：**退出**远程连接

**④apt**
>**概述**：一种**包管理器**，可以从对应**apt服务器**下载安装软件
{%list%}
/etc/apt/sources.list中存放使用的apt服务器地址，可以将其修改为镜像源，如清华大学开源软件镜像站
{%endlist%}
>`sudo apt-get update`：**更新**apt源

>`sudo apt-get install [包名称]`：**安装**软件包

>`sudo apt-get source [包名称]`：获取**源代码**

>`sudo apt-get remove [包名称]`：删除包


