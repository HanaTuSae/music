<template>
  <div class="musiclist">
  <div class="music-list" v-for="(music,index) in musicData">
  	<img  class="music-img" v-lazy="music.musicImgSrc">
  	<span class="music-index">{{index+1}}</span>
  	<span class="music-name" @click="changeMusic(index)">{{music.name}}</span>
    <span class="del" @click="del(index)"><i class="del-icon"></i></span>
  </div>
  </div>
</template>

<script>
export default {
  name: 'musiclist',
  data () {
    return {
      continueClick:null
    }
  },
  created(){
    //获取音乐列表
    if(this.musicData==""){
      this.$store.dispatch('musicList');}
  },
  computed:{
  	musicData(){
  		return this.$store.state.musicData;
  	},
    audio(){
      return this.$store.state.audio;
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
  mounted() {
    // var musicName=document.getElementById('musicName');
    // musicName.addEventListener('touchstart',function(ev){
    //   var e=ev||window.event;
    //   e.preventDefault();
    // },{passive:true})
    // musicName.addEventListener('touchmove',function(ev){
    //   var e=ev||window.event;
    //   e.preventDefault();
    // },{passive:true})
    // musicName.addEventListener('touchend',function(ev){
    //   // var e=ev||window.event;
    //   // e.preventDefault();
    // })
},
methods:{
	changeMusic(index){
    var _this=this;
    var config={
        method: 'post',
            url: '/api/play-music',
            headers: {'Content-Type': 'application/json'},
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

  // 删除歌曲
  del(index){
    if(this.audio.index===index){//如果删除的为当前播放歌曲，则播放下一首歌曲
      var newIndex=index==this.musicData.length-1?0:index;
      this.changeMusic(newIndex);
    }
    this.$store.commit('delmusicData',index);
  }
}
}
</script>

<style lang="scss" scoped>
.musiclist{
	flex:8;
	overflow: auto;
  .music-list:active{
    background-color: #e6e6e6;
  }
	.music-list{
		width:100%;
		height:70px;
		border-bottom: 1px solid rgba(0, 0, 0, 0.05);
         display:flex;
		.music-img,img[lazy=loading]{
	        width:60px;
	        height:60px;
	        margin:5px 10px;
        }
        img[lazy=loading]{
          background-color: #e6e6e6;
        }
        span{
        	height:70px;
        	display: inline-block;
        	// vertical-align: top;
          line-height: 70px;
        }
        .music-index{
        	width:30px;
          text-align: center;
        }
        .music-name{
          flex:7;
          overflow:hidden;
          padding-left: 10px;
          padding-right:10px;
          font-size: 18px;
        	cursor:pointer;
        	-webkit-tap-highlight-color: rgba(0,0,0,0);
            -webkit-tap-highlight-color: transparent;
        }
        .del{
          height:70px;
          flex:1;
          display:flex;
          align-items:center;
          i{
            width:20px;
            height:20px;
            // margin-top:25px;
            display:inline-block;
            cursor:pointer;
            background:url('../assets/icon/del.png') no-repeat center center;background-size: contain;
          }
        }
	}
}
</style>