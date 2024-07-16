<template>
	<view>
		<u-modal v-model="updateNickNameFlag" title="修改昵称" :show-cancel-button="true" @confirm="updateNickName">
			<view class="slot-content">
				<input class="nick-name-input" focus v-model="nickName" />
			</view>
		</u-modal>
		<view class="setting-info">
			<u-cell-group title="个人信息" :border="false" :title-style="titleStyle">
				<u-cell-item title="头像" :arrow="false" :border-bottom="false" :title-style="titleStyle"
					@click="chooseAvatar">
					<view slot="right-icon">
						<view class="avatar">
							<u-image height="54rpx" width="54rpx" :src="personalInfo.profilePhotoUrl" shape="circle"></u-image>
						</view>
					</view>
				</u-cell-item>
				<u-cell-item title="昵称" :arrow="true" :border-bottom="false" :title-style="titleStyle"
					:value="personalInfo.nickName" @click="showUpdateNickNameModal">
				</u-cell-item>
				<u-cell-item title="手机号" :arrow="false" :border-bottom="false" :title-style="titleStyle"
					:value="personalInfo.telephone">
				</u-cell-item>
				<u-cell-item title="区块链地址" :arrow="false" :border-bottom="false" :title-style="titleStyle">
					<view slot="label">{{getBlockChainAddr()}}</view>
				</u-cell-item>
			</u-cell-group>
			<u-cell-group title="账号安全" :border="false" :title-style="titleStyle">
				<u-cell-item title="实名认证" :arrow="true" :border-bottom="false" :title-style="titleStyle"
					@click="bindRealName">
					<view class="real-name" v-show="personalInfo">
						{{getCertification(personalInfo.certification)}}
					</view>
				</u-cell-item>
			</u-cell-group>
		</view>
		<view class="fixed-button-group" v-show="isLogin()">
			<u-button type="primary" @click="logout">退出登录</u-button>
			</u-row>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				updateNickNameFlag: false,
				nickName: '',
				personalInfo: '',
				titleStyle: {}
			}
		},
		onLoad() {
      if(!this.isLogin()) {
        uni.reLaunch({
        	url: "/pages/login"
        });
      }
		},
		onShow() {
			this.getMyPersonalInfo();
		},
		methods: {
			getBlockChainAddr() {
				if (this.personalInfo) {
					if (!this.personalInfo.certification) {
						return '实名认证后生成区块链地址...';
					} else {
						return this.personalInfo.blockChainUrl ? this.personalInfo.blockChainUrl : '等待创建区块链地址...';
					}
				}
			},
			getCertification(s) {
				return s ? '已实名' : s === 0 ? '未实名' : '待认证';
			},
			updateNickName() {
				if (this.nickName === null || this.nickName === "") {
					uni.showToast({
						title: "请输入昵称",
						icon: "none"
					});
					return;
				}
				this.$u.post('/user/modifyNickName', {
					userId: uni.getStorageSync('accountId'),
					nickName: this.nickName,
				}).then(res => {
					this.updateNickNameFlag = false;
					this.getMyPersonalInfo();
				});
			},

			showUpdateNickNameModal() {
				this.updateNickNameFlag = true;
				this.nickName = this.personalInfo.nickName;
			},

			chooseAvatar() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						const header = {};
						const tokenValue = uni.getStorageSync('tokenValue');
						header['satoken'] = tokenValue;
						uni.uploadFile({
							url: this.baseUrl + '/user/modifyProfilePhoto?satoken=' + tokenValue,
							filePath: res.tempFilePaths[0],
							header: header,
							name: 'file_data',
							success: (r) => {
                try {
                const rst = JSON.parse(r.data);
                
								this.personalInfo.profilePhotoUrl = rst.data;
                } catch(e) {
                  
                }
							}
						});
					}
				});
			},
			
			
			isLogin() {
				const tokenValue = uni.getStorageSync('tokenValue');
				return tokenValue != null && tokenValue != '';
			},

			updateAvatar(avatar) {
				this.$u.post('/member/updateAvatar', {
					avatar: avatar
				}).then(res => {
					this.getMyPersonalInfo();
				});
			},

			bindRealName() {
				if (this.personalInfo.certification) {
					uni.showToast({
						title: "已完成实名认证",
						icon: "success"
					});
					return;
				}
				this.gotoPage('/pages/auth');
			},

			logout() {
				this.$u.post('/auth/logout').then(res => {
					try {
						uni.removeStorageSync('tokenValue');
					} catch (e) {}
					uni.reLaunch({
						url: "/pages/login"
					});
				});
			},

			getMyPersonalInfo() {
				uni.showLoading({
					title: ''
				});
				this.$u.get('/nft/user').then(res => {
					this.personalInfo = res.data;
					uni.hideLoading();
				});
			},

			gotoPage(path) {
				uni.navigateTo({
					url: path
				});
			}

		}
	}
</script>

<style>
	page {
		height: 100% !important;
	}


	.real-name {
	}

	.unreal-name {
		display: inline-block;
		background-color: #ff0000;
		border-radius: 10rpx;
		width: 10rpx;
		height: 10rpx;
		margin-right: 16rpx;
		position: relative;
		top: -2rpx;
	}

	.setting-info .u-cell {}

	.u-cell-title {}

	.nick-name-input {
		background: #ebebeb;
		border-radius: 32rpx;
		margin: 32rpx;
		padding: 20rpx 32rpx;
	}

	.avatar {
		padding-right: 16rpx;
	}

	.fixed-button-group {
		position: fixed;
		bottom: 60rpx;
		left: 0rpx;
		width: 100%;
		padding-left: 32rpx;
		padding-right: 32rpx;
	}

	.common-modal {
		padding-left: 32rpx;
		padding-right: 32rpx;
		padding-top: 20rpx;
		padding-bottom: 20rpx;
	}

	.modal-title {
		display: flex;
		justify-content: space-between;
	}

	.modal-title-txt {
		font-weight: bold;
	}

	.modal-close-txt {}

	.modal-content {
		padding-top: 10rpx;
		padding-bottom: 10rpx;
	}

	.login-duration-item {
		padding-top: 30rpx;
		padding-bottom: 30rpx;
		display: flex;
		align-items: center;
	}

	.login-duration-item-txt {
		flex: 1;
	}
</style>
