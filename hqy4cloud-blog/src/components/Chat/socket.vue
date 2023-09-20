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
      }
    })
  },
  methods: {
    //初始化长连接
    initWebSocket() {
      if (this.isToken) {
        getSocketIoConnection().then((res) => {
          if (res.data.code === 0) {
            let connection =  res.data.data
            let host = connection.connectUrl;
            let contentPath = connection.context;
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

            //listen socket.io readMessages event.
            this.websocket.on('readMessages', (eventData) => {
              const data = JSON.parse(eventData)
              const event = {
                "event": 'readMessages',
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
              const data = JSON.parse(eventData)
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

    if (this.websocket) {
      // im私聊事件

    }



  }

}


</script>