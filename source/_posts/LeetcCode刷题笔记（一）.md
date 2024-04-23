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
64位系统，C/C++char通常占据1个字节，short通常占据2个字节，int通常占据4个字节，long通常占据8个字节
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
**①简介**
>**概述**：由**一系列节点**组成，每个节点包含**指向其他节点的指针**（通常是下一节点），将节点链接为**链状结构**

>**哨兵节点**：通常位于**链表头部**，它的值**没有任何意义**（通常为`0`），**其后节点**才开始保存有意义的信息
{%right%}
哨兵节点简化了代码逻辑，不用判断链表是否为空，不用考虑创建/删除链表头节点的特殊情况
{%endright%}
{%list%}
所以在刷题过程中，第一件事情就是给要处理的链表创建哨兵节点，真正的头节点位于哨兵节点之后
{%endlist%}

>**环**：链表的**最后一个节点**的`next`指针不为空，而是指向**链表中的某个节点**
{%list%}
注意有环的链表，环的入口节点也就是尾节点
{%endlist%}

**②常用方法**
>**前后双指针**：第一个指针在链表中**提前移动k步**，随后移动第二个指针，两者**速度一致**

>**快慢双指针**：**快指针**一次移动**两步**，**慢指针**一次移动**一步**
{%list%}
前后双指针通常用于寻找倒数第k个节点，快慢双指针通常用于寻找环的入口/链表中间节点
{%endlist%}
{%right%}
前后双指针通常用于寻找倒数第k个节点，快慢双指针通常用于寻找环的入口/链表中间节点
{%endright%}
>详细见可见[LCR21题](https://leetcode.cn/problems/SLwz0R/description/)和[LCR22题](https://leetcode.cn/problems/SLwz0R/description/)

**③经典例题**
>**相交链表**：给定两个**单链表**的头节点，请找出并返回两个单链表**相交的起始节点**，详细见可见[LCR23题](https://leetcode.cn/problems/3u1WK4/description/)
```cpp
class Solution {
public:
    ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
        //考虑极端情况
        if(headA == nullptr || headB == nullptr)
        return nullptr;

        //建立两个cur指针以遍历链表
        //假设a的非公共部分有a个节点，b的非公共部分有b个节点，公共部分有c个节点
        //cur_a一直后移，当第一次到结尾时，移动了a+c个节点，然后将其设置为b链表的起始节点
        //cur_b一直后移，第一次到结尾时，移动了b+c个节点，同上将其设置为a链表的起始节点
        //随后cur_a向后移动b个节点，cur_b向后移动a个节点，两个节点正好都移动了a+b+c个节点
        //正好在相交处相遇
        ListNode *cur_a = headA,*cur_b = headB;
        while(cur_a != cur_b){
            cur_a = cur_a == nullptr ? headB : cur_a->next;
            cur_b = cur_b == nullptr ? headA : cur_b->next;
        }
        return cur_a;
        
    }
};
```
>**链表相加**：给定两个**非空链表**`l1`和`l2`来代表两个**非负整数**，将相加结果存储到新链表中，详细可见[LCR25题](https://leetcode.cn/problems/lMSNwu/description/)
{%warning%}
如果将两个链表转化为整数，可能会出现溢出问题，所以还是需要模拟加法逻辑进行运算
{%endwarning%}
```c
class Solution {
public:
    ListNode* rev_list(ListNode* list){
        ListNode *pre = nullptr,*cur = list;
        while(cur != nullptr){
            ListNode *tmp = cur->next;
            cur->next = pre;
            pre = cur;
            cur = tmp;
        }
        return pre;
    }
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        //创建结果链表
        ListNode *res_dummy = new ListNode(0);
        ListNode *res_cur = res_dummy;
        //翻转两个链表，便于模拟加法逻辑
        l1 = rev_list(l1);
        l2 = rev_list(l2);
        int carry = 0,sum = 0;
        while(l1 != nullptr || l2 != nullptr){
            //模拟加法逻辑，将短的那条链表剩余位置用0补充
            sum = (l1 == nullptr ? 0 :l1->val)+(l2 == nullptr ? 0 : l2->val)+carry;
            carry = sum >= 10 ? 1 : 0;
            sum = sum >= 10 ? sum-10 :sum;
            //创建新节点保存对应位的值
            ListNode *newnode = new ListNode(sum);
            res_cur->next = newnode;

            //为一下步做准备，注意这里如果l1，l2已经为空指针就不能向后移动了
            l1 = l1==nullptr ? nullptr : l1->next;
            l2 = l2==nullptr ? nullptr : l2->next;
            res_cur = res_cur->next;
        }
        //考虑是否会有最新的最高位
        if(carry == 1)
        res_cur->next = new ListNode(1);

        ListNode *res = res_dummy->next;
        delete res_dummy;
        return rev_list(res);
    }
};
```
>**重排链表**：详细见可见[LCR26题](https://leetcode.cn/problems/LGjMqU/description/)，使用了**快慢双指针**将链表分为两部分，类似的还有[LCR27题](https://leetcode.cn/problems/aMhZSa/)

```cpp
class Solution {
public:
    ListNode* rev_list(ListNode *list){
        ListNode *pre = nullptr,*cur = list;
        while(cur != nullptr){
            ListNode *tmp = cur->next;
            cur->next = pre;
            pre = cur;
            cur = tmp;
        } 
        return pre;
    }
    void reorderList(ListNode* head) {

        //创建哨兵节点
        ListNode *dummy = new ListNode(0,head);
        //记住这里fast和slow都不能初始化为head，而是初始化为哨兵节点
        ListNode *fast = dummy,*slow = dummy;
        //当链表节点数为偶数时，slow将链表对半分开
        //当链表节点数为奇数时，slow将链表分为两部分，前部分比后部分多一个节点
        while(fast != nullptr&& fast->next != nullptr){
            fast = fast->next->next;
            slow = slow->next;
        }
        //将链表分为两部分
        ListNode *later = slow->next;
        slow->next = nullptr;
        later = rev_list(later);

        //链接两个链表
        //注意拼接两个链表时，需要考虑一个链表长度提前耗尽的情况
        ListNode *cur = head;
        while(cur != nullptr){
            ListNode *tmp1 = cur->next,*tmp2 = later ==nullptr ? 0 : later->next;
            //注意，这里只有在后半部分链表没有走到尽头时，才能插入
            if(later != nullptr)
            later->next = cur->next;
            cur->next = later;
            cur = tmp1;
            later = tmp2;
        }
        return ;
    }
};

```
#### 2.3字符串
**①简介**
>**概述**：本质上是一个**字符数组**，C++提供了字符串类型`string`
{%right%}
可以使用使用两个方向相同的指针提取字符串的子串，同时滑动该子串窗口找到新的字符串
{%endright%}

**②常用概念**
>**变位词**：组成单词的**字母类别**以及**对应字母的个数**相同，只是**排列不同**，如`abc`和`acb`
{%list%}
一组变位词长度相同，可以使用该条件作为先决条件
{%endlist%}
{%right%}
可以使用哈希表记录单词对应字母出现的次数，一组变位词对应的哈希表是相同的
{%endright%}
>可见[LCR14题](https://leetcode.cn/problems/MPnaiL/description/)和[LCR15题](https://leetcode.cn/problems/VabMRr/description/)

>**回文**：**从头到尾**和**从尾到头**读取回文，得到的**内容是一样**的
{%list%}
可以使用方向相反速度相同的双指针判断一个字符串是否是回文，一种是从两端到中心，一种是从中心到两端
{%endlist%}
>可见[LCR18题](https://leetcode.cn/problems/XltzEq/description/)和[LCR19题](https://leetcode.cn/problems/RQku0D/description/)
{%warning%}
注意后者回文中心可能是一个也可能是两个，即两个指针重合或者两个指针相邻
{%endwarning%}
**③经典例题**
>**最长子串**：给定一个字符串`s`，请你找出其中**不含有重复字符**的**最长连续子字符串**的长度，详细见[LCR16题](https://leetcode.cn/problems/wtcaE1/description/)
```cpp
class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        
        //使用无序集合判断字符是否重复出现
        unordered_set<char> a_set;
        int s_len = s.size();

        //使用双指针定位子字符串，均初始化为-1，表示未开始遍历
        int r_ptr = -1,res = 0;
        for(int l_ptr = 0;l_ptr < s_len;++l_ptr){
            //除了第一次进入该循环，之后每次循环的左指针都向右移动，缩小子串
            if(l_ptr!=0){
                a_set.erase(s[l_ptr-1]);
            }
            //在满足条件的情况下，不断右移右指针，扩大子串
            while(r_ptr+1 < s_len && !a_set.count(s[r_ptr+1])){
                a_set.insert(s[r_ptr+1]);
                ++r_ptr;
            }

            res = max(res,r_ptr-l_ptr+1);
        }

        return res;
    }
};
```

>**回文子串**：给定一个**字符串**`s`，请计算这个**字符串**中有多少个**回文子字符串**，详细可见[LCR20题](https://leetcode.cn/problems/a7VOhD/description/)
```cpp
class Solution {
public:
    int countSubstrings(string s) {

        //回文中心可能是一个，也可能是两个，对于一个长度为n的字符串，总共由2n-1个回文中心
        //用两个下标left和right表示回文中心，当left和right相等时，表示回文中心只有一个
        int n = s.size(),res = 0;
        for(int i = 0; i < 2*n-1;++i){
            int left = i/2,right = i/2+i%2;
            while(left >= 0 && right < n && s[left] == s[right]){
                ++res;
                --left;
                ++right;
            }
        }
        return res;
    }
};
```
### 3.线性结构
#### 3.1哈希表
**①简介**
>**概述**：一种常见的数据结构，在哈希表中进行**增删查改**都只需要`O(1)`的时间，本质上是**空间换时间**
{%list%}
在cpp中常用的哈希表类为unordered_map和unordered_set，前者保存键值对，后者只保存键
{%endlist%}

**②类的实现**
>**`RandomizedSet`类**：设计一个数据结构，**插入、删除和随机访问**的**时间复杂度**都是`O(1)`，详细见[LCR30题](https://leetcode.cn/problems/FortPu/description/)
{%list%}
能在O(1)实现随机访问的数据结构只有数组，为了使得插入和删除时间复杂度也是O(1)，添加哈希表结构快速定位
{%endlist%}
{%right%}
注意在不要求排序的情况下从数组中快速删除一个元素，可以将待删除元素和末尾元素互换，删除尾元素即可
{%endright%}
```cpp
class RandomizedSet {

public:
    RandomizedSet() {
        srand((unsigned)time(NULL));
    }
    
    bool insert(int val) {
        //如果已经添加过这个值
        if(indices.count(val)){
            return false;
        }
        //如果没有添加过这个值，则将其插入到数组末尾
        int index = nums.size();
        nums.emplace_back(val);
        indices[val] = index;
        return true;
    }
    
    bool remove(int val) {
        //如果没有添加对应值
        if(!indices.count(val)){
            return false;
        }
        //将待删除元素的位置用末尾元素顶替，随后删除末尾元素即可
        //否则如果val对应元素在数组的中间，删除操作的时间复杂度为O(n)
        int index = indices[val];
        int last = nums.back(); //back()用于返回最后一个元素
        nums[index] = last;
        indices[last] = index;
        nums.pop_back();
        indices.erase(val);
        return true;
    }
    
    int getRandom() {
        int random_index = rand()%nums.size();
        return nums[random_index];
    }

private:
    vector<int> nums;
    unordered_map<int,int> indices;
};
```
>**LUR缓存**：设计并实现一个满足`LRU`**缓存约束**的数据结构，详细见[LCR31题](https://leetcode.cn/problems/FortPu/description/)

**③经典例题**