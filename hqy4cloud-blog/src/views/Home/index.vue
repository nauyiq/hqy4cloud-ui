<template>
  <div class="outer">
    <GiantScreen />
    <div class="content-wrap">
      <Article :datas="requestDatas" :isLoading="isLoading" :isNext="isNext" />
    </div>
  </div>
</template>
<script>
import GiantScreen from '@c/GiantScreen/index'
import Article from '@c/Article/index'
import { bottomHandle, clearBottomHandle } from '@/utils'

export default {
  name: 'home',
  components: { GiantScreen, Article },
  data () {
    return {
      requestDatas: [],
      page: {
        pageSize: 5,
        pageNum: 1,
        isHome: true
      },
      len: 0,
      isLoading: false,
      isNext: false
    }
  },
  created () {
    this.getArtList()
  },
  activated () {
    bottomHandle(()=> this.isNext, () => {
      this.isLoading = true
      this.page.pageNum = 1
      this.getArtList()
    })
  },
  deactivated () {
    clearBottomHandle()
  },
  methods: {
    async getArtList () {
      const result = await this.$store.dispatch('getArtList', this.page)
      const {total, resultList } = result.data.data
      const len = resultList.length
      resultList.forEach(item => this.$store.dispatch('dataHandle', item)) // 增加年月日字段
      setTimeout(() => {
        this.requestDatas.push(...resultList)
        this.len += len
        this.isNext = result.data.data.currentPage < result.data.data.pages
        this.isLoading = false
      }, 1000)
    }
  }
}
</script>
<style lang="less" scoped>
.outer {
  overflow: hidden;
}
.content-wrap {
  position: relative;
  padding: 100px 0 ;
  &::after {
    content: '';
    left: 50%;
    transform: translateX(-50%);
    top: 0;
    position: absolute;
    background: #eaeaea;
    z-index: 0;
    width: 1px;
    height: 100%;
  }
}
@media screen and (max-width: 1200px) {
  .content-wrap {
    width: 900px; 
  }
}
@media screen and (max-width: 900px) {
  .content-wrap {
    width: 100%
  }
}
</style>