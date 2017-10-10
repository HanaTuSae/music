<template>
  <div id="app">
  <transition name="isshow">
  <div class="show" v-show="isShow">
    <!-- 左侧栏 -->
    <!-- <transition name="isShowAsideMenu"> -->
      <transition name="isShowAsideMenu" :duration="500" enter-active-class="animated fadeInLeft" leave-active-class="animated fadeOutLeft">
    <MMenu v-show="isShowAsideMenu"></MMenu>
    </transition>

    <!-- 头部 -->
    <transition :name="isShowHeader">
    <MHeader v-show="!isShowFind"></MHeader>
    </transition>

    <!-- 路由页面 -->
    <transition :name="isShowHeader">
    <router-view v-show="!isShowFind"></router-view>
    </transition>

    <!-- 搜索 -->
    <transition name="isShowFind">
    <Find v-show="isShowFind"></Find>
    </transition>

    <!-- Mini播放器 -->
    <MFooter></MFooter>
  </div>
  </transition>

  <!-- 播放界面 -->
  <transition name="show">
    <Play v-show="!isShow"></Play>
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

export default {
  name: 'app',
  components: { MHeader,MMenu,MFooter,Play,Find},
  data(){
    return {
      isShowHeader:'isShowHeader'
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
    }
  },
  mounted: function() {
    var hasVideo = !!(document.createElement('video').canPlayType);
    if(!hasVideo){
      this.$toast('不支持audio');
    }
    this.$store.commit('audioDom',{name:'audioDom',audioDom:this.$refs.audio});
    var _this=this;
    this.$refs.audio.addEventListener('ended',function(){
      _this.next();
    })
},
methods:{
  next(){
    var index=this.audio.index==this.musicData.length-1?0:this.audio.index+1;
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
}
i,a,button,span,li{
  outline: none;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  -webkit-tap-highlight-color: transparent;
}
#app,.show{
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  color: #2c3e50;
  display: flex;
  flex-direction:column;
  width:100%;height:100%;
}
#app{
  position: relative;
}
.show{
  position: absolute;
  top:0;
  left: 0;
  .headerRouter{
    overflow:auto;
  }
}
// 主页动画
.isshow-leave-active {
      transition: all .0s ease-out;
    }
.isshow-leave-active {
      transform: translateY(-100%);
      opacity: 0;
    }

// 播放界面动画
.show-enter-active {
      transition: all .5s ease-out;
    }
.show-leave-active {
      transition: all .5s ease;
    }
.show-enter, .show-leave-active {
      transform: translateY(100%);
      opacity: 0;
    }

// 头部动画
.isShowHeader-enter-active{
  transition: all .5s ease-out;
}
.isShowHeader-enter {
      transform: translateX(-100%);
      opacity: 0;
    }
// 搜索动画
.isShowFind-enter-active {
      transition: all .5s ease-out;
    }
.isShowFind-leave-active {
      transition: all .0s ease;
    }
.isShowFind-enter,.isShowFind-leave-active{
      transform: translateX(100%);
      opacity: 0;
    }
//侧栏动画
// .isShowAsideMenu-enter-active {
//       transition: all .5s ease-out;
//     }
// .isShowAsideMenu-leave-active {
//       transition: all .5s ease;
//     }
// .isShowAsideMenu-enter,.isShowAsideMenu-leave-active{
//       transform: translateX(-100%);
//       opacity: 0;
//     }
@media screen and (min-width: 768px){
html,body{
   width:460px;
   margin: 0 auto;
   box-shadow: 0 0 20px gray;
}
}
</style>
