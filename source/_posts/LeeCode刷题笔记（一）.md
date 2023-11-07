---
title: LeeCode刷题笔记（一）
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
  - LeeCode
categories: 项目实战
keywords: 文章关键词
updated: ''
img: /medias/featureimages/28.webp
date:
summary: 数组
---
# LeeCode刷题笔记（一）
## 一、二分法
### 1.二分查找（704）
```
int search(int* nums, int numsSize, int target){
    int left = 0;
    int right = numsSize-1;
    int middle = 0;
    //若left小于等于right，说明区间中元素不为0
    while(left<=right) {
        //更新查找下标middle的值
        middle = (left+right)/2;
        //此时target可能会在[left,middle-1]区间中
        if(nums[middle] > target) {
            right = middle-1;
        } 
        //此时target可能会在[middle+1,right]区间中
        else if(nums[middle] < target) {
            left = middle+1;
        } 
        //当前下标元素等于target值时，返回middle
        else if(nums[middle] == target){
            return middle;
        }
    }
    //若未找到target元素，返回-1
    return -1;
}
```
>当题目中出现**排序好**的数组且**没有重复元素**时，可以考虑使用二分法
使用二分法时，要注意**边界条件**
