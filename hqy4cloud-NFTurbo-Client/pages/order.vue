<template>
	<view class="page-content">
		<u-modal v-model="showCancelModalFlag" title="提示" :show-cancel-button="true" cancel-text="暂时不要"
			confirm-text="取消交易" content="是否要取消交易" @confirm="cancelPay">
		</u-modal>
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
		<u-popup v-model="showPayModalFlag" mode="bottom" border-radius="14" :closeable="true">
			<view class="pay-modal">
				<view class="pay-modal-amount">
					<text>￥</text><text class="pay-modal-amount-value">{{moneyFormat(selectedOrder.orderAmount)}}</text>
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
		<view class="custom-tabs">
			<u-tabs :list="tabs" :is-scroll="false" :current="currentTab" @change="switchTab"></u-tabs>
		</view>
		<view>
			<view class="no-data" v-show="noDataFlag">
				<u-empty text="暂无数据" mode="favor"></u-empty>
			</view>
			<view>
				<view class="order-record" v-for="orderRecord in orderRecords"
					@click="payOrderDetailPage(orderRecord.orderId)">
					<view class="order-record-content">
						<view class="order-record-content-top">
							<view class="order-record-content-top-l">
								订单编号：{{orderRecord.orderId}}
							</view>
							<view class="order-record-content-top-r">
								<view class="payment-state">
									<u-icon v-show="orderRecord.orderState === 'CREATE'" name="clock-fill" size="26"></u-icon>
									<text v-show="orderRecord.orderState === 'CREATE'" class="payment-state-txt">待支付</text>
									<text v-show="orderRecord.orderState === 'PAID'" class="payment-state-txt">已支付</text>
									<text v-show="orderRecord.orderState === 'FINISH'" class="payment-state-txt">已完成</text>
									<text v-show="orderRecord.orderState === 'CLOSE'" class="payment-state-txt">已关闭</text>
								</view>
							</view>
						</view>
						<view class="order-record-content-middle">
							<view class="order-record-content-middle-l">
								<u-image class="collection-cover" width="120rpx" height="120rpx" border-radius="10"
									:src="orderRecord.goodsPicUrl">
								</u-image>
							</view>
							<view class="order-record-content-middle-r">
								<view class="collection-name">
									<view class="collection-name-l">
										{{orderRecord.goodsName}}
									</view>
									<!-- <view class="collection-name-r">
										<u-tag text="盲盒" type="primary" mode="dark" size="mini"></u-tag>
									</view> -->
								</view>
								<view>卖家: {{orderRecord.sellerName}}</view>
							</view>
						</view>
						<view class="order-record-content-bottom">
							<view class="order-record-time">
								{{orderRecord.createTime}}
							</view>
							<view class="order-record-amount">实付款：￥{{moneyFormat(orderRecord.orderAmount)}}</view>
						</view>
						<view v-show="orderRecord.orderState == 'CREATE'">
							<u-line color="#9c9c9c"></u-line>
							<view class="order-record-actions">
								<view class="cancel-btn">
									<u-button type="error" size="mini" @click.stop="showCancelModal(orderRecord)">取消订单
									</u-button>
								</view>
								<view>
									<u-button type="primary" size="mini" @click.stop="showPayModal(orderRecord)">立即付款
									</u-button>
								</view>
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
				tabs: [{
					name: '全部',
					value: '',
				}, {
					name: '待付款',
					value: 'CONFIRM'
				}, {
					name: '已付款',
					value: 'PAID'
				}, {
					name: '已完成',
					value: 'FINISH'
				}, {
					name: '已关闭',
					value: 'CLOSED'
				}],
				currentTab: 0,
				pageNum: 1,
				loadingState: 'loadmore',
				pullDownRefreshFlag: false,
				noDataFlag: false,
				orderRecords: [],
				showPayModalFlag: false,
				showCancelModalFlag: false,
				selectedOrder: '',
				tokenId: '',
				showPayQRCode: false,
				payQRCodeURL: '',
				checkToken: '',
				payOrderId: ''
			}
		},
		onLoad() {
			this.findByPage();
			this.getToken();
		},
		onReachBottom() {
			this.nextPage();
		},
		onPullDownRefresh() {
			this.pullDownRefreshFlag = true;
			this.refreshData();
		},
		methods: {
			getToken() {
				this.$u.get('/token/get', {
					scene: 'orderList'
				}).then(res => {
					if (res.data) {
						this.checkToken = res.data;
					}
				})
			},
			confirmPay() {
				this.$u.post('/trade/pay', {
					orderId: this.selectedOrder.orderId,
					payChannel: 'WECHAT',
					token: this.token
				}).then(res => {
					if(res.success) {					
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
						}, 300)
						
						return;
					}
					
					uni.showToast({
						icon: 'error',
						title: res.message,
						duration: 2000
					});
				});
			},
			
			payFinish() {
				this.$u.get('/order/getPayStatus', {
					payOrderId: this.payOrderId,
				}).then(res => {
					if(res.data.state !== 'FINISH' && res.data.state !== 'PAID') {
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
					uni.showToast({
						icon: 'success',
						title: '支付成功!',
						duration: 2000,
						mask: true,
						complete: () => {
							this.refreshData();
						}
					});
				
					
				});
			},
			cancelPay() {
				this.$u.post('/trade/cancel', {
					orderId: this.selectedOrder.orderId,
					token: this.checkToken
				}).then(res => {
					if(res.success) {
						uni.showToast({
							icon: 'success',
							title: '取消成功!',
							duration: 2000,
							mask: true,
							complete: function() {
								this.refreshData();
							}
						});
						
						return;
					}
					
					uni.showToast({
						icon: 'error',
						title: '取消失败',
						duration: 2000
					});
				});
			},

			showCancelModal(order) {
				this.selectedOrder = order;
				this.showCancelModalFlag = true;
			},

			showPayModal(order) {
				this.selectedOrder = order;
				this.showPayModalFlag = true;
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

			payOrderDetailPage(id) {
				uni.navigateTo({
					url: '../payOrderDetail/payOrderDetail?id=' + id
				});
			},

			switchTab(index) {
				this.currentTab = index;
				this.refreshData();
			},

			refreshData() {
				this.pageNum = 1;
				this.loadingState = 'loading';
				this.findByPage();
			},

			nextPage() {
				if (this.loadingState == 'nomore') {
					return;
				}
				this.pageNum = this.pageNum + 1;
				this.findByPage();
			},

			findByPage() {
				if (this.pageNum == 1) {
					this.orderRecords = [];
				}
				const queryParam = {
					pageSize: 10,
					currentPage: this.pageNum
					// pageNum: this.pageNum
				};
				
				const cv = this.tabs[this.currentTab].value;
				if(cv) {
					queryParam.state = cv
				}
				this.loadingState = 'loading';
				this.$u.get('/order/orderList', queryParam).then(res => {
					if(res.data.length == 0) {
						this.noDataFlag = true;
						return;
					}
					
					this.noDataFlag = false;
					this.orderRecords = this.orderRecords.concat(res.data);
					
					if (this.pullDownRefreshFlag) {
						this.pullDownRefreshFlag = false;
						uni.stopPullDownRefresh();
					}
					
					if (this.orderRecords.length == res.total) {
						this.loadingState = 'nomore';
					}
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
	.custom-tabs {
		padding-bottom: 20rpx;
	}

	.order-record {
		padding-left: 32rpx;
		padding-right: 32rpx;
		padding-bottom: 20rpx;
	}


	.order-record-content {
		background: #e7e7e7;
		padding-top: 10rpx;
		padding-bottom: 10rpx;
		border-radius: 20rpx;
		font-size: small;
	}

	.order-record-content-top {
		display: flex;
		justify-content: space-between;
		line-height: 2;
		padding-left: 20rpx;
		padding-right: 20rpx;
	}

	.order-record-content-top-l {
		color: #888;
	}

	.order-record-content-top-r {
		color: #18b566;
		font-weight: bold;
	}

	.cancel-state {
		color: #82848a;
	}

	.payment-state {
		color: #ff9900;
	}

	.payment-state-txt {
		padding-left: 4rpx;
	}

	.order-record-content-middle {
		display: flex;
		align-items: center;
		padding: 20rpx;

	}

	.order-record-content-middle-l {
		flex: 1;
	}

	.order-record-content-middle-r {
		flex: 2.5;
		align-self: flex-start;
	}

	.order-record-content-bottom {
		display: flex;
		justify-content: space-between;
		line-height: 2;
		padding-left: 20rpx;
		padding-right: 20rpx;
	}


	.order-record-time {
		color: #888;
	}

	.order-record-amount {
		color: black;
	}

	.order-record-actions {
		display: flex;
		justify-content: flex-end;
		padding-left: 20rpx;
		padding-right: 20rpx;
		padding-top: 10rpx;
	}

	.cancel-btn {
		padding-right: 28rpx;
	}

	.collection-name {
		display: flex;
		justify-content: space-between;
	}

	.collection-name-l {
		font-weight: bold;
	}

	.collection-name-r {}
</style>
