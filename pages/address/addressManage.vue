<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">姓名</text>
			<input class="input" type="text" v-model="addressData.name" placeholder="收货人姓名"
				placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">手机号码</text>
			<input class="input" type="number" v-model="addressData.phoneNumber" placeholder="收货人手机号码"
				placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">邮政编码</text>
			<input class="input" type="number" v-model="addressData.postCode" placeholder="收货人邮政编码"
				placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">所在区域</text>
			<view class="input">
				{{addressData.province}}  {{addressData.city}}  {{addressData.region}}
			</view>
			<text class="yticon icon-you" @click="showAddressRegion"></text>
		</view>
		<view class="input">
			<w-picker
				mode="region"
				:defaultVal="defaultRegion"
				:hideArea="false"
				@confirm="onConfirm" 
				ref="region"
				:timeout="true"
			></w-picker>
		</view>
		<!-- <view class="row b-b">
			<text class="tit">所在区域</text>
			<text @click="chooseLocation" class="input">
				{{addressData.province}} {{addressData.city}} {{addressData.region}}
			</text>
			<text class="yticon icon-shouhuodizhi" @click="chooseLocation"></text>
		</view> -->
		<view class="row b-b">
			<text class="tit">详细地址</text>
			<input class="input" type="text" v-model="addressData.detailAddress" placeholder="详细地址"
				placeholder-class="placeholder" />
		</view>

		<view class="row default-row">
			<text class="tit">设为默认</text>
			<switch :checked="addressData.defaultStatus==1" color="#09b980" @change="switchChange" />
		</view>
		<button class="add-btn" @click="confirm">提交</button>
	</view>
</template>

<script>
	import wPicker from "@/components/w-picker/w-picker.vue";
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				addressData: {
					name: '',
					phoneNumber: '',
					postCode: '',
					detailAddress: '',
					defaultStatus: false,
					province: '',
					city: '',
					region: ''
				},
				defaultRegion:['北京市','市辖区','东城区']
			}
		},
		components:{
			wPicker
		},
		onLoad(option) {
			let title = '新增收货地址';
			if (option.type === 'edit') {
				title = '编辑收货地址'
				var method = 'consumer/address/' + option.id
				this.$api.request.fetchAddressDetail(method, {}, response => {
					this.addressData = response.data;
				})
			}
			this.manageType = option.type;
			uni.setNavigationBarTitle({
				title: title
			})
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		methods: {
			switchChange(e) {
				this.addressData.defaultStatus = e.detail.value ? 1 : 0;
			},

			showAddressRegion(){
				this.$refs['region'].show();	
			},
			onConfirm(val){
				this.$set(this.addressData,'province',val.checkArr[0]);
				this.$set(this.addressData,'city',val.checkArr[1]);
				this.$set(this.addressData,'region',val.checkArr[2]);
			},

			//提交
			confirm() {
				let data = this.addressData;
				if (!data.name) {
					this.$api.msg('请填写收货人姓名');
					return;
				}
				if (!/(^1[3|4|5|7|8][0-9]{9}$)/.test(data.phoneNumber)) {
					this.$api.msg('请输入正确的手机号码');
					return;
				}
				if (!data.province) {
					this.$api.msg('请在地图选择所在位置');
					return;
				}
				if (!data.detailAddress) {
					this.$api.msg('请填写详细地址信息');
					return;
				}
				if (this.manageType == 'edit') {
					const method = 'consumer/address/changeUserDeliveryAddress?id=' + data.id
					this.$api.request.updateAddress(method,
						this.addressData, res => {
							this.$api.prePage().refreshList(data, this.manageType);
							this.$api.msg("地址修改成功！");
							setTimeout(() => {
								uni.navigateBack()
							}, 800)
						}
					)
				} else {
					this.$api.request.addAddress(this.addressData,res=>{
						this.$api.prePage().refreshList(data, this.manageType);
						this.$api.msg("地址添加成功！");
						setTimeout(() => {
							uni.navigateBack()
						}, 800)
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-top: 16upx;
	}

	.row {
		display: flex;
		align-items: center;
		position: relative;
		padding: 0 30upx;
		height: 110upx;
		background: #fff;

		.tit {
			flex-shrink: 0;
			width: 150upx;
			font-size: 30upx;
			color: $font-color-dark;
		}

		.input {
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}

		.icon-shouhuodizhi {
			font-size: 36upx;
			color: $font-color-light;
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
		margin: 60upx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: $button-color-dark;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px $button-color-dark;
	}
</style>