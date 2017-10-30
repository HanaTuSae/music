import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		isShow:true,
        		isShowAsideMenu:false,
        		isShowFind:false,
        		isLoading:false,
        		isShowLyric:false,
        		isLoadingLyric:false,
        		isShowMaskLayer:false,
        		isShowMusicList:false,
		playing:false,
		musicData:[],
		hotTopData:[],
		lyricData:[],
		searchHot:[],
		orderFlag:1,
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
		//获取热门歌曲列表
		hotTopList(context){
			Vue.axios.get('/api/hot-toplist').then(function(response) {
				context.state.isLoading=false;
                			context.state.hotTopData = response.data.result.tracks;
    			}).catch(function(response) {
    				context.state.isLoading=false;
        				console.log(response)
    			});
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
		}
	}
})
export default store