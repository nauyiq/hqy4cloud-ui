<template>
  <el-dialog
      :visible="visible"
      :modal="true"
      :width="width"
      @open="openDialog"
      @close="closeDialog"
      append-to-body>

    <div>
      <div class="container">
        <div class="left">
          <el-input placeholder="搜索联系人"
                    prefix-icon="el-icon-search"
                    v-model="keywords"
                    class="input-with-select">
                    </el-input>
          <el-checkbox-group v-model="selectUid" fill="#888">
            <div v-if="keywords === ''">
              <div class="left-contacts-list" v-for="user in allFriends">
                <p class="lemon-sidebar__label" v-if="user.friends">{{user.index}}</p>
                <el-checkbox class="checkBox" v-for="friend in user.friends" :label="friend" :key="friend.id"  :disabled="isGroupMember(friend.id)">
                  <div>
                    <el-avatar :src="friend.avatar"></el-avatar>
                    <span style="margin-left: 6px; width: 100px;" class="nickname">{{friend.displayName}}</span>
                  </div>
                </el-checkbox>
              </div>
            </div>
            <div class="left-contacts-list" v-else>
              <el-checkbox class="checkBox" v-for="friend in allUser" :label="friend" :key="friend.id" :disabled="isGroupMember(friend.id)" >
                <div>
                  <el-avatar :src="friend.avatar"></el-avatar>
                  <span style="margin-left: 6px;" class="nickname">{{friend.displayName}}</span>
                </div>
              </el-checkbox>
            </div>

          </el-checkbox-group>
        </div>
        <!-- 分割线 -->
        <div>
          <el-divider direction="vertical" class="divider"></el-divider>
        </div>
        <div class="right" style="position: relative;">
          <el-checkbox-group
              v-model="selectUid">
            <el-checkbox v-for="user in selectUid" :label="user" :key="user.id" :disabled="isGroupMember(user.id)" >
              <el-avatar style="margin-left: 10px" :src="user.avatar"></el-avatar>
            </el-checkbox>
          </el-checkbox-group>

          <div style="margin-left: 35px; position: absolute; bottom: 0" >
            <el-button style="width: 75px" size="small" @click="closeDialog">取 消</el-button>
            <el-button style="width: 75px" size="small" type="primary" @click="manageGroup">确 定</el-button>
          </div>
        </div>
      </div>
    </div>

  </el-dialog>
</template>
<script>

import * as utils from "@/utils";

export default {
  name: "manageGroup",
  props: {
    title: {
      type: String,
      default: "创建群聊",
    },
    visible: {
      type: Boolean,
      default: false,
    },
    userIds: {
      type: Array,
      default: () => [],
    },
    allFriends: {
      type: Array,
      default: () => [],
    },
    isAdd: {
      type: Boolean,
      default: true,
    },
    width: {
      type: String,
      default: '612px',
    },
  },
  data() {
    return {
      selectUid: [],
      keywords:"",
      allUser: [],
      all: [],
      allIndexUser: [],
      groupName: "",
      defaultProps: {
        key: "id",
        label: "username",
        pinyin: "displayName"
      },
    };
  },
  watch:{
    keywords() {
      if (this.keywords === '') {
        this.allUser = this.allIndexUser
      } else {
        this.allUser = []
        this.allUser = utils.search_object(
            this.all,
            ["displayName"],
            this.keywords
        );
      }
    },
    allFriends() {
      this.init()
    },
    isAdd() {
      this.doIsAdd()
    }
  },
  methods: {
    doIsAdd() {
      if (this.isAdd) {
        this.selectUid = []
      } else {
        this.selectUid = []
        this.userIds.forEach( useId => {
          let find = this.all.find(({ id }) => id === useId);
          if (find) {
            this.selectUid.push(find)
          }
        })
      }
    },
    init() {
      if (this.allFriends.length > 0) {
        this.allIndexUser = this.allFriends
        this.all = []
        this.allIndexUser.forEach(user => {
          if (user.friends) {
            user.friends.forEach(friend => {
              this.all.push(friend)
            })
          }
        })
      } else {
        this.allIndexUser = []
        this.all = []
      }
    },
    openDialog() {
      // this.init()
      // this.getAllUser(params);
    },
    closeDialog() {
      this.$emit("update:visible", false);
    },
    manageGroup() {
      let selectUid = []
      if (this.isAdd) {
        this.selectUid.forEach(e => {
          selectUid.push(e.id)
        })
      } else {
        this.userIds.forEach(uid => {
          this.selectUid.forEach(e => {
            if (e.id !== uid) {
              selectUid.push(e.id)
            }
          })
        })
      }
      if(!this.isAdd) {
        // 添加成员
        if (selectUid.length < 1) {
          this.$message.error("请选择要添加的成员");
          return;
        }
      }else{
        // 创建群聊
        if (this.selectUid.length < 2) {
          this.$message.error("群聊人数不能少于2人");
          return;
        }
      }
      this.$emit("manageGroup", selectUid, this.isAdd, this.groupName);
      this.doIsAdd()
    },
    isGroupMember(memberId) {
      if (this.isAdd) {
        return false
      }
      let result = false
      if (this.userIds.length > 0) {
        this.userIds.forEach(id => {
          if (id === memberId) {
            result = true
          }
        })
      }
      return result
    },
  },
};
</script>


<style lang="scss" scoped>

/deep/ .is-checked {
  .el-checkbox__inner {
    background-color: #888;
    border: 1px solid #888;
  }
  .el-checkbox__label {
    color: #888;
  }
}


::v-deep .lemon-sidebar__label {
  padding: 12px 8px 0px 0px;
}

::v-deep .left .el-checkbox__label   {
  margin-top: 5px;
  font-size: 14px;
  margin-bottom: 5px;
  //width: 100%;
  width: 250px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;//可以实现复选框和文字垂直方向居中
  span{
    word-break: normal;
    white-space: nowrap;
    word-wrap: break-word;
    overflow: hidden;
  }
}

::v-deep .el-checkbox__label   {
  margin-top: 10px;
  font-size: 14px;
  margin-bottom: 5px;
  width: 100%;
  //width: 250px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;//可以实现复选框和文字垂直方向居中
}

.divider{
  height: 100%;
  width: 2px !important;
}


.container {
  height: 100%;
  display: flex;
  justify-content: space-between;
  margin: 0 10px;
}
.left, .right {
  flex: 1;
}
.left {
  margin-right: 10px;
}

.left-contacts-list {
  overflow-y: auto;
}

::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(142, 144, 145, 0.82); /* 设置滚动条的颜色 */
  border-radius: 5px; /* 设置滚动条的圆角 */
}
::-webkit-scrollbar-track {
  background-color: #F5F5F5; /* 设置滚动条轨道的背景色 */
  border-radius: 5px; /* 设置滚动条轨道的圆角 */
}

/*::v-deep  .checkBox .is-bordered.is-checked {
  border-color: #888;
}

!* 设置选中后的文字颜色 *!
::v-deep  .checkBox .el-checkbox__input.is-checked+.el-checkbox__label {
  color: #888;
}

!* 设置选中后对勾框的边框和背景颜色 *!
::v-deep .checkBox .el-checkbox__input.is-checked .el-checkbox__inner, .checkBox .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  border-color: #888;
  background-color:#888;
}

!* 设置checkbox获得焦点后，对勾框的边框颜色 *!
::v-deep .checkBox .el-checkbox__input.is-focus .el-checkbox__inner{
  border-color: #888;
}

!* 设置鼠标经过对勾框，对勾框边框的颜色 *!
::v-deep .checkBox .el-checkbox__inner:hover{
  border-color: #888;
}*/





</style>