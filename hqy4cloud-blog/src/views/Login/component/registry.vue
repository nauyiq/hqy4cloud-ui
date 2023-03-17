<template>

  <div id="login">

    <div class="login-wrap">
      <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="login-form"
          size="medium">
        <img class="login_image" src="@/assets/login-1.png"/>
        <div class="title">注册账号</div>
        <el-form-item prop="username" class="item-form">
          <el-input v-model="ruleForm.username" auto-complete="off" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="email" class="item-form">
          <el-input v-model="ruleForm.email" auto-complete="off" placeholder="请输入邮箱"></el-input>
        </el-form-item>

        <el-form-item prop="password" class="item-form" >
          <el-input
              type="password"
              maxlength="20"
              minlength="6"
              :readonly="readonlyInput" @focus="cancelReadOnly()"
              auto-complete="off"
              v-model="ruleForm.password"
              placeholder="请输入账号密码"
          ></el-input>
        </el-form-item>

        <el-row type="flex" class="row-bg">
          <el-col :span="16">
            <el-form-item prop="code"  class="item-form">
              <el-input style="width:11em;float: left" auto-complete="off" v-model="ruleForm.code" placeholder="请输入邮箱验证码"></el-input>
            </el-form-item>
          </el-col>
          <el-form-item class="item-form">
            <el-button :class="[{display:msgKey}]" style="width:10em" type="primary"  @click="handleSend" class="block">{{msgText}}</el-button>
          </el-form-item>
        </el-row>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm', 2)" class="login-btn block">注册</el-button>
        </el-form-item>

        <p class="options">
          <span @click="getActiveName('passwordLogin')">已经有账号，去登录</span>
        </p>
      </el-form>
    </div>
  </div>
</template>


<script>
import md5 from "js-md5"

const MSGINIT = '发送验证码',
    MSGSCUCCESS = '${time}秒后重发',
    MSGTIME = 60

export default {
  name: 'registry',
  data() {
    return {
      msgText: MSGINIT,
      msgTime: MSGTIME,
      msgKey: false,
      redirect: '',
      readonlyInput: true,
      ruleForm: {
        username: "",
        password: "",
        email:"",
        code:""
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'change' }],
        password: [{ required: true, message: "请输入密码", trigger: "change" }],
        email: [{ required: true, message: '邮箱不能为空', trigger: 'change'},
          { pattern: /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g,  message: "请输入正确的邮箱"}
        ],
        code: [{ required: true, message: "请输入邮箱验证码", trigger: "change" }]
      }
    };
  },
  methods: {
    getActiveName(value) {
      this.$emit('getActiveName', value)
    },

    cancelReadOnly() {
      this.readonlyInput= false;
    },

    handleSend() {
      // 判断是否可以发送（时间限制）
      if (this.msgKey) return
      // 发送验证码
      // this.$refs.smsForm.validateField('phone', (valid) => {
      if (true) {
        // this.smsForm.exist = this.exist
        // sendSmsCode(this.smsForm).then((response) => {
        //   if (response.data.data) {
        this.$message.success('验证码发送成功')
        // this.$emit('smsForm', this.smsForm)
        this.timeCacl()
        // } else {
        //   this.$message.error(response.data.msg)
        // }
        // })
      }
      // })
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
    color: #ccc;
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