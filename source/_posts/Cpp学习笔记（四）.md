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
# Cpp学习笔记（四）
## 标准库工具
### 1.标准容器
#### 1.1引言
**①顺序容器**
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

>**适配器**：接收一种**已有的容器类型**，将其改造为**另一种容器**，如**栈**`stack`、**队列**`queue`和**堆**`priority_queue`
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

**②关联容器**
>`map`：每个元素为一**键值对**，通过**关键字**对**值**进行**索引**

>`set`：每个元素只包含一个**关键字**，支持高效的**关键字查询**操作
{%list%}
还分为是否有序以及是否允许重复元素，以map为例有map、multimap、unordered_map、unordered_multimap
{%endlist%}
>`map`和`multimap`定义在**map头文件**中，`unordered_map`、`unordered_multimap`定义在**unordered_map头文件**中
{%warning%}
有序容器关键字类型必须定义元素比较的方法，标准库默认使用<对元素进行比较，详细见《C++ primer》P378
{%endwarning%}
{%right%}
可以向容器传递一个函数用于自定义比较操作，其类型必须在尖括号中紧跟着元素类型给出
{%endright%}
>如`map<string,int,decltype(a_func)*> a_map(a_func)`，传递`func`定义了**元素比较方法**
{%wrong%}
set，map元素的关键字是不能更改的，相当于是const
{%endwrong%}
```cpp
auto map_it = a_map.cbegin();
auto set_it = a_set.cbegin();

*set_it = "new_key";//错误
map->first = "c";//错误
```
**③类型别名**
{%list%}
每种容器的别名是不同的，需要以[容器]::指明
{%endlist%}
>`iterator/const_iterator`：**泛型指针**，**非常量**版本和**常量**版本

>`size_type/difference_type`：保存**容器最大大小**/**迭代器之间的距离**，分别为**无符号整数**和**带符号整数**

>`value_type/reference/const_reference`：容器**元素的数据类型**/**元素数据类型类型的引用**

>`key_type/mapped_type`：键值对**键/值的类型**，**前者**只有`map`和`set`系列有，后者只有`map`系列有

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
#### 1.3顺序容器
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



#### 1.4关联容器
**①`pair`类**
>**概述**：`map`的每个元素为`pair`类型，有两个**公有数据成员**`first`和`second`，分别指向**关键字和值**

>`make_pair(val1,val2)`：返回一个用`val1`和`val2`**初始化**的`pair`**对象**，类型根据`val1`和`val2`**自动推断**

>**pair的初始化**：`pair<type1,type2> a_pair(val1,val2)/pair<type1,type2> a_pair = {val1,val2}`

>**map的初始化**：`map<string,int> a_map = {{"a",1},{"b",2}}`

**②增删元素**
>`insert(v)/empalce(args)`：类似于**顺序容器**的插入，p指示**返回类型**由**容器类型**决定

>`insert(p,v)/empalce(p,args)`：同上，`p`为一**迭代器**，指示从**哪个位置**开始**搜索插入位置**
{%list%}
对于非重复容器，如果元素已经存在，则没有任何效果，对于可重复容器，总是会插入
{%endlist%}
>对于**非重复容器**，返回一个`pair`对象，包含一个**迭代器**指向**对应关键字的元素**以及**是否插入成功**的`bool`值

>对于**可重复容器**，返回指向**插入元素**的迭代器

>`insert(first,last)/insert(il)`：类似于**顺序容器**，返回`void`

>`erase(key)`：删除所有**关键字为`key`的元素**，返回**删除元素的数量**，返回类型为`size_type`

>`erase(p)/erase(first,last)`：类似于**顺序容器**，返回**最后删除元素之后位置**的迭代器

**③访问元素**
>`at(k)/a_map[k]`：只有`map`有下标操作，`k`为一**关键字**，只适用于**非`const`的`map`和`unorder_map`**
{%list%}
若关键字不在容器中，前者抛出异常，后者创建一个对应关键字的元素，其值被值初始化
{%endlist%}
{%warning%}
map的下标操作得到一个mapped_type类型对象，解引用一个map的迭代器时，会得到一个value_type对象
{%endwarning%}

>`find(k)`：返回一个指向**第一个关键字为`k`的元素**，若不在容器中，返回**尾后迭代器**

>`count(k)`：返回关键字为`k`的元素的**个数**

>`lower_bound(k)/upper_bound(k)`：指向第一个关键字**不小于/大于**`k`的元素，只适用于**有序容器**

>`equal_range(k)`：返回一个**迭代器**`pair`，指向**关键字等于**`k`的**元素范围**
{%right%}
相当于[lower_bound(k)，upper_bound(k))
{%endright%}

**④无序容器**
>**概述**：使用**哈希函数**和**关键字的`==`操作符**组织元素，每个**元素**都有其**对应的哈希值（根据关键字计算）**
{%list%}
存储形式为一组桶，每个哈希值对应一个桶，哈希值相同的元素存储在同一个桶中
{%endlist%}
{%warning%}
我们可以直接创建关键字为内置类型、string和智能指针类型的无序容器，对于其他类，需要自定义哈希策略和==
{%endwarning%}
>如`unordered_map<string,int,decltype(my_hash)*,decltype(my_equal)*> a_unordered_map(10,my_hash,my_equal)`
{%right%}
在有序容器的基础上，还增添了以下操作，同时还可以对桶的数量进行调整，详细见《C++ primer》p395
{%endright%}
>`max_bucket_count()/bucket_count()`：正在使用/容器最多能容纳的桶的数量

>`bucket_size(n)`：第`n`个桶中有**多少个元素**

>`bucket(k)`：关键字为`k`的元素在**第几个桶中**

>`local_iterator/const_local_iterator`：桶中元素的**迭代器类型**

>`begin(n)/end(n)/cbegin(n)/cend(n)`：返回桶`n`对应的**迭代器**
#### 1.5字符串
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

### 2.内存管理
####
静态内存保存局部static、类static和定义在函数之外的变量，在使用之前分配
智能指针，自动释放指向的对象
定义在memory头文件中

shared_ptr，是模板类，所以需要指明其指向类型
shared_ptr<int> p1
默认初始化的智能指针包含一个空指针
大部分行为类似于普通指针
while(p1)可以检查其是否包含空指针
p.get()返回p中保存的指针
swap(p,q)交换p和q中的指针
make_shared<T>(args)返回一个shared_ptr，指向一个动态分配的类型为T的对象，使用args初始化此对象，类似于容器的emplace
shared_ptr<T>p(q)p是shared_ptr q的拷贝，此操作会递增q的计数器，q中的指针必须能转化为T*
p = q 会递减p的引用计数，递增q的引用计数
p.use_count()返回和p共享对象的智能指针数量

每当进行拷贝和赋值操作时，每个shared_ptr都会记录有多少个其他的shared_ptr指向相同的对象
当拷贝一个shared_ptr，如利用一个shared_ptr初始化另一个shared_ptr，将其作为一个参数传递给函数、作为函数的返回值，其计数器都会增加
当给shared_ptr赋予一个新值或者shared_ptr被销毁，其计数器会递减
当被指向对象没有shared_ptr指向时，该对象会被释放，调用其析构函数

shared_ptr要及时删除

如果想要某几个类对象共享一个数据对象，可以该类的数据成员定义为一个智能指针
new和delete是运算符
自由空间分配的内存是无名的
默认初始化
vector<int> *pv = new vector<int>(10,10);
vector<int> *pv = new vector<int>{0,1,2,3};

可以动态分配一个const对象
const string *pcs = new const string;
如果该对象没有定义默认构造函数，则必须显式初始化

如果内存不够，new可能会抛出一个bad_alloc异常
int *p = new (nothrow) int;如果分配失败，不会抛出异常，而是返回一个空指针

只能delete一块动态分配的内存，但是编译器不会帮你判断
可以在delete一个指针后将其变为空指针
注意多个指针指向相同的动态内存

不能进行内置指针和智能指针的隐式转换，必须使用直接初始化形式
shared_ptr<int> p1(new int(10));
shared_ptr<int> p1 = new int(10);错误

避免将同一块内存绑定到多个独立创建的shared_ptr上

不要使用临时`shared_ptr`指针对象，否则可能会产生空悬指针
```cpp
//假设process是一个接收指针指针的函数
int *x = new int(10);
process(x);//错误，内置指针不能隐式转换为智能指针
//可以调用，但是实参为一临时对象，process(shared_ptr<int>(x));结束时其就被销毁
//当函数调用结束，shared_ptr引用计数变为0，会释放对应对象，导致x变为一个空悬指针
process(shared_ptr<int>(x));
int y = *x;//错误，x已经称为一个空悬指针
```
注意，不能将新的shared_ptr指向一个get返回的指针
独立的shared_ptr的计数器不是共享的
使用get获得内置指针的代码不能delete该指针

函数发生异常时，会直接退出，局部对象会被直接销毁，如果使用new分配的指针，可能会导致内存泄漏，而使用智能指针则不会

可以定义自己的行为取代shared_ptr的delete，如释放资源，尤其是对于一些没有定义析构函数的对象（C和C++都支持的类）
`shared_ptr<aclass> pc(&a_aclass,end_connection)`


unique_ptr
某个时刻只能有一个unique_ptr指向一个给定对象，当一个unique_ptr被销毁时，其指向对象也被销毁
类似的，初始化unique_ptr也需要直接初始化
不支持普通的拷贝和赋值
```cpp
unique_ptr<int> p1(new int(10));
//错误，不支持拷贝
unique_ptr<int> p2(p1);
//错误，不支持赋值
unique_ptr<int> p3;
p3 = p1;
//将p1置空后，会释放对应的对象
p1 = nullptr;
```
`release()`：返回内置指针，并将对应unique_ptr置为空，注意release并不会释放对应对象
`reset()/reset(p)`：释放unique_prt指向的对象，并将其指向内置指针p
p1.reset(p2.realse());可以将p2的内置指针转移到p1中
可以拷贝/赋值一个即将要被销毁的unique_ptr，如从函数返回一个unique_ptr
```cpp
//可以成功拷贝
unique_ptr<int> clone(int p){
  return unique_ptr<int>(new int(p));
}
```
auto_ptr具有unique_ptr的部分特性，但是不能被保存在容器中，也不能从函数中返回
unique_ptr<connection,decltype(end_connection)*> p (&c,end_connection);

weak_ptr
一种不控制指向对象生存周期的智能指针，指向有shared_ptr管理的对象，不会改变对应shared_ptr的引用计数
当shared_ptr引用计数变为0，即使有一个weak_ptr指向对应对象，还是会被释放

weak_ptr<T> wp(sp)：sp为一个shared_ptr，两者指向相同的对象，T必须能转化为sp指向对象的类型
w = p：p可以是一个shared_ptr/weak_ptr，两者指向共同的对象
reset()：将weak_ptr置为空
use_count()：和对应weak_ptr共享对象的shared_ptr的数量
lock()：如果use_count()的值不为0，则返回一个指向w的对象的shared_ptr，反之返回一个空的shared_ptr
由于weak_ptr指向的对象可能不存在，所以在使用其访问对象是，必须使用lock对其进行检查
while(shared_ptr<int> sp = wp.lock());
weak_ptr不会影响一个对象的生存期，但是可以阻止用户访问一个不存在的对象

new int[size]size只需要是一个整型即可，不必是一个常量，甚至可以是0，会获得一个合法的非空指针，类似于尾后指针
逆序销毁
注意返回的是对应元素类型的指针，而不是数组的指针，所以不能使用begin、end和for范围语句
默认初始化
new int[size]()值初始化 
new int[size]{0,1,2,3}列表初始化
为了使用智能指针管理动态分配的数组，在创建智能指针时，需要指明其类型是数组
unique_ptr<int[]> up(new int[10])
可以使用下标访问数组元素
shared_ptr不支持直接管理动态分配的数组，如果需要管理一个动态分配的数组，必须定义自己的删除器
不支持下标运算符，也不支持指针的算数运算，必须使用get获得其内置指针访问数组元素
```cpp
shared_ptr<int> sp(new int[10],[](int *p){delete [] p;});
for(int i = 0;i < 10;++i){
  *(sp.get()+i) = i;
}
```
allocator类
可以将内存分配和对象构造分离
根据给定的对象类型确定内存大小和对齐位置

allocator<string> alloc_string;
alloc_string.allocate(n);分配一段原始的内存，足以容纳n个string，返回一个对应类型的指针
alloc_string.deallocate(p,n)，释放对应内存，p必须指向对应内存的初始位置，n必须为其整体大小
且在调用该函数前，对应内存的每个对象都应该被销毁
所以最开始获得的指针应该被保留，创建一个拷贝使用
alloc_string.construct(p,args)，在p指向的内存处利用args构造一个对象
alloc_string.destroy(p)销毁p指向的对象
```cpp
allocator<string> alloc_string;
auto p = alloc_string.allocate(10);
auto q = p;
for(int i = 0;i < 10; ++i){
   alloc_string.construct(q++);
}
while(q != p){
  alloc_string.destroy(--q);
}
alloc_string.deallocate(p,10);
```

uninitialized_copy(first,last,p)
