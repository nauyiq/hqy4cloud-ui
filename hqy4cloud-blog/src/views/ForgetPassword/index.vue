<template>

  <div id="login">
    <div class="max flex align-center justify-center">
      <div class="icon flex align-center">
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
          size="medium">
        <img class="login_image" src="@/assets/login-2.png"/>
        <div class="title">Find back the password.</div>
        <el-form-item prop="usernameOrEmail" class="item-form">
          <el-input v-model="ruleForm.usernameOrEmail" placeholder="username or email."></el-input>
        </el-form-item>

        <el-row type="flex" class="row-bg">
        <el-col :span="16">
          <el-form-item prop="code"  class="item-form">
            <el-input style="width:12em;float: left" v-model="ruleForm.code" placeholder="email code."></el-input>
          </el-form-item>
        </el-col>
          <el-form-item class="item-form">
            <el-button style="width:10em" type="primary"  @click="submitForm('ruleForm', 1)" class="block">Send email</el-button>
          </el-form-item>
        </el-row>


        <el-form-item prop="password" class="item-form" >
          <el-input
              type="password"
              maxlength="20"
              minlength="6"
              v-model="ruleForm.password"
              placeholder="new password."
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm', 2)" class="login-btn block">Reset</el-button>
        </el-form-item>
<!--        <p class="notice">-->
<!--          <span>Already have an account? Sign in</span>-->
<!--        </p>-->
        <p class="options">
          <span @click="showPopup('Create Account')">Remember the password? Sign in</span>
        </p>
      </el-form>
    </div>
  </div>
</template>


<script>
import {resetPassword, sendForgetPasswordEmail} from '../../api/user'
import md5 from "js-md5"
export default {
  data() {
    return {
      model: "",
      ruleForm: {
        usernameOrEmail: "",
        password: "",
        code:""
      },
      rules: {
        usernameOrEmail: [{ required: true, message: 'Please input username or email.', trigger: 'change' }],
        password: [{ required: true, message: "Please input new password.", trigger: "change" }],
        code: [{ required: true, message: "Please input email verify code.", trigger: "change" }]
      }
    };
  },
  methods: {
    submitForm(formName, type) {
      // 发送注册邮箱邮件
      if (type === 1) {
        this.$refs[formName].validateField('usernameOrEmail', (username) => {
          if (username) return
          sendForgetPasswordEmail(this.ruleForm.usernameOrEmail).then(res => {
            this.$message.success('Send verify email success.')
          })

        });
      } else {
        this.$refs[formName].validate(valid => {
          if (!valid) return
          this.ruleForm.password = md5(this.ruleForm.password);
          resetPassword(this.ruleForm).then(res => {
            if (res.data.code === 0) {
              this.$message.success('Reset password success.')
              setTimeout(() => {
                this.$router.push("/login")
              }, 1000)
            } else {
              this.$message({
                type: 'warning',
                message: res.data.message,
                offset: 60
              })
            }

          })
        });
      }
    },
    toHome () {
      this.$router.push({path: '/'})
    },
    toIndex () {
      this.$router.replace("/index")
    },
    showPopup(name) {
      this.$emit('handleOpenPopup', {
        popupTitle: name,
      })
      this.$router.replace("/login")
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
    //text-transform: uppercase;
    &:hover {
      color: #0b9aff;
    }
    &:last-child:hover {
      color: red;
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

.notice {
  color: #ccc;
  span {
    float: left;
    font-size: 12px;
    display: inline-block;
    //margin-top: 6px;
    //cursor: pointer;
    //transition: all 0.3s;
    //text-transform: uppercase;
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
  background: linear-gradient(to bottom right, #fffefe,#fffefe );
  overflow: hidden;
}
.login_image{
  position: absolute;
  top: -80px;
  left: 50%;
  width: 120px;
  height: 100px;
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
  width: 420px;
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
    font-size: 21px;
    color: #0b9aff;
    letter-spacing: 1px;
    margin: 10px 0 24px;
  }
  .item-form {
    margin-bottom: 16px;
  }
  .code-input{
    //float: left;
    width: 40%;
    display: flex;
    //flex-direction: row;
    //justify-content: flex-start;
    //display: inline-block;
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