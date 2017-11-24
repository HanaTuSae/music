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
    <keep-alive>
      <router-view ></router-view>
    </keep-alive>
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
      }
    }
  },
  created(){
  },
  computed:{
    getRoutePath(){
      return this.$route.path;
    }
  },
  mounted() {
  },
  methods:{
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
    overflow: auto;
  }
}
// .loading{
//     flex:1;
//     overflow: auto;
//     display:flex;
//     justify-content: center;
//         align-items: center;
//     .mt-spinner{
//       width:50px;
//       height:50px;
//     }
//   }
// .musiclist-main{
//   flex:1;
//   overflow: auto;
//   .music-list:active{
//     background-color: #e6e6e6;
//   }
//   .music-list{
//     width:100%;
//     height:70px;
//     border-bottom: 1px solid rgba(0, 0, 0, 0.05);
//     display:flex;
//     .music-img,img[lazy=loading]{
//           width:60px;
//           height:60px;
//           margin:5px 10px;
//         }
//         img[lazy=loading]{
//           background-color: #e6e6e6;
//         }
//         span{
//           height:70px;
//           display: inline-block;
//           // vertical-align: top;
//           line-height: 70px;
//         }
//         .music-index{
//           width:30px;
//           text-align: center;
//         }
//         .music-name{
//           flex:7;
//           overflow:hidden;
//           padding-left: 10px;
//           padding-right:10px;
//           font-size: 18px;
//           cursor:pointer;
//           -webkit-tap-highlight-color: rgba(0,0,0,0);
//             -webkit-tap-highlight-color: transparent;
//         }
//   }
// }
</style>