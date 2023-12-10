---
title: Cpp学习笔记（一）
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
summary: Cpp基础
---
# Cpp学习笔记
## Cpp学习笔记（一）
### 1.Cpp基础编程
{%right%}
Cpp基础部分和C语言大部分一致，只介绍不同的部分
{%endright%}
#### 1.1命名空间
**①定义**
>**概述**：**每个库**都有其**命名空间**，可以**避免**程序发生**命名冲突**，需要**曝光**或者**解析**才能使用

**②曝光**
>`using namespace [命名空间];`：**曝光**命名空间，通常会采用`using namespace std;`曝光**标准库**命名空间
{%list%}
曝光一命名空间后，若遇到属于该命名空间的对象，则默认其属于该命名空间
{%endlist%}
>如之后常用的`cout`和`cin`，为**标准库**定义的对象，若**标准库没有曝光**，则需要写为`std::cout`和`std::cin`

**③解析**
>`命名空间::变量名`：**解析**变量名，指明其**所属命名空间**
{%warning%}
当发生命名冲突时，需要解析才能继续执行
{%endwarning%}
#### 1.2输入输出
{%list%}
要包含iostream头文件
{%endlist%}
**①输出**
>**格式**：`[输出对象]<<内容1<<内容2...<<endl;`，常用的**输出对象**为`cout`

>`cout`：`iostream`类的一个实例，连接到**标准输出设备**，通常是**显示屏**
{%list%}
输出对象还可以是一打开的文件，另一个常见标准输出对象为cerror
{%endlist%}

>`<<`：**输出流运算符**，**左侧**必须是一个`ostream`**对象**，**右侧**是**输出的值**，**计算结果**为`ostream`**对象**
{%right%}
如cout<<内容1的计算结果为cout，这也是可以连续输出到cout的原因
{%endright%}
>`endl`：输出一个**换行符**，并**清空输出缓冲区**

**②输入**
>**格式**：`[输入对象]>>容器1...>>容器N;`，常用的**输入对象**为`cin`

>`cin`：同`cout`，连接到**标准输入设备**，通常是**键盘**
{%list%}
输入对象还可以是一打开的文件
{%endlist%}
>`>>`：**输入流运算符**，和`<<`类似，将**标准输入设备的数据**保存到**右边的容器**中
{%right%}
同理cin>>容器的返回值也是cin，所以cin可以连续输入
{%endright%}
#### 1.3引用和指针
**①引用**
>**格式**：`[数据类型]& [引用名] = [指向对象]`，如`int& my_ref = a_int`
{%list%}
引用相当于指向对象的别名，对引用的任何操作都相当于直接操作指向对象
{%endlist%}
>`int* my_p = &my_ref`是将**指针**指向`a_int`，`const`修饰也类似
{%warning%}
引用必须被初始化（指向一个对象），且不能修改
{%endwarning%}
**②指针**
>**格式**：`[数据类型]& [指针名] = &[指向对象]`，如`int* my_p = &a_int`
{%right%}
传递指针和引用可以降低复制大型对象的负担
{%endright%}
{%wrong%}
对于函数中定义的非静态数据，不能返回其引用和指针
{%endwrong%}
{%warning%}
指针如果不使用可以初始化为空指针（NULL或0），使用前需要检查其是否为空指针
{%endwarning%}
>其中`NULL`是一个`宏`，定义如下
```cpp
#if defined(__cplusplus)
# define NULL 0              // C++中使用0作为NULL的值
#else
# define NULL ((void *)0)    // C中使用((void *)0)作为NULL的值
#endif
```
#### 1.4函数特性
**①默认参数**
>**概述**：**与C语言不同**，C++可以给函数设置**缺省情况**下的**默认参数**
{%list%}
只能在函数定义或者函数声明默认值，但是不能在两个地方都声明，通常放在函数声明处
{%endlist%}
{%warning%}
如果为某一参数设定默认值，则该参数右侧所有参数都需要有默认值
{%endwarning%}

**②inline函数**
>**概述**：在**函数定义之前**添加`inline`关键字即可，通常是一些**简单的函数**
{%list%}
对于`inline`函数，编译器在每个函数调用节点上将其展开为函数代码副本（类似于C语言宏函数）
{%endlist%}
{%right%}
内联函数的定义通常放在头文件中（和普通的函数不同，inline函数可以定义多次）
{%endright%}
{%warning%}
inline函数只是对编译器的一种的请求，编译器不一定会按照inline函数定义处理
{%endwarning%}

**③函数重载**
>**概述**：**参数列表**或**常量性不同**但是**名称相同**的一系列函数，**编译器**根据**调用时**提供的**参数**判断调用哪一个
{%list%}
若传入的参数被const修饰，则调用const版本
{%endlist%}
{%warning%}
不能仅仅依靠返回类型的不同实现函数重载，因为编译器无法根据返回类型判断你想调用那个函数
{%endwarning%}
#### 1.5动态内存分配
**①`new`**
>**格式**：`[数据类型]* [指针名] = new [数据类型]`/`[数据类型]* [指针名] = new [数据类型] [元素数量]`
{%right%}
分别用于申请一个对象/一个数组的内存，后者会多分配四个字节用于保存数组的大小
{%endright%}
>**工作原理**：调用`malloc`**申请内存**，随后**返回指针**
{%list%}
若数据类型为类，需要调用对应类型的缺省构造函数对内存进行初始化
{%endlist%}
>**初始化**：`[数据类型]* [指针名] = new [数据类型](初始化参数列表)`，
{%list%}
若为内置类型，则直接使用参数进行每个对象进行赋值，若为类，则调用对应的构造函数对每个对象进行初始化
{%endlist%}
>如`int* pc = new int(10);`和`String* pc = new String("hello");`

**②`delete`**
>**格式**：`delete [申请的指针]`/`delete [] [申请的指针]`
{%list%}
分别用于释放一个对象/一个数组的内存
{%endlist%}
>**工作原理**：**释放申请的指针**，若其**指向类**，**在此之前**还需要调用**一次/多次**对应类型的**析构函数**，
{%right%}
delete[]会取出new[]保存的数组大小，并调用对应次数的析构函数
{%endright%}
{%warning%}
new[]需要和delete[]配套使用，否则可能会造成内存泄漏
{%endwarning%}

***

### 2.类的基本实现
#### 2.1引言
**①定义**
>**概述**：**类名**相当于自定义的**数据类型**，可以创建对应的**对象实例**，每个类都有其**成员函数**用于操作其**实例**
{%list%}
操作符本质上也是一个函数，类可能会对操作符函数进行重写
{%endlist%}
**②基本框架**
>**概述**：类的实现分为**两部分**，**头文件**给出类的**定义**并**声明**各种函数接口，**程序代码文件**包含这些**函数的具体实现**
{%list%}
类的头文件和程序代码文件名都和类名一致，只是后缀不同，以下为类的头文件框架
{%endlist%}
{%right%}
其中的条件编译指令防止该头文件被多次包含
{%endright%}
```cpp
#ifndef __COMPLEX__
#define __COMPLEX__

//类的前置声明
class [类名]

//类的主体
class [类的名称]{

  friend [函数声明]/[类前置声明]

  public:
      //公共接口，即成员函数的声明或者定义

  private:
      //私有实现，通常是实现该类需要的数据，data member

  protected:
      //通常存放需要继承给子类的数据和函数
}

//inline成员函数定义

#endif
```
**③访问权限**
>`public`：通常存放**成员函数**的**声明**或**定义**，可以在**程序的任何位置**访问
{%right%}
类的实例对象可以通过.操作符访问public成员，其指针通过->访问
{%endright%}
>`private`：通常存放**实现该类**需要的**数据（data member）**，只能被**成员函数**和**friend类**访问
{%warning%}
注意连对象实例在外界不能直接访问其private对象，需要通过特定成员函数获取或者在成员函数内访问
{%endwarning%}
>`protected`：处于该区域的成员能**该类以及被其子类**访问，**外界与父类**不能访问

>`friend`：类可以将**某个类/函数**指定为`friend`，在**类主体**中添加`friend`修饰的**函数声明/类前置声明**即可
{%list%}
指定为friend的函数/类的成员函数与该类成员函数具有相同的访问权限
{%endlist%}
{%warning%}
将函数/类添加为某个类的friend时，在此之前需要有它们的前置声明
{%endwarning%}

#### 2.2类的成员
**①成员函数**
>**声明**：**所有**的**成员函数**都必须在**类的主体内**声明

>**定义**：若定义在**类主体内**，则默认为**inline函数**，若定义在**类主体外**，需要在**函数名前**添加`类名::`指明所属
{%list%}
定义在类主体外的函数，若需要声明为inline函数，则写在头文件中，反之写在程序文件中
{%endlist%}
{%right%}
在成员函数中，this为一个指向调用者的指针，编译器会自动将其添加到参数列表的最左侧
{%endright%}
{%warning%}
在成员函数中的data member，如果不指明其所属，则默认属于调用者
{%endwarning%}

**②构造/析构函数**
>**构造函数**：函数名**和类的名称相同**，且**没有返回类型和返回值**，可以**被重载**
{%list%}
当类的实例被创建，编译器自动调用对应的构造函数，通常用于初始化类的实例
{%endlist%}
{%warning%}
调用没有参数的构造函数，格式为[类名] [实例名];，若写为[类名] [实例名]();会被解读为一个返回对应类的函数
{%endwarning%}

>**析构函数**：函数名为**类的名称前添加`~`**，没有**返回类型和参数**，故**不能重载**
{%list%}
当类的实例结束生命时，编译器自动调用该函数进行一些清理工作，通常为释放类申请的动态内存
{%endlist%}
**③拷贝构造和赋值拷贝**
>**概述**：**缺省**时，**编译器**提供以**某个实例**初始化实例的方法，如`Matrix my_mat1(my_mat2)`和`my_mat1 = my_mat2`
{%list%}
编译器将类的data member一一复制，即将my_mat2的_row、_cal和_pmat赋值给将my_mat1的_row、_cal和_pmat
{%endlist%}
{%warning%}
这种初始化方法并不适用于Matrix类，会导致两个实例的_pmat指向同一个二维数组
{%endwarning%}
{%right%}
可以自定义赋值操作符和接收类实例的构造函数，以覆盖编译器的缺省行为
{%endright%}
{%wrong%}
实现过程中，要检测自我赋值，如下执行m_data = new char[strlen(str.m_data)+1];时m_data已经被释放
{%endwrong%}
```cpp
inline
String::String(const String& str)
{
    m_data = new char[strlen(str.m_data)+1];
    strcpy(m_data,str.m_data);
}
```
```cpp
inline 
String& String::operator=(const String& str)
{
    if(this == &str) //检测自我赋值
        return *this;

    delete[] m_data;
    m_data = new char[strlen(str.m_data)+1];
    strcpy(m_data,str.m_data);
    return *this;
}
```
**④成员初始化列表**
>**概述**：**构造函数**的一种**特殊语法**，紧跟在**参数列表后面**，用于**初始化data member**
{%list%}
每个列表项由一data member组成，后跟由一对小括号包围的欲赋值给data member的数值，使用逗号隔开
{%endlist%}
{%right%}
若data member为某类的实例，采用成员初始化列表对其进行初始化而不是再构造函数内进行赋值
{%endright%}
>**成员初始化列表**会调用该类的**copy构造函数**对其进行**初始化**

>**构造函数内**的初始化，会**先调用**该类的**缺省构造函数**，再调用**该类的赋值运算符函数**
```cpp
Matrix::Matrix(int row,int col)
:_row(row),_col(col)
{
  _pmat = new double(row*col);
}
```

**⑤可变与不变**
>**概述**：如果一个**成员函数**接收一个`const`**参数**，则其**声明和定义**处都需要添加`const`**关键词**声明
{%list%}
const关键词紧跟在函数的参数列表后，编译器会检查声明为const的函数是否会改变类对象的data member
{%endlist%}
{%warning%}
const成员函数如果返回的是data member的引用，则返回类型也需要被const修饰
{%endwarning%}
{%right%}
可以提供一个函数的const版本和非const版本，若传入的是const对象，则调用const版本，反之调用非const版本
{%endright%}
```cpp
const int& row() const {return _row}
int& row() {return _row}
```
>`mutable`：用以修饰**data member**，表示修改该**data member**不会影响**对象实例**的**常量性**
{%list%}
一个被声明为const的成员函数可以修改以mutable修饰的data member
{%endlist%}
**⑥静态成员**
>**静态data member**：当**data member**被`static`修饰，其成为**唯一的共享数据**，**所有该类实例对象**都可以访问
{%list%}
需要在程序文件中提供该data member的定义，并且名称前面需要添加[类名]::指明其所属
{%endlist%}
>**静态成员函数**：当一个成员函数**不访问**任何**非静态data member**，可以在**函数声明前**添加`static`关键词
{%list%}
静态成员函数不需要依赖类的对象实例调用，只需要在其前面添加[类名]::即可调用
{%endlist%}
#### 2.3操作符重载
**①定义**
>**概述**：重新定义**操作符函数**，**函数名称**为`operator[操作符]`
{%list%}
不能修改操作符函数的操作数和优先级，除了.、.*、::、?:，其余操作符均可被重载
{%endlist%}
{%right%}
若为二元操作符，操作符的左操作数作为第一个参数传递给操作符函数，右操作数作为第二参数传递给操作符函数
{%endright%}
{%warning%}
参数列表必须至少有一个class类型参数
{%endwarning%}
**②成员/非成员函数**
>**概述**：**操作符重载函数**可以为一**成员函数**，也可为一**非成员函数**
{%list%}
若为成员函数，其第一个参数为*this指针，表示其左操作数一定是所属类，而非成员函数可以随意设置顺序
{%endlist%}
```cpp
//成员函数版本定义
inline int iterator_to_special_vector::
operator*() const
{
  return special_vector::_elem[_index]
}

//非成员函数版本定义 需要将其声明为对应类的friend，该函数才能访问_elem和_index
inline int
operator*(const  special_vector&) const
{
  return special_vector::_elem[_index]
}
```

**③前/后置版本**
>**概述**：有些运算符还分为**前置版本**和**后置版本**，如**递增/减**运算符，规定**后置版本**的参数列表多出一个`int`**参数**
{%list%}
编译器会自动传递0给后置版本操作符函数的int参数
{%endlist%}
```cpp
//前置版本
inline my_iterator& myiterator::
operator++(){
  //具体实现
}

//后置版本
inline my_iterator& myiterator::
operator++(int){
  //具体实现
}
```
**④iostream运算符重载**
>**概述**：`>>`**运算符**的实现较为复杂，还需要判断**读取数据**是否有问题，这里不考虑这些问题
{%list%}
ostream对象不能声明为const，因为每次输出都会改变该对象状态
{%endlist%}
{%warning%}
<<运算符重载函数不能为一个成员函数，否则类必须要放在<<左边
{%endwarning%}
```cpp
ostream& operator<< (ostream& os,const special_vec& vec)
{
  os<<"("<<vec._begin_pos<<","<<vec._len<<")";
  for(int i = 0;i<vec._len;i++){
    os<<vec._elems[i];
  }
  os<<endl;
  return os;
}
istream&
operator>>(istream &is,special_vector &vec)
{
  char ch1,ch2;
  int bp,len;
  is>>ch1>>bp>>ch2>>len;

  vec._begin_pos = bp;
  vec._len = len;

  return is;
}
```
***
### 3.面向对象的编程风格
#### 3.1引言
**①三大特性**
>**封装**：将**实现细节**部分**包装**、**隐藏**起来，也就是**上述的类**

>**继承**：将一系列**相关的类**通过**父子关系**联系到一起，**父类**定义了**子类**的**通用接口和数据**
{%list%}
如图书馆作为一个类，其子类有书，书又有其子类纸质书和电子书
{%endlist%}
>**多态**：每个子类都可以**增加自己的接口和数据**，或者**覆盖继承而来的接口和数据**，以实现**自己的行为**
{%list%}
若子类和父类中成员若一致，则子类成员会覆盖掉从父类继承的成员
{%endlist%}
{%warning%}
若要覆盖继承的成员函数，则子类中对应函数的参数列表、返回类型和常量性必须与之一致
{%endwarning%}
>若需要在**子类成员函数**调用**被覆盖的父类函数**，则需要使用`[父类名]::`对其加以限定

**②抽象基类**
>**概述**：继承关系呈现**树型**，处于**根节点**的类称为**抽象基类**
{%list%}
基类的指针或者引用可以指向任何一个子类的对象
{%endlist%}
{%right%}
使用抽象基类的指针或引用间接操作子类的对象实例，从而在不改变旧有程序的前提下，新增/删除子类
{%endright%}
>如下，函数的**形参**为**抽象基类**，但是**实际调用**时可以传递**任何子类**
```cpp
void loan_check_in (Lib& my_Lib){
  my_Lib.check_in();
  //程序具体实现
}
```
**③动态绑定**
>**概述**：如上，`my_Lib.check_in()`到**执行时**才根据**实际传入的对象类型**调用对应的函数`check_in()`
{%list%}
只有虚函数才具有动态绑定的特性，普通函数在编译时就根据my_Lib类型确定执行哪个check_in()
{%endlist%}
{%warning%}
若调用的函数不为虚函数，即使传入的是其他子类实例，还是调用对应父类的成员函数
{%endwarning%}
{%right%}
可以明确指出该函数属于那一类，调用时添加[类名]::前缀即可，以遮掩虚函数机制
{%endright%}
{%wrong%}
在父类的构造函数和析构函数中，不会调用子类的虚函数，因为此时派生类可能还没有初始化好
{%endwrong%}
#### 3.2实现
**①框架**
>**概述**：定义了**父类**`Lib`和**子类**`Book`，其中**子类的前置声明后**接`:[继承类型][父类名]`，表示其**继承自某类**
{%list%}
子类的头文件需要包含父类的头文件，继承方式有多种，这里只介绍public继承
{%endlist%}
```cpp
class Lib{
  public:

  Lib(){cout<<"Create a Lib class!"<<endl;}

  virtual ~Lib(){cout<<"Release a Lib class!"<<endl;}
  //Lib类的print函数
  virtual void print() const{
    cout<<"I am a Lib class!"<<endl;
  }

  private:
}
```
```cpp
#include "Lib.h"
class Book:public Lib{
  public:

  Book(const string& author,const string& title)
  :_title(title),_author(author)
  {cout<<"Create a Book class!"<<endl;}

  virtual ~Book(){cout<<"Release a Book class!"<<endl;}
  //Book类的print函数，覆盖了从父类继承来的print()
  virtual void print() const{
    cout<<"I am a Book class!"<<endl;
    cout<<"My title is"<<_title<<"!"endl;
    cout<<"My author is"<<_author<<"!"endl;
  }

  protected:
  string _title,_author;
}
```
**②虚函数**
>`virtual`：修饰一个**成员函数**使其成为**虚函数**，从而实现**动态绑定**，若其被**赋值**为`0`，则为**纯虚函数**
{%list%}
若不同子类对某函数有不同的实现，则将其声明虚函数，静态成员函数无法被声明为虚函数
{%endlist%}
{%right%}
子类若覆盖从父类继承的虚函数，不必添加virtual关键字修饰，其自动成为虚函数
{%endright%}
{%warning%}
若父类中有虚函数，则其析构函数也需要被声明为虚函数
{%endwarning%}
{%wrong%}
成员函数中有纯虚函数的类无法创建对象实例，因为其接口不完整
{%endwrong%}

**③构造与析构**
>**构造**：当一个**子类**被定义，**首先**会**自顶向下**调用其**父类**的构造函数，随后再调用**本身**构造函数
{%list%}
即定义子类实例时，不仅仅创建了子类对象，还递归的创建了其所有父类对象
{%endlist%}
{%warning%}
若基类中有data member，则最好在其构造函数中将其初始化，即子类的构造函数还需要调用基类的构造函数
{%endwarning%}
>若没有**显式调用**，则编译器会**自动**调用父类的**缺省构造函数**
```cpp
inline Book::
Book(string& title,string& author)
:Lib(),_title(title),_author(author)
{}
```
>**析构**：当一个**子类**生命周期中介，**首先**调用**本身析构函数**，随后再**自底向上**调用其**父类的析构函数**

**④运行时类型鉴定**
{%list%}
需要包含typeinfo头文件
{%endlist%}
>`typeid()`：接收一个**类实例/类名**，如`typeid(*this)`，返回一个`type_info`**对象**，包含了该实例的**类相关信息**

>`name()`：返回`type_info`**对象**中的**名字信息**，如`typeid(*this).name()`

>`static_cast<class_type>()`：接收**一个指针**，强制将其转化为**指向`class_type`的指针**

>`dynamic_cast<class_type>()`：接收**一个指针**，若其指向`class_type`，则将其转化为**指向`class_type`的指针**
{%list%}
若使用指针调用成员函数，则其为指向什么类的指针，就只能调用对应类的成员函数，即使有虚函数机制
{%endlist%}
>如下，`p_to_lib`为`Lib*`类的指针，虽然指向`Book`**实例**，但是还是**只能调用**`Lib`类的**成员函数**
```cpp
Book a_book;
Lib* p_to_lib = &a_book;
```
#### 3.3模板类
**①模板template**
>**格式**：在**类前**添加`template`**参数列表**，其中`typename`为**关键字**，后接一**占位符**，可以有**多对**，用**逗号**隔开
{%list%}
该占位符相当于参数类型，可以出现在任何参数类型可以出现的地方，编译器将占位符替换为创建类时传递的参数
{%endlist%}
>**调用**：在**类名后**接`<[类型参数]>`传递**类型参数**，如`Node_to_tree<int> root;`，会将`val_type`**全部替换**为`int`
{%warning%}
除了在类主体以及其成员函数定义中，其他地方调用该类都需要使用template参数列表加以限制
{%endwarning%}
**②例子**
>**概述**：利用**模板**实现**节点类**和一个**二叉树类**，两者互为`firend`
{%list%}
其中二叉树类是节点类的friend，因为其要访问节点类的数据
{%endlist%}
{%warning%}
注意两者的friend声明，都必须以template参数列表加以限制，且列表中采用的是本身的占位符
{%endwarning%}
```cpp
//二叉树类的前置声明
template<typename Node_type>
class Binary_tree;
//节点类的定义
template<typename val_type>
class Node_to_tree{
  friend class Binary_tree<val_type>
  public:

  private:
  val_type _val;
  int _cnt;
  Node_to_tree* _lchild;
  Node_to_tree* _rchild;
}
```
```cpp
//二叉树类的定义
template<typename Node_type>
class Binary_tree{
  public:
  Binary_tree();
  Binary_tree(const Binary_tree&);
  ~Binary_tree();
  Binary_tree& operator=(const Binary_tree&);


  private:
  Node_to_tree<Node_type>* _root;
  void copy(Node_to_tree<Node_type>* tar,Node_to_tree<Node_type>* src);
}
```
**③成员函数定义**
>**概述**：与**普通类**不同，**开头**需要添加`template`**参数列表**，且**类限定符**也需要`template`**列表**加以限定
{%list%}
在类限定符，即Binary_tree<Node_type>::后的语句，都视为定义在Binary_tree类中
{%endlist%}
```cpp
template<typename Node_type>
inline Binary_tree<Node_type>::
Binary_tree():_root(0)
{}
```


**②类的创建**
>`String s1(1,2)为stack object`：当其**作用域结束**后，系统会**自动调用其析构函数**清理

>`static String s1(1,2)`：其作用域结束后，不会被清理，直到**程序结束**，系统才会调用其析构函数

>`String* s = new String`：这个变量处于**堆**中，需要**及时delete**掉
{%wrong%}
若没有及时释放，当其作用域结束，s指向的区域还存在，但是s本身被释放掉了，就没有机会释放对应内存了
{%endwrong%}
