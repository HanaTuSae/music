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
		playing:false,
		musicData:[],
		hotTopData:[],
		lyricData:[],
		orderFlag:1,
		audio:{
			index:0,
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
		}
		//获取歌词
		// lyric(state,id){
		// 	state.isLoading=true;
		// 	Vue.axios.get('/api/lyric',{params:{musicID:id}}).then(function(response){
		// 		state.isLoading=false;
		// 		state.lyricData=response.data.lrc.lyric;
		// 	}).catch(function(response){
		// 		state.isLoading=false;
		// 		console.log(response)
		// 	});
		// }
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
			Vue.axios.post('/api/hot-toplist').then(function(response) {
				context.state.isLoading=false;
                			context.state.hotTopData = response.data.result.tracks;
    			}).catch(function(response) {
    				context.state.isLoading=false;
        				console.log(response)
    			});
		},
		//获取歌词
		lyric(context,id){
			context.state.isLoadingLyric=true;
			context.state.lyricData=[];
			setTimeout(()=>{
			Vue.axios.get('/api/lyric',{params:{musicID:id}}).then(function(response){
				context.state.isLoadingLyric=false;
				if(response.data.uncollected||response.data.nolyric){
					context.state.lyricData='';
				}else{
					context.state.lyricData=response.data.lrc.lyric;
				}
			}).catch(function(response){
				context.state.isLoadingLyric=false;
				context.state.lyricData='error';
				console.log(response)
			});
			},2000);
		}
	}
})
export default store