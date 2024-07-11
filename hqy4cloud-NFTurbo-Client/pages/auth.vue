<template>
	<view>
		<view class="info-form">
			<u-form class="transfer-form" :border-bottom="false">
				<u-form-item label-position="left" label="真实姓名" label-width="150" :border-bottom="false">
					<u-input placeholder="请输入真实姓名" v-model="realName" type="text" :clearable="false">
					</u-input>
				</u-form-item>
				<u-form-item label-position="left" label="身份证号" label-width="150" :border-bottom="false">
					<u-input placeholder="请输入身份证号" v-model="identityCard" type="text" :clearable="false">
					</u-input>
				</u-form-item>
			</u-form>
		</view>
		<view class="info-tips">
			<view class="info-tip info-tip1">
				根据法律法规要求，实名信息须与注册手机号持有人相符，且年满18周岁。
			</view>
			<view class="info-tip">
				信息安全保障中，以下信息仅用于身份确认，未经您同意不会用于其它用途。
			</view>
		</view>
		<view class="action-btn">
			<u-button :custom-style="customActionBtnStyle" type="primary" @click="bindRealName">立即认证</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				customActionBtnStyle: {
					width: '70%'
				},
				realName: '',
				identityCard: '',
				mobile: ''
			}
		},
		computed: {},
		onLoad(option) {
			// this.getMyPersonalInfo();
		},
		methods: {
			bindRealName() {
				if (!this.realName) {
					uni.showToast({
						title: "请输入真实姓名",
						icon: "none"
					});
					return;
				}
				if (!this.identityCard) {
					uni.showToast({
						title: "请输入身份证号",
						icon: "none"
					});
					return;
				}
				this.$u.post('/user/auth', {
					realName: this.realName,
					idCard: this.identityCard
				}).then(res => {
					if (!res.success) {
						uni.showToast({
							icon: 'error',
							title: '认证失败'
						});

						return;
					}
					uni.showToast({
						icon: 'success',
						title: '认证成功',
						duration: 2000,
						mask: true,
						complete: function() {
							setTimeout(() => {
								uni.navigateBack();
							}, 2000);
						}
					});
				});
			},
		}
	}
</script>

<style>
	.action-btn {
		padding-left: 32rpx;
		padding-right: 32rpx;
		padding-top: 64rpx;
	}

	.info-form {
		padding-left: 32rpx;
		padding-right: 32rpx;
	}

	.info-tips {
		background: #e3e3e3;
		margin: 32rpx;
		color: #838282;
		font-size: smaller;
		padding: 32rpx 10rpx;
	}

	.info-tip {}

	.info-tip1 {
		padding-bottom: 32rpx;
	}
</style>
