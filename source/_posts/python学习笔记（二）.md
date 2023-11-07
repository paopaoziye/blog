---
title: python学习笔记（二）
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
  - 编程语言
  - python
categories: 编程语言
keywords: 文章关键词
updated: ''
img: /medias/featureimages/4.webp
date:
summary: python编程进阶
---
# python学习笔记（二）
## python进阶

### 1.正则表达式（Regex）
**1.1定义**：一种**只描述文本特征**文本描述方法
>与正则表达式有关的函数在**re模块**中

**1.2字符分类**
①默认字符
![默认字符](/image/python_8.png)
②自定义:[ijk]
>可以使用`-`表示字母或数字的范围，如[0-57-8]表示[012345678]

**一般的**正则表达式符号不会被解释，不需要使用转义字符
在的左方括号后加上一个插入字符`^`，就可以得到**非字符类**，即匹配不在这个字符类中的所有字符
**1.3步骤**
①`import re`导入re模块
②用`re.compile()`函数创建一个**Regex对象**（记得使用**原始字符串**）
③向Regex对象的`search()`方法传入想查找的字符串，它返回一个**Match对象**
④调用Match对象的`group()`方法，返回实际匹配文本的**字符串**
```
phoneNumRegex = re.compile(r'\d\d\d-\d\d\d-\d\d\d\d') #phoneNumRegex是一个Regex对象
mo = phoneNumRegex.search('My number is 415-555-4242.') #mo是一个Match对象
print('Phone number found: ' + mo.group())
```
**1.4修饰符号**:在**初始化Regex对象**时使用，如果想要匹配这这些字符，需要使用对应的**转义字符**
①`()`：对Regex对象进行**分组**
>group()函数可以提取对象的**某一组内容**，默认是0，即不考虑分组

```
phoneNumRegex = re.compile(r'(\d\d\d)-(\d\d\d-\d\d\d\d)')
mo = phoneNumRegex.search('My number is 415-555-4242.')
mo.group(1) #得到的结果是'415'
```
>如果想要一次就获取**所有的分组**，使用`groups()`方法，返回多个组对应的**字符串元组**

②`|`：表示匹配许多表达式**中的一个**即可
```
heroRegex = re.compile (r'Batman|Tina Fey')
mo1 = heroRegex.search('Batman and Tina Fey.')
mo1.group() #结果是'Batman'，即第一次匹配到的
```
>可以利用`()`和`|`实现某部分确定，某部分可选的正则表达式，如`batRegex = re.compile(r'Bat(man|mobile|copter|bat)')`

③`?`:表明它**前面的分组**在这个模式中是**可选的**
>`batRegex = re.compile(r'Bat(wo)?man')`既匹配'Batwoman'，又匹配'Batman'

④`*`：意味着“匹配零次或多次”，即星号之前的分组，可以在文本中出现**任意次**，包括0次
>`batRegex = re.compile(r'Bat(wo)*man')`可以匹配'Batwowowowoman'和'Batman'

⑤`+`：类似于`*`，但是**至少要一次**
⑥`{}`：类似于`*`，用于指定**特定次数**，`{n}`表示匹配n次，`{i，j}`代表i-j次
>贪心和非贪心匹配:Python 的正则表达式**默认是“贪心”**的，这表示在有二义的情况下，它们会**尽可能匹配最长的字符串**，花括号的“非贪心”版本匹配尽可能最短的字符串，即在**结束的花括号后跟着一个问号**

```
greedyHaRegex = re.compile(r'(Ha){3,5}')
mo1 = greedyHaRegex.search('HaHaHaHaHa')
mo1.group() #结果是'HaHaHaHaHa'
nongreedyHaRegex = re.compile(r'(Ha){3,5}?')
mo2 = nongreedyHaRegex.search('HaHaHaHaHa')
mo2.group() #结果是'HaHaHa'
```
⑦`^`/`$`：被搜索字符串必须以正则表达式对应的字符串**开始/结束**
⑧`.`：匹配一个**除了换行之外**的所有字符
>传入`re.DOTALL`作为`re.compile()`的第二个参数，可以让句点字符匹配`所有字符`，包括换行字符

**1.5拓展方法**
①`findall()`：不同于`search()`返回的Match对象只包含`第一次出现的匹配文本`，`findall()`将返回一**字符串列表**，包含被查找字符串中的**所有匹配**
```
phoneNumRegex = re.compile(r'\d\d\d-\d\d\d-\d\d\d\d') # has no groups
phoneNumRegex.findall('Cell: 415-555-9999 Work: 212-555-0000')
['415-555-9999', '212-555-0000']
```
>如果在正则表达式中有分组，那么findall将返回**元组的列表**，每个元组表示一个找到的匹配，其中的项就是正则表达式中每个分组的匹配字符串

```
phoneNumRegex = re.compile(r'(\d\d\d)-(\d\d\d)-(\d\d\d\d)') # has groups
phoneNumRegex.findall('Cell: 415-555-9999 Work: 212-555-0000')
[('415', '555', '1122'), ('212', '555', '0000')]
```
②`sub()`：传入两个参数，第一个参数是一个字符串，用于取代发现和正则表达式匹配的部分，第二个参数是一个正则表达式，返回替换完成后的字符串
```
namesRegex = re.compile(r'Agent \w+')
namesRegex.sub('CENSORED', 'Agent Alice gave the secret documents to Agent Bob.')#返回'CENSORED gave the secret documents to CENSORED.'
```
>如果只想改变和对应正则表达式相匹配的**一部分**，可以给正则表达式参数**分组**，并在第一个参数开头加上`\n`，代表该字符串只替代第n组

```
agentNamesRegex = re.compile(r'Agent (\w)\w*')
agentNamesRegex.sub(r'\1****', 'Agent Alice told Agent Carol that Agent Eve knew Agent Bob was a double agent.')
#返回结果是'A**** told C**** that E**** knew B**** was a double agent.'

```
③复杂的正则表达式
>可以可以向`re.compile()`传入变量`re.VERBOSE`，作为第二个参数，忽略正则表达式字符串中的空白符和注释
使用三重引号，可以将正则表达式定义放在多行中

详细可见[参考文章](https://github.com/jackfrued/Python-100-Days/blob/master/Day01-15/12.%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%92%8C%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F.md)

### 2.并发编程
**2.1相关概念**
①并发编程：让程序同时执行多个任务
②进程：操作系统中**正在执行**的程序
>操作系统以进程为单位分配存储空间，每个进程都有自己的**地址空间**、**数据栈**以及其他用于跟踪进程执行的**辅助数据**
不同进程通过**进程间通信机制**（IPC）来实现数据共享，具体的方式包括**管道**、**信号**、**套接字**、**共享内存区**等

③线程：进程中可以获得CPU调度的执行单元
>某个时刻能够获得CPU的只有唯一的一个**线程**

**2.2多进程**
[参考文章](https://github.com/jackfrued/Python-100-Days/blob/master/Day01-15/13.%E8%BF%9B%E7%A8%8B%E5%92%8C%E7%BA%BF%E7%A8%8B.md)




