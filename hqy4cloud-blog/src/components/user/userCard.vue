<template>
  <div class="user-card-box"  >
    <el-container class="container" v-outside="closeDialog">
      <el-header class="no-padding header" height="80px">
        <i class="close el-icon-error" @click="closeDialog"/>
        <div class="user-header">
          <div class="avatar">
            <div class="avatar-box">
              <img :src="detail.avatar"/>
            </div>
          </div>
          <div class="username">
            <span class="displayName-span">{{displayName}}</span>
              <i class="el-icon-edit icon-edit"  v-if="detail.friend"  @click="setMark"></i>
          </div>
        </div>
      </el-header>
      <el-main class="no-padding main">
        <div class="user-sign">
          <div class="sign-arrow"></div>
          <i class="iconfont icon-bianji"/>
          <span>{{ detail.intro || "这家伙有点懒，什么都没留下！" }} </span>
        </div>

        <div class="card-rows no-select">
          <div class="card-row">
            <div class="label">账号</div>
            <div>{{ detail.username }}</div>
          </div>
          <div class="card-row">
            <div class="label">昵称</div>
            <div class="div-nickname">{{ detail.nickname || '未设置' }}
            </div>
          </div>

          <div class="card-row" v-if="detail.friend">
            <div class="label">消息免打扰</div>
            <div>
              <el-switch
                  v-model="isMute"
                  @change="changeChatNotice"
                  active-color="#13ce66"
                  :width="50"
                  inactive-color="#e1dfdf">
              </el-switch>
            </div>
          </div>
          <div class="card-row" v-if="detail.friend">
            <div class="label">置顶聊天</div>
            <div>
            <el-switch
                v-model="isTop"
                @change="changeChatTop"
                active-color="#13ce66"
                :width="50"
                inactive-color="#e1dfdf">
            </el-switch>
            </div>
          </div>

<!--          <div class="card-row">
            <div class="label">性别</div>
            <div>{{ detail.sex | sex }}</div>
          </div>-->
<!--          <div class="card-row">
            <div class="label">邮箱</div>
            <div>{{ detail.email || "未设置" }}</div>
          </div>-->
          <!--                <div class="card-row">
                            <div class="label">IP</div>
                            <div v-if="detail.lastLoginIp">{{ detail.lastLoginIp || "未知"}} （{{detail.location || "未知"}}）</div>
                            <div v-else>未知</div>
                          </div>-->
        </div>
      </el-main>


      <el-footer class="footer">
        <el-button v-if="userInfo.id !== detail.id && (detail.friend || detail.setting.isPrivateChat)" round @click="openChat()" style="width:150px">发消息
        </el-button>
        <el-button v-if="!detail.friend && detail.id !== userInfo.id"  round @click="addFriend()" style="width:150px">加好友</el-button>
<!--        <el-button round v-if="userInfo.id === detail.id" style="width:150px" @click="editUser">
          编辑资料
        </el-button>-->
      </el-footer>
    </el-container>
  </div>

</template>

<script>
import { mapState } from 'vuex';
import { setFriendMark, getUserInfoById, addFriend } from "@/api/im/friend";
import { setChatTop,setChatNotice } from "@/api/im/chat";
export default {
  name: 'UserCard',
  props: {
    userId: {
      type: [Number, String],
      default: 0,
    },
    options: {
      type: Object,
      default: () => {
        return {
          isManage: false,
        }
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
    }),
  },
  filters: {
    sex(value) {
      let arr = ['女', '男', '未知']
      return arr[value] || '未知';
    },
  },
  data() {
    return {
      detail: {
        setting: {
          isPrivateChat: true
        }
      },
      isMute: false,
      isTop: false,
      displayName: '',
      id: '',
      bind: false
    };
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
    closeDialog() {
      if (this.bind) {
        return
      }
      this.$emit('close')
    },
    getUserInfo() {
      if (this.detail && this.userId === this.id) {
        return
      }
      getUserInfoById(this.userId).then(res => {
        if (res.data.code === 0) {
          this.id = this.userId
          this.detail = res.data.data;
          this.displayName = (this.detail.friend && this.detail.friend.remark) ? this.detail.friend.remark : this.detail.nickname
          if (this.detail.friend) {
            this.isMute = !this.detail.friend.isNotice
            this.isTop = this.detail.friend.isTop
          }
        }
      })
    },
    changeChatTop(val) {
      setChatTop({contactId: this.userId, status: val, isGroup: false}).then(res => {
        if (res.data.code !== 0) {
          this.$message.warning("服务器异常，请稍后再试")
          //修改回之前的状态.
          this.detail.friend.isTop = !val
        } else {
          this.detail.friend.isTop = val
        }
      }).catch(e => {
        console.log(e)
        this.$message.warning("服务器异常，请稍后再试")
        //修改回之前的状态.
        this.detail.friend.isTop = !val
      })
    },
    changeChatNotice(val) {
      setChatNotice({contactId: this.userId, status: !val, isGroup: false}).then(res => {
        if (res.data.code !== 0) {
          this.$message.warning("服务器异常，请稍后再试")
        } else {
          this.detail.friend.isNotice = !val
        }
      }).catch(e => {
        this.$message.warning("服务器异常，请稍后再试")
        //修改回之前的状态.
        this.detail.friend.isNotice = !val
      })
    },
    openChat() {
      this.closeDialog();
      this.$store.commit('OPEN_CHAT', this.detail.id)
      this.$store.commit('SET_FRIEND_DIALOG', Math.random().toString(8))
    },
    editUser() {
      this.$emit('editUser', this.detail)
    },
    // 添加好友
    addFriend() {
      this.$store.commit('SET_FRIEND_DIALOG', Math.random().toString(8))
      this.bind = true
      this.$prompt('请填写验证信息，让朋友知道你！', '添加好友', {
        inputValue: '我是' + this.userInfo.nickname,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({value}) => {
        this.bind = false
        if (!value) {
          this.$message.error('请输入验证信息');
          return false;
        }
        addFriend({
          userId: this.detail.id,
          remark: value
        }).then(res => {
          if (res.data.code === 0) {
            this.closeDialog();
            this.$message.success('已发送好友申请');
          } else {
            this.$message.warn('添加好友失败，请稍后再试');
          }
        })
      }).catch((error) => {
        this.bind = false
        /*this.$message({
          type: 'warning',
          message: error
        });*/
      });

    },
    // 设置备注
    setMark() {
      if (!this.detail.friend) {
        this.$message.error('该用户不是您的好友');
        return false;
      }
      let friendId = this.detail.id;
      let nickname = this.detail.friend.remark ? this.detail.friend.remark : this.detail.nickname;
      this.bind = true
      this.$prompt('请填写备注信息', '设置备注', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: nickname,
        customClass: 'remark-prompt',
      }).then(({value}) => {
        this.bind = false
        if (!value) {
          this.$message.error('请输入备注信息');
          return false;
        }
        if (value.length > 16) {
          this.$message.error('输入的备注太长');
          return false;
        }
        setFriendMark({
          userId: friendId,
          remark: value
        }).then(res => {
          this.bind = false
          if (res.data.code === 0) {
            this.$message.success('设置成功');
            this.detail.friend.remark = value;
            this.displayName = value
          }
        })
      }).catch(() => {
        this.bind = false
      });
    }
  }
}
</script>

<style>
.el-message-box__wrapper   {
  z-index: 100000000 !important;
}
.el-message {
  z-index: 100000001 !important;
}
</style>

<style lang="scss" scoped>

span {
  width: 150px !important;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.div-nickname{
  width: 150px !important;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.user-card-box {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 29998 !important;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  width: 350px;
  height: 400px;
  overflow: hidden;
  border-radius: 3px;

  .header {
    position: relative;
    .close {
      position: absolute;
      right: 10px;
      top: 10px;
      color: rgba(28, 24, 24, 0.73);
      cursor: pointer;
      transition: all 1s;
      z-index: 1;
      font-size: 20px;
    }

    .img-banner {
      width: 100%;
      height: 100%;
      background-image: url(~@/assets/img/user-card-bg.jpg);;
      background-size: 100%;
      transition: all 0.2s linear;
      cursor: pointer;
      overflow: hidden;

      img:hover {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
        -webkit-filter: contrast(130%);
        filter: contrast(130%);
      }
    }
  }

  .main {
    padding: 32px 16px 0 !important;
  }

  .footer {
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #f5eeee;

    button {
      width: 90%;
    }
  }
}

.user-header {
  width: 100%;
  height: 80px;
  position: absolute;
  bottom: -24px;
  display: flex;
  flex-direction: row;
  .avatar {
    width: 100px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;

    .avatar-box {
      width: 80px;
      height: 80px;
      background-color: white;
      border-radius: 40%;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        height: 70px;
        width: 70px;
        border-radius: 50%;
      }
    }
  }

  .username {
    display: flex;
    justify-content: flex-start;
    height: 35px;
    margin-top: 45px;
    font-size: 18px;

    .nickname-edit {
      display: flex;
      cursor: pointer;
    }

    .label {
      width: 70px;
      margin-right: -15px;
      color: #cbc5c5;
      text-align: left;
    }

    .share {
      display: inline-flex;
      width: 50px;
      height: 22px;
      background: #ff5722;
      color: white;
      align-items: center;
      justify-content: center;
      padding: 3px 8px;
      border-radius: 20px;
      transform: scale(0.7);
      cursor: pointer;

      i {
        margin-top: 2px;
      }

      span {
        font-size: 14px;
        margin-left: 4px;
      }
    }
  }
}

.user-sign {
  min-height: 26px;
  border-radius: 5px;
  padding: 5px;
  line-height: 25px;
  background: #f3f5f7;
  color: #7d7d7d;
  font-size: 12px;
  margin-bottom: 20px;
  position: relative;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;

  .sign-arrow {
    position: absolute;
    width: 0;
    height: 0;
    font-size: 0;
    border: 5px solid hsla(0, 0%, 96.9%, 0);
    border-bottom-color: #f3f5f7;
    left: 28px;
    top: -9px;
  }
}

.card-rows {
  .card-row {
    display: flex;
    justify-content: flex-start;
    height: 35px;
    line-height: 35px;
    font-size: 14px;
    position: relative;
    cursor: pointer;
    color: #736f6f;

    .label {
      width: 70px;
      margin-right: 20px;
      color: #cbc5c5;
      text-align: left;
    }

    .friend-remark {
      border-bottom: 1px dashed #bec3d0;
      padding-bottom: 2px;
      color: #736f6f;
      width: 60%;
      padding-right: 5px;
    }

    .el-icon-edit-outline {
      margin-left: 3px !important;
    }

    .icon-edit {
      margin-left: 5px;
    }
  }
}


.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
}
</style>