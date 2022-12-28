<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
			wx.login();
			wx.cloud.init({
				env: "prod-2gsixybr509d60b5",
				traceUser: true
			});
			this.judgePage();
		},
		onShow: function() {
			console.log('App Show');
			wx.hideHomeButton()
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			judgePage() {
				if (this.isLoggedOrExpiration()) {
					uni.redirectTo({
						url: '/pages/index/index'
					})
				} else {
					uni.redirectTo({
						url: '/pages/login/login'
					})
				}
			},
			isLoggedOrExpiration() {
				const newTimeStamp = Date.parse(new Date())
				const date_expiration = wx.getStorageSync('expired_time');
				if (date_expiration) {
					if (newTimeStamp > date_expiration) {
						wx.clearStorageSync();
						return false
					} else {
						return true;
					}
				}
				// 未登录
				return false;
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
