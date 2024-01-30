<template>
	<view>
		<view >
			<image v-if="isNotice" mode="aspectFit" src="/static/notice/image_one.png"></image>
			<image v-if="isNotice" mode="aspectFit" src="/static/notice/image_two.png"></image>
			<image v-if="!isNotice" mode="aspectFit" src="/static/notice/image_three.png"></image>
		</view>
		

	</view>
</template>

<script>
	export default {
		data() {
			return {
				isNotice: true
			};
		},
		onLoad: function(option) {
			if(option.id == 2){
				this.isNotice = false
			}
		}
	}
</script>

<style lang="scss">
image{
	height: 40rem;
	width: 100%;
}
</style>