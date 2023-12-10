---
title: Cpp学习笔记（二）
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
  - 《C++primer》
  - C++
categories: 编程语言
keywords: 文章关键词
updated: ''
img: /medias/featureimages/11.webp
date:
summary: 面向对象编程
---
# Cpp学习笔记
## Cpp学习笔记（二）
### 1.泛型编程
#### 1.1引言
>**概述**：构建一个可以处理**多种容器**以及**多种数据类型**的函数
{%right%}
以下为一非泛型查找函数，只能处理整型数组，将其改造为一个泛型算法
{%endright%}
**①改造前**
```
int* find(const int* array,int value,int size)
{
  for(int ix = 0;ix < size;++ix)
      if(array[ix] == value)
          return &array[ix];
  return 0;
}
```
**②改造后**
```
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
```
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
#### 1.3泛型指针
**①引言**
>**概述**：**泛型指针**本质上是一个**某个类的friend类**，对多种**操作符**进行**重载**，**性质和用法**类似于**指针**
{%list%}
如下为一个数列类以及其泛型指针
{%endlist%}
{%right%}
使用typedef关键字将iterator_to_special_vector改为统一的iterator
{%endright%}
```
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
```
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
**②格式**
>`[类名]::iterator [泛型指针名]`：定义了一个**对应类**的泛型指针
{%list%}
每个标准容器都有对应的泛型指针类，且都统一为iterator，需要使用[类名]::限定，并定义了取得泛型指针的函数
{%endlist%}
>`begin()`：返回指向该容器对象**第一个元素**的`iterator`，如`my_vec.begin()`

>`end()`：返回指向该容器对象**最后一个元素下一个位置**的`iterator`，如`my_vec.end()`
{%right%}
使用模板，使得函数既能接收指针，也能接收泛型指针
{%endright%}
```
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
#### 1.4function object
**①引言**
>**概述**：本质上是提供**function call操作符**`()`**重载函数**的类的**实例对象**
{%list%}
遇到lt()时，若lt为一function object（还可能为函数名和函数指针），编译器会将lt(val)转换为lt.operator(val)
{%endlist%}
```C++
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
>**概述**：本质上是**标准库**的**模板类**，使用对应容器需要包含**对应头文件**

**②统一接口**
{%list%}
每个容器都有以下接口的实现
{%endlist%}
>`empty()`：判断容器**是否为空**，是则返回`ture`，反之`false`

>`size()`：返回容器的**元素个数**

>`clear()`：**清除**容器**所有元素**

>`insert()/erase()`：**插入/删除**元素

**③泛型算法**
{%list%}
需要包含functional头文件
{%endlist%}
>`find()/binary_search()`：**线性/二分**查找对应元素

>`count()`：返回与数值相符的**元素数目**

>`search()`：查找**子序列**，返回其**起始位置的泛型指针**

>`sort()`：**排序**，**缺省情况**下为**升序排列**，可以传入`function object`修改

>`copy()`：**复制**一个容器内容

#### 2.2动态数组
**①定义**
>**格式**：`vector<数据类型> 动态数组名(元素个数)`
{%list%}
不同于数组，动态数组的个数可以为0，也可以不是一个常量
{%endlist%}
{%warning%}
若数据类型为动态数组，需要声明为vector<vector<int> >，不能写为vector<vector<int>>，因为符号序列总是按照合法序列最长的解释
{%endwarning%}


>**访问**：同**C语言数组**采用**下标**访问即可，从`0`开始

**②初始化**
{%list%}
以int类型vector为例
{%endlist%}
>`vector<int> my_vec`：构建一个**空的**`vector`

>`vector<int> my_vec(10)`：`vector`**元素个数**为`10`，且**所有元素**被**初始化**为`0`

>`vector<int> my_vec(10，10)`：`vector`**元素个数**为`10`，且**所有元素**被**初始化**为`10`

>`vector<int> my_vec(first，last)`：使用**一对泛型指针/指针**给其赋值
{%right%}
常常使用数组对其进行复制，如vector<int> my_vec(nums，nums+num_size)
{%endright%}
>`vector<int> my_vec(my_vec2)`/`vector<int> my_vec = my_vec2`：**复制一份**传入的动态数组
{%list%}
同样还可以通过my_vec == my_vec2/my_vec != my_vec2判断两者是否相同
{%endlist%}
**③常用方法**
>`push_back()`：在**末端插入**元素

>`pop_back()`：**删除**末端元素

***

### 3.异常处理
#### 3.1引言
>**概述**：

#### 3.1抛出异常




