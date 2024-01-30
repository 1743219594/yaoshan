<template>
	<view>
		<view class="container">
			<!-- <view class="card" v-for="(item, index) in resultList" :key="index" >
				<view class="producutName">{{item.productName}}</view>
				<view class="producutShop">
					<view class="tip"></view>
					{{item.client}}
				</view>
				<view class="producutImage">
					<image mode="scaleToFill" @click="clickImg(item.productPics)"
						src="item.productPics">
					</image>
					<image mode="scaleToFill" src="item.provePics"></image>
				</view>
				<view class="prompt">以上产品及加工过程均通过 CHCC 药食同源食品认证</view>
			</view> -->
			<view class="card">
				<view class="producutName">人参蜜片</view>
				<view class="producutShop">
					<view class="tip"></view>
					辽宁龙参健康药业有限公司
				</view>
				<view class="producutImage">
					<image mode="scaleToFill" @click="clickImg()"
						src="https://img01.yzcdn.cn/upload_files/2020/06/11/FjanlU-oJTPxxatBBdhd4ow5yYZi.jpg%21730x0.jpg">
					</image>
					<image mode="scaleToFill" src="../../static/certification.jpg"></image>
				</view>
				<view class="prompt">以上产品及加工过程均通过 CHCC 药食同源食品认证</view>
			</view>
			<view class="card">
				<view class="producutName">人参蜜片</view>
				<view class="producutShop">
					<view class="tip"></view>
					辽宁龙参健康药业有限公司
				</view>
				<view class="producutImage">
					<image mode="scaleToFill"
						src="https://img01.yzcdn.cn/upload_files/2020/06/11/FjanlU-oJTPxxatBBdhd4ow5yYZi.jpg%21730x0.jpg">
					</image>
					<image mode="scaleToFill" src="../../static/certification.jpg"></image>
				</view>
				<view class="prompt">以上产品及加工过程均通过 CHCC 药食同源食品认证</view>
			</view>
			<view class="card">
				<view class="producutName">人参蜜片</view>
				<view class="producutShop">
					<view class="tip"></view>
					辽宁龙参健康药业有限公司
				</view>
				<view class="producutImage">
					<image mode="scaleToFill"
						src="https://img01.yzcdn.cn/upload_files/2020/06/11/FjanlU-oJTPxxatBBdhd4ow5yYZi.jpg%21730x0.jpg">
					</image>
					<image mode="scaleToFill" src="../../static/certification.jpg"></image>
				</view>
				<view class="prompt">以上产品及加工过程均通过 CHCC 药食同源食品认证</view>
			</view>
		</view>
		<view class="btn" @click="navAuthenticate">
			我想认证产品
		</view>
		<uni-load-more :status="loadStatus"></uni-load-more>
	</view>
</template>

<script>
	import {
		activityList,
		proveProductList
	} from '../../config/api';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				resultList: [],
				loadStatus: 'nomore',
				pageNum: 1,
				pageSize: 10,
				pageCount: 0
			};
		},
		//下拉刷新
		onPullDownRefresh() {
			this.pageNum = 1;
			this.resultList = [];
			this.getResultList()
		},
		//上拉加载更多
		onReachBottom() {
			if (this.loadStatus === 'more') {
				this.pageNum += 1
				this.getResultList()
			}
		},
		onLoad() {
			this.getResultList()
		},
		methods: {
			navAuthenticate() {
				uni.navigateTo({
					url: '/pages/product/authenticate'
				})
			},
			// 获取列表
			getResultList() {
				this.loadStatus = 'loading'
				this.$api.request.proveProductList({
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					deleteStatus: 0,
					isApprove: 1
				}, res => {
					uni.stopPullDownRefresh();
					if(res.data.code === 200) {
						var resultList = res.data.list;
						this.resultList = this.resultList.concat(activityList);
						this.total = res.data.total;
						if(this.resultList.length >= this.total) {
							this.loadStatus = 'nomore';
						} else {
							this.loadStatus = "more";
						}
					}else{
						this.loadStatus = 'more';
					}
				}, true)
			},
			// 图片放大
			clickImg(picUrl) {
				wx.previewImage({
					urls: [
						"https://img01.yzcdn.cn/upload_files/2020/06/11/FjanlU-oJTPxxatBBdhd4ow5yYZi.jpg%21730x0.jpg"
					], //需要预览的图片http链接列表，多张的时候，url直接写在后面就行了
					current: '', // 当前显示图片的http链接，默认是第一个
					success: function(res) {},
					fail: function(res) {},
					complete: function(res) {},
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 10px;
		background-color: #f1f3f4;
		padding-bottom: 55px;
	}

	.btn {
		position: fixed;
		height: 55px;
		line-height: 55px;
		text-align: center;
		top: calc(100vh - 55px);
		width: 100vw;
		background-color: $button-color-dark;
		font-size: 1.2rem;
		font-weight: bold;
		color: white;
	}

	.card {
		background-color: white;
		padding: 10px 20px 20px 20px;
		border-radius: 20px;
		margin-bottom: 20px;

		.producutName {
			margin: 10px 0;
			font-size: 1.4rem;
			font-weight: bold;
		}

		.producutShop {
			font-weight: bold;
			margin: 10px 0;
			display: flex;

			.tip {
				height: 20px;
				width: 5px;
				margin-right: 5px;
				border-radius: 5px;
				background-color: $button-color-light;
			}
		}

		.producutImage {
			display: flex;
			background-color: whitesmoke;
			padding: 20px 10px;
			border-radius: 10px;

			image {
				height: 100px;
				width: 80px;
			}
		}

		.prompt {
			margin-top: 10px;
			font-size: 0.8rem;
			color: #bfbfbf;
		}
	}
</style>