<template>
  <div class="content">
    <Header/>
    <div class="title flex ">
      <div class="flex"><span></span>Personal Information</div>
    </div>

    <el-form class="form align-center" ref="form" :model="form" label-width="80px">
      <el-form-item label="头像">
        <el-upload
            class="avatar-uploader"
            :action="mainUrl + '/blog/upload/avatar'"
            :headers="token"
            :on-error="uploadError"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
          <img v-if="form.avatar" :src="form.avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="form.nickname"></el-input>
      </el-form-item>
      <el-form-item label="生日">
        <el-date-picker
            v-model="form.birthday"
            type="date"
            placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="简介">
        <el-input v-model="form.intro"></el-input>
      </el-form-item>
      <el-form-item >
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>


    <div class="title flex ">
      <div class="flex"><span></span> Account Password</div>
    </div>

    <el-form class="form align-center" ref="passwordForm" :model="passwordForm" :rules="rules" label-width="80px">
      <el-form-item prop="oldPassword" label="旧密码">
        <el-input   type="password"
                    maxlength="20"
                    minlength="6" v-model="passwordForm.oldPassword"  placeholder="Please input your password."></el-input>
      </el-form-item>
      <el-form-item prop="newPassword" label="新密码">
        <el-input   type="password"
                    maxlength="20"
                    minlength="6" v-model="passwordForm.newPassword"  placeholder="Please input your new password."></el-input>
      </el-form-item>
      <el-form-item >
        <el-button type="primary" @click="onSubmitPassword('passwordForm')">保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { updateUserInfo, updatePassword } from '@/api/user'
import moment from "moment";
export default {
  relativePath: '',
  path: '',
  data () {
    return {
      imageUrl: '',
      token: {
        isToken: true
      },
      form: {
        nickname: '',
        birthday: '',
        intro: '',
        avatar: '',
        id: '',
        username:''
      },
      passwordForm: {
        oldPassword: '',
        newPassword: ''
      },
      rules: {
        oldPassword: [{ required: true, message: 'Please input your password.', trigger: 'change' }],
        newPassword: [{ required: true, message: "Please input your new password.", trigger: "change" }]
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },

  created() {
     this.form.id = this.userInfo.id
     this.form.nickname = this.userInfo.nickname
     this.form.username = this.userInfo.username
     if (this.userInfo.avatar) {
       this.form.avatar = this.userInfo.avatar
     }
     this.form.intro = this.userInfo.intro
     this.form.birthday = this.userInfo.birthday
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.form.avatar = res.data.path
      this.relativePath = res.data.relativePath
      this.path = res.data.path
      this.$message.success('头像上传成功')
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 或者 PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    uploadError (e) {
      this.$message.error(JSON.parse(e.message).msg)
    },
    onSubmit () {
      this.form.birthday = moment(this.form.birthday).format('YYYY-MM-DD HH:mm:ss')
      if (this.relativePath) {
        this.form.avatar =  this.relativePath
      }
      updateUserInfo(this.form)
          .then(res => {
            if (res.data.code === 0) {
              if (this.path) {
                this.form.avatar = this.path
              }
              this.$message.success('修改账户信息成功.')
              this.$store.dispatch('GetUserInfo')
            } else {
              this.$message({
                type: 'warning',
                message: res.data.message,
                offset: 60
              })
            }

          })
    },
    onSubmitPassword(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return
        updatePassword(this.passwordForm.oldPassword, this.passwordForm.newPassword).then(res => {
          if (res.data.code === 0) {
            this.$message.success('修改密码成功, 请重新登录')
            this.$store.dispatch('LogOut')
          } else {
            this.$message({
              type: 'warning',
              message: res.data.message,
              offset: 60
            })
          }

        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>



.account-setting-menu{
  margin-top: 25px;
  margin-left: 50px;
  width: 250px;
  height: 100%;
  .el-menu-item {
    font-size: 18px;
    align-content: center;
    margin-top: 50px;
  }
}



.img-outer {
  width: 90px;
  height: 90px;
  background-color: #40a0ff59;
  border-radius: 50%;
  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
}
.align-center{
  align-items: center;
  width: 40%;
}


//.form {
//  position: absolute;
//  left: 50%;
//  top: 30%;
//  width: 400px;
//  text-align: center;
//  -webkit-transform: translate(-50%,-50%);
//  transform: translate(-50%,-50%);
//  z-index: 9;
//}

.title {
  margin-top: 80px;
  margin-left: 20px;
  color: #2c80f7;
  font-size: 18px;
  height: 26px;
  div {
    height: 100%;
    span {
      width: 2px;
      height: 100%;
      background: #3c8af7;
      margin-right: 20px;
    }
  }
}



/deep/ .el-form-item__content {
  display: flex;
  //align-items: center;
}
.form {
  align-items: center;
  margin-top: 50px;
  margin-left: 25%;
  //position: absolute;
  //left: 50%
}

/deep/ .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
/deep/ .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
/deep/ .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
/deep/ .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>