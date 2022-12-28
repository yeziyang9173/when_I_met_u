<template>
	<view class="bg">
		<image class="bg-image" src="../../static/bgr.jpg"></image>

		<view class="title">
			<view class="title1">
				{{titletext1}}
			</view>
			<view class="title2">
				{{titletext2}}
			</view>
		</view>
		<view class="action-div">
			<uni-easyinput v-model="name" placeholder="Username"> </uni-easyinput>
			<uni-easyinput v-model="password" type="password" placeholder="Password"
				styles="margin-top:20px;border: 2px solid #537189 !important;">
			</uni-easyinput>
			<span v-if='showerr' class='error-tip'>密码有误，重新输入</span>
			<button @click="login" class="btn">Login</button>
		</view>
	</view>
</template>

<script>
	import http from '../../utils/api.js';
	export default {
		data() {
			return {
				name: "",
				password: "",
				showerr: false,
				titletext1: "还想和你讨论宇宙和天空\n",
				titletext2: "或是沙滩上的碎石和人生"

			}
		},
		onReady() {
			if (this.isLoggedOrExpiration()) {
				uni.redirectTo({
					url: '/pages/index/index'
				})
			}

		},
		methods: {
			verify() {
				let opt = {
					url: '/verify',
					method: "get"
				}
				let param = {
					user_name: this.name,
					user_password: this.password
				};


				return wx.cloud.callContainer({
					"config": {
						"env": "prod-0gtp8p5s0b7bf59c"
					},
					"path": "/v1/diary/verify",
					"header": {
						"X-WX-SERVICE": "meet1021",
						"content-type": "application/json"
					},
					"method": "GET",
					"data": param
				});

				// return http.httpRequest(opt, param)
			},
			login() {
				this.verify().then(res => {
					if (res.data.result) {
						wx.setStorageSync('session_key', res.data.session_key);
						wx.setStorageSync('expired_time', Date.parse(new Date()) + 60 * 60 * 24 * 7 * 1000)
						uni.redirectTo({
							url: '/pages/index/index'
						})
					} else {
						this.showerr = true;
					}
				})
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
	.bg {
		position: relative;
		width: 100%;
		height: 100vh;

	}

	.error-tip {
		color: red;
		font-size: 12px;
	}

	.bg-image {
		width: 100%;
		height: 100vh;
		position: absolute;
		top: 0;
		left: 0;
	}

	.btn {
		background: transparent;
		border-radius: 6px;
		border: 2px solid #537189;
		margin-top: 20px;
		height: 40px;
		color: #44647B;
		font-size: 14px;
		line-height: 40px;
		width: 100%;
		box-sizing: border-box;
	}

	.input-div {
		margin-bottom: 20px;
	}


	.action-div {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: 10%;
	}

	/deep/ .uni-easyinput {
		border: 2px solid #537189;
		height: 40px;
		margin-top: 20px;
		border-radius: 6px;
		width: 100%;
		box-sizing: border-box;
	}

	.title {
		font-size: 30px;
		white-space: break-spaces;
		position: absolute;
		width: 100%;
		top: 15%;
		left: 50%;
		transform: translateX(-50%);
		z-index: 5;
		text-align: center;
		font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
	}

	.title1 {
		color: #3b5162;
	}

	.title2 {
		color: #FFFFFF;
		margin-top: 38px;

	}
</style>
