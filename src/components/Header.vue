<template>
  <div class="header">
   <div class="nav">
    <div class="menu"><i class="menu-icon" @click="showAsideMenu"></i></div>
    <div class="music">
      <div class="musiclist"><router-link to="/musiclist" :class="{linkActive:this.getRoutePath==='/'}"><i class="musiclist-icon" :class="{active:this.getRoutePath==='/musiclist'||this.getRoutePath==='/'}"></i></router-link></div>
      <div class="recommend"><router-link to="/recommend"><i class="recommend-icon" :class="{active:this.getRoutePath==='/recommend'}"></i></router-link></div>
      <div class="read"><router-link to="/read"><i class="read-icon" :class="{active:this.getRoutePath==='/read'}"></i></router-link></div>
    </div>
    <div class="find"><i class="find-icon" @click="isShowFind"></i></div>
   </div>
  </div>
</template>

<script>
export default {
  name: 'header',
  data () {
    return {
    }
  },
  computed:{
    isShowAsideMenu(){
      return this.$store.state.isShowAsideMenu;
    },
    getRoutePath(){
      return this.$route.path;
    },
    isShowMaskLayer(){
      return this.$store.state.isShowMaskLayer;
    }
    // isShowFind(){
    //   return this.$store.state.isShowFind;
    // }
  },
  mounted(){
  //   var _this=this;
  //   this.$nextTick(function(){
  //   console.log(_this.$route.path);
  //   _this.routePath=_this.$route.path;
  // })
  },
  methods:{
    showAsideMenu(){
      this.isShowAsideMenu==true?this.$store.commit('isShowAsideMenu',false):this.$store.commit('isShowAsideMenu',true);
      this.$store.commit('isShowMaskLayer',true);
    },
    isShowFind(){
      this.$store.commit('isShowFind',true);
    }
}
}
</script>

<style lang="scss" scoped>
@mixin iconStyle($pictureUrl){
  background: url($pictureUrl) no-repeat center center;
  background-size: contain;
}
.header{
  width:100%;
  height:40px;
  background-color: #f44336;
  .nav{
  width:100%;
  height:100%;
  display: flex;
  .menu{
    flex:1;
    padding-left:10px;
    display:flex;
    align-items:center;
    .menu-icon{
      @include iconStyle('../assets/icon/menu.png');
    }
  }
  .music{
    flex:3;
    display:flex;
    .musiclist{
      flex:1;
      display:flex;
      justify-content:center;
      align-items:center;
      .musiclist-icon{
        @include iconStyle('../assets/icon/music.svg');
      }
      .musiclist-icon.active{
      @include iconStyle('../assets/icon/music-active.svg');
    }
    }
    .recommend{
      flex:1;
      display:flex;
      justify-content:center;
      align-items:center;
      .recommend-icon{
        @include iconStyle('../assets/icon/recommend.svg');
      }
       .recommend-icon.active{
      @include iconStyle('../assets/icon/recommend-active.svg');
    }
    }
    .read{
      flex:1;
      display:flex;
      justify-content:center;
      align-items:center;
      .read-icon{
        @include iconStyle('../assets/icon/read.svg');
      }
      .read-icon.active{
        @include iconStyle('../assets/icon/read-active.svg');
      }
    }
  }
  .find{
    flex:1;
    padding-right: 10px;
    display:flex;
    justify-content:flex-end;
    align-items:center;
    .find-icon{
      @include iconStyle('../assets/icon/find.png');
    }
  }
  }
}
i{
  display:inline-block;
  width:22px;
  height:22px;
  cursor:pointer;
    }
    .linkActive{
      width:100%;
      height:40px;
      display:flex;
      justify-content:center;
      align-items:center;
      border-bottom: 2px solid white;
      margin-bottom: 2px;
    }
</style>