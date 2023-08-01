<template>
  <div class="common-layout theme-white">
    <el-container>
      <el-aside width="320px">
        <div class="title-box">
          <el-image :src="logo" class="logo"/>
          <span>{{ title }}</span>
        </div>
        <div class="chat-list">
          <div class="search-box">
            <el-input v-model="chatName" class="w-50 m-2" size="small" placeholder="搜索会话" @keyup="searchChat">
              <template #prefix>
                <i class="el-icon-search el-icon el-input__icon"></i>
              </template>
            </el-input>
          </div>

          <div class="content" :style="{height: leftBoxHeight+'px'}">
            <el-row v-for="chat in chatList" :key="chat.chat_id">
              <div :class="chat.chat_id === activeChat.chat_id?'chat-list-item active':'chat-list-item'"
                   @click="changeChat(chat)">
                <el-image :src="chat.icon" class="avatar"/>
                <span class="chat-title-input" v-if="chat.edit">
              <el-input v-model="tmpChatTitle" size="small" placeholder="请输入会话标题"/>
            </span>
                <span v-else class="chat-title">{{ chat.title }}</span>
                <span class="btn btn-check" v-if="chat.edit || chat.removing">
                <i class="el-icon-check el-icon" @click="confirm($event, chat)"></i>
                <i class="el-icon-close el-icon" @click="cancel($event, chat)"></i>
              </span>
                <span class="btn" v-else>
                <i class="el-icon-edit-outline el-icon" title="编辑" @click="editChatTitle($event, chat)"></i>
                <i class="el-icon-delete el-icon" title="删除会话" @click="removeChat($event, chat)"></i>
              </span>
              </div>
            </el-row>
          </div>
        </div>

        <div class="tool-box">
          <el-dropdown :hide-on-click="true" class="user-info" trigger="click" v-if="isLogin">
                        <span class="el-dropdown-link">
                          <el-image :src="loginUser.avatar"/>
                          <span class="username">{{ loginUser.nickname }}</span>
                          <i class="el-icon-arrow-down el-icon"></i>
                        </span>
            <template #dropdown>
              <el-dropdown-menu style="width: 315px;">
<!--                <el-dropdown-item @click="showConfig">
                  <i class="el-icon-s-tools el-icon"></i>
                  <span>聊天设置</span>
                </el-dropdown-item>-->

<!--                <el-dropdown-item @click="showPasswordDialog=true">
                  <i class="iconfont icon-password"></i>
                  <span>修改密码</span>
                </el-dropdown-item>-->

<!--                <el-dropdown-item @click="showBindMobileDialog = true">
                  <i class="el-icon-mobile-phone el-icon"></i>
                  <span>绑定手机号</span>
                </el-dropdown-item>-->

<!--                <el-dropdown-item @click="showRewardDialog = true">
                  <i class="el-icon-present el-icon"></i>
                  <span>加入众筹</span>
                </el-dropdown-item>-->

<!--                <el-dropdown-item @click="showRewardVerifyDialog = true">
                  <i class="el-icon-s-claim el-icon"></i>
                  <span>众筹核销</span>
                </el-dropdown-item>-->

                <el-dropdown-item @click="clearAllChats">
                  <i class="el-icon-delete el-icon"></i>
                  <span>清除所有会话</span>
                </el-dropdown-item>

<!--                <el-dropdown-item @click="logout">
                  <i class="iconfont icon-logout"></i>
                  <span>注销</span>
                </el-dropdown-item>-->

                <el-dropdown-item>
                  <i class="iconfont icon-github"></i>
                  <span>
                    powered by
                    <el-link type="primary" href="https://github.com/yangjian102621/chatgpt-plus" target="_blank">chatgpt-plus-v3</el-link>
                 </span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-aside>
      <el-main v-loading="loading" element-loading-background="rgba(122, 122, 122, 0.3)">
        <div class="chat-head">
          <div class="chat-config">
            <span class="role-select-label">聊天角色：</span>
            <el-select v-model="roleId" filterable placeholder="角色" class="role-select">
              <el-option
                  v-for="item in roles"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
              >
                <div class="role-option">
                  <el-image :src="item.icon"></el-image>
                  <span>{{ item.name }}</span>
                </div>
              </el-option>
            </el-select>

            <el-select v-model="model" placeholder="模型">
              <el-option
                  v-for="item in models"
                  :key="item"
                  :label="item.toUpperCase()"
                  :value="item"
              />
            </el-select>
            <el-button type="primary" @click="newChat">
              <i class="el-icon-plus el-icon"></i>
              新建会话
            </el-button>

          </div>
        </div>

        <div class="right-box" :style="{height: mainWinHeight+'px'}">
          <div>
            <div id="container">
              <div class="chat-box" id="chat-box" :style="{height: chatBoxHeight+'px'}">
                <div v-for="item in chatData" :key="item.id">
                  <chat-prompt
                      v-if="item.type==='prompt'"
                      :icon="item.icon"
                      :created-at="dateFormat(item['created_at'])"
                      :tokens="item['tokens']"
                      :model="model"
                      :content="item.content"/>
                  <chat-reply v-else-if="item.type==='reply'"
                              :icon="item.icon"
                              :org-content="item.orgContent"
                              :created-at="dateFormat(item['created_at'])"
                              :tokens="item['tokens']"
                              :content="item.content"/>
                </div>
              </div><!-- end chat box -->

              <div class="re-generate">
                <div class="btn-box">
                  <el-button type="info" v-if="showStopGenerate" @click="stopGenerate" plain>
                    <i class="el-icon-video-pause el-icon"></i>
                    停止生成
                  </el-button>

                  <el-button type="primary" v-if="showReGenerate" @click="reGenerate" plain>
                    <i class="el-icon-refresh-right el-icon"></i>
                    重新生成
                  </el-button>
                </div>
              </div>

              <div class="input-box">
                <div class="input-container">
                  <el-input
                      ref="text-input"
                      v-model="prompt"
                      v-on:keydown="inputKeyDown"
                      autofocus
                      type="textarea"
                      :rows="2"
                      placeholder="按 Enter 键发送消息，使用 Ctrl + Enter 换行"
                  />
                  <span class="send-btn">
                    <el-button @click="sendMessage">
                      <i class="el-icon-s-promotion el-icon"></i>
                    </el-button>
                  </span>
                </div>
              </div><!-- end input box -->

            </div><!-- end container -->
          </div><!-- end loading -->
        </div>
      </el-main>
    </el-container>

<!--        <config-dialog v-if="isLogin" :show="showConfigDialog" :models="models" @hide="showConfigDialog = false"
                       @update-user="updateUser"/>-->

    <!--    <password-dialog v-if="isLogin" :show="showPasswordDialog" @hide="showPasswordDialog = false"
                         @logout="logout"/>-->

    <!--    <bind-mobile v-if="isLogin" :show="showBindMobileDialog" :mobile="loginUser.mobile"
                     @hide="showBindMobileDialog = false"/>-->

    <!--    <reward-verify v-if="isLogin" :show="showRewardVerifyDialog" @hide="showRewardVerifyDialog = false"/>-->

<!--    <el-dialog
        v-model="showRewardDialog"
        :show-close="true"
        custom-class="donate-dialog"
        width="400px"
        top="5vh"
        title="参与众筹"
    >
      <el-alert type="info" :closable="false">
        <p>您好，ChatGPT-Plus 项目目前已经运行了快半年了，一直免费给大家使用的。然而免费服务始终难以维持，服务器即将到期，免费的
          API KEY 也全部用完了，因此我们准备开启众筹模式，只需要打赏9.9元，就可以兑换 100 次对话，以此来覆盖我们的 OpenAI
          账单和服务器的费用。</p>
      </el-alert>
      <p>
        <el-image :src="rewardImg"/>
      </p>
    </el-dialog>-->
  </div>
</template>


<script>
import {dateFormat, randString, removeArrayItem, renderInputText, UUID} from "@/utils/libs";
import 'highlight.js/styles/a11y-dark.css'
import hl from "highlight.js";
import Clipboard from "clipboard";
import { loadUserRoles, loadChatgptConfig, loadChatgptList, getSocketIoConnection, getChatTokens, loadChatHistory, uploadChat, deleteChat, clearChatgpt, stopGenerate} from "@/api/chat";
import { Manager } from "socket.io-client";
import { mapState } from "vuex";
import chatPrompt from './component/ChatPrompt.vue'
import chatReply from './component/ChatReply.vue'

export default {
  name: 'Chat',
  components: {
    chatPrompt, chatReply
  },
  computed: {
    ...mapState({
      loginUser: state => state.user.userInfo
    })
  },
  mounted() {
    this.isLogin = this.$store.getters.access_token;
    if (!this.isLogin) {
      this.$message.warning("请先登录再使用chatgpt功能")
      this.$router.push({path: '/login'})
    } else {
      this.resizeElement()
      // 加载角色列表
      loadUserRoles().then((res) => {
        this.roles = res.data;
        this.roleId = this.roles[0]['id'];
        // 获取会话列表
        loadChatgptList().then((res) => {
          this.chatList = res.data
          this.allChats = res.data;
        })
        // 创建新的会话
        this.newChat();
      }).catch((e) => {
        console.log(e)
        this.$message.error('获取聊天角色失败')
      })

      // 加载系统配置
      loadChatgptConfig().then((res) => {
        this.title = res.data.title
        this.models = res.data.models
      }).catch(e => {
        this.$message.error("加载系统配置失败: " + e.message)
      })

      const clipboard = new Clipboard('.copy-reply');
      clipboard.on('success', () => {
        this.$message.success('复制成功！');
      })

      clipboard.on('error', () => {
        this.$message.error('复制失败！');
      })

    }
  },
  data() {
    return {
      title: 'ChatGPT',
      models: [],
      model: 'gpt-3.5-turbo',
      logo: 'images/chatgpt.png',
      rewardImg: 'images/reward.png',
      chatData: [],
      allChats: [],
      chatList: [],
      activeChat: {},
      mainWinHeight: 0,
      chatBoxHeight: 0,
      leftBoxHeight: 0,
      loading: true,
      loginUser: {},
      roles: [],
      roleId: 0,
      newChatItem: {},
      showConfigDialog: false,
      showPasswordDialog: false,
      showBindMobileDialog: false,
      showRewardDialog: false,
      showRewardVerifyDialog: false,
      prompt: '',
      // 停止生成
      showStopGenerate: false,
      // 重新生成
      showReGenerate: false,
      // 主动关闭
      activelyClose: true,
      socket: {},
      canSend: true,
      lineBuffer: '',
      previousText: '',
      chatName: '',
      curOpt: '',
      tmpChatTitle: '',
      isLogin: false,
    }
  },
  methods: {
    resizeElement() {
      this.mainWinHeight = window.innerHeight - 51;
      this.chatBoxHeight = window.innerHeight - 51 - 82 - 38;
      this.leftBoxHeight = window.innerHeight - 43 - 47 - 45;
    },
    newChat() {
      // 已有新开的会话
      if (this.newChatItem !== null && this.newChatItem['role_id'] === this.roles[0]['role_id']) {
        return;
      }
      // 获取当前聊天角色图标
      let icon = '';
      this.roles.forEach(item => {
        if (item['id'] === this.roleId) {
          icon = item['icon']
        }
      })
      this.newChatItem = {
        chat_id: "",
        icon: icon,
        role_id: this.roleId,
        model: this.model,
        title: '',
        edit: false,
        removing: false,
      };
      this.activeChat = {}
      this.showStopGenerate = false
      this.showReGenerate = false
      this.connect(null, this.roleId)
    },
    getRoleById(rid) {
      for (let i = 0; i < this.roles.length; i++) {
        if (this.roles[i]['id'] === rid) {
          return this.roles[i];
        }
      }
      return null;
    },
    connect(chat_id, role_id) {
      let isNewChat = false;
      if (!chat_id) {
        isNewChat = true;
        chat_id = UUID();
      }
      // 先关闭已有连接
      if (this.socket !== null) {
        this.activelyClose = true
        this.socket.close();
      }

      const _role = this.getRoleById(role_id);

      //获取ws连接
      getSocketIoConnection().then((res) => {
        let host = res.data.connectUrl;
        let contentPath = res.data.context;
        let authorization = res.data.authorization;

        const manager = new Manager(host, {
          reconnectionDelayMax: 10000,
          autoConnect: false,
        })

        const _socket = manager.socket(contentPath, {
          auth: {
            Authorization: authorization
          }
        })

        //连接事件
        _socket.connect();
        _socket.on("connect", () => {
          // 初始化聊天数据
          this.chatData = [];
          this.previousText = '';
          this.canSend = true;
          this.activelyClose = false;

          // 加载打招呼信息
          if (isNewChat) {
            this.loading = false;
            this.chatData.push({
              type: "reply",
              id: randString(32),
              icon: _role['icon'],
              content: _role['hello_msg'],
              orgContent: _role['hello_msg'],
            })
          } else {
            // 加载聊天记录
            loadChatHistory(chat_id).then((res) => {
              const data = res.data
              if (!data) {
                this.loading = false
                return
              }
              const md = require('markdown-it')({breaks: true});
              for (let i = 0; i < data.length; i++) {
                if (data[i].type === "prompt") {
                  this.chatData.push(data[i]);
                  continue;
                }
                data[i].orgContent = data[i].content;
                data[i].content = md.render(data[i].content);
                this.chatData.push(data[i]);
              }
              this.$nextTick(() => {
                hl.configure({ignoreUnescapedHTML: true})
                const blocks = document.querySelector("#chat-box").querySelectorAll('pre code');
                blocks.forEach((block) => {
                  hl.highlightElement(block)
                })
                document.getElementById('chat-box').scrollTo(0, document.getElementById('chat-box').scrollHeight)
              })
              this.loading = false
            }).catch(e => {
              this.$message.error("加载聊天记录失败: " + e.message)
            })
          }
        });

        _socket.on('disconnect', () => {
          if (this.activelyClose) { // 忽略主动关闭
            return;
          }
          // 停止发送消息
          this.canSend = true;
          this.socket = null;
          this.loading = true;

          //TODO 重连？
        })


        //消息事件
        _socket.on('message', data => {
          if (data.type === 'start') {
            this.chatData.push({
              type: "reply",
              id: randString(32),
              icon: _role['icon'],
              content: ""
            })
          } else if (data.type === 'end') {
            this.canSend = true;
            this.showReGenerate = true;
            this.showStopGenerate = false;
            this.lineBuffer = '';

            // 追加当前会话到会话列表
            if (isNewChat && this.newChatItem !== null) {
              this.newChatItem['title'] = this.previousText;
              this.newChatItem['chat_id'] = chat_id;
              this.chatList.unshift(this.newChatItem);
              this.activeChat = this.newChatItem;
              this.newChatItem = null; // 只追加一次
            }

            // 获取 token
            const reply = this.chatData[this.chatData.length - 1]
            getChatTokens(reply.orgContent, this.model).then(res => {
              reply['created_at'] = new Date().getTime();
              reply['tokens'] = res.data;
              // 将聊天框的滚动条滑动到最底部
              this.$nextTick(() => {
                document.getElementById('chat-box').scrollTo(0, document.getElementById('chat-box').scrollHeight)
              })
            })

          } else {
            this.lineBuffer += data.content;
            const md = require('markdown-it')({breaks: true});
            const reply = this.chatData[this.chatData.length - 1]
            reply['orgContent'] = this.lineBuffer;
            reply['content'] = md.render(this.lineBuffer);

            this.$nextTick(() => {
              hl.configure({ignoreUnescapedHTML: true})
              const lines = document.querySelectorAll('.chat-line');
              const blocks = lines[lines.length - 1].querySelectorAll('pre code');
              blocks.forEach((block) => {
                hl.highlightElement(block)
              })
            })
          }

          // 将聊天框的滚动条滑动到最底部
          this.$nextTick(() => {
            document.getElementById('chat-box').scrollTo(0, document.getElementById('chat-box').scrollHeight)
          })
        })

        this.socket = _socket

      }).catch(e => {
        this.$message.error("获取连接失败: " + e.message)
      })
    },
    // 登录输入框输入事件处理
    inputKeyDown(e) {
      if (e.keyCode === 13) {
        if (e.ctrlKey) { // Ctrl + Enter 换行
          this.prompt += "\n";
          return;
        }
        e.preventDefault();
        this.sendMessage();
      }
    },
    sendMessage() {
      // 发送消息
      if (this.canSend === false) {
        this.$message.warning("AI 正在作答中，请稍后...")
        return
      }
      if (this.prompt.trim().length === 0 || this.canSend === false) {
        return false;
      }

      // 追加消息
      this.chatData.push({
        type: "prompt",
        id: randString(32),
        icon: this.loginUser.avatar,
        content: renderInputText(this.prompt),
        created_at: new Date().getTime(),
      });

      this.$nextTick(() => {
        document.getElementById('chat-box').scrollTo(0, document.getElementById('chat-box').scrollHeight)
      })

      this.canSend = false;
      this.showStopGenerate = true;
      this.showReGenerate = false;
      this.socket.emit("chat", this.prompt);
      this.previousText = this.prompt;
      this.prompt = '';
      return true;
    },
    changeChat(chat) {
      if (this.activeChat['chat_id'] === chat.chat_id) {
        return;
      }
      this.activeChat = chat
      this.newChatItem = null;
      this.roleId = chat.role_id;
      this.model = chat.model;
      this.showStopGenerate = false;
      this.showReGenerate = false;
      this.connect(chat.chat_id, chat.role_id)
    },
    editChatTitle(event, chat) {
      event.stopPropagation();
      chat.edit = true;
      this.curOpt = 'edit';
      this.tmpChatTitle = chat.title;
    },
    confirm(event, chat) {
      event.stopPropagation();
      if (this.curOpt === 'edit') {
        if (this.tmpChatTitle === '') {
          this.$message.error("请输入会话标题！");
          return;
        }
        uploadChat(chat.id, this.tmpChatTitle).then(() => {
          chat.title = this.tmpChatTitle;
          chat.edit = false;
        }).catch(e => {
          this.$message.error("操作失败：" + e.message);
        })
      } else if (this.curOpt === 'remove') {
        deleteChat(chat.chat_id).then(() => {
          this.chatList = removeArrayItem(this.chatList, chat, function (e1, e2) {
            return e1.id === e2.id
          })
          // 重置会话
          this.newChat();
        }).catch(e => {
          this.$message.error("操作失败：" + e.message);
        })

      }
    },
    cancel(event, chat) {
      event.stopPropagation();
      chat.edit = false;
      chat.removing = false;
    },
    removeChat(event, chat) {
      event.stopPropagation();
      chat.removing = true;
      this.curOpt = 'remove';
    },
    showConfig() {
      this.showConfigDialog = true;
    },
    clearAllChats() {
      this.$message.confirm('确认要清空所有的会话历史记录吗?<br/>此操作不可以撤销！',
          '操作提示：', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
            dangerouslyUseHTMLString: true,
            showClose: true,
            closeOnClickModal: false,
            center: true,
          }).then(() => {
        clearChatgpt().then(() => {
          this.$message.success("操作成功！");
          this.chatData = [];
          this.chatList = [];
          this.newChat();
        })
      })
    },
    stopGenerate() {
      this.showStopGenerate = false;
      stopGenerate().then(() => {
        this.canSend = true;
        if (this.previousText !== '') {
          this.showReGenerate = true;
        }
      })
    },
    reGenerate() {
      this.canSend = false;
      this.showStopGenerate = true;
      this.showReGenerate = false;
      const text = '重新生成上述问题的答案：' + this.previousText;
      // 追加消息
      this.chatData.push({
        type: "prompt",
        id: randString(32),
        icon: 'images/avatar/user.png',
        content: renderInputText(text)
      });
      this.socket.emit("chat", text);
    },
    searchChat() {
      if (this.chatName === '') {
        this.chatList = this.allChats
        return
      }
      const items = [];
      for (let i = 0; i < this.allChats.length; i++) {
        if (this.allChats[i].title.toLowerCase().indexOf(this.chatName.toLowerCase()) !== -1) {
          items.push(this.allChats[i]);
        }
      }
      this.chatList = items;
    },
    updateUser(data) {
      this.loginUser.avatar = data.avatar;
      this.loginUser.nickname = data.nickname;
    },
    dateFormat(date) {
      return dateFormat(date)
    }
  }


}



</script>



<style scoped lang="scss">
@import '../../assets/iconfont/iconfont.css';
#app {
  height: 100%;

  .common-layout {
    height: 100%;

    // left side

    .el-aside {
      background-color: #252526;

      .title-box {
        padding: 6px 10px;
        display: flex;
        color: #ffffff;
        font-size: 20px;

        .logo {
          background-color: #ffffff;
          border-radius: 8px;
          width: 35px;
          height: 35px;
        }

        span {
          padding-top: 5px;
          padding-left: 10px;
        }
      }

      .chat-list {
        display: flex;
        flex-flow: column;
        background-color: #28292A;
        border-top: 1px solid #2F3032;
        border-right: 1px solid #2F3032;

        .search-box {
          flex-wrap: wrap;
          padding: 10px 15px;

          .el-input__wrapper {
            background-color: #363535;
            box-shadow: none
          }
        }

        // 隐藏滚动条

        ::-webkit-scrollbar {
          width: 0;
          height: 0;
          background-color: transparent;
        }

        .content {
          //display flex
          //flex-wrap: wrap;
          //flex-direction column
          width: 100%;
          overflow-y: scroll;

          .chat-list-item {
            display: flex;
            width: 100%;
            justify-content: flex-start;
            padding: 8px 12px;
            //border-bottom: 1px solid #3c3c3c
            cursor: pointer;

            &:hover {
              background-color: #343540
            }

            .avatar {
              width: 28px;
              height: 28px;
              border-radius: 50%;
            }

            .chat-title-input {
              font-size: 14px;
              margin-top: 4px;
              margin-left: 10px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              width: 210px;
            }

            .chat-title {
              color: #c1c1c1;
              padding: 5px 10px;
              max-width: 220px;
              font-size: 14px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }

            .btn {
              display: none;
              position: absolute;
              right: 2px;
              top: 16px;
              color #ffffff

              .el-icon {
                margin-right: 8px;
              }
            }
          }

          .chat-list-item.active {
            background-color: #343540;

            .btn {
              display: inline
            }
          }
        }
      }


      .tool-box {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 0 20px 10px 20px;
        border-top: 1px solid #3c3c3c;

        .user-info {
          width: 100%;
          padding-top: 10px;

          .el-tooltip__trigger {
            width: 100%;

            .el-dropdown-link {
              cursor: pointer;
              display: flex;

              .el-image {
                width: 20px;
                height: 20px;
                border-radius: 5px;
              }

              .username {
                display: flex;
                line-height: 22px;
                width: 230px;
                padding-left: 10px;

              }

              .el-icon {
                color: #cccccc;
                line-height: 24px;
              }
            }
          }

        }
      }
    }

    .el-main {
      overflow: hidden;
      --el-main-padding: 0;
      margin: 0;

      .chat-head {
        width: 100%;
        height: 50px;
        background-color: #28292A;

        .chat-config {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          padding-top: 10px;

          .role-select-label {
            color: #ffffff;
          }

          .el-select {
            //max-width 150px;
            margin-right: 10px;
          }

          .role-select {
            max-width: 130px;
          }

          .el-button {
            .el-icon {
              margin-right: 5px;
            }
          }
        }
      }

      .right-box {
        min-width: 0;
        flex: 1;
        background-color: #ffffff;
        border-left: 1px solid #4f4f4f;

        #container {
          overflow: hidden;
          width: 100%;

          ::-webkit-scrollbar {
            width: 0;
            height: 0;
            background-color: transparent;
          }

          .chat-box {
            overflow-y: scroll;
            //border-bottom: 1px solid #4f4f4f

            // 变量定义
            --content-font-size: 16px;
            --content-color: #c1c1c1;

            font-family: 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
            padding: 0 0 50px 0;

            .chat-line {
              font-size: 14px;
              display: flex;
              align-items: flex-start;

            }
          }

          .re-generate {
            position: relative;
            display: flex;
            justify-content: center;

            .btn-box {
              position: absolute;
              bottom: 10px;

              .el-button {
                .el-icon {
                  margin-right: 5px;
                }
              }

            }
          }

          .input-box {
            background-color: #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
            padding: 0 15px;

            .input-container {
              width: 100%;
              margin: 0;
              border: none;
              padding: 10px 0;
              display flex
              justify-content center
              position relative

              .el-textarea {

                .el-textarea__inner::-webkit-scrollbar {
                  width: 0;
                  height: 0;
                }
              }

              .send-btn {
                position: absolute;
                right: 12px;
                top: 20px;

                .el-button {
                  padding: 8px 5px;
                  border-radius: 6px;
                  background: rgb(25, 195, 125);
                  color: #ffffff;
                  font-size: 20px;
                }
              }

            }
          }
        }

        #container::-webkit-scrollbar {
          width: 0;
          height: 0;
        }
      }
    }
  }

  .el-message-box {
    width: 90%;
    max-width: 420px;
  }

  .el-message {
    min-width: 100px;
    max-width: 600px;
  }

  .token-dialog {
    .el-dialog {
      --el-dialog-width: 90%;
      max-width: 400px;

      .el-dialog__body {
        padding: 10px 10px 20px 10px;
      }

      .el-row {
        flex-wrap: nowrap;

        button {
          margin-left: 5px;
        }
      }
    }
  }
}

.el-select-dropdown__wrap {
  .el-select-dropdown__item {
    .role-option {
      display: flex;
      flex-flow: row;
      margin-top: 8px;

      .el-image {
        width: 20px;
        height: 20px;
        border-radius: 50%
      }

      span {
        margin-left: 5px;
        height: 20px;
        line-height: 20px;
      }
    }
  }
}
</style>