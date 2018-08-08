<template>
	<div class="playMusicList">
    <div class="musicList-main" ref="musicListMain">
      <tr v-for="(music,index) in musicData" >
        <span class="music-index">{{index+1}}</span>
        <span class="music-name" @click="changeMusic(index)" :class="{active:index==audio.index}">{{music.name}} </span>
      </tr>
    </div>
  </div>
</template>
<script>
export default {
  name: 'playMusicList',
  data () {
    return {
    }
  },
  computed:{
  	musicData(){
  		return this.$store.state.musicData;
  	},
  	isShowMusicList(){
  		return this.$store.state.isShowMusicList;
  	},
  	audio(){
      return this.$store.state.audio;
    }
  },
  methods:{
  	//切换歌曲
    changeMusic(index){
      var _this=this;
      var config={
        method: 'post',
        url: '/api/play-music',
        data: {
          musicID:this.musicData[index].id
        }
      }
      // 判断是否点击为正在播放首歌
      if(this.audio.index===index){
        //判断是否在播放
        if(this.audio.audioDom.paused){
          this.audio.audioDom.play();
        }
        return;
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
            // var src=response.data.data[0].url;
            var src=response.data.musicUrl;
            _this.$store.commit('newaudio',{index:index,src:src});
            _this.$store.commit('play',true);
            _this.$store.commit('playImgSrc','stopImgSrc');
          }
        }).catch(function(response){
          console.log(response)
        });
      },2000)
  	},
  }
}
</script>
<style lang="scss" scoped>
.playMusicList{
  width:100%;
  height:50%;
  position:absolute;
  top:50%;
  left:0;
  z-index:400;
}
.musicList-main{
  width:100%;
  height:100%;
  overflow-x:hidden;
  overflow-y: auto;
  background-color:#fff;
  tr{
    width:100%;
    height:40px;
    display:flex;
    align-items:center;
  }
  tr:active{
    background-color: #cdcdcd;
  }
  span{
    line-height: 40px;
    display:inline-block;
  }
  .music-index{
    flex:1;
    text-align: center;
  }
  .music-name{
    flex:7.5;
    margin-right: 10px;
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
</style>