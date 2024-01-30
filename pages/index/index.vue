<template>
	<view class="container">
		<view class="navigation-head">
			<view class="status_bar" :style="{height:statusBarHeight+'px'}">
			</view>
			<view class="title" :style="{height:titleBarHeight+5+'px'}"> 药食同源大健康 </view>
		</view>
		<!-- 小程序头部兼容 -->
		<!-- #ifdef MP||H5 -->
		<view class="mp-search-box">
			<input class="ser-input" type="text" value="输入关键字搜索" disabled @click="navSearch" />
		</view>
		<!-- #endif -->
		<!-- 头部轮播 -->
		<view class="carousel-section">
			<!-- 标题栏和状态栏占位符 -->
			<view class="titleNview-placing"></view>
			<!-- 背景色区域 -->
			<view class="titleNview-background"></view>
			<swiper :autoplay="true" :interval="2000" class="carousel" circular @change="swiperChange">
				<swiper-item class="carousel-item" @click="navSwiper(item)">
					<image src="../../static/LOGO2.png"></image>
				</swiper-item>
				<swiper-item class="carousel-item" @click="navSwipertonatice(1)">
					<image src="../../static/notice_one.jpg"></image>
				</swiper-item>
				<swiper-item class="carousel-item" @click="navSwipertonatice(2)">
					<image src="../../static/notice_two.jpg"></image>
				</swiper-item>
			</swiper>
		</view>
		<!-- 快捷地址 -->
		<view class="grid-wrapper">
			<!-- 因为swiper特性的关系，请指定swiper的高度 ，swiper的高度并不会被内容撑开-->
			<swiper class="grid-swiper" :indicator-dots="false">
				<swiper-item>
					<uni-grid :column="5" :show-border="false" :square="false">
						<uni-grid-item>
							<view class="grid-item-box" @click="navToList(0)">
								<image class="grid-image" src="/static/image/food.png"></image>
								<text class="grid-text">药食产品</text>
							</view>
						</uni-grid-item>
						<uni-grid-item>
							<view class="grid-item-box" @click="navToList(1)">
								<image class="grid-image" src="/static/image/health.png"></image>
								<text class="grid-text">健康产品</text>
							</view>
						</uni-grid-item>
						<uni-grid-item>
							<view class="grid-item-box" @click="navToList(2)">
								<image class="grid-image" src="/static/image/function.png"></image>
								<text class="grid-text">功能产品</text>
							</view>
						</uni-grid-item>
						<uni-grid-item>
							<view class="grid-item-box" @click="navCustomerService">
								<image class="grid-image" src="/static/image/kefu.png"></image>
								<text class="grid-text">入驻商家</text>
							</view>
						</uni-grid-item>
						<uni-grid-item>
							<!-- <view class="grid-item-box" @click="togglePopup('bottom', 'share')"> -->
							<view class="grid-item-box" @click="togglePopup('bottom', 'share')">
								<image class="grid-image" src="/static/image/share.png"></image>
								<text class="grid-text">分享邀请</text>
							</view>
						</uni-grid-item>
					</uni-grid>
				</swiper-item>
			</swiper>

		</view>
		<!-- 功能模块 -->
		<view class="func-wrapper">
			<view class="func-item" @click="navRegister">
				注册会员
			</view>
			<view class="func-item" @click="navStudy">
				知识学习
			</view>
			<view class="func-item" @click="navLiveRooms">
				专家指导
			</view>
			<view class="func-item" @click="navCertification">
				产品认证
			</view>
			<!-- 	<view class="func-item-buttom">
				地方特色产品
			</view> -->
		</view>
		<!-- 底部分享弹窗 -->
		<uni-popup ref="showshare" :type="type">
			<shareByWx :shareType='1' :userId="userInfo.id" :shareImg="userInfo.photoUrl" shareTitle="快来药食同源大健康看看吧!"
				:shareContent="'我是'+userInfo.nickname" :shareHref="'/pages/public/login?id='+userInfo.userUuid"
				:inviteCode="userInfo.inviteCode" @close="closeShare()"></shareByWx>
		</uni-popup>

	</view>

</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import shareByWx from '@/components/share/shareByWx.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import categoryVue from "../category/category.vue"
	export default {
		components: {
			uniPopup,
			shareByWx
		},
		data() {
			return {
				statusBarHeight: 0,
				titleBarHeight: 0,
				titleNViewBackground: '',
				swiperCurrent: 0,
				swiperLength: 0,
				receiveLoading: false,
				receiveGiftMessage: '',
				type: "",
				userInfo: {}
			};
		},
		computed: {
			...mapState(['hasLogin', , 'footPrint', 'applicationConfig', ]),
			shareHref() {
				let pages = getCurrentPages()
				let page = pages[pages.length - 1]
			}
		},
		onLoad() {
			let systemInfo = uni.getSystemInfoSync()
			this.statusBarHeight = systemInfo.statusBarHeight
			let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			this.titleBarHeight = (menuButtonInfo.top - this.statusBarHeight) * 2 + menuButtonInfo.height
		},
		onShow() {
			if (this.hasLogin && !this.userInfo.profitWelfareReceived) {
				this.receiveGiftMessage = '';
			}
		},
		methods: {
			...mapMutations(['login']),
			test() {
				uni.request({
					url: "http://172.22.105.77:8080/" + "",
					method: 'GET',
					data: {
						id: "我觉得不行"
					},
					success: (response) => {
						if (!hideLoading)
							uni.hideLoading();
						const result = response.data
						callback(response);
					},
					complete: () => {
						uni.hideLoading();
					},
					fail: (error) => {
						uni.hideLoading();
						if (error && error.response) {
							showError(error.response);
						}
					},
				})
			},
			change(index) {
				this.current = index;
				this.resetPage();
				if (index == 0) {
					this.searchRecommendProduct();
				} else {
					this.searchProductByCate(this.cates[index].productCateUuid);
				}
			},

			/**
			 * 请求静态数据只是为了代码不那么乱
			 * 分次请求未作整合
			 */
			//轮播图
			// inquirySwiper() {
			// 	this.$api.request.slider({}, res => {
			// 		if (res.body.status.statusCode === '0') {
			// 			this.carouselList = res.body.data.swipers;
			// 			this.swiperLength = this.carouselList.length;
			// 		} else {
			// 			console.log(res.body.status.errorDesc);
			// 		}
			// 	});
			// },

			//轮播图切换修改背景色
			swiperChange(e) {
				const index = e.detail.current;
				this.swiperCurrent = index;
			},
			//轮播图链接
			navSwiper(item) {
				this.$api.util.navSwiper(item);
			},
			navSwipertonatice(id) {
				console.log(id)
				uni.navigateTo({
					url: "/pages/index/notice?id=" + id
				})
			},

			//客服中心
			navCustomerService() {
				uni.navigateTo({
					url: '/pages/brand/list'
				})
			},

			//专家指导
			navLiveRooms() {
				uni.navigateTo({
					url: '/pages/live/room-list'
				})
			},
			// 药事同源认证
			navCertification() {
				uni.navigateTo({
					url: '/pages/product/certification'
				})
			},

			//商品列表页
			navToList(index) {
				this.$api.request.productCate({}, res => {
					if (res.code === 200) {
						 this.categoryList = res.data
					} else {
						this.$api.msg(res.message)
					}
				})
				const productCategoryId = this.categoryList[index].children[0].id
				uni.navigateTo({
					url: '/pages/product/list?productCategoryId=' + productCategoryId
				})
			},
			// 知识学习
			navStudy: function() {
				uni.navigateTo({
					url: '/pages/content/index'
				})
			},
			// 会员注册
			navRegister: function() {
				uni.navigateTo({
					url: '/pages/public/login'
				})
			},

			// 分享
			togglePopup(type, open) {
				this.$api.request.userInfo({}, res => {
					this.userInfo = res.data
				});
				switch (type) {
					case 'top':
						this.content = '顶部弹出 popup'
						break
					case 'bottom':
						this.content = '底部弹出 popup'
						break
					case 'center':
						this.content = '居中弹出 popup'
						break
				}
				this.type = type
				this.$nextTick(() => {
					this.$refs['show' + open].open()
				})
			},
			closeShare() {
				this.$refs.showshare.close();
			},
			onShareAppMessage(res) {
				return {
					title: '我是' + this.userInfo.name + ',快来药食同源大健康平台看看吧！',
					imageUrl: this.userInfo.photoUrl,
					path: '/pages/public/login?inviteCode=' + this.userInfo.inviteCode
				}
			},
			// #ifdef MP||H5
			//小程序环境下点击搜索框
			navSearch() {
				uni.navigateTo({
					url: '/pages/index/search'
				})
			}
			// #endif
		},
	}
</script>

<style lang="scss">
	/* #ifdef MP||H5 */
	.mp-search-box {
		// position: absolute;
		display: flex;
		left: 0;
		top: 180upx;
		z-index: 9;
		width: 100%;
		padding: 20upx 40upx;

		.city {
			margin: 0 10px 0 0;
			height: 56upx;
			line-height: 56upx;

			.city-name {
				color: #333;
				margin: 0px 5px;
			}
		}

		.ser-input {
			flex: 1;
			height: 56upx;
			line-height: 56upx;
			text-align: center;
			font-size: 28upx;
			color: $font-color-base;
			border-radius: 20px;
			// background: rgba(255, 255, 255, .6);
			background: #fff;
		}
	}



	page {

		.carousel-section {
			margin: 10px;
			border-radius: 50px;
			padding-top: 0;

			.titleNview-placing {
				padding-top: 0;
				height: 0;

			}

			.carousel {
				.carousel-item {
					padding: 0;
				}
			}

			.swiper-dots {
				left: 45upx;
				bottom: 40upx;

			}
		}

		.navigation-head {
			position: -webkit-sticky;
			position: sticky;
			top: var(--window-top);
			z-index: 99;
			background-color: #fff;

			.status_bar {
				width: 100%;
			}

			.title {
				display: flex;
				flex-direction: row;
				align-items: center;
				font-size: 20px;
				font-weight: bold;
				margin-left: 25px;
			}
		}
	}

	/* #endif */


	page {
		background: #f5f5f5;
	}

	.m-t {
		margin-top: 16upx;
	}

	/* 头部 轮播图 */
	.carousel-section {
		position: relative;
		padding-top: 10px;

		.titleNview-placing {
			height: var(--status-bar-height);
			padding-top: 44px;
			box-sizing: content-box;
		}

		.titleNview-background {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 426upx;
			transition: .4s;
		}
	}

	.carousel {
		width: 100%;
		height: 350upx;

		.carousel-item {
			width: 100%;
			height: 100%;
			padding: 0 28upx;
			overflow: hidden;
		}

		image {
			width: 100%;
			height: 100%;
			border-radius: 10upx;
		}
	}

	.swiper-dots {
		display: flex;
		position: absolute;
		left: 60upx;
		bottom: 15upx;
		width: 72upx;
		height: 36upx;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk4MzlBNjE0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTk4MzlBNjA0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0E3RUNERkE0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0E3RUNERkI0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Gh5BPAAACTUlEQVR42uzcQW7jQAwFUdN306l1uWwNww5kqdsmm6/2MwtVCp8CosQtP9vg/2+/gY+DRAMBgqnjIp2PaCxCLLldpPARRIiFj1yBbMV+cHZh9PURRLQNhY8kgWyL/WDtwujjI8hoE8rKLqb5CDJaRMJHokC6yKgSCR9JAukmokIknCQJpLOIrJFwMsBJELFcKHwM9BFkLBMKFxNcBCHlQ+FhoocgpVwwnv0Xn30QBJGMC0QcaBVJiAMiec/dcwKuL4j1QMsVCXFAJE4s4NQA3K/8Y6DzO4g40P7UcmIBJxbEesCKWBDg8wWxHrAiFgT4fEGsB/CwIhYE+AeBAAdPLOcV8HRmWRDAiQVcO7GcV8CLM8uCAE4sQCDAlHcQ7x+ABQEEAggEEAggEEAggEAAgQACASAQQCCAQACBAAIBBAIIBBAIIBBAIABe4e9iAe/xd7EAJxYgEGDeO4j3EODp/cOCAE4sYMyJ5cwCHs4rCwI4sYBxJ5YzC84rCwKcXxArAuthQYDzC2JF0H49LAhwYUGsCFqvx5EF2T07dMaJBetx4cRyaqFtHJ8EIhK0i8OJBQxcECuCVutxJhCRoE0cZwMRyRcFefa/ffZBVPogePihhyCnbBhcfMFFEFM+DD4m+ghSlgmDkwlOgpAl4+BkkJMgZdk4+EgaSCcpVX7bmY9kgXQQU+1TgE0c+QJZUUz1b2T4SBbIKmJW+3iMj2SBVBWz+leVfCQLpIqYbp8b85EskIxyfIOfK5Sf+wiCRJEsllQ+oqEkQfBxmD8BBgA5hVjXyrBNUQAAAABJRU5ErkJggg==);
		background-size: 100% 100%;

		.num {
			width: 36upx;
			height: 36upx;
			border-radius: 50px;
			font-size: 24upx;
			color: #fff;
			text-align: center;
			line-height: 36upx;
		}

		.sign {
			position: absolute;
			top: 0;
			left: 50%;
			line-height: 36upx;
			font-size: 12upx;
			color: #fff;
			transform: translateX(-50%);
		}
	}

	.grid-wrapper {
		background-color: #ffffff;
		margin: 0 10px;
		// position: relative;
		z-index: 5;
		border-radius: 5px;
		// margin-top: -20upx;
	}

	.grid-swiper {
		height: 167upx;
	}

	.grid-item-box {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 15px 0;
	}

	.grid-image {
		width: 80upx;
		height: 80upx;
	}

	.grid-text {
		color: $font-color-dark;
		font-size: $font-sm;
		margin-top: 3px;
	}

	.grid-dot {
		position: absolute;
		top: 5px;
		right: 15px;
	}

	.ad-1 {
		width: 100%;
		height: 210upx;
		padding: 10upx 0;
		background: #fff;

		image {
			width: 100%;
			height: 100%;
		}
	}

	/* 功能模块 */
	.func-wrapper {
		padding: 10px;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		.func-item {
			background-color: $button-color-dark;
			margin-bottom: 10px;
			width: 46vw;
			height: 90px;
			font-size: 22px;
			font-weight: bold;
			color: white;
			border-radius: 5px;
			text-align: center;
			line-height: 90px;
		}

		.func-item-buttom {
			background-color: $button-color-dark;
			flex: 1;
			height: 80px;
			border-radius: 5px;
			font-size: 22px;
			font-weight: bold;
			text-align: center;
			line-height: 80px;
			color: white;
		}
	}

	/* 秒杀专区 */
	.seckill-section {
		padding: 4upx 30upx 24upx;
		background: #fff;

		.s-header {
			display: flex;
			align-items: center;
			height: 92upx;
			line-height: 1;

			.s-img {
				width: 140upx;
				height: 30upx;
			}

			.tip {
				font-size: $font-base;
				color: $font-color-light;
				margin: 0 20upx 0 40upx;
			}

			.countdown {
				margin: 0 20upx 0 40upx;
			}

			.timer {
				display: inline-block;
				width: 40upx;
				height: 36upx;
				text-align: center;
				line-height: 36upx;
				margin-right: 14upx;
				font-size: $font-sm+2upx;
				color: #fff;
				border-radius: 2px;
				background: rgba(0, 0, 0, .8);
			}

			.end {
				font-size: 12px;
				margin-left: 20px;
				background-color: #333;
				color: #fff;
				padding: 5px;
				border-radius: 5px;
			}

			.icon-you {
				font-size: $font-lg;
				color: $font-color-light;
				flex: 1;
				text-align: right;
				margin-left: auto;
			}
		}

		.floor-list {
			white-space: nowrap;
		}

		.scoll-wrapper {
			display: flex;
			align-items: flex-start;
		}

		.floor-item {
			width: 150upx;
			margin-right: 20upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;
			line-height: 1.8;

			image {
				width: 150upx;
				height: 150upx;
				border-radius: 6upx;
			}

			.price {
				color: $uni-color-primary;
			}
		}
	}

	.f-header {
		display: flex;
		align-items: center;
		height: 140upx;
		padding: 6upx 30upx 8upx;
		background: #fff;

		image {
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			margin-right: 20upx;
		}

		.tit-box {
			flex: 1;
			display: flex;
			flex-direction: column;
		}

		.tit {
			font-size: $font-lg +2upx;
			color: #font-color-dark;
			line-height: 1.3;
		}

		.tit2 {
			font-size: $font-sm;
			color: $font-color-light;
		}

		.icon-you {
			font-size: $font-lg +2upx;
			color: $font-color-light;
		}
	}

	/* 团购楼层 */
	.group-section {
		background: #fff;

		.g-swiper {
			height: 650upx;
			padding-bottom: 30upx;
		}

		.g-swiper-item {
			width: 100%;
			padding: 0 30upx;
			display: flex;
		}

		image {
			width: 100%;
			height: 460upx;
			border-radius: 4px;
		}

		.g-item {
			display: flex;
			flex-direction: column;
			overflow: hidden;
		}

		.left {
			flex: 1.2;
			margin-right: 24upx;

			.t-box {
				padding-top: 20upx;
			}
		}

		.right {
			flex: 0.8;
			flex-direction: column-reverse;

			.t-box {
				padding-bottom: 20upx;
			}
		}

		.t-box {
			height: 160upx;
			font-size: $font-base+2upx;
			color: $font-color-dark;
			line-height: 1.6;
		}

		.price {
			color: $uni-color-primary;
		}

		.m-price {
			font-size: $font-sm+2upx;
			text-decoration: line-through;
			color: $font-color-light;
			margin-left: 8upx;
		}

		.pro-box {
			display: flex;
			align-items: center;
			margin-top: 10upx;
			font-size: $font-sm;
			color: $font-base;
			padding-right: 10upx;
		}

		.progress-box {
			flex: 1;
			border-radius: 10px;
			overflow: hidden;
			margin-right: 8upx;
		}
	}

	/* 分类推荐楼层 */
	.hot-floor {
		width: 100%;
		overflow: hidden;
		margin-bottom: 20upx;

		.floor-img-box {
			width: 100%;
			height: 320upx;
			position: relative;

			&:after {
				content: '';
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				background: linear-gradient(rgba(255, 255, 255, .06) 30%, #f8f8f8);
			}
		}

		.floor-img {
			width: 100%;
			height: 100%;
		}

		.floor-list {
			white-space: nowrap;
			padding: 20upx;
			padding-right: 50upx;
			border-radius: 6upx;
			margin-top: -140upx;
			margin-left: 30upx;
			background: #fff;
			box-shadow: 1px 1px 5px rgba(0, 0, 0, .2);
			position: relative;
			z-index: 1;
		}

		.scoll-wrapper {
			display: flex;
			align-items: flex-start;
		}

		.floor-item {
			width: 180upx;
			margin-right: 20upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;
			line-height: 1.8;

			image {
				width: 180upx;
				height: 180upx;
				border-radius: 6upx;
			}

			.price {
				color: $uni-color-primary;
			}
		}

		.more {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			flex-shrink: 0;
			width: 180upx;
			height: 180upx;
			border-radius: 6upx;
			background: #f3f3f3;
			font-size: $font-base;
			color: $font-color-light;

			text:first-child {
				margin-bottom: 4upx;
			}
		}
	}

	/* 商品列表 */
	.goods-list {
		display: flex;
		flex-wrap: wrap;
		padding: 30upx 30upx;
		background: #fff;

		.goods-item {
			display: flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40upx;

			&:nth-child(2n+1) {
				margin-right: 4%;
			}
		}

		.image-wrapper {
			width: 100%;
			height: 330upx;
			border-radius: 3px;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}

		.title {
			font-size: $font-base;
			color: $font-color-dark;
			line-height: 80upx;
		}

		.price-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-right: 10upx;
			font-size: 24upx;
			color: $font-color-light;
		}

		.price {
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;

			&:before {
				content: '￥';
				font-size: 26upx;
			}
		}

		.merchant {
			margin-top: 20upx;
			color: $font-color-light;
		}
	}

	//新人福利
	.gift {
		margin: 30% 17% 10% 17%;
		padding: 15px;
		background-color: #B42A28;
		border-radius: 10px;

		.gift-title {
			color: #FCCB90;
			font-size: $font-base;
			font-weight: 700;
			text-align: center;
		}

		.gift-desc {
			color: #FCCB90;
			font-size: $font-sm;
			text-align: center;
		}

		.gift-image {
			margin-top: 10px;
			text-align: center;

			image {
				width: 75px;
				height: 75px;
			}
		}

		.gift-content {
			margin-top: 20px;

			.gift-item {
				background-color: #F5D5A2;
				padding: 10px;
				margin-top: 10px;
				height: 35px;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.gift-item-label {
					color: #C12E25;
					font-size: $font-sm;
				}

				.gift-item-value {
					text-align: center;

					button {
						background-color: #B42A28;
						color: #FBC78F;
						font-size: $font-base;
						height: 30px;
						line-height: 30px;

						.tip {
							&:after {
								content: '积分';
								font-size: $font-sm;
							}
						}
					}
				}
			}
		}

		.gift-message {
			margin-top: 10px;
			color: #F8C180;
			font-size: $font-base;
			text-align: center;
		}

		.gift-action {
			margin-top: 30px;
			text-align: center;

			button {
				background-color: #F8C180;
				color: #7B4F15;
				height: 35px;
				line-height: 35px;
				font-size: $font-base;
				font-weight: 700;
			}
		}
	}

	.gift-close {
		display: flex;
		justify-content: center;
		margin-top: 20px;
	}
</style>