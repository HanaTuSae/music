<template>
  <div id="app">
    <!-- 遮罩层 -->
    <transition name="isShowMaskLayer">
      <div class="maskLayer" @click="close" v-show="isShowMaskLayer"></div>
    </transition>

    <!-- <transition name="isshow"> -->
    <div class="show" v-show="isShow">

      <!-- 左侧栏 -->
      <transition name="isShowAsideMenu" mode="out-in">
        <MMenu v-show="isShowAsideMenu"></MMenu>
      </transition>

      <transition name="isShowHeader" mode="out-in">
        <div class="headerRouter" v-show="isShowHeader">

          <!-- 头部 -->
          <MHeader></MHeader>

          <!-- 路由页面 -->
          <div class="routerView">
            <transition :name="isShowRouter">
              <keep-alive>
                <router-view ></router-view>
              </keep-alive>
            </transition>
          </div>
        </div>
      </transition>

      <!-- 搜索 -->
      <transition :name="isShowList" mode="out-in">
        <Find v-show="isShowFind"></Find>
      </transition>

      <!-- 歌单详情 -->
      <transition :name="isShowList" mode="out-in">
        <songlistDetail v-show="isShowSonglistDetail"></songlistDetail>
      </transition>

      <!-- 歌单列表 -->
      <transition :name="isShowList" mode="out-in">
        <allSonglist v-show="isShowSonglistDetail"></allSonglist>
      </transition>

      <!-- 排行榜列表 -->
      <transition :name="isShowList" mode="out-in">
        <toplistSort v-show="isShowToplistSort"></toplistSort>
      </transition>

      <!-- 排行榜详情 -->
      <transition :name="isShowList" mode="out-in">
        <toplist v-show="isShowToplist"></toplist>
      </transition>

      <!-- Mini播放器 -->
      <MFooter></MFooter>
    </div>
    <!-- </transition> -->

    <!-- 播放界面 -->
    <transition name="show" mode="out-in">
      <Play v-show="!isShow"></Play>
    </transition>

    <transition name="isShowMusicList" out-in>
      <PlayMusicList v-show="isShowMusicList"></PlayMusicList>
    </transition>

    <audio v-bind:src="audio.src" ref="audio" id="audio" controls="controls" :autoplay="playing" hidden="hidden">当前浏览器不支持audio</audio>
  </div>
</template>

<script>
import MHeader from './components/Header.vue';
import MMenu from './components/AsideMenu.vue';
import Find from './components/Find.vue';
import MFooter from './components/Footer.vue';
import Play from './components/Play.vue';
import PlayMusicList from './components/PlayMusicList.vue';
import songlistDetail from './components/songlistDetail.vue';
import toplistSort from './components/toplistSort.vue';
import toplist from './components/toplist.vue';
import allSonglist from './components/allSonglist.vue';

export default {
  name: 'app',
  components: { MHeader,MMenu,MFooter,Play,Find,PlayMusicList,songlistDetail,toplistSort,toplist,allSonglist},
  data(){
    return {
      isShowList:'isShowFind',
      isShowRouter:'',
      startX:null,
      startY:null,
      moveEndX:null,
      moveEndY:null,
      isTouch:false,
      routerView:document
    }
  },
  created(){
  },
  computed:{
    isShow(){
      return this.$store.state.isShow;
    },
    isShowAsideMenu(){
      return this.$store.state.isShowAsideMenu;
    },
    audio(){
      return this.$store.state.audio;
    },
    playing(){
      return this.$store.state.playing;
    },
    isShowFind(){
      return this.$store.state.isShowFind;
    },
    musicData(){
      return this.$store.state.musicData;
    },
    orderFlag(){
      return this.$store.state.orderFlag;
    },
    isShowMaskLayer(){
      return this.$store.state.isShowMaskLayer;
    },
    isShowMusicList(){
      return this.$store.state.isShowMusicList;
    },
    isShowHeader(){
      return this.$store.state.isShowHeader;
    },
    isShowSonglistDetail(){
      return this.$store.state.isShowSonglistDetail;
    },
    isShowToplistSort(){
      return this.$store.state.isShowToplistSort;
    },
    isShowToplist(){
      return this.$store.state.isShowToplist;
    }
  },
  watch:{
    '$route'(to,from){
      var routerList=['/','/musiclist','/recommend','/read'];
      var toPathIndex=routerList.indexOf(to.path);
      var fromPathIndex=routerList.indexOf(from.path);
      if(toPathIndex>-1&&fromPathIndex>-1){
        toPathIndex<fromPathIndex?this.isShowRouter='isShowRouterRight':this.isShowRouter='isShowRouterLeft';
      }
    }
  },
  mounted: function() {
    // var hasAudio = !!(document.createElement('audio').canPlayType);
    if(!this.$refs.audio){
      this.$toast('不支持audio');
    }
    this.$store.commit('audioDom',{name:'audioDom',audioDom:this.$refs.audio});
    var _this=this;
    this.$refs.audio.addEventListener('ended',function(){
      _this.next();
    })

    this.routerView=document.getElementsByClassName('routerView')[0];
    this.routerView.addEventListener('touchstart',_this.touchStart,false);
    this.routerView.addEventListener('touchmove',_this.touchMove,false);
    this.routerView.addEventListener('touchend',_this.touchEnd,false);
    // this.routerView.removeEventListener('touchstart',_this.touchStart,false);
    // this.routerView.removeEventListener('touchmove',_this.touchMove,false);
    // this.routerView.removeEventListener('touchend',_this.touchEnd,false);
  },
  updated(){
  },
  methods:{
    next(){
      var index='';
      switch(this.orderFlag){
        case 1:index=this.audio.index==this.musicData.length-1?0:this.audio.index+1;break;
        case 2:return;break;
        case 3:index=this.getRandomNum(0,this.musicData.length-1);break;
      }
      var _this=this;
      var config={
        method: 'post',
        url: '/api/play-music',
        data: {
          musicID:this.musicData[index].id
        }
      }
      this.$store.commit('newaudio',{index:index,src:''});
      this.axios(config).then(function(response){
        if(_this.audio.index===index){
          var src=response.data.data[0].url;
          _this.$store.commit('newaudio',{index:index,src:src});
        }
      }).catch(function(response){
        console.log(response)
      });
    },

    // 在min和max之间生成一个整数
    getRandomNum(min,max){
      return Math.floor(Math.random()*(max-min+1)+min);
    },

    close(){
      this.$store.commit('isShowMaskLayer',false);
      this.$store.commit('isShowMusicList',false);
      this.$store.commit('isShowAsideMenu',false);
    },
    touchStart(ev){
      var e=ev || window.event;
      // e.preventDefault();
      // e.stopPropagation();
      this.startX=e.changedTouches[0].pageX;
      this.startY=e.changedTouches[0].pageY;
      // this.isTouch=true;
    },
    touchMove(ev){
      var e=ev || window.event;
      // e.preventDefault();
      // if(this.isTouch){
      // e.stopPropagation();
      this.moveEndX=e.changedTouches[0].pageX;
      this.moveEndY=e.changedTouches[0].pageY;
      // var X=this.moveEndX-this.startX;
      // var Y=this.moveEndY-this.startY;
      // var routerPath=this.$route.path;
      //   if ( Math.abs(X) > Math.abs(Y) && X > 0){//手指向右滑动
      //   if(routerPath==='/recommend'){
      //   }else if(routerPath==='/read'){
      //   }
      // }else if(Math.abs(X) > Math.abs(Y) && X < 0){//手指向左滑动
      //   if(routerPath==='/recommend'){
      //   }else if(routerPath==='/musiclist'||routerPath==='/'){
      //   }
      // }
      // }
      // this.isTouch=false;
    },
    touchEnd(ev){
      var e=ev || window.event;
      // e.stopPropagation();
      if(this.moveEndX){
        var X=this.moveEndX-this.startX;
        var Y=this.moveEndY-this.startY;
        var routerPath=this.$route.path;
        if ( Math.abs(X) > Math.abs(Y) && X > 100){//向右滑动
          if(routerPath==='/recommend'){
            this.$router.push('/musiclist');
          }else if(routerPath==='/read'){
            this.$router.push('/recommend');
          }
        }else if(Math.abs(X) > Math.abs(Y) && X < -100){//向左滑动
          if(routerPath==='/recommend'){
            this.$router.push('/read');
          }else if(routerPath==='/musiclist'||routerPath==='/'){
            this.$router.push('/recommend');
          }
        }
      }
      this.moveEndX=null;
    }
  }
}
</script>

<style lang="scss">
*{
  padding:0;
  margin: 0;
}
html,body{
  width:100%;
  height:100%;
  overflow: hidden;
  user-select:none;//页面内容不能选中
}
i,a,button,span,li{
  outline: none;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  -webkit-tap-highlight-color: transparent;
}
#app,.show{
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  color: #2c3e50;
  flex-direction:column;
  width:100%;
  height:100%;
}
#app{
  position: relative;
  .maskLayer{
    width:100%;
    height:100%;
    z-index: 350;
    // opacity: 0.8;
    // filter: alpha(opacity=80);
    background:rgba(0,0,0,0.3);
    // filter: opacity(0.5) brightness(55%);
    position:absolute;
    top:0;
    left:0;
  }
}
.show{
  display: flex;
  position: absolute;
  top:0;
  left: 0;
  .headerRouter{
    flex:1;
    display:flex;
    flex-direction:column;
    overflow: hidden;
    .routerView{
      flex:1;
      display:flex;
      position: relative;
    }
  }
}

// 主页动画

// 播放界面动画
.show-enter-active {
  transition: all .5s ease-out;
}
.show-leave-active {
  transition: all .5s ease-out;
}
.show-enter, .show-leave-active {
  transform: translateY(100%);
  opacity: 0;
}

// 头部动画
.isShowHeader-enter-active{
  transition: all .5s ease-out;
}
.isShowHeader-enter{
  transform: translateX(-100%);
  opacity: 0;
}
// 搜索动画
.isShowFind-enter-active {
  transition: all .5s ease-out;
}
.isShowFind-leave-active {
  transition: all .0s ease-out;
}
.isShowFind-enter,.isShowFind-leave-active{
  transform: translateX(100%);
  opacity: 0;
}
//侧栏动画
.isShowAsideMenu-enter-active {
  transition: all .5s ease-out;
}
.isShowAsideMenu-leave-active {
  transition: all .5s ease-out;
}
.isShowAsideMenu-enter,.isShowAsideMenu-leave-active{
  transform: translateX(-100%);
  opacity: 0;
}
// 遮罩层动画
.isShowMaskLayer-enter-active {
  transition: all .5s ease-out;
}
.isShowMaskLayer-leave-active {
  transition: all .5s ease-out;
}
.isShowMaskLayer-enter,.isShowMaskLayer-leave-active{
  opacity: 0;
}
// 路由动画
.isShowRouterLeft-enter-active,.isShowRouterRight-enter-active {
  transition: all .5s linear;
}
.isShowRouterLeft-leave-active,.isShowRouterRight-leave-active {
  transition: all .5s linear;
}
.isShowRouterLeft-enter,.isShowRouterRight-leave-active{
  transform: translateX(100%);
  // opacity: 0;
}
.isShowRouterLeft-leave-active,.isShowRouterRight-enter{
  transform: translateX(-100%);
  // opacity: 0;
}

// 歌曲列表动画
.isShowMusicList-enter-active {
  transition: all .5s ease-out;
}
.isShowMusicList-leave-active {
  transition: all .5s ease-out;
}
.isShowMusicList-enter,.isShowMusicList-leave-active{
  transform: translateY(100%);
  opacity: 0;
}

@media screen and (min-width: 768px){
  html,body{
    width:460px;
    margin: 0 auto;
    box-shadow: 0 0 20px gray;
  }
}
</style>
