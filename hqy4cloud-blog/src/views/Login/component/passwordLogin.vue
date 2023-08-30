<template>

  <div id="login">
    <div class="login-wrap">
      <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="login-form"
          size="medium"
          @submit.native.prevent>
        <img class="login_image" src="@/assets/login-0.png"/>
        <div class="title">登录.</div>
        <el-form-item prop="username" class="item-form">
          <el-input v-model="ruleForm.username" auto-complete="off" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password" auto-complete="off" class="item-form" >
          <el-input
              type="password"
              maxlength="20"
              minlength="6"
              v-model="ruleForm.password"
              placeholder="密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" native-type="submit" class="login-btn block">登录</el-button>
        </el-form-item>

        <p class="options">
          <span @click="getActiveName('emailLogin')">- 邮箱登录</span>
          |
          <span @click="getActiveName('forgetPassword')"> 忘记密码</span>
          |
          <span @click="getActiveName('registry')">注册 -</span>
        </p>
      </el-form>
    </div>
  </div>
</template>


<script>
let url;
export default {
  name: 'passwordLogin',
  data() {
    return {
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: "请输入新的密码", trigger: "blur"  }, {min:6, max:20, trigger: "blur", message: "密码的长度必须为6到20"}],
      }
    };
  },
  methods: {
    getActiveName(value) {
      this.$emit('getActiveName', value)
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store.dispatch('LoginByUsername', this.ruleForm)
              .then(() => {
                this.$message.success('登录成功.')
                //获取登录信息
                this.$store.dispatch('GetUserInfo')
                this.$store.dispatch('GetUserSetting')
                setTimeout(()=> {
                  window.location.reload()
                }, 300)
                this.$router.go(-1)
              })
        }
      });
    },
  }
};
</script>

<style lang="scss" scoped>

.options {
  color: #ccc;
  span {
    font-size: 12px;
    display: inline-block;
    margin-top: 6px;
    cursor: pointer;
    transition: all 0.3s;
    text-transform: uppercase;
    &:hover {
      color: #0b9aff;
    }
  }
}


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
    img {
      width: 100px;
      height: auto;
      cursor: pointer;
    }
  }
}
.form {
  width: 600px;
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
.login_image{
  position: absolute;
  top: -80px;
  left: 50%;
  width: 120px;
  height: 95px;
  transform: translate(-50%);
}
.login-wrap {
  width: 330px;
  margin: auto;
  margin-top: 200px;
}
.menu-tab {
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    line-height: 36px;
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    transition: all 0.5s;
    cursor: pointer;
  }
  .current {
    background: rgba(0, 0, 0, 0.1);
  }
}
.login-form {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 400px;
  padding: 40px 50px 24px;
  background: #fff;
  border-radius: 10px;
  text-align: center;
  -webkit-transform: translate(-50%,-50%);
  transform: translate(-50%,-50%);
  -webkit-box-shadow: 0 2px 10px #e6e6e6;
  box-shadow: 0 2px 10px #e6e6e6;
  z-index: 9;
  label {
    display: block;
    font-size: 14px;
    color: #000;
    text-align: left;
  }
  .title {
    font-size: 22px;
    //color: #0b9aff;
    color: #ccc;
    letter-spacing: 2px;
    margin: 10px 0 24px;
  }
  .item-form {
    margin-bottom: 16px;
  }
  .block {
    display: block;
    width: 100%;
  }
  .login-btn {
    margin-top: 9px;
  }
}
</style>
<style >
.el-form-item--medium .el-form-item__content {
  margin-left: 0 !important;
}
</style>