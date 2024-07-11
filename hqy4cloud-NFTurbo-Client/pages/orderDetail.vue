<template>
	<view class="page-content">
		<u-modal v-model="showCancelModalFlag" title="提示" :show-cancel-button="true" cancel-text="暂时不要"
			confirm-text="取消交易" content="是否要取消交易" @confirm="cancelPay">
		</u-modal>
		<u-popup v-model="showPayModalFlag" mode="bottom" border-radius="14" :closeable="true">
			<view class="pay-modal">
				<view class="pay-modal-amount">
					<text>￥</text><text class="pay-modal-amount-value">{{moneyFormat(orderDetail.amount)}}</text>
				</view>
				<view class="pay-modal-pay-way-tip">选择支付方式</view>
				<view class="pay-modal-pay-ways">
					<view class="pay-modal-pay-way">
						<view class="pay-modal-pay-way-label">余额</view>
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
		<view class="order-state" v-show="orderDetail.orderState == 'CONFIRM'">
			<view class="payment-icon">
				<u-icon name="clock" size="140"></u-icon>
			</view>
			<view class="order-state-txt">待付款</view>
			<view class="payment-time-remaining">
				<text class="payment-time-remaining-l">支付剩余时间</text>
				
				<text class="payment-time">{{ timeRemaining }}</text>
			</view>
		</view>
		<view class="order-state" v-show="orderDetail.orderState == 'FINISH'">
			<view class="success-icon">
				<u-icon name="checkmark-circle" size="140"></u-icon>
			</view>
			<view class="order-state-txt">交易成功</view>
		</view>
		<view class="order-state" v-show="orderDetail.orderState == 'CLOSED'">
			<view class="cancel-icon">
				<u-icon name="info-circle" size="140"></u-icon>
			</view>
			<view class="order-state-txt">已关闭</view>
		</view>
		<view class="commodity-info">
			<view class="commodity-info-l">
				<u-image width="130rpx" height="200rpx" border-radius="10" :src="orderDetail.goodsPicUrl">
				</u-image>
			</view>
			<view class="commodity-info-r">
				<view class="commodity-info-r1">{{orderDetail.goodsName}}</view>
				<view class="commodity-info-r2">{{orderDetail.sellerName}}</view>
			</view>
		</view>
		<view class="order-items">
			<view class="order-item">
				<view class="order-item-label">订单金额</view>
				<view class="order-item-content">{{moneyFormat(orderDetail.orderAmount)}} 元</view>
			</view>
			<view class="order-item">
				<view class="order-item-label">交易数量</view>
				<view class="order-item-content">{{orderDetail.itemCount}}</view>
			</view>
			<view class="order-item">
				<view class="order-item-label">创建时间</view>
				<view class="order-item-content">{{formatTimestamp(orderDetail.orderConfirmedTime)}}</view>
			</view>
			<view class="order-item" v-show="orderDetail.orderState == 'CLOSED'">
				<view class="order-item-label">关闭时间</view>
				<view class="order-item-content">{{formatTimestamp(orderDetail.orderClosedTime)}}</view>
			</view>
			<view class="order-item" v-show="orderDetail.orderState == 'FINISH'">
				<view class="order-item-label">支付时间</view>
				<view class="order-item-content">{{formatTimestamp(orderDetail.paySucceedTime)}}</view>
			</view>
			<view class="order-item">
				<view class="order-item-label">订单编号</view>
				<view class="order-item-content">{{orderDetail.orderId}}</view>
			</view>
			<view class="order-item" v-show="orderDetail.orderState == 'FINISH'">
				<view class="order-item-label">支付方式</view>
				<view class="order-item-content">微信</view>
			</view>
			
			
		</view>
		<view class="order-record-actions" v-show="orderDetail.orderState == 'CONFIRM'">
			<view class="cancel-btn">
				<u-button class="custom-btn" type="error" @click="showCancelModalFlag = true;">取消订单</u-button>
			</view>
			<view class="pay-btn">
				<u-button class="custom-btn" type="primary" @click="showPayModalFlag = true;">去付款</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showPayModalFlag: false,
				showCancelModalFlag: false,
				orderId: '',
				orderDetail: '',
				timeRemaining : ''
			}
		},
		onLoad(option) {
			this.orderId = option.id;
			this.getOrderDetail();
		},
		methods: {
			confirmPay() {
				this.$u.post('/trade/pay', {
					orderId: this.orderId,
				}).then(res => {
					uni.showToast({
						icon: 'success',
						title: '支付成功!',
						duration: 2000,
						mask: true,
						complete: function() {
							this.showPayModalFlag = false;
							this.getOrderDetail();
						}
					});
				});
			},
			
			formatTimestamp(timestamp) {
				const date = new Date(timestamp);
				const year = date.getFullYear();
				const month = ('0' + (date.getMonth() + 1)).slice(-2); // 加1是因为月份从0开始
				const day = ('0' + date.getDate()).slice(-2);
				const hours = ('0' + date.getHours()).slice(-2);
				const minutes = ('0' + date.getMinutes()).slice(-2);
				const seconds = ('0' + date.getSeconds()).slice(-2);
				return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
			},
			
			updateTimeRemaining(payExpireTime) {
			  this.timeRemaining = this.getTimeDifference(payExpireTime);
			},
			
			getTimeDifference(targetTime) {
			  const now = new Date().getTime();
			  const timeLeft = targetTime - now;
					
			  if (timeLeft <= 0) {
			    return '00:00';
			  }
			
			  const seconds = Math.floor((timeLeft / 1000) % 60);
			  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
			
			  return `${this.pad(minutes)}:${this.pad(seconds)}`;
			},
			
			pad(number) {
			    return number < 10 ? '0' + number : number;
			},

			cancelPay() {
				this.$u.post('/trade/cancel', {
					orderId: this.orderId,
				}).then(res => {
					uni.showToast({
						icon: 'success',
						title: '取消成功!',
						duration: 2000,
						mask: true,
						complete: () => {
							this.getOrderDetail();
						}
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

			getOrderDetail() {
				var that = this;
				this.$u.get('/order/orderDetail', {
					orderId: that.orderId,
				}).then(res => {
					that.orderDetail = res.data;
					
					if(res.data.orderState == "CONFIRM"){
						that.updateTimeRemaining(res.data.payExpireTime);
	
						setInterval(() => {
							that.updateTimeRemaining(res.data.payExpireTime);
						}, 1000);
					}
					
				});
			},
		}
	}
</script>

<style>
	.order-items {
		padding-bottom: 32rpx;
	}

	.order-item {
		display: flex;
		justify-content: space-between;
		padding-left: 32rpx;
		padding-right: 32rpx;
		line-height: 2;
		font-size: small;
	}

	.order-item-label {
		flex-basis: 25%;
	}

	.order-item-content {
		opacity: 0.6;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: right;
		color: #000;
	}

	.order-record-actions {
		display: flex;
		justify-content: center;
		padding-top: 32rpx;
	}

	.cancel-btn {
		padding-right: 20rpx;
	}

	.pay-btn {
		padding-left: 20rpx;
	}

	.custom-btn {
		width: 220rpx;
	}

	.commodity-info {
		background: #e7e7e7;
		padding-top: 10rpx;
		padding-bottom: 10rpx;
		border-radius: 20rpx;
		font-size: small;
		display: flex;
		padding-left: 40rpx;
		padding-right: 20rpx;
		margin: 32rpx;
	}

	.commodity-info-l {
		flex: 1;
	}

	.commodity-info-r {
		flex: 2.5;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding-left: 40rpx;
	}

	.commodity-info-r1 {
		font-weight: bold;
		font-size: larger;
	}

	.commodity-info-r2 {
		color: #7f7f7f;
	}

	.order-state {
		text-align: center;
		padding-top: 60rpx;
	}

	.success-icon {
		color: #3d9c6d;
	}

	.payment-icon {
		color: #7f7f7f;
	}

	.cancel-icon {
		color: #ff9900;
	}

	.order-state-txt {
		line-height: 2;
		font-size: large;
	}

	.payment-time-remaining {
		font-size: smaller;
		color: #7f7f7f;
	}

	.payment-time-remaining-l {
		padding-right: 8rpx;
	}
</style>
