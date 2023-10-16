<template>
  <el-dialog
      :visible="visible"
      :modal="true"
      @close="closeDialog"
      :width="width"
      append-to-body>
    <div>
      <div class="container">
        <div class="left">
          <el-input placeholder="搜索联系人"
                    prefix-icon="el-icon-search"
                    v-model="keywords"
                    class="input-with-select">
          </el-input>
          <el-button style="width: 100%; margin-top: 5px;" size="small" v-if="newChat === false" @click="clickNewChat">创建新的聊天</el-button>
          <el-checkbox-group v-model="selectUid" fill="#888">
            <p v-if="!newChat" class="lemon-sidebar__label" style="margin-bottom: 10px">最近联系人</p>
            <div class="left-contacts-list" v-if="!newChat || keywords !== ''">
              <el-checkbox class="checkBox" v-for="contact in contacts" :label="contact" :key="contact.id" >
                <div>
                  <el-avatar :src="contact.avatar"></el-avatar>
                  <span style="margin-left: 6px; width: 50px;" class="nickname">
                  {{contact.displayName.length > 20 ? contact.displayName.substr(0, 10) + "..." : contact.displayName}}
                  </span>
                </div>
              </el-checkbox>
            </div>
            <div class="left-contacts-list" v-else>
              <div v-for="user in allIndexUser">
                <p class="lemon-sidebar__label" v-if="user.friends">{{user.index}}</p>
                <el-checkbox class="checkBox" v-for="friend in user.friends" :label="friend" :key="friend.id" >
                  <div>
                    <el-avatar :src="friend.avatar"></el-avatar>
                    <span style="margin-left: 6px; width: 50px;" class="nickname">
                    {{friend.displayName.length > 20 ? friend.displayName.substr(0, 10) + "..." : friend.displayName}}
                    </span>
                  </div>
                </el-checkbox>
              </div>
            </div>
          </el-checkbox-group>
        </div>
        <!-- 分割线 -->
        <div>
          <el-divider direction="vertical" class="divider"></el-divider>
        </div>
        <div class="right" style="position: relative;">
          <span style="margin-left: 5px;  margin-bottom: 5px; font-size: 14px; color: #6a737d">{{title}}</span>
          <el-checkbox-group
              v-model="selectUid">
            <el-checkbox v-for="user in selectUid" :label="user" :key="user.id" >
              <el-avatar style="margin-left: 10px" :src="user.avatar"></el-avatar>
              <span style="margin-left: 6px; width: 50px;" class="nickname">
                    {{user.displayName.length > 20 ? user.displayName.substr(0, 10) + "..." : user.displayName}}
                    </span>
            </el-checkbox>
          </el-checkbox-group>

          <div style="margin-left: 25px; position: absolute; bottom: 0" >
            <el-button style="width: 88px" size="small" @click="cancel">{{newChat ? "返 回" : "取 消"}}</el-button>
            <el-button style="width: 88px" size="small" type="primary" @click="confirmChat">{{newChat ? "创建并发送" : "发 送"}}</el-button>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import * as utils from "@/utils";

export default {
  name: "forwardChoose",
  props: {
    title: {
      type: String,
      default: "发送给",
    },
    visible: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: '612px',
    },
    allUser: {
      type: Array,
      default: () => [],
    },
    contacts: {
      type: Array,
      default: () => [],
    },
    message: {
      type: Object,
      default: () => {}
    }
  },


  watch: {
    contacts() {
      if (this.contacts.length > 0) {
        utils.delArrValue(this.contacts, ["id"], "system")
        this.allContacts = this.contacts
      } else {
        this.allContacts = []
      }
    },
    allUser() {
      if (this.allUser.length > 0) {
        let map = new Map()
        this.allUser.forEach(user => {
          user.index = user.index.replace(/\[[0-9]*\]/, "");
          let friends = map.has(user.index) ?  map.get(user.index) : []
          friends.push(user)
          map.set(user.index, friends)
        })
        this.allIndexUser = []
        for (const [key, value] of map) {
          let obj = {index: key, friends: value}
          this.allIndexUser.push(obj)
        }
      } else {
        this.allIndexUser = []
      }
    },
    keywords() {
      if (this.keywords === '') {
        this.allUser = this.allIndexUser
        this.contacts = this.allContacts
      } else {
        let searchMap = new Map()
        if (this.allUser.length > 0) {
          let searchUsers = utils.search_object(this.allUser, ["displayName"], this.keywords);
          if (searchUsers && searchUsers.length > 0) {
            searchUsers.forEach(user => {
              if (!searchMap.has(user.id)) {
                searchMap.set(user.id, user)
              }
            })
          }
        }
        if (this.contacts.length > 0) {
          let searchUsers = utils.search_object(this.contacts, ["displayName"], this.keywords);
          if (searchUsers && searchUsers.length > 0) {
            searchUsers.forEach(user => {
              if (!searchMap.has(user.id)) {
                searchMap.set(user.id, user)
              }
            })
          }
        }
        let searchList = []
        for (let value of searchMap.values()) {
          searchList.push(value)
        }
        this.contacts = searchList
      }
    },

  },
  data() {
    return {
      selectUid: [],
      newChat: false,
      keywords:"",
      allContacts: [],
      allIndexUser: [],
      contactsProps: {
        key: "id",
        label: "nickname"
      },
    };
  },
  mounted() {

  },
  methods: {
    closeDialog() {
      this.$emit("update:visible", false);
      this.selectUid = [];
      this.newChat = false
      this.title = "发送给"
    },
    cancel() {
      if (this.newChat) {
        this.newChat = false
        this.title = "发送给"
      } else {
        this.$emit("update:visible", false);
      }
      this.selectUid = [];
    },
    clickNewChat() {
      this.newChat = true
      this.title = "创建聊天并发送给"
      this.selectUid = [];
    },
    confirmChat() {
      if(this.selectUid.length === 0) {
        this.$message.error("请选择聊天对象");
        return;
      }
      let ids = []
      this.selectUid.forEach(e => {
        let forward =  {
          contactId: e.id,
          group: e.isGroup
        }
        ids.push(forward)
      })
      this.$emit("selectChat", ids);
    }
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


/*.nickname {
  white-space:nowrap !important;!*强制单行显示*!
  text-overflow:ellipsis !important;!*超出部分省略号表示*!
  overflow:hidden !important;!*超出部分隐藏*!
  width: 50px !important;!*设置显示的最大宽度*!
  margin-left: 6px !important;
}*/

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
  overflow-x: hidden;
}
.left, .right {
  flex: 1;
}
.left {
  margin-right: 10px;
}
.left-contacts-list {
  height: 250px;
  overflow-y: auto;
  overflow-x: hidden;
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


</style>