<template>
  <div>
    <div class="chat-box">
      <lemon-imui
          :user="user"
          ref="UI"
          :width="curWidth"
          :height="curHeight"
          :contextmenu="contextmenu"
          :contact-contextmenu="contactContextmenu"
          :theme="userSetting.theme"
          :hide-message-name="userSetting.hideMessageName"
          :hide-message-time="userSetting.hideMessageTime"
          :avatarCricle="userSetting.avatarCricle"
          :sendKey="setSendKey"
          :wrapKey="wrapKey"
          @menu-avatar-click="openSetting"
          @change-contact="handleChangeContact"
          @pull-messages="handlePullMessages"
          @message-click="handleMessageClick"
          @send="handleSend"
          style="min-height:600px"
      >
        <template #cover>
          <div>
            <div class="cover">
              <i class="lemon-icon-message"></i>
              <p><b>即时聊天 hongqy</b> IM</p>
            </div>
          </div>
        </template>
        <!-- 最近联系人列表插槽 -->
        <template #sidebar-message="Contact">
            <span class="lemon-badge lemon-contact__avatar">
            <span
                class="lemon-avatar"
                v-bind:class="{ 'lemon-avatar--circle': userSetting.avatarCricle }"
                style="width: 40px; height: 40px; line-height: 40px; font-size: 20px;"
            >
              <img :src="Contact.avatar"
              /></span>
            <span
                class="lemon-badge__label"
                v-if="Contact.unread > 0 && Contact.isNotice"
            >{{ Contact.unread }}</span
            >
          </span>
          <div class="lemon-contact__inner">
            <p class="lemon-contact__label">
              <span class="lemon-contact__name">
                <OnlineStatus v-if="Contact.isOnline && !Contact.isGroup && globalConfig.chatInfo.online" title="在线" type="success"></OnlineStatus>
                <el-tag size="mini" v-if="Contact.isGroup === true">群聊</el-tag>
                {{ Contact.displayName }}
              </span>
              <span
                  class="lemon-contact__time"
                  v-text="formatTime(Contact.lastSendTime)"
              ></span>
            </p>
            <p class="lemon-contact__content lemon-last-content">
              <span class="lastContent">
                <span v-if="Contact.isNotice === false && Contact.unread > 0"
                >[{{ Contact.unread }}条未读]</span
                >
                <span v-html="Contact.lastContent"></span>
              </span>
              <span
                  class="el-icon-close-notification f-16"
                  v-if="Contact.isNotice === false"
              ></span>
            </p>
          </div>

        </template>
        <!-- 消息窗口顶部的插槽 -->
        <template #message-title="contact" style="color: red">
          <div class="message-title-box">
            <div>
              <span v-if="isEdit === false">
                <span
                    class="displayName"
                    v-if="isGroup"
                    @click="isEdit === true"
                >
                  <el-tag size="mini">群聊</el-tag> {{ contact.displayName }}<span class="mr-5">({{ groupUserCount }})</span>
                  <el-tag size="mini" v-if="contact.setting.nospeak === 1"  type="warning">仅群管理员可发言</el-tag>
                  <el-tag size="mini" v-if="contact.setting.nospeak === 2"  type="danger">全员禁言中</el-tag>
                </span>
                <span class="displayName" v-if="isGroup === false">
                  <OnlineStatus :type="contact.isOnline ? 'success' : 'info'" :pulse="contact.isOnline " v-if="globalConfig.chatInfo.online" ></OnlineStatus> {{contact.displayName}}</span>
              </span>

              <input
                  v-if="isEdit === true"
                  v-model="displayName"
                  class="editInput"
                  @blur="saveGroupName(contact)"
              />
            </div>
            <div class="message-title-tools">
<!--              <template v-if="globalConfig.chatInfo.webrtc">
                <i class="el-icon-phone-outline mr-10" title="语音通话" v-if="!contact.is_group && parseInt(globalConfig.chatInfo.webrtc)" @click="called(0)"></i>
                <i class="el-icon-video-camera mr-10" title="视频通话" v-if="!contact.is_group && parseInt(globalConfig.chatInfo.webrtc)" @click="called(1)"></i>
              </template>-->
              <i class="el-icon-time mr-10" @click="openMessageBox" title="消息管理器"></i>
              <i class="el-icon-more" @click="$user(contact.id)" title="基本资料" v-if="!contact.isGroup"></i>

            </div>
          </div>
        </template>

        <!-- 最近联系人列表顶部插槽 不滚动-->
        <template #sidebar-message-fixedtop="instance">
          <div class="contact-fixedtop-box">
            <el-input
                placeholder="搜索联系人"
                prefix-icon="el-icon-search"
                @blur="closeSearch"
                @focus="searchResult === true"
                v-model="keywords"
                class="input-with-select"
            >
            </el-input>
            <div style="margin-left:10px" v-if="globalConfig.sysInfo.runMode==2">
              <el-dropdown @command="handleCommand">
                <el-button
                    icon="el-icon-plus" circle></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="addFriend">添加朋友</el-dropdown-item>
                  <el-dropdown-item command="addGroup" v-if="globalConfig.chatInfo.groupChat">创建群聊</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>

            </div>
            <div style="margin-left:10px" v-if="globalConfig.chatInfo.groupChat">
              <el-button
                  title="创建群聊"
                  icon="el-icon-plus"
                  @click="openCreateGroup"
                  circle
              ></el-button>
            </div>
            <div class="search-list" v-show="searchResult">
              <div
                  v-for="(item, index) in searchList"
                  :key="index"
                  v-if="searchList.length > 0"
                  class="search-list-item"
              >
                <lemon-contact
                    :contact="item"
                    @click="openChat(item.id, instance)"
                />
              </div>
              <div
                  v-if="searchList.length == 0"
                  style="margin: 20px"
                  align="center"
              >
                暂无
              </div>
            </div>
          </div>
        </template>
        <!-- 最近联系人列表顶部插槽，滚动 -->
        <template #sidebar-message-top="instance">
          <div class="chat-top-list" v-if="chatTopList.length > 0">
            <ChatTop
                :contact="item"
                v-for="(item, index) in chatTopList"
                :key="index"
                :avatarCricle="userSetting.avatarCricle"
                :currentId="currentChat.id"
                @click.native="openChat(item.id, instance)"
            ></ChatTop>
          </div>
        </template>
        <!-- 联系人列表顶部插槽 -->
        <template #sidebar-contact-fixedtop="instance">
          <div style="margin: 15px 10px">
            联系人
          </div>
        </template>
        <!-- 群组聊天展示的抽屉 -->
        <template #message-side="contact">
          <div class="slot-group-list" v-if="contact.isGroup">
            <div class="group-side-box">
              <div class="group-notice">
                <div class="group-side-title">
                  <h4>群公告</h4>
                  <div>
                    <span
                        class="el-icon-edit f-18 cur-handle"
                        @click="noticeBox = true"
                        v-if="contact.role < 3 || contact.setting.manager === false"
                    ></span>
                  </div>
                </div>
                <hr />
                <div
                    class="group-side-body"
                    v-if="contact.notice"
                    @click="openNotice"
                >
                  {{ contact.notice }}
                </div>
                <div class="group-side-body" v-if="!contact.notice">
                  暂无公告
                </div>
              </div>
              <div class="group-user">
                <div class="group-side-title">
                  <h4>群成员</h4>
                  <div>
                    <span
                        class="el-icon-circle-plus-outline f-18 cur-handle"
                        v-if="contact.role <3 || contact.setting.invite === 1"
                        @click="openAddGroupUser"
                    ></span>
                  </div>
                </div>
                <hr/>
                <div class="group-user-body" :style="'height:calc(' + curHeight + ' - 230px )'" id="group-user">
                  <el-scrollbar style="height:100%;">
                    <lemon-contact
                        class="user-list"
                        v-for="(item, index) in groupUser"
                        :key="index"
                        :contact="item"
                        v-lemon-contextmenu.contact="groupMenu">
                      <div class="user-avatar">
                        <el-avatar
                            :size="20"
                            :src="item.userInfo.avatar"
                        ></el-avatar>
                      </div>
                      <div class="user-name">
                        <span
                            v-if="item.userInfo.id === user.id"
                            class="fc-danger"
                        >{{ item.userInfo.nickname }}（我）</span
                        >
                        <span v-if="item.userInfo.id !== user.id">{{item.userInfo.nickname}}</span>
                      </div>
                      <div class="user-role">
                        <i class="el-icon-user-solid fc-danger"
                            title="创建者"
                            v-if="item.role === 1"></i>
                        <i class="el-icon-user-solid fc-warning"
                            title="管理员"
                            v-if="item.role === 2"></i>
                      </div>
                    </lemon-contact>
                  </el-scrollbar>
                </div>
              </div>
            </div>
          </div>
        </template>
        <!-- 每条消息后面展示的文字 -->
        <template #message-after="message">
          <span
              v-if="message.fromUser.id === user.id && !message.isGroup"
              style="visibility: visible">
            <span v-if="!message.isRead && message.status ==='success'"> 未读 </span>
            <span v-if="message.isRead && message.status ==='success'" class="fc-success"> 已读 </span>
          </span>
        </template>
        <!-- 发送按钮左边插槽 -->
        <template #editor-footer>
          {{ userSetting.sendKey === 1 ? '使用 Enter 键发送消息' : '使用 Ctrl + Enter 键发送消息' }}
        </template>
      </lemon-imui>
    </div>

    <!-- 创建群聊 -->
    <Group :visible.sync="createChatBox" :title="dialogTitle" @manageGroup="manageGroup" :isAdd="isAdd" :userIds="userIds"></Group>

    <!-- 发布公告 -->
    <el-dialog
        title="发布公告"
        :visible.sync="noticeBox"
        :modal="true"
        width="500px"
        append-to-body>
      <el-input
          type="textarea"
          :rows="10"
          placeholder="请输入内容"
          v-model="notice">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="noticeBox = false">取 消</el-button>
        <el-button type="primary" @click="publishNotice">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加好友 -->
    <AddFriend :visible.sync="addFriendBox"></AddFriend>

    <!-- 转发聊天 -->
    <ChooseDialog :visible.sync="forwardBox" title="转发聊天" @selectChat="forwardUser" :allUser="allUser"></ChooseDialog>

    <!-- 消息管理器 -->
    <el-dialog
        title="消息管理器"
        :visible.sync="messageBox"
        :modal="true"
        width="800px"
        append-to-body>
      <ChatRecord :contact="currentChat" :key="componentKey"></ChatRecord>
    </el-dialog>
    <!-- 消息管理器 -->

    <!-- 群设置中心 -->
    <el-dialog
        title="群设置"
        :visible.sync="groupSetting"
        :modal="true"
        width="500px"
        append-to-body
    >
      <ChatSet :contact="contactSetting" :key="componentKey"></ChatSet>
    </el-dialog>
    <!-- 语音录制 -->
<!--    <el-dialog title="语音录制" custom-class="no-padding" :visible.sync="VoiceStatus" :modal="true" width="500px"
               append-to-body destroy-on-close>
      <voice-recorder @send="sendVoice"></voice-recorder>
    </el-dialog>-->
    <Socket ref="socket"></Socket>
    <!-- 视频通话组件 -->
<!--    <webrtc :contact="currentChat" :config="webrtcConfig" :alias="$packageData.name" :userInfo="user" ref="webrtc" :key="componentKey" @message="rtcMsg"></webrtc>-->
  </div>
</template>


<script>
import Socket from "./socket";
import ChatSet from "./chatSet";
import ChatRecord from "./chatRecord";
import ChooseDialog from "./chooseDialog";
import OnlineStatus from "./onlineStatus";
import AddFriend from "./friend";
import Group from "./group";
import { mapState } from "vuex";
import { arrayToString, timeFormat, delArrValue, searchObject, generateRandId} from "@/utils";
import { deleteFriend } from "@/api/user";
import {
  sendChatMessage,
  publishNotice,
  addGroupUser,
  createGroup,
  groupRole,
  removeGroupUser,
  updateGroupName,
  undoChatMessage,
  setChatConfig,
  setChatNotice,
  deleteGroup,
  readMessage,
  getGroupUsers, getChatMessages,
} from "@/api/chat";

const getTime = () => {
  return new Date().getTime();
};

export default {
  name: "app",
  components: {
    Socket,ChatSet,ChatRecord,ChooseDialog,AddFriend,Group,OnlineStatus
  },
  props: {
    width: {
      type: String,
      default: "1000px"
    },
    height: {
      type: String,
      default: "640px"
    },
    fullScreen: {
      type: Boolean,
      default: false
    },
  },
  data() {
    let _this = this;
    let webrtcConfig= this.$store.state.globalConfig.chatInfo;
    return {
      curWidth: this.width,
      curHeight: this.height,
      groupSetting: false,
      messageBox: false,
      createChatBox: false,
      dialogTitle: "创建群聊",
      isAdd: true,
      webrtcLock:false,
      userIds: [],
      // 公告
      notice: "",
      noticeBox: false,
      addFriendBox: false,
      forwardBox: false,
      isGroup: false,
      // 搜索结果展示
      searchResult: false,
      groupId: 0,
      isEdit: false,
      displayName: "",
      oldName: "",
      keywords: "",
      contactSetting: {},
      componentKey: 1,
      searchList: [],
      allUser: [],
      groupUser: [],
      groupUserCount: 0,
      // 当前聊天
      currentChat: {},
      // 置顶列表
      chatTopList: [],
      // 当前消息
      currentMessage: {},
      // 当前登录用户
      user: {
        id: this.userInfo.id,
        username: this.userInfo.username,
        nickname: this.userInfo.nickname,
        avatar: this.userInfo.avatar,
        account: this.userInfo.account
      },
      // 群成员邮件菜单
      groupMenu: [
        {
          text: "发送消息",
          click: (e, instance, hide) => {
            const { IM, contact } = instance;
            IM.changeContact(contact.id);
            hide();
          },
          visible: instance => {
            return instance.contact.id !== this.user.id;
          }
        },
        {
          text: "设置管理员",
          click: (e, instance, hide) => {
            const { IM, contact } = instance;
            hide();
            this.$confirm("确定设置该成员为管理员吗？", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              groupRole({
                id: this.groupId,
                userId: contact.id,
                role: 2
              });
              this.$message({
                type: "success",
                message: "设置成功!"
              });
            });
          },
          visible: instance => {
            // 只有群主才可以设置管理员
            return (
                instance.contact.role === 3 &&
                this.currentChat.ownerId === this.user.id
            );
          }
        },
        {
          text: "取消管理员",
          click: (e, instance, hide) => {
            const { IM, contact } = instance;
            hide();
            this.$confirm("确定取消该成员的管理员权限吗？", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              groupRole({
                id: this.groupId,
                userId: contact.id,
                role: 3
              });
              this.$message({
                type: "success",
                message: "取消成功!"
              });
            });
          },
          visible: instance => {
            // 只有群主才可以设置管理员
            return (
                instance.contact.role === 2 &&
                this.currentChat.ownerId === this.user.id
            );
          }
        },
        {
          text: "查看资料",
          click: (e, instance, hide) => {
            const { IM, contact } = instance;
            hide();
            this.$user(contact.id);
          }
        },
        {
          text: "移出群聊",
          color: "red",
          click: (e, instance, hide) => {
            const { IM, contact } = instance;
            hide();
            this.$confirm("确定移除该成员吗？", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              removeGroupUser({ id: this.groupMenu, userId: contact.id });
            });
          },
          visible: instance => {
            return (
                instance.contact.id !== this.user.id &&
                this.currentChat.ownerId !== instance.contact.id &&
                this.currentChat.role <= 2
            );
          }
        }

      ],
      // 定义联系人的右键菜单
      contactContextmenu: [
        {
          click(e, instance, hide) {
            const { UI, contact } = instance;
            _this.$user(contact.userId);
            hide();
          },
          icon: "el-icon-tickets",
          text: "查看资料",
          visible: instance => {
            return instance.contact.isGroup === false;
          }
        },
        {
          icon: "el-icon-upload2",
          text: "置顶聊天",
          click: (e, instance, hide) => {
            const { UI, contact } = instance;
            setChatConfig({
              id: contact.id,
              isTop: true,
              isGroup: contact.isGroup
            }).then(res => {
              if (res.data.code === 0) {
                UI.updateContact({
                  id: contact.id,
                  is_top: 1
                });
                contact.isTop = true;
                const hasContact=_this.chatTopList.filter(item => item.id === contact.id);
                if(!hasContact.length){
                  _this.chatTopList.push(contact);
                }
              }
            });
            hide();
          },
          visible: instance => {
            return instance.contact.isTop === false;
          }
        },
        {
          icon: "el-icon-download",
          text: "取消置顶",
          click: (e, instance, hide) => {
            const { UI, contact } = instance;
            setChatConfig({
              id: contact.id,
              is_top: 0,
              is_group: contact.isGroup
            }).then(res => {
              if (res.data.code === 0) {
                UI.updateContact({
                  id: contact.id,
                  is_top: 0
                });
                // 删除置顶聊天列表人员
                delArrValue(this.chatTopList, "id", contact.id);
              }
            });
            hide();
          },
          visible: instance => {
            return instance.contact.isTop === true;
          }
        },

        {
          click(e, instance, hide) {
            const { UI, contact } = instance;
            hide();
            setChatNotice({ id: contact.id, isNotice: false ,isGroup:contact.isGroup});
            UI.updateContact({
              id: contact.id,
              is_notice: 0
            });
          },
          icon: "el-icon-bell",
          text: "消息免打扰",
          visible: instance => {
            return (
                instance.contact.is_notice === 1 && instance.contact.id !== 'system'
            );
          }
        },
        {
          click(e, instance, hide) {
            const { UI, contact } = instance;
            hide();
            setChatNotice({ id: contact.id, isNotice: true, is_group:contact.isGroup});
            UI.updateContact({
              id: contact.id,
              is_notice: 1
            });
          },
          icon: "el-icon-close-notification",
          text: "取消免打扰",
          visible: instance => {
            return (
                instance.contact.is_notice === 0 && instance.contact.id !== 'system'
            );
          }
        },
        {
          click(e, instance, hide) {
            const { UI, contact } = instance;
            hide();
            _this.groupSetting = true;
            _this.contactSetting = contact;
            _this.componentKey ++;
          },
          icon: "el-icon-setting",
          text: "群管理",
          visible: instance => {
            return instance.contact.role === 1 && instance.contact.is_group === 1;
          }
        },
        {
          click(e, instance, hide) {
            const { UI, contact } = instance;
            hide();
            _this
                .$confirm("确定删除该好友吗？", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                })
                .then(() => {
                  deleteFriend({ id: contact.id }).then(res => {
                    if (res.data.code === 0) {
                      _this.$message({
                        type: "success",
                        message: "删除成功!"
                      });
                      _this.removeContact(contact.id);
                    }
                  });
                }).catch(() => {
            });
          },
          icon: "el-icon-delete",
          color: "red",
          text: "删除好友",
          visible: instance => {
            return (
                instance.contact.is_group === 0
            );
          }
        },
        {
          click(e, instance, hide) {
            const { UI, contact } = instance;
            hide();
            _this
                .$confirm("确定删除该群聊吗？", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                })
                .then(() => {
                  deleteGroup({ id: contact.id });
                  _this.$message({
                    type: "success",
                    message: "删除成功!"
                  });
                }).catch(() => {
            });
          },
          icon: "el-icon-delete",
          color: "red",
          text: "删除群聊",
          visible: instance => {
            return (
                instance.contact.ownerId === _this.user.id &&
                instance.contact.isGroup === true
            );
          }
        },
        {
          click(e, instance, hide) {
            const { UI, contact } = instance;
            hide();
            _this
                .$confirm("确定退出该群聊吗？", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                })
                .then(() => {
                  removeGroupUser({ id: contact.id, userId: _this.user.id }).then(res => {
                    if (res.data.code === 0) {
                      _this.$message({
                        type: "success",
                        message: "退出成功!"
                      });
                      _this.removeContact(contact.id);
                    }
                  });
                }).catch(() => {
            });
          },
          icon: "el-icon-remove-outline",
          color: "red",
          text: "退出群聊",
          visible: instance => {
            return (
                instance.contact.ownerId !== _this.user.id &&
                instance.contact.isGroup === true
            );
          }
        }
      ],
      // 定义消息内容的右键菜单
      contextmenu: [
        {
          click: (e, instance, hide) => {
            const { UI, message } = instance;
            undoChatMessage(message.id).then(res => {
                  const data = {
                    id: message.id,
                    type: "event",
                    //使用 jsx 时 click必须使用箭头函数（使上下文停留在vue内）
                    content: (
                        <div>
                      <span>
                        你撤回了一条消息{" "}
                        <span
                            v-show={message.type === "text"}
                            style="color:#409EFF;cursor:pointer"
                            content={message.content}
                            on-click={e => {
                              UI.setEditorValue(
                                  e.target.getAttribute("content")
                              );
                            }}
                        >
                          重新编辑
                        </span>
                      </span>
                        </div>
                    ),
                    toContactId: message.toContactId,
                    sendTime: getTime()
                  };
              UI.updateMessage(data);
                })
                .catch(error => {
                  this.$message.error("发生错误");
                });
            hide();
          },
          visible: instance => {
            return (
                instance.message.fromUser.id === this.user.id &&
                getTime() - instance.message.sendTime < 120000
            );
          },
          text: "撤回消息"
        },
        {
          text: "转发",
          click: (e, instance, hide) => {
            this.currentMessage = instance.message;
            // 获取本地所有联系人，转发时必须去除当前的聊天对象
            const { UI } = this.$refs;
            const contactList = UI.getContacts();
            const currentContact = UI.getCurrentContact();
            this.allUser = UI.editArrValue(contactList, "id", currentContact.id);
            hide();
            this.forwardBox = true;
          }
        },
        {
          visible: instance => {
            return instance.message.type === "text";
          },
          text: "复制文字",
          click: (e, instance, hide) => {
            this.$clipboard(instance.message.content);
            this.$message({
              type: "success",
              message: "复制成功!"
            });
            hide();
          }
        },
        {
          visible: instance => {
            return instance.message.type === "image";
          },
          text: "下载图片",
          click: (e, instance, hide) => {
            const { message } = instance;
            hide();
            message.download ? window.location = message.download : '';

          }
        },
        {
          visible: instance => {
            return instance.message.type === "file";
          },
          text: "下载文件",
          click: (e, instance, hide) => {
            const { message } = instance;
            window.open(message.download);
            hide();
          }
        }
      ]
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      socketAction: state => state.user.socketAction,
      contactId: state => state.user.toUserId,
      contactSync: state => state.user.contactSync,
      userSetting: state => state.user.setting,
      globalConfig: state => state.user.globalConfig,
    }),
    formatTime() {
      return function(val) {
        return timeFormat(val);
      };
    }
  },
  watch: {
    isFullscreen(val){
      Lockr.set('isFullscreen',val);
      this.curWidth=val?'100vw':this.width;
      this.curHeight=val?'100vh':this.height;
    },
    playAudio (val) {
      if (val && this.currentMessage) {
        let message = this.currentMessage;
        let that = this;
        const { UI } = this.$refs;
        this.playAudio.addEventListener('ended', function () {
          console.log('声音停止');
          that.playAudio = null;
          that.currentMessage = null;
          UI.updateMessage({
            id: message.id,
            status: 'success',
            isPlay: 0,
          })
        }, false);
      }
    },
    // 全局调用发送消息
    contactSync (val) {
      this.$emit('newChat', val);
      const { UI } = this.$refs;
      UI.changeContact(this.contactId);
    },
    unread (val) {
      this.$store.commit('updateUnread', val);
    },
    // 监听联系人搜索
    keywords() {
      const { UI } = this.$refs;
      const contacts = UI.getContacts();
      this.searchContact(contacts);
    },
    // 监听接收socket消息
    socketAction(val) {
      let message = val.data;
      const { IMUI } = this.$refs;
      let client_id=Lockr.get('client_id');
      switch (val.type) {
          //上线、下线通知
        case "isOnline":
          IMUI.updateContact({
            id:message.id,
            is_online:message.is_online
          })
          break;
        case "offline":
          if(message.id==this.user.id && message.client_id!=client_id && !message.isMobile){
            this.$message.error="您的账号在其他地方登录，已被迫下线！";
            this.$store.dispatch("LogOut").then(() => {
              this.$router.push({ path: "/login" });
            });
          }

          break;
          // 接收消息
        case "simple":
        case "group":
          // 如果是自己发送的消息则不需要提示
          if (message.fromUser.id != this.user.id) {
            var contact = this.getContact(message.toContactId);
            // 如果开启了声音才播放
            if (this.setting.isVoice && contact.is_notice == 1) {
              this.popNotice(message);
            }
          }
          this.recieveMsg(message);
          break;
          // 撤回消息
        case "undoMessage":
          IMUI.updateMessage(message);
          break;
          // 设置置顶
        case "setChatTop":
          IMUI.updateContact({
            id: message.id,
            is_top: message.is_top
          });
          if(message.is_top==1){
            const contact = this.getContact(message.id);
            const hasContact=this.chatTopList.filter(item => item.id == message.id);
            if(!hasContact.length){
              this.chatTopList.push(contact);
            }
          }else{
            utils.delArrValue(this.chatTopList, "id", message.id);
          }
          break;
          // 设置消息免打扰
        case "setIsNotice":
          IMUI.updateContact({
            id: message.id,
            is_notice: message.is_notice
          });
          break;
          // 修改群组名称
        case "editGroupName":
          IMUI.updateContact({
            id: message.id,
            displayName: message.displayName
          });
          // 更新群名
          const data = {
            id: utils.generateRandId(),
            type: "event",
            //使用 jsx 时 click必须使用箭头函数（使上下文停留在vue内）
            content: (
                <div>
                <span>
                  {message.editUserName} 修改了群名为 {message.displayName}
                </span>
                </div>
            ),
            toContactId: message.id,
            sendTime: getTime()
          };
          IMUI.appendMessage(data, true);
          break;
          //处理消息已读,将本地的未读消息修改为已读状态
        case "isRead":
          this.setLocalMsgIsRead(message);
          break;
          // 新增加了群聊
        case "addGroup":
          if (message.ownerId !== this.user.id) {
            UI.appendContact(message);
          }
          this.$api.commonApi.bindGroupAPI({ client_id: client_id, group_id: message.id });
          break;
          // 设置群管理员
        case "setManager":
        case "addGroupUser":
        case "removeUser":
          if (message.groupId === this.groupId) {
            this.getGroupUserList(message.groupId);
          }
          UI.updateContact({
            id: message.groupId,
            avatar: message.avatar
          });
          break;
        case "removeGroup":
          this.removeContact(message.groupId);
          break;
          // 发布公告
        case "setNotice":
          UI.updateContact({
            id: message.groupId,
            notice: message.notice
          });
          // 发布事件消息
          UI.appendMessage(
              {
                id: generateRandId(),
                type: "event",
                //使用 jsx 时 click必须使用箭头函数（使上下文停留在vue内）
                content: (
                    <div>
                      <span>管理员 发布了公告： {message.notice}</span>
                    </div>
                ),
                toContactId: message.groupId,
                sendTime: getTime()
              },
              true
          );
          break;
          // 群聊设置
        case "groupSetting":
          UI.updateContact({
            id: message.groupId,
            setting: message.setting
          });
          break;
        case 'appendContact':
          UI.appendContact(message);
          break;
        /*case 'webrtc':
          // 如果收到自己的消息，并且是其他端处理操作，则静默挂断
          if(message.fromUser.id === this.user.id){
            let e=message.extends;
            let wsData=Lockr.get('wsData');
            // 挂断的情况下解锁webrtc
            if([902,903,905,906,907].includes(parseInt(e.code))){
              wsData.content=message.content;
              IMUI.updateMessage(wsData);
              this.webrtcLock=false;
            }
            // 如果是当前设备发出的消息则不处理
            if(e.isMobile===0 || e.event ==='calling'){
              if(e.event=='calling'){
                Lockr.set('wsData',message);
                this.recieveMsg(message);
              }
              return;
            }
            if(e.event === "otherOpt"){
              wsData.content = message.content;
              UI.updateMessage(wsData);
              this.wsData=null;
              this.caller='';
              this.webrtcLock=false;
              this.$refs.webrtc.hangup(false);
            }
            return;
          }
          // 接收到webrtc消息
          if(this.wsData && this.wsData.id !== message.id){
            sendWebrtcMessage({
              toContactId: message.fromUser.id,
              type:message.extends.type,
              event:'busy',
              status:message.extends.status,
              code:907,
              id:message.id,
              msg_id:message.msg_id,
            }) } else{
            if(message.extends.event === 'calling'){
              this.receiveMsg(message);
              this.wsData = message;
              Lockr.set('wsData',message);
              this.caller = message.fromUser;
            }else if(message.extends.event === 'offer' || message.extends.event === 'answer'){
              //其他端在通话中，锁定webrtc，禁止通话
              this.webrtcLock = true;
            }else if(message.extends.event === 'hangup'){
              let wsData= Lockr.get('wsData');
              wsData.content = message.content;
              UI.updateMessage(wsData);
              this.webrtcLock=false;
            }
            if(this.wsData && this.wsData.id === message.id){
              this.$refs.webrtc.webrtcAction(JSON.parse(JSON.stringify(message)));
            }
          }
          break;*/
      }
    }
  },
  methods: {
    called(is_video){
      if(!parseInt(this.globalConfig.chatInfo.webrtc)){
        return this.$message.error("当前系统未开启音视频通话功能");
      }
      if(this.webrtcLock){
        this.$message.error("其他端正在通话中");
        return;
      }
      this.webrtcBox=true;
      this.is_video=is_video;
      this.caller=this.currentChat;
      this.$refs.webrtc.called(is_video);
    },

    // 接收消息重新渲染
    receiveMsg(message) {
      const { UI } = this.$refs;
      const contact = UI.getCurrentContact();
      // 如果收到消息是当前窗口的聊天，需要将消息修改为已读
      if (contact.id === message.toContactId && contact.id !== 'system') {
        let data = [];
        data.push(message);
        readMessage({
          toContactId: contact.id,
          isGroup: contact.isGroup,
          messages: data,
          fromUser: message.fromUser.id
        });
      }else{
        // 如果不是自己的消息，需要将未读数加1
        if (this.user.id !== message.fromUser.id) {
          this.unread++;
          this.initMenus(UI);
        }
      }

      if(this.user.id === message.toContactId){
        // 这里需要将原来的发送对象的id换回来，哈哈哈
        message.toContactId= message.toUser;
      }
      UI.appendMessage(message, true);

    },
    // 设置发送键
    setSendKey(e) {
      return this.userSetting.sendKey === 1 ? (e.keyCode === 13 && !e.ctrlKey && !e.shiftKey) : (e.keyCode === 13 && e.ctrlKey);
    },
    // 搜索联系人
    searchContact(contacts) {
      if (this.keywords !== "") {
        this.searchList = searchObject(
            contacts,
            ["displayName", "nickname"],
            this.keywords
        );
      }
    },
    saveGroupName(contact) {
      if (this.displayName.length < 1) {
        this.$notify({
          title: "警告",
          message: "名称不能为空！",
          type: "warning"
        });
        this.isEdit = false;
        return false;
      }
      // 如果更改了名称，请求服务器，并通知所有群更改名称
      if (this.displayName !== this.oldName) {
        const { UI } = this.$refs;
        updateGroupName({
          id: contact.id,
          displayName: this.displayName
        }).then(res => {
          UI.updateContact({
            id: contact.id,
            displayName: this.displayName
          });
        });
      }
      this.isEdit = false;
    },
    // 添加群成员或者创建群聊
    manageGroup(selectUid, isAdd, groupName) {
      this.createChatBox = false;
      let num = this.globalConfig.chatInfo.maxGroupGroupUser;
      if (isAdd) {
        if(selectUid.length > num && num>0){
          return this.$message.error("群成员不能大于" +num+ "人！");
        }
        createGroup({ userIds: selectUid, name:groupName }).then(res => {
          const data = res.data.data;
          const { UI } = this.$refs;
          if (res.data.code === 0) {
            // 添加联系人
            UI.appendContact(data);
            // 切换到该联系人
            UI.changeContact(data.id);
          }
        });
      } else {
        if((selectUid.length + this.groupUser.length) > num && num>0){
          return this.$message.error("群成员不能大于"+num+"人！");
        }
        addGroupUser({userIds: selectUid, id: this.groupId});
      }
    },
    wrapKey(e){
      return this.setting.sendKey === 1 ? (e.keyCode === 13 && e.ctrlKey) : (e.keyCode === 13 && !e.ctrlKey && !e.shiftKey);
    },
    // 关闭搜索结果
    closeSearch() {
      let that = this;
      setTimeout(function() {
        that.searchResult = false;
      }, 300);
    },
    openMessageBox() {
      this.messageBox = true;
      // 组件重置
      this.componentKey += 1;
    },
    // 打开添加群成员的窗口
    openAddGroupUser() {
      let userIds = arrayToString(this.groupUser, "userId");
      this.isAdd = false;
      this.userIds = userIds;
      this.dialogTitle = "添加群成员";
      this.createChatBox = true;
    },
    handleCommand(e){
      if(e === 'addGroup'){
        this.openCreateGroup();
      }else{
        this.addFriendBox=true;
      }
    },
    // 封装循环请求
    fn(formData) {
      return new Promise((resolve, reject) => {
        sendChatMessage(formData).then(res => {
          if (res.data.code === 0) {
            resolve(res);
          } else {
            this.$message.error(res.data.message);
          }
        }).catch(err => {
          console.log(err)
        });
      });
    },
    async test(formData) {
      return await this.fn(formData);
    },
    // 打开聊天窗口
    openChat(contactId, instance) {
      this.keywords = "";
      instance.changeContact(contactId);
    },
    // 切换聊天窗口时要检测那些消息未读
    handleChangeContact(contact, instance) {
      instance.updateContact({
        id: contact.id,
        unread: 0
      });
      // 将未读的总数减去当前选择的聊天
      this.unread -= contact.unread;
      const { UI } = this.$refs;
      this.initMenus(UI);
      // 聊天记录列表恢复到最初第一页
      this.params.page = 1;
      this.displayName = contact.displayName;
      this.oldName = contact.displayName;
      this.currentChat = contact;
      // 如果是群聊，拉取群成员列表，如果刚才拉取过，现在就不用拉取了
      if (contact.isGroup === true && this.groupId !== contact.id) {
        this.getGroupUserList(contact.id);
      }
      //切换聊天后全局设置是否是群聊或者单聊
      this.isGroup = contact.isGroup;
      // 如果是团队id，保存当前团队id避免下次切换回来的时候重复请求成员列表
      if (this.isGroup) {
        this.groupId = contact.id;
        this.notice = contact.notice;
      }
      let data = [];

      // 获取当前聊天窗口的所有消息
      let messages = UI.getMessages(contact.id);
      for (let i = 0; messages.length > i; i++) {
        if (
            messages[i].isRead === false &&
            messages[i].fromUser.id !== this.user.id
        ) {
          data.push(messages[i]);
        }
      }
      // 如果有未读的消息，需要将消息修改为已读
      if (data.length > 0) {
        readMessage({
          isGroup: contact.isGroup,
          toContactId: contact.id,
          messages: data,
          fromUser: contact.id
        }).then(res => {
          if (res.data.code === 0) {
            this.setLocalMsgIsRead(data);
          }
        });
      }
      instance.closeDrawer();
    },
    // 将本地消息设置为已读
    setLocalMsgIsRead(message) {
      const { UI } = this.$refs;
      for (let i = 0; message.length > i; i++) {
        const data = {
          id: message[i]["id"],
          is_read: 1,
          status: "success",
          content: message[i]["content"] + " "
        };
        UI.updateMessage(data);
      }
    },
    // 打开创建团队的窗口
    openCreateGroup() {
      this.isAdd=true;
      this.dialogTitle = "创建群聊";
      this.createChatBox = true;
    },
    // 打开设置中心
    openSetting(){
      const { UI } = this.$refs;
      UI.changeMenu("setting");
    },
    // 转发消息
    forwardUser(userIds) {
      if (userIds.length > 5) {
        return this.$message.error("转发的人数不能超过5人！");
      }
      this.forwardBox = false;
      let message = this.currentMessage;
      let arr = [];
      for (let i = 0; i < userIds.length; i++) {
        let toUserId = userIds[i].toString();
        message.status = "success";
        message.sendTime = getTime();
        message.toUserId = toUserId;
        message.fromUser = this.user;
        message.isGroup = toUserId.indexOf("group") !== -1;
        if(!this.globalConfig.chatInfo.simpleChat && !message.isGroup){
          continue;
        }
        arr.push(this.test(message));
      }
      // 批量请求
      Promise.all(arr).then(res => {
        const { UI } = this.$refs;
        for (let i = 0; i < res.length; i++) {
          let data = res[i].data;
          if (data.isGroup === 0) {
            data.toUserId = parseInt(data.toUserId);
          }
          // 添加消息
          UI.appendMessage(data);
          // 自己发送消息，修改未读数
          UI.updateContact({
            id: data.toUserId,
            unread: 0
          });
        }
      }).catch(err => {
        console.log("error", err);
      });
    },
    // 拉取聊天记录
    handlePullMessages(contact, next, instance) {
      let params= this.params;
      params.toContactId = contact.id;
      params.isGroup = contact.isGroup;
      getChatMessages(params).then(res => {
            this.params.page++;
            let isEnd = false;
            let messages = res.data;
            if (messages.length < this.params.limit) {
              isEnd = true;
            }
            next(messages, isEnd);
          })
          .catch(error => {
            next([], true);
          });
      return true;
    },
    // 点击了消息
    handleMessageClick(e, key, message, instance) {
      if (key === "status") {
        // 重发消息
        instance.updateMessage({
          id: message.id,
          status: "going"
        })
        message.status = "going";
        this.diySendMessage(message, this.curFile);
        return;
      } else if(key === 'avatar'){
        this.$user(message.fromUser.id);
        return;
      }
      // 语音消息点击事件
      if (message.type === 'voice') {
        // 如果没有其他语音在播放，直接播放
        if (!this.playAudio) {
          this.currentMessage = message;
          return this.playVoice(message, instance);
        }
        //只要有在播放的直接停止
        this.playAudio.pause();
        this.playAudio = null;
        instance.updateMessage({
          id: this.currentMessage.id,
          status: "successd",
          isPlay: 0,
        })
        // 如果不是点击的同一条数据，重新进行播放
        if (message.id !== this.currentMessage.id) {
          this.currentMessage = message;
          this.playVoice(message, instance);
        }
      }
      let imageTypes = ["image", "file", "video"];
      if (imageTypes.includes(message.type)) {
        if (!message.preview) {
          return this.$message.error("没有配置预览接口");
        }
        this.$preview(message.preview);
      } else if(message.type === 'webrtc'){
        this.called(parseFloat(message.extends.type));
      }
    },

    playVoice (message, instance) {
      this.playAudio = new Audio(message.content);
      this.playAudio.play(); //播放这个音频对象
      instance.updateMessage({
        id: message.id,
        status: "succeed",
        isPlay: 1,
      })
    },
    // 获取群聊成员列表
    getGroupUserList(groupId) {
      getGroupUsers({
        groupId: groupId
      }).then(res => {
        if (res.data.code === 0) {
          let data = res.data.data;
          this.groupUser = data;
          this.groupUserCount = data.length;
        }
      });
    },
    // 查看群公告
    openNotice() {
      let notice="<div style='white-space: pre;'>"+ this.notice + "</div>"
      this.$alert(notice, "群公告", {
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      });
    },
    //发送群公告
    publishNotice() {
      this.noticeBox = false;
      publishNotice({
        id: this.groupId,
        notice: this.notice
      }).then(res => {
        if (res.data.code === 0) {
          this.$message({
            type: "success",
            message: "发布成功!"
          });
        }
      })
    },
  },


}

</script>



<style scoped lang="scss">
.main-container {
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-size: cover;
}

.messageBoxStyle {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  z-index: 1999;
  background: rgba(0, 0, 0, 0.5);
  overflow-y: visible;
  .el-dialog__wrapper {
    display: flex;
    align-items: center;
  }
}

.chat-box {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}

.cover {
  text-align: center;
  user-select: none;
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  i {
    font-size: 84px;
    color: #e6e6e6;
  }
  p {
    font-size: 18px;
    color: #ddd;
    line-height: 50px;
  }
}

.displayName {
  font-size: 16px;
  visibility: visible;
}

.contact-fixedtop-box {
  margin: 15px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  visibility: visible;
  position: relative;
}

.search-list {
  background: #fff;
  position: absolute;
  z-index: 99;
  top: 40px;
  width: 230px;
  height: 300px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
  overflow: auto;
  border: solid 1px #e6e6e6;
  .search-list-item :hover {
    background: #f1f1f1;
  }
  .lemon-contact {
    background: #fff;
  }
}

.chat-top-list {
  display: flex;
  padding: 0 5px 10px 10px;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.message-title-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  visibility: visible;
}

.message-title-tools {
  font-size: 20px;
  color: #999999;
  letter-spacing: 5px;
  cursor: pointer;
}

.editInput {
  font-size: 18px;
  border: none;
  width: 400px;
}

.editInput:focus {
  outline: -webkit-focus-ring-color auto 0px;
}

.lemon-last-content {
  display: flex;
  justify-content: space-between;
  .lastContent {
    width: 150px !important;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}

.slot-group-list {
  background: #fff;
  width: 180px;
  border-left: solid 1px #e6e6e6;
  height: 100%;
  white-space: initial;
  .group-side-box {
    .group-side-title {
      padding: 5px 10px;
    }
    .group-side-body {
      height: 85px;
      padding: 10px;
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
    }
    .group-user-body {
      min-height: 410px;
      .user-list {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: nowrap;
        justify-content: flex-start;
        padding: 5px;
        background: #fff;
        .user-avatar {
          margin: 3px 8px 0 0;
          line-height: 10px;
        }
        .user-name {
          width: 110px;
        }
        .user-role {
          width: 20px;
        }
      }
      .user-list:hover {
        background: #e6e6e6;
      }
    }
  }
}

.group-side-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: space-between;
}

.group-notice {
  height: 140px;
}

.group-user {
  min-height: 300px;
  overflow: auto;
}
</style>