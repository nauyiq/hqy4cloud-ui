import Vue from "vue";
import Vuex from "vuex";
import { list } from "@/api/article"
import user from './modules/user'
import common from './modules/common'
import getters from './getters'
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    showPageLoadScrollBar: false
  },
  mutations: {
    setShowPageLoadScrollBar (state, data) {
      state.showPageLoadScrollBar = !!data
    }
  },
  actions: {
    // 获取文章列表
    async getArtList (state, page) {
      return await list(page)
    },
    /**
     * 把日期变成 月份 哪一天 年份
     */
    async dataHandle(state, result) {
      const arr = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      // let [y, m, other] = result.createdAt.split("-")
      let [y, m, other] = result.created.split("-")
      const d = other.split(" ")[0]
      m = arr[parseInt(m)]
      const resultDate = [y, m, d]
      const keys = ['year', 'month', 'day']
      resultDate.forEach((item, index) => result[keys[index]] = resultDate[index])
      return result
    }
  },
  modules: {
    user,
    common
  },
  getters
});


export default store
