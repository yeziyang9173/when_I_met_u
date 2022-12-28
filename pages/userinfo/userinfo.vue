<template>
	<view>
		{{nickname}}
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatarUrl: "",
				nickname: ""
			}
		},
		methods: {},
		onReady() {
			wx.getUserInfo().then(res => {
				console.log(res)
				this.nickname = res.userInfo.nickName
			})
		}
	}
</script>

<style>

</style>
