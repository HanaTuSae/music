<template>
	<div class="toplist">
    <div class="top">
      <!-- 标题 -->
      <ul class="top-title">
        <li><i @click="close"></i></li>
        <li>
          <span>{{name}}</span>
        </li>
      </ul>

      <!-- 图片 -->
      <div class="content">
        <div class="content-left">
          <img :src="topList.playlist.coverImgUrl">
        </div>
        <ul class="content-right">
          <li class="songlistName">{{topList.playlist.name}}</li>
          <li>
            <img :src="topList.playlist.creator.avatarUrl">
            <span>{{authorName}}</span>
          </li>
        </ul>
      </div>

      <!-- button -->
      <ul class="nav">
        <li>
          <span class="nav-button"><i class="collect"></i></span>
          <span>{{subscribedCount}}</span>
        </li>
        <li>
          <span class="nav-button"><i class="comment"></i></span>
          <span>{{topList.playlist.commentCount}}</span>
        </li>
        <li>
          <span class="nav-button"><i class="share"></i></span>
          <span>{{topList.playlist.shareCount}}</span>
        </li>
        <li>
          <span class="nav-button"><i class="download"></i></span>
          <span>{{download}}</span>
        </li>
      </ul>

      <!-- blur -->
      <div class="blur" :style="{backgroundImage:'url('+topList.playlist.coverImgUrl+')'}"></div>
    </div>
    <!-- songlist -->
    <div class="bottom">
      <ul>
        <li>
          <span class="title-type"><i></i></span>
          <div class="bottom-title">
            <span class="title-name">{{titleName}}</span>
            <span class="title-count">{{'(共'+topList.playlist.trackCount+'首)'}}</span>
          </div>
        </li>
        <li v-for="(song,index) in topList.playlist.tracks">
          <span>{{index+1}}</span>
          <div class="bottom-name" @click="playMusic(index)">
            <span class="musicName">{{song.name}}</span>
            <span class="arName">{{song.ar[0].name}}</span>
          </div>
        </li>
      </ul>
    </div>
	</div>
</template>

<script>
export default {
  name: 'toplist',
  data () {
    return {
      // show:'功能未完成'
      name:'歌单',
      download:'下载',
      titleName:'播放全部',
      continueClick:null
    }
  },
  computed:{
    topList(){
      return this.$store.state.topList;
    },
    authorName(){
      var authorName=this.topList.playlist.creator.nickname.replace('"','')+' >';
      return authorName;
    },
    subscribedCount(){
      var subscribedCount=this.topList.playlist.subscribedCount;
      return subscribedCount>=10000?(subscribedCount/10000).toFixed(1)+'万':subscribedCount;
    },
    audio(){
      return this.$store.state.audio;
    },
    musicData(){
      return this.$store.state.musicData;
    }
  },
  watch:{
    musicData:{
      handler(val,oldval){
        localStorage.music = JSON.stringify(val);
      },
      deep:true
    }
  },
  mounted(){

  },
  methods:{
    close(){
      var topList={
        playlist:{
          coverImgUrl:'',
          tracks:[{
            name:'',
            ar:[{
              name:'',
            }],
          }],
          name:'',
          creator:{
            avatarUrl:'',
            nickname:'',
          },
          subscribedCount:'',
          commentCount:'',
          shareCount:'',
          trackCount:0
        },
      }
      this.$store.commit('isShowToplistSort',true);
      this.$store.commit('isShowToplist',false);
      this.$store.commit('topList',topList);
    },
    playMusic(index){
      var _this=this;
      var musicID=this.topList.playlist.tracks[index].id;
      var config={
        method: 'post',
        url: '/api/play-music',
        data: {
          musicID:musicID
        }
      }
      var musicImgSrc=this.topList.playlist.tracks[index].al.picUrl;
      var musicname=this.topList.playlist.tracks[index].ar[0].name+" - "+this.topList.playlist.tracks[index].name;
      var currentIndex="";

      var cp=this.topList.privileges[index].cp;//1
      var sp=this.topList.privileges[index].sp;//7
      var subp=this.topList.privileges[index].subp;//1
      if(cp===0&&sp===0&&subp===0){
        this.$toast('暂无歌曲资源,请选择其他歌曲');
        return;
      }

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
          }).catch(function(error){
            console.log(error)
          })
        },2000);
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
          }).catch(function(error){
            console.log(error)
          })
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
    },
  }
}
</script>

<style lang="scss" scoped>
@mixin iconStyle($pictureUrl){
  background: url($pictureUrl) no-repeat center center;
  background-size: contain;
}
.toplist{
  width:100%;
  height:100%;
  display: flex;
  flex-direction:column;
  .top{
    flex:2;
    display: flex;
    flex-direction:column;
    color:#fafafa;
    position: relative;
    overflow:hidden;
    .blur{
      width:100%;
      height:100%;
      background-repeat: no-repeat;
      background-size:cover;
      position: absolute;
      left:0;
      top:0;
      right:0;
      bottom:0;
      // background-color: rgba(141, 141, 141, 0.35);
      // background-blend-mode: darken;
      filter: blur(55px) brightness(55%);
      transform: scale(2);//图像放大将边缘隐藏
      // margin: -25px;
    }
    .top-title{
      flex:1;
      display: flex;
      z-index:10;
      li{
        list-style-type: none;
      }
      li:first-child{
        flex:1;
        display:flex;
        align-items:center;
        // justify-content:center;
        i{
          width:20px;
          height:20px;
          margin-left: 10px;
          @include iconStyle('../assets/icon/back.svg');
        }
      }
      li:last-child{
        flex:7;
        span{
          flex:1;
          display:inline-block;
          line-height:40px;
          padding-top:5px;
          font-size: 16px;
        }
      }
    }
    .content{
      flex:4;
      z-index:10;
      display:flex;
      .content-left{
        flex:2;
        display:flex;
        align-items:center;
        justify-content:center;
        img{
          // height:80%;
          width:80%;
          display:inline-block;
        }
      }
      .content-right{
        flex:3;
        display:flex;
        flex-direction:column;
        padding-left:10px;
        padding-top:5%;
        flex-wrap:wrap;
        li{
          width:90%;
          list-style-type: none;
        }
        .songlistName{
          // height:30px;
          font-size: 16px;
          margin-bottom: 20px;
          padding-right: 10%;
        }
        li:last-child{
          font-size: 12px;
          display:flex;
          img{
            width:30px;
            height:30px;
            // display:inline-block;
            // background-repeat: no-repeat;
            // background-size: contain;
            border-radius: 100%;
          }
          span{
            height:30px;
            line-height: 30px;
            margin-left: 10px;
            font-size: 14px;
          }
        }
      }
    }
    .nav{
      flex:1.5;
      z-index:10;
      display: flex;
      align-items:center;
      li{
        flex:1;
        list-style-type: none;
        display:flex;
        flex-direction:column;
        span{
          flex:1;
          text-align: center;
          font-size:14px;
        }
        .nav-button{
          display:flex;
          align-items:center;
          justify-content:center;
          margin-bottom: 5px;
          i{
            width:20px;
            height:20px;
          }
          .collect{
            @include iconStyle('../assets/icon/recommend/collect.svg');
          }
          .comment{
            @include iconStyle('../assets/icon/recommend/comment.svg');
          }
          .share{
            @include iconStyle('../assets/icon/share.svg');
          }
          .download{
            @include iconStyle('../assets/icon/recommend/download.svg');
          }
        }
      }
    }
  }
  .bottom{
    flex:3;
    overflow:hidden;
    background-color:#fafafa;
    ul{
      width:100%;
      height:100%;
      overflow: auto;
      li{
        width:100%;
        height:40px;
        display:flex;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        padding:5px 0;
      }
      li:not(:first-child){
        >span{
          flex:1;
          text-align:center;
          line-height:40px;
          color:#999;
        }
        .bottom-name{
          flex:6;
          display:flex;
          flex-direction:column;
          overflow:hidden;
          span{
            flex:1;
            width:97%;
            line-height:20px;
            overflow:hidden;
            white-space:nowrap;
            text-overflow:ellipsis;//文字超出部分省略号显示
            -webkit-tap-highlight-color: rgba(0,0,0,0);
            -webkit-tap-highlight-color: transparent;
          }
          .musicName{
            font-size: 16px;
          }
          .arName{
            font-size: 12px;
            color:#999;
          }
        }
      }
      li:not(:first-child):active{
        background-color: #e6e6e6;
      }
      li:first-child{
        .bottom-title{
          flex:6;
          line-height:40px;
          .title-name{
            font-size:16px;
          }
          .title-count{
            font-size: 14px;
            color:#999;
          }
        }
        .title-type{
          flex:1;
          display:flex;
          align-items:center;
          justify-content:center;
          i{
            width:20px;
            height:20px;
            @include iconStyle('../assets/icon/play.png');
          }
        }
      }
    }
  }
}
</style>