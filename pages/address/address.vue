<template>
	<view class="content b-t">
		<empty v-if="addressList.length === 0"></empty>
		<view class="list b-b" v-for="(item, index) in addressList" :key="index" @click="checkAddress(item)">
			<view class="wrapper">
				<view class="address-box">
					<text v-if="item.defaultStatus==1" class="tag">默认</text>
					<text class="address">{{item.province}} {{item.city}} {{item.region}} {{item.detailAddress}}</text>
				</view>
				<view class="u-box">
					<text class="name">{{item.name}}</text>
					<text class="mobile">{{item.phoneNumber}}</text>
				</view>
			</view>
			<text class="yticon icon-bianji" @click.stop="addAddress('edit', item)"></text>
			<text class="yticon icon-iconfontshanchu1" @click.stop="handleDeleteAddress(item.id)"></text>
		</view>

		<button class="add-btn" @click="addAddress('add')">新增地址</button>
	</view>
</template>

<script>
	import empty from "@/components/empty";
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		components: {
			empty
		},
		data() {
			return {
				source: 0,
				addressList: []
			}
		},
		onLoad(option) {
			
			
			this.source = option.source;
			this.loadData();
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		methods: {
			// 查询收货地址
			async loadData() {
				this.$api.request.userShip({
				}, res => {
					
					if (res.code === 200) {
						this.addressList = res.data;
						
					} else {
						this.$api.msg(res.message);
					}
				});
			},
			//选择地址
			checkAddress(item) {
				if (this.source == 1) {
					//this.$api.prePage()获取上一页实例，在App.vue定义
					this.$api.prePage().addressData = item;
					uni.navigateBack()
				}
			},
			addAddress(type, item) {
				console.log(item)
				if (type == 'edit') {
					uni.navigateTo({
						url: `/pages/address/addressManage?type=${type}&id=${item.id}`
					})
				} else {
					uni.navigateTo({
						url: `/pages/address/addressManage?type=${type}`
					})
				}
			},
			//处理删除地址
			handleDeleteAddress(id) {
				
				let superThis = this;
				var method = 'consumer/address/deleteUserDeliveryAddress'
				uni.showModal({
					title: '提示',
					content: '是否要删除该地址',
					success: function(res) {
						if (res.confirm) {
							superThis.$api.request.removeShip(method,id,res =>{
								superThis.loadData();
							})
						}
					}
				});
			},
			//添加或修改成功之后回调
			refreshList(data, type) {
				//添加或修改后事件，这里直接在最前面添加了一条数据，实际应用中直接刷新地址列表即可
				// this.addressList.unshift(data);
				this.loadData();
				console.log(data, type);
			}
		}
	}
</script>

<style lang='scss'>
	page {
		padding-bottom: 120upx;
	}

	.content {
		position: relative;
	}

	.list {
		display: flex;
		align-items: center;
		padding: 20upx 30upx;
		;
		background: #fff;
		position: relative;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.address-box {
		display: flex;
		align-items: center;

		.tag {
			font-size: 24upx;
			color: $base-color;
			margin-right: 10upx;
			background: #fffafb;
			border: 1px solid #ffb4c7;
			border-radius: 4upx;
			padding: 4upx 10upx;
			line-height: 1;
		}

		.address {
			font-size: 30upx;
			color: $font-color-dark;
		}
	}

	.u-box {
		font-size: 28upx;
		color: $font-color-light;
		margin-top: 16upx;

		.name {
			margin-right: 30upx;
		}
	}

	.icon-bianji {
		display: flex;
		align-items: center;
		height: 80upx;
		font-size: 40upx;
		color: $font-color-light;
		padding-left: 30upx;
	}

	.icon-iconfontshanchu1 {
		display: flex;
		align-items: center;
		height: 80upx;
		font-size: 40upx;
		color: $font-color-light;
		padding-left: 30upx;
	}

	.add-btn {
		position: fixed;
		left: 30upx;
		right: 30upx;
		bottom: 30upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		font-size: 32upx;
		color: #fff;
		background-color: $button-color-dark;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px $button-color-dark;
	}
</style>