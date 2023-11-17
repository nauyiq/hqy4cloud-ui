<template>
  <el-dialog
      :visible.sync="showDia"
             :close-on-click-modal="false"
             :before-close="close"
      :append-to-body="true"
      :top="50+'px'"
      title="用户设置" >

    <div class="user-info" id="user-info">
      <el-form :model="form"
               :rules="rules"
               ref="form"
               label-width="120px">
        <el-form-item prop="nickname" label="昵称">
          <el-input placeholder="请输入昵称" v-model="form.nickname" autocomplete="off"/>
        </el-form-item>

        <el-form-item label="生日">
          <el-date-picker
              v-model="form.birthday"
              type="date"
              placeholder="选择日期">
          </el-date-picker>
        </el-form-item>

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

        <el-form-item label="用户名">
          <el-input v-model="form.username " readonly disabled/>
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input v-model="form.email " readonly disabled/>
        </el-form-item>

        <el-form-item label="手机号">
          <el-input v-model="form.mobile" readonly disabled/>
        </el-form-item>
      </el-form>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">关闭</el-button>
      <el-button type="primary" @click="save">
        保存
      </el-button>
    </div>

  </el-dialog>
</template>



<script>
import Compressor from "compressorjs";
import { uploadAvatar,updateUserInfo } from "@/api/user";
import moment from "moment";


export default {
  name: 'configDialog',
  props: {
    showDia: {
      type: Boolean
    },
    userInfo: {
      type: Object
    }
  },

  data() {
    return {
      form: {
        id: '',
        username: '',
        nickname: '',
        avatar: '',
        intro: '',
        email: '',
        birthday: '',
        mobile: '',
      },
      token: {
        Authorization: 'Bearer ' + this.$store.getters.access_token
      },
      login:true,
      rules: {
        nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
      }
    }
  },
  created() {
    this.form.id = this.userInfo.id
    this.form.nickname = this.userInfo.nickname
    this.form.email = this.userInfo.email
    this.form.username = this.userInfo.username
    if (this.userInfo.avatar) {
      this.form.avatar = this.userInfo.avatar
    }
    this.form.birthday = this.userInfo.birthday
  },
  methods: {
    close() {
      this.$emit('hide', false);
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
    handleAvatarSuccess(res, file) {
      if (res.code !== 0) {
        this.$message.error('头像上传失败')
      } else {
        this.form.avatar = res.data.path
        this.relativePath = res.data.relativePath
        this.path = res.data.path
        this.$message.success('头像上传成功')
      }
    },
    afterRead(file) {
      // 压缩图片并上传
      new Compressor(file.file, {
        quality: 0.6,
        success(result) {
          const formData = new FormData();
          formData.append('file', result, result.name);
          // 执行上传操作
          uploadAvatar(formData).then((res) => {
            this.form.avatar = res.data.path
            this.$message.success('上传头像成功.')
          }).catch((e) => {
            console.log(e.message)
            this.$message.error('上传失败')
          })
        },
        error(err) {
          console.log(err.message);
        }
      })
    },
    save() {
      this.form.birthday = moment(this.form.birthday).format('YYYY-MM-DD HH:mm:ss')
      this.$refs["form"].validate(valid => {
        if (!valid) return
        updateUserInfo(this.form).then(res => {
          if (res.data.code === 0) {
            this.$message.success('更新成功.');
            //更新用户数据
            this.$emit('updateUser', {nickname: this.form['nickname'], avatar: this.form['avatar']});
            this.$store.dispatch('GetUserInfo')
            this.close();
          } else {
            this.$message.error('更新失败')
          }
        })
      })

    },
    uploadError (e) {
      this.$message.error(JSON.parse(e.message).msg)
    },
    getHeaders() {
      return {
        Authorization: 'Bearer ' + this.$store.getters.access_token
      }
    }
  }
}

</script>

<style lang="scss">
.el-dialog {
  --el-dialog-width: 90%;
  max-width: 800px;

  .el-dialog__body {
    padding-top: 10px;
    max-height: 600px;
    overflow-y: auto;

    .user-info {
      position: relative;

      .el-message {
        position: absolute;
      }
    }
  }
}
 .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
 .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
 .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

</style>