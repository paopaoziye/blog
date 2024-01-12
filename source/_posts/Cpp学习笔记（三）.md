---
title: Cpp学习笔记（三）
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
summary: 面向对象编程
---
# Cpp学习笔记
## Cpp学习笔记（三）
### 1.泛型编程
#### 1.1引言
>**概述**：构建一个可以处理**多种容器**以及**多种数据类型**的函数
{%right%}
以下为一非泛型查找函数，只能处理整型数组，将其改造为一个泛型算法
{%endright%}
**①改造前**
```cpp
int* find(const int* array,int value,int size)
{
  for(int ix = 0;ix < size;++ix)
      if(array[ix] == value)
          return &array[ix];
  return 0;
}
```
**②改造后**
```cpp
template <typename IteratorType,typename ElemType,typename Func>
IteratorType
find(IteratorType first,IteratorType last,const ElemType &value,Func comp)
{
  for(;first != last;++first)
  {
    if (comp(*first,value)) //也可以写成
    return first;
  }
  return last;
}

int main()
{
  //只写与泛型指针相关部分
  vector<int>::iterator it;
  it = find(vec.begin(),vec.end(),1024,equal_to());
}
```
#### 1.2函数模板
>**格式**：在**函数前**添加`template`**参数列表**，将**形参列表**需要**泛化的部分**替换为**占位符**即可
{%list%}
函数被调用时，编译器根据传入的参数类型将占位符绑定为对应类型，并产生一个对应的函数实例
{%endlist%}
{%right%}
函数模板使得函数可以处理不同数据类型的数据，且模板函数可以重载
{%endright%}
```cpp
//函数定义
template<typename T>
void  display_message(const string &msg,const vector<T> &vec)
{
  cout<<msg;
  for(int i = 0;i<vec.size();++i)
  {
    T t = vec[i];
    cout<<t<<'';
  }
}
```

#### 1.4function object
**①引言**
>**概述**：本质上是提供**function call操作符**`()`**重载函数**的类的**实例对象**
{%list%}
遇到lt()时，若lt为一function object（还可能为函数名和函数指针），编译器会将lt(val)转换为lt.operator(val)
{%endlist%}
```cpp
class less_than
{
  public:
  //构造函数
  less_than(int val):_val(val) {};
  //基值的读取与修改
  int comp_val() const {return _val;}
  void comp_val(int new_val) const {_val = new_val;}
  //function call操作符重载
  bool operator()(int val_to_com) const {return val_to_com < _val};

  private:
  int _val;
};
```
**②适配器**
{%list%}
修改function object的特性
{%endlist%}
>`bind1st()`：将`function object`的**第一个参数**绑定为**特定值**，从而将其转化为**一元操作符**

>`bind2st()`：同上，绑定的是**第二个参数**

>`not1()`：接收一个**一元操作符**，生成一个结果**真伪与原版相反**的`function object`

>`not2()`：同上，但是接收一个**二元操作符**

**③标准库function object**
{%list%}
标准库为以下三类运算符定义了function object，需要包含functional头文件
{%endlist%}
{%right%}
通常将function object传递泛型算法，从而达到类似于函数指针的效果，且节省了函数调用的开销
{%endright%}
>**算数运算符**：`plus<type>`（`+`）等

>**关系运算符**：`equal_to<type>`（`=`）等

>**逻辑运算符**：`logical_and<type>`（`&&`）等

***
### 2.标准容器
#### 2.1引言
**①定义**
>**概述**：本质上是**标准库**的**模板类**，常用的**Cpp容器**有**动态数组**`vector`和**字符串**`string`
{%list%}
使用对应容器需要包含对应头文件
{%endlist%}
**②统一接口**
{%list%}
每个容器都有以下实现
{%endlist%}
>**`empty()`**：判断容器**是否为空**，是则返回`ture`，反之`false`

>**`size()`**：返回容器的**元素个数**
{%list%}
每个容器的size返回值是每个类中的size_type，本质上还是一种无符号类型
{%endlist%}
>如`string::size_type`和`vector<type>::size_type`

>**`clear()`**：**清除**容器**所有元素**

>**`insert()/erase()`**：**插入/删除**元素

>**比较操作符**：如`==`、`!=`、`>`、`<`等，按照**字典顺序**比较

**③泛型算法**
{%list%}
需要包含functional头文件
{%endlist%}
>**`find()/binary_search()`**：**线性/二分**查找对应元素

>**`count()`**：返回与数值相符的**元素数目**

>**`search()`**：查找**子序列**，返回其**起始位置的泛型指针**

>**`sort()`**：**排序**，**缺省情况**下为**升序排列**，可以传入`function object`修改

>**`copy()`**：**复制**一个容器内容

#### 2.2动态数组
**①定义**
>**格式**：`vector<数据类型> 动态数组名(元素个数)`，同**C语言数组**采用**下标**访问即可，从`0`开始
{%list%}
不同于数组，动态数组的个数可以为0，也可以不是一个常量
{%endlist%}
{%warning%}
若数据类型为动态数组，则需要注意写法，符号序列总是按照合法序列最长的解释
{%endwarning%}
>如**数据类型**为一**动态数组**，需要**声明**为`vector<vector<int> >`，不能写为`vector<vector<int>>`

**②初始化**
{%list%}
以int类型vector为例
{%endlist%}




**③常用方法**
>**`push_back()`**：在**末端插入**元素

>**`pop_back()`**：**删除**末端元素

#### 2.3字符串
**①定义**
>**格式**：`string [字符串名]`，可以采用**下标访问**其中**字符元素**，从`0`开始
{%list%}
Cpp的string是类，同时Cpp也可以使用传统C语言的字符数组
{%endlist%}
{%warning%}
当采用>>写入一个字符串时，所有空白字符（空格、换行和制表符）会被忽略
{%endwarning%}
>如`cin>>a_string`，若输入的**全是空白字符**，`a_string`为一**空字符串**

**②初始化**
>`string a_string;`：创建一个**空字符串**

>`string a_string1(a_string2);`/`string a_string1 = a_string2;`：**拷贝**初始化
{%list%}
这里的a_string2也可以是一个字符串字面量，编译器将其自动转化为string
{%endlist%}
>`string a_string1(n,'a_char');`：**长度**为`n`，**元素**均为`'a_char'`

**③常用操作**
>**`getline()`**：保留**输入**中的**空白字符**，直到遇到**换行符**，如`getline(cin，a_string)`
{%list%}
该函数会读取换行符，但是不会保留换行符
{%endlist%}
{%right%}
与>>一样，该函数的返回值也表示了流的状态
{%endright%}
>**`+`**：**拼接**字符串，其中还可以进行`string`和**字符串字面量**的拼接，如`s2 = s1+"!"`
{%list%}
注意+两边不能都为字符串常量，也为字符串常量本质上还是字符数组，无法拼接
{%endlist%}
>**`c_str()`**：将`string`实例转化为一个**C风格的字符串**，**返回类型**为`const char *`
{%list%}
Cpp允许字符数组转化为string对象，但是string对象需要通过该函数转化为字符数组
{%endlist%}
>**`cctype`头文件**：继承自**C语言**的`ctype.h`，用与判断**字符类型**，如`isalnum()`判断字符是否为**字母/数字**
{%list%}
Cpp继承了C语言的标准库，但是将对应name.h改写为cname
{%endlist%}


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

iostream迭代器
将对应的流作为一种特殊的元素序列`istream_iterator`,`ostream_iterator`
需要指明该迭代器的类型