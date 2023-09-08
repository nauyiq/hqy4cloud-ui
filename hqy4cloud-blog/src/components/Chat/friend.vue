<template>
  <el-dialog
      title="添加好友"
      :visible="visible"
      :modal="true"
      :width="width"
      @close="closeDialog"
      append-to-body
  >
    <div class="mb-20">
      <el-input
          placeholder="请输入账号进行搜索"
          prefix-icon="el-icon-search"
          style="width: 300px"
          @keyup.enter.native="handleChange"
          v-model="keywords">
        <el-button slot="append" icon="el-icon-search" @click="handleChange"></el-button>
      </el-input>
    </div>
    <div class="dialog-main">
      <div  class="member-list">
        <div v-for="member in list" :key="member.id" class="member-item" @click="$user(member.id)">
          <div class="member-avatar">
            <img :src="member.avatar " @error="e => {e.target.src = onError}">
          </div>
          <div class="member-content">
            <div class="member-header">
              <span class="member-name">{{ member.nickname }}</span>
              <span class="member-account">{{ member.username }}</span>
            </div>
            <div class="member-actions">
              <el-button type="primary" size="mini">查看</el-button>
            </div>
          </div>
        </div>
      </div>
      <el-empty v-if="list.length === 0" ></el-empty>
    </div>
  </el-dialog>

</template>
<script>

import { searchImUsers } from "@/api/im/friend"
import defaultAvatar from '@/assets/img/default_avatar.png'
import UserCard from "@c/user/userCard";
export default {
  name: "friend",
  components: {UserCard},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: '612px',
    },
  },
  data() {
    return {
      keywords: "",
      list:[]
    };
  },
  mounted() {

  },
  methods: {
    closeDialog() {
      console.log(111111)
      this.$emit("update:visible", false);
      this.selectUid = [];
    },
    onError() {
      return  defaultAvatar
    },
    handleChange(){
      if(this.keywords){
        searchImUsers(this.keywords).then(res => {
          if (res.data.code === 0) {
            this.list = res.data.data;
          }
        })
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.dialog-main{
  height: 400px;
  overflow-y: auto;
}
.member-list{
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding:20px 0 20px 20px;
  .member-item {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 10px;
    width:512px;
    border: solid 1px #eee;
    border-radius: 8px;
    margin-right:20px;
    margin-bottom:20px;
    &:last-child{
      margin-right:0;
    }
    .member-avatar {
      margin-right: 10px;
      img {
        width: 44px;
        height: 44px;
        border-radius: 50%;
      }
    }
    .member-content {
      flex-grow: 1;
      display: flex;
      justify-content: space-between;
      .member-header {
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        .member-name {
          font-weight: bold;
          margin-right: 10px;
        }
        .member-account {
          margin-top:3px;
          font-size: 12px;
          color: #999;
        }
      }
      .member-actions {
        display: flex;
        justify-content: flex-end;
      }
    }
  }

}

</style>