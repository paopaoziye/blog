---
title: python（深度学习篇）
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
  - 深度学习
  - python
categories: 机器学习
keywords: 文章关键词
updated: ''
img: /medias/featureimages/30.webp
date:
summary: 利用python搭建深度学习框架

---
# python（深度学习篇）
### 1.环境配置（Ubuntu22.04）
**1.1安装Anaconda**：Anaconda就是可以便捷获取包且对包能够进行管理，同时对环境可以统一管理的发行版本；Anaconda包含了conda、Python在内的超过180个科学包及其依赖项。
①到官网下载安装包：`wget https://repo.anaconda.com/archive/Anaconda3-2023.03-1-Linux-x86_64.sh`
②到**对应目录**下安装：`bash Anaconda3-2023.03-1-Linux-x86_64.sh`
③打开conda基础环境：`conda activate base`
#`conda list`查看Anaconda环境情况
**1.2环境管理**
```
# 1.查看conda的版本号
conda --version
# 2.查看虚拟环境列表
conda info --envs
# 3.创建虚拟环境并指定python的版本号为3.8
conda create -n virtualname pip python=3.9
# 4.激活虚拟环境
conda activate virtualname
# 5.退出虚拟环境
conda deactivate
# 6.删除虚拟环境
conda remove --name virtualname --all
```
**1.3包管理**

```
# 1.安装包
conda install PackageName
# 2.安装多个包
conda install name1 name2 ...
# 3.安装包并指定版本号
conda install PackageName=版本号
# 4.卸载包
conda remove PackageName
# 5.更新包
conda update PackageName
# 6.更新环境中的所有包
conda update --all
# 7.列出已安装的包
conda list
# 8.搜寻包
conda search PackageName
```
**1.4在pycharm中使用Anaconda环境**
①创建新环境：`conda create --name env_name package_names`
#env_name为环境名；package_names为环境下使用的包的名称，可以在后面加`=版本号`确定版本，也可以使用多个包（空格隔开）
#创建新环境后会进行安装
②激活虚拟环境：`conda activate pytorch`
③设置pycharm：[Add new Interpreter]→[conda environment]→[Interpreter]→填写环境所在路径
#环境路径通常为：`/home/xxxx/anaconda3/env/bin/[环境名]`




