<template>
</template>

<script>
import { Manager } from "socket.io-client";
import { getSocketIoConnection } from "@/api/chat";
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
    //获取长连接连接.
    getWsConnection() {
      getSocketIoConnection().then((res) => {
          if (res.data.code === 0) {
            this.socketConnection = res.data.data
          } else {
            this.$message.warning("连接服务器失败, 请稍后再试")
            console.log(res.data)
          }
      })
    },
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

      this.getWsConnection();
      if (!this.socketConnection) {
        this.$message.error("连接服务器失败, 请稍后再试")
        return
      }
      let host = this.socketConnection.connectUrl;
      let contentPath = this.socketConnection.context;
      let authorization = this.socketConnection.authorization;
      const manager = new Manager(host, {
        reconnectionDelayMax: 10000,
        autoConnect: false,
      })
      this.websocket = manager.socket(contentPath, {
        auth: {
          Authorization: authorization
        }
      })
      //连接
      this.websocket.connect();
      Vue.prototype.$websocket = this.websocket;
    },
  },
  created() {
    this.initWebSocket()
  }

}


</script>