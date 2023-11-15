---
title: python学习笔记（二）
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
img: /medias/featureimages/4.webp
date:
summary: python编程进阶
---
# python学习笔记（二）
## python进阶

### 1.正则表达式（Regex）
**1.1定义**：一种**只描述文本特征**文本描述方法
>与正则表达式有关的函数在**re模块**中

**1.2字符分类**
①默认字符
![默认字符](/image/python_8.png)
②自定义:[ijk]
>可以使用`-`表示字母或数字的范围，如[0-57-8]表示[012345678]

**一般的**正则表达式符号不会被解释，不需要使用转义字符
在的左方括号后加上一个插入字符`^`，就可以得到**非字符类**，即匹配不在这个字符类中的所有字符
**1.3步骤**
①`import re`导入re模块
②用`re.compile()`函数创建一个**Regex对象**（记得使用**原始字符串**）
③向Regex对象的`search()`方法传入想查找的字符串，它返回一个**Match对象**
④调用Match对象的`group()`方法，返回实际匹配文本的**字符串**
```
phoneNumRegex = re.compile(r'\d\d\d-\d\d\d-\d\d\d\d') #phoneNumRegex是一个Regex对象
mo = phoneNumRegex.search('My number is 415-555-4242.') #mo是一个Match对象
print('Phone number found: ' + mo.group())
```
**1.4修饰符号**:在**初始化Regex对象**时使用，如果想要匹配这这些字符，需要使用对应的**转义字符**
①`()`：对Regex对象进行**分组**
>group()函数可以提取对象的**某一组内容**，默认是0，即不考虑分组

```
phoneNumRegex = re.compile(r'(\d\d\d)-(\d\d\d-\d\d\d\d)')
mo = phoneNumRegex.search('My number is 415-555-4242.')
mo.group(1) #得到的结果是'415'
```
>如果想要一次就获取**所有的分组**，使用`groups()`方法，返回多个组对应的**字符串元组**

②`|`：表示匹配许多表达式**中的一个**即可
```
heroRegex = re.compile (r'Batman|Tina Fey')
mo1 = heroRegex.search('Batman and Tina Fey.')
mo1.group() #结果是'Batman'，即第一次匹配到的
```
>可以利用`()`和`|`实现某部分确定，某部分可选的正则表达式，如`batRegex = re.compile(r'Bat(man|mobile|copter|bat)')`

③`?`:表明它**前面的分组**在这个模式中是**可选的**
>`batRegex = re.compile(r'Bat(wo)?man')`既匹配'Batwoman'，又匹配'Batman'

④`*`：意味着“匹配零次或多次”，即星号之前的分组，可以在文本中出现**任意次**，包括0次
>`batRegex = re.compile(r'Bat(wo)*man')`可以匹配'Batwowowowoman'和'Batman'

⑤`+`：类似于`*`，但是**至少要一次**
⑥`{}`：类似于`*`，用于指定**特定次数**，`{n}`表示匹配n次，`{i，j}`代表i-j次
>贪心和非贪心匹配:Python 的正则表达式**默认是“贪心”**的，这表示在有二义的情况下，它们会**尽可能匹配最长的字符串**，花括号的“非贪心”版本匹配尽可能最短的字符串，即在**结束的花括号后跟着一个问号**

```
greedyHaRegex = re.compile(r'(Ha){3,5}')
mo1 = greedyHaRegex.search('HaHaHaHaHa')
mo1.group() #结果是'HaHaHaHaHa'
nongreedyHaRegex = re.compile(r'(Ha){3,5}?')
mo2 = nongreedyHaRegex.search('HaHaHaHaHa')
mo2.group() #结果是'HaHaHa'
```
⑦`^`/`$`：被搜索字符串必须以正则表达式对应的字符串**开始/结束**
⑧`.`：匹配一个**除了换行之外**的所有字符
>传入`re.DOTALL`作为`re.compile()`的第二个参数，可以让句点字符匹配`所有字符`，包括换行字符

**1.5拓展方法**
①`findall()`：不同于`search()`返回的Match对象只包含`第一次出现的匹配文本`，`findall()`将返回一**字符串列表**，包含被查找字符串中的**所有匹配**
```
phoneNumRegex = re.compile(r'\d\d\d-\d\d\d-\d\d\d\d') # has no groups
phoneNumRegex.findall('Cell: 415-555-9999 Work: 212-555-0000')
['415-555-9999', '212-555-0000']
```
>如果在正则表达式中有分组，那么findall将返回**元组的列表**，每个元组表示一个找到的匹配，其中的项就是正则表达式中每个分组的匹配字符串

```
phoneNumRegex = re.compile(r'(\d\d\d)-(\d\d\d)-(\d\d\d\d)') # has groups
phoneNumRegex.findall('Cell: 415-555-9999 Work: 212-555-0000')
[('415', '555', '1122'), ('212', '555', '0000')]
```
②`sub()`：传入两个参数，第一个参数是一个字符串，用于取代发现和正则表达式匹配的部分，第二个参数是一个正则表达式，返回替换完成后的字符串
```
namesRegex = re.compile(r'Agent \w+')
namesRegex.sub('CENSORED', 'Agent Alice gave the secret documents to Agent Bob.')#返回'CENSORED gave the secret documents to CENSORED.'
```
>如果只想改变和对应正则表达式相匹配的**一部分**，可以给正则表达式参数**分组**，并在第一个参数开头加上`\n`，代表该字符串只替代第n组

```
agentNamesRegex = re.compile(r'Agent (\w)\w*')
agentNamesRegex.sub(r'\1****', 'Agent Alice told Agent Carol that Agent Eve knew Agent Bob was a double agent.')
#返回结果是'A**** told C**** that E**** knew B**** was a double agent.'

```
③复杂的正则表达式
>可以可以向`re.compile()`传入变量`re.VERBOSE`，作为第二个参数，忽略正则表达式字符串中的空白符和注释
使用三重引号，可以将正则表达式定义放在多行中

详细可见[参考文章](https://github.com/jackfrued/Python-100-Days/blob/master/Day01-15/12.%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%92%8C%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F.md)

### 2.并发编程
**2.1相关概念**
①并发编程：让程序同时执行多个任务
②进程：操作系统中**正在执行**的程序
>操作系统以进程为单位分配存储空间，每个进程都有自己的**地址空间**、**数据栈**以及其他用于跟踪进程执行的**辅助数据**
不同进程通过**进程间通信机制**（IPC）来实现数据共享，具体的方式包括**管道**、**信号**、**套接字**、**共享内存区**等

③线程：进程中可以获得CPU调度的执行单元
>某个时刻能够获得CPU的只有唯一的一个**线程**

**2.2多进程**
[参考文章](https://github.com/jackfrued/Python-100-Days/blob/master/Day01-15/13.%E8%BF%9B%E7%A8%8B%E5%92%8C%E7%BA%BF%E7%A8%8B.md)


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


