<template>
  <div class="inputOuter">
    <div class="inputContent" :class="hiddenOuter ? 'hiddenOuter' : ''">
<!--      <el-input v-model.trim="username" v-if="!isPerfect" :class="hiddenOuter ? 'outerInput' : ''" maxlength="10" show-word-limit class="username" placeholder="用户名称"></el-input>-->

      <div>
        <i class="el-icon-edit"></i>
      </div>
      <div>
<!--        <transition name="el-fade-in-linear">-->
<!--          <el-tag effect="dark" closable class="tag" @close="tagClose" v-if="aiteName" size="small" ></el-tag>-->
<!--        </transition>-->
      </div>
      <el-input type="textarea" :rows="rows" placeholder="Please input your comment." maxlength="130" show-word-limit resize="none" v-model.trim="userContent"  class="userContent" ></el-input>
      <Button :styles="{width: rows === 4 ? '80px' : '100px', height: rows === 4 ? '26px' : '34px', borderRadius: '10px'}" text="提交"  @onclick="comment" />
    </div>
  </div>
</template>

<script>
import Button from "@c/Button"
import { updateUserInfo } from '@/api/user'
import { valiFunc } from '@/utils'

export default {
  components: { Button },
  props: {
    /*aiteName: {
      type: String,
      default: ''
    },*/
    rows: {
      type: Number,
      default: 8
    },
    hiddenOuter: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      username: "",
      userContent: "",
      isPerfect: false
    }
  },
  created () {
    this.isAnyUserName()  // 如果该账号已经填了用户名，则不需要填了
  },
  methods: {
    async comment () {
      const valiData = [ { data: this.userContent, msg: '留言内容不能为空'} ]
      if (!this.username) { // 如果需要填用户名，则用户名不能为空
        valiData.push({ data: this.username, msg: '用户名不能为空'})
      }
      const result = await valiFunc(valiData) // 验证没通过
      if (!result) return // 返回
      !this.isPerfect && this.setUserNickName()
      this.$emit('comment', this.userContent)
      this.userContent = ''
    },
    // 判断是否需要填用户名
    isAnyUserName () { 
      try {
        const username = JSON.parse(localStorage.getItem('userInfo')).username
        // console.log(username)
        if (username) {
          this.username = username
          this.isPerfect = true
        }
      } catch (e) {}
    },
    // 如果需要完善用户名，则去完善
    async setUserNickName () {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        await updateUserInfo({username: this.username, id: userInfo.id})
        localStorage.setItem('userInfo', JSON.stringify({
          ...userInfo,
          username: this.username
        }))
        this.isPerfect = true
      } catch (e) {
        console.log(e)
      }
    },
    tagClose () {
      this.$emit('tagClose')
    }
  }
};
</script>

<style lang="less" scoped>
.inputContent {
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
  .username,
  .userContent {
    width: 50%;
    font-size: 14px;
    margin-right: 12px;
    transition: all 0.3s;
    border: none;
    border-radius: 4px;
    border-bottom: 1px dashed #f0f0f0;
    outline: none;
    /deep/ .el-input__inner {
      border: none;
      border-bottom: 1px dashed #dcdff6;
      &:focus {
        border-color: #008c8c;
      }
    }
    /deep/ .el-textarea__inner {
      border: 1px dashed #dcdff6;
      &:focus {
        border-color: #008c8c;
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
  .userContent {
    width: 100%;
    margin: 10px 0;
  }
}
</style>