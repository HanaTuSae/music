<template>
  <div class="asideMenu" id="asideMenu">
    <!-- <div class="asideMenu-maskLayer" @click="closeAside"></div> -->
    <div class="asideMenu-main"  ref="asideMenuMain">
  	  <div class="asideMenu-top">
  	    <div class="logo"><img src="../assets/icon/aside/logo.png" alt="头像"></div>
  	    <div class="asideTop-content">
  		  <span class="name">{{name}}</span>
  		  <span class="grade">{{grade}}</span>
  		  <span class="sign" @click="sign">{{isSign}}</span>
  	    </div>
  	  </div>
  	  <div class="asideMenu-bottom">
  	    <ul>
  		  <li><ul>
  		    <li><i class="message-icon"></i><a href="/#">{{asideMenu[0]}}</a></li>
  		    <li><i class="member-icon"></i><a href="/#">{{asideMenu[1]}}</a></li>
  		    <li><i class="shopping-icon"></i><a href="/#">{{asideMenu[2]}}</a></li>
  		    <li><i class="onlineMusic-icon"></i><a href="/#">{{asideMenu[3]}}</a></li>
  		  </ul></li>
  		  <li class="asideSecondLi"><ul>
  		    <li><i class="friend-icon"></i><a href="/#">{{asideMenu[4]}}</a></li>
  		    <li><i class="near-icon"></i><a href="/#">{{asideMenu[5]}}</a></li>
  		  </ul></li>
  		  <li><ul>
  		    <li><i class="changeColor-icon"></i><a href="/#">{{asideMenu[6]}}</a></li>
  		    <li><i class="about-icon"></i><a href="/#">{{asideMenu[7]}}</a></li>
  		  </ul></li>
  	    </ul>
  	  </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'asideMenu',
  data () {
    return {
      name:'HanaTuSae',
      grade:'Lv.7',
      isSign:"签到",
      asideMenu:['我的消息','会员中心','商城','在线听歌免流量','我的好友','附近的人','个性换肤','关于']
    }
  },
  computed:{
  },
  mounted(){
  },
  methods:{
    sign(){
      this.isSign="已签到";
    },
    //点击aside以外地方关闭aside
    // closeAside(){
    // 	var asideMenuMain=this.$refs.asideMenuMain;
    // 	var e=window.event;
    // 	if(asideMenuMain.contains(e.target)||asideMenuMain===e.target){}else{
    // 		this.$store.commit('isShowAsideMenu',false);
    // 	}
    // }
  }
}
</script>

<style lang="scss" scoped>
@mixin iconStyle($pictureUrl,$backSize){
  background: url($pictureUrl) no-repeat center center;
  background-size: $backSize;
}
.asideMenu{
  width:70%;
  height:100%;
  position:absolute;
  top:0;
  left:0;
  z-index:360;
}
.asideMenu-main{
  width:100%;
  height:100%;
  box-shadow: 1px 0 20px gray;
  background-color: white;
  // position: relative;
  // left:0;
  // top:0;
  display: flex;
  flex-direction:column;
  position: absolute;
  .asideMenu-top{
	flex:1;
	//background:url('../assets/icon/aside/background.jpg') no-repeat center center;background-size: cover;
	@include iconStyle('/static/img/background.jpg',cover);
	position:relative;
	.logo img{
	  width:80px;
	  height:80px;
	  position:absolute;
	  left:10px;
	  bottom:25%;
	  border-radius: 100%;
	  background-color:#515151;
	}
	.asideTop-content{
	  width:100%;
	  height:30px;
	  position:absolute;
	  left:10px;
	  bottom:0.5%;
	  .name{
		font-size: 18px;
	  }
	  .grade{
		width:40px;
		height:10px;
		line-height: 10px;
		display:inline-block;
		border-radius: 5px;
		border:1px #515151 solid;
		font-size: 12px;
		text-align: center;
	  }
	  .sign{
		width:60px;
		height:20px;
		line-height: 20px;
		display:inline-block;
		border-radius: 12px;
		border:1px #515151 solid;
		text-align: center;
		font-size: 16px;
		position: relative;
		right:-10%;
		bottom:0;
		cursor: pointer;
	  }
	}
  }
  .asideMenu-bottom>ul{
	height:100%;
	width:100%;
	>li{
	  padding-left: 20px;
	  >ul>li{
		width:100%;
		height:30px;
		line-height: 30px;
		font-size: 16px;
		cursor:pointer;
		display:flex;
		align-items:center;
	  }
	}
  }
  .asideMenu-bottom{
	flex:3;
	.asideSecondLi{
	  border-top: 10px #ededed solid;
	  border-bottom: 10px #ededed solid;
	}
	.message-icon{
	  @include iconStyle('../assets/icon/aside/message.png',contain);
	}
	.member-icon{
	  @include iconStyle('../assets/icon/aside/member.png',contain);
	}
	.shopping-icon{
	  @include iconStyle('../assets/icon/aside/shopping.png',contain);
	}
	.onlineMusic-icon{
	  @include iconStyle('../assets/icon/aside/onlineMusic.png',contain);
	}
	.friend-icon{
	  @include iconStyle('../assets/icon/aside/friend.png',contain);
	}
	.near-icon{
	  @include iconStyle('../assets/icon/aside/near.png',contain);
	}
	.changeColor-icon{
	  @include iconStyle('../assets/icon/aside/changeColor.png',contain);
	}
	.about-icon{
	  @include iconStyle('../assets/icon/aside/about.png',contain);
	}
  }
}
a{
  text-decoration: none;
  color:#515151;
  flex:14;
  margin-left: 5px;
}
ul,li{
  list-style: none;
  list-style-type: none;
}
i{
  display:inline-block;
  flex:1.2;
  height:20px;
}
</style>