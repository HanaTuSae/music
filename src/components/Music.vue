<template>
  <div class="music">
	<!-- banner -->
	<swiper :options="swiperOption" ref="mySwiper" class="banner" id="mySwiper" >
      <swiper-slide v-for="banner in banners" :key="banner.targetId">
      	<img :src="banner.picUrl">
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
  	</swiper>

  	<!-- butten -->
  	<ul class="nav">
  	  <li>
  		<span class="nav-button"><i class="FM-icon"></i></span>
  		<span>{{recommend.FM}}</span>
  	  </li>
  	  <li>
  		<span class="nav-button"><i class="everyday-icon"><span class="date">{{date}}</span></i></span>
  		<span>{{recommend.everyday}}</span>
  	  </li>
  	  <li @click="allSonglist">
  		<span class="nav-button"><i class="songlist-icon"></i></span>
  		<span>{{recommend.allsonglist}}</span>
  	  </li>
  	  <li @click="toplist">
  		<span class="nav-button"><i class="toplist-icon"></i></span>
  		<span>{{recommend.toplist}}</span>
  	  </li>
  	</ul>

  	<!-- 推荐歌单 -->
  	<div class="music-content">
  	  <div class="title">
  		<span class="title-name">{{recommend.songlist}}</span>
  		<span class="title-icon"></span>
  	  </div>
  	  <ul class="songlist">
  	  	<li class="songlist-item" v-for="(song,index) in songlist" @click="songlistDetail(index)">
  	  	  <img v-lazy="song.picUrl">
  	  	  <span>{{song.name}}</span>
  	  	</li>
  	  </ul>
  	</div>

  	<!-- 独家放送 -->
  	<div class="music-content">
  	  <div class="title">
  	  	<span class="title-name">{{recommend.private}}</span>
  		<span class="title-icon"></span>
  	  </div>
  	  <ul class="private">
  	  	<li class="private-item" v-for="content in privateContent">
  	  	  <img v-lazy="content.picUrl">
  	  	  <span>{{content.name}}</span>
  	  	</li>
  	  </ul>
  	</div>

  	<!-- 最新音乐 -->
  	<div class="music-content">
  	  <div class="title">
  		<span class="title-name">{{recommend.newsong}}</span>
  		<span class="title-icon"></span>
  	  </div>
  	  <ul class="newsong">
  	  	<li class="newsong-item" v-for="(song,index) in newsong" @click="playMusic(index)">
  	  	  <img v-lazy="song.song.album.blurPicUrl">
  	  	  <div class="name">
  	  	  	<span class="music-name">{{song.song.name}}</span>
  	  	    <span class="artists-name">{{song.song.artists[0].name}}</span>
  	  	  </div>
  	  	</li>
  	  </ul>
  	</div>

  	<!-- 最新MV -->
  	<div class="music-content">
  	  <div class="title">
  		<span class="title-name">{{recommend.MV}}</span>
  		<span class="title-icon"></span>
  	  </div>
  	  <ul class="recommend-MV">
  	  	<li class="recommendMV-item" v-for="mv in recommendMV">
  	  	  <img v-lazy="mv.picUrl">
  	  	  <span class="mv-name">{{mv.name.replace(/&nbsp;/g,' ')}}</span>
  	  	  <span class="artists-name">{{mv.artistName}}</span>
  	  	</li>
  	  </ul>
  	</div>

  	<!-- 精选专栏 -->
  	<div class="music-content">
  	  <div class="title">
  		<span class="title-name">{{recommend.program}}</span>
  		<span class="title-icon"></span>
  	  </div>
  	  <ul class="recommend-program">
  	  	<li class="recommendProgram-item" v-for="program in recommendProgram">
  	  	  <div class="name">
  	  	  	<span class="program-title">{{program.recmdTitle}}</span>
  	  	    <span class="program-readCount">阅读 {{program.readCount}}</span>
  	  	  </div>
  	  	  <img v-lazy="program.rectanglePicUrl">
  	  	</li>
  	  </ul>
  	</div>

  	<!-- 主播电台 -->
  	<div class="music-content">
  	  <div class="title">
  		<span class="title-name">{{recommend.radio}}</span>
  		<span class="title-icon"></span>
  	  </div>
  	  <ul class="recommend-radio">
  	  	<li class="recommendRadio-item" v-for="radio in recommendRadio">
  	  	  <img v-lazy="radio.picUrl">
  	  	  <span>{{radio.name}}</span>
  	  	</li>
  	  </ul>
  	</div>
  </div>
</template>

<script>
export default {
  name: 'music',
  data () {
    return {
      swiperOption:{
        notNextTick: true,
        autoplay: 3000,
        // direction: 'horizontal',
        loop:true,
        // slidesPerView: 1,
        // grabCursor: true,
        // setWrapperSize: true,
        // autoHeight: true,
        pagination: '.swiper-pagination',
        // paginationClickable: true,
        // observeParents:true,
      },
      recommend:{
      	FM:'私人FM',
      	everyday:'每日推荐',
      	songlist:'推荐歌单',
      	allsonglist:'歌单',
      	toplist:'排行榜',
      	private:'独家放送',
      	MV:'推荐MV',
      	newsong:'最新音乐',
      	radio:'主播电台',
      	program:'精选专栏'
      },
      date:'',
      continueClick:null
      // show:'功能未完成'
    }
  },
  created(){
  	this.$store.dispatch('banner');
  	this.$store.dispatch('songlist');
  	this.$store.dispatch('privateContent');
  	this.$store.dispatch('newsong');
  	this.$store.dispatch('recommendMV');
  	this.$store.dispatch('recommendProgram');
  	this.$store.dispatch('recommendRadio');
  	var myDate=new Date();
  	if(this.date!=myDate.getDate()){
  	  this.date=myDate.getDate();
  	}
  },
  computed:{
  	banners(){
      return this.$store.state.banners;
    },
    mySwiper(){
      return this.$refs.mySwiper.swiper;
    },
    songlist(){
      return this.$store.state.songlist;
    },
    privateContent(){
      return this.$store.state.privateContent;
    },
    newsong(){
      return this.$store.state.newsong;
    },
    recommendMV(){
      return this.$store.state.recommendMV;
    },
    recommendProgram(){
      return this.$store.state.recommendProgram;
    },
    recommendRadio(){
      return this.$store.state.recommendRadio;
    },
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
  mounted(){
  	var mySwiper=document.getElementById('mySwiper');
    var _this=this;
    mySwiper.addEventListener('touchstart',function(ev){
      var e=ev || window.event;
      e.stopPropagation();
    },false)

    mySwiper.addEventListener('touchmove',function(ev){
      var e=ev || window.event;
      e.stopPropagation();
      _this.mySwiper.stopAutoplay();
    },false)

    mySwiper.addEventListener('touchend',function(ev){
      var e=ev || window.event;
      e.stopPropagation();
      _this.mySwiper.startAutoplay();
    },false)
  },
  methods:{
  	playMusic(index){
  	  var _this=this;
  	  var musicID=this.newsong[index].song.id;
  	  var config={
        method: 'post',
        url: '/api/play-music',
        data: {
          musicID:musicID
        }
      }
      var musicImgSrc=this.newsong[index].song.album.picUrl;
      var musicname=this.newsong[index].song.artists[0].name+" - "+this.newsong[index].song.name;
      var currentIndex="";

      var cp=this.newsong[index].song.privilege.cp;//1
      var sp=this.newsong[index].song.privilege.sp;//7
      var subp=this.newsong[index].song.privilege.subp;//1
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
              // var src=response.data.data[0].url;
              var src=response.data.musicUrl;
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
              // var src=response.data.data[0].url;
              var src=response.data.musicUrl;
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

  	// 歌单详情
  	songlistDetail(index){
  	  var songlistID=this.songlist[index].id;
  	  var songlistRecommend=this.songlist[index].copywriter;
  	  this.$store.dispatch('songlistDetail',songlistID);
  	  this.$store.commit('songlistRecommend',songlistRecommend);
  	  this.$store.commit('isShowHeader',false);
  	  this.$store.commit('isShowSonglistDetail',true);
  	},

  	// 全部歌单
  	allSonglist(){
  	  this.$store.dispatch('allSonglist');
  	  this.$store.commit('isShowHeader',false);
  	  this.$store.commit('isShowAllSongList',true);
  	},
  	// 排行榜
  	toplist(){
      this.$store.dispatch('toplistSort');
  	  this.$store.commit('isShowHeader',false);
  	  this.$store.commit('isShowToplistSort',true);
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
.music{
  width:100%;
  // height:100%;
  background-color:#fafafa;
  position: absolute;
  top:0;
  left:0;
  .banner{
    height:150px;
    width:100%;
    img{
      width:100%;
      height:100%;
    }
  }
  .nav{
  	width:100%;
  	height:100px;
  	border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  	display: flex;
  	align-items:center;
  	li{
  	  flex:1;
  	  height:70px;
  	  display:flex;
  	  flex-direction:column;
  	  align-items:center;
  	  span{
  		font-size: 12px;
  		color:#333;
  	  }
  	  .nav-button{
  		height:40px;
  		margin-bottom:10px;
  		width:40px;
  		border: 1px solid #f44336;
  		border-radius: 100%;
  		display:flex;
  		align-items:center;
  		justify-content:center;
  		i{
  		  width: 20px;
  		  height:20px;
  		  display:inline-block;
  		}
  		.FM-icon{
  		  @include iconStyle('../assets/icon/recommend/FM.svg');
  		}
  		.everyday-icon{
  		  @include iconStyle('../assets/icon/recommend/everyday.svg');
  		  position: relative;
  		  .date{
  			width:100%;
  			color:#f44336;
  			display:inline-block;
  			font-size: 10px;
  			position: absolute;
  			top:40%;
  			left:0;
  			text-align:center;
  		  }
  		}
  		.songlist-icon{
  		  @include iconStyle('../assets/icon/recommend/songlist.svg');
  		}
  		.toplist-icon{
  		  @include iconStyle('../assets/icon/recommend/toplist.svg');
  		}
  	  }
    }
  }
  .music-content{
  	width:100%;
  	margin:20px 0;
  	overflow: hidden;
  	.title{
  	  height:20px;
  	  width:100%;
  	  border-left: 2px solid #f44336;
  	  display:flex;
  	  align-items:center;
  	  margin-bottom:10px;
  	  .title-name{
  		padding-left: 10px;
  		font-size: 16x;
  	  }
  	  .title-icon{
  		width:20px;
  		height:20px;
  		@include iconStyle('../assets/icon/recommend/right.svg');
  	  }
  	}
  	.songlist{
  	  width:100%;
  	  display: flex;
  	  flex-wrap:wrap;
  	  justify-content:space-between;
  	  li{
  	  	// height:140px;
  	  	width:33%;
  	  	display: flex;
  	  	flex-direction:column;
  	  	margin-bottom:20px;
  	  	img,img[lazy=loading]{
  	  	  width:100%;
  	  	  display:inline-block;
  	  	}
  	  	span{
  	  	  width:90%;
  	  	  // height:30px;
  	  	  padding:10px 5% 0 5%;
  	  	  display:inline-block;
  	  	  line-height: 15px;
  	  	  font-size: 12px;
  	  	}
  	  }
  	}
  	.private{
  	  width:100%;
  	  display: flex;
  	  flex-wrap:wrap;
  	  justify-content:space-between;
  	  li{
  	    width:49.5%;
  	  	display: flex;
  	  	flex-direction:column;
  	  	margin-bottom:20px;
  	  	img,img[lazy=loading]{
  	  	  width:100%;
  	  	  height:100px;
  	  	  display:inline-block;
  	  	}
  	  	span{
  	  	  width:90%;
  	  	  height:30px;
  	  	  padding:10px 5% 0 5%;
  	  	  display:inline-block;
  	  	  line-height: 15px;
  	  	  font-size: 12px;
  	  	}
  	  }
  	  .private-item:last-child{
  	  	width:100%;
  	    img,img[lazy=loading]{
  	  	  height:150px;
  	    }
  	    span{
  	      width:95%;
  	      padding:10px 2.5% 0 2.5%;
  	    }
  	  }
  	}
  	.newsong{
  	  width:100%;
  	  display: flex;
  	  flex-wrap:wrap;
  	  justify-content:space-between;
  	  li{
  	  	width:49.5%;
  	  	display: flex;
  	  	margin-bottom:10px;
  	  	img,img[lazy=loading]{
  	  	  width:60px;
  	  	  height:60px;
  	  	  display:inline-block;
  	  	}
  	  	.name{
  	  		flex:1;
  	  		display:flex;
  	  		flex-direction:column;
  	  		justify-content:center;
  	      .music-name{
  	  	    font-size: 14px;
  	      }
  	      .artists-name{
  	  	    font-size: 12px;
  	  	    color:#999;
  	  	    padding-top: 5px;
  	      }
  	  	  span{
  	  	    width:90%;
  	  	    display:inline-block;
  	  	    line-height: 15px;
  	  	    padding-left:5px;
  	  	  }
  	  	}
  	  }
  	  li:active{
  	  	background-color: #e6e6e6;
  	  }
  	}
  	.recommend-MV{
  	  width:100%;
  	  display: flex;
  	  flex-wrap:wrap;
  	  justify-content:space-between;
  	  li{
  	  	width:49.5%;
  	  	display: flex;
  	  	flex-wrap:wrap;
  	  	flex-direction:column;
  	  	margin-bottom:10px;
  	  	img,img[lazy=loading]{
  	  	  width:100%;
  	  	  height:120px;
  	  	  display:inline-block;
  	  	}
  	  	span{
  	  	  width:95%;
  	  	  // height:30px;
  	  	  display:inline-block;
  	  	  line-height: 15px;
  	  	  font-size: 12px;
  	  	}
  	  	.mv-name{
  	  	  font-size: 14px;
  	  	  padding:10px 2.5% 0 2.5%;
  	  	}
  	  	.artists-name{
  	  	  color:#999;
  	  	  padding:5px 2.5% 0 2.5%;
  	  	}
  	  }
  	}
  	.recommend-program{
  	  width:100%;
  	  display: flex;
  	  flex-wrap:wrap;
  	  li{
  	  	width:100%;
  	  	height:80px;
  	  	display: flex;
  	  	img,img[lazy=loading]{
  	  	  width:30%;
  	  	  display:inline-block;
  	  	}
  	  	.name{
  	  		flex:1;
  	  		display:flex;
  	  		flex-direction:column;
  	  	  span{
  	  	    wdith:100%;
  	  	    padding:10px 10px 0 10px;
  	  	    display:inline-block;
  	  	    line-height: 16px;
  	  	    font-size: 12px;
  	  	  }
  	  	  .program-title{
  	  	  	font-size: 15px;
  	  	  }
  	  	  .program-readCount{
  	  	  	color:#999;
  	  	  }
  	  	}
  	  }
  	  li:first-child,li:last-child{
  	  	border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  	  	border-top: 1px solid rgba(0, 0, 0, 0.08);
  	  }
  	}
  	.recommend-radio{
  	  width:100%;
  	  display: flex;
  	  flex-wrap:wrap;
  	  justify-content:space-between;
  	  li{
  	  	// height:140px;
  	  	width:33%;
  	  	display: flex;
  	  	flex-direction:column;
  	  	margin-bottom:20px;
  	  	img,img[lazy=loading]{
  	  	  width:100%;
  	  	  display:inline-block;
  	  	}
  	  	span{
  	  	  width:90%;
  	  	  height:30px;
  	  	  padding:10px 5% 0 5%;
  	  	  display:inline-block;
  	  	  line-height: 15px;
  	  	  font-size: 12px;
  	  	}
  	  }
  	}
  	img[lazy=loading]{
      background-color: #e6e6e6;
    }
  }
}
</style>