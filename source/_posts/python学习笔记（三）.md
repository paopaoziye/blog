---
title: python学习笔记（三）
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
  - python
  - 编程语言
categories: 编程语言
keywords: 文章关键词
updated: ''
img: /medias/featureimages/4.webp
date:
summary: python下文件管理
---
# python学习笔记（三）
## 文件管理

### 1.文件路径
**1.1定义：**指明了文件在计算机上的**位置**，可分为**绝对路径**和**相对路径**
①绝对路径：从**根文件夹**开始的完整路径
②相对路径：相对于程序的**当前工作目录**的路径
>windows上采用`\`作为文件夹之间的分隔符，Linux上和OS X上采用`/`作为文件夹之间的分隔符
{%right%}
为了程序的可移植性，采用python中os模块中的方法获取文件路径
{%endright%}
**1.2获取**
①通过`os`模块获取
>`os.path.join()`：将单个文件和路径上的文件夹名称的字符串传递给它，`os.path.join()`就会返回一个文件路径的字符串
`os.getcwd()`：可以取得**当前工作路径**的**字符串**，并可以利用`os.chdir()`改变它
`os.path.abspath(path)`：将返回参数（相对路径的**字符串**）的绝对路径的**字符串**
`os.path.dirname()`：获取文件绝对路径的目录部分
{%right%}
如果要获得路径的每一个文件夹的名称，可以使用'[路径]'.split(os.path.sep)
{%endright%}
②使用`sys`模块
>`sys.argv[0]`：获取当前脚本的路径（包括文件名）。
`sys.path[0]`：获取当前脚本所在的目录路径。

③使用`__file__`变量：包含了**当前模块**（脚本）的路径（包括文件名）
{%warning%}
该变量只在一个独立的模块（脚本）中才有定义
{%endwarning%}

```
import os
import sys

# 获取当前工作目录
current_directory = os.getcwd()
print("当前工作目录:", current_directory)

# 获取文件的绝对路径
absolute_path = os.path.abspath('file.txt')
print("文件的绝对路径:", absolute_path)

# 拼接目录和文件名，返回完整路径
full_path = os.path.join('dir', 'file.txt')
print("完整路径:", full_path)

# 获取当前脚本的路径
script_path = sys.argv[0]
print("当前脚本的路径:", script_path)

# 获取当前脚本所在的目录路径
script_directory = os.path.dirname(os.path.abspath(__file__))
print("当前脚本所在的目录路径:", script_directory)
```
**1.3有效性检查**
>`os.path.exists(path)`：如果path参数所指的文件或文件夹存在，返回True
`os.path.isfile(path)`：如果path参数存在，并且是一个文件，返回 True
`os.path.isdir(path)`：如果path参数存在，并且是一个文件夹，返回Ture

### 2.文件处理
**2.1打开文件**
①`open()`： 向它传递一个**字符串**路径，返回一个`File`对象，还可传入对应参数指定**操作模式**和**编码方式**，默认是**读模式**和**操作系统默认的编码**
②操作模式：不同的操作模式有不同的规则
>`'r'`：以只读模式打开文件（默认模式），文件指针位于文件的开头，如果文件不存在，则会引发FileNotFoundError。
`'w'`：以写入模式打开文件，如果文件已存在，则会被清空。如果文件不存在，则会创建一个新文件。
`'a'`：以追加模式打开文件，文件指针位于文件的末尾。如果文件不存在，则会创建一个新文件。
`'x'`：以独占写入模式打开文件，如果文件已存在，则会引发FileExistsError。
`'b'`：以二进制模式打开文件，可以与其他模式一起使用，例如'rb'或'wb'。
`'t'`：以文本模式打开文件（默认模式），可以与其他模式一起使用，例如'rt'或'wt'。
`'+'`：以读写模式打开文件，可以与其他模式一起使用，例如'r+'、'w+'或'a+'。

③编码方式：通过`encoding`参数指定编码，常见的编码方式有`ASCII`、`UTF-8`等，选择编码方式时，应根据需求考虑文件中包含的**字符范围、语言以及平台兼容性**等因素
{%warning%}
如果文件使用的编码方式与指定的编码方式不匹配，可能会导致读取或写入的数据出现错误
{%endwarning%}
④如果`open`函数指定的文件并**不存在或者无法打开**，那么将引发异常状况导致程序崩溃，需要对其进行检查，此外，执行完业务逻辑后，需要**及时对目标文件进行释放**，可以使用python中的异常机制
>文件找不到会引发`FileNotFoundError`，指定了未知的编码会引发`LookupError`，而如果读取文件时无法按指定方式解码会引发`UnicodeDecodeError`

```
def main():
    f = None
    try:
        f = open('致橡树.txt', 'r', encoding='utf-8')
        print(f.read())
    except FileNotFoundError:
        print('无法打开指定的文件!')
    except LookupError:
        print('指定了未知的编码!')
    except UnicodeDecodeError:
        print('读取文件时解码错误!')
    finally:
        if f:
            f.close()


if __name__ == '__main__':
    main()
```

**2.2文件读写**
①文件读取
>`read()`：将整个文件的内容读取为一个**字符串值**
`for-in`循环：还可以使用`for-in`循环逐行读取文件
`readlines`：将文件按行读取到一个列表容器中
```
import time


def main():
    # 一次性读取整个文件内容
    with open('致橡树.txt', 'r', encoding='utf-8') as f:
        print(f.read())

    # 通过for-in循环逐行读取
    with open('致橡树.txt', mode='r') as f:
        for line in f:
            print(line, end='')
            time.sleep(0.5)
    print()

    # 读取文件按行读取到列表中
    with open('致橡树.txt') as f:
        lines = f.readlines()
    print(lines)
    

if __name__ == '__main__':
    main()
```
②文件写入：采用`write()`方法，该方法接收**字符串**，并将其写入到文件对象中
```
file = open("example.txt", "w")
file.write("Hello, World!")
file.close()
```
**2.3文件信息查询**
①`os.path.getsize(path)`将返回path参数中文件的**字节数**
②`os.listdir(path)`将返回**文件名字符串的列表**，包含path参数中的每个文件
**2.4文件管理器**
①定义
>上下文：任务本身会对其环境进行保存，做到哪里了，做了多少，各种状态都会标识记录，从而形成了上下文环境，在切换时根据每个任务的上下文环境，继续执行，从而达到多任务

>上下文管理器对象：即任何实现了`__enter__()`和 `__exit__()` 方法的类的对象实例

②使用：`with 上下文表达式 as 对象`
>其中**上下文表达式**是一个返回上下文管理器对象的函数调用
在进入语句块之前，上下文管理器的`__enter__`方法会被调用，可以在这个方法中执行资源的获取操作
在离开语句块时，无论是正常的退出还是发生异常，上下文管理器的`__exit__`方法都会被调用，可以在这个方法中执行资源的释放操作

```
with open('example.txt', 'r') as file:
    data = file.read()
    print(data)
```
③with关键字的实现原理
```
class File(object):

    def __init__(self, filename, mode):
        self.filename = filename
        self.mode = mode
        self.file = None

    def __enter__(self):
        """
        进入with as 语句的时候被with调用
        返回值作为 as 后面的变量
        """
        print("__enter__ called")
        self.file = open(self.filename, self.mode)
        return self.file

    def __exit__(self, exc_type, exc_value, exc_traceback):
        """
        离开with语句的时候被with调用
        """
        print("__exit__ called")
        print("exc_type: ", exc_type)
        print("exc_value: ", exc_value)
        print("exc_traceback: ", exc_traceback)
        self.file.close()
        print("文件关闭操作")


def main():

    with File("test.txt", "w") as f:
        print("with 代码块")
        f.write("hello python1")
        f.write("hello python2")
        # a = 1 / 0
        f.write("hello python3")

    print("with 语句结束")


if __name__ == '__main__':
    main()
```

>进入上下文管理器会自动调用`__enter__(self)`，该方法的返回值会被赋值给`as`子句后的对象，该方法可以返回多个值，因此在`as`子句后面也可以指定多个变量（括起来组成元组）
>退出上下文管理器自动调用`__exit__(self, exc_type, exc_value, exc_traceback)`，前三个参数在调用`__exit__()`方法时由Python解释器自动传递，并提供与异常相关的信息

④`with`关键字和`try-except`联合调用
```
def main():
    try:
        with open('guido.jpg', 'rb') as fs1:
            data = fs1.read()
            print(type(data))  # <class 'bytes'>
        with open('吉多.jpg', 'wb') as fs2:
            fs2.write(data)
    except FileNotFoundError as e:
        print('指定的文件无法打开.')
    except IOError as e:
        print('读写文件时出现错误.')
    print('程序执行结束.')


if __name__ == '__main__':
    main()
```
>`with`语句的主要目的是确保上下文管理器的资源**被正确释放**，即使在发生异常的情况下也能保证资源的释放，而`try-except`语句主要用于处理异常，提供错误处理和容错机制

### 3.变量保存
**3.1json模块**
①简介：是JavaScript语言中创建对象的一种字面量语法，现在已经被广泛的应用于**跨平台跨语言**的数据交换
>因为JSON是**纯文本**，任何系统任何编程语言处理纯文本都是没有问题的

②JSON的数据类型和Python的数据类型对应关系

| Python | JSON |
| ------ | ------ | 
| dict | object | 
| list, tuple | array |
| str | string |
| int, float, int- & float-derived Enums | number |
| True/False | true/false |
| None | null |

③实例
```
import json


def main():
    mydict = {
        'name': '骆昊',
        'age': 38,
        'qq': 957658,
        'friends': ['王大锤', '白元芳'],
        'cars': [
            {'brand': 'BYD', 'max_speed': 180},
            {'brand': 'Audi', 'max_speed': 280},
            {'brand': 'Benz', 'max_speed': 320}
        ]
    }
    try:
        with open('data.json', 'w', encoding='utf-8') as fs:
            json.dump(mydict, fs)
    except IOError as e:
        print(e)
    print('保存数据完成!')


if __name__ == '__main__':
    main()
```
>`json`模块常用方法
`dump()`：将Python对象按照JSON格式序列化到文件中
`dumps()`：将Python对象处理成JSON格式的字符串
`load()`：将文件中的JSON数据反序列化成对象
`loads()`：将字符串的内容反序列化成Python对象

**3.2shelve模块：**可以将Python程序中的变量保存到**二进制的shelf文件**中，这样，程序就可以从硬盘中恢复变量的数据
```
#保存变量
import shelve
shelfFile = shelve.open('mydata') #初始化一个shelf变量，类似于file变量，其中mydata为保存变量的文件
cats = ['Zophie', 'Pooka', 'Simon']
shelfFile['cats'] = cats #变量以类似于字典的形式存储
shelfFile.close() #结束
#访问变量
shelfFile = shelve.open('mydata')
shelfFile['cats'] #访问cats变量
shelfFile.close()
```

