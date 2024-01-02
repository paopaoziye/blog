---
title: Cpp学习笔记（四）
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
  - 《C++ primer》
  - C++
categories: 编程语言
keywords: 文章关键词
updated: ''
img: /medias/featureimages/11.webp
date:
summary: 标准库工具
---
# Cpp学习笔记
## 标准库工具
### 1.顺序容器
#### 1.1引言
**①分类**
>**连续容器**：`vector`动态数组、`array`固定数组、`string`字符串、`deque`双向队列
{%list%}
连续容器均支持快速随机访问，但是除了在特定位置插入/删除元素之外，效率都较低
{%endlist%}
{%right%}
array可以看作标准化的内置数组，更加安全易用，在声明时需要指明元素类型和大小
{%endright%}

>**链式容器**：`list`双向链表、`forward_list`单向链表
{%list%}
不支持随机访问且有额外的空间开销，但是在任何位置插入/删除元素效率都较高
{%endlist%}
{%right%}
如果在读取输入时需要在容器中间位置插入元素，而后续需要随机访问，可以先使用list，后续拷贝到vector中即可
{%endright%}
**②类型别名**
{%list%}
每种容器的别名是不同的，需要以[容器]::指明
{%endlist%}
>`iterator/const_iterator`：**泛型指针**，**非常量**版本和**常量**版本

>`size_type/difference_type`：保存**容器最大大小**/**迭代器之间的距离**，分别为**无符号整数**和**带符号整数**

>`value_type/reference/const_reference`：容器**元素的数据类型**/**元素数据类型类型的引用**

**③构造**
{%list%}
以整型vector为例
{%endlist%}
>`vector<int> my_vec`：构建一个**空的**`vector`
{%list%}
如果容器是array，还需要指明数组大小，所有元素按照默认方式初始化
{%endlist%}
>`vector<int> my_vec(my_vec2)`：**复制一份**传入的动态数组，对应**赋值**`vector<int> my_vec = my_vec2`
{%list%}
两者容器类型、元素类型必须相同，如果是array，大小还需要相同
{%endlist%}
>`vector<int> my_vec{1,2,3}`：类似于**C语言数组**的初始化，对应**赋值**`vector<int> my_vec = {1,2,3}`
{%list%}
对于array，列表元素数量必须小于等于其大小，未指定的元素采用默认值初始化
{%endlist%}
{%warning%}
array支持参数列表初始化，但是不支持参数列表赋值
{%endwarning%}
>`vector<int> my_vec(10)`：`vector`**元素个数**为`10`，且**所有元素**被**初始化**为`0`
{%list%}
只指明容器大小，且元素类型为类，会调用其默认构造函数
{%endlist%}
{%warning%}
该构造函数是explicit的，且string不支持此种方法
{%endwarning%}
>`vector<int> my_vec(10，10)`：`vector`**元素个数**为`10`，且**所有元素**被**初始化**为`10`

>`vector<int> my_vec(first，last)`：使用**一对泛型指针/指针**给其赋值
{%list%}
使用迭代器构造容器不要求容器类型和元素类型相同，只要元素类型可以相互转换即可
{%endlist%}
{%warning%}
倒数三种构造方式array不支持
{%endwarning%}
**④通用操作**
>`swap()`：**交换**容器元素，如`a.swap(b)`
{%right%}
交换操作通常比拷贝操作快得多，因为元素值并没有交换，只是交换了两者的内部数据结构（容器壳子）
{%endright%}
{%warning%}
对于string，swap会导致其内部的迭代器、引用和指针失效，对于array，会直接交换元素值，但是不会破坏指针等
{%endwarning%}

>`assign(first,last)/assign(num,val)`：**替换**容器内元素，类似于**赋值**行为
{%list%}
除了array，其他顺序容器均支持assign()，普通的赋值(=)要求较为严苛，而assign()要求较为宽松，就像重新构造
{%endlist%}
{%warning%}
assign()和赋值相关操作会导致左边容器内部的迭代器、引用和指针失效
{%endwarning%}
>`size()/max_size()`：返回容器**元素数目/最大可保存的元素数目**
{%warning%}
forward_list不支持size()
{%endwarning%}
>`empty()`：判断容器**是否为空**

>**关系运算符**：如`==`、`>`、`<`等，本质上是**对容器的每个元素**通过`==`或`<`逐个比较
{%list%}
所以容器的元素最好至少定义了==和<比较符
{%endlist%}
**⑤添加/删除元素**
{%warning%}
array不支持添加删除元素，因为会改变容器大小
{%endwarning%}
>`insert()/emplace()`：**插入**元素，前者是**将参数拷贝进容器**，后者是**对参数调用对应构造函数**再添加进容器

>`erase()/clear()`：**删除**指定的元素/**清空**容器

forward_list的迭代器不支持--运算
反向迭代器rbegin，crbegin

### 2.关联容器

### 3.内存管理