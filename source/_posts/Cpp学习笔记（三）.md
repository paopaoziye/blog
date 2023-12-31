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
#### 2.4线性容器
**①栈**
>**定义**：`stack<type> [栈名]`，创建一个**空栈**，如`stack<int> my_stack`

>`pop/push()`：元素**出/入栈**，如`my_stack.push(1)`/`int val = my_stack.pop();`

>`top()`：**访问**栈顶元素，如`int top = my_stack.top();`

**②队列**
>**定义**：`queue<type> [栈名]`，创建一个**空队列**，如`queue<int> my_queue`

>`pop/push()`：元素**出/入队**，如`my_queue.push(1)`/`int val = my_queue.pop();`

>`front()`：访问**队首元素**，如`int front = my_queue.front();`

**③双向队列**
>**定义**：`deque<type> [双向队列名]`，创建一个**空双向队列**，如`deuqe<int> my_deque`

>`push_back/push_front()`：将元素**添加**至**队尾/队首**，如`my_deque.push_back(1)`

>`pop_back/pop_front()`：将**队尾/队首**元素**弹出**，如`my_deque.pop_back(1)`

>`front/back()`：**访问队首/尾**元素，如`int front = my_deque.front();`


