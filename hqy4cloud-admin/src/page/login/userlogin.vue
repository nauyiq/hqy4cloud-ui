<template>
  <el-form
    ref="loginForm"
    class="login-form"
    status-icon
    :rules="loginRules"
    :model="loginForm"
    label-width="0"
  >
    <el-form-item prop="username">
      <el-input
        v-model="loginForm.username"
        auto-complete="off"
        placeholder="请输入用户名"
        @keyup.enter.native="handleLogin"
      >
        <template #prefix>
          <i class="icon-yonghu"></i>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="loginForm.password"
        size="small"
        type="password"
        auto-complete="off"
        show-password
        placeholder="请输入密码"
        @keyup.enter.native="handleLogin"
      >
        <template #prefix>
          <i class="icon-mima"></i>
        </template>

      </el-input>
    </el-form-item>
    <el-form-item v-if="website.validateCode" prop="code">
      <el-input
        v-model="loginForm.code"
        :maxlength="code.len"
        auto-complete="off"
        placeholder="请输入验证码"
        @keyup.enter.native="handleLogin"
      >
        <template #prefix>
          <i class="icon-yanzhengma"></i>
        </template>
        <template #append>
          <div class="login-code">
            <span
              v-if="code.type === 'text'"
              class="login-code-img"
              @click="refreshCode"
            >{{ code.value }}</span
            >
            <img
              v-else
              :src="code.src"
              class="login-code-img"
              @click="refreshCode"
            />
          </div>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        class="login-submit"
        @click.native.prevent="handleLogin"
      >登录
      </el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
import { randomLenNum } from '@/util'
import { mapGetters } from 'vuex'

export default {
  name: 'userlogin',
  data() {
    return {
      loginForm: {
        username: 'hongqy',
        password: '',
        code: '',
        randomStr: ''
      },
      checked: false,
      code: {
        src: '/code',
        value: '',
        len: 6,
        type: 'image'
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { pattern: /^([a-z\u4e00-\u9fa5\d]*?)$/, message: '请输入小写字母', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 6, message: '密码长度最少为6位', trigger: 'change' }
        ],
        code: [{ required: true, message: '请输入验证码', trigger: 'change' }]
      }
    }
  },
  created() {
    if (this.website.validateCode) {
      this.refreshCode()
    }
  },
  computed: {
    ...mapGetters(['tagWel', 'website'])
  },
  methods: {
    refreshCode() {
      this.loginForm.code = ''
      this.loginForm.randomStr = randomLenNum(this.code.len, true)
      this.code.type === 'text'
        ? (this.code.value = randomLenNum(this.code.len))
        : (this.code.src = `${this.baseUrl}/code?randomStr=${this.loginForm.randomStr}`)
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$store.dispatch('LoginByUsername', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.tagWel.value })
            })
            .catch(() => {
              this.refreshCode()
            })
        }
      })
    }
  }
}
</script>

<style></style>
