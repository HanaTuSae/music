<template>
   <div class="find">
   	<div class="findNav">
   		<div class="back"><i class="back-icon" @click="isShowFind"></i></div>
   		<div class="findContent">
   		     <input type="text" name="findMusic" placeholder="歌名/歌手" ref="findMusic" @keyup.enter="find()" v-model="musicName" maxlength="30">
   		     <div class="close"><i class="close-icon"></i></div>
   		</div>
   	</div>
   	<!-- 搜索建议 -->
   	<div class="musicSuggest" v-show="isShowSuggest">
   		<div class="musicSuggestList" @click="find()">
   			<span class="suggestDefault">搜索 </span>
   			<span class="suggestName">"{{musicName}}"</span>
   		</div>
   	    	<div class="musicSuggestList" v-for="(suggest,index) in musicSuggestData">
   	    	      <span class="suggest-icon"></span>
   	    	      <span class="suggestName" @click="find(suggest.name)">{{suggest.name}}</span>
   	         </div>
   	</div>

   	<div class="loading" v-show="isLoading"><mt-spinner :type="2" color="#515151" class="mt-spinner"></mt-spinner></div>
   	<div class="musicList" v-show="!isLoading">
   	<mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" @bottom-status-change="handleBottomChange" :auto-fill="false">
   		<div class="music-list" v-for="(music,index) in musicFindData">
  	        <span class="music-index">{{index+1}}</span>
  	        <div class="musicName" @click="playMusic(index)">
  	            <span class="music-name" >{{music.name}}</span>
  	            <span class="author">{{music.ar[0].name}}</span>
  	        </div>
   		</div>
   		<div slot="bottom" class="mint-loadmore-bottom" v-show="isLoadmore">
            	    <span v-show="bottomStatus !== 'loading'" :class="{ 'rotate': bottomStatus === 'pull' }">{{bottomText}}</span>
            	    <span v-show="bottomStatus === 'loading'" class="loadmore"><mt-spinner :type="3" color="#515151" ></mt-spinner></span>
        		</div>
   		</mt-loadmore>
   	</div>
   </div>
</template>

<script>
export default {
  name: 'find',
  data () {
    return {
      musicName:'',//搜索值
      musicFindData:[],//存储搜索列表
      musicSuggestData:[],//存储搜索建议列表
      bottomText:"上拉加载更多",
      pageNo:1,//页数
      totalCount:'',//总页数
      allLoaded:false,//为true时加载更多不在执行
      bottomStatus:'',//加载更多状态
      isLoadmore:false,//加载更多
      isShowSuggest:false,//显示搜索建议
      continueClick:null,//连续点击事件
      isSearch:false
    }
  },
  created(){
  	this.musicName="";
    	this.musicFindData=[];
  },
  computed:{
  	musicData(){
  		return this.$store.state.musicData;
  	},
  	isLoading(){
  		return this.$store.state.isLoading;
  	},
  	audio(){
  		return this.$store.state.audio;
  	}
  },
  mounted(){
  },
  watch:{
  	// 监听musicData，数据每次变化都存储到localStorage
    musicData:{
      handler(val,oldval){
        localStorage.music = JSON.stringify(val);
      },
      deep:true
    },
    musicName:{
    	handler(val,oldval){
    		if(val&&this.isSearch==false){
    			this.isShowSuggest=true;
    			this.searchSuggest();
    		}else {
    			this.musicSuggestData='';
    			this.isShowSuggest=false;
    		}
    	},
    	deep:true
    }
  },
  methods:{
  	// 退出搜索页面
    isShowFind(){
      this.$store.commit('isShowFind',false);
      this.musicName="";
      this.musicFindData=[];
      this.$store.commit('isLoading',false);
    },

    //搜索音乐
    find(suggestName){
    	this.musicName=suggestName||this.musicName;
    	var activeMusicName=this.musicName;
    	var config={
    		method: 'post',
            	url: '/api/find-music',
            	headers:{'Content-Type': 'application/json'},
            	data: {
           	 musicName:activeMusicName
           	 }
        }
        var _this=this;
        // this.cancelSearch('/api/find-music');
    	if(activeMusicName){

    	   //初始化搜索建议
    	  this.musicSuggestData='';
    	  this.isShowSuggest=false;
    	  this.isSearch=true;

    	  //加载loading
    	  this.$store.commit('isLoading',true);

    	  // 下拉数据初始化
    	  this.bottomText="上拉加载更多";
    	  this.pageNo=1;
    	  this.isLoadmore=true;
    	  this.allLoaded=false;

    	  // 搜索请求
  	   this.axios(config).then(function(response){
  	   	if(activeMusicName===_this.musicName){//判断是否为最后一次请求，防止上一次数据未请求成功即开始请求下次，导致数据混乱
  	   		_this.$store.commit('isLoading',false);
  		  	_this.musicFindData=response.data.result.songs;
  		  	_this.totalCount=Math.ceil(response.data.result.songCount/20);//返回数据以每页20个分页得出总页数
  		  	_this.isSearch=false;
  	   	}
  	      }).catch(function(response) {
              		_this.$store.commit('isLoading',false);
              		_this.isSearch=false;
              		console.log(response);
         	 	});
        }
    },

    // 搜索建议
    searchSuggest(){
    	// 取消请求
    	// this.cancelSearch('/api/find-music-suggest');

    	var config={
    		method: 'get',
            	url: '/api/find-music-suggest',
            	headers:{'Content-Type': 'application/json'},
            	params: {
           	 musicName:this.musicName
           	 }
        }
        var currentName=this.musicName;
        var _this=this;
        if(this.musicName){
        	this.axios(config).then(function(response){
        		if(currentName==_this.musicName){
        			_this.musicSuggestData=response.data.result.songs;
        		}
        		
        		// console.log(response.data.result.songs);
        	}).catch(function(error){
        		console.log(error);
        	})
        }
    },

    //取消请求
    cancelSearch(url){
    	var CancelToken = this.axios.CancelToken;
	var source = CancelToken.source();
	var _this=this;
    	this.axios.post(url,{
    		cancelToken: source.token
    	}).catch(function(error){
    		if(_this.axios.isCancel(error)){
    			console.log('Request canceled', error.data.cancelToken.reason.message);
    		}else{
    			console.log(error);
    		}
    	})
    	source.cancel('Operation canceled by the user.');
    },

    //点击音乐播放
    playMusic(index){
    	var _this=this;
    	var musicImgSrc=this.musicFindData[index].al.picUrl;
    	var musicname=this.musicFindData[index].ar[0].name+" - "+this.musicFindData[index].name;
    	var musicID=this.musicFindData[index].id;
    	var src="";
    	var config={
    		method: 'post',
            	url: '/api/play-music',
            	headers:{'Content-Type': 'application/json'},
            	data: {
            	musicID:musicID
            	}
        }
        var currentIndex="";

        // 检测musicData是否存在播放歌曲，有则播放该歌曲，无则增加歌曲并播放
        if(this.isExist(musicID)){
        		// var audioIndex=this.isExist(this.musicFindData[index].id);
        		currentIndex=this.isExist(musicID);
    		this.$store.commit('newaudio',{index:currentIndex,src:''});

    		// 判断连续点击，2s内连续点击只做最后一次请求
    		if(this.continueClick!=null){
        			clearTimeout(this.continueClick);
      		}
      		this.continueClick=setTimeout(()=>{

      			// 播放请求
    		     this.axios(config).then(function(response){
    		     	if(_this.audio.index===currentIndex){// 超过2s点击判断是否为最后一次请求
    		     		src=response.data.data[0].url;
    		           	_this.$store.commit('newaudio',{index:currentIndex,src:src});
    		    		_this.$store.commit('play',true);
		 		_this.$store.commit('playImgSrc','stopImgSrc');
    		     	}
    		      }).catch(function(response){
    				console.log(response)
    			    });
    		},2000)
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
    				src=response.data.data[0].url;
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
  },

  //加载更多
  loadBottom(){
  	var config={
    		method: 'post',
            	url: '/api/find-music',
            	data: {
            	musicName:this.musicName,
            	offset:this.pageNo*20
            	}
        }
    	var _this=this;
  	this.pageNo+=1;//每次页数递增1
  	if(this.pageNo==this.totalCount){
  		this.allLoaded=true;//当allLoaded为true时，上拉加载停止
  		this.bottomText="没有更多的数据了"
  	}

  	// 2s后才做请求，以免数据显示过快loading图标一闪而过，体验不好
  	setTimeout(()=>{
    	if(this.musicName){
  	      this.axios(config).then(function(response){
  		      _this.musicFindData=_this.musicFindData.concat(response.data.result.songs);
  		      _this.$refs.loadmore.onBottomLoaded();
  	      }).catch(function(response) {
  	      	  _this.$refs.loadmore.onBottomLoaded();
              console.log(response);
          });
        }
  	},2000);
  },
  handleBottomChange(status){
  	this.bottomStatus=status;
  }
}

}
</script>

<style lang="scss" scoped>
.find{
	width:100%;
	height:100%;
	display: flex;
	flex-direction:column;
	.findNav{
		width:100%;
		height:40px;
		background-color: #f44336;
		display:flex;
		align-items:center;
		.back{
			flex:1;
			display:flex;
			align-items:center;
			margin-left: 10px;
			.back-icon{
				background: url('../assets/icon/back.svg') no-repeat center center;background-size: contain;
			}
			i{
				width:25px;
				height:25px;
				cursor: pointer;
				display:inline-block;
			}
		}
		.findContent{
			flex:7;
			input{
				width:95%;
				height:30px;
				font-size: 18px;
				border: none;
				padding-left: 5px;
				background-color:#f44336;
				outline: none;
				border-bottom: 1px solid white;
				color:white;
			}
			input::placeholder{
				color:rgba(255,255,255,0.5);
			}
		}
		.close{
		}
	}
	.musicSuggest{
		width:92%;
		position: absolute;
		top:45px;
		right:3.5%;
		box-shadow: 0 5px 20px gray;
		background-color:#e6e6e6;
		z-index:5;
		.musicSuggestList{
			width:95%;
			height:40px;
			line-height:40px;
			padding-left: 10px;
			font-size:18px;
			border-bottom: 1px solid rgba(0,0,0,0.1);
			display:flex;
			align-items:center;
			overflow: hidden;
			.suggest-icon{
				width:25px;
				height:25px;
				background: url('../assets/icon/search.svg') no-repeat center center;background-size: contain;
			}
			.suggestName{
				margin-left:10px;
				flex:1;
				white-space:nowrap;
      				overflow:hidden;
      				text-overflow:ellipsis;//文字超出部分省略号显示
				// overflow: hidden;
			}
			.suggestDefault{
				// width:60px;
				// height:40px;
			}
			span{
				display:inline-block;
			}
		}
	}
	.loading{
		flex:8;
		overflow: auto;
		background-color:#e6e6e6;
		display:flex;
		justify-content: center;
        		align-items: center;
		.mt-spinner{
			width:50px;
			height:50px;
		}
	}
	.musicList{
		flex:8;
		overflow: auto;
		background-color:#e6e6e6;
		.music-list{
			width:100%;
			height:70px;
			border-bottom: 1px solid rgba(0, 0, 0, 0.05);
			overflow:hidden;
			display:flex;
			span{
        	height:70px;
        	display: inline-block;
        	vertical-align: top;
            }
            .music-index{
        	width:30px;
        	line-height: 70px;
        	text-align: center;
            }
            .musicName{
            	display:flex;
            	flex-direction:column;
            	flex:7;
            	line-height:35px;
            	padding-left: 10px;
            	font-size: 18px;
            	cursor:pointer;
            	-webkit-tap-highlight-color: rgba(0,0,0,0);
				-webkit-tap-highlight-color: transparent;
				.music-name{
				    flex:1;
				}
				.author{
					flex:1;
					font-size: 12px;
				}
            }
		}
		.music-list:active{
			background-color: #cdcdcd;
		}
	}
}
.loadmore{
	width:20px;
	height:20px;
}
.mint-loadmore-bottom{
	display:flex;
	justify-content:center;
	align-items:center;
}
</style>