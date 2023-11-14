---
title: python学习笔记（一）
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
  - 编程语言
  - python
categories: 编程语言
keywords: 文章关键词
updated: ''
date:
img: /medias/featureimages/4.webp
summary: python启蒙
---
# python学习笔记（一）
## python启蒙
### 1.基本元素
#### 1.1对象
**①定义**
>即**被存储的数据**，如`1`、`"cat"`、`1.23456e2`等
{%list%}
类似于C语言中的字面值，当一个对象被声明后，会给其分配对应的地址和内存，且数据类型不能更改
{%endlist%}
**②基本数据类型**
>**整型**、**浮点型**、**字符串**、**布尔类型**、**复数类型**
{%list%}
可以使用type()检查数据类型
{%endlist%}
**③分类**
>**不可变类型**：对象**一旦创建**，内容就**不能被更改**，只能被**覆盖**，**基本数据类型**都是**不可变类型**

>**可变类型**：对象的**值可以被更改**，如**列表**、**集合**和**字典**等

**④数据类型转换**
>**自动类型转换**：**不同类型**数据**混合运算**，**精度低**的类型将自动转化为**精度高**的类型**避免数据丢失**
{%list%}
自动转换类型功能有限，如整型不能自动转化为字符串类型，需要使用强制类型转换
{%endlist%}
>**强制类型转换**：使用`str()`、`int()`、`float()`将对象**强制转换**为**对应类型**
#### 1.2变量
**①定义**
>本质是**对象**的一个**引用**，**本身**也占用**一定的内存**，用于存储**对象的地址**，通过**赋值符**`=`为**变量**指定**对象**
{%list%}
python变量对应的内存是变化的，是上次赋值时新对象所在的内存，而C语言变量名所代表的地址是不变的
{%endlist%}
{%right%}
没有变量指向的对象会被回收，即python的垃圾回收机制
{%endright%}
{%warning%}
变量的本质是引用，如果两个变量指向是同一个可变类型对象，改变其中一个，另一个也随之改变
{%endwarning%}
![变量的本质](/image/python_7.png)
**②取名规则**
>只能是**一个词**，且只包含**字母、数字和下划线**，**不能以数字开头**
{%right%}
一个好的变量名包含了数据对应的信息，常见的命名格式有my_cat和MyCat
{%endright%}
{%warning%}
注意和关键词冲突
{%endwarning%}

#### 1.3操作符
**①数字操作符**
>**加**`+`、**减**`-`、**乘**`*`、**除**`/`、**取模**`%`、**整除**`//`、**指数**`**`
{%list%}
C的除法结果由其操作数类型决定，而python的除法结果由其操作符决定
{%endlist%}
{%right%}
+可以用于拼接字符串，比如'a'+'b'结果是'ab'，*可以用于字符串复制，比如'a'*5结果时'aaaaa'
{%endright%}
**②比较操作符**
>**等于**`==`、**不等于**`!=`、**小于**`<`、**大于**`>`、**小于等于**`<=`、**大于等于**`>=`
{%list%}
>、<、≥、≤只能用于整型和浮点型
{%endlist%}
{%warning%}
整型和浮点型之间是可以使用==正常比较的，但是整型、浮点型和字符串使用==只能得到False
{%endwarning%}
**③布尔操作符**
>**与**`and`、**或**`or`、**非**`not`
{%list%}
not优先级最高，随后是and，最后是or
{%endlist%}

#### 1.4格式
**①注释**
>**单行注释**：以`#`**开头**，以**换行符**结尾

>**多行注释**：用**三个单引号/双引号**包围

**②代码块**
>根据**缩进**划分**代码块**，**相同缩进**的**连续代码**为一**代码块**
{%list%}
代码块内部可以嵌套代码块，嵌套代码块的缩进更多
{%endlist%}
{%right%}
通常以四个空格为一个缩进，不要使用tab
{%endright%}
**③语句**
>**语句**使用**换行符**结尾，**语句关键词语句**使用**冒号**结尾

#### 1.5控制流
**①if条件语句**
```
if(expression): 
  statement
elif(expression):
  statement
else:
  statement
```
{%right%}
一旦一个语句的条件为Ture，后面的语句会被忽略，所以要注意语句的顺序，或者说清晰化条件的范围，使其之间没有交集
{%endright%}

**②while循环语句**
```
while(expression):
  statement
```
**③for循环语句**
```
for 控制变量 in range(): 
  statement
```
{%list%}
缺省情况下，控制变量被初始化为0
{%endlist%}
{%right%}
在Python中，下划线_通常用作一个无用的变量名称，常用做控制变量的名称
{%endright%}
**④range函数**
>`range(a)`：`0`至`a-1`，**步长为1**

>`range(a,b)`：`a`至`b-1`，**步长为1**

>`range(a,b,i)`：`a`至`b-1`,**步长为i**
{%list%}
可以将循环中的range()换为一个列表，在每次迭代中，让变量依次设置为列表中的值
{%endlist%}

**⑤循环控制语句**
>**break**：遇到`break`语句，马上**退出循环**
>**continue**：遇到`continue`语句，马上**跳回到循环开始处**


### 2.函数
#### 2.1引言
**①格式**
>`None`是`NoneType`**数据类型**的**唯一值**，代表**没有值**，相当于**C语言**中的`void`
```
def 函数名(形参n):
  statement
  return expression #可以是变量，也可以是表达式

```
{%list%}
某些函数有可选的关键字参数，在函数调用时可以指定，相当于修改函数的默认设置
{%endlist%}
{%right%}
如果需要传递多个同一位置的关键字参数，可以采用 | 管道命令将这些参数连接
{%endright%}
**②可变参数**
>使用`args`**关键字**实现
{%right%}
函数的参数可以有默认值，也支持使用可变参数（类型、个数均可变），所以Python并不需要支持函数的重载
{%endright%}
```
# 在参数名前面的*表示args是一个可变参数
def add(*args):
    total = 0
    for val in args:
        total += val
    return total


# 在调用add函数时可以传入0个或多个参数
print(add())
print(add(1))
print(add(1, 2))
print(add(1, 2, 3))
print(add(1, 3, 5, 7, 9))
```
#### 2.2作用域
**①分类**
>**局部作用域**：在**被调用函数内赋值**的变量，局部作用域在**函数被调用**时创建，在**函数返回时**销毁
{%warning%}
如果在函数内没有对其进进行赋值，则为全局变量
{%endwarning%}
>**全局作用域**：在**所有函数之外**赋值的变量，属于**全局作用域**，全局作用域在**程序开始时**创建，在**程序终止时**销毁

>**嵌套作用域**：当一个**函数内部**有**另一个函数**时，**前者**的变量属于**后者**的**嵌套作用域**

>**内置作用域**：**Python内置**的那些**标识符**

**②联系**
>**内置作用域**→**全局作用域**→**嵌套作用域**→**局部作用域**，**从左往右**依次**内推**
{%list%}
内部的作用域可以访问外部作用域中的变量，但是外部作用域不能访问内部作用域的变量
{%endlist%}
{%warning%}
局部作用域不能访问其他局部作用域的变量
{%endwarning%}
{%right%}
如果在不同的作用域中，你可以用相同的名字命名不同的变量
{%endright%}
**③关键词修饰**
>`global`：**修饰变量**使其变为**全局变量**

>`nonlocal`：**修饰变量**使其变为**嵌套作用域变量**
{%warning%}
全局变量比局部变量拥有更长的生命周期，可能导致对象占用的内存长时间无法被垃圾回收
{%endwarning%}
#### 2.3模块
**①定义**
>模块类似于C++中的**命名空间**，可以**防止命名冲突**，同时也**封装了代码**

**②使用**
>**导入模块**：`import 模块名,模块名n`
{%list%}
import 模块 as 新名字可以对模块进行重命名
{%endlist%}
>**调用模块中函数/方法**：`模块名.函数名/方法名`

**③测试**
{%list%}
模块内部有一个测试函数，直接运行该模块文件即可运行测试函数
{%endlist%}
>`__name__`为python中的一个**内置变量**，当程序**直接被执行**时，其`__name__`的值为`'__main__'`，而**作为模块导入**时，其`__name__ `值为**自己的模块名**
```
def c2f(cel):
    fah = cel * 1.8 + 32
    return fah
def f2c(fah):
    cel = (fah - 32) / 1.8
    return cel
def test():
    print("测试数据：0 摄氏度 = %.2f 华氏度" % c2f(0))
    print("测试数据：0 华氏度 = %.2f 摄氏度" % f2c(0))
if __name__ == '__main__':
test()
```
#### 2.4异常处理
{%list%}
本质上是试图捕捉函数内部某些语句的错误
{%endlist%}
>**try语句**：将可**能出错的语句**放在`try`之后，当这些语句**出错**后，会立马**跳转到**`except`语句
```
try:
  statement
```
>**except语句**：后面常接一些**错误提醒**的`print`语句
```
except 错误名:
  print()
```
>**finally语句**：`finally`块的代码**不论程序正常还是异常**都会执行
{%list%}
该语句不是必须的，通常用于执行一些必要的清理操作，如关闭文件、释放资源、关闭数据库连接等
{%endlist%}

#### 2.5常用函数
**①print()**
>将括号内的**字符串**显示在**屏幕**上，输出**其他类型变量**时，需要使用`str()`将其**转换为字符串类型**
{%right%}
采用占位符语法灵活配置字符串
{%endright%}
>`print('%d + %d = %d' % (a, b, a + b))`：其中`%d`是**整数**的**占位符**，**字符串后`%`后面**跟的**变量值**会**替换掉占位符**
{%warning%}
带该种占位符的字符串中要表示百分号必须写成%%
{%endwarning%}

>`print('{0} * {1} = {2}'.format(a, b, a * b))`：其中`{0}`、`{1}`和`{2}`都是**占位符**，其中**数字**为**format方法**的**索引**，**占位符**最后会被**替换**为**对应的变量**
{%right%}
还可以利用语法糖简化写法，即print(f'{a} * {b} = {a * b}')
{%endright%}
**②input()**
>等待用户**输入文本**，并按下**回车键**，将其转化为一个**字符串**

### 3.面向对象编程
**4.1类的定义**
```
class Student(object):

    # __init__是一个特殊方法用于在创建对象时进行初始化操作
    # 通过这个方法我们可以为学生对象绑定name和age两个属性
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def study(self, course_name):
        print('%s正在学习%s.' % (self.name, course_name))

    # PEP 8要求标识符的名字用全小写多个单词用下划线连接
    # 但是部分程序员和公司更倾向于使用驼峰命名法(驼峰标识)
    def watch_movie(self):
        if self.age < 18:
            print('%s只能观看《熊出没》.' % self.name)
        else:
            print('%s正在观看岛国爱情大电影.' % self.name)
```
①在Python中可以使用`class`关键字定义类，其中`object`是所有类的基类，即**顶级父类**，这意味着在Python中定义的任何类都可以调用`object`类的方法（如`__init__`方法），并继承`object`类的特性
②类中的函数被称为**方法**，以描述对象的动态特征，其中方法的**第一个参数**通常被命名为`self`，Python会自动将对象绑定到第一个参数上
③`__init__`方法定义了类的**属性**，这些属性是描述类的关键

**4.2对象的创建与使用**
```
def main():
    # 创建学生对象并指定姓名和年龄
    stu1 = Student('骆昊', 38)
    # 给对象发study消息
    stu1.study('Python程序设计')
    # 给对象发watch_av消息
    stu1.watch_movie()
    stu2 = Student('王大锤', 15)
    stu2.study('思想品德')
    stu2.watch_movie()


if __name__ == '__main__':
    main()
```
①可以通过`对象.方法名/属性名`访问类的方法和属性
>对象的创建不使用`__init__`方法，而是使用**类名**创建，使用类名创建对象实际上是通过**调用构造函数**来创建对象

②属性和方法的访问权限只有两种，也就是公开的和私有的，如果希望属性是私有的，在给属性命名时可以用**两个下划线**作为开头
{%warning%}
但是，Python并没有从语法上严格保证私有属性或方法的私密性，它只是给私有的属性和方法换了一个名字来妨碍对它们的访问，事实上如果你知道更换名字的规则仍然可以访问到它们
{%endwarning%}
{%right%}
python程序员遵循一种命名惯例就是让属性名以单下划线开头来表示属性是受保护的，本类之外的代码在访问这样的属性时应该要保持慎重
{%endright%}

**4.3property装饰器**
```
class Person(object):

    def __init__(self, name, age):
        self._name = name
        self._age = age

    # 访问器 - getter方法
    @property
    def name(self):
        return self._name

    # 访问器 - getter方法
    @property
    def age(self):
        return self._age

    # 修改器 - setter方法
    @age.setter
    def age(self, age):
        self._age = age

    def play(self):
        if self._age <= 16:
            print('%s正在玩飞行棋.' % self._name)
        else:
            print('%s正在玩斗地主.' % self._name)


def main():
    person = Person('王大锤', 12)
    person.play()
    person.age = 22
    person.play()
    # person.name = '白元芳'  # AttributeError: can't set attribute


if __name__ == '__main__':
    main()
```
①`@property`:将一个**方法**转换为相应的**属性**，将**方法的调用方式**变为**属性的访问方式**
>具体而言，`@property`装饰器定义了一个`getter`方法，用于获取属性的值,如果没有`@property`的话，`person.age`应为`person.age()`

②在定义了**访问器**后,可以使用`age.setter`等装饰器定义对应的`setter`方法，记住要有**对应的前缀**，且方法名需要一致（即`age`）
**4.4静态方法和类方法：**当类中需要一些方法，但是不是基于具体对象实例的，如在**创建对象前**验证其是否合理的方法
①静态方法：使用`@staticmethod`修饰器定义，直接通过`类名.方法名()`调用
>静态方法属于**类本身**，所以在定义时不需要`self`参数
```
from math import sqrt


class Triangle(object):

    def __init__(self, a, b, c):
        self._a = a
        self._b = b
        self._c = c

    @staticmethod
    def is_valid(a, b, c):
        return a + b > c and b + c > a and a + c > b


def main():
    a, b, c = 3, 4, 5
    # 静态方法和类方法都是通过给类发消息来调用的
    if Triangle.is_valid(a, b, c):
        t = Triangle(a, b, c)
    else:
        print('无法构成三角形.')


if __name__ == '__main__':
    main()
```
②类方法：使用`@classmethod`修饰器定义类方法，直接通过`类名.方法名()`调用
>方法的第一个参数约定名为`cls`，类似于`self`，但是`cls`代表是对应的类，允许在类方法内部访问**类级别**的属性和方法
```
from time import time, localtime, sleep


class Clock(object):
    """数字时钟"""

    def __init__(self, hour=0, minute=0, second=0):
        self._hour = hour
        self._minute = minute
        self._second = second

    @classmethod
    def now(cls):
        ctime = localtime(time())
        return cls(ctime.tm_hour, ctime.tm_min, ctime.tm_sec)


def main():
    # 通过类方法创建对象并获取系统时间
    clock = Clock.now()


if __name__ == '__main__':
    main()
```
**4.5继承和继承**：
```
class Person(object):
    """人"""

    def __init__(self, name, age):
        self._name = name
        self._age = age

    @property
    def name(self):
        return self._name

    @property
    def age(self):
        return self._age

    @age.setter
    def age(self, age):
        self._age = age

    def play(self):
        print('%s正在愉快的玩耍.' % self._name)

    def watch_av(self):
        if self._age >= 18:
            print('%s正在观看爱情动作片.' % self._name)
        else:
            print('%s只能观看《熊出没》.' % self._name)


class Student(Person):
    """学生"""

    def __init__(self, name, age, grade):
        super().__init__(name, age)
        self._grade = grade

    @property
    def grade(self):
        return self._grade

    @grade.setter
    def grade(self, grade):
        self._grade = grade

    def study(self, course):
        print('%s的%s正在学习%s.' % (self._grade, self._name, course))


class Teacher(Person):
    """老师"""

    def __init__(self, name, age, title):
        super().__init__(name, age)
        self._title = title

    @property
    def title(self):
        return self._title

    @title.setter
    def title(self, title):
        self._title = title

    def teach(self, course):
        print('%s%s正在讲%s.' % (self._name, self._title, course))


def main():
    stu = Student('王大锤', 15, '初三')
    stu.study('数学')
    stu.watch_av()
    t = Teacher('骆昊', 38, '砖家')
    t.teach('Python程序设计')
    t.watch_av()


if __name__ == '__main__':
    main()
```
①继承：子类除了继承父类提供的属性和方法，还可以定义自己**特有**的属性和方法，所以子类比父类拥有的更多的能力
②多态：子类在继承了父类的方法后，可以对父类已有的方法给出新的实现版本，不同的子类表现不同
>抽象类是一种专门让其他类继承的类，**不能创建对应的对象**，子类可以重写其中的**抽象方法**从而实现多态

{%right%}
通过abc模块的ABCMeta元类和abstractmethod包装器来达到抽象类的效果
{%endright%}

```
from abc import ABCMeta, abstractmethod


class Pet(object, metaclass=ABCMeta):
    """宠物"""

    def __init__(self, nickname):
        self._nickname = nickname

    @abstractmethod
    def make_voice(self):
        """发出声音"""
        pass


class Dog(Pet):
    """狗"""

    def make_voice(self):
        print('%s: 汪汪汪...' % self._nickname)


class Cat(Pet):
    """猫"""

    def make_voice(self):
        print('%s: 喵...喵...' % self._nickname)


def main():
    pets = [Dog('旺财'), Cat('凯蒂'), Dog('大黄')]
    for pet in pets:
        pet.make_voice()


if __name__ == '__main__':
    main()
```

### 5.列表
**5.1声明**：`列表名 = [表项1,...,表项n]`
>表项的数据类型**可以不是一致的**，也可以是**列表**，如果全部都是大小相同列表的话，类似于C语言中的**多维数组**

**5.2访问**
①`列表名[i]`:访问列表中**第i-1表项**
>python中**有**对应的**下标检查**
当i前面有**负号**时，代表**倒数**第i个
当列表某个表项是列表时，如果想要访问其中元素，需要再次使用下标，即`列表名[i][j]`

②`列表名[i:j:n]`：访问列表的一部分（第i个下标到第j个下标,n为步长，默认为1），结果还是一个列表
>省略**第一个下标**相当于使用 0，或列表的**开始**
省略**第二个下标**相当于使用列表的长度，意味着分片直至列表的**末尾**
当n为**负数**时，表示从第j个下标到第i个下标，即**反向切片**

**5.3常用操作**
①操作符
>`+`操作符可以**连接**两个列表，得到一个新列表，就像它将两个字符串合并成一个新字符串一样
`*`操作符可以用于一个列表和一个整数，实现列表的**复制**
`del`语句将删除列表中下标处的值，表中被删除值后面的所有值，都将**向前移动一个下标**
`del spam[2]`
`in`和`not in`:连接两个值,一个要在列表中**查找的值**，以及待查找的**列表**。这些表达式将求值为**布尔值**

②常用方法
>index()：传入一个值，如果该值存在于列表中，就返回它**第一次**出现的下标
append()：将参数添加到列表**末尾**
insert()：以在列表**任意下标处**插入一个值
remove()：将对应值从被调用的列表中删除
sort()：对于`数值`或`字符串`的列表，基于“ASCII字符顺序”排序

**5.4元组和集合**
①元组：几乎与列表数据类型一样，但是元组输入时用**圆括号()**，而不是用方括号，且也是**不可变数据类型**
>如果元组中只有**一个值**，你可以在括号内该值的后面跟上一个**逗号**，否则就是一个值，而不是包含一个值的元组
元组在创建**时间**和占用的**空间**上面都优于列表

②集合：`set1 = {1, 2, 3, 3, 3, 2}`，是**无序**的可变数据类型
>不允许有重复元素，而且可以进行交集、并集、差集等运算

③转换
>
`list()`：返回传递给它们的值的列表版本
`tuple()`：返回传递给它们的值的元组版本
`set()`：返回集合版本

{%right%}
在将可变数据类型传递给函数时，又不希望函数改变其值，可以在函数内部拷贝一份对应的值，这就需要使用copy模块的copy()函数（直接赋值传递的还是引用）
{%endright%}

### 6.字典
**6.1声明：**`字典名 = {键1:值1,...,键n:值n};`
>字典的键相当于相当于列表的**下标**，但是列表的下标只能时整数，而字典的键可以是**其他数据类型**，比如说字符串
字典是**无序**的，只要键名和对应的值完全相同，两个字典就是完全相同的
字典的**键**不能重复

**6.2常用操作：**
①访问：`字典名[键名]`
②添加/修改键值对：`字典名[键名]=值`
③删除键值对：`del 字典名[键名]`
④判断是否存在：`键名 in 字典名`

**6.3常用方法：**
①`keys()`:返回`dict_keys`，类似于字典的键的列表
②`values()`：返回`dict_values`，类似于字典的值的列表
③`items()`：返回`dict_items`，类似于字典的键-值对的列表
{%right%}
这些返回值不能改变，常用于for循环判定条件中如for v in spam.values()用于遍历字典
{%endright%}
④`get()`：它有两个参数，要取得其值的**键**，以及如果该键不存在时，返回的**备用值**
⑤`setdefault()`:为字典中某个键设置一个默认值，当该键没有任何值时使用它，传递给该方法的第一个参数，是要**检查的键**，第二个参数，是如果**该键不存在时要设置的值**，即`spam.setdefault('color', 'black')`
```
#计算一个字符串中每个字符出现的次数
message = 'It was a bright cold day in April, and the clocks were striking thirteen.'
count = {}
#for循环语句，即将character依次设置为message列表中的值
for character in message:
  count.setdefault(character, 0)
  count[character] = count[character] + 1
print(count)
```

### 7.字符串
**7.1声明**
①以**单引号**开始和结束
>但是这样会导致字符串不能包含单引号，可以使用对应的**转义字符**`\'`

②以**双引号**开始和结束
>同理，不能包含双引号，可以使用对应的转义字符`\"`

③以**3个单引号或3个双引号**开始和结束，“三重引号”之间的所有**引号、制表符或换行**，都被认为是字符串的一部分缩进规则在这种字符串中不适用
④原始字符串：在字符串开始的**引号之前加上r**，完全忽略所有的转义字符，打印出字符串中所有的**倒斜杠**
>字符串是**不可变类型**，可以看作是**单个文本字符的元组（空格也算）**，`name = 'cat'`相当于`name = ('c','a','t')`

**7.2常用方法**

>`islower()/islower()`:如果字符串至少有一个字母，并且所有字母**都是**大写/小写,就会相应地返回布尔值 True。否则，该方法返回 False。
`isalpha()`：如果字符串只包含字母，并且非空，返回True
`isalnum()`：如果字符串只包含字母和数字，并且非空，返回True
`isdecimal()`：如果字符串只包含数字字符，并且非空，返回 True
`isspace()`：如果字符串只包含空格、制表符和换行，并且非空,返回 True
`istitle()`:如果字符串仅包含以大写字母开头、后面都是小写字母的单词,返回 True
`startswith()/endswith()`:如果它们所调用的字符串以该方法传入的字符串开始或结束,返回 True

>`upper()/lower()`：将原字符串的所有字母都被相应地转换为大写/小写，非字母字符保持不变，返回一个**新**字符串，而不是将旧字符串修改
因为 upper()和 lower()字符串方法本身返回字符串，可以在返回的字符串上继续调用字符串方法,如`'Hello'.upper().lower()`

>`join()`:在一个字符串上调用，参数是一个字符串列表，返回一个字符串,返回的字符串由传入的列表中每个字符串连接而成。
 `' '.join(['My', 'name', 'is', 'Simon'])`,返回结果是'My name is Simon'

>`split()`：传入一个分割字符串，指定它按照不同的字符串分割
`'MyABCnameABCisABCSimon'.split('ABC')返回值为['My', 'name', 'is', 'Simon']`

>`rjust()/ljust()/center()`:该方法的第一个参数为**填充后**的字符串的长度，第二个参数为**填充使用的字符**，默认是空格，分别为
`'Hello'.rjust(20, '*')'***************Hello'`
`'Hello'.center(20, '=')'=======Hello========'`

>`strip()/lstrip()/rstrip()`:删除字符串左边、右边或两边的空白字符（空格、制表符和换行符）有一个可选的字符串参数，指定两边的哪些**字符**应该删除（注意，删除的不一定和参数完全符合，可能是他们的组合）
```
spam = 'SpamSpamBaconSpamEggsSpamSpam'
spam.strip('ampS')
'BaconSpamEggs'
```
>`pyperclip`模块有`copy()`和`paste()`函数，可以向计算机的剪贴板发送文本，或从它接收文本,如果你的程序之外的某个程序改变了剪贴板的内容，`paste()`函数就会返回它

7.生成式和生成器语法
https://www.cnblogs.com/yyds/p/6281453.html
