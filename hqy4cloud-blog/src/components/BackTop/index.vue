<template>
  <div>
    <div class="back flex align-center justify-center" :class="type==='show' ? 'show' : 'exit'" @click="backTop">顶部</div>
  </div>

</template>

<script>
import { throttle } from '@/utils/index'
export default {
  data () {
    return {
      type: 'exit',
      throttleScrollHandle: ''
    }
  },
  created () {
    this.listenScroll()
  },
  methods: {
    // 回到顶部
    backTop () {
      const div = document.querySelector('#app')
      div.scrollIntoView({ behavior: 'smooth' })
    },
    // 监听页面滚动
    listenScroll () {
      this.throttleScrollHandle = throttle(this.scrollHandle, 200)
      document.addEventListener('scroll', this.throttleScrollHandle)
    },
    scrollHandle () {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset 
      scrollTop >= 60 ? this.type = 'show' : this.type = 'exit'
    }
  }
};
</script>

<style lang="less" scoped>
.back {
  position: fixed;
  background-color: #fff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  z-index: 5;
  right: 28px;
  bottom: 120px;
  color: #409eff;
  font-size: 12px;
  transition: all .3s;
  &.show {
    visibility: visible;
  }
  &.exit {
    opacity: 0;
  }
}


</style>