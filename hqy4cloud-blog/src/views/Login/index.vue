<template>

  <div id="login">
    <div class="max flex align-center justify-center">
      <div class="icon flex align-center" >
        <i @click="toHome" class="iconfont el-icon-s-home el-home"></i>
        <i @click="toIndex" class="iconfont el-icon-menu"></i>
      </div>
    </div>
    <div class="login-wrap">
      <passwordLogin @getActiveName="getActiveName" v-if="activeName === 'passwordLogin'"></passwordLogin>
      <emailLogin @getActiveName="getActiveName" v-if="activeName === 'emailLogin'"></emailLogin>
      <registry @getActiveName="getActiveName" v-if="activeName === 'registry'"></registry>
      <forgetPassword @getActiveName="getActiveName" v-if="activeName === 'forgetPassword'"></forgetPassword>
    </div>
  </div>
</template>

<script>
import passwordLogin from './component/passwordLogin.vue'
import emailLogin from './component/emailLogin.vue'
import registry from './component/registry.vue'
import forgetPassword from './component/forgetPassword.vue'
import {mapState} from "vuex";
import { checkTokenEnable } from "@/api/user";

export default {
  name: 'Login',
  components:{
    passwordLogin,
    emailLogin,
    registry,
    forgetPassword
  },
  computed: {
    // 监听全局socket消息状态
    ...mapState({
      isToken() {
        return this.$store.getters.access_token;
      }
    }),
  },
  data() {
    return {
      activeName: "passwordLogin",
    };
  },
  created() {
    if (this.isToken) {
      //校验token是否有效
      checkTokenEnable(this.$store.getters.access_token).then(res => {
        this.$message.info("你已经登录了。")
        this.toIndex()
      }).catch(e => {

      })
    }
  },
  methods: {
    getActiveName(value) {
      this.activeName = value
    },
    toIndex () {
      this.$router.push("/index")
    },
    toHome () {
      this.$router.push({path: '/'})
    },
  }
};
</script>

<style lang="scss" scoped>

.iconfont {
  cursor: pointer;
  font-size: 22px;
  color: #888;
  margin-left: 20px;
  transition: all .3s;
  &:hover {
    color: #0b9aff
  }
}

.max {
  width: 100vw;
  height: 100vh;
  .icon {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
  }
}

@media screen and (max-width: 700px) {
  .max {
    width: 100vw;
    height: 100vh;
    .icon {
      position: fixed;
      width: 100%;
      height: 60px;
      top: 10px;
      left: 10px;
      img {
        width: 80px;
        height: auto;
        cursor: pointer;
      }
    }
  }
  .form {
    width: 90%;
  }
}

#login {
  height: 100vh;
  background: linear-gradient(to bottom right, #fffefe, #fffefe);
  overflow: hidden;
}

.login-wrap {
  width: 330px;
  margin: 200px auto auto;
}

</style>
<style >
.el-form-item--medium .el-form-item__content {
  margin-left: 0 !important;
}
</style>