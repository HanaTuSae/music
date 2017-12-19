<template>
	<div class="allSonglist">
    <!-- 标题 -->
    <ul class="title">
      <li><i @click="close"></i></li>
      <li>
        <span>{{name}}</span>
      </li>
    </ul>

    <!-- songlist -->
    <ul class="songlist">
      <li class="songlist-item" v-for="(song,index) in allSonglist" @click="songlistDetail(index)">
        <img v-lazy="song.coverImgUrl">
        <span>{{song.name}}</span>
      </li>
    </ul>
	</div>
</template>

<script>
export default {
  name: 'allSonglist',
  data () {
    return {
      // show:'功能未完成'
      name:'歌单'
    }
  },
  computed:{
    allSonglist(){
      return this.$store.state.allSonglist;
    },
  },
  watch:{
  },
  mounted(){},
  methods:{
    close(){
      this.$store.commit('isShowHeader',true);
      this.$store.commit('isShowAllSongList',false);
    },
    songlistDetail(index){
      var id=this.allSonglist[index].id;
      this.$store.dispatch('songlistDetail',id);
      this.$store.commit('isShowAllSongList',false);
      this.$store.commit('isShowSonglistDetail',true);
      this.$store.commit('allSonglistFlag',true);
    },
  },
}
</script>

<style lang="scss" scoped>
@mixin iconStyle($pictureUrl){
  background: url($pictureUrl) no-repeat center center;
  background-size: contain;
}
.allSonglist{
  width:100%;
  height:100%;
  display: flex;
  flex-direction:column;
  overflow:hidden;
  .title{
    width:100%;
    height:40px;
    display: flex;
    background-color: #f44336;
    color:#fafafa;
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
        font-size: 16px;
      }
    }
  }
  .songlist{
    flex:1;
    display: flex;
    flex-wrap:wrap;
    justify-content:space-between;
    overflow:auto;
    li{
      // height:140px;
      width:49.5%;
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
}
</style>