<template>
	<view class="content">
		<view class="card" v-for="(item, index) in FormData.dynamicItem">
			<view class="title">
				<text>产品信息(产品 {{index + 1}})</text>
				<view class="add" @click="addItem()" v-if="index===0">+</view>
				<view class="delete" @click="deleteItem(item,index)" v-if="!(index===0)">-</view>
			</view>
			<view class="row b-b">
				<text class="tit">名称</text>
				<input class="input" :maxlength="10" type="text" v-model="item.productName" placeholder="认证产品名称"
					placeholder-class="placeholder" />
			</view>
			<view class="row b-b">
				<text class="tit">描述</text>
				<input class="input" type="text" v-model="item.productDesc" placeholder="认证产品描述"
					placeholder-class="placeholder" />
			</view>
			<view class="row b-b">
				<text class="tit">产量</text>
				<input class="input" type="text" v-model="item.productStock" placeholder="认证产品产量"
					placeholder-class="placeholder" />
			</view>
			<view class="row b-b">
				<text class="tit">图片</text>
				<button class="input" style="background-color: #09b980; color: white;" @click="upload">上传图片</button>
				<!-- <input class=" input" type="text" v-model="addressData.telephone" placeholder="点击上传产品图片"
					placeholder-class="placeholder" /> -->
			</view>
		</view>

		<view class="card">
			<view class="title">加工厂信息</view>
			<view class="row b-b">
				<text class="tit">名称</text>
				<input class="input" :maxlength="10" type="text" v-model="FormData.factoryName" placeholder="加工厂名称"
					placeholder-class="placeholder" />
			</view>
			<view class="row b-b">
				<text class="tit">面积</text>
				<input class="input" type="text" v-model="addressData.factoryArea" placeholder="加工厂面积"
					placeholder-class="placeholder" />
			</view>
			<view class="row b-b">
				<text class="tit">地址</text>
				<view class="input">
					{{factory.province}} {{factory.city}} {{factory.area}}
				</view>
				<text class="yticon icon-you" @click="showAddressRegionFactory"></text>
			</view>


			<view class="input">
				<w-picker mode="region" :defaultVal="defaultRegion" :hideArea="false" @confirm="onConfirmFactory"
					ref="regionFactory" :timeout="true"></w-picker>
			</view>
			<view class="row b-b">
				<text class="tit"></text>
				<input :maxlength="100" class="input" type="text" v-model="factoryAddress" placeholder="详细地址"
					placeholder-class="placeholder" />
			</view>

		</view>

		<view class="card">
			<view class="title">委托人信息</view>
			<view class="row b-b">
				<text class="tit">委托人</text>
				<input class="input" :maxlength="10" type="text" v-model="FormData.client" placeholder="委托企业或个人名称"
					placeholder-class="placeholder" />
			</view>
			<view class="row b-b">
				<text class="tit">联系人</text>
				<input class="input" :maxlength="10" type="text" v-model="FormData.contact" placeholder="联系人姓名"
					placeholder-class="placeholder" />
			</view>
			<view class="row b-b">
				<text class="tit">手机号</text>
				<input class="input" type="number" v-model="FormData.phone" placeholder="联系人手机号码"
					placeholder-class="placeholder" />
			</view>
			<view class="row b-b">
				<text class="tit">地址</text>
				<view class="input">
					{{connect.province}} {{connect.city}} {{connect.area}}
				</view>
				<text class="yticon icon-you" @click="showAddressRegionConnect"></text>
			</view>
			<view class="input">
				<w-picker mode="region" :defaultVal="defaultRegion" :hideArea="false" @confirm="onConfirmConnect"
					ref="regionConnect" :timeout="true"></w-picker>
			</view>
			<view class="row b-b">
				<text class="tit"></text>
				<input :maxlength="100" class="input" type="text" v-model="connectAddress" placeholder="详细地址"
					placeholder-class="placeholder" />
			</view>
		</view>

		<button class="add-btn" @click="confirm">提交认证申请</button>
		<button class="add-btn" @click="confirm">我想成为商家</button>
	</view>
</template>

<script>
	import {approveApplication} from "@/config/api.js"
	import wPicker from "@/components/w-picker/w-picker.vue";
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				manageType: '',
				FormData: {
					factoryName: '',
					factoryArea: '',
					factoryAddress: '',
					dynamicItem: [{
						productName: "",
						productDesc: "",
						productStock: "",
						productPics: "",
					}, ],
					client: '',
					address: '',
					contact: '',
					phone: '',
					remark: '',
					default: true,
				},
				factoryAddress: '',
				connectAddress: '',
				factory: {
					province: '北京市',
					city: '市辖区',
					area: '东城区',
					result: ''
				},
				connect: {
					province: '北京市',
					city: '市辖区',
					area: '东城区',
					result: ''
				},

				defaultRegion: ['北京市', '市辖区', '东城区'],
				count: 1
			}
		},
		onLoad(option) {
			// let title = '新增收货地址';
			// if(option.type==='edit'){
			// 	title = '编辑收货地址'
			// 	this.addressData = JSON.parse(option.data);
			// 	this.defaultRegion=[this.addressData.province,this.addressData.city,this.addressData.area];
			// }
			// this.manageType = option.type;
			// uni.setNavigationBarTitle({
			// 	title
			// })
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		components: {
			wPicker
		},
		methods: {
			showAddressRegionFactory() {
				this.$refs['regionFactory'].show();
			},
			showAddressRegionConnect() {
				this.$refs['regionConnect'].show();
			},
			onConfirmFactory(val) {
				this.$set(this.factory, 'province', val.checkArr[0]);
				this.$set(this.factory, 'city', val.checkArr[1]);
				this.$set(this.factory, 'area', val.checkArr[2]);
				this.$set(this.factory, 'result', val.result);
			},
			onConfirmConnect(val) {
				this.$set(this.connect, 'province', val.checkArr[0]);
				this.$set(this.connect, 'city', val.checkArr[1]);
				this.$set(this.connect, 'area', val.checkArr[2]);
				this.$set(this.connect, 'result', val.result);
			},
			switchChange(e) {
				this.addressData.default = e.detail.value;
			},
			addItem() {
				this.FormData.dynamicItem.push({
					productName: "",
					productDesc: "",
					productStock: "",
					productPics: "",
				});
			},
			// 删除商品信息
			deleteItem(item, index) {
				this.FormData.dynamicItem.splice(index, 1);
			},
			//地图选择地址
			chooseLocation() {
				uni.chooseLocation({
					success: (data) => {
						debugger
						this.addressData.addressName = data.name;
					}
				})
			},

			//提交
			confirm() {
				this.FormData.factoryAddress = this.factory.result.concat(this.factoryAddress);
				this.FormData.address = this.connect.result.concat((this.connectAddress));
				let data = this.FormData;
				// 校验
				// if (!data.factoryName || !data.factoryArea|| !data.factoryAddress) {
				// 	this.$api.msg('加工厂信息未填写完整');
				// 	return;
				// }
				// if (!this.$api.util.validateMobileNo(data.phone)) {
				// 	this.$api.msg('请输入正确的手机号码');
				// 	return;
				// }
				// if (!data.client || !data.contact|| !data.address || !data.phone) {
				// 	this.$api.msg('委托人信息未填写完整');
				// 	return;
				// }
				
				this.$api.request.approveApplication({
					data:this.FormData
				}, res => {
					if(res.data.code === 200 ){
						this.$api.msg("提交成功！");
						this.FormData = {}
					}
				})
				this.$api.request.saveUserShip(options, res => {
					if (res.body.status.statusCode === '0') {
						var msg = '地址添加成功';
						if (this.manageType == 'edit') msg = '地址修改成功';
						this.$api.msg(msg);
						setTimeout(() => {
							this.$api.prePage().refreshList();
							uni.navigateBack();
						}, 800)
					} else {
						this.$api.msg(res.body.status.errorDesc);
					}
				});

			},
			// 上传图片
			upload() {
				uni.chooseImage({
					count: 1, // 图片数量
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择或者拍照
					success: (res) => {
						const tempFilePaths = res.tempFilePaths;
						console.log(tempFilePaths[0])
						_this.logo_list = tempFilePaths[0]
						uni.uploadFile({
							url: 'https://xx.com/center/group/icon', //上传图片api
							filePath: tempFilePaths[0],
							name: 'groupicon',
							header: {
								"Authorization": userinfo.token
							},
							success: (res) => {
								let group = JSON.parse(res.data)
								uni.showToast({
									title: "上传成功",
									icon: "success"
								})
							}
						});
					}
				});
			},

			//删除地址
			del() {
				let options = {
					userDeliveryAddressUuid: this.addressData.userDeliveryAddressUuid,
					actionType: 'DELETE'
				}
				this.$api.request.removeShip(options, res => {
					if (res.body.status.statusCode === '0') {
						this.$api.msg('地址删除成功');
						setTimeout(() => {
							this.$api.prePage().refreshList();
							uni.navigateBack();
						}, 800)
					} else {
						this.$api.msg(res.body.status.errorDesc);
					}
				});

			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #f1f3f4;
		padding: 16upx 0;
	}

	.card {
		background: white;
		margin: 20px;
		border-radius: 10px;
		padding-bottom: 10px;

		.title {
			padding: 20upx 30upx;
			font-size: 1.2rem;
			font-weight: bold;
			display: flex;
			justify-content: space-between;

			.add {
				background-color: $button-color-dark;
				border-radius: 50%;
				width: 1.5rem;
				text-align: center;
				height: 1.5rem;
				line-height: 1.5rem;
			}

			.delete {
				background-color: #cc463d;
				border-radius: 50%;
				width: 1.5rem;
				text-align: center;
				height: 1.5rem;
				line-height: 1.5rem;
			}
		}

		.row {
			display: flex;
			align-items: center;
			position: relative;
			padding: 0 30upx;
			height: 80upx;
			background: #fff;
			border-radius: 10px;

			.tit {
				flex-shrink: 0;
				width: 160upx;
				font-size: 25upx;
				color: $font-color-dark;
			}

			.input {
				flex: 1;
				font-size: 25upx;
				color: $font-color-dark;
			}

			.icon-shouhuodizhi {
				font-size: 30upx;
				color: $font-color-light;
			}
		}
	}

	.default-row {
		margin-top: 16upx;

		.tit {
			flex: 1;
		}

		switch {
			transform: translateX(16upx) scale(.9);
		}
	}

	.add-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 30upx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: $button-color-dark;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px $button-color-dark;
	}

	.del-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}


	.tab {
		padding: 20upx 0;
		font-size: 32upx;
	}

	.tab.active {
		color: #f00;
	}

	.result {
		margin-top: 100upx;
		font-size: 32upx;
	}
</style>