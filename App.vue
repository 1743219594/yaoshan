<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
</style>
<script>
	/**
	 * vuex管理登陆状态，具体可以参考官方登陆模板示例
	 */
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		methods: {
			...mapMutations(['login','updateApplicationConfig'])
		},
		computed: {
			
		},
		onLaunch: function() {
			var tokenId = uni.getStorageSync('userToken');
			if(tokenId){
				//使用token就可以查询用户信息
				// this.$api.request.userInfo({
				// 	tokenId: tokenId
				// }, loginRes => {
				// 	if (loginRes.body.status.statusCode === '0') {
				// 		this.login(loginRes.body.data);	//将用户信息保存起来
				// 	} else {
				// 		console.log('同步用户信息失败, tokenId: '+tokenId);
				// 	}
				// });
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
	}
</script>

<style lang='scss'>
	@import './static/css/style.css';
</style>
<style lang='scss'>
	@import './static/css/iconfont.css';
</style>
<style lang='scss'>
/* 图片载入替代方案 */
	.image-wrapper {
		font-size: 0;
		background: #f3f3f3;
		border-radius: 4px;
	
		image {
			width: 100%;
			height: 100%;
			transition: .6s;
			opacity: 0;
	
			&.loaded {
				opacity: 1;
			}
		}
	}
</style>
