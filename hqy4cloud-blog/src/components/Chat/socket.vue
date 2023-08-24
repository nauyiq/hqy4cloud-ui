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

            this.websocket.on('privateChat', (eventData) => {
              let data = JSON.parse(eventData)
              data['type'] = 'privateChat'
              this.$store.commit('SET_SOCKET_ACTION', data)
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