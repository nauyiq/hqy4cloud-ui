
import Vue from "vue";
// if (process.env.NODE_ENV !== 'production') {
  
  import('element-ui').then(ele => {
    Vue.use(ele)
  })
  import('element-ui/lib/theme-chalk/index.css')
  
// }

import App from "./App.vue";

import router from "./router/handler";

import store from "./store";

// 引入全局组件Header
import Header from "@c/Header"
Vue.component('Header', Header)
// 引入全局组件Header

// 引入 iconfont
import '@/assets/font/iconfont.css';
// 引入 iconfont

// 高亮富文本
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
hljs.registerLanguage('javascript', javascript);
Vue.directive('highlight',function (el) {
  let blocks = el.querySelectorAll('pre code');
  blocks.forEach((block)=>{
    hljs.highlightBlock(block)
  })
})
// 高亮富文本

// 引入markdown-css
import 'github-markdown-css/github-markdown.css'
// 引入markdown-css

Vue.config.productionTip = false;

// 设置请求域名
let mainUrl = process.env.VUE_APP_URL
Vue.prototype.mainUrl = mainUrl


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");


router.beforeEach((to, from, next) => {
  const token = store.getters.access_token
  if (to.meta.requireAuth) {
    if (token) {  //  当前的token是否存在
      next();
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  } else {
    next()
  }
})

if (process.env.NODE_ENV === 'development') {
  Vue.config.devtools = true
  Vue.config.productionTip = false
} else {
  Vue.config.devtools = false
  Vue.config.productionTip = false
}