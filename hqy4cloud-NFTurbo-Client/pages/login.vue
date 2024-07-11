<template>
	<view>
		<u-verification-code seconds="60" ref="uCode" @change="codeChange"></u-verification-code>
		<view class="login-page">
			<view class="u-flex u-row-center">
				<u-image width="256rpx" height="256rpx" src="/static/img/nft.png"></u-image>
			</view>
			<u-form>
				<u-form-item label-position="top" label="手机号码" label-width="150">
					<u-input placeholder="请输入正确的手机号码" v-model="telephone" type="number" :clearable="false"></u-input>
				</u-form-item>
				<u-form-item label-position="top" label="验证码" label-width="150">
					<u-input placeholder="请输入验证码" v-model="captcha" type="text" :clearable="false"></u-input>
					<u-button slot="right" size="mini" @click="getCaptchaCode">{{codeTips}}</u-button>
				</u-form-item>
				<u-form-item label-position="top" label="邀请码" label-width="150">
					<u-input placeholder="邀请码( 选填)" v-model="inviteCode" type="text" :clearable="false"></u-input>
				</u-form-item>
			</u-form>
			<view class="login-btn">
				<u-button type="primary" @click="login">立即登录</u-button>
			</view>

			<view class="login-tip">未注册的手机号码将自动注册为新账号</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				telephone: '',
				captcha: '',
				inviteCode: '',
				codeTips: ''
			}
		},
		onLoad(option) {
		},
		methods: {

			codeChange(text) {
				this.codeTips = text;
			},

			getCaptchaCode() {
				if (!this.$refs.uCode.canGetCode) {
					return;
				}
				if (!/^\d{11}$/.test(this.telephone)) {
					uni.showToast({
						title: "手机号码错误",
						icon: "none"
					});
					return;
				}
				uni.showLoading({
					title: '已发送验证码',
					mask: true
				});
				this.$u.get('/auth/sendCaptcha', {
					telephone: this.telephone
				}).then(res => {
					if(res.success) {
						uni.hideLoading();
						this.$refs.uCode.start();
					}
				});
			},

			updatePushClientId() {
				const clientInfo = plus.push.getClientInfo();
				this.$u.post('/member/updatePushClientId', {
					pushClientId: clientInfo.clientid
				}).then(res => {});
			},

			login() {
				if (!/\d{11}/.test(this.telephone)) {
					uni.showToast({
						title: "请输入正确的手机号",
						icon: "none"
					});
					return;
				}
				if (this.captcha === null || this.captcha === "") {
					uni.showToast({
						title: "请输入验证码",
						icon: "none"
					});
					return;
				}
				this.$u.post('/auth/login', {
					telephone: this.telephone,
					captcha: this.captcha,
					inviteCode: this.inviteCode,
					rememberMe: true
				}).then(res => {
					if(!res.success) {
						uni.showToast({
							title: "验证码错误",
							icon: "error"
						});
						return;
					}
					
					const loginInfo = res.data;
					
					uni.setStorageSync('tokenValue', loginInfo.token);
					uni.setStorageSync('accountId', loginInfo.userId);

					// #ifdef APP-PLUS
					//this.updatePushClientId();
					// #endif
					uni.reLaunch({
						url: "/pages/my"
					});
				});
			},

		}
	}
</script>

<style>
	.verification-code-tip {
		padding-left: 32rpx;
		padding-right: 32rpx;
	}

	.login-btn {
		padding-top: 32rpx;
	}

	.welcome {
		color: #3c93ef;
		font-weight: bold;
		font-size: 28px;
		line-height: 2;
	}

	.login-tip {
		color: #888;
		text-align: center;
		padding-top: 64rpx;
		font-size: small;
	}

	.login-page {
		padding-left: 32rpx;
		padding-right: 32rpx;
		padding-top: 32rpx;
	}
</style>
