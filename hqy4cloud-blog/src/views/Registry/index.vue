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
        <img class="login_image" src="@/assets/login-1.png"/>
        <div class="title">Create a Hongqy Account.</div>
        <el-form-item prop="username" class="item-form">
          <el-input v-model="ruleForm.username" placeholder="username"></el-input>
        </el-form-item>
        <el-form-item prop="email" class="item-form">
          <el-input v-model="ruleForm.email" placeholder="email"></el-input>
        </el-form-item>

        <el-row type="flex" class="row-bg">
        <el-col :span="16">
          <el-form-item prop="code"  class="item-form">
            <el-input style="width:12em;float: left" v-model="ruleForm.code" placeholder="email verify code"></el-input>
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
              placeholder="password"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm', 2)" class="login-btn block">Sign up</el-button>
        </el-form-item>
<!--        <p class="notice">-->
<!--          <span>Already have an account? Sign in</span>-->
<!--        </p>-->
        <p class="options">
          <span @click="showPopup('Create Account')">Already have an account? Sign in</span>
        </p>
      </el-form>
    </div>
  </div>
</template>


<script>
import {registry, sendEmail} from '../../api/user'
import md5 from "js-md5"
export default {
  data() {
    return {
      model: "",
      ruleForm: {
        username: "",
        password: "",
        email:"",
        code:""
      },
      rules: {
        username: [{ required: true, message: 'Please input your username.', trigger: 'change' }],
        password: [{ required: true, message: "Please input your password.", trigger: "change" }],
        email: [
            { required: true, message: "Please input your email.", trigger: "change" },
            { pattern: /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g,  message: "Please input a legal email."}
        ],
        code: [{ required: true, message: "Please input your verify code.", trigger: "change" }]
      }
    };
  },
  methods: {
    submitForm(formName, type) {
      // 发送注册邮箱邮件
      if (type === 1) {
        this.$refs[formName].validateField('username', (username) => {
          if (username) return
          this.$refs[formName].validateField("email", (email) => {
            if(email) return
            sendEmail(this.ruleForm).then(res => {
              if (res.data.code === 0) {
                this.$message.success('验证已经发送到邮箱.')
              } else {
                this.$message({
                  type: 'warning',
                  message: res.data.message,
                  offset: 60
                })
              }

            })
          })
        });
      } else {
        this.$refs[formName].validate(valid => {
          if (!valid) return
          const md5Password = md5(this.ruleForm.password);
          const inputPassword = this.ruleForm.password;
          this.ruleForm.password = md5Password;
          registry(this.ruleForm).then(res => {
            if (res.data.code === 0) {
              this.$message.success('注册成功.')
              setTimeout(() => {
                this.$router.push("/login")
              }, 1000)
            } else {
              this.ruleForm.password = inputPassword;
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
    toIndex () {
      this.$router.replace("/index")
    },
    toHome () {
      this.$router.push({path: '/'})
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
  height: 105px;
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