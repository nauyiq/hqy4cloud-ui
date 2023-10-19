<template>
  <!-- 设置中心 -->
  <el-tabs tab-position="left" style="height: 100%;">
    <el-tab-pane label="账号设置" class="pd-20">
      <div class="user-center">
        <div class="user-avatar">
          <el-upload ref="upload" class="upload-demo" :multiple="false" :action="mainUrl + '/blog/upload/avatar'" :show-file-list='false'
                     :data='{type:1}' :on-success="handleAvatarSuccess"  :auto-upload="false" :on-change="change"
                     :before-upload="before" :http-request="request">
            <el-image :src="user.avatar" style="width:160px;border-radius: 8px;overflow: hidden;" class="m-20"></el-image>
            <el-button size="mini" class="replace-picture-button mab-30">更换头像</el-button>
          </el-upload>

        </div>
        <div class="user-info">
          <el-form :model="user" ref="userinfo" label-width="100px">
            <el-form-item label="账号">
              {{user.username}}
            </el-form-item>
            <el-form-item label="昵称" >
              <el-input placeholder="请输入昵称" v-model="user.nickname" maxlength="20" style="width:400px"></el-input>
            </el-form-item>
            <el-form-item label="生日">
              <el-date-picker
                  v-model="user.birthday"
                  type="date"
                  placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
<!--            <el-form-item label="性别">
              <el-radio-group v-model="user.sex">
                <el-radio :label="2" border>未知</el-radio>
                <el-radio :label="1" border>男</el-radio>
                <el-radio :label="0" border>女</el-radio>
              </el-radio-group>
            </el-form-item>-->
            <el-form-item label="个性签名">
              <el-input type="textarea" :rows="3" v-model="user.intro" maxlength="100" style="width:400px" show-word-limit></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm()">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>

    </el-tab-pane>
    <el-tab-pane label="聊天设置" class="pd-20">


      <div class="common-setting card-rows">
        <div class="card-row" >
          <div class="label">陌生人聊天</div>
          <div>
            <el-switch @change="updateImSetting" :width="60" v-model="setting.isPrivateChat"> </el-switch>
          </div>
        </div>

        <div class="card-row" >
          <div class="label">允许邀请加入群聊</div>
          <div>
            <el-switch @change="updateImSetting" :width="60" v-model="setting.isInviteGroup"> </el-switch>
          </div>
        </div>

<!--        <div class="card-row" >
          <div class="label">保留聊天记录</div>
          <div>
            <el-switch @change="updateImSetting" :width="60" v-model="!setting.isClearMsg"> </el-switch>
          </div>
        </div>-->

<!--        <div class="card-row" >
          <div class="label">聊天记录保留天数</div>
          <div>
            <el-input-number :min="1" :max="180" @change="updateImSetting" v-model="setting.clearMessageDate"> </el-input-number>
          </div>
        </div>-->

<!--        <div class="card-row" >
          <div class="label">离开聊天室</div>
          <div>
            <el-button @click="toHome"></el-button>
          </div>
        </div>-->

      </div>

    </el-tab-pane>
  </el-tabs>
</template>
<script>
import { mapState } from "vuex";
import { updateUserInfo } from "@/api/user";

export default {
  name: "manageGroup",
  props: {
  },
  components: {
    // Cropper,
  },
  data() {
    return {
      componentsKey: 1,
      maxSize: 5,
      compress: 1,
      cropperDialogVisible: false,
      cropper: true,
      cropperImg: '',
      tempImg: '',
      dialogVisible: false,
      dialog: false,
      account: '',
      password: '',
      repass: '',
      code: '',
      newCode:'',
      loading: false,

    };
  },
  computed: {
    ...mapState({
      setting: state => state.user.setting,
      user: state => state.user.userInfo,
      isToken() {
        return this.$store.getters.access_token;
      }
    }),
    getUrl () {
      return window.BASE_URL + '/common/upload/uploadAvatar'
    },
  },
  watch: {
    // 监听设置发送变化需要进行设置更改
    /*setting: {
      handler(newValue, oldValue) {
        this.$api.imApi.settingAPI(newValue);
        let user = Lockr.get("UserInfo");
        user.setting = newValue;
        Lockr.set("UserInfo", user);
      },
      deep: true,
    },*/
  },
  methods: {
    toHome () {
      this.$router.push({path: '/'})
    },
    logout() {
      this.$confirm("确定退出登录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
          .then(() => {
            this.$store.dispatch("LogOut").then(() => {
              this.$router.push("/login");
            })
          })
          .catch(() => {});
    },
    submitForm(){
      if(this.user.nickname === ''){
        this.$message.error('请输入昵称')
        return false
      }
      updateUserInfo(this.user).then(res => {
        if (res.data.code === 0) {
          this.$store.dispatch('GetUserInfo')
        }
      })

    },
    // 是否为图片
    isImg (fileUrl) {
      var strRegex = "(.jpg|.png|.gif|.jpeg)$";
      var re = new RegExp(strRegex);
      if (re.test(fileUrl.toLowerCase())) {
        this.fileIsImg = true;
      } else {
        this.fileIsImg = false;
      }
    },
    // 选择图片后进行操作
    change (file) {
      if (this.cropper && file.status == 'ready') {
        this.isImg(file.name)
        if (!this.fileIsImg) {
          this.$message.error('选择的文件非图像类文件')
          return false
        }
        this.componentsKey++;
        this.cropperDialogVisible = true
        this.cropperImg = URL.createObjectURL(file.raw)
      }
    },
    // 选择图片的时候进行验证
    before (file) {
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
    // 上传图图片
    request (param) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
      });
      const data = new FormData();
      var file = this.cropper ? this.cropperUploadFile : param.file
      data.append("file", file);
      data.append("type", 1);
      this.$api.commonApi.uploadAvatar(data).then(res => {
        this.cropperImg = '';
        loading.close();
        this.handleAvatarSuccess(res)
        param.onSuccess(res)
      }).catch(err => {
        loading.close();
        param.onError(err)
      })
    },
    // 保存裁剪图片并上传
    cropperSave () {
      var uploadFile = this.$refs.upload.uploadFiles[0].raw
      this.$refs.cropper.getCropFile(file => {
        this.cropperUploadFile = file
        this.$refs.upload.submit()
        this.cropperDialogVisible = false
      }, uploadFile.name, uploadFile.type)

    },
    handleAvatarSuccess (res, file) {
      if (res.code !== 0) {
        this.$message.error('头像上传失败')
      } else {
        this.user.avatar = res.data.path
        this.$store.commit("SET_USER_INFO", this.user)
        this.$message.success('头像上传成功')
      }
    },

    updateImSetting() {
      this.$store.dispatch('UpdateUserImSetting', this.setting)
    }

  },

};
</script>
<style lang="scss" scoped>
.user-center{
  margin-top: 50px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  .user-avatar{
    width:240px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
  }
  .user-info{
    flex:1;
  }
}

.common-setting {
  margin-top: 50px;
  text-align: left;
}

.setting-switch {
  margin: 0 30px 20px;
}

.setting-version {
  margin: 10px 20px;
  line-height: 2;
}

.fc-primary {
  color: #409eff;
}

.about-logo {
  text-align: center;
  width:200px;
}
::v-deep .el-tabs__nav{
  margin-top:20px;
  width:120px;
}


.card-rows {
  .card-row {
    display: flex;
    justify-content: flex-start;
    height: 60px;
    line-height: 35px;
    font-size: 14px;
    position: relative;
    color: #736f6f;

    .label {
      width: 128px;
      margin-right: 20px;
      text-align: left;
    }
  }
}

</style>