---
title: Git及其应用
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
  - Git
categories: 工具链
keywords: 文章关键词
updated: ''
img: /medias/featureimages/22.webp
date:
summary: git和github
---
# Git
## Git应用
### 1.引言
#### 1.1Git概述
>一个**分布式版本控制系统**，**版本控制**即记录文件**修改历史**，便于**版本切换**
{%warning%}
很少通过拷贝历史版本进行版本控制，因为太占用存储空间
{%endwarning%}
#### 1.2分布式与集中式
>**集中式**：有一个**单一的集中管理的服务器**，从中下载代码，修改后提交
{%list%}
便于管理，但是当中央服务器故障，则无法提交更新
{%endlist%}
>**分布式**：分别有**本地库（个人电脑）**和**远程库（大型代码托管中心）**，从远程库上**克隆**代码进行修改
{%list%}
在本地库和远程库上都可以进行版本控制
{%endlist%}
#### 1.3工作机制
>**代码托管中心**
**局域网**：`GitLab`
**互联网**：`GitHub`、`Gitee`
{%list%}
代码只有一份，通过保存修改历史保存版本
{%endlist%}
{%warning%}
提交到本地库和远程库的代码无法单独删除
{%endwarning%}
![git工作机制](/image/git_1.png)


### 2.Git基本操作
{%list%}
在git bash中进行操作，可以使用linux命令和操作，如tab补全、ctrl+滚轮调整大小等
{%endlist%}
#### 2.1设置用户签名
>**签名**的作用是**区分操作者身份**，**首次安装必须设置**
{%list%}
可以在.gitconfig文件中查看是否设置成功，windows系统下位于C/用户/asus目录下
{%endlist%}
```
git config --global user.name [用户名]
git config --global user.email [用户邮箱]
```
#### 2.2工作流
>`git init`：使得`git`获得该文件夹的**管理权**，使得该文件夹变为**工作区**
{%list%}
会在该文件夹下创建一个.git文件夹
{%endlist%}
>`git add [添加对象]`：将对象添加到**暂存区**
{%list%}
使用git add -A将所有改动添加
{%endlist%}
>`git commit -m "[版本描述信息]" [提交对象]`：将对象提交到**本地库**
{%list%}
若不指定提交对象，则将暂存区所有改动提交
{%endlist%}
#### 2.3查看状态
>`git status`：查看**分支**以及**该分支下显示未添加、未提交文件**等信息
{%list%}
git的修改是先删除修改的那一行，然后重写，所以提示信息是一行新增，一行删除
{%endlist%}
>`git reflog`：查看**本地库的提交信息**
{%list%}
每次提交最前面的黄色字符串就是版本号
{%endlist%}
>`git log`：在`git reflog`的基础上**更加精细**，有**完整版的版本号**以及**提交者**的等信息

#### 2.4分支
{%list%}
分支就是当时创建分支时对应对象的副本，不同的分支有不同的作用（程序员修改、运维测试和用户使用等）
{%endlist%}
{%right%}
可以并行推进多个版本功能开发，分支之间不会互相影响
{%endright%}
>`git branch -v`：**查看**分支

>`git branch [分支名]`：**创建**分支

>`git checkout [分支名]`：**切换**分支

>`git merge [分支名]`：将**指定分支**合并到**当前分支**
{%list%}
合并分支只会影响当前分支，对指定分支无影响，即将指定分支的对应版本提交到当前分支
{%endlist%}
#### 2.5合并冲突
>假设在`master`**分支**下新建了`test`**分支**，分别对**同一个文件修改并提交**后，将`test`合并到`master`，可能会导致**合并冲突**
{%warning%}
合并冲突：合并分支时，当两个分支在同一个文件的同一个位置有两套完全不同的修改，需要人为指定新代码内容
{%endwarning%}
>一开始`master`**分支**下有一个`test.txt`文件，创建`fix`**分支**
```
//创建分支时test.txt代码
12345678
12345678
```
>分别在**两个分支下修改并提交**`test.txt`，随后将`fix`**分支**合并到`master`**分支**
```
//合并时master分支下test.txt文件
12345678 abc
12345678
```
```
//合并时fix分支下的test
12345678 
12345678 ABC
```
>发生**合并冲突**，在`master`**分支**下打开`test.txt`文件，如下所示
{%list%}
git在冲突处显示两份代码的冲突部分，上面的是当前分支的修改，下面的是传入分支的修改
{%endlist%}
```
//合并发生冲突，在master分支下打开test.txt文件
<<<<<<< HEAD
12345678 abc
12345678
=======
12345678 
12345678 ABC
>>>>>>> test
```
>**手动修改冲突**，**保存**文件随后将文件**添加**、**提交**即可解决冲突
{%list%}
手动修改冲突的宗旨就是保持冲突部分代码的行数不变，可以只采用某一个的修改，也可以同时采用
{%endlist%}
{%warning%}
解决冲突时，提交时不能带文件名git commit -m "merge test"
{%endwarning%}
```
//仅仅采用当前分支
12345678 abc
12345678
//仅仅采用指定分支
12345678 
12345678 ABC
//同时采用两个的修改
12345678 abc
12345678 ABC
```
#### 2.6版本控制
>`git reset --hard [版本号]`：将**工作区的文件**变为**对应版本**
{%list%}
版本控制本质上是控制HEAD指针和对应分支指针的指向，通过分支切换将HEAD指向不同的分支，通过reset修改对应分支执行其下不同的版本
{%endlist%}
>`.git`文件夹`HEAD`文件记录了`HEAD`**当前指向分支**,`refs/heads`**目录**下记载**各个分支**的当前指向，如`master`文件记载了`master`的**当前指向的版本号**

![版本控制机制](/image/git_2.png)

### 3.Github远程库
#### 3.1免密登陆
**①SSH密钥登陆**
>**密钥生成**：`C/用户/asus`**目录**下，在`git bash`中输入`ssh-keygen -t rsa -C [github邮箱]`，**敲击三次回车**，会创建`.ssh`目录，其下有**公钥**和**私钥**

>**密钥设置**：在**Github设置**中的`SSH and GPG keys`添加`SSH key`，将**公钥**内容粘贴到**对应位置**即可
{%list%}
每个远程库都对应的HTTPS/SSH链接，其中SSH链接只有设置了公钥之后才能使用
{%endlist%}

**②口令登陆**
>`github settings->develop settings->personal access tokens`生成**登陆口令**
{%right%}
当使用账号密码登陆较难时，可以考虑使用口令登陆
{%endright%}
{%warning%}
口令在生成后最好立刻复制保存，因为界面一刷新就消失了，只能重新生成
{%endwarning%}

#### 3.2工作流
>`git remote add [name] [HTTPS/SSH]`：**保存远程库并命名，便于本地库识别**

>`git remote -v`：**查看保存的远程库**

>`git clone [HTTPS/SSH]`：**将远程库复制到本地库**
{%list%}
clone实质上做了三件事，即拉取代码，初始化本地库，创建别名（初始化为origin）
{%endlist%}
>`git pull [name/HTTPS/SSH] [本地库分支名]`：**利用远程库更新本地库**
{%warning%}
pull拉取过程实质上就是一个合并的过程，可能产生合并冲突
{%endwarning%}
>`git push [name/HTTPS/SSH] [本地库分支名]`：**将本地库分支推送到远程库**
{%list%}
向别人的远程库推送代码需要权限，需要对方邀请自己成为对应库的成员并同意，且每次成员的推送都需要被库的拥有者审核后才能被合并入库（pull request）
{%endlist%}
{%right%}
想要push，必须保证本地库版本高于远程库，所以在修改代码前，最好先pull再进行修改
{%endright%}
>`git fork`：**将一个远程库的代码复制到另一个远程库中**

![github工作机制](/image/git_3.png)

### 4.IDEA集成Git
{%list%}
以VScode为例
{%endlist%}
#### 4.1初始设置
**①忽略设置**
{%list%}
因为一个IDEA可能会生成一些我们不需要入库的文件，如日志文件等
{%endlist%}
>创建`git.ignore`文件（最好是在`.gitconfig`文件所在目录下），在其中添加**需要忽略的文件类型**，随后在`.gitconfig`文件中添加**设置**
```
#忽略设置
[core]
    excludesfile = [git.ignore完整路径]
```
[VScode下C++的git.ignore模板](https://gist.github.com/Yousha/3830712334ac30a90eb6041b932b68d7)
**②IDEA设置**
>`VScode`中内置了对`Git`的支持，**其他IDEA**可能还需要**在相关设置中设置`git.exe`的路径**
