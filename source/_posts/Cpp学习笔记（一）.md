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
  - 《C++ primer》
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
### 1.变量与语句
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

>**初始化**：对象在**创建时**获得一个**特定的值**
{%list%}
缺省初始化与C一致，其中类的初始化由其定义者决定
{%endlist%}
{%right%}
Cpp提供多种格式进行初始化，以int为例
{%endright%}
>`int a = 0;`、`int a = {0};`、`int a(0)`和`int a{0}`，前两个为**赋值初始化**，后两个为**直接初始化**
{%list%}
对于类，直接初始化的符号不同，含义也不同，其中()表示构造函数初始化，{}表示优先采用列表初始化
{%endlist%}
{%warning%}
若{}中的参数不能进行列表初始化，则会用参数调用构造函数
{%endwarning%}
```cpp
vector<string> {"a","b","c"}; //正常
vector<string> {10，"a"}; //退化为vector<string> (10，"a");
```
{%wrong%}
当使用{}进行初始化时，若存在信息丢失的风险，则编译器会报错，如int a{1.1}
{%endwrong%}

**③命名空间**
>**定义**：**每个库**都有其**命名空间**，可以**避免**程序发生**命名冲突**，需要**曝光**或者**解析**才能使用

>**曝光**：`using namespace [命名空间];`，通常会采用`using namespace std;`曝光**标准库**命名空间
{%list%}
曝光一命名空间后，若遇到属于该命名空间的对象，如之后的cout和cin，则默认其属于该命名空间
{%endlist%}
>如之后常用的`cout`和`cin`，为**标准库**定义的对象，若**标准库没有曝光**，则需要写为`std::cout`和`std::cin`
{%list%}
::为作用域运算符，提示编译器从左侧名字中寻找右侧对象
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
引用必须被初始化，不能修改，且引用必须指向一个对象，所以无法定义指向引用、引用和指针和引用类型的容器
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
>**常量引用**：当**一个引用**指向**const对象**时，其必须也**使用**`const`限定符置于其**定义前**
{%list%}
虽不允许非常量引用指向一常量/常量引用，但允许一常量引用指向一非常量
{%endlist%}
{%right%}
常量引用可以指向能转换成引用类型的变量、表达式和字面值，而普通引用只能指向一个对象
{%endright%}
>当**常量引用**指向一**字面值/表达式**时，将其存储到一个**引用类型**的**临时变量**，并将该**常量引用**指向它
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
>**常量指针**：当**一个指针**指向**const对象**时，其必须也**使用**`const`限定符置于其**定义前**，称为**底层const**
{%list%}
同引用，常量指针也可以接收一个非常量对象的地址，只是不能通过指针修改该对象
{%endlist%}
{%warning%}
常量指针不能赋值给同类型的指向非常量的指针
{%endwarning%}
>**指针常量**：`[数据类型] *const [指针名] = &[指向对象]`，称为**顶层const**
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
constexpr修饰的指针的初始值必须是nullptr/0，或指向某个处于固定地址的对象，如函数体外的变量/static变量
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
注意这两种方式和宏是不同的，并不是简单的替换，比如以下的rename_to_doubleptr，*已经成为类型的一部分
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
>**概述**：使用`auto`取代变量**类型说明符**，**编译器**自动分析**初始值的类型**并将其定义为**该类型**，并**将其值赋予变量**
{%list%}
auto变量必须有初始值，通常为一函数的返回值，不允许使用auto作为数组的数据类型
{%endlist%}
{%right%}
有些初始值的类型会被编译器改写后再赋予变量
{%endright%}
>如接收一个**引用**，编译器会返回**引用指向对象的类型**，如接收一个**内置数组名**，会返回其 **元素类型指针**
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
{%wrong%}
auto关键字不能用于内置数组
{%endwrong%}
**③`decltype()`**
>**概述**：类似于`auto`，但是**不会**使用**初始值**给变量**赋值**，只是**推断类型**
{%list%}
不同于auto，decltype不会对类型进行改写，也不会忽略其顶层const
{%endlist%}
>如接收一个**引用/数组名**，返回的是**引用/数组类型**
{%warning%}
若decltype()中为表达式，若该表达式返回的为一左值，则类型为返回类型的引用，若为右值，则返回类型
{%endwarning%}
```cpp
//变量名
const int a_const_int = 0,&ref_to_const_int = a;
decltype(a_const_int) x = 0;//其中x为一个整型常量
decltype(ref_to_const_int) y = x;//y为一个整型引用，若不初始化，会报错
//表达式
int i = 384,*a_ptr = &i,&a_ref = i;
decltype((i)) a = i;//a为一个整型引用，(i)也为一个表达式
decltype(*a_ptr) b = i;//*a_ptr为左值，b为一个整型引用
decltype(&a_ref+1) c;//&a_ref+1为右值，c为一个整型指针
```
**④类型转换**
>**隐式转换**：和**C语言**基本一致，注意`bool`**类型**和**其他类型**的相互转换即可
{%list%}
bool类型转化为整型值，true为1，false为0，整型转化为bool，非零转化为true，零转化为false
{%endlist%}
{%warning%}
还有一些类自定义的类型转换，如字符数组可以转化为string
{%endwarning%}
>**`static_cast<type>()`**：只要对象**不包含底层`const`**，**且合理的情况**下，就可以将其**转化为`type`类型**
{%list%}
常常用于转换void指针
{%endlist%}
```cpp
double a_double;
void *a_void_ptr = &a_double;
double *a_double_ptr = static_cast<double *>(a_void_ptr);
```
>**`const_cast<type>()`**：只能修改对象的**底层const属性**
{%list%}
常常用于函数重载中
{%endlist%}
```cpp
const char *p = a_char_nums;
char *no_const_p = static_cast<char *>(p);//错误，只有const_cast能修改底层const
char *no_const_p = const_cast<char *>(p); //在该表达式中去除了p的底层const并赋予no_const_p
//将一个常量字符数组转化为string，没有修改其内容，不破坏其常量性
string a_string = static_cast<string>(p); 
```

>**`reinterpret_cast<type>()`**：**强制**转换类型，**无论其是否合理**
{%warning%}
这种显示转换是十分危险的，如下，虽然是合法的，但是a_ptr_to_char本质上还是指向一个整型
{%endwarning%}
```cpp
int *a_ptr_to_int = &a_int;
char *a_ptr_to_char = reinterpret_cast<char *>(a_ptr_to_int)；
```

#### 1.5语句
{%right%}
大部分基本与C语言一致，简单介绍一些Cpp专属的特性
{%endright%}
**①引言**
>**概述**：由**运算对象**和**操作符**组成，返回一个**结果**，**运算对象**有**变量**和**字面值**

>**左/右值**：继承自**C语言**，**左值**可以出现在**赋值语句**的**右边和左边**，**右值**只能在**赋值语句**的**右边**
{%warning%}
Cpp中，左值和右值还会影响一些关键字获得的结果，如decltype关键字
{%endwarning%}

**②操作符**
>`sizeof()`：当计算**一个类类型**所占字节数时，只会返回其**固定部分的大小**
{%list%}
如vector，sizeof()并不会因为数组大小不同返回不同的结果
{%endlist%}
{%right%}
其余特性，如优先级、结合性和求值顺序也和C语言一致
{%endright%}
>`%`：`m%-n`相当于`m%n`，`-m%n`相当于`-(m%n)`

**③基于范围的for语句**
>**概述**：格式如下，**每次迭代**，变量被**初始化**为容器的**下一个元素值**
{%list%}
循环中的变量只是容器元素值的一个副本，如果需要修改元素，可以将变量定义为引用类型
{%endlist%}
{%right%}
常常将变量定义为auto类型
{%endright%}
{%warning%}
循环语句不能改变所遍历序列大小
{%endwarning%}
```cpp
for(数据类型 变量名 : 容器){
  statement;
}
```


### 2输入输出
#### 2.1引言
**①I/O类**
>**分类**：`iostream`**头文件**中定义了**读写流基本类型**，并通过**继承机制**，定义了**打开文件**和`string`的**读写流类**
{%list%}
分别定义在iostream、fstream、sstream头文件中，为了支持宽字符，其版本的类型和函数多出一个w前缀
{%endlist%}
>如`iostream`**头文件**中的`istream`和`wistream`都是用于从流中**读取数据**，后者是**宽字符版本**的
{%warning%}
I/O对象是不能拷贝的，一般以引用的方式传递和返回流对象，读写一个I/O流会改变其状态，不能以const修饰
{%endwarning%}
**②条件状态**
>**概述**：`I/O`操作的**特性**导致其容易**发生错误**，一个流一旦发生错误，则**后续的I/O操作**都将**失效**
{%list%}
当写入的数据类型不匹配，或者读取到了文件结束标识，流会进入错误状态
{%endlist%}
{%right%}
每次使用一个流前，都需要检查其是否有效，最简单的办法就是将其当作条件使用，如while(cin>>word)
{%endright%}
{%warning%}
将一个流当作条件只能判别其是否有效，如果想要了解其错误类型，检查其标志位，详细见《C++ primer》p280
{%endwarning%}
**③缓冲**
>**概述**：每个**输出流**都管理一个**缓冲区**，用于保存**程序的输出**，只有当**缓冲区刷新**，才会**打印**
{%list%}
当程序结束、缓冲区满、输出流关联的流读写时，缓冲区会进行刷新，同时也可以通过操作符进行控制
{%endlist%}
>**`endl/ends/flush`**：**换行/插入空字符/不做操作**，随后**刷新**缓冲区

>**`unitbuf`**：**每次输出**都进行`flush`操作，可以使用`nounitbuf`**重置**该状态
{%right%}
缓冲区将多个输出操作组合为单一的系统级写操作，提升了性能
{%endright%}
{%warning%}
若程序异常终止，缓冲区不会被刷新，所以调试信息需要及时刷新
{%endwarning%}

**④流的关联**
>**概述**：当一个**输入流**关联到一个**输出流**，任何**从输入流读取数据**的操作**先刷新输出流**
{%list%}
标准库将cin和cerr都关联到cout，可以将输入流/输出流关联到输出流上，但是只有输出流能被关联
{%endlist%}
{%warning%}
每个流最多关联到一个流，但是一个输出流可以被多个流关联
{%endwarning%}
>**`tie()`**：接收一个**输出流的指针/不接受参数**，将其**关联**到**对应输出流**，返回**之前关联**的输出流的指针
```cpp
ostream *old_tie;
//old_tie的值都为cout，后者导致每次读取cin，cerr都会被刷新
old_tie = cin.tie();
old_tie = cin.tie(&cerr);
```
#### 2.2基本输入输出
**①输出**
>**格式**：`[输出对象]<<内容1<<内容2...<<endl;`，常用的**输出对象**为`cout`

>`cout`：`ostream`类的一个实例，表示**标准输出**，通常连接到**显示屏**
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
>`cin`：`istream`类的一个实例，表示**标准输入**，通常连接到**键盘**

>`>>`：**输入流运算符**，和`<<`类似，将**标准输入设备的数据**保存到**右边的容器**中
{%list%}
同理cin>>容器的返回值也是cin，当读入有效数据，cin状态为真，若遇到文件结束符或无效数据，状态为假
{%endlist%}
{%right%}
可以采用cin>>tmp作为判断条件，结合条件语句和循环语句使用
{%endright%}
>如`while(cin>>tmp)`可以读取**多个数据**，直到**终止**或者**读取数据不合理**

#### 2.3文件输入输出
**①引言**
>**分类**：可分为`ifstream`、`ofstream`和`fstream`，分别用于**写入**、**读取**和**读写**文件
{%list%}
三类对象实例的使用方法类似于cin和cout（继承关系），除此之外还可以采用getline读取文件数据
{%endlist%}
**②特有操作**
>`fstream a_fstr/fstream a_fstr(s)/fstream a_fstr(s,mode)`：创建一个`fstream`对象，可以指定**打开文件**和**模式**
{%list%}
s为文件名，可以为string类型和字符数组，这些构造函数都是explicit的
{%endlist%}
>`open(s)`：**打开文件**并将其与`fstream`对象绑定，返回`void`
{%list%}
调用open()后，需要检查其是否成功，将调用对象当作条件即可
{%endlist%}
{%warning%}
对一个已经打开的文件流调用open会失败，首先需要关闭其绑定的文件
{%endwarning%}
>`close()`：**关闭**与`fstream`对象绑定的文件，返回`void`
{%list%}
当一个fstream对象被销毁时，close()会被自动调用
{%endlist%}
**③文件模式**
>`in/out`：以**读/写方式**打开
{%list%}
缺省情况下，istream以in模式打开，ostream以out模式打开，fstream以in和out模式打开
{%endlist%}
{%right%}
out模式同时设置了trunc模式，除非同时指定了in/app模式
{%endright%}
{%warning%}
其中istream只能设定in模式，ostream只能设定out模式
{%endwarning%}
>`app/ate`：**每次写操作前**/**打开文件后**定位到**文件末尾**
{%list%}
当对象没有被设置为trunc，就可以设置为app模式，当一个对象被设置为app时，也总是被设置为out模式
{%endlist%}
{%right%}
可以对一个文件流对象设置多个不冲突的模式，使用|连接
{%endright%}
>`trunc`：**清空**文件**原有内容**
{%list%}
只有out模式的对象才能被设置为trunc
{%endlist%}
>`binary`：以**二进制**方式进行`I/O`

#### 2.4string流
**①引言**
>**分类**：可分为`istringstream`、`ostringstream`和`stringstream`，分别用于**写入**、**读取**和**读写**`string`对象
{%list%}
类似地，使用方法同cin和cout（继承关系）
{%endlist%}
**②专有操作**
>`sstream a_str/sstream a_str(s)`：创建一个`sstream`对象，其中`s`为一个`string`对象
{%list%}
若将其绑定到一个string对象，sstream对象保存其拷贝
{%endlist%}
{%warning%}
sstream a_str(s)是explicit的
{%endwarning%}
>`str()`：返回`sstream`对象保存的`string`对象的**拷贝**

>`str(s)`：将`s`**拷贝**到`sstream`对象中，返回`void`

**③使用方法**
>`istringstream`：将一个由**多个单词**组成的`string`对象**绑定**到`istringstream`对象，每次读取**一个单词**
{%list%}
当istringstream对象输入时，每次遇到空格便会停下，当数据读取完毕后便会触发“文件结束”信号
{%endlist%}
```cpp
//最后a_char_vec为{'a','b','c','d','e'}
string a_str = "a b c d e";
istringstream record(a_str);
string a_word; 
vector<string> a_char_vec;
while(record>>a_word){
  a_char_vec.push_back(a_word);
}
```
>`ostringstream`：可以用于**逐步构造**`string`对象
{%list%}
在ostringstream对象中逐步构造，再使用str()读取即可
{%endlist%}
```cpp
//如果分别键入a、b、c、d、e，则a_str为"a b c d e"
string word,a_str;
ostringstream output;
while(cin>>word){
  output<<word<<' ';
}
a_str = output.str();
```
### 3.函数
#### 3.1函数基础
**①引言**
{%list%}
Cpp的函数与C语言基本一致，在C语言基础上新添了许多特性
{%endlist%}
>**返回类型**：若返回类型为**引用**，函数调用**结果**为**左值**，其余一律为为**右值**
{%right%}
当函数调用结果为左值，就可以连续调用函数，如size_t = string().size()
{%endright%}
>**`return`语句**：以返回一个**花括号包裹的初始值列表**，用于**初始化**函数调用**结果**
{%warning%}
如果返回类型为内置类型，则其中只能包含一个值
{%endwarning%}

>**尾置类型返回**：`auto 函数名(形参列表) -> 返回类型`
{%right%}
适用于返回类型较为复杂的函数，当然也可以使用别名简化返回类型
{%endright%}
>**函数指针**：除了**C语言的格式**外，还可以使用`decltype(函数名) *函数指针名`
{%warning%}
decltype(函数名)返回的是该函数的类型，所以还需要加上*符号
{%endwarning%}
>**函数类型**由其**返回类型**和**参数列表**决定，格式为`返回类型 (参数列表)`


**②默认参数**
>**概述**：**与C语言不同**，C++可以给函数设置**缺省情况**下的**默认参数**
{%list%}
只能在函数定义或者函数声明默认值，但是不能在两个地方都声明，通常放在函数声明处
{%endlist%}
{%warning%}
如果为某一参数设定默认值，则该参数右侧所有参数都需要有默认值，局部变量不能作为默认实参
{%endwarning%}
{%right%}
若使用全局变量作为默认实参，可以在内层作用域修改该变量从而修改默认实参
{%endright%}
>若在**内层作用域**定义与**作为默认实参的全局变量**，则只是**覆盖**该变量，并**没有修改**对应默认实参
{%wrong%}
在给定作用域中，一个形参只能被赋予一次默认实参
{%endwrong%}
```cpp
/*某头文件中*/
int a_val = 10;
void fun(int a = a_val,int b);
//错误，因为二次赋予默认实参
void fun(int a = 12,int b);
//正确，可以添加默认实参
void fun(int a = a_val,int b = 10);
```
**③inline函数**
>**概述**：在**函数定义之前**添加`inline`关键字即可，通常是一些**简单的函数**
{%list%}
对于inline函数，编译器在每个函数调用节点上将其展开为函数代码副本（类似于C语言宏函数）
{%endlist%}
{%right%}
内联函数的定义通常放在头文件中（和普通的函数不同，inline函数可以定义多次）
{%endright%}
{%warning%}
inline函数只是对编译器的一种的请求，编译器不一定会按照inline函数定义处理
{%endwarning%}

**④constexpr函数**
>**概述**：：在**函数定义之前**添加`constexpr`关键字即可，能用于**初始化常量表达式**的函数
{%list%}
该函数的返回类型以及形参类型都必须是字面值，且只能含有一条return语句，通常定义在头文件中
{%endlist%}
{%warning%}
constexpr函数的返回值不一定是常量表达式
{%endwarning%}
>如下，如果`cnt`是一个**常量表达式**，则`scale`的**结果**是**常量表达式**，反之则**不是**
```cpp
constexpr int new_sz(){return 42;} //返回结果为一常量表达式
constexpr size_t scale(size_t cnt){return new_sz() * cnt}//返回结果不一定为一常量表达式
```

**⑤数量未知的形参**
{%list%}
除了可以基于C语言的varargs的标准库实现，还可以通过initializer_list头文件实现
{%endlist%}
>**概述**：在函数定义时，使用`initializer_list`类作为**一个形参**，用于接收**不确定数量的实参**
{%right%}
调用时，使用初始值列表作为实参，用于初始化initializer_list
{%endright%}
```cpp
//函数定义
void error_msg(initializer_list<string> msg_list){
  for(auto beg = msg_list.begin();beg != msg_list.end(),++beg)
      cout<<*beg<<endl
}

//函数调用
error_msg({string1,string2,string3})
``` 
#### 3.2函数重载
**①定义**
>**概述**：名字相同但是**参数数量/类型**不同的一系列函数，**编译器**根据**调用时**提供的**参数**判断调用哪一个
{%list%}
不能仅仅依靠返回类型的不同实现函数重载，因为编译器无法根据返回类型判断你想调用那个函数
{%endlist%}
{%warning%}
不能通过形参是否有顶层const区分函数，但是可以通过形参是否有底层const区分函数
{%endwarning%}
>通常传入**常量实参**，调用**const版本**的函数，反之调用**非const版本**的函数
```cpp
//只有形参是否有顶层const的区别，两者本质上是同一个函数
//两者可以接收的参数一致
int fun1(int);
int fun2(const int);

//有形参是否有底层const的区别，两个不是相同的函数
int fun3(int &);
int fun3(const int &) //只有该函数能接收常量对象、字面值和表达式
```
{%right%}
可以利用const_cast，从而基于const版本实现非const版本
{%endright%}
```cpp
//const版本
const string &shorter_string(const string &s1,const string &s2){
  return s1.size() <= s2.size() ? s1:s2;
}
//非const版本
string &shorter_string(string s1,string s2){
  auto &res = shorter_string(const_cast<const string &>(s1),
                             const_cast<const string &>(s1));
  return const_cast<string &>(res);
}
```
**②匹配过程**
>**概述**：首先找到**同名的候选函数**，随后根据**参数数量/类型**的**匹配性**找到**最佳匹配**并调用之
{%list%}
详细匹配规则可见《C++ primer》p219
{%endlist%}
{%warning%}
候选函数必须是在调用点可见的，且内层的函数定义/声明会覆盖外层所有的同名函数
{%endwarning%}
```cpp
void fuc1(int a);
void fun1(int a,int b);
{
  void fun1(int a,int b,int c);
  func1(1); //发生错误，因为只能看见void fun1(int a,int b,int c);而类型不符合
}

```
{%wrong%}
若没有找到最佳匹配，则发生二义性错误
{%endwrong%}
```cpp
//函数声明
void fun1(int a,int b);
void fun1(double a,double b);

//该函数调用发生二义性错误，因为对于两个重载函数，都需要发生一次类型转换
fun1(1,1.0);
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
