---
title: Hexo个人博客搭建
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
  - Hexo
categories: 软技能
keywords: 文章关键词
updated: ''
img: /medias/featureimages/18.webp
date:
summary: hexo博客框架搭建、个性化和文章写法
---

# Hexo个人博客搭建
## 博客部署
### 1.环境搭建
**1.1Node.js安装：**详细过程略，记得在命令行中输入`node -v`检查`Node.js`是否在环境变量中，倘若不在，则手动将`Node.js`的**安装路径**添加到环境变量中，**右击我的电脑->属性->高级系统设置->环境变量**，在系统变量下找到名为`path`的变量名，选中`path`，或者双击，然后将你`node.js`的**安装路径**放在 `path`变量值的最后面，如果添加之前`path`值最后有**英文的分号**，则直接将路径添加进去即可，如果没有，先添加分号，然后点击保存。
**1.2npm包管理器设置：**
①设置npm的镜像源
```
# 查看npm的配置
npm config list
# 默认源
npm config set registry https://registry.npmjs.org
# 临时改变镜像源
npm --registry=https://registry.npm.taobao.org
# 永久设置为淘宝镜像源
npm config set registry https://registry.npm.taobao.org
# 另一种方式，编辑 ~/.npmrc 加入下面内容
registry = https://registry.npm.taobao.org
```
②设置npm的内置路径（可选）
https://blog.csdn.net/jianleking/article/details/79130667
**1.3git安装：**详细过程略，同理检查其是否在环境变量中
### 2.GitHub设置
**2.1创建仓库：**名字必须是`<用户名>.github.io`，并勾选`Initialize this repository with a README`
**2.2配置Git用户名和邮箱：**
①在`git bash`中输入如下命令
```
git config --global user.name "此处填写你注册时的用户名"
git config --global user.email "此处填写你注册时的邮箱"
# 一般只要不报错，可以跳过下面寻找.gitconfig文件
```
②找到`.gitconfig`文件，文件存放位置在`C:/Users/[username]/.gitconfig`（未找到的话，请开启显示**隐藏文件**的功能），检查配置是否成功
### 3.Hexo框架搭建
**3.1Hexo安装：**选择一个位置存放博客，然后新建一个文件夹，先不要点进去，在`git bash`中输入如下命令
```
# hexo框架的安装
npm install -g hexo-cli
# 等上一个命令完成后，在输入下面的命令
hexo init <新建文件夹的名称>  #初始化文件夹
cd <新建文件夹的名称>
npm install  # 安装博客所需要的依赖文件
```
**3.2和GitHub建立连接**
①安装插件，在博客目录下的`git bash`中输入如下命令：`npm install hexo-deployer-git --save`
②将本地目录与GitHub关联起来：`ssh-keygen -t rsa -C "你的邮箱地址"`
③SSH密钥设置：在`C:/Users/[username]`目录下找到名为`.ssh`的文件夹，文件夹内会有两个文件，一个`id_rsa.pub`一个`id_rsa`，用文本编辑器打开`id_rsa.pub`，复制里面的的内容,然后打开Github，点击右上角的头像`Settings`选择`SSH and GPG keys`,点击`New SSH key`将之前复制的内容粘帖到`Key`的框中，上面的`Title`可以随意，点击`Add SSH key`完成添加，并在`git bash`中输入`ssh -T git@github.com`测试是否连接成功
④修改Hexo配置文件：打开`_config.yml`，滑到文件最底部，填入如下代码，并如下所示
```
type: git
repo: git@github.com:Github用户名/github用户名.github.io.git  
//也可使用https地址，如：https://github.com/Github用户名/Github用户名.github.io.git            
branch: master
```
⑤在浏览器中打开`https://<用户名>.github.io`，即可查看上传的网页

## 博客个性化
### 1.主题设置
**1.1主题安装：**在博客目录下执行下面的命令，即可进行主题的下载，这里选择的是`matery`主题，有两个版本，稳定版本和最新版本 (不定期更新优化)，自主选择版本
```
git clone https://github.com/blinkfox/hexo-theme-matery themes/matery     # 稳定版
git clone -b develop https://github.com/blinkfox/hexo-theme-matery themes/matery   #最新版(不定期进行优化更新)
```
**1.2修改博客主题：**将博客配置文件中的`theme`值修改为你下载主题的**文件夹名**，其他**博客配置文件修改**可见官网（必要，修改博客配置文件后要运行执行 `hexo clean && hexo g`，重新生成博客文件）https://github.com/blinkfox/hexo-theme-matery/blob/develop/README_CN.md
### 2.自定义文件/插件配置
**2.1代码高亮**
①下载：在博客文件夹下`git bash`中运行`npm i -S hexo-prism-plugin`
②配置：修改Hexo根目录下`_config.yml`文件中`highlight.enable`的值为`false`，并新增`prism`插件相关的配置
```
prism_plugin:
  mode: 'preprocess'    # realtime/preprocess
  theme: 'tomorrow'
  line_number: false    # default false
  custom_css:
```
**2.2搜索**
①下载：`npm install hexo-generator-search --save`
②配置：在Hexo根目录下的`_config.yml`文件中，新增以下的配置项
```
search:
  path: search.xml
  field: post
```
**2.3中文链接转拼音**
①下载：`npm i hexo-permalink-pinyin --save`
②配置:在Hexo根目录下的`_config.yml`文件中，新增以下的配置项
```
permalink_pinyin:
  enable: true
  separator: '-' # default: '-'
```
**2.4文章字数统计插件**
①下载：`npm i --save hexo-wordcount`
②配置：在Hexo根目录下的`_config.yml`文件中，新增以下的配置项
```
wordCount:
  enable: false # 将这个值设置为 true 即可.
  postWordCount: true
  min2read: true
  totalCount: true
```
**2.5自定义标签设置**
①步骤
首先在主题目录下新建`scripts`目录，接着在此目录下新建`block.js`文件，填入以下代码：
```
hexo.extend.tag.register('wrong', function(args, content){
    var className =  args.join(' ');
    var formattedContent = content.replace(/\n/g, '<br>');  // 将换行符替换为 <br> 标签
    return '<div class="uk-alert uk-alert-danger"><i class="fas fa-exclamation-triangle"></i> ' + formattedContent + '</div>';
  }, {ends: true});
  
  hexo.extend.tag.register('right', function(args, content){
    var className =  args.join(' ');
    var formattedContent = content.replace(/\n/g, '<br>');  // 将换行符替换为 <br> 标签
    return '<div class="uk-alert uk-alert-success"><i class="fa fa-check-circle"></i> ' + formattedContent + '</div>';
  }, {ends: true});
  
  hexo.extend.tag.register('warning', function(args, content){
    var className =  args.join(' ');
    var formattedContent = content.replace(/\n/g, '<br>');  // 将换行符替换为 <br> 标签
    return '<div class="uk-alert uk-alert-warning"><i class="fa fa-exclamation-circle"></i> ' + formattedContent + '</div>';
  }, {ends: true});

  hexo.extend.tag.register('list', function(args, content){
    var className =  args.join(' ');
    var formattedContent = content.replace(/\n/g, '<br>');  // 将换行符替换为 <br> 标签
    return '<div class="uk-alert uk-alert-list"><i class="fas fa-list-ul"></i> ' +'<br>'+formattedContent + '</div>';
  }, {ends: true});
```
随后在`head.ejs`文件添加以下css样式：
```
    <style type="text/css">
        .uk-alert {
            margin-bottom: 5px;
            padding: 5px;
            background: #ebf7fd;
            color: #2d7091;
            border: 0px solid #ffffff;
            border-radius: 4px;
            text-shadow: 0 1px 0 #ffffff;
        }
        .uk-alert-success {
            background: rgba(120, 199, 9, 0.1);
            color: rgba(120, 199, 9);
            border-left: 6px solid rgba(120, 199, 9);
            font-weight: 600;
        }
        .uk-alert-warning {
            background: #FFF8E9;
            color: #FFB91F;
            border-left: 6px solid #FFB91F;
            font-weight: 600;
        }
        .uk-alert-danger {
            background: #FFE6E6;
            color: #FF7979;
            border-left: 6px solid#FF7979;
            font-weight: 600;
        }
        .uk-alert-list {
            background: #ECF7FE;
            color: #3CACF4;
            border-left: 6px solid#3CACF4;
            font-weight: 600;
        }
 </style>
```
②解析：以warning部分作为例子
>`block.js`文件最重要的参数主要有`warning`（决定了正文中的书写格式）、`div class`（决定了容器的名字，即彩色背景）和`i class`（决定了图标的样式）

>`head.ejs`文件中主要修改具体样式，详细可询问ChatGPT

③示例
代码：
```
{%wrong%}
错误
{%endwrong%}
{%right%}
正确
{%endright%}
{%warning%}
警告
{%endwarning%}
{%list%}
列表项1
列表项2
{%endlist%}
```
{%wrong%}
错误
{%endwrong%}
{%right%}
正确
{%endright%}
{%warning%}
警告
{%endwarning%}
{%list%}
列表项1
列表项2
{%endlist%}
### 3.主题配置文件修改
**3.1修改页脚：**主题文件的`/layout/_partial/footer.ejs`文件中，包括站点、使用的主题、访问量等
**3.2修改社交链接：**在主题文件的`/layout/_partial/social-link.ejs`文件中，新增、修改你需要的社交链接地址
**3.3修改头像等图片：**修改主题文件的`source/medias`文件中的图片文件
**3.4修改音乐播放器：**在主题的`_config.yml`配置文件中激活music配置即可，详细如下所示
```
# 是否在首页显示音乐
music:
  enable: true
  title:            #非吸底模式有效
    enable: true
    show: 听听音乐
  server: netease   #require music platform: netease, tencent, kugou, xiami, baidu
  type: playlist    #require song, playlist, album, search, artist
  id: 503838841     #require song id / playlist id / album id / search keyword
  fixed: false      # 开启吸底模式
  autoplay: false   # 是否自动播放
  theme: '#42b983'
  loop: 'all'       # 音频循环播放, 可选值: 'all', 'one', 'none'
  order: 'random'   # 音频循环顺序, 可选值: 'list', 'random'
  preload: 'auto'   # 预加载，可选值: 'none', 'metadata', 'auto'
  volume: 0.7       # 默认音量，请注意播放器会记忆用户设置，用户手动设置音量后默认音量即失效
  listFolded: true  # 列表默认折叠
```
#配置文件中还可以修改部分配置信息

## 博客书写
### 1.文章框架
**1.1Front-matter**
在博客根文件夹下`scaffolds`文件夹下新增/修改`post.md`文件，即可修改默认样式，详细样式如下
```
title: 文章名称
seo_title: seo名称
toc: true            # 是否生成目录
indent: true         # 是否首行缩进
comments: true       # 是否允许评论
archive: true        # 是否显示在归档
cover: false         # 是否显示封面
mathjax: false       # 是否渲染公式
pin: false           # 是否首页置顶
top_meta: false      # 是否显示顶部信息
bottom_meta: false   # 是否显示尾部信息
sidebar: [toc]
tag:
  - 标签一
  - 标签二
categories: 分组
keywords: 文章关键词
date: 2021-13-13 00:00
updated: 2021-13-13 00:00
description: 文章摘要
icons: [fas fa-fire red, fas fa-star green]
references:
  - title: 参考资料名称
    url: https://参考资料地址
headimg: https://文章头图
thumbnail: https://右侧缩略图
```
**1.2标题：**`#`为一级标题，`##`为二级标题以此类推，最多六级，记住`#`和文字之间要有**空格**
### 2.正文修饰
**2.1加粗与倾斜**
```
*[文本]* #倾斜
**[文本]** #加粗
***[文本]*** #加粗倾斜
```
**2.2引用**
①格式：`>`后添加**空格**和引用内容，不同的引用以及正文使用**换行**隔开
②实现效果：
> 树1

> 树2

**2.3超链接**
①格式：`[Link Text](link-address)`
②实现效果：[参考文章](http://106.15.109.213/2020/07/25/markdown%E8%AF%AD%E6%B3%95%E4%BB%8B%E7%BB%8D/#6-%E5%BC%95%E7%94%A8%E6%AE%B5%E8%90%BD)
**2.4插入图片**
①单张图片
```
#语法展示及示例
！[Figure](URL www.xxx.com)
#figure此处的文字有时作为图片标题显示，有时不显示，optional，可留空
#URL处也可以不填写url，也可以选择上传本地图片，此时只需填写相对路径即可，
#相对路径指的是在与此markdown文档同路径下的相对路径，可在此md文档同路径下新建img文件夹，
#在此处填/img/xx.png 具体情况具体分析，或许在主题配置文件中亦有提及*
```
②多张图片布局组合排列
```
{% gi total n1-n2-... %}
  ![](url)
  ![](url)
  ![](url)
  ![](url)
  ![](url)
{% endgi %}
#total为图片总的数量,n1为第一行的图片数量,n2为第二行的图片数量
```
**2.5锚点：**锚点与链接基本相同，区别在于锚点是在文章内部相互传送，但只能传送到n级标题的位置
```
[显示内容](#标题)
#注意此处/#代表的是‘标题’这一性质，而非标题的级别，因此不必加n个#来体现标题等级，会自动根据“标题”的内容匹配
```
**2.6代码块：**单行代码使用`包围，多行代码使用```包围