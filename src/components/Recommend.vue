<template>
<div class="recommend">
  <div class="nav">
    <router-link to="/recommend/music" class="nav-menu" :class="{linkActive:this.getRoutePath==='/recommend'}">
      {{recommend.music}}
    </router-link>
    <router-link to="/recommend/video" class="nav-menu">{{recommend.video}}</router-link>
    <router-link to="/recommend/radio" class="nav-menu">{{recommend.radio}}</router-link>
  </div>
  <div class="recommend-content">
    <transition :name="isShowRouter">
      <keep-alive>
        <router-view ></router-view>
      </keep-alive>
    </transition>
  </div>
</div>
</template>

<script>
export default {
  name: 'recommend',
  data () {
    return {
      recommend:{
        music:'音乐',
        video:'视频',
        radio:'电台'
      },
      isShowRouter:''
    }
  },
  created(){
  },
  computed:{
    getRoutePath(){
      return this.$route.path;
    }
  },
  watch:{
    '$route'(to,from){
      var routerList=['/recommend','/recommend/music','/recommend/video','/recommend/radio'];
      var toPathIndex=routerList.indexOf(to.path);
      var fromPathIndex=routerList.indexOf(from.path);
      if(toPathIndex>-1&&fromPathIndex>-1){
        toPathIndex<fromPathIndex?this.isShowRouter='isShowRouterRight':this.isShowRouter='isShowRouterLeft';
      }
    }
  },
  mounted() {
    var _this=this;
    this.routerView=document.getElementsByClassName('recommend-content')[0];
    this.routerView.addEventListener('touchstart',_this.touchStart,false);
    this.routerView.addEventListener('touchmove',_this.touchMove,false);
    this.routerView.addEventListener('touchend',_this.touchEnd,false);
  },
  methods:{
    touchStart(ev){
      var e=ev || window.event;
      // e.preventDefault();
      e.stopPropagation();
      this.startX=e.changedTouches[0].pageX;
      this.startY=e.changedTouches[0].pageY;
    },
    touchMove(ev){
      var e=ev || window.event;
      // e.preventDefault();
      e.stopPropagation();
      this.moveEndX=e.changedTouches[0].pageX;
      this.moveEndY=e.changedTouches[0].pageY;
    },
    touchEnd(ev){
      var e=ev || window.event;
      e.stopPropagation();
      if(this.moveEndX){
        var X=this.moveEndX-this.startX;
        var Y=this.moveEndY-this.startY;
        var routerPath=this.$route.path;
        if ( Math.abs(X) > Math.abs(Y) && X > 100){//向右滑动
          if(routerPath==='/recommend/video'){
            this.$router.push('/recommend/music');
          }else if(routerPath==='/recommend/radio'){
            this.$router.push('/recommend/video');
          }else if(routerPath==='/recommend/music'||routerPath==='/recommend'){
            this.$router.push('/musiclist');
          }
        }else if(Math.abs(X) > Math.abs(Y) && X < -100){//向左滑动
          if(routerPath==='/recommend/video'){
            this.$router.push('/recommend/radio');
          }else if(routerPath==='/recommend/music'||routerPath==='/recommend'){
            this.$router.push('/recommend/video');
          }else if(routerPath==='/recommend/radio'){
            this.$router.push('/read');
          }
        }
      }
      this.moveEndX=null;
    }
  }
}
</script>

<style lang="scss" scoped>
.recommend{
  // flex:1;
  position: absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
  display:flex;
  flex-direction:column;
  .nav{
    width:80%;
    height:40px;
    display:flex;
    align-items:center;
    margin:0 10%;
    .nav-menu{
      flex:1;
      line-height:40px;
      display:inline-block;
      text-align:center;
      color:#333;
      text-decoration:none;
      font-size:18px;
    }
    .linkActive{
      color:#f44336;
      border-bottom: 2px solid #f44336;
      margin-bottom: 2px;
    }
  }
  .recommend-content{
    flex:1;
    overflow-y: auto;
    overflow-x: hidden;
    display:flex;
    position: relative;
  }
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
</style>