---
title: Cmake应用（二）
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
  - 代码工具
  - Cmake
categories: 工具链
keywords: 文章关键词
updated: ''
img: /medias/featureimages/23.webp
date:
summary: Cmake代码构建工具
---
# Cmake
## Cmake应用（二）
### 1.嵌套Cmake
{%right%}
当项目有多个源代码目录时，给每个源码目录都添加一个CMakeLists.txt文件，便于管理
{%endright%}
#### 1.1引言
>进行**模块化测试**，将`calc`和`sort`中的源代码打包成**库**，并分别给**对应测试文件**调用
```
$ tree
.
├── build
├── calc              #计算库
│   ├── add.cpp
│   ├── CMakeLists.txt
│   ├── div.cpp
│   ├── mult.cpp
│   └── sub.cpp
├── CMakeLists.txt
├── include           #头文件目录
│   ├── calc.h
│   └── sort.h
├── sort              #排序库
│   ├── CMakeLists.txt
│   ├── insert.cpp
│   └── select.cpp
├── test1             #测试计算库
│   ├── calc.cpp
│   └── CMakeLists.txt
└── test2             #测试排序
    ├── CMakeLists.txt
    └── sort.cpp
```
#### 1.2建立联系
**①节点关系**
>`CMakeLists`文件关系是**树状结构关系**（因为**文件/目录之间的关系**也是树状结构关系）
{%list%}
父节点定义的变量也可以在子节点中使用，子节点定义的变量只能在当前节点使用
{%endlist%}

**②`add_subdirectory`**
>**建立父子节点关系**
**格式**：`add_subdirectory(source_dir [binary_dir] [EXCLUDE_FROM_ALL])`

>`source_dir`：指定**子目录**
`binary_dir`：指定了**子目录输出文件的路径**，一般**不需要指定**
`EXCLUDE_FROM_ALL`：当指定该参数时，父目录的`CMakeLists.txt`不会构建子目录的目标文件，必须在**子目录下显式去构建**，除非**父目录的目标文件依赖于子目录的目标文件**

#### 1.3CmakeLists文件
**①根目录**
{%list%}
根目录主要的功能是定义全局变量和添加子目录
{%endlist%}
```
cmake_minimum_required(VERSION 3.0)
project(test)
# 定义变量
# 静态库生成的路径
set(LIB_PATH ${CMAKE_CURRENT_SOURCE_DIR}/lib)
# 测试程序生成的路径
set(EXEC_PATH ${CMAKE_CURRENT_SOURCE_DIR}/bin)
# 头文件目录
set(HEAD_PATH ${CMAKE_CURRENT_SOURCE_DIR}/include)
# 静态库的名字
set(CALC_LIB calc)
set(SORT_LIB sort)
# 可执行程序的名字
set(APP_NAME_1 test1)
set(APP_NAME_2 test2)
# 添加子目录
add_subdirectory(calc)
add_subdirectory(sort)
add_subdirectory(test1)
add_subdirectory(test2)
```
**②calc目录**
```
cmake_minimum_required(VERSION 3.0)
project(CALCLIB)
#搜索当前目录（calc目录）下的所有源文件
aux_source_directory(./ SRC)
#包含头文件路径，HEAD_PATH是在根节点文件中定义的
include_directories(${HEAD_PATH})
#设置库的生成的路径，LIB_PATH是在根节点文件中定义的
set(LIBRARY_OUTPUT_PATH ${LIB_PATH})
#生成静态库，静态库名字CALC_LIB是在根节点文件中定义的
add_library(${CALC_LIB} STATIC ${SRC})
```

**③sort目录**
```
cmake_minimum_required(VERSION 3.0)
project(SORTLIB)
aux_source_directory(./ SRC)
include_directories(${HEAD_PATH})
set(LIBRARY_OUTPUT_PATH ${LIB_PATH})
#生成动态库，动态库名字SORT_LIB是在根节点文件中定义的
add_library(${SORT_LIB} SHARED ${SRC})
```

**④test1目录**
{%list%}
当程序某个模块中生成库且在对应CmakeLists文件中指定了库的输出路径，其他模块不需要指定其路径
{%endlist%}
```
cmake_minimum_required(VERSION 3.0)
project(CALCTEST)
aux_source_directory(./ SRC)
#指定头文件路径，HEAD_PATH变量是在根节点文件中定义的
include_directories(${HEAD_PATH})
link_directories(${LIB_PATH})
#指定可执行程序要链接的静态库，CALC_LIB变量是在根节点文件中定义的
link_libraries(${CALC_LIB})
#指定可执行程序生成的路径，EXEC_PATH变量是在根节点文件中定义的
set(EXECUTABLE_OUTPUT_PATH ${EXEC_PATH})
#生成可执行程序，APP_NAME_1变量是在根节点文件中定义的
add_executable(${APP_NAME_1} ${SRC})
```

**⑤test2目录**
```
cmake_minimum_required(VERSION 3.0)
project(SORTTEST)
aux_source_directory(./ SRC)
include_directories(${HEAD_PATH})
set(EXECUTABLE_OUTPUT_PATH ${EXEC_PATH})
link_directories(${LIB_PATH})
add_executable(${APP_NAME_2} ${SRC})
target_link_libraries(${APP_NAME_2} ${SORT_LIB})
```

**⑥结果**
>进入到**根节点目录**的`build`**目录**中，执行`cmake`和`make`命令，在项目**根目录**的`lib`**目录**中生成了**静态库**`libcalc.a`和**动态库**`libsort.so`，并在项目**根目录**的`bin`**目录**生成了**可执行程序**`test1`和`test2`


### 2.流程控制
#### 2.1条件判断
**①`if`语句**
```
if(<condition>)
  <commands>
elseif(<condition>)  #可选块，可重复
  <commands>
else()               #可选块
  <commands>
endif()
```

**②`condition`**
>`condition`的值为`1`, `ON`, `YES`, `TRUE`, `Y,` **非零值**，**非空字符串**时，条件判断返回`True`
`condition`的值为`0`，`OFF`，`NO`，`FALSE`，`N`，`IGNORE`，`NOTFOUND`，**空字符串**时，条件判断返回`False`


**③相关操作符**
>**逻辑操作**：`NOT`（非）、`AND`（与）、`OR`（或）

>**数值比较**：`LESS`（小于）、`GREATER`（大于）、`EQUAL`（等于）、`LESS_EQUAL`（小于等于）、`GREATER_EQUAL`（大于等于）

>**字符串比较**：**同上**，但是需要加上`STR`**前缀**
{%right%}
CMake还提供了其他判断语句，如if(EXISTS path-to-file-or-directory)则是判断文件或者目录是否存在
{%endright%}

#### 2.2循环语句
**①while循环**
>当`condition`为`False`时结束
```
while(<condition>)
    <commands>
endwhile()
```

**②`foreach`循环1**
>`foreach(<loop_var> RANGE <stop>)`
`loop_var`：**存储每次循环取出的值**
`RANGE`：关键字，表示**要遍历范围**
`stop`：这是一个正整数，表示**范围的结束值**，即遍历范围为`[0,stop]`
```
cmake_minimum_required(VERSION 3.2)
project(test)
# 循环
foreach(item RANGE 10)
    message(STATUS "当前遍历的值为: ${item}" )
endforeach()
```

**③`foreach`循环2**
>`foreach(<loop_var> RANGE <start> <stop> [<step>])`
`start`：表示范围的**起始值**
`stop`：表示范围的**结束值**
`step`：循环的**步长**，**默认为1**
```
cmake_minimum_required(VERSION 3.2)
project(test)

foreach(item RANGE 10 30 2)
    message(STATUS "当前遍历的值为: ${item}" )
endforeach()
```
**④`foreach`循环3**
>`foreach(<loop_var> IN [LISTS [<lists>]] [ITEMS [<items>]])`
`IN`：关键字，对应`RANGE`
`LISTS`：关键字，对应的是列表
`ITEMS`：关键字，对应的也是列表，但是需要通过`${}`**将列表中的值取出**
{%list%}
LISTS关键字和ITEMS至少要存在一个，也可以同时存在，每个后面可以接多个对象
{%endlist%}
```
cmake_minimum_required(VERSION 3.2)
project(test)
# 创建 list
set(WORD a b c d)
set(NAME ace sabo luffy)
# 遍历 list
foreach(item IN LISTS WORD ITEMS ${NAME})
    message(STATUS "当前遍历的值为: ${item}" )
endforeach()
```

**⑤`foreach`循环4**
>`foreach(<loop_var>... IN ZIP_LISTS <lists>)`
`ZIP_LISTS`：关键字

>**`<loop_var>...`**
如果指定了**多个变量名**，则**变量的数量**应该和**列表数**相等
若**只给出一个**`loop_var`，则他会**自动创建出对应数量**的`loop_var_0`到`loop_var_N`
{%list%}
该循环同时对所有列表进行循环，每次循环各个列表对应的值存储在这些变量中
{%endlist%}

```
cmake_minimum_required(VERSION 3.17)
project(test)
# 通过list给列表添加数据
list(APPEND WORD hello world "hello world")
list(APPEND NAME ace sabo luffy zoro sanji)
# 遍历列表
foreach(item1 item2 IN ZIP_LISTS WORD NAME)
    message(STATUS "当前遍历的值为: item1 = ${item1}, item2=${item2}" )
endforeach()

message("=============================")
# 遍历列表
foreach(item  IN ZIP_LISTS WORD NAME)
    message(STATUS "当前遍历的值为: item1 = ${item_0}, item2=${item_1}" )
endforeach()

#[[输出结果如下
-- 当前遍历的值为: item1 = hello, item2=ace
-- 当前遍历的值为: item1 = world, item2=sabo
-- 当前遍历的值为: item1 = hello world, item2=luffy
-- 当前遍历的值为: item1 = , item2=zoro
-- 当前遍历的值为: item1 = , item2=sanji
=============================
-- 当前遍历的值为: item1 = hello, item2=ace
-- 当前遍历的值为: item1 = world, item2=sabo
-- 当前遍历的值为: item1 = hello world, item2=luffy
-- 当前遍历的值为: item1 = , item2=zoro
-- 当前遍历的值为: item1 = , item2=sanji
]]
```

