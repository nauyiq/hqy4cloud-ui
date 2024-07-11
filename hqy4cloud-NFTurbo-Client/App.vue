<script>
	export default {
		globalData: {},
		onLaunch() {
		},
		onShow() {
			// #ifdef APP-PLUS
			// var args = plus.runtime.arguments;
			// if (args) {
			// 	setTimeout(function() {
			// 		uni.navigateTo({
			// 			url: '../transfer/transfer?c2bOrderNo=' + args.split('://')[1]
			// 		});
			// 	}, 1400);
			// }
			// #endif
		},
		onHide() {
			// #ifdef APP-PLUS
			// plus.runtime.arguments = '';
			// #endif
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
</style>