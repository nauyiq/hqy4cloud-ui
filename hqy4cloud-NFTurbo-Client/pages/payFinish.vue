<template>
	<view>
		<view class="no-data">
			<view class="pay-result">
				<view>
					<u-icon name="checkbox-mark" size="68" color="#42b983"></u-icon>
				</view>
				<view class="pay-result-text">支付完成</view>
				
				<view class="pay-result-text-tips">跳转中({{coutdown}})...</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				coutdown: 5
			}
		},
		onLoad() {		
			let countdown = 5;
			setInterval(() => {
				this.coutdown = countdown--;
				
				if(countdown === 0) {
					uni.reLaunch({
						url: "/pages/my"
					});
				}
			}, 1000);
		},
		methods: {

		}
	}
</script>

<style>
	.no-data {
		padding-top: 64rpx;
	}
	.pay-result {
		text-align: center;
		line-height: 5rpx;
		vertical-align: -5rpx;
	}
	.pay-result-text {
		font-size: 38rpx;
		margin-top: 32rpx;
	}
	.pay-result-text-tips {
		margin-top: 58rpx;
	}
</style>
