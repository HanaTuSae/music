# vue音乐播放器2.0

> 这是一个学习vue.js写的模仿网易云音乐的音乐播放器，只实现了APP的部分功能。

## 演示
[在线演示](http://music.hanatusae.xin/music2)(请使用chrome开发者手机演示模式预览)

### 移动端演示
扫二维码在手机上查看效果更好  
![](http://hanatusae.oss-cn-shenzhen.aliyuncs.com/music2.0.png)

### 预览图
![](http://hanatusae.oss-cn-shenzhen.aliyuncs.com/1.0%E5%8A%9F%E8%83%BD%E5%B1%95%E7%A4%BA.gif)

## 技术栈
> vue2.0、vuex、vue-router、axios、webpack、sass、express、localstorage、css3

## 组件
1. 本地歌曲列表
2. 推荐页面
3. 推荐歌曲页面
4. 推荐视频页面
5. 推荐电台页面
6. 分享页面
7. 搜索页面
8. 播放页面
9. 歌词页面
10. 排行榜分类
11. 排行榜详情
12. 推荐歌单
13. 歌单详情
14. mini播放器
15. 播放列表
16. 标题页面

## 构建
使用vue-cli脚手架构建工具搭建
> npm install webpack -g  
> npm install vue-cli -g  
> vue init webpack vuetest（vuetest为项目名称）  
> cd vuetest  
> npm install

## 开发中的问题
1. vue2.0的官方推荐HTTP请求工具是axios，请求返回的数据是处理过的json数据，所以数据在`res.data`里

2. vue提供了一个数据管理工具vuex，可以进行数据上的通信，例如不同组件间的数据处理

3. vue2.0通过ref来获取元素节点，例如
```
<div ref="test">test</div>
...js code
this.$ref.test
```
4. vue有一个路由系统vue-router，可以用来创建单页应用

## 安装 Build Setup
``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

```
## About
源码地址： [vuemusic](https://github.com/HanaTuSae/music/tree/2.0)  
个人网站： [HanaTuSae](http://hanatusae.xin)  
github: [HanaTuSae](https://github.com/HanaTuSae)  
