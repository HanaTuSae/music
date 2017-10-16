<!-- 当前问题
          1.transform移动歌词导致字体模糊
          2.停止播放进入歌词页面，歌词无法同步
          3.无法查看完整歌词
          4.touchstart和touchmove冲突问题
          5.超过1小时的歌词解析错误
          6.歌曲时间过长，播放时链接失效自动重新播放
 -->
<template>
  <div class="play" :style="{backgroundImage:'url('+audio.imgsrc+')'}">
    <div class="blur" ><img src="../assets/blur.jpg"></div>
  <!-- 头部 -->
  <div class="nav">
    <div class="back"><i class="back-icon" @click="isShow"></i></div>
    <div class="name">{{audio.name}}</div>
    <div class="share"><i class="share-icon" @click="share"></i></div>
  </div>

<!-- 歌曲列表 -->

<transition name="isShowMusicList">
<div class="music-list" v-show="isShowMusicList">
<div class="maskLayer" @click="closeMusicList"></div>
<div class="musicList-main" ref="musicListMain">
<tr v-for="(music,index) in musicData" >
  <span class="music-index">{{index+1}}</span>
  <span class="music-name" @click="changeMusic(index)" :class="{active:index==audio.index}">{{music.name}} </span>
</tr>
</div>
</div>
</transition>

  <!-- 图片 -->
  <div class="context">

    <!-- 歌词 -->
    <transition name="isShowLyric" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" :duration="300">
  <div class="lyric" v-show="isShowLyric" >
  <!-- 音量 控制-->
    <div class="volume">
      <span><i class="volume-cion"></i></span>
      <!-- <input type="range" name="" min="0" max="100" value="100" @click="changeVolume" id="volume"> -->
      <!-- 使用mint-ui的range组件控制音量 -->
      <mt-range v-model="rangeValue" class="mtrange"></mt-range>
    </div>
    <div class="lyricMain" @click="closeLyric">
      <div class="loading" v-show="isLoadingLyric"><mt-spinner :type="2" color="white" class="mt-spinner"></mt-spinner></div>
      <div class="lyricContent" v-show="!isLoadingLyric" ref="lyricContent" id="lyricContent">
        <ul :style="styleUl" id="lyricUl">
          <li v-for="(lyric,index) in currentLyric" :class="{active: index===currentLyricIndex}" >{{lyric.txt}}</li>
        </ul>
      </div>
    </div>
  </div>
</transition>

    <!-- 背景和遮罩层，使用blur卡顿 -->
    <!-- <div class="contextImgSrc" :style="{backgroundImage:'url('+audio.imgsrc+')'}"></div> -->
    <!-- <div class="blur" ><img src="../assets/blur.jpg"></div> -->
    <!--  旋转图片-->
    <transition name="isShowImg" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" :duration="300">
    <div class="img" v-show="!isShowLyric" @click="showLyric"><img :src="audio.imgsrc" id="transformImg" ref="transformImg"></div>
  </transition>

    <div class="bar">
      <!-- 播放时间 -->
      <span class="nowTime">{{nowTime}}</span>
      <!-- 进度条 -->
      <span class="totalBar"><span class="nowBar" id="nowBar"><i class="nowBar-icon"></i></span></span>
      <!-- 总时间 -->
      <span class="endTime">{{totalTime}}</span>
    </div>
  
  <!-- 按钮 -->
  <div class="audio">
    <!-- 播放顺序 -->
    <div class="order"><i class="order-icon" :style="orderIcon" @click="order"></i></div>
    <!-- 上一首 -->
    <div class="prev"><i class="prev-icon" @click="prevMusic"></i></div>
    <!-- 播放暂停 -->
    <div class="start"><i class="start-icon" @click="playMusic" :class="playImgSrc"></i></div>
    <!-- 下一首 -->
    <div class="next"><i class="next-icon" @click="nextMusic"></i></div>
    <!-- 播放列表 -->
    <div class="musiclist"><i class="musiclist-icon" @click="showMusicList"></i></div>
  </div>
  </div>
  </div>
</template>

<script>
export default {
  name: 'play',
  data () {
    return {
      nowTime:'00:00',
      totalTime:'00:00',
      isShowMusicList:false,
      continueClick:null,
      rangeValue:100,
      currentLyric:[],
      currentLyricIndex:-1,
      currentTimeNum:0,
      lrcHeight:0,
      styleUl:{
        transform:  'translate3d(0,0,0) scale(1)',
        height:0+'px'
      },
      orderIcon:{
        backgroundImage:'url('+require('../assets/icon/list-loop.svg')+')'
      },
      startX:0,
      startY:0,
      moveEndX:0,
      moveEndY:0
    }
  },
  created(){
  },
  computed:{
  musicData(){
      return this.$store.state.musicData;
    },
    audio(){
      return this.$store.state.audio;
    },
    playImgSrc(){
      return this.$store.state.playImgSrc;
    },
    playing(){
      return this.$store.state.playing;
    },
    isShowLyric(){
      return this.$store.state.isShowLyric;
    },
    isLoadingLyric(){
      return this.$store.state.isLoadingLyric;
    },
    lyricData(){
      return this.$store.state.lyricData;
    },
    orderFlag(){
      return this.$store.state.orderFlag;
    }
  },
  watch:{
    //监听rangeValue变量
    rangeValue:{
      handler(val,oldval){
        var audioDom=document.getElementById("audio");
        audioDom.volume=(val/100).toFixed(1);
      },
      deep:true
    },
    lyricData:{
      handler(val,oldval){
        if(val==''){
          this.currentLyric= [{'txt': '暂无歌词'}];
        }else if(val=='error'){
          this.currentLyric= [{'txt': '加载失败'}];
        }else{
          this.getLyric();
          this.filterLyric();
          this.styleUl.height=this.currentLyric.length*45+'px';
        }
        // 初始化歌词内容
        this.lrcHeight=0;
        this.styleUl.transform='translate3d(0,0,0) scale(1)';
        this.currentLyricIndex=-1;
      },
      deep:true
    },
    audio:{
      handler(val,oldval){
        var nowBar=document.getElementById("nowBar");
        if(val.src=='')
        this.$store.dispatch('lyric',this.musicData[val.index].id);
        this.nowTime="00:00";
        this.currentTimeNum=0;
        nowBar.style.width=0;
      },
      deep:true
    },
    currentTimeNum:{
      handler(val,oldval){
        // console.log(val);
        for(var i in this.currentLyric){
          // if(this.currentLyric[i].time===val){
          //   this.currentLyricIndex=parseInt(i);//当前播放行歌词index，用以判断歌词高亮
          // }
          i=parseInt(i);
          this.playLyric(i);//当前播放行歌词i，用以判断歌词高亮
          if(this.currentLyric[i].time<=val){
            this.getActiveIndex(i);
          }
        }
      },
      deep:true
    },
    // isShowLyric:{
    //   handler(val,oldval){
    //          if(val==true){
    //   for(var i in this.currentLyric){
    //       i=parseInt(i);
    //       if(this.currentLyric[i].time<=this.currentTimeNum){
    //         setTimeout(this.getActiveIndex(i),2000);
    //         console.log(i);
    //       }
    //     }
    //  }
    //   },
    //   deep:true
    // }
  },
  mounted: function() {
     var _this=this;
     var interval="";
     var styleUl=document.getElementById("lyricContent");
     var audioDom=document.getElementById("audio");
     var nowBar=document.getElementById("nowBar");
     var transformImg=document.getElementById("transformImg");

     audioDom.addEventListener('play',function(){
      // 数据实时更新，使用$nextTick
        _this.$nextTick(function(){
          // 获取时间总长度
        _this.totalTime=_this.changTimeStyle(audioDom.duration);
        // 获取当前时间长度
        _this.nowTime=_this.changTimeStyle(audioDom.currentTime);
        //获取当前进度条位置
        nowBar.style.width=((audioDom.currentTime/audioDom.duration)*100).toFixed(2)+"%";
      })
        //定时1秒刷新一次数据
        interval=setInterval(function(){
        _this.$nextTick(function(){
        _this.nowTime=_this.changTimeStyle(audioDom.currentTime);
        _this.currentTimeNum=Math.floor(audioDom.currentTime);
        nowBar.style.width=((audioDom.currentTime/audioDom.duration)*100).toFixed(2)+"%";
      })
    },1000);
        // 音乐开始时图片转动
        transformImg.style.animationPlayState="running";
        // _this.$refs.transformImg.style.animationPlayState="running";
    })

     audioDom.addEventListener('pause',function(){
      // 清除定时器
      clearInterval(interval);
      // 音乐停止时图片停止转动
      transformImg.style.animationPlayState="paused";
      // _this.$refs.transformImg.style.animationPlayState="paused";
     })

     audioDom.addEventListener('ended',function(){
      clearInterval(interval);
      _this.nowTime="00:00";
      nowBar.style.width=0;
     })

     audioDom.addEventListener('error',function(){
      if(audioDom.error.code!=4){
        var currentTime=_this.currentTimeNum;
        _this.changeMusic(_this.audio.index);
        console.log(currentTime);
        if('fastSeek' in audioDom){
          audioDom.fastSeek(currentTime)
        }
        // audioDom.currentTime=currentTime;
      }
     })

     // styleUl.addEventListener('touchstart',function(ev){
     //  var e=ev || window.event;
     //  // e.preventDefault();
     //  _this.startX=e.changedTouches[0].pageX;
     //  _this.startY=e.changedTouches[0].pageY;
     // })

     // styleUl.addEventListener('touchmove',function(ev){
     //  var e=ev || window.event;
     //  // e.preventDefault();
     //  _this.moveEndX=e.changedTouches[0].pageX;
     //  _this.moveEndY=e.changedTouches[0].pageY;
     //  var X=_this.moveEndX-_this.startX;
     //  var Y=_this.moveEndY-_this.startY;
     //  if ( Math.abs(Y) > Math.abs(X) && Y > 0){
     //    _this.styleUl.transform='translateY(0px)';
     //  }else if(Math.abs(Y) > Math.abs(X) && Y < 0){
     //    _this.styleUl.transform='translateY(0px)';
     //  }
     // })

     // styleUl.addEventListener('touchend',function(ev){
     //  var e=ev || window.event;
     //  styleUl.removeEventListener('touchstart',function(){});
     //  styleUl.removeEventListener('touchmove',function(){});
     // })
},
  methods:{
    //播放界面关闭
    isShow(){
    this.$store.commit('isShow',true);
    this.$store.commit('isShowLyric',false);
    },

    //播放列表展示和关闭
    showMusicList(){
      this.isShowMusicList=true;
    },

    //上一首
    prevMusic(){
      var index=this.audio.index==0?this.musicData.length-1:this.audio.index-1;
      var _this=this;
      var config={
        method: 'post',
            url: '/api/play-music',
            data: {
            musicID:this.musicData[index].id
            }
        }
      this.$store.commit('newaudio',{index:index,src:''});

      // 判断连续点击，2s内连续点击只做最后一次请求
      if(this.continueClick!=null){
        clearTimeout(this.continueClick);
      }
      this.continueClick=setTimeout(()=>{

        // 播放请求
      this.axios(config).then(function(response){
        if(_this.audio.index===index){// 超过2s点击判断是否为最后一次请求
        var src=response.data.data[0].url;
        _this.$store.commit('newaudio',{index:index,src:src});
        _this.$store.commit('play',true);
        _this.$store.commit('playImgSrc','stopImgSrc');
      }
      }).catch(function(response){
        console.log(response)
      });
      },2000)
    },
    //下一首
    nextMusic(){
      var index=this.audio.index==this.musicData.length-1?0:this.audio.index+1;
      var _this=this;
      //加载歌词请求
      // this.$store.dispatch('lyric',this.musicData[this.audio.index].id);
      var config={
        method: 'post',
            url: '/api/play-music',
            data: {
            musicID:this.musicData[index].id
            }
        }
      this.$store.commit('newaudio',{index:index,src:''});

      // 判断连续点击，2s内连续点击只做最后一次请求
      if(this.continueClick!=null){
        clearTimeout(this.continueClick);
      }
      this.continueClick=setTimeout(()=>{

        // 播放请求
        this.axios(config).then(function(response){
          if(_this.audio.index===index){// 超过2s点击判断是否为最后一次请求
            var src=response.data.data[0].url;
            _this.$store.commit('newaudio',{index:index,src:src});
            _this.$store.commit('play',true);
            _this.$store.commit('playImgSrc','stopImgSrc');
          }
      }).catch(function(response){
        console.log(response)
      });
      },2000)
      
    },

    //播放暂停
    playMusic(){
      if(this.playing){
      this.audio.audioDom.pause();
      this.$store.commit('play',false);
      this.$store.commit('playImgSrc','playImgSrc');
      //图片旋转暂停
      // this.$refs.transformImg.style.animationPlayState="paused";
    }else{
      // if(this.audio.audioDom.error){
        // this.changeMusic(this.audio.index);
        if(this.audio.src){
          this.audio.audioDom.play();
          this.$store.commit('play',true);
          this.$store.commit('playImgSrc','stopImgSrc');
        }else{
          this.$toast('请点击歌曲播放');
        }
      // }else{
        // this.audio.audioDom.play();
        // this.$store.commit('play',true);
      // }
      // this.$refs.transformImg.style.animationPlayState="running";
    }
    },

    //切换歌曲
    changeMusic(index){
    var _this=this;
    var config={
        method: 'post',
            url: '/api/play-music',
            // headers:{'Content-Type': 'application/json'},
            data: {
            musicID:this.musicData[index].id
            }
        }
    this.$store.commit('newaudio',{index:index,src:''});

    // 判断连续点击，2s内连续点击只做最后一次请求
    if(this.continueClick!=null){
        clearTimeout(this.continueClick);
      }
      this.continueClick=setTimeout(()=>{

        // 播放请求
    this.axios(config).then(function(response){
      if(_this.audio.index===index){//超过2s点击判断是否为最后一次请求
        var src=response.data.data[0].url;
        _this.$store.commit('newaudio',{index:index,src:src});
        _this.$store.commit('play',true);
        _this.$store.commit('playImgSrc','stopImgSrc');
      }
      }).catch(function(response){
        console.log(response)
      });
      },2000)
  },

  //时间格式化
    changTimeStyle(time){
      var m=Math.floor(time/60);
      var s=Math.floor(time%60);
      m=m<10?'0'+m:m;
      s=s<10?'0'+s:s;
      return m+":"+s;
    },
    // 关闭播放列表
    closeMusicList(){
      var musicListMain=this.$refs.musicListMain;
      var e=window.event;
      if(musicListMain.contains(e.target)||musicListMain===e.target){}else{
        this.isShowMusicList=false;
        }
    },

    // 打开歌词界面
    showLyric(){
      this.$store.commit('isShowLyric',true);
    },

    // 关闭歌词界面
    closeLyric(){
      this.$store.commit('isShowLyric',false);
    },
    onLyricChange(nowPropress){
    },

    //分享
    share(){
      this.$toast('功能尚未完成');
    },

    //解析歌词
    // 思路：1、把歌词进行处理以时间和歌词组成一个对象，放入currentLyric数组中
    // 2、在playLric方法中根据当前的时间进行匹配歌词
    getLyric(){
      var lyrics=this.lyricData.split("\n");
      var timeReg= /\[\d*:\d*((\.|\:)\d*)*\]/g;
      var lrcObj=[];
      for(var i in lyrics){
        var timeRegExpArr=lyrics[i].match(timeReg);
        if(!timeRegExpArr) continue;
        var txt=lyrics[i].replace(timeReg,'');
        // 处理时间
        for(var j in timeRegExpArr){
          var array={};
          var k=timeRegExpArr[j];
          var min =Number(String(k.match(/\[\d*/i)).slice(1));
          var sec = Number(String(k.match(/\:\d*/i)).slice(1));
          var time=min*60+sec;
          array.time=time;
          array.txt=txt;
          lrcObj.push(array);
        }
      }
      this.currentLyric=lrcObj;
    },

    //判断歌词高亮
    playLyric(index){
      // index=parseInt(index);
      if(index==this.currentLyric.length-1&&this.currentTimeNum>=this.currentLyric[index].time){
        this.currentLyricIndex=index;
      }
      else if(this.currentTimeNum>=this.currentLyric[index].time&&this.currentTimeNum<this.currentLyric[index+1].time){
        this.currentLyricIndex=index;
      }
    },

    //歌词滚动
    getActiveIndex(index){
        // this.styleUl.marginTop=this.lrcHeight-index*40+'px';
        var activeLi=document.getElementById('lyricUl').getElementsByTagName('li');
        // var activedLiHeight=0;
        // // if(parseInt(index)>0){
        //   for(var i=0;i<=index;i++){
        //     activedLiHeight=activedLiHeight+activeLi[i].clientHeight;
        //   }
        //   activedLiHeight=0-activedLiHeight;
        // }
        this.lrcHeight=index===0?0:this.lrcHeight-activeLi[index].clientHeight;
        this.styleUl.transform='translate3d(0,'+this.lrcHeight+'px,0) scale(1)';
        // this.styleUl.marginTop=this.lrcHeight+'px';

    },

    //歌词过滤空值
    filterLyric(){
      //  filter
      for(var i = 0 ;i<this.currentLyric.length;i++)
         {
             if(this.currentLyric[i].txt == "" || typeof(this.currentLyric[i].txt) == "undefined")
             {
                      this.currentLyric.splice(i,1);
                      i==0?i=0:i=i-1;
             }
         }
          //歌词按时间从小到大排序
          this.currentLyric.sort(function(a,b){return a.time-b.time;});
    },

    // 播放顺序
    order(){
      switch(this.orderFlag){
        case 1:
          this.audio.audioDom.loop=true;
          this.getOrder(2,'单曲循环',require('../assets/icon/single-loop.svg'));
          break;
        case 2:
          this.audio.audioDom.loop=false;
          this.getOrder(3,'随机播放',require('../assets/icon/list-random.svg'));
          break;
        case 3:
          this.getOrder(1,'循环播放',require('../assets/icon/list-loop.svg'));
          break;
      }
    },

    // 修改播放顺序的图标、提示信息等
    getOrder(flag,msg,url){
        this.$store.commit('getOrderFlag',flag);
        this.$toast(msg);
        this.orderIcon.backgroundImage='url('+url+')';
    }
  }
}
</script>

<style lang="scss" scoped>
@mixin iconStyle($pictureUrl,$backSize){
  background: url($pictureUrl) no-repeat center center;
  background-size: $backSize;
}
.lyric{
  // flex:8;
  width:100%;
  height:100%;
  display:flex;
  // overflow: hidden;
  // z-index:300;
  flex-direction:column;
  // background-color:#e6e6e6;
  .volume {
    display:flex;
    margin-top:10px;
    z-index:300;
    span {
      width:30px;
      display:flex;
      justify-content:center;
      align-items:center;
      margin-left:5%;
      .volume-cion{
        width:20px;
        height:20px;
        @include iconStyle('../assets/icon/volume.svg',contain);
      }
    }
    .mtrange{
      flex:1;
      margin-right:10%;
    }
  }
  .lyricMain{
    flex:1;
    // width:100%;
    height:100%;
    display:flex;
     margin: 15px 0 85px 0;
    overflow: hidden;
    z-index:300;
    .loading{
    flex:1;
    overflow: auto;
    display:flex;
    justify-content: center;
    align-items: center;
    .mt-spinner{
      width:50px;
      height:50px;
    }
  }
  .lyricContent{
    flex:1;
    display:flex;
    // margin: 20px 0 50px 0;
    overflow: hidden;
    // z-index:300;
    position:relative;
    ul,li{
      list-style-type: none;
    }
    ul{
      // flex:1;
      display:flex;
      flex-direction:column;
      transition: transform .8s;
      position: absolute;
      top:40%;
      left:0;
      width:100%;
      // z-index:300;
      // height:100%;
      li{
        width:90%;
        // height:60px;
        line-height:25px;
        text-align: center;
        font-size:18px;
        padding:0 5%;
        color:#999;
        transition: color .8s;
        padding-bottom:20px;
        transform: none;
      }
      li.active{
        // color:#8B2500;
        color:white;
      }
    }
    }
  }
}
.maskLayer{
  width:100%;
  height:100%;
  z-index: 400;
  // opacity: 0.8;
  // filter: alpha(opacity=80);
  background:rgba(0,0,0,0.3);
  // filter: opacity(0.5) brightness(55%);
  position:relative;
  top:0;
  left:0;
}

.play{
  display:flex;
  flex-direction:column;
  width:100%;
  height:100%;
  position:absolute;
  left: 0;
  top:0;
  background-repeat: no-repeat;
  background-position: center center;
  background-size:cover;
  .blur{
      position: absolute;
      left:0;
      top:0;
      width:100%;
      height:100%;
      img{
      width:100%;
      height:100%;
      display:block;
      filter: opacity(0.95) brightness(55%);
      //模糊效果blur属性导致移动端卡顿
    }
  }
// 头部
  .nav{
    display: flex;
    align-items:center;
    // background-color: #515151;
    width:100%;
    height:40px;
    align-items:center;
    z-index:99;
    border-bottom: 1px solid rgba(255,255,255,0.3);
    margin-bottom: 1px;
    .back{
      flex:2;
      text-align:left;
      margin-left: 10px;
      display:flex;
      align-items:center;
      .back-icon{
        @include iconStyle('../assets/icon/back.svg',contain);
        width:25px;
        height:25px;
      }
    }
    .name{
      flex:5;
      height:40px;
      line-height: 40px;
      color:white;
      text-align:center;
      overflow:hidden;
    }
    .share{
      flex:2;
      text-align:right;
      margin-right:10px;
      .share-icon{
        @include iconStyle('../assets/icon/share.svg',contain);
        width:25px;
        height:25px;
      }
    }
  }
// 歌曲列表
  .music-list{
    width:100%;
    height:100%;
    position:absolute;
    top:0;
    left:0;
    z-index:400;
  }
  .musicList-main{
    width:100%;
    height:50%;
    position: absolute;
    left:0;
    top:50%;
    z-index: 400;
    overflow-x:hidden;
    overflow-y: auto;
    background-color:#e6e6e6;
    tr{
      height:30px;
    }
    tr:active{
      background-color: #cdcdcd;
    }
    span{
      line-height: 30px;
      display:inline-block;
    }
    .music-index{
      width:10%;
      text-align: center;
      vertical-align: top;
    }
    .music-name{
      width: 75%;
      cursor: pointer;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;//文字超出部分省略号显示
      -webkit-tap-highlight-color: rgba(0,0,0,0);
     -webkit-tap-highlight-color: transparent;
    }
    .music-name.active{
      color:#8B2500;
    }
  }

  // 歌曲列表动画
  .isShowMusicList-enter-active {
      transition: all .5s linear;
    }
.isShowMusicList-leave-active {
      transition: all .5s linear;
    }
.isShowMusicList-enter,.isShowMusicList-leave-active{
      transform: translateY(100%);
      opacity: 0;
    }

// 背景
  .context{
    flex:1;
    height:100%;
    position: relative;
    top:0;
    left:0;
    overflow: hidden;
    .contextImgSrc{
      width:100%;
      height:100%;
      position: absolute;
      left:0;
      top:0;
      background-repeat: no-repeat;
      background-position: center center;
      background-size:cover;
    }
  .img{
    width:100%;
    height:86%;
    position: absolute;
    left:0;
    top:0;
    z-index: 99;
    transition:all .3s ease-in;
  }
    .img img{
      width:250px;
      height:250px;
      position: absolute;
      left:50%;
      top:50%;
      margin-left: -125px;
      margin-top:-125px;
      border-radius: 100%;
      // transition: transform 1000ms;
      animation:transformImg 60s infinite linear;
      animation-play-state:paused;
    }
    .bar{
      width:80%;
      height:15px;
      display:flex;
      align-items:center;
      font-size: 14px;
      position: absolute;
      left:50%;
      bottom:65px;
      margin-left: -40%;
      span{
        display:inline-block;
      }
      .nowTime,.endTime{
        // width:40px;
        // height:15px;
        color:white;
        flex:1;
        text-align:center;
      }
      .totalBar{
        height:2px;
        flex:6;
        margin:0 5px;
        background-color: #e6e6e6;
        border: none;
        position: relative;
        .nowBar{
          width:0;
          height:100%;
          background-color:#8B2500;
          position: absolute;
          top:0;
          .nowBar-icon{
            width:10px;
            height:10px;

          }
        }
      }
    }
  }
// 播放按钮
  .audio{
    display:flex;
    height:60px;
    width:100%;
    position:absolute;
    bottom:0;
    left:0;
    z-index: 100;
    .order{
      flex:1;
      display:flex;
      align-items:center;
      justify-content:center;
      .order-icon{
        @include iconStyle('../assets/icon/list-loop.svg',contain);
      }
    }
    .prev{
      flex:1;
      display:flex;
      align-items:center;
      justify-content:center;
      .prev-icon{
        width:35px;
        height:35px;
        transform:scaleX(-1);//水平翻转
        @include iconStyle('../assets/icon/next.svg',contain);
      }
    }
    .start{
      flex:1;
      display:flex;
      align-items:center;
      justify-content:center;
      .start-icon{
        width:45px;
        height:45px;
      }
    }
    .next{
      flex:1;
      display:flex;
      align-items:center;
      justify-content:center;
      .next-icon{
        width:35px;
        height:35px;
        @include iconStyle('../assets/icon/next.svg',contain);
      }
    }
    .musiclist{
      flex:1;
      display:flex;
      align-items:center;
      justify-content:center;
      transition:all .3s ease-in;
      .musiclist-icon{
        @include iconStyle('../assets/icon/musicMenu.png',contain);
      }
    }
  }
  i{
    display:inline-block;
    width:30px;
    height:30px;
    cursor: pointer;
  }
}
.playImgSrc{
      @include iconStyle('../assets/icon/play.svg',contain);
    }
.stopImgSrc{
      @include iconStyle('../assets/icon/stop.svg',contain);
    }
    @keyframes transformImg{
      0%{transform:rotate(0deg);}
      100%{transform:rotate(360deg);}
    }
</style>