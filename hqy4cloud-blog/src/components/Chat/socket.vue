<template>
</template>

<script>
import { getSocketIoConnection } from "@/api/im/chat";
import {mapState} from "vuex";
import Vue from 'vue'

export default {
  name: "socket",
  data() {
    return {
      websocket: null,
      socketConnection: {}
    }
  },

  computed: {
    ...mapState({
      isToken() {
        return this.$store.getters.access_token;
      },
      socketAction: state => state.user.socketAction,
    })
  },
  methods: {
    //初始化长连接
    initWebSocket() {
      if (this.isToken) {
        getSocketIoConnection().then((res) => {
          if (res.data.code === 0) {
            console.log(res.data.data)
            let connection =  res.data.data
            let host = connection.connectUrl;
            let contentPath = connection.contextPath;
            let authorization = connection.authorization;
            const io = require("socket.io-client");

            this.websocket = io(host ,{
              reconnectionDelayMax: 50000,
              path: contentPath,
              autoConnect: false,
              query: {
                "Authorization": authorization
              }
            });
            this.websocket.connect();

            //listen socket.io privateChat event.
            this.websocket.on('privateChat', (eventData) => {
              const data = JSON.parse(eventData)
              const event = {
                "event": 'privateChat',
                "data": data
              }
              setTimeout(() => {
                this.$store.commit('SET_SOCKET_ACTION', event)
              }, 200)
            })

            //listen socket.io groupChat event.
            this.websocket.on('groupChat', (eventData) => {
              const data = JSON.parse(eventData)
              const event = {
                "event": 'groupChat',
                "data": data
              }
              setTimeout(() => {
                this.$store.commit('SET_SOCKET_ACTION', event)
              }, 200)
            })

            //listen socket.io readMessages event.
            this.websocket.on('readMessages', (eventData) => {
              const data = JSON.parse(eventData)
              const event = {
                "event": 'readMessages',
                "data": data
              }
              this.$store.commit('SET_SOCKET_ACTION', event)
            })

            //listen socket.io readMessages event.
            this.websocket.on('undoMessage', (eventData) => {
              const data = JSON.parse(eventData)
              const event = {
                "event": 'undoMessage',
                "data": data
              }
              this.$store.commit('SET_SOCKET_ACTION', event)
            })

            //listen socket.io setChatTop event.
            this.websocket.on('setChatTop', (eventData) => {
              const data = JSON.parse(eventData)
              const event = {
                "event": 'setChatTop',
                "data": data
              }
              this.$store.commit('SET_SOCKET_ACTION', event)
            })

            //listen socket.io setChatTop event.
            this.websocket.on('groupNoticeChange', (eventData) => {
              const data = JSON.parse(eventData)
              const event = {
                "event": 'groupNoticeChange',
                "data": data
              }
              this.$store.commit('SET_SOCKET_ACTION', event)
            })

            //listen socket.io removeGroupMember event.
            this.websocket.on('removeGroupMember', (eventData) => {
              const data = JSON.parse(eventData)
              const event = {
                "event": 'removeGroupMember',
                "data": data
              }
              this.$store.commit('SET_SOCKET_ACTION', event)
            })

            //listen socket.io removeGroupMember event.
            this.websocket.on('exitGroup', (eventData) => {
              const data = JSON.parse(eventData)
              const event = {
                "event": 'exitGroup',
                "data": data
              }
              this.$store.commit('SET_SOCKET_ACTION', event)
            })

            //listen socket.io removeGroupMember event.
            this.websocket.on('deleteGroup', (eventData) => {
              const data = JSON.parse(eventData)
              const event = {
                "event": 'deleteGroup',
                "data": data
              }
              this.$store.commit('SET_SOCKET_ACTION', event)
            })


            //listen socket.io removeGroupMember event.
            this.websocket.on('addGroupMember', (eventData) => {
              const data = JSON.parse(eventData)
              const event = {
                "event": 'addGroupMember',
                "data": data
              }
              this.$store.commit('SET_SOCKET_ACTION', event)
            })


            //listen socket.io setChatTop event.
            this.websocket.on('setChatNotice', (eventData) => {
              const data = JSON.parse(eventData)
              const event = {
                "event": 'setChatNotice',
                "data": data
              }
              this.$store.commit('SET_SOCKET_ACTION', event)
            })

            //listen socket.io appendChat event.
            this.websocket.on('appendChat', (eventData) => {
              const data = JSON.parse(eventData)
              const event = {
                "event": 'appendChat',
                "data": data
              }
              this.$store.commit('SET_SOCKET_ACTION', event)
            })



            //listen socket.io contactNameChange event.
            this.websocket.on('contactNameChange', (eventData) => {
              const data = JSON.parse(eventData)
              const event = {
                "event": 'contactNameChange',
                "data": data
              }
              this.$store.commit('SET_SOCKET_ACTION', event)
            })


            //listen socket.io friendApplication event.
            this.websocket.on('friendApplication', (eventData) => {
              let data;
              if (eventData) {
                data = JSON.parse(eventData)
              } else {
                data = {}
              }
              const event = {
                "event": 'friendApplication',
                "data": data
              }
              this.$store.commit('SET_SOCKET_ACTION', event)
            })
            Vue.prototype.$websocket = this.websocket;
          } else {
            this.$message.warning("连接服务器失败, 请稍后再试")
            console.log(res.data)
          }
        })
      }
    },
  },
  created() {
    this.initWebSocket()
    window.addEventListener('storage', function (e) {
      if (e.key === 'hongqy-socket_action') {
        const data = JSON.parse(e.newValue);
        if (data.content.event === "logout") {
          window.location.reload()
        }
      }
    })
  },
  watch: {
    socketAction(val) {
      let event = val.event;
      if (event === "logout") {
        this.websocket.disconnect()
      }
    }
  }

}


</script>