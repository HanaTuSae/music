<template>
<div class="recommend">
  <div class="nav">
    <router-link to="/recommend/music" class="nav-menu" :class="{linkActive:this.getRoutePath==='/recommend'}">{{recommend.music}}</router-link>
    <router-link to="/recommend/video" class="nav-menu">{{recommend.video}}</router-link>
    <router-link to="/recommend/radio" class="nav-menu">{{recommend.radio}}</router-link>
  </div>
  <div class="recommend-content">
    <router-view ></router-view>
  </div>
  </div>
<!--   <div class="loading" v-show="isLoading"><mt-spinner :type="2" color="#515151" class="mt-spinner"></mt-spinner></div>
  <div class="musiclist-main" v-show="!isLoading">
  <div class="music-list" v-for="(music,index) in hotTopData" >
    <img  class="music-img" v-lazy="music.album.picUrl">
    <span class="music-index">{{index+1}}</span>
    <span class="music-name" @click="changeMusic(index)">{{music.artists[0].name+' - '+music.name}}</span>
  </div>
  </div> -->
  </div>
</template>

<script>
// import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  name: 'recommend',
  // components: { swiper, swiperSlide},
  data () {
    return {
      continueClick:null,
      recommend:{
        music:'音乐',
        video:'视频',
        radio:'电台'
      }
    }
  },created(){
    //获取热门歌曲列表
  //   if(this.hotTopData==""){
  //   this.$store.commit('isLoading',true);
  //   this.$store.dispatch('topList',1);
  // }
  },
  computed:{
    hotTopData(){
      return this.$store.state.hotTopData;
    },
    musicData(){
      return this.$store.state.musicData;
    },
    isLoading(){
      return this.$store.state.isLoading;
    },
    audio(){
      return this.$store.state.audio;
    },
    getRoutePath(){
      return this.$route.path;
    }
  },
  mounted() {
},
  watch:{
    musicData:{
      handler(val,oldval){
        localStorage.music = JSON.stringify(val);
      },
      deep:true
    }
  },
methods:{
  changeMusic(index){
    var _this=this;
    var config={
        method: 'post',
            url: '/api/play-music',
            data: {
            musicID:this.hotTopData[index].id
            }
        }
    var musicImgSrc=this.hotTopData[index].album.picUrl;
    var musicname=this.hotTopData[index].artists[0].name+" - "+this.hotTopData[index].name;
    var musicID=this.hotTopData[index].id;
    var currentIndex="";

    // var cp=this.hotTopData[index].privilege.cp;//1
    // var sp=this.hotTopData[index].privilege.sp;//7
    // var subp=this.hotTopData[index].privilege.subp;//1
    // if(cp===0&&sp===0&&subp===0){
    //   this.$toast('暂无歌曲资源,请选择其他歌曲');
    //   return;
    // }

    // 检测musicData是否存在播放歌曲，有则播放该歌曲，无则增加歌曲并播放
    if(this.isExist(musicID)){
          currentIndex=this.isExist(musicID);

          // 判断是否点击为正在播放首歌
          if(this.audio.index===currentIndex){
            if(this.audio.audioDom.paused){
              this.audio.audioDom.play();
            }
            return;
          }

          this.$store.commit('newaudio',{index:currentIndex,src:''});

          // 判断连续点击，2s内连续点击只做最后一次请求
          if(this.continueClick!=null){
        clearTimeout(this.continueClick);
      }
      this.continueClick=setTimeout(()=>{

        // 播放请求
          this.axios(config).then(function(response){
            if(_this.audio.index===currentIndex){// 超过2s点击判断是否为最后一次请求
              var src=response.data.data[0].url;
              _this.$store.commit('newaudio',{index:currentIndex,src:src});
              _this.$store.commit('play',true);
              _this.$store.commit('playImgSrc','stopImgSrc');
            }
      }).catch(function(response){
        console.log(response)
        },2000)
      });
        }else{
            this.$store.commit('addmusicData',{id:musicID,name:musicname,src:'',musicImgSrc:musicImgSrc});
            currentIndex=this.musicData.length-1;
            this.$store.commit('newaudio',{index:currentIndex,src:''});

            // 判断连续点击，2s内连续点击只做最后一次请求
            if(this.continueClick!=null){
                clearTimeout(this.continueClick);
              }
              this.continueClick=setTimeout(()=>{

              // 播放请求
            this.axios(config).then(function(response){
              if(_this.audio.index===currentIndex){// 超过2s点击判断是否为最后一次请求
                var src=response.data.data[0].url;
              _this.$store.commit('delmusicData',currentIndex);
              _this.$store.commit('addmusicData',{id:musicID,name:musicname,src:src,musicImgSrc:musicImgSrc});
              _this.$store.commit('newaudio',{index:currentIndex,src:src});
              _this.$store.commit('play',true);
              _this.$store.commit('playImgSrc','stopImgSrc');
              }
            }).catch(function(response){
              console.log(response)
            });
            },2000)
        }
  },

  //判断是否存在歌曲
  isExist(id){
    for(var i=0;i<this.musicData.length;i++){
          if(this.musicData[i].id==id){
            return i;
          }
        }
        return false;
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