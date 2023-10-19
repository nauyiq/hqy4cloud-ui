<!--评论模块-->
<template>
  <div class="container">

    <div class="inputContent">
        <img class="avatar" v-if="ownerAvatar" :src="ownerAvatar" width="18" height="18"/>
      <el-input type="textarea" rows="3" autofocus placeholder="写下你的评论" maxlength="100" show-word-limit resize="none" v-model.trim="inputComment"  class="parent-content"  ></el-input>
      <div class="btn-control">
        <Button  :styles="{width: rows === 4 ? '80px' : '100px', height: rows === 4 ? '26px' : '34px', borderRadius: '10px'}" text="提交"  @onclick="commitComment()" />
      </div>
    </div>

    <div class="comment" v-for="item in comments">
      <div class="info">
        <img class="avatar" @click="$user(item.commenter.id)" :src="item.commenter.avatar" width="18" height="18"/>
        <div class="right">
          <div class="name" >{{item.commenter.nickname}}</div>
          <div class="date">{{item.created}}</div>
        </div>
      </div>
      <div class="content">{{item.content}}</div>
      <div class="control">
<!--        <span class="like" :class="{active: item.isLike}" @click="likeClick(item)">-->
<!--          <i class="iconfont icon-like"></i>-->
<!--          <span class="like-num">{{item.likeNum > 0 ? item.likeNum + '人赞' : '赞'}}</span>-->
<!--        </span>-->
        <div>
        <span class="comment-reply" @click="showCommentInputChildren(item, item.id)">
          <i class="iconfont el-icon-chat-round"></i>
          <span>评论</span>
        </span>
        </div>

        <div v-if="ownerId === item.commenter.id">
          <span class="comment-reply" style="margin-left: 9px">
            <i class="iconfont el-icon-delete" ></i>
            <el-popconfirm title="确定删除这条评论吗？" @confirm="deleteComment(item.id)">
              <el-button class="delete-btn" type="text" slot="reference">删除</el-button>
            </el-popconfirm>
          </span>
        </div>

<!--        <span class="comment-reply" style="margin-left: 9px" @click="deleteComment(item.id)">
                <i class="iconfont el-icon-delete" ></i><span>删除</span>
        </span>-->
      </div>
      <div class="reply">
        <div class="item" v-for="reply in item.replies">
          <div class="reply-content">
            <span class="from-name" style="cursor: pointer" @click="$user(reply.commenter.id)">{{reply.commenter.nickname}}:</span>
            <span v-if="reply.replier" class="to-name">@{{reply.replier.nickname}}</span>
            <span class="reply-content">{{reply.content}}</span>
          </div>
          <div class="reply-bottom">
            <span>{{reply.created}}</span>
            <span class="reply-text" @click="showCommentInput(item, reply)">
              <i class="iconfont el-icon-chat-round"></i>
              <span class="span-btn">回复</span>
            </span>
            <span class="reply-text"  v-if="ownerId === reply.commenter.id">
              <i class="iconfont el-icon-delete"></i>
                <el-popconfirm title="确定删除这条评论吗？" @confirm="deleteComment(reply.id)">
                <el-button class="delete-btn" type="text" slot="reference">删除</el-button>
                </el-popconfirm>
            </span>
          </div>
        </div>
        <div class="write-reply" v-if="item.replies.length > 0" @click="showCommentInputChildren(item, item.id)">
          <i class="el-icon-edit"></i>
          <span class="add-comment">添加新评论</span>
        </div>
        <transition name="fade">
          <div class="input-wrapper" v-if="showItemId === item.id">
            <el-input class="gray-bg-input"
                      v-model.trim="inputComment"
                      type="textarea"
                      :rows="3"
                      maxlength="100"
                      show-word-limit
                      resize="none"
                      autofocus
                      :placeholder="commentHolder"
                      >
            </el-input>
            <div class="btn-control">
              <span class="cancel" @click="cancel">取消</span>
              <Button :styles="{width: rows === 4 ? '80px' : '100px', height: rows === 4 ? '26px' :   '34px', borderRadius: '10px'}" text="提交"  @onclick="commitReply()" />
            </div>
          </div>
        </transition>
      </div>
    </div>
    <div class="loader flex align-center justify-center">
      <Loader v-show="isLoading"/>
       <span class="notMany" v-show="!isLoading && !isNext">- No More -</span>
    </div>
  </div>
</template>

<script>

import Vue from 'vue'
import Loader from "@c/Loading"
import Button from "@c/Button"
import {valiFunc} from "@/utils";
import {articleComment, deleteComment} from "@/api/comment";
import {mapState} from "vuex";


export default {
  props: {
    comments: {
      // type: Array,
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
    rows: {
      type: Number,
      default: 8
    }
  },
  components: { Loader, Button },
  data() {
    return {
      commentHolder: '',
      ownerAvatar:"",
      inputComment: '',
      replierId:'',
      parentId:'',
      showItemId: '',
      ownerId:'',
    }
  },
  computed: {
    ...mapState({
      loginUser: state => state.user.userInfo
    })
  },
  methods: {
    /**
     * 点赞
     */
    likeClick(item) {
      if (item.isLike === null) {
        Vue.$set(item, "isLike", true);
        item.likeNum++
      } else {
        if (item.isLike) {
          item.likeNum--
        } else {
          item.likeNum++
        }
        item.isLike = !item.isLike;
      }
    },

    /**
     * 点击取消按钮
     */
    cancel() {
      this.showItemId = ''
    },


    async commitComment () {
      const validContent = [ { data: this.inputComment, msg: 'Comment content should not be empty.'} ]
      const result = await valiFunc(validContent) // 验证没通过
      if (!result) return

      const data = {
        level: 1,
        articleId: this.$route.params.id,
        content: this.inputComment
      }
      try {
        articleComment(data).then(res => {
          if (res.data.code === 0) {
            this.$emit("commentChange", 1)
            this.$emit("getComData")
            this.$message({
              type: 'success',
              message: '评论成功.',
              offset: 60
            })
          } else if (res.data.code === 9300 || res.data.code === 9800) {
            this.$message({
              type: 'warning',
              message: '请登录后再评论.',
              offset: 60
            })
          } else {
            this.$message({
              type: 'warning',
              message: res.data.message,
              offset: 60
            })
          }
        })
      } catch (e) {}
    },

    /**
     * 提交评论
     */
    async commitReply() {
      const validContent = [ { data: this.inputComment, msg: 'Comment content should not be empty.'} ]
      const result = await valiFunc(validContent) // 验证没通过
      if (!result) return

      const data = {
        level: 2,
        articleId: this.$route.params.id,
        replier: this.replierId,
        parentId: this.parentId,
        content: this.inputComment
      }
      try {
        articleComment(data).then(res => {
          if (res.data.code === 0) {
            this.$emit("getComData")
            this.$emit("commentChange", 1)
            this.$message({
              type: 'success',
              message: '评论成功.',
              offset: 60
            })
            this.inputComment = ""
          } else if (res.data.code === 9300 || res.data.code === 9800) {
            this.$message({
              type: 'warning',
              message: '请登录后再评论.',
              offset: 60
            })
          }
        })
      } catch (e) {}
    },

    /**
     * 删除评论
     */
    async deleteComment(id) {
      try {
         deleteComment(id).then(res => {
           if (res.data.code === 0) {
             this.$emit("getComData")
             this.$emit("commentChange", -1)
             this.$message({
               type: 'success',
               message: '删除评论成功.',
               offset: 60
             })
           }
        })
      } catch (e) {

      }

    },

    /**
     * 点击评论按钮显示输入框
     * item: 当前大评论
     * reply: 当前回复的评论
     */
    showCommentInput(item, reply) {
      if (reply) {
        this.commentHolder =  "@" + reply.commenter.nickname + " "
        this.replierId = reply.commenter.id
        this.parentId = item.id
      }
      this.showItemId = item.id
    },
    showCommentInputChildren(item, parent) {
      this.showItemId = item.id
      this.parentId = parent;
    }
  },
  created() {
    if (this.loginUser) {
      this.ownerAvatar = this.loginUser.avatar
      this.ownerId = this.loginUser.id
    }

  }
}
</script>

<style scoped lang="scss">


$color-main: #409EFF;
$color-success: #67C23A;
$color-warning: #E6A23C;
$color-danger: #F56C6C;
$color-info: #909399;

$text-main: #303133;
$text-normal: #606266;
$text-minor: #909399;  //次要文字
$text-placeholder: #C0C4CC;
$text-333: #333;

$border-first: #DCDFE6;
$border-second: #E4E7ED;
$border-third: #EBEEF5;
$border-fourth: #F2F6FC;

$content-bg-color: #fff;

.btn-control {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: 10px;
  font-size: 14px;
  .cancel {
    font-size: 14px;
    color: $text-normal;
    margin-right: 20px;
    cursor: pointer;
    &:hover {
      color: $text-333;
    }
  }
  .confirm {
    font-size: 14px;
  }
}

.span-btn {
  margin-left: 4px;
}

.inputContent {
  margin-bottom: 50px;
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 15px 12px;
  transition: all 0.3s;
  font-size: 14px;
  color: #333333;
  &.hiddenOuter {
    border: none;
    padding: 0;
  }
  .tag {
    margin-top: 10px;
    border-radius: 20px;
  }
  .username.outerInput {
    border: 1px dashed #f0f0f0;;
    /deep/ .el-input__inner {
      border: 1px dashed #f0f0f0 !important;
      &:focus {
        border-color: #008c8c !important;
      }
    }
  }
  .right {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
  }
  .username,
  .parent-content {
    width: 50%;
    font-size: 14px;
    margin-right: 12px;
    transition: all 0.3s;
    border: none;
    border-radius: 4px;
    //border-bottom: 1px dashed #f0f0f0;
    outline: none;

    /deep/ .el-input__inner {
      border: none;
      border-bottom: 1px dashed #dcdff6;
      &:focus {
        border-color: #409EFF;
      }
    }
    /deep/ .el-textarea__inner {
      //border: 1px dashed #dcdff6;
      &:focus {
        border-color: #409EFF;
      }
    }

  }
  .submit {
    width: 100px;
    font-size: 14px;
    color: #5f5f5f;
    border-radius: 6px;
    background: #eaeaea;
    cursor: pointer;
    outline: none;
    border: none;
    margin-right: 12px;
    transition: all 0.3s;
  }
  .parent-content{
    width: 100%;
    margin: 10px 0;
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

.avatar {
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor:pointer;
}

.name {
  font-size: 16px;
  color: $text-main;
  margin-bottom: 5px;
  font-weight: 500;
}


.container {
  padding: 0 10px;
  box-sizing: border-box;
  width: 100%;
  overflow-x: hidden !important;

  .delete-btn {
    color: $text-minor;
    &:hover {
      color: $text-333;
    }
  }

  .comment {
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-bottom: 1px solid $border-fourth;
    .info {
      display: flex;
      align-items: center;
      .right {
        display: flex;
        flex-direction: column;
        margin-left: 10px;

        .date {
          font-size: 12px;
          color: $text-minor;
        }
      }
    }
    .content {
      font-size: 16px;
      color: $text-main;
      line-height: 20px;
      padding: 10px 0;
    }
    .control {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: $text-minor;
      .like {
        display: flex;
        align-items: center;
        margin-right: 20px;
        cursor: pointer;
        &.active, &:hover {
          color: $color-main;
        }
        .iconfont {
          font-size: 14px;
          margin-right: 5px;
        }
      }

      .comment-reply {
        display: flex;
        align-items: center;
        cursor: pointer;
        &:hover {
          color: $text-333;
        }
        .iconfont {
          font-size: 16px;
          margin-right: 5px;
        }
      }

    }
    .reply {
      margin: 10px 0;
      border-left: 2px solid $border-first;
      .item {
        margin: 0 10px;
        padding: 10px 0;
        border-bottom: 1px dashed $border-third;
        .reply-content {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: $text-main;
          .from-name {
            color: $color-main;
          }
          .to-name {
            color: $color-main;
            margin-left: 5px;
            margin-right: 5px;
          }
          .reply-content {
            margin-left: 5px;
          }
        }
        .reply-bottom {
          display: flex;
          align-items: center;
          margin-top: 6px;
          font-size: 12px;
          color: $text-minor;
          .reply-text {
            display: flex;
            align-items: center;
            margin-left: 10px;
            cursor: pointer;
            &:hover {
              color: $text-333;
            }
            .icon-comment {
              margin-right: 5px;
            }
          }
        }
      }
      .write-reply {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: $text-minor;
        padding: 10px;
        cursor: pointer;
        &:hover {
          color: $text-main;
        }
        .el-icon-edit {
          margin-right: 5px;
        }
      }
      .fade-enter-active, fade-leave-active {
        transition: opacity 0.5s;
      }
      .fade-enter, .fade-leave-to {
        opacity: 0;
      }
      .input-wrapper {
        padding: 10px;
        .gray-bg-input, .el-input__inner {
          /*background-color: #67C23A;*/
        }
      }
    }
  }
}
</style>