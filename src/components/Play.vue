<!-- 当前问题
          1.transform移动歌词导致字体模糊（使用滚动条移动歌词）
          2.停止播放进入歌词页面，歌词无法同步（已解决）
          3.无法查看完整歌词(已解决)
          4.touchstart和touchmove冲突问题
          5.超过1小时的歌词解析错误
          6.歌曲时间过长，播放时链接失效自动重新播放
          7.左右切换页面有间隙
          8.移动端click事件有延迟
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

  <!-- 图片 -->
  <div class="context">

    <!-- 歌词 -->
    <transition :name="isShowImg" mode="out-in">
  <div class="lyric" v-show="isShowLyric" ref="lyric">
  <!-- 音量 控制-->
    <div class="volume">
      <span><i class="volume-cion"></i></span>
      <!-- <input type="range" name="" min="0" max="100" value="100" @click="changeVolume" id="volume"> -->
      <!-- 使用mint-ui的range组件控制音量 -->
      <mt-range v-model="rangeValue" class="mtrange"></mt-range>
    </div>
    <div class="lyricMain" @click="closeLyric">
      <div class="loading" v-show="isLoadingLyric"><mt-spinner :type="2" color="white" class="mt-spinner"></mt-spinner></div>
      <div class="lyricContent" v-show="!isLoadingLyric" ref="lyricContent">
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
    <transition :name="isShowImg" mode="out-in">
    <div class="img" v-show="!isShowLyric" @click="showLyric"><img :src="audio.imgsrc" ref="transformImg"></div>
  </transition>

    <div class="bar">
      <!-- 播放时间 -->
      <span class="nowTime">{{nowTime}}</span>
      <!-- 进度条 -->
      <div class="totalBar" ref="totalBar" @click="onAudioChange">
          <span class="nowBar" ref="nowBar">
          <span class="nowBar-icon" ref="nowBarIcon"></span>
        </span>
      </div>
      <!-- 总时间 -->
      <span class="endTime">{{totalTime}}</span>
    </div>
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
</template>

<script>
export default {
  name: 'play',
  data () {
    return {
      nowTime:'00:00',
      totalTime:'00:00',
      continueClick:null,
      rangeValue:100,
      currentLyric:[],
      currentLyricIndex:-1,
      currentTimeNum:0,
      isShowImg:'isShowImg',
      lrcHeight:0,
      styleUl:{
        height:0+'px'
      },
      lyricSwiper:false,
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
    },
    isShowMaskLayer(){
      return this.$store.state.isShowMaskLayer;
    },
    isShowMusicList(){
      return this.$store.state.isShowMusicList;
    }
  },
  watch:{
    //监听rangeValue变量
    rangeValue:{
      handler(val,oldval){
        this.audio.audioDom.volume=(val/100).toFixed(1);
      },
      deep:true
    },
    lyricData:{
      handler(val,oldval){
        // 初始化歌词内容
        this.currentLyric='';
        this.lrcHeight=0;
        this.currentLyricIndex=-1;
        this.$refs.lyricContent.scrollTop=0;

        if(val=='empty'){
          this.currentLyric= [{'txt': '暂无歌词'}];
        }else if(val=='error'){
          this.currentLyric= [{'txt': '加载失败'}];
        }else if(val!=''){
          this.getLyric();
          this.filterLyric();
        }
      },
      deep:true
    },
    audio:{
      handler(val,oldval){
        var currentMusic={
          index:val.index,
          id:this.musicData[val.index].id
        }
        if(val.src=='')
        this.$store.dispatch('lyric',currentMusic);
        this.nowTime="00:00";
        this.currentTimeNum=0;
        this.$refs.nowBar.style.width=0;
      },
      deep:true
    },
    currentTimeNum:{
      handler(val,oldval){
        for(let i in this.currentLyric){
          i=parseInt(i);
          this.playLyric(i);//当前播放行歌词i，用以判断歌词高亮
        }
      },
      deep:true
    }
  },
  mounted: function() {
     var _this=this;
     var interval="";
     var audioDom=document.getElementById("audio");
     var transformImg=document.getElementById("transformImg");

     // audio播放监听
     audioDom.addEventListener('play',function(){
      // 数据实时更新，使用$nextTick
        _this.$nextTick(function(){
          // 获取时间总长度
        _this.totalTime=_this.changTimeStyle(audioDom.duration);
        // 获取当前时间长度
        _this.nowTime=_this.changTimeStyle(audioDom.currentTime);
        //获取当前进度条位置
        _this.$refs.nowBar.style.width=((audioDom.currentTime/audioDom.duration)*100).toFixed(2)+"%";
      })
        //定时1秒刷新一次数据
        interval=setInterval(function(){
        _this.$nextTick(function(){
        _this.nowTime=_this.changTimeStyle(audioDom.currentTime);
        _this.currentTimeNum=Math.floor(audioDom.currentTime);
        _this.$refs.nowBar.style.width=((audioDom.currentTime/audioDom.duration)*100).toFixed(2)+"%";
      })
    },1000);
        // 音乐开始时图片转动
        _this.$refs.transformImg.style.animationPlayState="running";
    })

     audioDom.addEventListener('pause',function(){
      // 清除定时器
      clearInterval(interval);
      // 音乐停止时图片停止转动
      _this.$refs.transformImg.style.animationPlayState="paused";
     })

     audioDom.addEventListener('ended',function(){
      clearInterval(interval);
      _this.nowTime="00:00";
      _this.$refs.nowBar.style.width=0;
     })

     audioDom.addEventListener('error',function(){
      if(audioDom.error.code!=4){
        var currentTime=_this.currentTimeNum;
        _this.changeMusic(_this.audio.index);
        console.log(currentTime);
        // if('fastSeek' in audioDom){
          // audioDom.fastSeek(currentTime);
        // }
        audioDom.currentTime=currentTime;
      }
     })

     // 歌词滚动监听
     this.$refs.lyricContent.addEventListener('touchstart',function(ev){
      var e=ev || window.event;
      // e.preventDefault();
      e.stopPropagation();
      _this.startX=e.changedTouches[0].pageX;
      _this.startY=e.changedTouches[0].pageY;
     })

     this.$refs.lyricContent.addEventListener('touchmove',function(ev){
      var e=ev || window.event;
      // e.preventDefault();
      e.stopPropagation();
      if(_this.lyricSwiper===false){
      _this.moveEndX=e.changedTouches[0].pageX;
      _this.moveEndY=e.changedTouches[0].pageY;
      var X=_this.moveEndX-_this.startX;
      var Y=_this.moveEndY-_this.startY;
      var movetop=_this.$refs.lyricContent.scrollTop;
      if ( Math.abs(Y) > Math.abs(X) ){
        _this.$refs.lyricContent.scrollTop=movetop-Y;
      }
    }
    _this.lyricSwiper=true;
     })

     var clearSwiper='';
     this.$refs.lyricContent.addEventListener('touchend',function(ev){
      var e=ev || window.event;
      e.stopPropagation();
      clearTimeout(clearSwiper);
      clearSwiper=setTimeout(function(){
        _this.lyricSwiper=false;
      },1500);
      // styleUl.removeEventListener('touchstart',function(){});
      // styleUl.removeEventListener('touchmove',function(){});
     })

     // 进度条拖动监听
     // this.$refs.nowBarIcon.addEventListener('touchstart',_this.onAudioChange,false);
     var X=0;
     this.$refs.nowBarIcon.addEventListener('touchmove',function(ev){
      if(_this.audio.src===''){
        return;
      }
      var e=ev || window.event;
      if(e.changedTouches[0].pageX<_this.$refs.nowBar.offsetLeft){
        X=0;
      }else if(e.changedTouches[0].pageX>(_this.$refs.totalBar.offsetWidth+_this.$refs.totalBar.offsetLeft)){
        X=_this.$refs.totalBar.offsetWidth;
      }else{
        X=e.changedTouches[0].pageX-_this.$refs.nowBar.offsetLeft;
      }
      // console.log(X);
      _this.$refs.nowBar.style.width=(X/(_this.$refs.totalBar.offsetWidth)*100).toFixed(2)+'%';
      // this.audio.audioDom.currentTime=X/this.$refs.totalBar.offsetWidth*this.audio.audioDom.duration;
      _this.nowTime=_this.changTimeStyle(X/_this.$refs.totalBar.offsetWidth*_this.audio.audioDom.duration);
     })

     this.$refs.nowBarIcon.addEventListener('touchend',function(ev){
      // _this.$refs.nowBar.style.width=(X/(_this.$refs.totalBar.offsetWidth)*100).toFixed(2)+'%';
      _this.audio.audioDom.currentTime=X/_this.$refs.totalBar.offsetWidth*_this.audio.audioDom.duration;
      if(_this.audio.audioDom.paused){
        _this.audio.audioDom.play();
        _this.$store.commit('playImgSrc','stopImgSrc');
      }
      // _this.nowTime=_this.changTimeStyle(_this.audio.audioDom.currentTime);
     })
},
updated(){
  var activeLi=document.getElementById('lyricUl').getElementsByTagName('li');
  var ulheight=0;
  for(let i=0;i<this.currentLyric.length;i++){
    ulheight+=activeLi[i].clientHeight;
    if(this.lyricSwiper===false){
    if(this.currentTimeNum>=this.currentLyric[i].time){
      this.lrcHeight=i===0?0:this.lrcHeight+activeLi[i].clientHeight;
    }
    this.$refs.lyricContent.scrollTop=this.lrcHeight;
    }
  }
  this.styleUl.height=ulheight+'px';
},
  methods:{
    //播放界面关闭
    isShow(){
    this.$store.commit('isShow',true);
    this.$store.commit('isShowLyric',false);
    },

    //播放列表展示
    showMusicList(){
      this.$store.commit('isShowMusicList',true);
        this.$store.commit('isShowMaskLayer',true);
    },

    // 打开歌词界面
    showLyric(){
      this.$store.commit('isShowLyric',true);
    },

    // 关闭歌词界面
    closeLyric(){
      this.$store.commit('isShowLyric',false);
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
      if(this.audio.audioDom.paused){
      if(this.audio.src){
          this.audio.audioDom.play();
          this.$store.commit('play',true);
          this.$store.commit('playImgSrc','stopImgSrc');
        }else{
          this.$toast('请点击歌曲播放');
        }
    }else{
        this.audio.audioDom.pause();
      this.$store.commit('play',false);
      this.$store.commit('playImgSrc','playImgSrc');
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
      if(index==this.currentLyric.length-1&&this.currentTimeNum>=this.currentLyric[index].time){
        this.currentLyricIndex=index;
      }
      else if(this.currentTimeNum>=this.currentLyric[index].time&&this.currentTimeNum<this.currentLyric[index+1].time){
        this.currentLyricIndex=index;
      }
    },

    //歌词滚动
    getActiveIndex(index){
        var activeLi=document.getElementById('lyricUl').getElementsByTagName('li');
        this.lrcHeight=index===0?0:this.lrcHeight+activeLi[index].clientHeight;
        // var num=0;
        // var moveTop=(this.lrcHeight/80).toFixed(2);
        // // console.log(moveTop);
        // var _this=this;
        // var scrollTop=0;
        // var lyricScroll=setInterval(function(){
        //   if(num===80){
        //     clearInterval(lyricScroll);
        //   }else {
        //     _this.$refs.lyricContent.scrollTop+=moveTop;
        //      num++;
        //   }
        //   console.log(scrollTop);
        // },10)
        // clearTimeout(this.lyricScroll);
        // this.lyricScroll=setTimeout(function(){
          this.$refs.lyricContent.scrollTop=this.lrcHeight;
        // },800);45/80   10ms

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
    },

    // 改变播放时间
    onAudioChange(ev){
      if(this.audio.src===''){
        return;
      }
      var e=ev || window.event;
      var X=0;
      if(e.offsetX>this.$refs.totalBar.offsetWidth){
        X=this.$refs.totalBar.offsetWidth;
      }else{
        X=e.offsetX;
      }
      // console.log(X,e.offsetX,this.$refs.totalBar.offsetLeft);
      this.$refs.nowBar.style.width=(X/(this.$refs.totalBar.offsetWidth)*100).toFixed(2)+'%';
      this.audio.audioDom.currentTime=X/this.$refs.totalBar.offsetWidth*this.audio.audioDom.duration;
      this.nowTime=this.changTimeStyle(this.audio.audioDom.currentTime);
      if(this.audio.audioDom.paused){
        this.audio.audioDom.play();
        this.$store.commit('playImgSrc','stopImgSrc');
      }
      // this.currentTimeNum=Math.floor(this.audio.audioDom.currentTime);
    },
  }
}
</script>

<style lang="scss" scoped>
@mixin iconStyle($pictureUrl,$backSize){
  background: url($pictureUrl) no-repeat center center;
  background-size: $backSize;
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
  z-index:30;
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
    width:100%;
    height:40px;
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

// 图片、进度条、音量和歌词
  .context{
    flex:1;
    height:100%;
    position: relative;
    top:0;
    left:0;
    overflow: hidden;
    display:flex;
    flex-direction:column;
    align-items:center;
    //图片
  .img{
    flex:1;
    width:100%;
    z-index: 99;
    display:flex;
    align-items:center;
    justify-content:center;
    img{
      width:200px;
      height:200px;
      border-radius: 100%;
      animation:transformImg 60s infinite linear;
      animation-play-state:paused;
      }
    }
    //音量和歌词
    .lyric{
      flex:1;
      display:flex;
      flex-direction:column;
      width:100%;
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
          height:100%;
          display:flex;
          margin: 10px 0;
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
              overflow: auto;
              position:relative;
              ul,li{
                list-style-type: none;
              }
              ul{
                display:flex;
                flex-direction:column;
                position: absolute;
                top:0;
                left:0;
                width:100%;
                padding:50% 0 50% 0;
                li{
                  width:90%;
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
                  color:white;
                }
              }
             }
            }
          }

    // 进度条
    .bar{
      width:80%;
      height:15px;
      display:flex;
      align-items:center;
      font-size: 14px;
      span{
        display:inline-block;
      }
      .nowTime,.endTime{
        color:white;
        flex:1;
        text-align:center;
      }
      .totalBar{
        height:2px;
        flex:6;
        margin:0 15px 0 5px;
        border: none;
        background-color: #e6e6e6;
          .nowBar{
            height:100%;
            width:0;
            background-color:#8B2500;
            position: relative;
            display:flex;
            align-items:center;
            .nowBar-icon{
              width:10px;
              height:10px;
              border-radius: 100%;
              box-shadow: 0 0 5px gray;
              background-color: #e6e6e6;
              position: absolute;
              left:100%;
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
// 歌词动画
.isShowImg-enter-active {
      transition: all .5s ease-out;
    }
.isShowImg-leave-active {
      transition: all .0s ease-out;
    }
.isShowImg-enter,.isShowImg-leave-active{
      opacity: 0;
    }
@keyframes transformImg{
      0%{transform:rotate(0deg);}
      100%{transform:rotate(360deg);}
}
@media screen and (min-width: 768px){
  .img img{
    width:250px;
    height:250px;
  }
}
</style>