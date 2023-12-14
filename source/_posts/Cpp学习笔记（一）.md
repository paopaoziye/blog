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
# Cpp学习笔记（一）
## Cpp基础编程
{%right%}
Cpp基础部分和C语言大部分一致，只介绍不同的部分
{%endright%}
### 1.变量
#### 1.1引言
**①声明与定义**
>**声明**：使得**变量名**为程序所知，一个程序如果**想使用一个变量**，必须包含其**声明**

>**定义**：创建与**变量名**相关的**实体**，为其申请**存储空间**，还可能会对其**进行初始化**
{%list%}
定义变量即创建了一个对象，对象指拥有某种数据类型的内存空间
{%endlist%}
>**格式**：`[基本数据类型] [声明符]`，其中**数据类型**大部分和C一致，主要多出了`bool`和`long long`类型
{%list%}
变量取名规则与C语言一致，通常对于自定义类采用My_class，自定义变量采用my_value
{%endlist%}
{%right%}
该语句为定义语句，如果想要该语句为声明，则使用extern修饰且不能显式初始化该变量
{%endright%}
{%warning%}
通常情况下，只能定义一次，而可以声明多次
{%endwarning%}
{%wrong%}
在函数体内部初始化一个extern修饰的变量，是错误的
{%endwrong%}
**②赋值和初始化**
>**赋值**：将**旧值**擦去，用一**新值**替代

>**初始化**：对象在**创建时**获得一个**特定的值**，
{%list%}
缺省初始化与C一致，其中类的初始化由其定义者决定
{%endlist%}
{%right%}
Cpp提供多种格式进行初始化
{%endright%}
>以`int`为例，有`int a = 0;`、`int a(0)`、`int a = {0};`和`int a{0}`
{%wrong%}
当使用{}进行初始化时，若存在信息丢失的风险，则编译器会报错，如int a{1.1}
{%endwrong%}
{%warning%}
需要严格区分赋值和初始化，这对于Cpp是十分重要的
{%endwarning%}

**③命名空间**
>**定义**：**每个库**都有其**命名空间**，可以**避免**程序发生**命名冲突**，需要**曝光**或者**解析**才能使用

>**曝光**：`using namespace [命名空间];`，通常会采用`using namespace std;`曝光**标准库**命名空间
{%list%}
曝光一命名空间后，若遇到属于该命名空间的对象，如之后的cout和cin，则默认其属于该命名空间
{%endlist%}
>如之后常用的`cout`和`cin`，为**标准库**定义的对象，若**标准库没有曝光**，则需要写为`std::cout`和`std::cin`
{%list%}
::为作用域运算符
{%endlist%}

>**解析**：`命名空间::变量名`，指明其**所属命名空间**
{%warning%}
当发生命名冲突时，需要解析才能继续执行
{%endwarning%}

#### 1.2复合类型
{%list%}
之前的声明符只有变量名，若添加一定修饰符，则使其变为复合类型，常见的复合类型如下
{%endlist%}
**①指针**
>**格式**：`[数据类型] *[指针名] = &[指向对象]`，如`int* my_p = &a_int`
{%list%}
基本与C语言一致，Cpp常用空指针为nullptr
{%endlist%}
>`void *`：一种**特殊的指针**，可以存放**任意对象**的地址
{%warning%}
由于void *可以存放任意数据类型，导致编译器不知道其指向类型，所以不能直接操作其指向对象
{%endwarning%}

**②引用**
>**格式**：`[数据类型] &[引用名] = [指向对象]`，如`int& my_ref = a_int`
{%list%}
与指针不同，引用并不是一个对象，而是指向对象的别名，对引用的任何操作都相当于直接操作指向对象
{%endlist%}
>`int* my_p = &my_ref`是将**指针**指向`a_int`，`const`修饰也类似
{%warning%}
引用必须被初始化，不能修改，且引用必须指向一个对象，所以无法定义指向引用的引用和指针
{%endwarning%}
{%right%}
传递指针和引用可以降低复制大型对象的负担
{%endright%}
{%wrong%}
对于函数中定义的非静态数据，不能返回其引用和指针
{%endwrong%}
**③指向指针的引用**
>**格式**：`[数据类型] *&[指针名] = [引用对象]`，如`int *&ref_to_ptr = a_ptr`

#### 1.3常量限定符
**①引言**
>**格式**：在**变量定义前**添加`const`修饰符即可，不能对`const`**变量**执行**改变其内容**的操作
{%list%}
在不改变其内容前提下，甚至可以进行类型转化，如const int转化为bool
{%endlist%}
{%warning%}
const对象必须被初始化，且仅仅在文件内有效，所以可以在多个文件中定义
{%endwarning%}
{%right%}
若想要在多个文件之间共享const对象，则其定义需要用extern修饰
{%endright%}
```cpp
//file_1.cc中定义并初始化一个const常量
extern const int buf_size = size_of_buf();

//file_1.h头文件
extern const int buf_size;
```
**②const与引用**
>**概述**：当**一个引用**指向**const对象**时，其必须也**使用**`const`限定符置于其**定义前**
{%list%}
虽不允许非常量引用指向一常量，但允许一常量引用指向一非常量，且常量引用可以指向能转换成引用类型的表达式
{%endlist%}
{%warning%}
若使用一常量引用指向一个非常量对象，该对象还是可以被修改的，只是不能通过引用修改
{%endwarning%}
```cpp
//常量引用指向非常量
int a_int;
const int a_const_int = 384;
const int &a_ref_to_const1 = a_const_int;
const int &a_ref_to_const2 = a_int;
//常量引用指向可转化的表达式
double a_double = 3.14;
int &a_ref = a_double; //错误
const int &a_ref_to_const3 = a_double;//正确
```
**③指针与常量**
>**指向常量的指针**：当**一个指针**指向**const对象**时，其必须也**使用**`const`限定符置于其**定义前**，称为**底层const**
{%list%}
同引用，指向常量的指针也可以接收一个非常量对象的地址，只是不能通过指针修改该对象
{%endlist%}
{%warning%}
指向常量的指针不能赋值给同类型的非指向常量的指针
{%endwarning%}
>**常量指针**：`[数据类型] *const [指针名] = &[指向对象]`，称为**顶层const**
{%list%}
指针常量同一般的const变量一样，需要初始化
{%endlist%}
{%right%}
指针可以同时为顶层和底层const，即const [数据类型] *const [指针名] = &[指向对象]
{%endright%}

**④常量表达式**
>**定义**：**值不会改变**且在**编译过程**就能得到**计算结果**的表达式，如**字面值**
{%list%}
当一个const变量被一个常量表达式初始化，则该变量也是一个常量表达式
{%endlist%}
{%warning%}
两个条件缺一不可，若一个const对象的值为一个普通函数的返回值，即const int a = fun();，a也不是常量表达式
{%endwarning%}
>`constexpr`：置于**变量定义前**，表明该变量是一个**常量**，且必须用**常量表达式初始化**，否则会**编译报错**
{%wrong%}
只有算术类型、指针和引用这种简单类型能被constexpr修饰
{%endwrong%}
{%warning%}
constexpr修饰的指针的初始值必须是nullptr/0，或指向某个处于固定地址的对象，如函数体外的变量以及static变量
{%endwarning%}
```cpp
const int *a_ptr = nullptr;//底层const
constexpr int *a_ptr = nullptr;//顶层const
```
#### 1.4类型指示符
**①类型别名**
>`typedef`：继承于C，置于**变量定义前**，将**变量名**定义为**数据类型的别名**

>`using [新名称] = [数据类型]`：给数据类型赋予**新名称**
{%wrong%}
注意这两种方式和宏定义是不同的，并不是简单的替换，比如以下的rename_to_doubleptr，*已经成为类型的一部分
{%endwrong%}
```cpp
//其中rename_to_double1/2/3都相当于couble，rename_to_doubleptr相当于double*
typedef double rename_to_double;
using rename_to_double3 = rename_to_double2;
typedef rename_to_double rename_to_double2, *rename_to_doubleptr;
//a_doubleptr为一常量指针，而不是指向常量的指针
const rename_to_doubleptr a_doubleptr = nullptr;
```
**②`auto`**
>**概述**：使用`auto`取代变量**类型说明符**，**编译器**自动分析**初始值的类型**并将变量定义为**该类型**，并**将其值赋予变量**
{%list%}
auto变量必须有初始值，通常为一函数的返回值
{%endlist%}
{%warning%}
有些初始值的类型会被编译器改写后再赋予变量
{%endwarning%}
>如接收一个**引用**，编译器会返回**引用指向对象的类型**
{%warning%}
若auto修饰的不是引用，会忽略顶层const，保留底层const，若修饰的是复合类型，则会保留顶层const
{%endwarning%}

```cpp
//a_auto1为一个整数，常量性被忽略，a_auto2为一个指向常量的指针，因为a_auto2为底层const才能接收
const int a_const_int = 0,&ref_to_const_int = a;
auto a_auto1 = a_const_int;
auto a_auto2 = &a_const_int;
//auto与引用
//a_auto_ref1为一引用常量，a_auto_ptr为一指向常量的指针
auto &a_auto_ref1 = a_const_int;
auto &a_auto_ref2 = 42; //错误，不能给非常量引用绑定字面值
auto *a_auto_ptr = &a_const_int;

```
**③`decltype()`**
>**概述**：类似于`auto`，但是**不会**使用**初始值**给变量**赋值**，只是**推断类型**
{%list%}
不同于auto，decltype不会对类型进行改写，也不会忽略其常量性
{%endlist%}
{%warning%}
若decltype()中为表达式，则情况会有所不同，将返回表达式的返回类型
{%endwarning%}
```cpp
//变量名
const int a_const_int = 0,&ref_to_const_int = a;
decltype(a_const_int) x = 0;//其中x为一个整型常量
decltype(ref_to_const_int) y = x;//y为一个整型引用，若不初始化，会报错
//表达式
int i = 384,*a_ptr = &i,&a_ref = i;

decltype((i)) a = i;//a为一个整型引用，若不加()，a为一整型
decltype(*a_ptr) b = i;//b也为一个整型引用，解引用返回的是一个引用
decltype(&a_ref+1) c;//b为一个整型

```






#### 1.5动态内存分配
**①引言**
{%list%}
变量的创建方式，其生命周期不同，以string类为例
{%endlist%}
>`string s1(1,2)`：为**动态变量**，当**作用域结束**后，系统会**自动调用其析构函数**清理

>`static string s1(1,2)`：其**作用域结束**后，不会被清理，直到**程序结束**，系统才会调用其**析构函数**

>`string* s = new string`：这个变量处于**堆**中，需要**及时delete**掉
{%wrong%}
若没有及时释放，当其作用域结束，s指向的区域还存在，但是s本身被释放掉了，就没有机会释放对应内存了
{%endwrong%}
**②`new`**
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

**③`delete`**
>**格式**：`delete [申请的指针]`/`delete [] [申请的指针]`
{%list%}
分别用于释放一个对象/一个数组的内存
{%endlist%}
>**工作原理**：**释放申请的指针**，若其**指向类**，**在此之前**还需要调用**一次/多次**对应类型的**析构函数**
{%right%}
delete[]会取出new[]保存的数组大小，并调用对应次数的析构函数
{%endright%}
{%warning%}
new[]需要和delete[]配套使用，否则可能会造成内存泄漏
{%endwarning%}
### 2.待处理草稿
#### 1.2输入输出
{%list%}
要包含iostream头文件，注意标准库头文件不带后缀
{%endlist%}
**①输出**
>**格式**：`[输出对象]<<内容1<<内容2...<<endl;`，常用的**输出对象**为`cout`

>`cout`：`iostream`类的一个实例，表示**标准输出**，通常连接到**显示屏**
{%list%}
标准库还定义了两个输出对象cerr和clog，分别为标准错误和标准日志，通常连接到显示屏
{%endlist%}

>`<<`：**输出流运算符**，**左侧**必须是一个`ostream`**对象**，**右侧**是**输出的值**，**计算结果**为`ostream`**对象**
{%right%}
如cout<<内容1的计算结果为cout，这也是可以连续输出到cout的原因
{%endright%}
>`endl`：输出一个**换行符**，并**清空输出缓冲区**

**②输入**
>**格式**：`[输入对象]>>容器1...>>容器N;`，常用的**输入对象**为`cin`，输入**文件结束符**表示**输入终止**
{%list%}
在Unix系统中，文件结束符可采用ctrl+D输入，windows系统中则是ctrl+z，再输入enter
{%endlist%}
>`cin`：同`cout`，表示**标准输入**，通常连接到**键盘**
{%list%}
输入对象还可以是一打开的文件
{%endlist%}
>`>>`：**输入流运算符**，和`<<`类似，将**标准输入设备的数据**保存到**右边的容器**中
{%list%}
同理cin>>容器的返回值也是cin，当读入有效数据，cin状态为真，若遇到文件结束符或无效数据，状态为假
{%endlist%}
{%right%}
可以采用cin>>tmp作为判断条件，结合条件语句和循环语句使用
{%endright%}
>如`while(cin>>tmp)`可以读取**多个数据**，直到**终止**或者**读取数据不合理**

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

***




