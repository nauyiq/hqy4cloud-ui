<template>
  <div>
    <div class="chat-box">
      <lemon-imui
          :user="user"
          ref="IMUI"
          :width="curWidth"
          :height="curHeight"
          :contextmenu="contextmenu"
          :contact-contextmenu="contactContextmenu"
          :theme="'default'"
          :hide-message-name="false"
          :hide-message-time="false"
          :avatarCricle="true"
          :sendKey="setSendKey"
          :send-text="'发送'"
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
              <p><b>在线聊天</b> IM</p>
            </div>
          </div>
        </template>
        <!-- 最近联系人列表插槽 -->
        <template #sidebar-message="Contact">
            <span class="lemon-badge lemon-contact__avatar">
            <span
                class="lemon-avatar"
                v-bind:class="{ 'lemon-avatar--circle': setting.avatarCricle }"
                style="width: 40px; height: 40px; line-height: 40px; font-size: 20px;"><img
                :src="Contact.avatar"/></span>
            <span
                class="lemon-badge__label"
                v-if="Contact.unread > 0 && Contact.isNotice">{{ Contact.unread }}</span>
          </span>
          <div class="lemon-contact__inner">
            <p class="lemon-contact__label">
              <span class="lemon-contact__name">
                <OnlineStatus v-if="Contact.isOnline && Contact.isGroup===false"
                              title="在线" type="success"></OnlineStatus>
                <el-tag size="mini" v-if="Contact.isGroup">群聊</el-tag>
                {{ Contact.displayName }}
              </span>
              <span
                  class="lemon-contact__time"
                  v-text="formatTime(Contact.lastSendTime)"
              ></span>
            </p>
            <p class="lemon-contact__content lemon-last-content">
              <span class="lastContent">
                <span v-if="Contact.isNotice === true && Contact.unread > 0"
                >[{{ Contact.unread }}条未读]</span
                >
                <span v-html="Contact.lastContent"></span>
              </span>
              <span
                  class="el-icon-close-notification f-16"
                  v-if="!Contact.isNotice"
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
                    @click="handleClickGroupName(contact)">
                  <el-tag size="mini">群聊</el-tag> {{
                    contact && contact.displayName && contact.displayName.length > 20 ? contact.creatorName + "创建的群聊" : contact.displayName
                  }}<span class="mr-5">({{
                    groupUserCount
                  }})</span>
                  <!--                  <el-tag size="mini" v-if="contact.setting.nospeak === 1" type="warning">仅群管理员可发言</el-tag>-->
                  <!--                  <el-tag size="mini" v-if="contact.setting.nospeak === 2" type="danger">全员禁言中</el-tag>-->
                </span>
                <span class="displayName" v-if="isGroup === false">
                  <OnlineStatus :type="contact.isOnline ? 'success' : 'info'" :pulse="contact.isOnline "
                                v-if="globalConfig.online"></OnlineStatus> {{ contact.displayName }}</span>
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
                              <i class="el-icon-phone-outline mr-10" title="语音通话"
                                 v-if="!contact.is_group && parseInt(globalConfig.chatInfo.webrtc)" @click="called(0)"></i>
                              <i class="el-icon-video-camera mr-10" title="视频通话"
                                 v-if="!contact.is_group && parseInt(globalConfig.chatInfo.webrtc)" @click="called(1)"></i>
                            </template>-->
              <!--              <i class="el-icon-time mr-10" @click="openMessageBox" title="消息管理器"></i>-->
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
                @focus="searchResult = true"
                v-model="keywords"
                class="input-with-select"
            >
            </el-input>
            <div style="margin-left:10px">
              <el-dropdown @command="handleCommand">
                <el-button icon="el-icon-plus" circle></el-button>
                <el-dropdown-menu class="operations" slot="dropdown">
                  <el-dropdown-item command="addFriend">添加朋友</el-dropdown-item>
                  <el-dropdown-item command="addGroup">创建群聊</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>

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
                    @click="openChat(item.id, item.isGroup, instance)"
                />
              </div>
              <div
                  v-if="searchList.length === 0"
                  style="margin: 20px"
                  align="center"
              >
                暂无
              </div>
            </div>
          </div>
        </template>
        <!-- 最近联系人列表顶部插槽，滚动 -->
        <!--        <template #sidebar-message-top="instance">
                  <div class="chat-top-list" v-if="chatTopList.length > 0">
                    <ChatTop
                        v-for="(item, index) in chatTopList"
                        :contact="item"
                        :key="index"
                        :avatarCricle="setting.avatarCricle"
                        :currentId="currentChat.id"
                        @click.native="openChat(item.id, instance)"
                    ></ChatTop>
                  </div>
                </template>-->
        <!-- 联系人列表顶部插槽 -->
        <template #sidebar-contact-fixedtop="instance">
          <div style="margin: 15px 10px">
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
                        v-if="contact.role < 3"
                    ></span>
                  </div>
                </div>
                <hr/>
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
                        v-if="contact.role === 1 || (contact.role !== 4 && contact.invite)"
                        @click="openAddGroupUser"
                    ></span>
                  </div>
                </div>
                <hr/>
                <div class="group-user-body" :style="'height:calc('+curHeight+' - 230px )'" id="group-user">
                  <el-scrollbar style="height:100%;">
                    <lemon-contact
                        class="user-list"
                        v-for="(item, index) in groupUser"
                        :key="index"
                        :contact="item"
                        v-lemon-contextmenu.contact="groupMenu"
                    >
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
                        <span v-if="item.userInfo.id !== user.id">{{
                            item.userInfo.displayName
                          }}</span>
                      </div>
                      <div class="user-role">
                        <i
                            class="el-icon-user-solid fc-danger"
                            title="创建者"
                            v-if="item.role === 1"
                        ></i>
                        <i
                            class="el-icon-user-solid fc-warning"
                            title="管理员"
                            v-if="item.role === 2"
                        ></i>
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
              v-if="message.fromUser.id === user.id && message.isGroup === false"
              style="visibility: visible"
          >
            <span v-if="!message.isRead && message.status==='succeed'"> 未读 </span>
            <span v-if="message.isRead && message.status==='succeed'" class="fc-success"> 已读 </span>
          </span>
        </template>
        <!-- 发送按钮左边插槽 -->
        <template #editor-footer>
          {{ setting.sendKey === 1 ? '使用 Enter 键发送消息' : '使用 Ctrl + Enter 键发送消息' }}
        </template>
      </lemon-imui>
    </div>
    <!-- 创建群聊 -->
    <Group :visible.sync="createChatBox" :title="dialogTitle" @manageGroup="manageGroup" :isAdd="isAdd"
           :userIds="userIds" :allFriends="friends"></Group>
    <!-- 发布公告 -->
    <el-dialog
        title="发布公告"
        :visible.sync="noticeBox"
        :modal="true"
        width="500px"
        append-to-body
    >
      <el-input
          type="textarea"
          :rows="10"
          placeholder="请输入内容"
          v-model="notice"
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="noticeBox = false">取 消</el-button>
        <el-button type="primary" @click="publishNotice">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加好友 -->
    <addFriend :visible.sync="addFriendBox"></addFriend>
    <!-- 转发聊天 -->
    <ChooseDialog :visible.sync="forwardBox" @selectChat="forwardUser" :allUser="allUser"
                  :contacts="contacts"></ChooseDialog>
    <!-- 消息管理器 -->
    <el-dialog
        title="消息管理器"
        :visible.sync="messageBox"
        :modal="true"
        width="800px"
        append-to-body
    >
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
    <!-- 文件预览组件 -->
    <el-dialog class="preview-dialog"
               :visible.sync="previewFileShow"
               idth="80%"
               :modal-append-to-body='false'
               :close-on-press-escape='false'
               :before-close="handleClose"
               :modal="true"
               width="800px"
               style="height:auto; overflow-y: hidden;">
      <PreviewFile :file="previewFile" v-if="previewFileShow"></PreviewFile>
    </el-dialog>
  </div>
</template>

<script>
import {mapState} from "vuex";
import EmojiData from "@/utils/emoji";
import * as utils from "@/utils/index";
import Lockr from "lockr";
import Socket from "./socket";
import ChatRecord from "./chatRecord";
import ChatSet from "./chatSet";
import ChatTop from "./chatTop";
import Group from "./group";
import ChooseDialog from "./chooseDialog";
import Files from "./files/index";
import Setting from "./setting";
import addFriend from "./friend";
import OnlineStatus from "./onlineStatus";
import Apply from "./apply";
import ScreenShot from "js-web-screen-shot";
import PreviewFile from "@c/preview/preview";
import {
  forwardMessage,
  getChat,
  getChatMessages, getChats, getConversations, getContacts,
  readMessage, removeGroupConversation,
  sendChatMessage, sendfileMessage,
  setChatNotice,
  setChatTop,
  undoChatMessage, removePrivateConversation, addConversation
} from "@/api/im/chat"
import {deleteFriend} from "@/api/im/friend"
import {
  createGroup,
  addGroupUser,
  getGroupUsers,
  deleteGroup,
  publishNotice,
  removeGroupUser,
  updateGroupName,
  exitGroup
} from "@/api/im/group"
import InviteImg from '@/assets/img/invite.png'
// import webrtc from "./webrtc";
// import VoiceRecorder from "./messageBox/voiceRecorder";

const getTime = () => {
  return new Date().getTime();
};
export default {
  name: "app",
  components: {
    Socket,
    ChatRecord,
    ChatSet,
    ChatTop,
    // VoiceRecorder,
    // webrtc,
    Group,
    Files,
    PreviewFile,
    addFriend,
    ChooseDialog,
    OnlineStatus,
    Apply
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
    dialog: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    // 监听全局socket消息状态
    ...mapState({
      socketAction: state => state.user.socketAction,
      contactId: state => state.user.contactId,
      contactSync: state => state.user.contactSync,
      setting: state => state.user.setting,
      userInfo: state => state.user.setting,
      globalConfig: state => state.user.globalConfig,
      isToken() {
        return this.$store.getters.access_token;
      }
    }),
    formatTime() {
      return function (val) {
        return utils.timeFormat(val);
      };
    }
  },
  data() {
    let _this = this;
    // let webrtcConfig = this.$store.state.globalConfig.chatInfo;
    return {
      noSimpleTips: '当前聊天处于禁言中，无法发送消息',
      isFullscreen: false,
      curWidth: '1000px',
      curHeight: '600px',
      unread: 0,
      systemUnread: 0,
      // webrtcConfig:{
      //     config: { 'iceServers':[{
      //     'urls': stun,
      //   }]}
      // },
      // webrtcConfig: webrtcConfig,
      wsData: null,
      webrtcLock: false,
      caller: '',
      is_video: 1,
      curFile: null,
      componentKey: 1,
      // 搜索结果展示
      searchResult: false,
      addFriendBox: false,
      createChatBox: false,
      forwardBox: false,
      noticeBox: false,
      messageBox: false,
      webrtcBox: false,
      groupSetting: false,
      VoiceStatus: false,
      contactSetting: {},
      groupUserCount: 0,
      dialogTitle: "创建群聊",
      isAdd: true,
      userIds: [],
      // 公告
      notice: "",
      // 搜索结果列表
      searchList: [],
      keywords: "",
      displayName: "",
      oldName: "",
      isEdit: false,
      // 当前登录用户
      user: {
        id: '',
        displayName: '',
        avatar: '',
        username: ''
      },
      params: {
        page: 1,
        limit: 10,
      },
      previewFile: {}, // 传递的参数
      previewFileShow: false, // 默认预览框是关闭状态
      isGroup: false,
      groupId: 0,
      //联系人, 会话列表
      contacts: [],
      // 好友联系人列表
      friendContactList: [],
      // 排序好的通讯录好友
      friends: [],
      allUser: [],
      groupUser: [],
      // 当前聊天
      currentChat: {},
      // 当前消息
      currentMessage: {},
      // 置顶列表
      chatTopList: [],
      playAudio: null,
      // 群成员邮件菜单
      groupMenu: [
        {
          text: "发送消息",
          click: (e, instance, hide) => {
            const {IMUI, contact} = instance;
            IMUI.changeContact(contact.userId);
            hide();
          },
          visible: instance => {
            return instance.contact.userId !== this.user.id;
          }
        },
        /*{
          text: "设置管理员",
          click: (e, instance, hide) => {
            const {IMUI, contact} = instance;
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
            // 只有群主才可以设置管理员, 并且当前用户是普通用户
            return (
                instance.contact.role === 3 && this.currentChat.creator === this.user.id
            );
          }
        },
        {
          text: "取消管理员",
          click: (e, instance, hide) => {
            const {IMUI, contact} = instance;
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
            // 只有群主才可以设置管理员, 并且当前用户是普通用户
            return (
                instance.contact.role === 2 && this.currentChat.creator === this.user.id
            );
          }
        },*/
        {
          text: "查看资料",
          click: (e, instance, hide) => {
            const {IMUI, contact} = instance;
            hide();
            this.$user(contact.userId);
          }
        },
        {
          text: "移出群聊",
          color: "red",
          click: (e, instance, hide) => {
            const {IMUI, contact} = instance;
            hide();
            this.$confirm("确定移除该成员吗？", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              removeGroupUser({groupId: this.groupId, id: contact.userId});
            });
          },
          visible: instance => {
            return (
                instance.contact.userId !== this.user.id &&
                this.currentChat.creator !== instance.contact.id &&
                this.currentChat.role === 1
            );
          }
        },
        {
          text: "退出群聊",
          color: "red",
          click: (e, instance, hide) => {
            const {IMUI, contact} = instance;
            hide();
            this.$confirm("确定退出该群聊吗？", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              exitGroup(this.groupId).then(res => {
                if (res.data.code === 0) {
                  this.groupUserCount--
                  utils.delArrValue(this.groupUser, ["userId"], this.user.id)
                  this.removeContact(this.groupId);
                }
              })
            });
          },
          visible: instance => {
            return (
                instance.contact.userId === this.user.id
            );
          }
        }

      ],
      // 定义联系人的右键菜单
      contactContextmenu: [
        {
          click(e, instance, hide) {
            const {IMUI, contact} = instance;
            _this.$user(contact.id);
            hide();
          },
          icon: "el-icon-tickets",
          text: "查看资料",
          visible: instance => {
            return instance.contact.isGroup === false && instance.contact.id !== 'system';
          }
        },
        {
          icon: "el-icon-upload2",
          text: "置顶聊天",
          click: (e, instance, hide) => {
            const {IMUI, contact} = instance;
            setChatTop({
              contactId: contact.id,
              status: true,
              isGroup: contact.isGroup
            }).then(res => {
              if (res.data.code === 0) {
                IMUI.updateContact({
                  id: contact.id,
                  isTop: true
                });
                contact.isTop = true;
                /*const hasContact = _this.chatTopList.filter(item => item.id === contact.id);
                if (!hasContact.length) {
                  _this.chatTopList.push(contact);
                }*/
              }
            });
            hide();
          },
          visible: instance => {
            return instance.contact.isTop === false && instance.contact.id !== 'system' && instance.contact.role !== 4;
          }
        },
        {
          icon: "el-icon-download",
          text: "取消置顶",
          click: (e, instance, hide) => {
            const {IMUI, contact} = instance;
            setChatTop({
              contactId: contact.id,
              status: false,
              isGroup: contact.isGroup
            }).then(res => {
              if (res.data.code === 0) {
                IMUI.updateContact({
                  id: contact.id,
                  isTop: false
                });
                contact.isTop = false
                // 删除置顶聊天列表人员
                utils.delArrValue(this.chatTopList, "id", contact.id);
              }
            });
            hide();
          },
          visible: instance => {
            return instance.contact.isTop === true && instance.contact.id !== 'system' && instance.contact.role !== 4;
          }
        },

        {
          click(e, instance, hide) {
            const {IMUI, contact} = instance;
            hide();
            setChatNotice({contactId: contact.id, status: false, isGroup: contact.isGroup});
            IMUI.updateContact({
              id: contact.id,
              isNotice: false
            });
          },
          icon: "el-icon-bell",
          text: "消息免打扰",
          visible: instance => {
            return (
                instance.contact.isNotice && instance.contact.id !== 'system' && instance.contact.role !== 4
            );
          }
        },
        {
          click(e, instance, hide) {
            const {IMUI, contact} = instance;
            hide();
            setChatNotice({contactId: contact.id, status: true, isGroup: contact.isGroup});
            IMUI.updateContact({
              id: contact.id,
              isNotice: true
            });
          },
          icon: "el-icon-close-notification",
          text: "取消免打扰",
          visible: instance => {
            return (
                instance.contact.isNotice === false && instance.contact.id !== 'system' && instance.contact.role !== 4
            );
          }
        },
        /*{
          click(e, instance, hide) {
            const {IMUI, contact} = instance;
            hide();
            _this.groupSetting = true;
            _this.contactSetting = contact;
            _this.componentKey++;
          },
          icon: "el-icon-setting",
          text: "群管理",
          visible: instance => {
            return instance.contact.role === 1 && instance.contact.isGroup === true;
          }
        },*/
        {
          click(e, instance, hide) {
            const {IMUI, contact} = instance;
            hide();
            _this
                .$confirm("确定删除该好友吗？", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                })
                .then(() => {
                  deleteFriend(contact.id).then(res => {
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
                instance.contact.isGroup === false && instance.contact.id !== 'system' && instance.contact.index
            );
          }
        },
        {
          click(e, instance, hide) {
            const {IMUI, contact} = instance;
            hide();
            _this
                .$confirm("确定删除该聊天记录吗？", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                })
                .then(() => {
                  if (contact.isGroup) {
                    removeGroupConversation(contact.conversationId).then(res => {
                      if (res.data.code === 0) {
                        _this.removeContact(contact.id);
                        if (contact.unread > 0) {
                          _this.unread -= contact.unread
                          _this.initMenus(IMUI);
                        }
                      }
                    });
                  } else {
                    removePrivateConversation(contact.conversationId).then(res => {
                      if (res.data.code === 0) {
                        _this.removeContact(contact.id);
                        if (contact.unread > 0) {
                          _this.unread -= contact.unread
                          _this.initMenus(IMUI);
                        }
                      }
                    });
                  }
                }).catch(() => {
            });
          },
          icon: "el-icon-delete",
          text: "删除聊天",
          visible: instance => {
            return (
                instance.contact.id !== 'system' && !instance.contact.index
            );
          }
        },
        {
          click(e, instance, hide) {
            const {IMUI, contact} = instance;
            hide();
            _this
                .$confirm("确定解散该群聊吗？", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                })
                .then(() => {
                  deleteGroup(contact.id).then(res => {
                    if (res.data.code === 0) {
                      if (contact.unread > 0) {
                        _this.unread -= contact.unread
                        _this.initMenus(IMUI);
                      }
                      _this.$message({
                        type: "success",
                        message: "解散群聊成功!"
                      });
                      _this.removeContact(contact.id);
                    }
                  })

                }).catch(() => {
            });
          },
          icon: "el-icon-close",
          color: "red",
          text: "解散群聊",
          visible: instance => {
            return (
                instance.contact.creator === _this.user.id && instance.contact.isGroup === true
            );
          }
        },
        {
          click(e, instance, hide) {
            const {IMUI, contact} = instance;
            hide();
            _this
                .$confirm("确定退出该群聊吗？", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                })
                .then(() => {
                  exitGroup(contact.id).then(res => {
                    if (res.data.code === 0) {

                      _this.$message({
                        type: "success",
                        message: "退出成功!"
                      });
                      _this.removeContact(contact.id);
                      _this.groupUserCount--
                      utils.delArrValue(_this.groupUser, ["userId"], _this.user.id)
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
                instance.contact.creator !== _this.user.id &&
                instance.contact.isGroup === true &&
                instance.contact.role !== 4
            );
          }
        }
      ],
      // 定义消息内容的右键菜单
      contextmenu: [
        {
          click: (e, instance, hide) => {
            const {IMUI, message} = instance;
            undoChatMessage({id: message.messageId, isGroup: message.isGroup})
                .then(res => {
                  const data = {
                    id: message.id,
                    type: "event",
                    //使用 jsx 时 click必须使用箭头函数（使上下文停留在vue内）
                    content: (
                        <div>
                      <span>
                        {res.data.data}{" "}
                        <span
                            v-show={message.type === "text"}
                            style="color:#409EFF;cursor:pointer"
                            content={message.content}
                            on-click={e => {
                              IMUI.setEditorValue(
                                  e.target.getAttribute("content")
                              );
                            }}
                        >
                          重新编辑
                        </span>
                      </span>
                        </div>
                    ),
                    toContactId: message.toContactId
                  };


                  /*const data = {
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
                              IMUI.setEditorValue(
                                  e.target.getAttribute("content")
                              );
                            }}
                        >
                          重新编辑
                        </span>
                      </span>
                        </div>
                    ),
                    toContactId: message.toContactId
                  };*/


                  IMUI.updateMessage(data);
                  const conversation = IMUI.findConversation(message.toContactId);
                  if (conversation && conversation.lastSendTime <= message.sendTime) {
                    IMUI.updateContact({
                      id: message.toContactId,
                      lastContent: "你撤回了一条消息"
                    })
                  }
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
            const {IMUI} = this.$refs;
            const contactList = IMUI.getContacts();
            const currentContact = IMUI.getCurrentContact();
            this.allUser = utils.editArrValue(contactList, "id", currentContact.id);
            this.allUser.sort((a, b) => {
              if (!a.index) return;
              return a.index.localeCompare(b.index);
            })
            utils.delArrValue(this.allUser, ["id"], "system")
            hide();
            this.forwardBox = true;
          }
        },
        {
          visible: instance => {
            return instance.message.type === "text";
          },
          text: "复制",
          click: (e, instance, hide) => {
            this.$clipboard(instance.message.content);
            /*this.$message({
              type: "success",
              message: "复制成功!"
            });*/
            hide();
          }
        },
        {
          visible: instance => {
            return instance.message.type === "image";
          },
          text: "下载图片",
          click: (e, instance, hide) => {
            const {message} = instance;
            hide();
            utils.download(message.content)
          }
        },
        {
          visible: instance => {
            return instance.message.type === "file";
          },
          text: "下载文件",
          click: (e, instance, hide) => {
            const {message} = instance;
            utils.download(message.content)
            hide();
          }
        }
      ]
    };
  },
  watch: {
    isFullscreen(val) {
      Lockr.set('isFullscreen', val);
      this.curWidth = val ? '100vw' : this.width;
      this.curHeight = val ? '100vh' : this.height;
    },
    dialog(val) {
      if (!val) {
        const {IMUI} = this.$refs;
        IMUI.changeContact("SET_FRIEND_DIALOG", false)
      }
    },
    playAudio(val) {
      if (val && this.currentMessage) {
        let message = this.currentMessage;
        var that = this;
        const {IMUI} = this.$refs;
        this.playAudio.addEventListener('ended', function () {
          console.log('声音停止');
          that.playAudio = null;
          that.currentMessage = null;
          IMUI.updateMessage({
            id: message.id,
            status: 'successd',
            isPlay: 0,
          })
        }, false);
      }

    },
    // 全局调用发送消息
    contactSync(val) {
      this.$emit('newChat', val);
      const {IMUI} = this.$refs;
      let contact = IMUI.findConversation(this.contactId);
      if (contact) {
        IMUI.changeContact(this.contactId);
      } else {
        addConversation({
          contactId: this.contactId,
          isGroup: false
        }).then(res => {
          if (res.data.code === 0) {
            IMUI.appendContact(res.data.data)
            IMUI.changeContact(this.contactId);
          }
        })
      }
    },
    unread(val) {
      this.$store.commit('UPDATE_UNREAD', val);
    },
    systemUnread(val) {
      this.$store.commit('UPDATE_SYSTEM_UNREAD', val);
    },
    // 监听联系人搜索
    keywords() {
      const {IMUI} = this.$refs;
      const contacts = IMUI.getContacts();
      //搜索好友
      this.searchContact(contacts);
      //搜索联系人群聊列表
      let conversations = IMUI.getConversations();
      if (conversations && this.keywords !== "") {
        let searchObject = utils.search_object(conversations, ["displayName"], this.keywords);
        if (searchObject.length > 0) {
          searchObject.forEach(search => {
            let findContact = IMUI.findContact(search.id);
            if (!findContact) {
              this.searchList.push(search)
            }
          })
        }
      }
      if (this.keywords === "") {
        this.searchList = []
      }
    },
    // 监听接收socket消息
    socketAction(val) {
      let message = val.data;
      const {IMUI} = this.$refs;
      switch (val.event) {
          //上线、下线通知
        case "connect":
          IMUI.updateContact({
            id: message.id,
            isOnline: message.isOnline
          })
          break;
        case "disconnect":
          if (message.id === this.user.id && !message.isMobile) {
            this.$message.error = "网络连接异常, 请检查网络是否正常！";
            /*this.$store.dispatch("LogOut").then(() => {
              this.$router.push({path: "/login"});
            });*/
          }
          break;
          // 接收消息
        case "privateChat":
        case "groupChat":
          // 如果是自己发送的消息则不需要提示
          /*let toContactId = message.toContactId;
          if (message.fromUser.id !== this.user.id) {
            let contact = this.getContact(toContactId);
            // 如果开启了声音才播放
            if (this.setting.isVoice && contact.isNotice) {
              this.popNotice(message);
            }
          }*/
          this.receiveMsg(message);
          break;
          // 撤回消息
        case "undoMessage":
          // 更新消息
          IMUI.updateMessage({
            id: message.message.id,
            content: message.message.content,
            type: "event"
          });
          // 查找聊天会话
          const index = IMUI.findContactIndexById(message.contactId);
          if (index !== -1) {
            setTimeout(() => {
              const conversations = IMUI.getConversations();
              const conversation = conversations[index]
              if (conversation && conversation.lastSendTime <= message.message.sendTime) {
                IMUI.updateContact({
                  id: conversation.id,
                  lastContent: message.message.content
                })
              }
            }, 400)
          }

          /*console.log(findConversation)
          if (findConversation) {

            // 会话如果存在， 则判断会话的最后一条聊天记录是不是可以修改
            if (findConversation.lastSendTime <= message.message.sendTime) {
              IMUI.updateContact({
                id: findConversation.id,
                lastContent: message.message.content
              })
            }
          }*/

          /*if (message.isGroup) {
            data = IMUI.findConversation(message.toContactId);
            content = message.content
            if (data) {
              getChat(data.conversationId).then(res => {
                if (res.data.code === 0) {
                  let result = res.data.data;
                  if (result.lastSendTime <= message.sendTime) {
                    IMUI.updateContact({
                      id: data.id,
                      lastContent: content
                    })
                  }
                } else {
                  if (data && data.lastSendTime <= message.sendTime) {
                    IMUI.updateContact({
                      id: data.id,
                      lastContent: content
                    })
                  }
                }
              })
            }
          } else {
            data = IMUI.findConversation(message.fromUser.id);
            content = "对方撤回了一条消息"
            if (data && data.lastSendTime <= message.sendTime) {
              IMUI.updateContact({
                id: data.id,
                lastContent: content
              })
            }
          }*/

          break;
          // 设置置顶
        case "setChatTop":
          console.log(message)
          IMUI.updateContact({
            id: message.id,
            isTop: message.isTop
          });
          IMUI.updateSimpleContact({
            id: message.id,
            isTop: message.isTop
          })
          //TODO.
          /*if (message.isTop) {
            const contact = this.getContact(message.id);
            const hasContact = this.chatTopList.filter(item => item.id === message.id);
            if (!hasContact.length) {
              this.chatTopList.push(contact);
            }
          } else {
            utils.delArrValue(this.chatTopList, "id", message.id);
          }*/
          break;
          // 设置消息免打扰
        case "setChatNotice":
          let conversation = IMUI.findConversation(message.id);
          if (conversation && conversation.unread > 0) {
            let count = this.unread - conversation.unread
            this.unread = count < 0 ? 0 : count;
            IMUI.updateContact({
              id: message.id,
              isNotice: message.isNotice,
              unread: 0
            });
            this.initMenus(IMUI)
            // 如果有未读的消息，需要将消息修改为已读
            readMessage({
              conversationId: message.conversationId,
              isGroup: conversation.isGroup
            })
          } else {
            IMUI.updateContact({
              id: message.id,
              isNotice: message.isNotice
            });
          }

          IMUI.updateSimpleContact({
            id: message.id,
            isNotice: message.isNotice
          })

          break;
          // 修改联系人名称
        case "contactNameChange":
          IMUI.updateContact({
            id: message.contactId,
            displayName: message.displayName
          });
          break;
          //处理消息已读,将本地的未读消息修改为已读状态
        case "readMessages":
          this.setLocalMsgIsRead(message);
          break;
          // 新增加了群聊
        case "addGroup":
          IMUI.appendContact(message);
          break;
          // 设置群管理员
        case "setManager":
        case "addGroupUser":
        case "removeUser":
          if (message.groupId === this.groupId) {
            this.getGroupUserList(message.groupId);
          }
          IMUI.updateContact({
            id: message.groupId,
            avatar: message.avatar
          });
          break;

        case "addGroupMember":
          if (message.groupId === this.groupId) {
            let users = message.users;
            this.groupUserCount += users.length
            users.forEach(user => {
              this.groupUser.push(user)
            })

          }
          break;
        case "removeGroupMember":
          if (message.groupId === this.groupId) {
            this.groupUserCount--
            utils.delArrValue(this.groupUser, ["userId"], message.userId)
          }
          break;
        case "exitGroup":
          if (message.groupId === this.groupId) {
            this.groupUserCount--
            utils.delArrValue(this.groupUser, ["userId"], message.userId)
          }
          break;
        case "deleteGroup":
          if (message.groupId === this.groupId) {
            this.groupUserCount = 0
            this.groupUser = []
            let vo = message.message;
            IMUI.appendMessage(vo, true);
          }
          if (message.userId === this.user.id) {
            this.removeContact(message.groupId);
          } else {
            IMUI.updateContact({
              role: 4,
              id: message.groupId
            })
          }

          break;
          // 发布公告
        case "groupNoticeChange":
          IMUI.updateContact({
            id: message.groupId,
            notice: message.notice
          });
          break;
          // 群聊设置
        case "groupSetting":
          IMUI.updateContact({
            id: message.group_id,
            setting: message.setting
          });
          break;
        case 'appendChat':
          let item = message.conversation
          if (item) {
            if (item.type) {
              let msg = {};
              msg.type = item.type;
              msg.content = item.lastContent;
              item.lastContent = IMUI.lastContentRender(msg);
            }
            if (item.unread !== 0) {
              this.unread += item.unread
              this.initMenus(IMUI);
            }
            IMUI.appendContact(item)
          }
          if (message.contact) {
            this.friends.push(message.contact)
            this.$store.commit('INIT_FRIENDS', this.friends);
            IMUI.appendToContacts(message.contact)
          }
          break;
        case "friendApplication":
          let contact = IMUI.getCurrentContact();
          if (contact.id === 'system') {
            // 如果是打开的系统联系人, 即新的朋友窗口 则重新刷新列表
            this.$store.commit('REFRESH_APPLICATIONS', Math.random().toString(8))
          } else {
            // 更新系统未读数 未读数 + 1
            this.systemUnread = this.systemUnread + 1
            IMUI.updateSimpleContact({id: 'system', unread: this.systemUnread});
            this.initMenus(IMUI);
          }
          break;
        case "logout":
          this.$router.push("/login")
          break;
          /*case 'webrtc':
            // 如果收到自己的消息，并且是其他端处理操作，则静默挂断
            if (message.fromUser.id == this.user.id) {
              let e = message.extends;
              let wsData = Lockr.get('wsData');
              // 挂断的情况下解锁webrtc
              if ([902, 903, 905, 906, 907].includes(parseInt(e.code))) {
                wsData.content = message.content;
                IMUI.updateMessage(wsData);
                this.webrtcLock = false;
              }
              // 如果是当前设备发出的消息则不处理
              if (e.isMobile == 0 || e.event == 'calling') {
                if (e.event == 'calling') {
                  Lockr.set('wsData', message);
                  this.recieveMsg(message);
                }
                return;
              }
              if (e.event == "otherOpt") {
                wsData.content = message.content;
                IMUI.updateMessage(wsData);
                this.wsData = null;
                this.caller = '';
                this.webrtcLock = false;
                this.$refs.webrtc.hangup(false);
              }
              return;
            }
            // 接收到webrtc消息
            if (this.wsData && this.wsData.id != message.id) {
              this.$api.imApi.sendToMsg({
                toContactId: message.fromUser.user_id,
                type: message.extends.type,
                event: 'busy',
                status: message.extends.status,
                code: 907,
                id: message.id,
                msg_id: message.msg_id,
              })
            } else {
              if (message.extends.event == 'calling') {
                this.recieveMsg(message);
                this.wsData = message;
                Lockr.set('wsData', message);
                this.caller = message.fromUser;
              } else if (message.extends.event == 'offer' || message.extends.event == 'answer') {
                //其他端在通话中，锁定webrtc，禁止通话
                this.webrtcLock = true;
              } else if (message.extends.event == 'hangup') {
                let wsData = Lockr.get('wsData');
                wsData.content = message.content;
                IMUI.updateMessage(wsData);
                this.webrtcLock = false;
              }
              if (this.wsData && this.wsData.id == message.id) {
                this.$refs.webrtc.webrtcAction(JSON.parse(JSON.stringify(message)));
              }
            }
            break;*/
      }
    }
  },
  created() {
    // 初始化用户
    if (this.isToken) {
      if (!this.userInfo.id) {
        this.$store.dispatch('GetUserInfo')
      }
      if (this.userInfo.id) {
        this.user.id = this.userInfo.id;
        this.user.displayName = this.userInfo.nickname;
        this.user.avatar = this.userInfo.avatar;
        this.user.username = this.userInfo.username;
      }
    } else {
      this.$message.info("请先登录，再进入聊天室")
      this.$router.push({path: '/login'})
    }

    window.addEventListener('storage', function (e) {
      if (e.key === 'hongqy-socket_action') {
        const data = JSON.parse(e.newValue);
        if (data.content.event === "logout") {
          window.location.reload()
        }
      }
    })

    if (window.Notification) {
      // 浏览器通知--window.Notification
      if (Notification.permission === "granted") {
        console.log("允许通知");
      } else if (Notification.permission !== "denied") {
        console.log("需要通知权限");
        Notification.requestPermission(permission => {
        });
      }
    } else {
      console.error("浏览器不支持Notification");
    }
  },
  mounted() {
    // 设置全屏
    if (this.fullScreen) {
      this.isFullscreen = Lockr.get('isFullscreen');
    }
    if (this.searchResult) {
      document.addEventListener("click", function (e) {
        if (!that.$refs.configforms.contains(e.target)) {
          that.searchResult = false;
        }
      });
    }
    if (this.isToken) {
      // 初始化联系人
      this.getSimpleChat();
    }

  },
  methods: {
    called(is_video) {
      if (!parseInt(this.globalConfig.chatInfo.webrtc)) {
        return this.$message.error("当前系统未开启音视频通话功能");
      }
      if (this.webrtcLock) {
        this.$message.error("其他端正在通话中");
        return;
      }
      this.webrtcBox = true;
      this.is_video = is_video;
      this.caller = this.currentChat;
      //TODO
      // this.$refs.webrtc.called(is_video);
    },
    handleClose() {
      this.previewFileShow = false
    },
    preview(index, row) {
      this.previewFileShow = true
      this.previewFile.fileName = row.fileName
      this.previewFile.downloadUrl = row.url
    },
    // 初始化聊天
    getSimpleChat(update) {
      this.$nextTick(() => {
        const IMUI = this.$refs.IMUI;
        this.IMUI = IMUI;
        IMUI.setLastContentRender("voice", message => {
          return `[语音]`;
        });
        IMUI.setLastContentRender("video", message => {
          return `[视频]`;
        });
        IMUI.setLastContentRender("webrtc", message => {
          return `[音视频通话]`;
        });
        let tools = [
          {
            name: "emoji"
          },
          /*{
            name: "screenShot",
            title: "发送截屏",
            click: () => {
              this.shotScreen()
            },
            render: () => {
              return <i class="el-icon el-icon-scissors f-18"
                        style="font-size: 17px; vertical-align: middle;font-weight: 600;"></i>
            }
          },*/
          {
            name: "uploadImage",
            title: "发送图片"
          },
          /*{
            name: "sendVoice",
            title: "发送语音",
            click: () => {
              this.VoiceStatus = true
            },
            render: () => {
              return <i class="el-icon el-icon-microphone f-18" style="vertical-align: middle;font-weight: 600;"></i>
            }
          },*/
          /*{
            name: "uploadVideo",
            title: "发送视频",
            click: () => {
              var uploadVideo = this.$refs.uploadVideo;
              uploadVideo.click();
            },
            render: () => {
              return <i class="el-icon el-icon-video-play f-18" style="vertical-align: middle;font-weight: 600;">
                <input style="display:none" type="file" accept="video/!*" ref="uploadVideo" on-change={e => {
                  this.uploadVideo(e);
                }}/></i>
            }
          },*/
          {
            name: "uploadFile",
            title: "发送文件",
          },
          {
            name: "messageManager",
            title: "聊天记录",
            click: () => {
              this.openMessageBox()
            },
            render: () => {
              return <i class="el-icon el-icon-time f-18"
                        style="font-size: 17px; vertical-align: middle;font-weight: 600;"></i>
            }
          }
        ];
        // 初始化工具栏
        IMUI.initEditorTools(tools);
        // 初始化表情
        IMUI.initEmoji(EmojiData);

        this.getImChats(update)

        setTimeout(() => {
          // 初始化左侧菜单栏
          this.initMenus(IMUI);
        }, 500)

      });
    },
    getImChats(update) {
      const IMUI = this.$refs.IMUI;

      // 构造系统联系人， 即新添加的好友
      const systemFriend = {
        id: 'system',
        displayName: "新的朋友",
        avatar: InviteImg,
        index: "[0]新的朋友",
        isGroup: false,
        isNotice: true,
        isTop: false,
        unread: this.systemUnread,
        click(next) {
          next();
        },
        renderContainer: () => {
          return <Apply></Apply>;
        },
      };

      // 获取联系人列表
      getContacts().then(res => {
        if (res.data.code === 0) {
          let data = res.data.data
          //初始化通讯录
          const contacts = data.contacts
          let contactList;
          if (contacts) {
            contactList = contacts
            this.friends = data.friends
          } else {
            contactList = []
          }
          systemFriend.unread = data.applicationUnread
          this.systemUnread = data.applicationUnread
          this.friendContactList = contactList
          this.friendContactList.push(systemFriend)
          IMUI.initFriends(this.friendContactList)
          this.$store.commit('INIT_FRIENDS', this.friendContactList);
        }
      }).catch(error => {
        console.log(error)
        this.$message.error("获取联系人失败, 请稍后再试");
      })

      // 获取聊天会话列表
      getConversations().then(res => {
        if (res.data.code === 0) {
          //会话列表
          let conversations = res.data.data
          // 初始化最近联系人
          if (conversations && conversations.length > 0) {
            let msg = {};
            // 重新渲染消息
            conversations.forEach((item, index) => {
              if (item.type) {
                msg.type = item.type;
                msg.content = item.lastContent;
                conversations[index]['lastContent'] = IMUI.lastContentRender(msg);
              }
              if (item.unread && !update) {
                this.unread += item.unread;
                this.initMenus(IMUI);
              }
            })
            // 设置置顶人
            // this.getChatTop(data);
          } else {
            conversations = []
          }
          conversations.push(systemFriend)
          conversations.forEach((item, index) => {
            // this.contacts.push(item)
            this.$set(this.contacts, index, item)
          })

          IMUI.initContacts(conversations)
          // this.$set(this, "contacts", conversations)
          this.$store.commit('INIT_CONTACTS', conversations)

        }
      }).catch(error => {
        console.log(error)
        this.$message.error("获取聊天会话失败, 请稍后再试");
      })


    },
    shotScreen() {
      new ScreenShot({
        enableWebRtc: true,  //是否启用webrtc
        level: 999999,  //层级级别
        completeCallback: this.callback,
        closeCallback: this.closeShotScreen,
      });
    },
    closeShotScreen() {
      console.log("关闭截图")
    },
    callback(base64data) {
      let image = new Image();
      image.src = base64data.base64;
      image.onload = () => {
        let canvas = this.convertImageToCanvas(image);
        let url = canvas.toDataURL("image/jpeg");
        let bytes = window.atob(url.split(",")[1]);  //通过atob将base64进行编码
        //处理异常，将ASCII码小于0的转换为大于0,进行二进制转换
        let buffer = new ArrayBuffer(bytes.length);
        let uint = new Uint8Array(buffer);  //生成一个8位数的数组
        for (let i = 0; i < bytes.length; i++) {
          uint[i] = bytes.charCodeAt(i);  //根据长度返回相对应的Unicode 编码
        }
        //Blob对象
        let file = new File([buffer], 'screenShot' + utils.generateRandId() + '.jpg', {type: "image/jpeg"}); //type为图片的格式
        this.$confirm('<img src=' + image.src + ' style="width:390px;height:100%;max-height:360px;object-fit:contain">', '发送截图', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '发送',
          showCancelButton: true,
          callback: (action, instance) => {
            if (action === 'confirm') {
              let message = {
                content: URL.createObjectURL(file),
                fromUser: this.user,
                id: utils.generateRandId(),
                sendTime: getTime(),
                status: 'going',
                toContactId: this.currentChat.id,
                type: 'image'
              }
              this.diySendMessage(message, file);
            } else {
              //TODO
              instance.close();
            }
          }
        });
      };
    },
    convertImageToCanvas(image) {
      let canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      canvas.getContext("2d").drawImage(image, 0, 0);
      return canvas;
    },
    // 初始化菜单
    initMenus(IMUI) {
      let menus = [
        {
          name: "messages",
          unread: this.unread,
        },
        {
          name: "contacts",
          unread: this.systemUnread
        },
        /*{
          name: "files",
          title: "文件",
          unread: 0,
          render: menu => {
            return <i class="el-icon-folder"/>;
          },
          renderContainer: () => {
            return (
                <Files title={this.dialogTitle}></Files>
            );
          },
        },*/
        {
          name: "setting",
          title: "设置",
          unread: 0,
          render: menu => {
            return <i class="el-icon-setting"/>;
          },
          renderContainer: () => {
            return (
                <Setting></Setting>
            );
          },
          isBottom: true
        }
      ];
      if (this.fullScreen) {
        menus.push({
          name: "fullscrren",
          title: "全屏/窗口",
          unread: 0,
          click: () => {
            this.isFullscreen = !this.isFullscreen;
          },
          render: menu => {
            return <i class="el-icon-full-screen"/>;
          }
        });
      }
      // 如果是管理员或者演示模式才显示后台管理
      //TODO
      /*if (user.role > 0 || this.globalConfig.demon_mode) {
        menus.push({
          name: "manage",
          title: "后台管理",
          unread: 0,
          click: () => {
            // 如果路由中有manage则关闭
            if (this.$route.path.indexOf('manage') > -1) {
              this.$emit('close');
              return;
            }
            this.$router.push('/manage/index')

          },
          render: menu => {
            return <i class="el-icon-s-operation"/>;
          },
          isBottom: true
        });
      }*/
      IMUI.initMenus(menus);
    },
    // 获取置顶联系人列表
    getChatTop() {
      let list = this.contacts;
      let topList = [];
      for (let i = 0; i < list.length; i++) {
        if (list[i].isTop) {
          topList.push(list[i]);
        }
      }
      this.chatTopList = topList;
    },
    // 获取联系人
    getContact(id) {
      const {IMUI} = this.$refs;
      const contactList = IMUI.getContacts();
      for (let i = 0; i < contactList.length; i++) {
        if (contactList[i].id === id) {
          return contactList[i];
        }
      }
    },
    wrapKey(e) {
      return this.setting.sendKey === 1 ? (e.keyCode === 13 && e.ctrlKey) : (e.keyCode === 13 && !e.ctrlKey && !e.shiftKey);
    },
    // 设置发送键
    setSendKey(e) {
      return this.setting.sendKey === 1 ? (e.keyCode === 13 && !e.ctrlKey && !e.shiftKey) : (e.keyCode === 13 && e.ctrlKey);
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
      } else if (key === 'avatar') {
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
        this.previewFileShow = true
        this.previewFile.fileName = message.fileName
        this.previewFile.downloadUrl = message.content
        // this.$preview(message.content);
      } else if (message.type === 'webrtc') {
        this.called(parseFloat(message.extends.type));
      }
    },
    playVoice(message, instance) {
      this.playAudio = new Audio(message.content);
      this.playAudio.play(); //播放这个音频对象
      instance.updateMessage({
        id: message.id,
        status: "succeed",
        isPlay: 1,
      })
    },
    // 打开聊天窗口
    openChat(contactId, isGroup, instance) {
      this.keywords = "";
      let conversation = instance.findConversation(contactId);
      if (!conversation || !conversation.id) {
        // 聊天联系人不存在
        addConversation({
          contactId: contactId,
          isGroup: isGroup
        }).then(res => {
          if (res.data.code === 0) {
            instance.appendContact(res.data.data)
          }
        })
      }
      instance.changeContact(contactId);
    },
    // 切换聊天窗口时要检测那些消息未读
    handleChangeContact(contact, instance) {
      if (contact && contact.id === 'system') {
        instance.updateSimpleContact({
          id: 'system',
          unread: 0
        })
        this.systemUnread = 0;
        const {IMUI} = this.$refs;
        this.initMenus(IMUI);
        return
      }

      let currentContact = instance.currentContact;
      if (!currentContact.id) {
        if (contact.sendMessage) {
          //当前聊天联系人不存在
          addConversation({
            contactId: contact.id,
            isGroup: contact.isGroup
          }).then(res => {
            if (res.data.code === 0) {
              instance.appendContact(res.data.data)
              instance.changeContact(contact.id);
            }
          })
        }
        return;
      }

      if (!contact.id) {
        this.currentChat = {}
        return;
      }

      instance.updateContact({
        id: contact.id,
        unread: 0
      });
      // 将未读的总数减去当前选择的聊天
      let count = this.unread - contact.unread
      this.unread = count < 0 ? 0 : count;
      const {IMUI} = this.$refs;
      this.initMenus(IMUI);
      // 聊天记录列表恢复到最初第一页
      this.params.page = 1;
      this.displayName = contact.displayName;
      this.oldName = contact.displayName;
      this.currentChat = contact;
      // 如果是群聊，拉取群成员列表，如果刚才拉取过，现在就不用拉取了
      if (contact.isGroup && this.groupId !== contact.id) {
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
      let messages = IMUI.getMessages(contact.id);
      for (var i = 0; messages.length > i; i++) {
        if (
            messages[i].isRead === false &&
            messages[i].fromUser.id !== this.user.id
        ) {
          data.push(messages[i]['messageId']);
        }
      }
      // 如果有未读的消息，需要将消息修改为已读
      if (data.length > 0 || contact.unread > 0) {
        readMessage({
          conversationId: contact.conversationId,
          isGroup: contact.isGroup
        }).then(res => {
          if (res.data.code === 0) {
            this.setLocalMsgIsRead(data);
          }
        });
        /*readMessage({
          isGroup: contact.isGroup,
          toContactId: contact.id,
          messages: data,
          fromUser: contact.id
        }).then(res => {
          if (res.data.code === 0) {
            this.setLocalMsgIsRead(data);
          }
        });*/
      }
      instance.closeDrawer();
    },
    uploadVideo(e) {
      // 如果开启了群聊禁言或者关闭了单聊权限，就不允许发送消息 TODO
      if ((!this.globalConfig.chatInfo.simpleChat && this.isGroup === false) || !this.nospeak()) {
        this.$message.error(this.noSimpleTips);
        return false;
      }
      let file = e.srcElement.files[0];
      let url = URL.createObjectURL(file);
      //经测试，发现audio也可获取视频的时长
      let audioElement = new Audio(url);
      let duration;
      audioElement.addEventListener("loadedmetadata", function (_event) {
        duration = audioElement.duration;
      });
      let message = {
        content: url,
        fromUser: this.user,
        id: utils.generateRandId(),
        sendTime: getTime(),
        status: 'going',
        toContactId: this.currentChat.id,
        type: 'video',
        extends: {
          duration: duration
        }//录音时长
      }
      this.diySendMessage(message, file);
      // 将选择的文件清空
      this.$refs.uploadVideo.value = '';
    },
    // 发送语音消息
    sendVoice(duration, file) {
      // 如果开启了群聊禁言或者关闭了单聊权限，就不允许发送消息
      if ((!this.globalConfig.chatInfo.simpleChat && this.isGroup === false) || !this.nospeak()) {
        this.$message.error(this.noSimpleTips);
        return false;
      }
      let message = {
        content: URL.createObjectURL(file),
        fromUser: this.user,
        id: utils.generateRandId(),
        sendTime: getTime(),
        status: 'going',
        toContactId: this.currentChat.id,
        type: 'voice',
        isPlay: 0,
        extends: {
          duration: duration
        }//录音时长
      }
      this.VoiceStatus = false;
      this.diySendMessage(message, file);
    },
    removeContact(id) {
      const {IMUI} = this.$refs;
      const contact = IMUI.getCurrentContact();
      if (contact.id === id) {
        IMUI.changeContact(null);
      }
      IMUI.clearMessages(id)
      IMUI.removeContact(id);

      let contacts = IMUI.getContacts();
      contacts = contacts.filter((contact) => contact.id !== id)
      IMUI.initFriends(contacts)
    },
    //自定义消息的发送
    diySendMessage(message, file) {
      const {IMUI} = this.$refs;
      IMUI.appendMessage(message, true);
      this.handleSend(message, function () {
        let replaceMessage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
          status: "succeed"
        };
        IMUI.updateContact({
          id: message.toContactId,
          lastContent: IMUI.lastContentRender(message),
          lastSendTime: message.sendTime
        });
        IMUI.CacheDraft.remove(message.toContactId);
        IMUI.updateMessage(Object.assign(message, replaceMessage));
      }, file);
    },
    // 禁言时禁止发送消息
    nospeak() {
      if (this.isGroup && this.currentChat.setting.nospeak > 0) {
        if (this.currentChat.setting.nospeak === true && this.currentChat.role === 2) {
          return true;
        } else return this.currentChat.setting.nospeak === 2 && this.currentChat.role === 1;
      } else {
        return true;
      }
    },
    // 发送聊天消息
    handleSend(message, next, file) {
      const {IMUI} = this.$refs;
      message.isGroup = this.isGroup;
      this.curFile = file;
      if (file) {
        // 如果是文件选择文件上传接口
        let formdata = new FormData();
        // 判断文件如果大于5M就删除该聊天消息
        if (file.size > (5 * 1024 * 1024)) {
          IMUI.removeMessage(message.id);
          return this.$message.error("上传的内容不等大于5MB！");
        }
        formdata.append("file", file);
        formdata.append("message", JSON.stringify(message));
        // formdata.append("message", message);
        sendfileMessage(formdata)
            .then(res => {
              if (res.data.code === 0) {
                IMUI.setEditorValue("");
                IMUI.updateMessage(res.data.data);
                next();
              } else {
                next({status: "failed"});
              }
            })
            .catch(error => {
              next({status: "failed"});
            });
      } else {
        sendChatMessage(message)
            .then(res => {
              if (res.data.code === 0) {
                IMUI.setEditorValue("");
                IMUI.updateMessage(res.data.data);
                next();
              } else {
                next({status: "failed"});
              }
            })
            .catch(error => {
              next({status: "failed"});
            });
      }
    },
    // 拉取聊天记录
    handlePullMessages(contact, next, instance) {
      let params = this.params;
      params.isGroup = contact.isGroup;
      params.toContactId = contact.id;
      params.conversationId = contact.conversationId;
      getChatMessages(params).then(res => {
        this.params.page++;
        let isEnd = false;
        let messages = res.data.data.resultList;
        if (messages.length > 0) {
          messages.forEach((message, index) => {
            if (message.type === 'system') {
              messages[index]['type'] = 'text'
            }
          })
        }
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
    // 发布公告
    publishNotice() {
      this.noticeBox = false;
      publishNotice({groupId: this.groupId, notice: this.notice}).then(res => {
        if (res.data.code === 0) {
          const {IMUI} = this.$refs;
          IMUI.updateContact({
            id: this.groupId,
            notice: this.notice
          });
          this.$message({
            type: "success",
            message: "发布成功!"
          });
        }
      });
    },
    // 查看
    openNotice() {
      let notice = "<div style='white-space: pre;'>" + this.notice + "</div>"
      this.$alert(notice, "群公告", {
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      });
    },
    // 打开创建团队的窗口
    openCreateGroup() {
      this.isAdd = true;
      this.dialogTitle = "创建群聊";
      this.createChatBox = true;
    },
    handleClickGroupName(contact) {
      if (contact && contact.role !== 4) {
        this.isEdit = true
      }
    },
    // 打开添加群成员的窗口
    openAddGroupUser() {
      let user_ids = utils.arrayToString(this.groupUser, "userId");
      this.isAdd = false;
      this.userIds = user_ids;
      this.dialogTitle = "添加群成员";
      this.createChatBox = true;
    },
    // 添加群成员或者创建群聊
    manageGroup(selectUid, isAdd, groupName) {
      this.createChatBox = false;
      let num = 500;
      if (isAdd) {
        if ((selectUid.length + this.groupUser.length) > num && num > 0) {
          return this.$message.error("群成员不能大于" + num + "人！");
        }
        createGroup({userIds: selectUid, id: this.groupId, name: groupName}).then((res => {
          const data = res.data;
          const {IMUI} = this.$refs;
          if (res.data.code === 0) {
            // 添加联系人
            IMUI.appendContact(data);
            // 切换到该联系人
            IMUI.changeContact(data.id);
          }
        }))
      } else {
        if (selectUid.length > num && num > 0) {
          return this.$message.error("群成员不能大于" + num + "人！");
        }
        addGroupUser({groupId: this.groupId, userIds: selectUid}).then(res => {

        });
      }
    },
    // 封装循环请求
    fn(formData) {
      return new Promise((resolve, reject) => {
        sendChatMessage(formData)
            .then(res => {
              if (res.data.code === 0) {
                resolve(res);
              } else {
                this.$message.error(res.data.message);
              }
            })
            .catch(err => {
            });
      });
    },
    async test(formData) {
      return await this.fn(formData);
    },
    // 转发消息
    forwardUser(forwardList) {
      if (forwardList.length > 5) {
        return this.$message.error("转发的人数不能超过5人！");
      }
      this.forwardBox = false;
      let message = this.currentMessage;

      forwardList.forEach(forward => {
        // 构建转发的消息
        let forwardMessage = {}
        forwardMessage.id = utils.generateRandId();
        forwardMessage.status = "successd";
        forwardMessage.sendTime = getTime();
        forwardMessage.fromUser = this.user;
        forwardMessage.isGroup = forward.group
        forwardMessage.type = message.group
        forwardMessage.content = message.content
        forwardMessage.toContactId = forward.contactId
        forward.message = forwardMessage
      })

      let forwardData = {
        messageId: message.messageId,
        forwards: forwardList
      }
      forwardMessage(forwardData).then(res => {
        if (res.data.code === 0) {
          // 添加消息
          const {IMUI} = this.$refs;
          let messages = res.data.data;
          messages.forEach(message => {
            IMUI.appendMessage(message)
            let conversation = IMUI.getConversations(message.toContactId);
            if (!conversation || !conversation.id) {
              addConversation({
                contactId: message.toContactId,
                isGroup: message.isGroup
              }).then(res => {
                if (res.data.code === 0) {
                  IMUI.appendContact(res.data.data)
                }
              })
            }
          })
        }
      })
    },
    // 获取群聊成员列表
    getGroupUserList(group_id) {
      getGroupUsers(group_id).then(res => {
        if (res.data.code === 0) {
          let data = res.data.data;
          this.groupUser = data;
          this.groupUserCount = data.length;
        }
      });
    },
    // 修改群组的名称
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
        const {IMUI} = this.$refs;
        updateGroupName({
          groupId: contact.id,
          name: this.displayName
        }).then(res => {
          if (res.data.code === 0) {
            // 更新群名
            // const data = {
            //   id: utils.generateRandId(),
            //   type: "event",
            //   //使用 jsx 时 click必须使用箭头函数（使上下文停留在vue内）
            //   content: (
            //       <div>
            //     <span>
            //       你修改了群名为{this.displayName}
            //     </span>
            //       </div>
            //   ),
            //   toContactId: contact.id,
            //   sendTime: getTime()
            // };
            // IMUI.appendMessage(data, true);
            IMUI.updateContact({
              id: contact.id,
              displayName: this.displayName
            });
            IMUI.updateSimpleContact({
              id: contact.id,
              displayName: this.displayName
            })
          }
        });
      }
      this.isEdit = false;
    },
    // 关闭搜索结果
    closeSearch() {
      let that = this;
      setTimeout(function () {
        that.searchResult = false;
      }, 300);
    },
    // 搜索联系人
    searchContact(contacts) {
      if (this.keywords !== "") {
        this.searchList = utils.search_object(
            contacts,
            ["displayName"],
            this.keywords
        );
      }
    },
    // 将本地消息设置为已读
    setLocalMsgIsRead(message) {
      const {IMUI} = this.$refs;
      for (let i = 0; message.length > i; i++) {
        /*const data = {
          id: message[i]["id"],
          isRead: 1,
          status: "succeed",
          content: message[i]["content"] + " "
        };
        IMUI.updateMessage(data);*/
        IMUI.updateMessageRead(message[i])
        IMUI.forceUpdateMessageId(message[i])
      }
    },
    // 播放消息声音
    popNotice(message) {
      let that = this;
      const {IMUI} = this.$refs;
      if (Notification.permission === "granted") {
        let name = message.fromUser.displayName || message.fromUser.realname;
        let content = IMUI.lastContentRender(message);
        let notification = new Notification("收到一条新消息", {
          body: name + "：" + content,
          icon: message.fromUser.avatar
        });
        notification.onclick = function (e) {
          that.$nextTick(() => {
            setTimeout(() => {
              //具体操作
            }, 500);
          });
          //可直接打开通知notification相关联的tab窗
          window.focus();
          notification.close();
        };
      } else {
        const audio = document.getElementById("chatAudio");
        // 从头播放
        audio.currentTime = 0;
        audio.play();
      }
    },
    // 接收消息重新渲染
    receiveMsg(message) {
      const {IMUI} = this.$refs;
      const contact = IMUI.getCurrentContact();
      let findConversation = IMUI.findConversation(message.toContactId);
      // 如果收到消息是当前窗口的聊天，需要将消息修改为已读
      if ((contact.id === message.fromUser.id && !message.isGroup  || (contact.id === message.toContactId && message.isGroup && this.user.id !== message.fromUser.id)) && contact.id !== 'system') {
        let data = [];
        data.push(message);
        readMessage({
          conversationId: contact.conversationId,
          to: this.user.id,
          isGroup: contact.isGroup,
          from: message.fromUser.id
        });
      } else {
        const fromContact = message.isGroup ? findConversation : IMUI.findConversation(message.fromUser.id);
        if (!fromContact) {
          //如果聊天窗口不存在，又收到消息 说明刚好聊天窗口被删除了 又未重新加载
          this.getImChats()
          return
        }
        // 如果不是自己的消息 并且开启了消息提示 未读数才需要++
        if (this.user.id !== message.fromUser.id && fromContact.isNotice && !message.isRead) {
          this.unread++;
          this.initMenus(IMUI);
        }
      }
      if (this.user.id === message.toContactId) {
        message.toContactId = message.fromUser.id;
      }

      IMUI.updateContact({
        id: message.toContactId,
        lastSendTime: message.sendTime
      })

      IMUI.appendMessage(message, true);
    },
    openMessageBox() {
      this.messageBox = true;
      // 组件重置
      this.componentKey += 1;
    },
    // 打开设置中心
    openSetting() {
      const {IMUI} = this.$refs;
      IMUI.changeMenu("setting");
    },
    handleCommand(e) {
      if (e === 'addGroup') {
        this.openCreateGroup();
      } else {
        this.addFriendBox = true;
      }
    },
    // 接收webrtc组件的消息
    rtcMsg(e) {
      let iceCandidate = '';
      let msg_id = '';
      let main_id = '';
      if (this.wsData) {
        msg_id = this.wsData.msg_id ?? '';
        main_id = this.wsData.id ?? '';
      }
      let api = true;
      switch (e.event) {
        case "calling":
          main_id = utils.generateRandId();
          break;
        case 'hangup':
          if (e.code == 907) {
            this.$message.error('对方忙线中');
          }
          if (!e.isbtn) {
            api = false;
          }
          this.wsData = '';
          this.webrtcLock = false; //解除通话锁定
          break;
        case 'iceCandidate':
          let niceCandidate = {}
          niceCandidate['candidate'] = e['iceCandidate']['candidate']
          niceCandidate['sdpMLineIndex'] = e['iceCandidate']['sdpMLineIndex']
          niceCandidate['sdpMid'] = e['iceCandidate']['sdpMid']
          iceCandidate = JSON.stringify(niceCandidate)
          break;
        case "mediaDevices":
          api = false;
          break;
      }
      if (api) {
        this.$api.imApi.sendToMsg({
          id: main_id,
          msg_id: msg_id,
          toContactId: this.caller.id,
          type: this.is_video ? 1 : 0,
          event: e.event,
          status: e.status ?? '',
          code: e.code ?? '',
          callTime: e.callTime ?? '',
          sdp: e.sdp ?? '',
          iceCandidate: iceCandidate,
        }).then(res => {
          if (res.code == 0) {
            if (e.event == 'calling') {
              this.wsData = res.data;
              Lockr.set('wsData', res.data);
              this.receiveMsg(res.data);
            }
          }
          if (res.data.extends.code == '907') {
            this.$message.error('对方不在线');
          }
        })
      }
    },
    // 退出聊天室
    logout() {
      this.$confirm("你确定要退出聊天室吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
          .then(() => {
            this.$store.dispatch("LogOut").then(() => {
              this.$router.push({path: "/login"});
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消退出"
            });
          });
    }
  }
};
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
    padding: 10px;
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
  border-left: 1px solid #e6e6e6;
  height: 100%;
  white-space: normal;

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
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
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
  font-family: Microsoft YaHei;
  font-size: 14px;
}

.group-notice {
  height: 140px;

}


::v-deep .group-user-body .el-scrollbar__wrap {
  overflow-y: scroll;
  overflow-x: hidden;
}

::v-deep .lemon-vessel__right {
  color: #606066;
  font-family: Microsoft YaHei;
  font-size: 14px;
}

::v-deep .lemon-container__title {
  color: #606066;
  font-family: Microsoft YaHei;
  font-size: 14px;
}

::v-deep .lemon-messages {
  color: #606066;
  font-family: Microsoft YaHei;
  font-size: 14px;
}


hr {
  height: 1px;
  background-color: #e6e6e6;
  border: none;
  margin-top: 0;
}

.group-user {
  min-height: 300px;
  overflow: auto;
}

//自定义emoji大小
::v-deep .lemon-message__content {
  img {
    //width: 24px !important;
    //height: 20px !important;
  }
}

::v-deep .lemon-editor__emoji-item {
  width: 30px !important;
}

/deep/ .contact-fixedtop-box .el-input__inner:focus {
  border: 1px solid #888;

}

/deep/ .contact-fixedtop-box .el-button--default {
  background: #fffefe;
}

/deep/ .contact-fixedtop-box .el-button--default:focus,
.contact-fixedtop-box .el-button--default:hover {
  border-color: #888;
  color: #888;
}

/deep/ .lemon-editor__tool {
  border-top: 1px solid #e6e6e6;
}


/deep/ .el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover {
  background-color: rgba(136, 136, 136, 0.25);
  color: #fffefe;
}

/deep/ .lemon-container__title {
  border-bottom: 1px solid #e6e6e6 !important;
  font-family: Microsoft YaHei !important;
}

/deep/ .el-dialog__body {
  color: #606066;
}

::v-deep .preview-dialog {
  .el-dialog .el-dialog__body {
    padding-top: 10px;
    max-height: 600px;
    overflow-y: hidden !important;
  }
}

</style>
