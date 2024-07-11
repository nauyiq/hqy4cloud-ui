<template>
	<view class="page-content">
		<u-popup v-model="showPayModalFlag" mode="bottom" border-radius="14" :closeable="true">
			<view class="pay-modal">
				<view class="pay-modal-amount">
					<text>￥</text><text class="pay-modal-amount-value">{{moneyFormat(collectionDetail.price)}}</text>
				</view>
				<view class="pay-modal-pay-way-tip">选择支付方式</view>
				<view class="pay-modal-pay-ways">
					<view class="pay-modal-pay-way">
						<view class="pay-modal-pay-way-label">微信支付</view>
						<view>
							<u-icon name="checkmark-circle-fill" color="#2979ff" size="36"></u-icon>
						</view>
					</view>
				</view>
				<view>
					<u-button class="custom-pay-modal-btn" type="primary" @click="confirmPay">确认付款</u-button>
				</view>
			</view>
		</u-popup>
		<u-popup v-model="showPayQRCode" mode="bottom" border-radius="14">
			<view class="pay-modal">
				<view class="pay-modal-pay-way-tip">请使用微信扫码支付</view>
				<view class="pay-modal-pay-qrcode-wrap">
					<div ref="qrcodeImg" class="pay-modal-pay-qrcode collection-cover"></div>
				</view>
				<view>
					<u-button class="custom-pay-modal-btn" type="success" @click="payFinish">完成付款</u-button>
				</view>
			</view>
		</u-popup>
		<view class="collection-cover">
			<image style="width: 100%;" mode="widthFix" :src="collectionDetail.cover">
			</image>
		</view>
		
		<view class="collection-name">
			<view class="collection-name-inner">{{collectionDetail.name}}</view>
			<view class="limit-block">
				<view class="limit">限量</view>
				<view class="quantity">{{collectionDetail.inventory}}/{{collectionDetail.quantity}} 份</view>
			</view>
		</view>
		<view>
			<view class="div-line"></view>
			<view class="mystery-box">
				<view class="mystery-box-title">
					<view class="mystery-box-title-l">作品描述</view>
				</view>
				<view class="mystery-box-commoditys">
					<view class="mystery-box-commodity">
						<u-image width="100%" height="500rpx" border-radius="10" :src="collectionDetail.goodsPicUrl">
						</u-image>
					</view>
		
				</view>
			</view>
		</view>
		<view class="div-line"></view>
		<view class="creator-story">
			<view class="story-title">购买须知</view>
		</view>
		<view class="buy-instructions">
			<view class="buy-instructions-title">关于数字藏品</view>
			<view class="buy-instructions-content">
				数字藏品为虚拟数字商品，而非实物，仅限实名认证为年满18周岁的中国大陆用户购买。数字藏品的版权由发行方或原创者拥有，除另行取得版权拥有者书面同意外，用户不得将数字藏品用于任何商业用途。因为区块链技术的特性，本商品一经售出，不支持退换。本商品源文件不支持本地下载。本商品的展示效果可能受用户手机性能、网络环境等因素的影响。请勿对数字藏品进行炒作、场外交易、欺诈，或以任何其他非法方式进行使用。
			</view>
		</view>
		<view class="fixed-bottom">
			<view class="fixed-bottom-content">
				<view class="price-info">
					<view>￥</view>
					<view>{{moneyFormat(collectionDetail.price)}}</view>
				</view>
				<view v-show="!isLogin()">
					<view class="buy-now" @click="loginPage">登录后购买</view>
				</view>
					
				<view v-show="isLogin()">
					<view class="sell-out" v-show="collectionDetail.state == 'SOLD_OUT' || collectionDetail.state == 'NOT_FOR_SALE'">已售罄</view>
					<view v-show="collectionDetail.state != 'SOLD_OUT'">
						<view class="buy-now" v-show="collectionDetail.state == 'SELLING'" 
							@click="latestCollectionCreateOrder">立即购买
						</view>
						<view class="future-sale" v-show="collectionDetail.state =='WAIT_FOR_SALE'">
							<view class="future-sale1">敬请期待</view>
							<view class="future-sale2">
								{{collectionDetail.saleTime}}
							</view>
						</view>
						<view class="for-sale"
							v-show="collectionDetail.state == 'COMING_SOON'">
							<view class="for-sale1">即将开售</view>
							<view class="for-sale2">
								<u-count-down :show-days="false" color="white" separator-size="26"
									separator-color="white" bg-color="#4c4c4c" font-size="26"
									:timestamp="collectionDetail.surplusSecond">
								</u-count-down>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import QRCode from 'qrcodejs2';
	export default {
		data() {
			return {
				collectionId: '',
				collectionDetail: '',
				showPayModalFlag: false,
				orderId: '',
				tokenId: '',
				checkToken: null,
				showPayQRCode: false,
				paySuccess:false,
			}
		},
		onLoad(option) {
			this.collectionId = option.id;
			this.getToken();
			this.getCollectionDetail();
			
			
		},
		methods: {
			getToken() {
				this.$u.get('/token/get', {
					scene: 'orderList'
				}).then(res => {
					if (res.data) {
						this.checkToken = res.data;
					}
				});
			},

			latestCollectionCreateOrder() {
				var that = this;
				this.$u.post('/trade/buy', {
					goodsId: that.collectionId,
					goodsType: 'COLLECTION',
					itemCount: 1,
					token: that.checkToken
				}, {
					Authorization: that.checkToken
				}).then(res => {
					if(res.success) {
						that.orderId = res.data;
						that.showPayModalFlag = true;
					}else{
						uni.showToast({
							icon: 'error',
							title: res.message,
							duration: 2000
						});
					}
					
				}).catch(error => {
					if (error.statusCode === 401) {
						uni.showModal({
							title: '请勿重复提交',
							content: ' 请刷新页面重新发起请求',
							showCancel: false,
							success: function (res) {
								if (res.confirm) {
									// Handle the case when user confirms the modal
									// For example, you can redirect to the login page
								}
							}
						});
					} else {
						// Handle other errors
						uni.showToast({
							icon: 'error',
							title: 'An error occurred',
							duration: 2000
						});
					}
					
				});
			},

			confirmPay() {
				this.$u.post('/trade/pay', {
					orderId: this.orderId,
					payChannel: 'WECHAT',
					token: this.checkToken
				}).then(res => {
					if(res.success) {
						this._orderData = res.data;
						this.showPayModalFlag = false;
						this.showPayQRCode = true;
						
						const payQRCodeURL = res.data.payUrl;
						this.payOrderId = res.data.payOrderId;
						
						setTimeout(() => {
							new QRCode(this.$refs.qrcodeImg, {
								text: payQRCodeURL,
								width: 170,
								height: 170
							})
						}, 300);
						
						
						setInterval(() => {
							if(this.paySuccess == false) {
								this.payFinishAutoCheck();
							}
						}, 1000);
						
						return;
					}
					
					if(res.msg == "未能读取到有效 token"){
						uni.showToast({
							icon: 'error',
							title: '请先登录！',
							duration: 2000
						});
					}else{
						uni.showToast({
							icon: 'error',
							title: res.msg,
							duration: 2000
						});
					}

				});
			},
			
			isLogin() {
				const tokenValue = uni.getStorageSync('tokenValue');
				return tokenValue != null && tokenValue != '';
			},
			
			
			loginPage() {
				uni.reLaunch({
					url: "/pages/login"
				});
			},
			
			
			payFinish() {
				this.$u.get('/order/getPayStatus', {
					payOrderId: this.payOrderId,
				}).then(res => {
					if(res.data.orderState !== 'FINISH' && res.data.orderState !== 'PAID' ) {
						uni.showToast({
							icon: 'error',
							title: '未完成支付',
							duration: 2000,
							mask: true,
							complete: () => {
								
							}
						});
						
						return;
					}
				
					this.showPayQRCode = false;
					this.paySuccess = true;
					uni.showToast({
						icon: 'success',
						title: '支付成功!',
						duration: 2000,
						mask: true,
						complete: () => {
							location.reload();
						}
					});
				
					
				});
			},
			
			payFinishAutoCheck() {
				this.$u.get('/order/getPayStatus', {
					payOrderId: this.payOrderId,
				}).then(res => {
					if(res.data.orderState !== 'FINISH' && res.data.orderState !== 'PAID' ) {		
						return;
					}
				
					this.showPayQRCode = false;
					this.paySuccess = true;
					
					uni.navigateTo({
						url: '/pages/payFinish'
					});
					
				});
			},

			moneyFormat(money, len) {
				len = len || 2
				if (!money && money !== 0)
					return ''
				if (isNaN(+money))
					return ''
				if (money === 0 || money === '0')
					return '0.' + '0'.repeat(len)
				const arr = (money + '').split('.')
				const intStr = arr[0] ? arr[0] : 0
				let floatStr = arr[1] ? arr[1] : 0
				if (floatStr === 0) {
					floatStr = '0'.repeat(len)
				} else {
					floatStr = (+('0.' + floatStr)).toFixed(len).split('.')[1]
				}
				money = (intStr + '.' + floatStr).replace(/(\d{1,3})(?=(?:\d{3})+\.)/g, `$1,`);
				return money
			},

			getCollectionDetail() {
				this.$u.get('/collection/collectionInfo', {
					collectionId: this.collectionId
				}).then(res => {
					this.collectionDetail = res.data;
					uni.setNavigationBarTitle({
						title: this.collectionDetail.name
					});
				});
			},
		}
	}
</script>

<style>
	.pay-modal-pay-qrcode {
		margin: 20rpx auto 60rpx;
		width: 300rpx;
		height: 300rpx;
		
		img{
			width: 100%;
			height: 100%;
		}
	}
	.div-line {
		width: 100%;
		height: 20rpx;
		background: #f0f0f0;
	}

	.collection-cover {}

	.tech-support-txt {
		padding-left: 10rpx;
	}

	.tech-support {
		display: flex;
		align-items: center;
		color: #888;
		justify-content: center;
		line-height: 3.5;
	}

	.buy-instructions {
		padding-left: 12rpx;
		padding-right: 12rpx;
		padding-top: 12rpx;
		padding-bottom: 36rpx;
	}

	.buy-instructions-title {
		color: #353535;
		text-align: center;
		line-height: 3;
	}

	.buy-instructions-content {
		color: #909399;
		font-size: small;
	}

	.lock-icon {
		padding-right: 6rpx;
	}

	.buy-lock-tip {
		display: flex;
		align-items: center;
		color: #888;
		justify-content: center;
		line-height: 3;
	}

	.buy-lock-tip-content {
		margin-left: 20rpx;
		margin-right: 20rpx;
	}

	.mystery-box {}

	.mystery-box-title {
		padding-left: 16rpx;
		padding-right: 16rpx;
		display: flex;
		justify-content: space-between;
		padding-bottom: 16rpx;
		padding-top: 16rpx;
		align-items: center;
	}

	.mystery-box-title-l {
		color: #353535;
		font-size: 36rpx;
	}

	.mystery-box-title-r {
		font-size: small;
		color: #888;
	}

	.mystery-box-title-r text {
		color: #000000;
	}

	.mystery-box-commoditys {}

	.mystery-box-commodity {
		display: flex;
		align-items: center;
		padding-left: 20rpx;
		padding-right: 20rpx;
		background: #ebebeb;
		padding-top: 10rpx;
		padding-bottom: 10rpx;
		margin-bottom: 10rpx;
		margin-left: 20rpx;
		margin-right: 20rpx;
		font-size: small;
		border-radius: 20rpx;
	}

	.mystery-box-commodity-l {
		flex: 1;
	}

	.mystery-box-commodity-r {
		flex: 2.5;
	}

	.mystery-box-commodity-r1 {
		line-height: 2;
	}

	.mystery-box-commodity-r2 {
		font-size: smaller;
		color: #888;
	}

	.creator-story {}

	.creator-info {
		display: flex;
		color: #888;
		align-items: center;
		padding-bottom: 16rpx;
		padding-left: 16rpx;
		padding-right: 16rpx;
	}

	.creator-info-r {
		padding-left: 20rpx;
		flex: 1;
		width: 0;
		padding-right: 16rpx;
	}

	.creator-info-rt {
		font-size: 26rpx;
	}

	.creator-info-rb {
		color: #353535;
	}

	.creator-info-r2 {
		text-align: right;
		color: #353535;
		font-size: small;
	}

	.story-title {
		color: #353535;
		font-size: 36rpx;
		padding-bottom: 16rpx;
		padding-left: 16rpx;
		padding-top: 16rpx;
	}

	.story-content {
		display: flex;
		flex-direction: column;
	}

	.story-content-pic {}

	.price-info {
		display: flex;
		color: #353535;
		font-size: large;
		font-weight: bold;
		line-height: 4;
	}

	.price-info view {
		padding-right: 8rpx;
	}

	.buy-now {
		background: #353535;
		font-size: large;
		font-weight: bold;
		color: white;
		padding: 20rpx 60rpx;
	}

	.sell-out {
		background: #c9c9c9;
		font-size: large;
		font-weight: bold;
		color: white;
		padding: 20rpx 60rpx;
	}

	.for-sale {
		background: #4c4c4c;
		color: white;
		padding: 4rpx 60rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.for-sale1 {
		font-size: large;
	}

	.for-sale2 {
		line-height: 0;
	}

	.future-sale {
		background: #4c4c4c;
		color: white;
		padding: 2rpx 60rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.future-sale1 {
		font-size: large;
	}

	.future-sale2 {}

	.fixed-bottom-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.fixed-bottom {
		position: fixed;
		bottom: 0rpx;
		left: 0rpx;
		width: 100%;
		background: #ffffff;
		padding-left: 32rpx;
		padding-right: 32rpx;
	}

	.collection-info {
		display: flex;
		justify-content: space-around;
	}

	.collection-info-sub {}

	.chain-tip {
		padding-left: 16rpx;
		font-size: smaller;
		color: #888;
		line-height: 2;
		display: flex;
		align-items: center;
	}

	.collection-name {
		padding-bottom: 16rpx;
		display: flex;
		justify-content: space-between;
		padding-right: 16rpx;
		align-items: center;
	}

	.collection-name-inner {
		color: #4c4c4c;
		font-size: large;
		font-weight: bold;
		padding-left: 16rpx;
		padding-right: 16rpx;
		flex: 1;
	}

	.limit-block {
		display: flex;
		align-items: center;
	}

	.limit {
		font-size: small;
		padding-left: 10rpx;
		padding-right: 10rpx;
		background: #f9c371f2;
		color: #767272;
	}

	.quantity {
		font-size: small;
		padding-left: 10rpx;
		padding-right: 10rpx;
		background: #7c7c7c;
		color: #f9c371f2;
	}

	.page-content {
		padding-bottom: 140rpx;
	}
</style>
