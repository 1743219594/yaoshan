<template>
	<view class="container">
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">LOGIN</view>
			<view class="welcome">
				欢迎使用药食同源大健康
			</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">邀请码</text>
					<input type="number" :value="inviteCode" placeholder="请输入邀请码" data-key="mobile"
						@input="inputChange" />
				</view>
			</view>
			<button class="confirm-btn" withCredentials="true" @click="getuserinfo" open-type="getUserInfo" :disabled="logining">微信快捷登录</button>
			<button class="confirm-btn" @click="navtoMerchant" style="margin-top: 30upx;"
				:disabled="logining">我想成为商家</button>

			<button @click="tologin">测试登录</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';

	export default {
		data() {
			return {
				logining: false,
				to: '',
				inviteCode: '',
				wechatUserInfo: {}
			}
		},
		onLoad(options) {
			this.inviteCode = options.inviteCode
			var to = options.to
			if (to) {
				this.to = unescape(to);
			}
			
		},
		computed: {
			...mapState(['applicationConfig'])
		},
		methods: {
			...mapMutations(['login']),
			//微信小程序用户授权
			getuserinfo() {
				this.$api.msg("请求登录中......")
				let that = this;
				uni.login({
					provider: 'weixin',
					success: function(res) {
						console.log(res.code)
						that.wechatUserInfo.code = res.code;
						let requestData = {
							inviteCode: that.inviteCode,
							code: res.code
						};
						that.populateWechatUserInfo(requestData);
						that.$api.request.login(
							`consumer/login?code=${requestData.code}&inviteCode=${requestData.inviteCode}`,
							{},
							loginRes => {
								console.log(loginRes);
								var tokenId = loginRes.data.tokenId;
								uni.setStorageSync('userToken', tokenId);
								var provider = {
									name: "微信用户",
									photoUrl: "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132",
								}
								that.login(provider); //将用户信息保存起来
								that.loginRedirect();
							});
					}
				});
			},
			// 登录后跳转
			loginRedirect() {
				var that = this;
				if (that.to) {
					uni.navigateTo({
						url: that.to
					})
				} else {
					uni.switchTab({
						url: '/pages/user/user'
					})
				}
			},
			// 测试登录
			tologin() {
				var that = this;
				const username = '小明1'
				this.$api.request.test({},
					res => {
						var provider = {
							name: "微信用户",
							photoUrl: "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132",
						}
						uni.setStorage({ //缓存用户登陆状态
							key: 'userToken',
							data: res.message
						})
						that.login(provider);
					})
			},
			populateWechatUserInfo(requestData) {
				requestData.code = this.wechatUserInfo.code;
			},
			inputChange(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack() {
				uni.navigateBack();
			},
			// 跳转商家注册
			navtoMerchant() {
				uni.navigateTo({
					url: '/pages/public/register'
				})
			}
		},

	}
</script>

<style lang='scss'>
	page {
		background: #fff;
	}

	.container {
		padding-top: 75px;
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
	}

	.wrapper {
		position: relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
	}

	.back-btn {
		position: absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}

	.application-logo {
		text-align: center;

		image {
			width: 200upx;
			height: 200upx;
		}
	}

	.application-name {
		margin-top: 20upx;
		text-align: center;
		color: $font-color-base;
	}

	.left-top-sign {
		font-size: 120upx;
		color: $page-color-base;
		position: relative;
		/* left: -16upx; */
	}

	.right-top-sign {
		position: absolute;
		top: 80upx;
		right: -30upx;
		z-index: 95;

		&:before,
		&:after {
			display: block;
			content: "";
			width: 400upx;
			height: 80upx;
			background: #b4f3e2;
		}

		&:before {
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}

		&:after {
			position: absolute;
			right: -198upx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}

	.left-bottom-sign {
		position: absolute;
		left: -270upx;
		bottom: -320upx;
		border: 100upx solid #d0d1fd;
		border-radius: 50%;
		padding: 180upx;
	}

	.welcome {
		position: relative;
		text-align: center;
		top: -90upx;
		font-size: 46upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0, 0, 0, .3);
	}

	.input-content {
		padding: 0 60upx;
	}

	.input-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 0 30upx;
		background: $page-color-light;
		height: 120upx;
		border-radius: 24px;
		margin-bottom: 50upx;

		&:last-child {
			margin-bottom: 0;
		}

		.tit {
			height: 50upx;
			line-height: 56upx;
			font-size: $font-sm+2upx;
			color: $font-color-base;
		}

		input {
			height: 60upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			width: 100%;
		}
	}

	.confirm-btn {
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 70upx;
		background: $button-color-dark;
		color: #fff;
		font-size: $font-lg;

		&:after {
			border-radius: 100px;
		}
	}

	.forget-section {
		font-size: $font-sm+2upx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40upx;
	}

	.register-section {
		position: absolute;
		left: 0;
		bottom: 50upx;
		width: 100%;
		font-size: $font-sm+2upx;
		color: $font-color-base;
		text-align: center;

		text {
			color: $font-color-spec;
			margin-left: 10upx;
		}
	}
</style>