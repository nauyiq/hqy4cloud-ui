<template>
  <div>
    <Header/>
    <div class="flex flex-column align-center" v-loading.fullscreen.lock="pageLoad">
      <div class="list">
        <div class="articleType">
          <el-tag @click="getArtList()" class="type-tag" :hit="concurrentTagIndex === 0">All</el-tag>
          <el-tag
              v-for="(type, index) in articleTypes"
              :key="type.id"
              :hit="concurrentTagIndex === index + 1"
              :effect="getEffect(index)"

              @click="getArtList(type.id, index + 1)"
              class="type-tag">
            {{ type.name }}
          </el-tag>
        </div>

        <ul class="monUl" v-for="(item, index) in requestDatas" :key="index">
          <li class="monTitle">{{ item[0].month }}, {{ item[0].year }}</li>
          <router-link tag="ul" :to="{name: 'Detail', params: {id: thunk.id}}" class="mContent fadeInUp"
                       :class="`wow${thunk.index}`" v-for="thunk in item" :key="thunk.id">
            <li class="mCLi flex space-between">
              <div class="mCLeft flex align-center">
                <img :src="thunk.cover" :title="thunk.title" :alt="thunk.title"
                     @error="e => { e.target.src = this.onerrorImg() }"/>
                <div class="mCLText flex flex-column space-around">
                  <span>{{ thunk.title }}</span>
                  <span>{{ thunk.statistics.likes }} LIKED / {{ thunk.statistics.visits }} READ</span>
                </div>
              </div>
              <span class="mCRight flex align-center">{{ thunk.day }}</span>
            </li>
          </router-link>
        </ul>
      </div>
      <div class="footer">
        <Loader v-show="isLoading && !pageLoad"/>
        <span class="notMany" v-show="!isLoading && !pageLoad">- No More - </span>
      </div>
    </div>
  </div>

</template>
<script>
import Loader from "@c/Loading"
import {WOW} from 'wowjs'
import {bottomHandle, clearBottomHandle} from '@/utils'
import {articleTypes} from "@/api/article";

export default {
  name: 'articleList',
  components: {Loader},
  data() {
    return {
      page: {
        pageSize: 15,
        pageNum: 1,
        type: null
      },
      requestDatas: [],
      pageLoad: true,
      isLoading: false,
      isNext: false,
      wowNum: 0,
      len: 0,
      articleTypes: [],
      concurrentTagIndex: 0
    }
  },
  watch: {
    requestDatas: {
      handler() {
        this.$nextTick(() => {
          new WOW({live: false, offset: 0, boxClass: `wow${this.wowNum++}`,}).init()
        })
      }
    }
  },
  created() {
    this.getArtList()
    this.getArticleTypes()
  },
  activated() {
    bottomHandle(() => this.isNext, () => {
      this.page.pageNum += 1
      this.getArtList()
    })
  },
  deactivated() {
    clearBottomHandle()
  },
  methods: {
    async getArtList(type, index) {
      if (type) {
        this.page.type = type
      } else {
        this.page.type = null
      }

      if (index) {
        this.concurrentTagIndex = index
      } else {
        this.concurrentTagIndex = 0;
      }

      this.isLoading = this.page.pageNum !== 1;

      const result = await this.$store.dispatch('getArtList', this.page)
      const {total, resultList} = result.data.data
      const len = resultList.length
      resultList.forEach(item => this.$store.dispatch('dataHandle', item)) // 增加年月日字段
      const map = new Map();
      resultList.map((item) => {
        const key = item.year + item.month
        if (map.has(key)) {
          const arrOldValueItem = map.get(key);
          map.set(key, [...arrOldValueItem, item]);
        } else {
          map.set(key, [item]);
        }
      })
      const newResultList = [...map.values()];

      setTimeout(() => {
        this.requestDatas = newResultList
        this.pageLoad = false
        this.isLoading = false
        this.len += len
        // this.isNext = this.len !== total
        this.isNext = result.data.data.currentPage < result.data.data.pages
      }, 500)
    },
    async getArticleTypes() {
      const result = await articleTypes();
      this.articleTypes = result.data.data;
    },

    getEffect(index) {
      if (index % 2 === 0) {
        return "dark"
        // return "plain"
      } else {
        return "light"
      }
    },
    onerrorImg() {
      return "https://file.hongqy1024.cn/files/blog/default_cover.jpg"
    }
  }
};
</script>

<style lang="less" scoped>
.list {
  width: 1000px;
  padding: 80px 0 0px;

  .monUl {
    .monTitle {
      color: #6e7ab5;
      font-weight: 400;
      font-size: 18px;
      margin: 30px 0 10px;
      list-style: none;
      position: relative;

      &::before {
        content: "";
        width: 12px;
        height: 12px;
        display: inline-block;
        background-color: #dce8ec;
        border: 3px solid #afcfff;
        margin-right: 22px;
        border-radius: 50%;
        box-sizing: border-box;
      }
    }

    .mContent {
      padding-left: 30px;
      border-left: 1px solid #f3fafd;
      margin-left: 6px;

      .mCLi {
        padding: 25px 0;
        border-bottom: 1px solid #f3fafd;

        .mCLeft {
          img {
            flex-shrink: 0;
            width: 45px;
            height: 45px;
            border-radius: 4px;
            margin-right: 15px;
            overflow: hidden;
            cursor: pointer;
            border: 1px solid #f3fafd;
          }

          .mCLText {
            span:first-of-type {
              color: #5b6773;
              cursor: pointer;
              font-size: 15px;
              padding-bottom: 10px;
              transition: all .6s;
            }

            //span:nth-of-type(odd):hover {
            //  text-decoration: none;
            //  background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 4'%3E%3Cpath fill='none' stroke='blue' d='M0 3.5c5 0 5-3 10-3s5 3 10 3 5-3 10-3 5 3 10 3'/%3E%3C/svg%3E") repeat-x 0 100%;
            //  background-size: 20px auto;
            //  animation: waveMove 1s infinite linear;
            //}
            span {
              color: #a1a0d6;
              font-size: 13px;
              letter-spacing: 0;
            }
          }
        }

        .mCRight {
          color: #d2c6a3;
          font-size: 13px;
        }
      }
    }
  }
}

.notMany {
  padding: 20px 0 0;
  color: #909090;
  letter-spacing: 2px;
  transition: all .3s;
  border-radius: 4px;
  text-align: center;
  display: inline-block;
  width: 100%;
}

.footer {
  height: 40px;
  margin-bottom: 40px;
}

.articleType {
  text-align: center;

  .type-tag {
    cursor: pointer;
    width: 120px;
    margin-left: 10px;
    font-size: 16px;
  }


}



@media screen and (max-width: 768px) {
  .list {
    width: 100%;
    padding: 80px 20px 20px;
  }
}



</style>