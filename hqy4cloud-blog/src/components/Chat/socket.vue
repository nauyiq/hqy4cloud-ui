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
      loginUser: state => state.user.userInfo
    })
  },
  methods: {
    //初始化长连接
    initWebSocket() {
      if (!this.loginUser) {
        this.$message({
          type: 'warning',
          message: '登录过期或未登录，请先登录',
          offset: 60
        })
        this.$router.push("/login")
        return
      }

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
          //连接
          this.websocket.connect();
          Vue.prototype.$websocket = this.websocket;
        } else {
          this.$message.warning("连接服务器失败, 请稍后再试")
          console.log(res.data)
        }
      })

    },
  },
  created() {
    this.initWebSocket()
  }

}


</script>