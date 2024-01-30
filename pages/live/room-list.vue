<template>
	<view class="content">
		<view class="room-list">
			<view v-for="(item, index) in activityList" :key="index" class="room-item" @click="navToDetailPage(item.id)">
				<view class="image-wrapper">
					<!-- <image :src="item.activityPic" mode="aspectFill"></image> -->
					<image src="../../static/live.jpg" mode="aspectFill"></image>
				</view>
				<text class="title clamp">{{item.activityTitle}}</text>
				<view class="desc-box">
					<text>{{item.activityExpert}}</text>
				</view>

			</view>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>
	</view>
</template>

<script>
	import {
		test
	} from "@/config/api.js"
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				headerPosition: "fixed",
				headerTop: "0px",
				loadingType: 'more', //加载更多状态
				activityList: [], //列表
				total: 0,
				pageNo: 1,
				pageSize: 10
			};
		},

		onLoad(options) {
			// #ifdef H5
			this.headerTop = document.querySelector(".uni-page-head").offsetHeight + 'px';
			// #endif
			this.getActivity();
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			if (e.scrollTop >= 0) {
				this.headerPosition = "fixed";
			} else {
				this.headerPosition = "absolute";
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			//重新加载数据
			this.resetPage();
			this.getActivity();
		},
		//加载更多
		onReachBottom() {
			if (this.loadingType === 'more') {
				this.pageNo = this.pageNo + 1;
				this.getActivity()
			}
		},
		methods: {
			getActivity() {
				//加载中
				this.loadingType = 'loading';
				this.$api.request.activityList({
					pageNum: this.pageNo,
					pageSize: this.pageSize,
					showStatus: 1,
				}, res => {
					uni.stopPullDownRefresh();
					if (res.code === 200) {
						var activityList = res.data.list;
						this.activityList = this.activityList.concat(activityList);
						this.total = res.data.total;
						if (this.activityList.length >= this.total) {
							this.loadingType = 'nomore';
						} else {
							this.loadingType = 'more';
						}
					} else {
						this.loadingType = 'more';
					}
				}, true);
			},
			//重置列表及分页
			resetPage() {
				this.pageNo = 1;
				this.activityList = [];
			},
			//详情
			navToDetailPage(id) {
				console.log(1111)
				uni.navigateTo({
					url: "/pages/live/detail?id=" + id
				})
			},
			stopPrevent() {}
		},
	}
</script>

<style lang="scss">
	page,
	.content {
		background: $page-color-base;
	}

	.content {}

	/* 商品列表 */
	.room-list {
		display: flex;
		flex-wrap: wrap;

		.room-item {
			width: 100%;
			padding: 20upx;
			margin: 20upx;
			background: #fff;
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
			line-height: 60upx;
		}

		.desc-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-right: 10upx;
			font-size: 24upx;
			color: $font-color-light;
			margin-bottom: 12px;
		}
	}
</style>