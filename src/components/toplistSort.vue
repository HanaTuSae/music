<template>
	<div class="toplistSort">
    <!-- 标题 -->
    <ul class="toplist-title">
      <li><i @click="close"></i></li>
      <li>
        <span>{{name}}</span>
      </li>
    </ul>

    <div class="content">
      <!-- 官方榜 -->
      <div class="toplist-content">
        <div class="title">
          <span class="title-name">{{toplist.official}}</span>
          <span class="title-icon"></span>
        </div>
        <ul class="official">
          <li class="official-item" v-for="(list,index) in toplistOfficial" @click="toplistDetail(index)">
            <img v-lazy="list.coverImgUrl">
            <span>{{list.updateFrequency}}</span>
          </li>
        </ul>
      </div>

      <!-- 全球榜 -->
      <div class="toplist-content">
        <div class="title">
          <span class="title-name">{{toplist.global}}</span>
          <span class="title-icon"></span>
        </div>
        <ul class="global">
          <li class="global-item" v-for="(list,index) in toplistGlobal" @click="toplistDetail(index+4)">
            <img v-lazy="list.coverImgUrl">
            <span>{{list.updateFrequency}}</span>
          </li>
        </ul>
      </div>
    </div>
	</div>
</template>

<script>
export default {
  name: 'toplistSort',
  data () {
    return {
      toplist:{
        official:'官方榜',
        global:'全球榜'
      },
      name:'排行榜'
    }
  },
  computed:{
    toplistSort(){
      return this.$store.state.toplistSort;
    },
    toplistOfficial(){
      return this.toplistSort.slice(0,4);
    },
    toplistGlobal(){
      return this.toplistSort.slice(4);
    }
  },
  watch:{
  },
  mounted(){},
  methods:{
    close(){
      this.$store.commit('isShowHeader',true);
      this.$store.commit('isShowToplistSort',false);
    },
    toplistDetail(index){
      var id=this.toplistSort[index].id;
      this.$store.dispatch('topList',id);
      this.$store.commit('isShowToplistSort',false);
      this.$store.commit('isShowToplist',true);
    },
  },
}
</script>

<style lang="scss" scoped>
@mixin iconStyle($pictureUrl){
  background: url($pictureUrl) no-repeat center center;
  background-size: contain;
}
.toplistSort{
  width:100%;
  height:100%;
  display: flex;
  flex-direction:column;
  .toplist-title{
    width:100%;
    height:40px;
    display: flex;
    background-color: #f44336;
    color:#fafafa;
    li:first-child{
      flex:1;
      display:flex;
      align-items:center;
      i{
        width:20px;
        height:20px;
        margin-left: 10px;
        @include iconStyle('../assets/icon/back.svg');
      }
    }
    li:last-child{
      flex:7;
      display:flex;
      flex-direction:column;
      justify-content:center;
      span{
        flex:1;
        // display:inline-block;
        line-height:40px;
        font-size: 16px;
      }
    }
  }
  .content{
    flex:1;
    overflow: auto;
    background-color: #fafafa;
    .toplist-content{
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
      .official,.global{
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
    }
  }
}
</style>