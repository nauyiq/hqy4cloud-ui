<template>
  <el-dialog
      :visible.sync="showDia"
      :close-on-click-modal="false"
      :before-close="close"
      :append-to-body="true"
      :top="50+'px'"
      title="修改密码" >

    <div class="form" id="password-form">
      <el-form :model="form" ref="form" :rules="rules" label-width="120px">
        <el-form-item prop="oldPassword" label="原始密码">
          <el-input placeholder="请输入原密码" v-model="form.oldPassword"  type="password"/>
        </el-form-item>
        <el-form-item prop="newPassword" label="新密码">
          <el-input placeholder="请输入新密码" v-model="form.newPassword" type="password"/>
        </el-form-item>
        <el-form-item prop="confirmPassword" label="确认密码">
          <el-input  placeholder="请再次输入新密码"  v-model="form.confirmPassword" type="password"/>
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
import {  updatePassword } from "@/api/user";

const validPassword = (rule, value, callback) => {
  console.log(vm.form.newPassword)
  if (vm.form.newPassword !== value) {
    callback(new Error("两次密码不一致"))
  } else {
    callback()
  }
}

let vm;



export default {
  name: 'passwordDialog',
  props: {
    showDia: {
      type: Boolean
    }
  },
  data() {
    return {
      form: {
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
      },
      rules: {
        oldPassword: [{ required: true, message: "请输入原密码", trigger: "blur"  },  { min:6, max:20, trigger: "blur", message: "密码的长度必须为6到20" }],
        newPassword: [{ required: true, message: "请输入新的密码", trigger: "blur"  }, { min:6, max:20, trigger: "blur", message: "密码的长度必须为6到20" }],
        confirmPassword: [
            { required: true, message: "请再次输入新的密码", trigger: "blur"  },
            { min:6, max:20, trigger: "blur", message: "密码的长度必须为6到20" },
            { validator: validPassword, trigger: 'blur'}],
      }
    }
  },created() {
    vm = this
  },
  methods: {
    close() {
      this.$emit('hide', false);
    },
    save() {
      this.$refs["form"].validate(valid => {
        if (!valid) return
        updatePassword(this.form.oldPassword, this.form.newPassword).then(res => {
          if (res.data.code === 0) {
            this.$message.success('修改密码成功, 请重新登录')
            this.$store.dispatch("LogOut").then(() => {
              window.location.reload()
            })
          } else {
            if (res.data.code === 3002) {
              this.$message({
                type: 'warning',
                message: '原密码错误, 请输入正确的密码',
                offset: 60
              })
            } else {
              this.$message({
                type: 'error',
                message: res.data.message,
                offset: 60
              })
            }
          }
        })
      })

    },

  }
}

</script>

<style lang="scss">
.el-dialog {
  --el-dialog-width: 90%;
  max-width: 650px;

  .el-dialog__body {
    padding-top: 10px;
    max-height: 600px;
    overflow-y: auto;

    .form {
      position: relative;

      .el-message {
        position: absolute;
      }
    }
  }
}

</style>