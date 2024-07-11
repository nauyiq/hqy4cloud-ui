<template>
	<view class="page-content">
		<view class="home-title">
			<u-image width="90rpx" height="90rpx" src="/static/img/nft.png"></u-image>
			<view class="home-title-r">NFTurbo</view>
		</view>
		<view class="swiper-content">
			<u-swiper :list="swiperImgs" :autoplay="false" :effect3d="true" mode="dot" border-radius="0"
				effect3d-previous-margin="0"></u-swiper>
		</view>
		<view class="system-notice">
			<u-notice-bar mode="vertical" :list="noticeTitles" type="none" padding="18rpx 0rpx" :more-icon="true"
				@click="noticeDetailPage" @getMore="noticePage"></u-notice-bar>
		</view>
		
		<u-search placeholder="拖把数藏杠杠滴" v-model="searchKeyword" @search="search()" :showAction=false></u-search>
	

		<u-sticky offset-top="-100" :enable="enableStickyFlag" @fixed="stickyFixedFlag = true;"
			@unfixed="stickyFixedFlag = false;">
			<view class="sticky" :class="{'sticky-fixed':stickyFixedFlag}">
				<view class="top-nav">
					<view v-for="tab in tabs" :class="{'top-nav-selected':currentTab == tab.value}"
						@click="switchTab(tab.value)">{{tab.title}}</view>
				</view>
			</view>
		</u-sticky>
		
		<view class="collection-tab-content" v-show="currentTab == '1'">
			<view class="latest-collection" v-for="collection in latestCollections"
				@click="latestCollectionDetailPage(collection.id)">
				<image class="collection-cover" style="height: 480rpx; width: 100%;" :src="collection.cover"></image>
				<view class="collection-name">{{collection.name}}</view>
				<view class="quantity-block">
					<view class="limit">限量</view>
					<view class="quantity">{{collection.quantity}}份</view>
				</view>
				<view class="creator-block">
					<view class="price-info">
						<view>￥</view>
						<view>{{moneyFormat(collection.price)}}</view>
					</view>
				</view>
			</view>
			<view class="more-await">更多内容敬请期待</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				stickyFixedFlag: false,
				enableStickyFlag: true,
				tabs: [{
					title: '热卖藏品',
					value: '1'
				}
				],
				currentTab: '1',
				swiperImgs: [{
					image: '/static/img/banner2.png'
				},{
					image: '/static/img/banner1.png'
				}],
				latestCollections: [],
				latestMysteryBoxs: [],
				forSaleCollections: [],
				loadingState: 'loadmore',
				pullDownRefreshFlag: false,
				pageNum: 1,
				noDataFlag: false,
				notices: [],
				noticeTitles: [],
				searchKeyword: '', 
			}
		},
		onLoad() {
			this.findLatestCollectionByPage();
		},
		onShow() {
			this.enableStickyFlag = true;
		},
		onHide() {
			this.enableStickyFlag = false;
		},
		onReachBottom() {
			this.nextPage();
		},
		onPullDownRefresh() {
			this.pullDownRefreshFlag = true;
			this.refreshData();
		},
		methods: {
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

			switchTab(tab) {
				this.currentTab = tab;
				this.refreshData();
			},

			refreshData() {
				this.pageNum = 1;
				this.loadingState = 'loading';
				if (this.currentTab == '1') {
					this.findLatestCollectionByPage();
				} else if (this.currentTab == '2') {
					this.findLatestMysteryBoxByPage();
				} else if (this.currentTab == '3') {
					this.findForSaleCollection();
				}
			},

			nextPage() {
				if (this.loadingState == 'nomore') {
					return;
				}
				if (this.currentTab == '1') {
					this.pageNum = this.pageNum + 1;
					this.findLatestCollectionByPage();
				}
				if (this.currentTab == '2') {
					this.pageNum = this.pageNum + 1;
					this.findLatestMysteryBoxByPage();
				}
			},

			latestCollectionDetailPage(id) {
				uni.navigateTo({
					url: '/pages/nftDetail?id=' + id
				});
			},
			
			search() {
				// Triggered when Enter key is pressed in the search input
				this.refreshData(); // Reset data state before new search
				this.findLatestCollectionByPage(); // Call API method with current searchKeyword
			},
			
			findLatestCollectionByPage() {

				if (this.pageNum == 1) {
					this.latestCollections = [];
				}
				const queryParam = {
					pageSize: 5,
					currentPage: this.pageNum,
					state: 'SUCCEED'  ,
					keyword: this.searchKeyword,
				};
				this.loadingState = 'loading';
				
				this.$u.get('/collection/collectionList', queryParam).then(res => {
					const newRecords = res.data;
					const totalPage = res.data.totalPage;
					if (this.pullDownRefreshFlag) {
						this.pullDownRefreshFlag = false;
						uni.stopPullDownRefresh();
					}
					if (newRecords.length == 0) {
						this.loadingState = 'nomore';
					}
					if (totalPage == this.pageNum) {
						this.loadingState = 'nomore';
					}
					const oldRecords = this.latestCollections;
					for (let i = 0; i < newRecords.length; i++) {
						const flag = true;
						for (let j = 0; j < oldRecords.length; j++) {
							if (newRecords[i].id == oldRecords[j].id) {
								flag = false;
								break;
							}
						}
						if (flag) {
							oldRecords.push(newRecords[i]);
						}
					}
					this.noDataFlag = oldRecords.length == 0;
				});
			},

			findForSaleCollection() {
				this.$u.get('/collection/findForSaleCollection', {}).then(res => {
					this.forSaleCollections = res.data;
				});
			},
		}
	}
</script>

<style>
	page {
		height: 100% !important;
	}

	.system-notice {
		padding-top: 12rpx;
	}

	.home-title {
		display: flex;
		align-items: center;
		padding-bottom: 32rpx;
	}

	.home-title-r {
		font-size: 52rpx;
		padding-left: 40rpx;
		color: rgb(53 53 53 / 60%);
	}

	.more-await {
		color: #797c81;
		text-align: center;
		padding-top: 60rpx;
	}

	.sell-plan {
		color: #baa484;
		font-weight: bold;
		font-size: larger;
		font-style: oblique;
		padding-top: 20rpx;
	}

	.sell-date {
		padding-top: 12rpx;
		font-size: larger;
	}

	.sell-date-value {
		color: #353535;
		font-weight: bold;
		line-height: 2;
	}

	.sell-time {}

	.sell-time-value {
		color: #888;
		font-weight: bold;
		padding-bottom: 8rpx;
		font-size: smaller;
	}


	.sell-collection {
		display: flex;
		align-items: center;
		border-radius: 64rpx;
		margin-bottom: 20rpx;
		background: #e7e7e7;
	}

	.sell-collection-l {
		flex: 1;
	}

	.sell-collection-r {
		flex: 2;
		padding-left: 28rpx;
	}

	.sell-collection-r1 {
		color: #000000;
		line-height: 3;
		width: 400rpx;
	}

	.sell-collection-r2 {
		display: flex;
		font-size: small;
	}

	.sell-collection-r3 {
		color: #353535;
		display: flex;
		line-height: 3;
		font-weight: bold;
	}

	.sell-collection-r3 view {
		padding-right: 4rpx;

	}

	.collection-tab-content {}

	.latest-collection {
		position: relative;
		top: 4rpx;
		background: #e7e7e7;
		border-radius: 20rpx;
		padding-bottom: 20rpx;
		margin-bottom: 24rpx;
	}

	.state-tip {
		position: absolute;
		top: 40rpx;
		z-index: 500;
		left: 32rpx;
	}

	.state-block {
		display: inline-block;
		border-radius: 20rpx;
		background: #000000;
		padding-left: 12rpx;
		padding-right: 12rpx;
		padding-top: 6rpx;
		padding-bottom: 6rpx;
		font-size: small;
	}

	.state-block .u-icon {
		padding-right: 6rpx;
	}

	.sell-out {
		color: #aaa4a4;
	}

	.for-sale {
		color: #59d195;
	}

	.for-sale .u-countdown {
		padding-left: 8rpx;
	}

	.future-sale {
		color: #59d195;
	}

	.future-sale text {
		padding-left: 6rpx;
	}

	.collection-name {
		padding-top: 20rpx;
		padding-bottom: 20rpx;
		font-size: large;
		padding-left: 20rpx;
	}

	.collection-cover {
		border-radius: 20rpx 20rpx 0rpx 0rpx;
	}

	.quantity-block {
		display: flex;
		padding-left: 20rpx;
	}

	.limit {
		font-size: smaller;
		padding-left: 10rpx;
		padding-right: 10rpx;
		background: #f9c371f2;
		color: #767272;
	}

	.quantity {
		font-size: smaller;
		padding-left: 10rpx;
		padding-right: 10rpx;
		background: #7c7c7c;
		color: #f9c371f2;
	}

	.creator-block {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 10rpx;
		padding-left: 20rpx;
	}

	.creator-info {
		display: flex;
		color: #888;
		font-size: smaller;
		justify-content: center;
		align-items: center;
	}

	.creator-name {
		padding-left: 6rpx;
	}

	.price-info {
		display: flex;
		font-size: large;
		font-weight: bold;
	}

	.price-info view {
		padding-right: 8rpx;
	}

	.sticky {
		background-color: #ffffff;
	}

	.sticky-fixed {
		padding-bottom: 12rpx;
	}

	.top-nav {
		display: flex;
		color: #969696;
		font-size: 36rpx;
		line-height: 3;
	}

	.top-nav view {
		padding-right: 32rpx;
	}

	.top-nav-selected {
		color: #000000;
		font-weight: bold;
	}

	.page-content {
		padding-left: 32rpx;
		padding-right: 32rpx;
		padding-bottom: 140rpx;
		padding-top: 32rpx;
		// #ifdef APP-PLUS
		padding-top: 64rpx;
		// #endif
	}
	
	/* Existing styles */
	.search-bar {
		margin-top: 20rpx;
		padding: 12rpx;
		background-color: #f0f0f0;
		border-radius: 10rpx;
	}

	.search-input {
		width: 100%;
		height: 60rpx;
		font-size: 30rpx;
		padding: 10rpx;
		box-sizing: border-box;
		border: none;
		outline: none;
	}
	
	.search-icon {
		cursor: pointer;
		padding: 10px;
		border: 1px solid #ccc; /* Optional styling for icon container */
		border-radius: 4px;
		margin-left: 10px;
	}

	.search-icon i {
		font-size: 20px; /* Adjust icon size */
		color: #007bff; /* Adjust icon color */
	}
</style>
