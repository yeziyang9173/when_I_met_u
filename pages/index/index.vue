<template>
	<view class="calendar-content">
		总里程：{{allTrip}}km
		<br />
		骑行次数：{{cometimes}}
		<view v-if='showCalendar'>
			<uni-calendar class="uni-calendar--hook" :showMonth="true" @change="change" :selected="info.selected"
				:trip="info.trip" @monthSwitch="monthSwitch" />
		</view>
		<view v-if="showPanel">
			<view v-show="isWrited" class="card">
				<view v-for="daymark in dayInfo">
					<view class="info-card container">
						<view class="cross" @click="deleteCard(daymark.value)"></view>
						{{daymark.value}}
					</view>
				</view>

			</view>
			<view class="container">
				<uni-easyinput v-if="selectedDate" v-model="remark" type="textarea" :placeholder="placeholderText">
				</uni-easyinput>
			</view>
			<view class="btn-div"> <button class='sub-btn' @click="Submit">Submit</button>
			</view>


			<view v-show="isTripWrited">
				{{dayTrip}}
			</view>

			<view v-show="!isTripWrited">
				<view class="container">
					<uni-easyinput v-model="tripNum" type="number">
					</uni-easyinput>
				</view>
				<view class="btn-div">
					<button class='sub-btn' @click="SubmitTrip">Trip</button>
				</view>
			</view>



		</view>
	</view>

	<image class="exit" src="../../static/exit.png" @click="Logout()"></image>
</template>

<script>
	import moment from 'moment';
	import http from "../../utils/api.js";

	export default {
		components: {},
		data() {
			return {
				showCalendar: false,
				info: {
					lunar: true,
					range: true,
					insert: false,
					selected: [],
					trip: [],
					endDate: '2023 - 5 - 27',
					// endDate: moment(new Date()).format("YYYY-MM-DD"),
					startDate: "2022 - 5 - 27",
				},
				allTrip: '',
				cometimes: "",
				tripNum: '',
				selectedDate: moment(new Date()).format("YYYY-MM-DD"),
				remark: '',
				isWrited: false, // 判断当前选择的日期是否已经有日记了
				isTripWrited: false,
				dayInfo: '', //  展示当天信息
				dayTrip: "",
				flag: false,
				showPanel: true // 判断是否要展示下方的操作板，只有当selectedDate 不在本月的时候，才为false
			}
		},

		onReady() {

			if (this.isLoggedOrExpiration()) {
				Promise.all([this.QueryAll(), this.QueryAllTrip(), this.QuerySum()]).then((res) => {
					this.$nextTick(() => {

						this.showCalendar = true;
						res[0].data.forEach(item => {
							this.info.selected.push({
								date: moment(item.date).format("YYYY-MM-DD"),
							})
						})
						res[1].data.forEach(item => {
							this.info.trip.push({
								date: moment(item.date).format("YYYY-MM-DD"),
							})
						})

						this.cometimes = res[2].data[0]["count(*)"]
						this.allTrip = res[2].data[0]["sum(trip)"]
						// 判断加载该程序的时候，当日是否已经有了信息。
						this.Judge();
						if (this.isWrited) {
							this.QueryByDate(moment(new Date()).format("YYYY-MM-DD")).then(response => {
								this.dayInfo = response.data;
							})
						}
						this.JudgeTrip();
						if (this.isTripWrited) {
							this.QueryTripByDate(moment(new Date()).format("YYYY-MM-DD")).then((
								response) => {
								this.dayTrip = response.data;
							})
						}
					})
				})
				// this.QueryAll().then(res => {

				// })
			} else {
				uni.redirectTo({
					url: '/pages/login/login'
				})
			}
		},
		computed: {
			placeholderText() {
				return "Just type in what happened today or tell me how much you love me today."
			}
		},
		methods: {
			open() {
				this.$refs.calendar.open()
			},
			change(e) {
				this.isWrited = false;
				this.isTripWrited = false;
				this.selectedDate = e.fulldate;
				this.Judge();
				this.JudgeTrip();
				this.SearchInfo(e.fulldate);
				this.QueryTrip(e.fulldate);
				this.showPanel = true;
			},
			confirm(e) {
				// console.log('confirm 返回:', e)
			},
			monthSwitch(e) {
				const selectDateMonth = moment(this.selectedDate).month() + 1
				if (selectDateMonth !== e.month) {
					this.showPanel = false;
				} else {
					this.showPanel = true;
				}
			},
			deleteCard(value) {
				uni.showModal({
					title: '提示',
					content: '确认删除该条信息吗？',
					cancelText: "取消",
					confirmText: "删除",
					confirmColor: 'red',
					cancelColor: '#000000',
					success: (response) => {
						if (response.confirm) {
							// this.isWrited = false;
							const _this = this;
							this.Delete(value, _this).then(res => {
								this.$nextTick(() => {
									uni.showToast({
										title: '成功删除',
										icon: 'success',
										duration: 2000
									}).then(res => {
										this.InitData();
									})
								})
							})
						}
					}
				})
			},
			async QueryAll() {
				// let opt = {
				// 	url: '/queryAll',
				// 	method: "get"
				// }
				// return http.httpRequest(opt)

				return wx.cloud.callContainer({
					"config": {
						"env": "prod-0gtp8p5s0b7bf59c"
					},
					"path": "/v1/diary/queryAll",
					"header": {
						"X-WX-SERVICE": "meet1021",
						"content-type": "application/json"
					},
					"method": "GET",
					"data": ""
				});
			},
			async QueryAllTrip() {
				let opt = {
					url: '/queryAllTrip',
					method: "get"
				}

				return wx.cloud.callContainer({
					"config": {
						"env": "prod-0gtp8p5s0b7bf59c"
					},
					"path": "/v1/diary/queryAllTrip",
					"header": {
						"X-WX-SERVICE": "meet1021",
						"content-type": "application/json"
					},
					"method": "GET",
					"data": ""
				})
			},
			async QuerySum() {
				let opt = {
					url: '/sum',
					method: "get"
				}
				// return http.httpRequest(opt)

				return wx.cloud.callContainer({
					"config": {
						"env": "prod-0gtp8p5s0b7bf59c"
					},
					"path": "/v1/diary/sum",
					"header": {
						"X-WX-SERVICE": "meet1021",
						"content-type": "application/json"
					},
					"method": "GET",
					"data": ""
				})
			},
			async QueryByDate(date) {
				const formateData = moment(date).format("YYYY-MM-DD HH:mm:ss");
				let opt = {
					url: '/query',
					method: "get"
				}
				let param = {
					date: formateData
				};
				return wx.cloud.callContainer({
					"config": {
						"env": "prod-0gtp8p5s0b7bf59c"
					},
					"path": "/v1/diary/query",
					"header": {
						"X-WX-SERVICE": "meet1021",
						"content-type": "application/json"
					},
					"method": "GET",
					"data": param
				});

			},
			async QueryTripByDate(date) {
				const formateData = moment(date).format("YYYY-MM-DD");
				let opt = {
					url: '/queryTripByDate',
					method: "get"
				}
				let param = {
					date: formateData
				};
				return wx.cloud.callContainer({
					"config": {
						"env": "prod-0gtp8p5s0b7bf59c"
					},
					"path": "/v1/diary/queryTripByDate",
					"header": {
						"X-WX-SERVICE": "meet1021",
						"content-type": "application/json"
					},
					"method": "GET",
					"data": param
				})
			},
			QueryTrip(date) {

				this.QueryTripByDate(date).then(res => {
					if (res.data.length === 0) {
						this.isTripWrited = false

					} else {
						this.dayTrip = res.data;
						this.isTripWrited = true
					}
				})
			},
			async AddDiary() {
				let opt = {
					url: '/addDiary',
					method: "get"
				}
				let param = {
					date: this.selectedDate,
					remark: this.remark
				};
				return wx.cloud.callContainer({
					"config": {
						"env": "prod-0gtp8p5s0b7bf59c"
					},
					"path": "/v1/diary/addDiary",
					"header": {
						"X-WX-SERVICE": "meet1021",
						"content-type": "application/json"
					},
					"method": "GET",
					"data": param
				});
			},
			async AddTrip() {
				let opt = {
					url: '/addTrip',
					method: "get"
				}
				let param = {
					date: this.selectedDate,
					trip: this.tripNum
				};
				// return http.httpRequest(opt, param)
				return wx.cloud.callContainer({
					"config": {
						"env": "prod-0gtp8p5s0b7bf59c"
					},
					"path": "/v1/diary/addTrip",
					"header": {
						"X-WX-SERVICE": "meet1021",
						"content-type": "application/json"
					},
					"method": "GET",
					"data": param
				})
			},
			async Delete(thisDaymark, that) {
				const formateData = moment(this.selectedDate).format("YYYY-MM-DD HH:mm:ss");
				let opt = {
					url: '/update',
					method: "get"
				}

				if (that.dayInfo.length == 1) {
					let param = {
						date: formateData,
					};
					return wx.cloud.callContainer({
						"config": {
							"env": "prod-0gtp8p5s0b7bf59c"
						},
						"path": "/v1/diary/deleteDiary",
						"header": {
							"X-WX-SERVICE": "meet1021",
							"content-type": "application/json"
						},
						"method": "GET",
						"data": param
					});
				} else {
					let targetIndex = -1;
					let i;
					for (i = 0; i < that.dayInfo.length; i = i + 1) {
						console.log(that.dayInfo[i])
						if (that.dayInfo[i].value === thisDaymark) {
							targetIndex = i;
						}
					}
					that.dayInfo.splice(targetIndex, 1);
					let param = {
						date: formateData,
						remark: JSON.stringify(that.dayInfo)
					};

					return wx.cloud.callContainer({
						"config": {
							"env": "prod-0gtp8p5s0b7bf59c"
						},
						"path": "/v1/diary/update",
						"header": {
							"X-WX-SERVICE": "meet1021",
							"content-type": "application/json"
						},
						"method": "GET",
						"data": param
					});
				}
				// return http.httpRequest(opt, param)
			},
			Submit() {
				uni.showLoading({
					title: '加载中...'
				});
				this.remark = this.remark.trim();
				if (this.remark.length !== 0) {
					this.AddDiary().then(res => {
						uni.hideLoading();
						uni.showToast({
							title: '添加成功',
							icon: 'success',
							duration: 2000
						}).then(res => {
							this.InitData();
						})
					})
				} else {
					uni.hideLoading();
					uni.showToast({
						title: '不能为空',
						icon: 'error',
						duration: 2000
					})
				}
			},
			InitData() {
				this.remark = '';
				Promise.all([this.QueryAll(), this.QueryAllTrip(), this.QuerySum()]).then((res) => {
					this.$nextTick(() => {
						res[0].data.forEach(item => {
							this.info.selected.push({
								date: moment(item.date).format("YYYY-MM-DD"),
							})
						})
						res[1].data.forEach(item => {
							this.info.trip.push({
								date: moment(item.date).format("YYYY-MM-DD"),
							})
						})
						this.cometimes = res[2].data[0]["count(*)"]
						this.allTrip = res[2].data[0]["sum(trip)"]
						// 判断加载该程序的时候，当日是否已经有了信息。
						this.Judge();
						if (this.isWrited) {
							this.QueryByDate(moment(this.selectedDate).format("YYYY-MM-DD")).then(
								response => {
									this.dayInfo = response.data;
								})
						}
						this.JudgeTrip();
						if (this.isTripWrited) {
							this.QueryTripByDate(moment(this.selectedDate).format("YYYY-MM-DD")).then(
								response => {
									this.dayTrip = response.data;
								})
						}
					})
				})
			},
			Judge() {
				this.info.selected.forEach(item => {
					if (item.date == this.selectedDate) {
						this.isWrited = true;
					}
				})
			},
			JudgeTrip() {
				this.info.trip.forEach(item => {
					if (item.date == this.selectedDate) {
						this.isTripWrited = true;
					}
				})
			},
			SearchInfo(date) {
				this.QueryByDate(date).then(res => {
					if (res.length != 0) {
						this.dayInfo = res.data;
					}
				})
			},
			refresh() {
				uni.redirectTo({
					url: '/pages/index/index'
				})
			},
			Logout() {
				wx.clearStorageSync();
				uni.redirectTo({
					url: '/pages/login/login'
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
			},
			SubmitTrip() {
				uni.showLoading({
					title: '加载中...'
				});
				this.tripNum = this.tripNum.trim();

				if (this.tripNum.length !== 0) {
					this.AddTrip().then(res => {
						uni.hideLoading();
						uni.showToast({
							title: '添加成功',
							icon: 'success',
							duration: 2000
						}).then(res => {
							this.InitData();
							this.isTripWrited = false;
						})
					})
				} else {
					uni.hideLoading();
					uni.showToast({
						title: '里程数不能为空',
						icon: 'error',
						duration: 2000
					})
				}

			}
		}
	}
</script>

<style>
	.calendar-content {
		padding: 20px;
	}

	.example-body {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.container {
		padding: 10px;
	}

	#editor {
		width: 100%;
		height: 300px;
		background-color: #CCCCCC;
	}

	button {
		margin-top: 10px;
		width: 100px;
	}

	.btn-div {
		display: flex;
		flex-direction: row;
	}

	.info-card {
		width: 100%;
		height: 150px;
		border-radius: 6px;
		background: #ebb9a3;
		padding: 20px;
		font-size: 14px;
		box-sizing: border-box;
		position: relative;
		white-space: pre-wrap;
		margin-top: 20px;
	}

	.sub-btn {
		background-color: #f99475;
		border-radius: 2px;
		color: #ffffff;
	}

	/**
	 * 叉号
	 */

	.cross {
		display: block;
		width: 60px;
		height: 60px;
		position: absolute;
		top: 0;
		right: 0;
	}

	.cross::before,
	.cross::after {
		content: "";
		width: 16px;
		height: 2px;
		position: absolute;
		top: 50%;
		left: 50%;
		margin: -1px 0 0 -8px;
		transform: rotate(45deg);
		border-radius: 2px;
		background-color: #9da2a8;
	}

	.cross::after {
		transform: rotate(-45deg);
	}

	/**
	 * 叉号 end
	 */

	.exit {
		position: absolute;
		top: 0;
		right: 10px;
		z-index: 5;
		width: 30px;
		height: 30px;
	}
</style>
