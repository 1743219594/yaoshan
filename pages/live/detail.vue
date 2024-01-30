<template>
	<view class="content">

		<scroll-view class="scroll" scroll-y>
			<view class="scroll-content">
				<view class="introduce-section">
					<text class="title">{{detailData.activityTitle}}</text>
					<view class="introduce">
						<p>活动地点：{{detailData.activityPlace}}</p>
						<p>邀请专家：{{detailData.activityExpert}}</p>
						<p>活动时间：{{detailData.activityTime[0].slice(0,10)}} {{detailData.activityTime[0].slice(11,16)}}
						至 {{detailData.activityTime[1].slice(0,10)}} {{detailData.activityTime[1].slice(11,16)}}</p>
						<!-- <text>{{applicationConfig.appicationName}}</text>
						<text>{{detailData.numberOfReading}}阅读</text> -->
						<!-- <text>{{detailData.date}}20001.12.2</text> -->
					</view>

					<rich-text :nodes="detailData.htmlNodes"></rich-text>

				</view>

				<!-- 加载图标 -->
				<mixLoading class="mix-loading" v-if="loading"></mixLoading>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		acitivityInfo
	} from "@/config/api.js"
	import json from '@/Json';
	import mixLoading from '@/components/mix-loading/mix-loading';
	import htmlParser from '@/config/html-parser'
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		components: {
			mixLoading
		},
		data() {
			return {
				loading: true,
				detailData: {},
			}
		},
		computed: {
			...mapState(['hasLogin', 'userInfo', 'footPrint', 'applicationConfig'])
		},
		onLoad(options) {
			var id = options.id;
			this.loadNewsDetail(id);
		},
		methods: {
			//获取活动详情
			loadNewsDetail(id) {
				let that = this;
				let method = 'activity/detail/' + id
				this.$api.request.acitivityInfo(method, {}, function(res) {
					if (res.code === 200) {
						that.detailData = res.data;
						var content = that.detailData.activityContent;
						content = content.replace(/<!DOCTYPE html>/g, "").replace(/<html>/g, "").replace(
							/<\/html>/g, "").replace(/<head>/g, "").replace(/<\/head>/g, "").replace(/<body>/g,
							"").replace(/<\/body>/g, "")
						that.detailData.htmlNodes = htmlParser(content);
						that.loading = false
					}

					// if (res.body.status.statusCode === '0') {
					// 	that.detailData = res.body.data;
					// 	var content = that.detailData.content;
					// 	content = content.replace(/<!DOCTYPE html>/g, "").replace(/<html>/g, "").replace(
					// 		/<\/html>/g, "").replace(/<head>/g, "").replace(/<\/head>/g, "").replace(/<body>/g,
					// 		"").replace(/<\/body>/g, "")
					// 	// var htmlString = content.replace(/\\/g, "").replace(/<img/g, "<img style=\"display:none;\"");
					// 	that.detailData.htmlNodes = htmlParser(content);
					// 	that.loading = false
					// }
				})
			},

		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	.content {
		display: flex;
		flex-direction: column;
		height: 100%;
		background: #fff;
	}

	.video-wrapper {
		height: 422upx;

		.video {
			width: 100%;
			height: 100%;
		}
	}

	.scroll {
		flex: 1;
		position: relative;
		background-color: #f8f8f8;
		height: 0;
	}

	.scroll-content {
		display: flex;
		flex-direction: column;
	}

	/* 简介 */
	.introduce-section {
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		line-height: 1.5;

		.title {
			font-size: 36upx;
			color: #303133;
			margin-bottom: 10upx;
		}

		.introduce {
			font-size: 26upx;
			color: #909399;
			margin-bottom: 10upx;
			text {
				margin-right: 16upx;
			}
		}
	}

	/* 点赞等操作 */
	.actions {
		display: flex;
		justify-content: space-around;
		align-items: center;
		line-height: 1.3;
		padding: 10upx 40upx 20upx;

		.action-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: 24upx;
			color: #999;
		}

		.yticon {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 60upx;
			height: 60upx;
			font-size: 52upx;

			&.reverse {
				position: relative;
				top: 6upx;
				transform: scaleY(-1);
			}

			&.active {
				color: #ec706b;
			}
		}

		.icon-fenxiang2 {
			font-weight: bold;
			font-size: 36upx;
		}

		.icon-shoucang {
			font-size: 44upx;
		}
	}

	.s-header {
		padding: 20upx 30upx;
		font-size: 30upx;
		color: #303133;
		background: #fff;
		margin-top: 16upx;

		&:before {
			content: '';
			width: 0;
			height: 40upx;
			margin-right: 24upx;
			border-left: 6upx solid #ec706b;
		}
	}

	/* 推荐列表 */
	.rec-section {
		background-color: #fff;

		.rec-item {
			display: flex;
			padding: 20upx 30upx;
			position: relative;

			&:after {
				content: '';
				position: absolute;
				left: 30upx;
				right: 0;
				bottom: 0;
				height: 0;
				border-bottom: 1px solid #eee;
				transform: scaleY(50%);
			}
		}

		.left {
			flex: 1;
			padding-right: 10upx;
			overflow: hidden;
			position: relative;
			padding-bottom: 52upx;

			.title {
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
				font-size: 32upx;
				color: #303133;
				line-height: 44upx;
			}

			.bot {
				position: absolute;
				left: 0;
				bottom: 4upx;
				font-size: 26upx;
				color: #909399;
			}

			.time {
				margin-left: 20upx;
			}
		}

		.right {
			width: 220upx;
			height: 140upx;
			flex-shrink: 0;
			position: relative;

			.img {
				width: 100%;
				height: 100%;
			}

		}
	}

	/* 评论 */
	.evalution {
		display: flex;
		flex-direction: column;
		background: #fff;
		padding: 20upx 0;
	}

	.eva-item {
		display: flex;
		padding: 20upx 30upx;
		position: relative;

		image {
			width: 60upx;
			height: 60upx;
			border-radius: 50px;
			flex-shrink: 0;
			margin-right: 24upx;
		}

		&:after {
			content: '';
			position: absolute;
			left: 30upx;
			bottom: 0;
			right: 0;
			height: 0;
			border-bottom: 1px solid #eee;
			transform: translateY(50%);
		}

		&:last-child:after {
			border: 0;
		}
	}

	.eva-right {
		display: flex;
		flex-direction: column;
		flex: 1;
		font-size: 26upx;
		color: #909399;
		position: relative;

		.zan-box {
			display: flex;
			align-items: base-line;
			position: absolute;
			top: 10upx;
			right: 10upx;

			.yticon {
				margin-left: 8upx;
			}
		}

		.content {
			font-size: 28upx;
			color: #333;
			padding-top: 20upx;
		}
	}

	/* 底部 */
	.bottom {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		height: 90upx;
		padding: 0 30upx;
		box-shadow: 0 -1px 3px rgba(0, 0, 0, .04);
		position: relative;
		z-index: 1;

		.input-box {
			display: flex;
			align-items: center;
			flex: 1;
			height: 60upx;
			background: #f2f3f3;
			border-radius: 100px;
			padding-left: 30upx;

			.icon-huifu {
				font-size: 28upx;
				color: #909399;
			}

			.input {
				padding: 0 20upx;
				font-size: 28upx;
				color: #303133;
			}
		}

		.confirm-btn {
			font-size: 30upx;
			padding-left: 20upx;
			color: #0d9fff;
		}
	}
</style>