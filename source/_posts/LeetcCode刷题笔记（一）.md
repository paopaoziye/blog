---
title: LeetcCode刷题笔记（一）
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
  - 《剑指offer》
categories: 项目实战
keywords: 文章关键词
updated: ''
img: /medias/featureimages/9.webp
date:
summary: LeetCode刷题
---
# LeetcCode刷题笔记
## LeetcCode刷题笔记（一）
### 1.整数
#### 1.1引言
**①简介**
>**概述**：每种编程语言都会提供**不同内存空间**的整数类型
{%list%}
64位系统，C/C++的char通常占据1个字节，short通常占据2个字节，int通常占据4个字节，long通常占据8个字节
{%endlist%}
{%warning%}
注意计算机中的任何数据类型都有其范围，32位整型的表示范围为-2^31~2^31-1，注意溢出问题
{%endwarning%}
**②题目实战**
>**概述**：输入两个`int`型整数，对其进行**除法计算**并返回**商**，不得使用`*`、`/`和`%`
{%list%}
不断使用被除数减去除数，直到剩余的数值小于除数停止，但是当被除数远大于除数时，时间复杂度较高
{%endlist%}
{%right%}
翻倍除数，当被除数小于除数的2^k倍时，商增加2^(k-1)，不断重复该步骤，直到被除数小于除数
{%endright%}
{%warning%}
为了统一正负数的处理，将所有的正数转化为负数，因为负数的表示范围大于正数
{%endwarning%}
```cpp
#include<iostream>

using namespace std;

int divide_two_int(int divide_end,int divide_sor)
{
    //考虑溢出
    if(divide_end == 0x80000000 && divide_sor == -1)
    return INT_MAX;

    //统一为负数，记录负数个数
    int flag = 2;

    if(divide_end > 0){
        divide_end = -divide_end;
        --flag;
    }

    if(divide_sor > 0){
        divide_sor = -divide_sor;
        --flag;
    }
    //注意两个负数的“大小关系”
    int res = 0;
    while(divide_end <= divide_sor){

        //创建并初始化两个中间量
        int num_k = 1;
        int value = divide_sor;
        //注意这里使用的是divide_end <= value+value而不是divide_end <= value
        //而且value必须大于-2^31，否则value+value会溢出
        //利用了短路求值的特性
        while(value >= 0xc0000000 && divide_end <= value+value){
            num_k += num_k;
            value += value;
        }

        res += num_k;
        divide_end -=value;
    }

     return flag == 1 ? -res:res;

    
}

int main()
{
    int a = 14,b = -2;
    cout<<divide_two_int(a,b)<<endl;
}
```

#### 1.2位运算
**①简介**
>**逻辑位运算**：`&`、`|`、`~`和`^`对每一位进行**与**、**或**、**非**和**异或**运算

>**移位运算**：**左移**`<<`和**右移**`>>`，前者使用`0`填补，后者使用`0/符号位`填补**（无符号数/有符号数）**
{%right%}
位运算速度远快于可以使用n>>1代替n/2，n&1代替n%2
{%endright%}
**②tips**
>**`n&(n-1)`**：得到的**结果**会将`n`的**从右至左的第一个**的`1`变为`0`，详细可见[Leetcode191题](https://leetcode.cn/problems/number-of-1-bits/)

>`n |= (1<<i)`：将`n`的第`i`位设置为`1`

>**`n/2`**：若`n`为**偶数**，则`n`中的`1`的个数和`n/2`中**一样**，若为**奇数**，则`n`中`1`的个数比`n/2`**多一个**

>`n>>(32-i)/i & 1`：验证`n`**从左至右/从右至左**的第`i`位是否是`1`，其中`n&1`还可以判断`n`是否是**奇数**

>**异或**：`0^n`的结果是`n`，`n^n`的结果是`0`，详细可见[Leetcode136题](https://leetcode.cn/problems/single-number/description/)
{%list%}
异或运算满足交换律
{%endlist%}

>**`a^b/a&b<<1`**：**前者**可得到`a`和`b`的**无进位和**，**后者**可得到`a`和`b`的**进位**，详细可见[Leetcode371题](https://leetcode.cn/problems/sum-of-two-integers/description/)

**③题目实战**
>**概述**：找出一个数组`nums`中**只出现了一次**的元素，其余元素都出现了**三次**，详细可见[Leetcode137题](https://leetcode.cn/problems/single-number-ii/description/)
```cpp
class Solution {
public:
    int singleNumber(vector<int>& nums) {
        //记得内置类型需要初始化
        int res = 0;
        for(int i = 0;i<32;++i){

            int total = 0;
            for(int num : nums){
                //(n>>i)&1可以获得n的第i位
                total += ((num >> i) & 1);
            }
            if(total%3)
            //n |= (1<<i)将n的第i位设置为1
            res |= (1<<i);
        }
        return res;
    }
};
```
### 2.数组和链表
#### 2.1数组
**①简介**
>**概述**：一段**连续且大小固定**的内存空间，**创建数组时**需要先指定**数组的大小**，可能会有**空闲空间**
{%list%}
C++等语言提供动态数组，当容量不足时，重新分配一段更大的空间并将其复制到新空间中
{%endlist%}

**②双指针**
>**概述**：使用两个**方向相反**或者**方向相同**的**“指针”**`p1`、`p2`扫描数组，这里的**“指针”**只是一种**定位元素**的手段
{%list%}
前者通常用于求排序数组的两个元素之和等，后者常常用于求正数数组的子数组的和或者乘积
{%endlist%}
>**方向相反**：`p1`指向**第一个**元素，`p2`指向**最后一个**元素，**两元素之和**小于指定值，**右移**`p1`，反之**左移**`p2`
{%right%}
当发现随着一个元素的递增，另一个元素是递减的，就可以考虑采用双指针
{%endright%}
>**方向相同**：`p1`、`p2`都指向数组的**第一个**元素，右移`p2`**扩大**子数组，右移`p1`**缩小**子数组

**③题目实战**
>**三数之和**：给定一个数组`nums`，求出所有**不重复的三元组**，其中三个元素的**和**为`0`，详细可见[Leetcode15题](https://leetcode.cn/problems/3sum/description/)
{%list%}
将数组排序，固定一个数字i，将其转化为和为-i的两数之和问题，利用双指针即可
{%endlist%}
{%right%}
排序之后，可以很容易排除重复的三元组
{%endright%}
```cpp
class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        vector<vector<int>> res; 
        int size = nums.size();
        //对数组进行排序，时间复杂度为O(nlogn)
        sort(nums.begin(),nums.end());
        //枚举a，其中a是三元素中最小的元素
        for(int a_ptr = 0; a_ptr < size; ++a_ptr){
            //确保a不和上一次的a重复
            //因为数组已经是排序好了的，只要保证a和上一个a不重复，就可以保证每次的a都是不同的
            if(a_ptr > 0 && nums[a_ptr] == nums[a_ptr-1])
            continue;
            //c是三元素中最大的，所以将其指针指向排序后的数组末尾元素
            int c_ptr = size-1;
            int bc_sum = -nums[a_ptr];
            //b比a大，所以先将其指向a_ptr+1
            for(int b_ptr = a_ptr+1; b_ptr < size; ++b_ptr){
                //保证b不会和之前的b重复，道理同a
                if(b_ptr > a_ptr+1 && nums[b_ptr] == nums[b_ptr-1])
                continue;
                //如果b、c之和小于bc_sum，则左移c的指针，进行调整
                while(b_ptr < c_ptr && nums[b_ptr]+nums[c_ptr] > bc_sum){
                    --c_ptr;
                }
                if(b_ptr == c_ptr){
                    //如果b、c指针重合，则说明这个a的绝对值太小了，需要换a
                    break;
                }
                //满足条件则将其添加到结果中
                if(nums[b_ptr]+nums[c_ptr] == bc_sum)
                res.push_back({nums[a_ptr],nums[b_ptr],nums[c_ptr]});
            }
        }
        return res;
    }
};
```
>**长度最小子数组**：求出一个**正数**数组中**长度最小**且和大于`target`的子数组，详细可见[LCR8题](https://leetcode.cn/problems/2VG8Kg/description/)
{%list%}
类似思路还有LCR9题
{%endlist%}
```cpp
class Solution {
public:
    int minSubArrayLen(int target, vector<int>& nums) {
        int right = 0,left = 0;
        int sum = 0,length = INT_MAX;

        for(;right < nums.size();++right){
            //不需要重复计算sum
            sum += nums[right];
            //满足一定条件时，尝试缩小子数组
            while(left <= right && sum >=target){
                if(right-left+1 < length){
                    length = right-left+1;
                }
                //注意这里使用了后缀++，节省了代码
                sum -= nums[left++];
            }
        }
        return length == INT_MAX ? 0 : length ;
    }
};
```
#### 2.2链表