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
### 2.泛型算法
#### 2.1引言
大部分定义在algorithm中，一部分数值泛型算法定义在numeric中
遍历两个迭代器的范围
要求元素支持==和<操作符算法不会改变容器的大小
第一个元素和为尾后元素
只读算法
find count 
accumulate(first,last,val)求和，val为初值，决定了该函数使用哪个加法运算符以及返回值的类型
accumulate(vec.cbegin(),vec.cend(),"");""缺省为一字符数组指针，没有定义对应的加法，是错误的
equal(afirst,alast,bfirst)：确定两个序列是否具有相同的值，b序列至少和a序列一样长

写容器操作
fill(first,last,val)将对应范围内的元素全部改为val
fill_n(first,n,val)：将first，first+n范围内的元素改写为val
注意算法不会改变容器大小所以保证容器大小足够是程序员自己的责任
保证输出空间足够的一个方法是采用插入迭代器
通常情况下，通过迭代器向容器元素赋值时，值被赋予迭代器指向的元素，
当通过插入迭代器赋值时，对应值的元素被插入到容器中
back_inserter接收一个容器的引用，返回一个插入迭代器，向该迭代器赋值时，会调用该容器的push_back()。常常作为目的容器使用，fill_n(back_inserter(vec),10,0)

copy(afirst,alast,bfirst)将a范围的元素复制到bfirst开始处，返回其目的容器目的位置后的迭代器

replace(first,last,val1,val2)：将序列中所有的val1替换为val2
replace_copy(afirst,alast,bfirst,val1,val2)不在原本容器上改变，将结果存储在b容器中
sort(first,last)将对应序列从小到大排序
unique(first,last)接收一个有序序列，消除重复元素，将其移动到容器末尾，返回不重复值范围末尾的迭代器
想要真正删除容器元素，还是需要调用erase
sort(words.begin(),words.end(),is_shorter);
stable_sort()会维持相等元素的原有顺序
使用自己的操作替代默认运算符
谓词：一个可调用的表达式，返回结果是一个可以作为条件的值
函数、函数指针、lambda表达式和function object
find_if(first,last,func)对序列的每个元素调用func，返回使得func返回非0值元素的迭代器，否则返回尾迭代器，但是func必须为一元谓词

lambda表达式
一个可调用的代码单元，类似于未命名的内联函数

捕捉列表为lambda表达式所在函数的局部变量的列表
必须采用尾置返回
可以省略参数列表和返回类型
auto f = [捕捉列表](参数列表) -> 返回类型{函数体}
f()即可调用lambda表达式

如果忽略返回类型，则自动从返回的表达式类型推断出来
不能有默认参数
捕获列表只会使用明确指明的变量，逗号分隔
`[sz](const string &s){return s.size()<sz}`
可以直接使用定义在当前函数之外的名字和局部static变量
for_each(first，last，a_func)：对序列的每个对象调用a_func

当定义一个lambda表达式时，编译器会生成一个对应的未命名的类，该lambda表达式对象就是该类的实例
包含捕获变量的数据成员


采用引用方式捕获`[&sz](const string &s){return s.size()<sz}`可以修改sz的值
保证lambda表达式执行时，指向对象依旧存在

还可以让编译器从lambda表达式函数体中的代码推断我们需要捕获哪些变量，详细见C++ primer p351

一般情况下，对于一个值被拷贝的变量，lambda表达式不会改变其值，如果想要改变该变量，则需要使用
`[sz](const string &s) mutable {return s.size()<sz++}`

如果lambda表达式除了return语句还有其他语句，且省略了尾置返回，编译器默认其返回void

bind()
functional头文件中
auto new_func = bind(func,arg_list);
调用new_func时，会调用func并将arg_list传递给他

其中arg_list可能包含_n，为一占位符，标识传递给new_func的参数的位置
auto new_func = bind(func,_1,sz)标识将func的第二个参数绑定为sz
new_func(a) = func(a,sz)
using namespace std::placeholders
还可以重新安排参数顺序详细见《C++ Primer》p356

对一个插入迭代器赋值时，在指定位置插入一个元素

对插入迭代器进行*，递增和递减都只会返回插入迭代器，不会做任何事情
back_inserter 调用push_back
front_inserter 调用push_front
inserter 调用insert(c,p)调用inset在p之前插入元素，且之后该插入迭代器会指向原来的元素，而非插入元素
注意front_inserter会导致元素顺序颠倒

反向迭代器
尾元素向首元素反向移动的迭代器，++/--操作的含义会颠倒过来
rebegin()：返回指向尾元素的反向迭代器
rend()：返回指向首前元素的反向迭代器
sort(a.begin(),a.end())：从小到大排列
sort(a.rbegin(),a.rend())从大到小排列
不能再forward_list和流创建反向迭代器
可以将反向迭代器转化为正常的迭代器，但是转化过后指向元素不同了，详细见《C++ primer》p364
forward_list的迭代器不支持--运算
关联容器的迭代器都是双向的