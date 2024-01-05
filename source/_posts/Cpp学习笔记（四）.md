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
array可以看作标准化的内置数组，更加安全易用
{%endright%}
{%warning%}
array在声明时需要指明元素类型和大小，且不支持任何插入/删除操作
{%endwarning%}

>**链式容器**：`list`双向链表、`forward_list`单向链表
{%list%}
不支持随机访问且有额外的空间开销，但是在任何位置插入/删除元素效率都较高
{%endlist%}
{%right%}
如果在读取输入时需要在容器中间位置插入元素，而后续需要随机访问，可以先使用list，后续拷贝到vector中即可
{%endright%}
**②适配器**
>**概述**：接收一种**已有的容器类型**，将其改造为**另一种容器**，如**栈**`stack`、**队列**`queue`和**堆**`priority_queue`
{%list%}
默认情况下，栈和队列时基于deque实现的，堆是基于vector实现的
{%endlist%}
{%warning%}
栈能基于除了array和forward_list之外的容器构造，队列只能基于list和deque构造，堆只能基于vector和deque构造
{%endwarning%}
>`stack<int> stk`/`stack<int,vector<int> > stk`：构建一个**空`stack`对象**，后者指定其**底层容器**
{%right%}
可以使用对应底层容器初始化适配器对象
{%endright%}
>如`stack<int> stk(a_int_deque)`

>`pop()`：删除**栈顶/队首/堆顶**元素，但是**不返回**该元素

>`push(val)/emplace(args)`：元素**入栈/队/堆**

>`top()`：返回**栈顶/堆顶元素**

>`front()/back()`：返回**队首/队尾**元素

**③类型别名**
{%list%}
每种容器的别名是不同的，需要以[容器]::指明
{%endlist%}
>`iterator/const_iterator`：**泛型指针**，**非常量**版本和**常量**版本

>`size_type/difference_type`：保存**容器最大大小**/**迭代器之间的距离**，分别为**无符号整数**和**带符号整数**

>`value_type/reference/const_reference`：容器**元素的数据类型**/**元素数据类型类型的引用**

**④构造**
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
**⑤通用操作**
>`swap()`：**交换**两个**相同类型**容器元素，如`a.swap(b)`
{%list%}
swap()只是交换了两者的内部数据结构（容器壳子），而没有交换元素
{%endlist%}
>对于`array`，会直接**交换元素**，其**迭代器**、**引用**和**指针**没有失效，但是**指向元素值**发生了改变
{%right%}
交换操作远快于拷贝，且不会破坏容器的迭代器、引用和指针
{%endright%}
{%warning%}
对于string，swap会导致其内部的迭代器、引用和指针失效
{%endwarning%}

>`assign(first,last)/assign(num,val)`：**替换**容器内元素，类似于**赋值**行为
{%list%}
除了array，其他顺序容器均支持assign()，普通的赋值(=)要求较为严苛，而assign()要求较为宽松，像重新构造
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

#### 1.2迭代器
**①引言**
>**概述**：本质上是一个**某个类的friend类**，对多种**操作符**进行**重载**，**性质和用法**类似于**指针**，故也称为**泛型指针**
{%list%}
如下为一个数列类以及其泛型指针
{%endlist%}
{%right%}
使用typedef关键字将iterator_to_special_vector改为统一的iterator
{%endright%}
```cpp
//泛型指针相关联的类
class special_vector{
  public:
    //一些成员函数
  friend class iterator_to_special_vector;
  typedef iterator_to_special_vector iterator;

  iterator begin() const{
    return iterator(_begin_pos-1)
  }

  iterator end() const{
    return iterator(_begin_pos+_len-1)
  }
  private:
      int _begin_pos;
      int _len;
      static vector<int> _elems;
}
```
```cpp
//泛型指针类定义
class iterator_to_special_vector{
  public:
      iterator_to_special_vector(int index):_index(index-1){}
      bool operator== (const special_vector&) const;
      int operator*() const;
      //...一系列操作符函数的重载
  private:
      int _index;
}
```
**②分类**
>`[类名]::iterator [泛型指针名]`：对应类的**普通泛型指针**，其**常量指针**形式为`const_iterator`
{%list%}
每个标准容器都有对应的泛型指针类，统一重命名为iterator，需要使用[类名]::指明其所属类
{%endlist%}
>`[类名]::reverse_iterator [泛型指针名]`：对应类的**逆序泛型指针**，其**常量指针**形式为`const_reverse_iterator`
{%list%}

{%endlist%}

**③获取**
>`begin()/end()`：返回容器对象**首个/尾后元素**的**普通泛型指针**，如`my_vector.begin()`

>`rbegin()/rend()`：返回容器对象**首个/尾后元素**的**逆序泛型指针**，如`my_vector.rbegin()`
{%list%}
以上函数会根据容器对象的常量性返回常量版本和非常量版本的泛型指针
{%endlist%}
>如果只需要**常量版本**的泛型指针，可以使用`cbegin()/cend()/crbegin()/crend()`
{%warning%}
所有容器为泛型指针定义了==和!=操作符，有些容器没有定义比较操作符，所以使用first != last而不是first < last
{%endwarning%}
{%wrong%}
不能对尾后指针执行解引用和递增
{%endwrong%}
{%right%}
也可以用于内置数组，获得其头指针和尾后指针，使用模板，使得函数可以同时处理指针/泛型指针
{%endright%}
```cpp
template<typename Iterator_Type,typename Elem_Type>
Iterator_Type
find(Iterator_Type first,Iterator_Type last,const Elem_Type &value)
{
  for(;first!=last;++first)
      if(*first!=value)
      return first;
  
  return last;
}
```
#### 1.3常用操作
**①添加元素**
>`push_front(val)/push_back(val)`：在容器**头/尾部**插入值为`val`的元素
{%warning%}
vector和string不支持push_front(val)和push_back(val)
{%endwarning%}
>`emplace_front(args)/emplace_back(args)/emplace(p,args)`：在容器**头/尾/p指向元素前**插入**由`args`创建**的元素
{%list%}
push创建一个临时元素对象，并将其拷贝到容器，emplace在容器中直接构造元素，返回值均为void
{%endlist%}
{%right%}
emplace相关函数在容器中直接构造元素，所以args需要与对应元素的构造函数相匹配
{%endright%}
>`insert(p,n,val)/insert(p,il)/insert(p,val)`：在`p`**指向元素前**插入`n`个值为`val`/**元素值列表**`il`的元素

>`insert(p,first,last)`：在`p`**指向元素前**插入迭代器`[first,last)`范围内的元素，迭代器**不能属于被插入容器**
{%list%}
insert返回指向新添加的第一个元素的迭代器
{%endlist%}
{%warning%}
向vector、string和deque中插入元素会导致该容器的迭代器、引用和指针失效
{%endwarning%}

**②删除元素**
>`pop_front()/pop_back()`：删除**首/尾元素**，返回`void`
{%list%}
forward_list不支持pop_back()，vector和string不支持pop_front()
{%endlist%}
>`erase(p)/erase(first,last)`：删除`p`**指向元素**/**迭代器`[first,last)`范围**内的元素
{%list%}
返回最后一个被删除元素后一个位置的迭代器
{%endlist%}
{%warning%}
删除deque元素会导致其迭代器等失效，删除vector和string元素，删除点后的迭代器等会失效
{%endwarning%}
{%wrong%}
删除元素必须确保它们是存在的
{%endwrong%}
>`clear()`：**清空容器**，返回`void`

**③其他操作**
>`front()/back()/at(n)`：访问容器**头/尾/下标为n**的元素的**引用**，若**容器为常量**，返回的是**常量引用**
{%list%}
back不适用于forwar_list，at只适用于vector、string、array和deque
{%endlist%}
{%warning%}
访问容器元素前，需要保证容器非空，且注意下标越界问题
{%endwarning%}
>`resize(n)/resize(n,t)`：调整**容器大小**为`n`，若`n`大于容器大小，则**新增加的元素**默认初始化/初始化为`t`

**④`forward_list`专属操作**
>`before_begin()/cbefore_begin()`：返回链表的**首前元素**

>`insert_after()`：和上述`insert()`**参数列表**一致，但是在**迭代器`p`之后**插入元素

>`erase_after(p)/erase_after(first,last)`：删除`p`**指向位置之后**/**迭代器`(first,last)`范围**元素

**⑤`vector`动态分配**
>**概述**：`vector`每次分配的**实际内存**大于其**需求空间**，前者称为`capacity`，后者称为`size`
{%list%}
不仅仅是vector，string等也采用类似的动态内存分配，只有当size大于capacity时，才进行内存分配
{%endlist%}
{%right%}
capacity大小通常为size的两倍，可以有效减少内存分配次数
{%endright%}
>`shrink_to_fit()`：将容器的`capacity`**减少**到和`size`**一致**
{%warning%}
仅仅是一种请求，标准库不保证回退内存空间
{%endwarning%}
>`capacity()`：求出容器的`capacity`

>`reserve(n)`：为容器分配**至少**能容纳**n个元素**的内存空间
{%warning%}
若n小于等于当前容器capacity，该函数什么都不做
{%endwarning%}

#### 1.4字符串
**①构造**
>`string(a_string,n)`：拷贝`a_string`的**前n个字符**

>`string(a_string,p)/string(c_string,p,n)`：拷贝`a_string`的从**下标**`p`开始的**n个字符**，下标**不能越界**
{%list%}
a_string可以是string，也可以是C风格字符串
{%endlist%}
{%warning%}
从C风格字符串拷贝字符串时，则其需要以空字符结尾，且若用户指定范围超出其范围，结果是未定义的
{%endwarning%}
{%right%}
从string拷贝字符串时，最多拷贝到其末尾
{%endright%}
**②修改**
>

**③搜索**
>

### 2.关联容器

### 3.内存管理


forward_list的迭代器不支持--运算