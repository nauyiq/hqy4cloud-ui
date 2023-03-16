<template>

  <div id="login">
    <div class="max flex align-center justify-center">
      <div class="icon flex align-center" >
        <i @click="toHome" class="iconfont el-icon-s-home el-home"></i>
        <i @click="toIndex" class="iconfont el-icon-menu"></i>
      </div>
    </div>
    <div class="login-wrap">

      <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="login-form"
          size="medium"
          @submit.native.prevent
          >
        <img class="login_image" src="@/assets/login-0.png"/>
        <div class="title">Welcome!
          <div class="title_option">Login in to Hongqy Blog.</div>
        </div>

        <el-form-item prop="account" class="item-form">
          <el-input v-model="ruleForm.username" placeholder="username"></el-input>
        </el-form-item>
        <el-form-item prop="password" class="item-form" >
          <el-input
              type="password"
              maxlength="20"
              minlength="6"
              v-model="ruleForm.password"
              placeholder="password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" native-type="submit" class="login-btn block">Sign in</el-button>
        </el-form-item>
        <p class="options">
          <span @click="showPopup('Create Account', 1)">- register</span>
          or
          <span @click="showPopup('Forgot Password', 2)">Forget password -</span>
        </p>
      </el-form>
    </div>
  </div>
</template>


<script>
let redirectUrl;
const whiteList = ['/register', '/password/reset', '/account']
export default {
  beforeRouteEnter(to, from, next) {
    if (to.query && to.query.redirect) {
      redirectUrl = to.query.redirect
    } else {
      redirectUrl = from.fullPath
    }
    next();
  },
  data() {
    return {
      model: "",
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [{ required: true, message: 'Please input your username.', trigger: 'change' }],
        password: [{ required: true, message: "Please input your password.", trigger: "change" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store.dispatch('LoginByUsername', this.ruleForm)
          .then(() => {
            this.$message.success('登录成功.')
            //获取登录信息
            this.$store.dispatch('GetUserInfo')
            let url = whiteList.indexOf(redirectUrl) === -1 ? redirectUrl : '/index';
            this.$router.push(url)
          })
        }
      });
    },

    toIndex () {
      this.$router.replace("/index")
    },
    toHome () {
      this.$router.push({path: '/'})
    },
    showPopup(name, type) {
      this.$emit('handleOpenPopup', {
        popupTitle: name,
      })
      if (type === 1) {
        this.$router.replace("/registry")
      } else {
        this.$router.replace("/password/reset")
      }

    }
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
    &:last-child:hover {
      color: red;
    }
  }
}
.title_option {
  color: #ccc;
  font-size: 14px;
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
      top: 0;
      left: 0;
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