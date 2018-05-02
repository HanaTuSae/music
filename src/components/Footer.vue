<template>
  <div class="footer">
    <div class="audio">
      <img :src="audio.imgsrc" class="imgsrc" @click="isShow">
      <span class="audioName" @click="isShow">{{audio.name}}</span>
      <span @click="play()" class="play" :class="playImgSrc"></span>
    </div>
    <!-- <audio v-bind:src="audio.src" ref="audio" controls="controls" :autoplay="playing" hidden="hidden"></audio> -->
  </div>
</template>

<script>
export default {
  name: 'footer',
  data () {
    return {
    }
  },
  created(){
  },
  computed:{
    playing(){
      return this.$store.state.playing;
    },
    audio(){
      return this.$store.state.audio;
    },
    playImgSrc(){
      return this.$store.state.playImgSrc;
    }
  },
  mounted: function() {
  },
  methods:{
    isShow(){
      this.$store.commit('isShow',false);
    },
    play(){
      if(this.playing){
        this.audio.audioDom.pause();
        this.$store.commit('play',false);
        this.$store.commit('playImgSrc','playImgSrc');
      }else{
        if(this.audio.src){
          this.audio.audioDom.play();
          this.$store.commit('play',true);
          this.$store.commit('playImgSrc','stopImgSrc');
        }else{
          this.$toast('请点击歌曲播放');
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.footer{
  width:100%;
  height:60px;
  box-shadow: 0 0 10px gray;
  z-index:10;
  background-color: white;
  .audio{
    width:100%;
    height:100%;
    display:flex;
    align-items:center;
    position: relative;
    .imgsrc{
      border-radius: 100%;
      width:55px;
      height: 55px;
      cursor:pointer;
      display:inline-block;
      margin-left: 10px;
      outline: none;
      -webkit-tap-highlight-color: rgba(0,0,0,0);
      -webkit-tap-highlight-color: transparent;
    }
    .play{
      width:35px;
      height:35px;
      border-radius: 100%;
      border:none;
      cursor:pointer;
      display:inline-block;
      margin-right: 10px;
      outline: none;
      -webkit-tap-highlight-color: rgba(0,0,0,0);
      -webkit-tap-highlight-color: transparent;
    }
    .playImgSrc{
      background: url('../assets/icon/play.png') no-repeat center center;
    }
    .stopImgSrc{
      background: url('../assets/icon/stop.png') no-repeat center center;
    }
    .audioName{
      display: inline-block;
      font-size: 18px;
      flex:7;
      padding-left:20px;
      height:60px;
      line-height: 60px;
      overflow: hidden;
    }
  }
}
</style>
