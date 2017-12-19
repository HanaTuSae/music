import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
	isShow:true,
    isShowAsideMenu:false,
    isShowFind:false,
    isShowHeader:true,
    isLoading:false,
    isShowLyric:false,
    isShowSonglistDetail:false,
    isShowToplistSort:false,
    isShowAllSongList:false,
    isShowToplist:false,
    isLoadingLyric:false,
    isShowMaskLayer:false,
    isShowMusicList:false,
    playing:false,
	musicData:[],
	lyricData:[],
	searchHot:[],
	banners:[],
	songlist:[],
	privateContent:[],
	newsong:[],
	recommendMV:[],
	recommendProgram:[],
	recommendRadio:[],
	songlistDetail:{
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
	},
	allSonglist:[],
	toplistSort:[],
	topList:{
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
	},
	songlistRecommend:'',
	orderFlag:1,
	allSonglistFlag:false,
	audio:{
	  index:-1,
	  src:"",
	  imgsrc:"http://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
	  name:"NN - NN"
	},
	playImgSrc:'playImgSrc'
  },
  mutations:{
	newaudio(state,msg){
	  state.audio.index=msg.index;
	  state.audio.src=msg.src;
	  state.audio.imgsrc=state.musicData[msg.index].musicImgSrc;
	  state.audio.name=state.musicData[msg.index].name;
	},
	isShow(state,msg){
	  state.isShow=msg;
	},
	isShowFind(state,msg){
	  state.isShowFind=msg;
	},
	isShowSonglistDetail(state,msg){
	  state.isShowSonglistDetail=msg;
	},
	isShowToplistSort(state,msg){
	  state.isShowToplistSort=msg;
	},
	isShowAllSongList(state,msg){
	  state.isShowAllSongList=msg;
	},
	isShowToplist(state,msg){
	  state.isShowToplist=msg;
	},
	isShowHeader(state,msg){
	  state.isShowHeader=msg;
	},
	isShowAsideMenu(state,msg){
	  state.isShowAsideMenu=msg;
	},
	play(state,msg){
	  state.playing=msg;
	},
	playImgSrc(state,msg){
	  state.playImgSrc=msg;
	},
	audioDom(state,msg){
	  state.audio[msg.name]=msg.audioDom;
	},
	addmusicData(state,newMusicData){
	  state.musicData.push(newMusicData);
	},
	delmusicData(state,index){
	  state.musicData.splice(index,1);
	},
	isLoading(state,msg){
	  state.isLoading=msg;
	},
	isLoadingLyric(state,msg){
	  state.isLoadingLyric=msg;
	},
	isShowLyric(state,msg){
	  state.isShowLyric=msg;
	},
	getOrderFlag(state,msg){
	  state.orderFlag=msg;
	},
	isShowMaskLayer(state,msg){
	  state.isShowMaskLayer=msg;
	},
	isShowMusicList(state,msg){
	  state.isShowMusicList=msg;
	},
	songlistRecommend(state,msg){
	  state.songlistRecommend=msg;
	},
	songlistDetail(state,msg){
	  state.songlistDetail=msg;
	},
	topList(state,msg){
	  state.topList=msg;
	},
	allSonglistFlag(state,msg){
	  state.allSonglistFlag=msg;
	}
  },
  actions:{
	//获取歌曲列表
	musicList(context){
	  if(localStorage.music!=='[]'&&localStorage.music){
		context.state.musicData=JSON.parse(localStorage.music);
	  }else{
		Vue.axios.get('/api/music-data').then(function(response) {
          context.state.musicData = response.data.musicData;
          localStorage.music=JSON.stringify(context.state.musicData);
    	}).catch(function(response) {
          console.log(response)
    	});
	  }
	},
	//获取排行榜，传入排行榜对应id获取
	topList(context,id){
	  Vue.axios.get('/api/toplist',{params:{id:id}}).then(function(response) {
		// context.state.isLoading=false;
        context.state.topList = response.data;
      }).catch(function(response) {
    	// context.state.isLoading=false;
        console.log(response)
      });
	},
	// 排行榜分类
	toplistSort(context){
		Vue.axios.get('/api/top-list').then(function(response){
		  context.state.toplistSort=response.data.list;
		}).catch(function(error){
		  console.log(error);
		})
	},
	//获取歌词
	lyric(context,currentMusic){
	  context.state.isLoadingLyric=true;
	  // context.state.lyricData='';
	  Vue.axios.get('/api/lyric',{params:{musicID:currentMusic.id}}).then(function(response){
		setTimeout(()=>{context.state.isLoadingLyric=false;},2000);
		if(response.data.uncollected||response.data.nolyric){
		  context.state.lyricData='empty';
		}else if(currentMusic.index==context.state.audio.index){
		  context.state.lyricData=response.data.lrc.lyric;
		}
	  }).catch(function(response){
		setTimeout(()=>{context.state.isLoadingLyric=false;},2000);
		context.state.lyricData='error';
		console.log(response)
	  });
	},
	// 获取热门搜索
	searchHot(context){
	  Vue.axios.get('/api/search-hot').then(function(response){
		context.state.searchHot=response.data.searchHot;
	  }).catch(function(error){
		console.log(error);
	  })
	},
	// 获取banner
	banner(context){
	  Vue.axios.get('/api/banner').then(function(response){
		context.state.banners=response.data.banners;
	  }).catch(function(error){
		console.log(error);
	  })
	},
	// 获取推荐歌单
	songlist(context){
	  Vue.axios.get('/api/recommend-songList').then(function(response){
		context.state.songlist=response.data.result;
	  }).catch(function(error){
		console.log(error);
	  })
	},
	// 全部歌单
	allSonglist(context){
	  Vue.axios.get('/api/allSongList').then(function(response){
		context.state.allSonglist=response.data.playlists;
		// console.log(response.data);
	  }).catch(function(error){
		console.log(error);
	  })
	},
	// 获取独家放送
	privateContent(context){
	  Vue.axios.get('/api/private-content').then(function(response){
		context.state.privateContent=response.data.result;
	  }).catch(function(error){
		console.log(error);
	  })
	},
	// 获取新歌
	newsong(context){
	  Vue.axios.get('/api/recommend-newSong').then(function(response){
		context.state.newsong=response.data.result;
	  }).catch(function(error){
		console.log(error);
	  })
	},
	// 获取MV
	recommendMV(context){
	  Vue.axios.get('/api/recommend-MV').then(function(response){
		context.state.recommendMV=response.data.result;
	  }).catch(function(error){
		console.log(error);
	  })
	},
	// 获取节目
	recommendProgram(context){
	  Vue.axios.get('/api/recommend-program').then(function(response){
		context.state.recommendProgram=response.data.data;
		// console.log(response.data);
	  }).catch(function(error){
		console.log(error);
	  })
	},
	// 获取电台
	recommendRadio(context){
	  Vue.axios.get('/api/recommend-radio').then(function(response){
		context.state.recommendRadio=response.data.result;
	  }).catch(function(error){
		console.log(error);
	  })
	},
	// 获取歌单详情
	songlistDetail(context,songlistID){
	  var config={
        method: 'get',
        url: '/api//songList-detail',
        params: {
          id:songlistID
        }
      }
	  Vue.axios(config).then(function(response){
		context.state.songlistDetail=response.data;
		// console.log(response.data);
	  }).catch(function(error){
		console.log(error);
	  })
	},
  }
})
export default store