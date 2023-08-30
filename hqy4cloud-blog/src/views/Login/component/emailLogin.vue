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
        <div class="title">登录博客</div>

        <el-form-item prop="email" class="item-form">
          <el-input v-model="ruleForm.email"  placeholder="请输入邮箱"></el-input>
        </el-form-item>

        <el-row type="flex" class="row-bg">
          <el-col :span="16">
            <el-form-item prop="code"  class="item-form">
              <el-input style="width:11em;float: left" v-model="ruleForm.code" placeholder="请输入邮箱验证码"></el-input>
            </el-form-item>
          </el-col>
          <el-form-item class="item-form">
            <el-button :class="[{display:msgKey}]" style="width:10em" type="primary"  @click="handleSend" class="block">{{msgText}}</el-button>
          </el-form-item>
        </el-row>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" native-type="submit" class="login-btn block">登录</el-button>
        </el-form-item>

        <p class="options">
          <span @click="getActiveName('passwordLogin')">- 密码登录</span>
          |
          <span @click="getActiveName('registry')"> 注册 -</span>
        </p>
      </el-form>
    </div>
  </div>
</template>


<script>
import { sendEmail } from "@/api/user";
import errorCode from '@/const/errorCode'
const MSGINIT = '发送验证码',
    MSGSCUCCESS = '${time}秒后重发',
    MSGTIME = 60

export default {
  name: 'emailLogin',
  data() {
    return {
      msgText: MSGINIT,
      msgTime: MSGTIME,
      msgKey: false,
      ruleForm: {
        email: "",
        code: ""
      },
      rules: {
        email: [{ required: true, message: '邮箱不能为空', trigger: 'blur'},
          { pattern:  /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/,  message: "请输入正确的邮箱"}
        ],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }]
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
          this.$store.dispatch('LoginByEmail', this.ruleForm)
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

    handleSend() {
      // 判断是否可以发送（时间限制）
      if (this.msgKey) return
      // 发送验证码
      this.$refs["ruleForm"].validateField("email", callback => {
        if (!callback) {
          sendEmail(this.ruleForm.email).then((response) => {
            if (response.data.code === 0) {
              this.$message.success('验证码发送成功')
              this.timeCacl()
            } else {
              const message =  errorCode[response.data.code] || errorCode['default']
              this.$message.error(message)
            }
          })
        }
      })
    },

    timeCacl() {
      // 计时避免重复发送
      this.msgText = MSGSCUCCESS.replace('${time}', this.msgTime)
      this.msgKey = true
      const time = setInterval(() => {
        this.msgTime--
        this.msgText = MSGSCUCCESS.replace('${time}', this.msgTime)
        if (this.msgTime === 0) {
          this.msgTime = MSGTIME
          this.msgText = MSGINIT
          this.msgKey = false
          clearInterval(time)
        }
      }, 1000)
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
  margin: 200px auto auto;
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

.msg-text {
  display: block;
  width: 120px;
  font-size: 12px;
  text-align: center;
  cursor: pointer;
}

.msg-text.display {
  color: #ccc;
}

</style>
<style >
.el-form-item--medium .el-form-item__content {
  margin-left: 0 !important;
}
</style>