const install = (Vue, vm) => {
	Vue.prototype.$u.http.setConfig({
		baseUrl: vm.baseUrl,
		originalData: true, 
		loadingText: '加载中...', 
		header: {
			// FIXME 修改
			// 'content-type': 'application/json;charset=UTF-8'
		}
	});

	Vue.prototype.$u.http.interceptor.request = (config) => {
		var tokenValue = uni.getStorageSync('tokenValue');

		if(tokenValue) {
			config.url = config.url.indexOf('?') !== -1
							? `${config.url}&satoken=${tokenValue}`
							: `${config.url}?satoken=${tokenValue}`
			
			config.header['satoken'] = tokenValue;
		}

		return config;
	}

	Vue.prototype.$u.http.interceptor.response = (res) => {
		if (res?.statusCode == 200) {
			return res.data;
		} else {
			return false;
		}
	}
}

export default {
	install
}
