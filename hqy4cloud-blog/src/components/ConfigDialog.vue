<template>
  <el-dialog
      v-model="showDialog"
      :close-on-click-modal="false"
      :before-close="close"
      :top="50+'px'"
      title="用户设置"
  >
    <div class="user-info" id="user-info">
      <el-form v-if="form.id" :model="form" label-width="120px">
        <el-form-item label="昵称">
          <el-input v-model="form.nickname"/>
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
              class="avatar-uploader"
              :auto-upload="true"
              :show-file-list="false"
              :http-request="afterRead"
          >
            <el-avatar v-if="form.avatar" :src="form.avatar" shape="square" :size="100"/>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="form.username" readonly disabled/>
        </el-form-item>

        <el-form-item label="绑定手机号">
          <el-input v-model="form.mobile" readonly disabled/>
        </el-form-item>

        <el-form-item label="聊天上下文">
          <el-switch v-model="form.chat_config.enable_context"/>
        </el-form-item>
        <el-form-item label="聊天记录">
          <el-switch v-model="form.chat_config.enable_history"/>
        </el-form-item>
        <el-form-item label="Model">
          <el-select v-model="form.chat_config.model" placeholder="默认会话模型">
            <el-option
                v-for="item in models"
                :key="item"
                :label="item.toUpperCase()"
                :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="MaxTokens">
          <el-input v-model.number="form.chat_config.max_tokens"/>
        </el-form-item>
        <el-form-item label="Temperature">
          <el-input v-model.number="form.chat_config.temperature"/>
        </el-form-item>
        <el-form-item label="剩余调用次数">
          <el-tag>{{ form['calls'] }}</el-tag>
        </el-form-item>
        <el-form-item label="消耗 Tokens">
          <el-tag type="info">{{ form['tokens'] }}</el-tag>
        </el-form-item>
        <el-form-item label="API KEY">
          <el-input v-model="form['chat_config']['api_key']"/>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">关闭</el-button>
        <el-button type="primary" @click="save">
          保存
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>



<script>
import Compressor from "compressorjs";
import { uploadAvatar,updateUserInfo } from "@/api/user";

export default {
  name: 'ConfigDialog',
  props: {
    show: {
      type: Boolean
    },
    user: {
      type: Object
    },
    models: {
      type: Array
    }
  },
  data() {
    return {
      form: {
        username: '',
        nickname: '',
        avatar: '',
        email: '',
        mobile: '',
        calls: 0,
        tokens: 0,
        chat_configs: {}
      },
      showDialog: this.props.show,
    }
  },
  methods: {
    close() {
      this.$emit('hide', false);
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
      updateUserInfo(this.form).then(() => {
        this.$message.success('更新成功.');
        this.close();
      })
      //更新用户数据
      this.$emit('update-user', {nickname: form['nickname'], avatar: form['avatar']});
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
</style>