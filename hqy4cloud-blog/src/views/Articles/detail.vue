<template>
  <div class="flex flex-column align-center">
    <scrollBar/>
    <Header @like="likeChange" :isLike="detail.accessStatus ? detail.accessStatus.isLike : false" :midText="detail.title" :showLike="true" :music="detail.backgroundMusic" />
    <div class="detail">
      <h1 class="title">{{detail.title}}</h1>
      <div class="status flex align-center">
        <span>{{detail.month}} {{detail.day}}, {{detail.year}}</span>
        <span>阅读 {{detail.statistics ? detail.statistics.visits: 0}}</span>
        <span>评论：{{detail.statistics ? detail.statistics.comments : 0}}</span>
        <span>喜欢: {{detail.statistics ? detail.statistics.likes : 0}}</span>
      </div>

      <div class="content">
        <div class="toc">
          <el-tree class="tree" ref="tree" node-key="uuid" :data="treeData" :props="defaultProps"  :empty-text="emptyText" default-expand-all>
            <div class="custom-tree-node" slot-scope="{ node, data }">
              <div @click="toDiv(data.uuid)">{{ data.text }}</div>
            </div>
          </el-tree>
        </div>
        <div class="markdown-body html-content" v-html="content" v-highlight ></div>
      </div>
      <div class="down flex align-center justify-center" :class="'show'" @click="backBottom">评论</div>
      <div id="hash"></div>
      <comment class="comments" @commentChange="commentChange" @getComData='getComData' :comments="commentList.resultList" :isLoading="isLoading" :isNext="isNext" />
    </div>
  </div>
</template> 

<script>
import marked from "marked";
import "highlight.js/styles/monokai-sublime.css";
import { detail, setLike } from "@/api/article";
import scrollBar  from './components/scrollBar'
import Comment from './components/comment'
import { list } from "@/api/comment"
import { bottomHandle } from '@/utils'
import { getStatus, setStatus } from "@/utils/request";
import { readArticle } from "@/api/article";
import $ from 'jquery'
import {mapState} from "vuex";

export default {
  name: "detail",
  components: { scrollBar, Comment },
  computed: {
    ...mapState({
      isToken:  state => state.user.access_token,
    })
  },
  data() {
    return {
      treeData: [],
      defaultProps: {
        label: 'text',
        children: 'children',
      },
      emptyText: '',
      detail: {},
      commentList: [],
      userName: '',
      aiteName: '',
      placeholder: "", // 回复者名称
      floorId: '',
      userContent: '',
      content: '',
      page: {
        pageSize: 10,
        pageNum: 1,
      },
      rows: 6, // input的高
      isLoading: false,
      isNext: false
    };
  },
  async created () {
    await this.getDetail(this.$route.params.id); // 获取详情
    await this.readArticle(this.$route.params.id)
    await this.markdownRender() // markdown 加载
    this.setInputHeight()
    this.$nextTick(() => {
      this.getCatalog()
    })
  },
  mounted () {
    this.getComData() // 加载留言列表
    bottomHandle(()=> this.isNext, () => { // 触底监听事件
      this.isLoading = true
      this.page.pageNum += 1
      this.getComData()
    })
  },
  methods: {
    async getDetail(id) {
      const result = await detail(id);
      const data = await this.$store.dispatch('dataHandle', result.data.data)
      document.title = data.title // 动态设置页面的title
      this.detail = data;
    },
    async readArticle(id) {
      const userInfo = localStorage.getItem("userInfo")
      if (userInfo) {
        const name = JSON.parse(userInfo).username
        const status = getStatus();
        if (!status || status !== name) {
          await readArticle(id).then(() => {
            this.$set(this.detail.statistics, 'visits', this.detail.statistics.visits ? this.detail.statistics.visits + 1 : 1)
            setStatus(name)
          })
        }
      }
    },
    // 回到底部
    backBottom () {
      const div = document.querySelector('.comments')
      div.scrollIntoView({ behavior: 'smooth' })
      /*div.scrollTo({
        top: document.querySelector('#app').scrollHeight,
        behavior: "smooth"
      })*/
    },
    markdownRender() {
      marked.setOptions({
        renderer: new marked.Renderer(),
        pedantic: false,
        gfm: true,
        tables: true,
        breaks: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        xhtml: false
      });
      this.content = marked(this.detail.content)
    },
    // 子层评论
    reply (data) {
      this.aiteName = data.userName
      this.floorId = data.parentId
    },
    // 清楚掉aite后 删除艾特信息
    tagClose () {
      this.aiteName = ''
      this.floorId = ''
    },
    // 根据内容获取目录
    getCatalog() {
      // const h = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
      const h = ['h2', 'h3', 'h4', 'h5', 'h6']
      var elements = $(':header')
      let hElements = []
      for (const key of elements) {
        if (h.indexOf(key.localName) > -1) {
          let text
          if (key.children && key.children.length) {
            text = this.getText(key.children)
          } else {
            text = key.innerHTML
          }
          hElements.push({
            hLevel: parseInt(key.localName[1]),
            text,
            id: key.localName,
            uuid: key.id,
          })
        }
      }
      let result = this.toTree(hElements)
      this.treeData = result

      // 目录默认选中第一个
      this.$nextTick(() => {
        if (!result) return
        this.$refs.tree.setCurrentKey(result[0].uuid)
      })
      // console.log('result:', result)
    },
    toTree(flatArr) {
      var tree = []
      var copyArr = flatArr.map(function(item) {
        return item
      })

      // 根据指定级别查找该级别的子孙级，并删除掉已经查找到的子孙级
      var getChildrenByLevel = function(currentLevelItem, arr, level) {
        if (!currentLevelItem) {
          return
        }
        // 将level值转成负数，再进行比较
        var minusCurrentLevel = -currentLevelItem.hLevel
        var children = []
        for (var i = 0, len = arr.length; i < len; i++) {
          var levelItem = arr[i]
          if (-levelItem.hLevel < minusCurrentLevel) {
            children.push(levelItem)
          } else {
            // 只找最近那些子孙级
            break
          }
        }
        // 从数组中删除已经找到的那些子孙级，以免影响到其他子孙级的查找
        if (children.length > 0) {
          arr.splice(0, children.length)
        }
        return children
      }

      var getTree = function(result, arr, level) {
        // 首先将数组第一位移除掉，并添加到结果集中
        var currentItem = arr.shift()

        currentItem.level = level
        result.push(currentItem)
        while (arr.length > 0) {
          if (!currentItem) {
            return
          }
          // 根据当前级别获取它的子孙级
          var children = getChildrenByLevel(currentItem, arr, level)
          // 如果当前级别没有子孙级则开始下一个
          if (children.length == 0) {
            currentItem = arr.shift()
            currentItem.level = level
            if (currentItem) {
              result.push(currentItem)
            }
            continue
          }
          currentItem.children = []
          // 查找到的子孙级继续查找子孙级
          getTree(currentItem.children, children, level + 1)
        }
      }
      getTree(tree, copyArr, 1)
      return tree
    },
    getText(arr) {
      let result = null
      if (!arr.length) return
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].children && arr[i].children.length) {
          result = this.getText(arr[i].children)
        } else {
          result = arr[i].innerHTML
        }
      }

      return result
    },
    toDiv(uuid) {
      document.getElementById(uuid).scrollIntoView({
        behavior: 'smooth',
      })
    },
    // 获取评论列表
    async getComData () {
      const data = {
        ...this.page,
        articleId: this.$route.params.id
      }
      const result = await list(data)
      setTimeout(() => {
        this.commentList = result.data.data
        this.isNext = result.data.data.currentPage < result.data.data.pages
        this.isLoading = false
      }, 1000)
    },
    // 设置喜欢这篇文章
    async likeChange (e) {
      if (!this.isToken) {
        this.$message({
          type: 'warning',
          message: '登录过期或未登录，请先登录',
          offset: 60
        })
        await this.$router.push("/login")
        return
      }
      if (!e) { // 未喜欢这篇文章
        await setLike(this.detail.id)
        this.$set(this.detail.accessStatus, 'isLike', true)
        this.$set(this.detail.statistics, 'likes', this.detail.statistics.likes ? this.detail.statistics.likes + 1 : 1)
      } else {
        const result = await setLike(this.detail.id)
        this.$set(this.detail.accessStatus, 'isLike', false)
        this.$set(this.detail.statistics, 'likes', this.detail.statistics.likes - 1)
      }
    },

    async commentChange(number) {
      if (number) {
        let result;
        if (this.detail.statistics.comments) {
          result = this.detail.statistics.comments + number
          if (number < 0) {
            result = 0
          }
        } else {
          result = 0
        }
        this.$set(this.detail.statistics, 'comments', result)
      }
    },
    setInputHeight () {
      const width = document.documentElement.clientWidth
      width <= 600 && (this.rows = 4)
    },
  }
};
</script>

<style lang="less" scoped>
#hash {
  margin-bottom: 100px;
}

.down {
  position: fixed;
  background-color: #fff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  z-index: 5;
  right: 28px;
  bottom: 55px;
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

.comments{
  margin-top: 50px;
}

.tree {
  margin-right: 15px;
  overflow-y: auto;
  width: 280px;
  flex-shrink: 0;
}

.content {
  display: flex;
  /* padding: 30px; */
  overflow: hidden;
  //height: 100vh;
}

.html-content {
  overflow-y: auto;
}

.detail {
  width: 1000px;
  .title {
    font-size: 30px;
    padding: 130px 0 22px;
    color: #333;
  }
  .status {
    color: #6a737d;
    position: relative;
    line-height: 22px;
    &::before {
      content: "";
      width: 100%;
      height: 1px;
      background: #eaeaeaa6;
      position: absolute;
      left: 0;
      bottom: -30px;
    }
    span {
      font-size: 13px;
      margin-right: 10px;
    }
  }
  .content {
    padding-top: 100px;
    font-size: 14px;
  }
  
}

@media screen and (max-width: 800px) {
  .detail {
    width: 90%;
  }
}
@media screen and (max-width: 600px) {
  .detail {
    .content {
      padding-top: 30px;
    }
    .title {
      font-size: 26px;
      padding-top: 88px;
    }
    .status {
      span {
        font-size: 12px;
      }
    }
  }
}
</style>
