<template>
  <div class="message">
    <span>评论列表</span>
    <span>（{{lists.total}}）</span>
    <div class="messageList" v-for="list in lists.resultList" :key="list.id">
      <div class="parent">
        <div class="ml-info flex align-center space-between">
          <div class="avatar-name flex align-center">
            <img :src="list.commenter.avatar ? list.commenter.avatar : onerrorAvatar()"  @error="e => { e.target.src = onerrorAvatar()}" alt/>
          </div>
          <div class="reply-date flex align-center space-between">
              <div class="name flex align-center">{{list.commenter.nickname}}<el-tag class="master" effect="dark" size="mini" v-if="list.commenter.id === 1">站主</el-tag> </div>
              <div class="flex algin-center">
                <div class="reply" @click="setInput(list.commenter, list.id)">回复</div>
                <div class="date">{{list.created}}</div>
              </div>
          </div>
        </div>
        <div class="ml-result">{{list.content}}</div>
      </div>
      <div class="children" v-for="children in list.children" :key="children.id">
        <div class="ml-info flex align-center space-between">
          <div class="avatar-name flex align-center">
            <img :src="children.commenter.avatar ? children.commenter.avatar : onerrorAvatar() " @error="e => { e.target.src = onerrorAvatar()}" alt/>
          </div>
          <div class="reply-date flex align-center space-between">
              <div class="name flex align-center">
              {{children.replier ? children.replier.nickname + " 回复 " + children.commenter.nickname: children.commenter.nickname}}
                <el-tag class="master" effect="dark" size="mini" v-if="children.commenter.id === 1" >站主</el-tag> </div>
              <div class="flex algin-center">
<!--                <div class="reply" @click="setInput(children.commenter, list.id)">回复</div>-->
                <div class="reply" @click="setInput(children.commenter, list.id)">回复</div>
                <div class="date">{{children.created}}</div>
              </div>
          </div>
        </div>
        <div class="ml-result">{{children.content}}</div>
      </div>
    </div>
    <div class="loader flex align-center justify-center">
      <Loader v-show="isLoading"/>
    </div>
  </div>
</template>

<script>
import Loader from "@c/Loading"
export default {
  props: {
    lists: {
      type: [Array, Object],
      default: () => {}
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isNext: {
      type: Boolean,
      default: true
    },
    errorAvatar: {
      type: String,
      default: "https://file.hongqy1024.cn/files/avatar/default_avatar.png"
    }
  },
  components: { Loader },
  data() {
    return {
      replyShow: ''
    };
  },
  methods: {
    setInput (data, parentId) {
      const hash = document.getElementById("hash")
      hash.scrollIntoView({
          behavior: "smooth"
      })
      data.parentId = parentId
      this.$emit('reply', data)
    },
    onerrorAvatar() {
      return "https://file.hongqy1024.cn/files/avatar/default_avatar.png"
    }
  }
};
</script>

<style lang="less" scoped>
.message {
  width: 100%;
  color: #333;
  font-weight: 400;
  margin-bottom: 20px;
  display: inline-block;
  position: relative;
  margin-top: 50px;

  span {
    &:first-of-type {
      font-size: 18px;
      margin-right: 8px;
      border-bottom: 1px solid #666;
    }
  }
  .messageList {
    padding: 25px 0;
    border-bottom: 1px solid #f6f7f8;
    &:first-of-type {
      margin-top: 16px;
    }
    .parent:hover, .children:hover {
        .reply {
            opacity: 1 !important;
        }
    }
    .children {
      padding-left: 50px;
      margin-top: 30px;
    }
    .ml-info {
      .avatar-name {
        img {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          margin-right: 12px;
        }
      }
      .reply-date {
        flex: 1;
        position: relative;
        .reply {
          opacity: 0;
          font-size: 12px;
          color: #89b603;
          margin-right: 12px;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: underline;
          text-transform: capitalize;
        }
        .date {
          color: #999;
          font-size: 13px;
          letter-spacing: 0;
        }
        .name {
          font-weight: 400;
          color: #89b603;
          font-size: 16px;
          height: 20px;
          transition: all 0.3s;
          position: relative;
          border-bottom: 1px dashed #89b60331;
          .master {
            border-bottom: none;
            font-size: 12px;
            margin-left: 10px;
          }
        }
      }
      
    }
    .ml-result {
      color: #303030;
      line-height: 22px;
      padding-left: 52px;
      white-space: pre-wrap;
      font-size: 14px;
      word-break: break-all;
    }
  }
}
.loader {
  height: 40px;
  margin-top: 30px;
  .notMany {
    letter-spacing: 2px;
    height: 34px;
    line-height: 36px;
    padding: 0 36px;
    color: #909090;
    border-bottom: none !important;
    font-size: 14px;
  }
}
@media screen and (max-width: 600px){
  .loader {
    height: 30px;
    margin-top: 10px;
    .notMany {
      font-size: 14px !important;
    }
  }
  .message {
    margin-top: 30px;
    .messageList {
      .ml-info {
        .avatar-name {
          img {
            width: 36px;
            height: 36px;
          }
          span {
            font-size: 13px;
          }
        }
        .reply-date {
          display: block;
          .name {
            font-size: 13px;
            display: block;
            border-bottom: none;
            margin-bottom: 2px;
            .master {
              font-size: 10px;
              margin-left: 10px;
            }
            /deep/ .el-tag--mini {
              height: 16px;
              line-height: 15px;
              padding: 0 3px;
            }
          }
          .reply {
            opacity: 1;
            position: absolute;
            right: 0;
            bottom: 14px;
          }
          .date {
            font-size: 12px;
          }
        }
        
      }
      .ml-result {
        font-size: 12px;
        padding-left: 0;
        margin-top: 10px;
        word-break: break-all;
      }
    }
  }
}
</style>