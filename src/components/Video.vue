<template>
	<div class="video">
    {{show}}
	</div>
</template>

<script>
export default {
  name: 'video',
  data () {
    return {
      show:'功能未完成'
    }
  }
}
</script>

<style lang="scss" scoped>
.video{
  width:100%;
  height:100%;
  position: absolute;
  top:0;
  left:0;
}
</style>