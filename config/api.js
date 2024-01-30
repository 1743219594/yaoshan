export const apiBaseUrl = 'http://8.138.108.210:8085/'
export const apiByAdmin = 'http://8.138.108.210:8080/'

// 需要登陆的，都写到这里，否则就是不需要登陆的接口
const generateUuid = (randomFlag, min, max) => {
	var str = '',
		range = min,
		arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
	//随机产生
	if (randomFlag) {
		range = Math.round(Math.random() * (max - min)) + min;
	}
	for (var i = 0; i < range; i++) {
		var pos = Math.round(Math.random() * (arr.length - 1));
		str += arr[pos]
	}
	return str;
}

const methodsToken = [

	'consumer/inquiryUser',
	'consumer/updateUserField',
	'changePassword',
	'consumer/enableNotification',
	'consumer/disableNotification',
	'product/isProductCollected',
	'product/collectProduct',
	'consumer/cancelCollectProduct',
	'product/inquiryProductCollect',
	'cart/addProductToCart',
	'consumer/inquiryCartProductByIds',
	'consumer/changeOrder',
	'consumer/addSecKillOrder',
	'consumer/addGroupBuyOrder',
	'consumer/addPointOrder',
	'cart/getCartProductNum',
	'consumer/inquiryCartProduct',
	'consumer/deleteProductFromShoppingCart',
	'consumer/updateShoppingCartProductNum',
	'consumer/clearShoppingCart',
	'consumer/inquiryOrder',
	'consumer/getCourierInfo',
	'consumer/inquiryPaymentAmount',
	'consumer/searchOrder',
	'order/list',
	'consumer/searchGroupBuy',
	'consumer/searchGroupBuyTotal',
	'consumer/groupBuyDetail',
	'consumer/cancelOrder',
	'consumer/confirmOrder',
	'consumer/changeProductComment',
	'consumer/applyOrderAfterSale',
	'consumer/searchOrderAfterSale',
	'consumer/searchOrderAfterSaleTotal',
	'consumer/inquiryOrderAfterSaleDetail',
	'consumer/cancelOrderAfterSale',
	'consumer/updateOrderAfterSale',
	'consumer/courierOrderAfterSale',
	'inquiryNotes',
	'markNoteRead',
	'consumer/createPoster',
	'consumer/changeCoupon',
	'consumer/searchUserCoupon',
	'consumer/inquiryVoucher',
	'consumer/calculateCouponAmount',
	'consumer/calculateFreightAmount',
	'consumer/calculateDeliveryAmount',
	'consumer/calculateSecKillFreightAmount',
	'consumer/calculateSecKillDeliveryAmount',
	'consumer/calculateGroupBuyFreightAmount',
	'consumer/calculateGroupBuyDeliveryAmount',
	'consumer/calculatePointFreightAmount',
	'consumer/searchUserAward',
	'consumer/searchUserStatement',
	'consumer/searchUserPerformance',
	'consumer/searchUserWithdraw',
	'consumer/applyWithdraw',
	'consumer/inquiryUserWithdraw',
	'consumer/nextUserLevelData',
	'consumer/inquiryInvitedUsers',
	'consumer/changeUserDeliveryAddress',
	'consumer/inquiryUserDeliveryAddress',
	'consumer/initWechatPay',
	'consumer/initWechatPayH5',
	'consumer/initWechatPayApp',
	'consumer/initAlipay',
	'consumer/initAlipayApp',
	'consumer/balancePay',
	'consumer/seckillQuanId',
	'consumer/getSignDateNum',
	'consumer/isPointSigned',
	'consumer/signPoint',
	'consumer/searchUserPointStatement',
	'consumer/isMerchantFollowed',
	'consumer/followMerchant',
	'consumer/cancelFollowMerchant',
	'consumer/inquiryFollowedMerchant',
	'consumer/inquiryProfitWelfare',
	'consumer/receiveProfitWelfare'
];

// 封装post方法
const post = (method, data, callback, hideLoading) => {
	//请求头header信息
	var postDataHeader = {
		tokenId: uni.getStorageSync("userToken")
	};
	//请求头body信息
	var postDataBody = data;
	// 判断token是否存在
	if (methodsToken.indexOf(method) >= 0) {
		// 获取用户token
		let userToken = uni.getStorageSync("userToken");
		if (!userToken) {
			uni.reLaunch({
				url: '/pages/public/login'
			})
			return false;
		} else {
			//将tokenId置于请求头信息
			postDataHeader.tokenId = userToken;
		}
	}
	//如果调用接口不明确指明不显示loading
	if (!hideLoading) {
		
		uni.showLoading({
			//title: '加载中'
		});
	}

	uni.request({
		url: apiBaseUrl + method,
		data: data,
		header: {
			'Authorization': postDataHeader.tokenId
		},
		method: 'POST',
		success: (response) => {
			
			if (!hideLoading)
				uni.hideLoading();
			const result = response.data
			// if (!result.body.status.statusCode === '0') {
			// 	// 登录信息过期或者未登录
			// 	if (result.body.status.errorCode === 'ErrorCode.common.0002' || result.body.status.errorCode ===
			// 		'ErrorCode.common.0003' || result.body.status.errorCode === 'ErrorCode.common.0004') {
			// 		uni.removeStorageSync('userToken')
			// 		uni.showToast({
			// 			title: result.body.status.errorDesc,
			// 			icon: 'none',
			// 			duration: 1000,
			// 			complete: function() {
			// 				setTimeout(function() {
			// 					uni.hideToast();
			// 					uni.navigateTo({
			// 						url: '/pages/public/login'
			// 					})
			// 				}, 1000)
			// 			}
			// 		});
			// 	}
			// }
			callback(result);
		},
		complete: () => {
			uni.hideLoading();
		},
		fail: (error) => {
			uni.hideLoading();
			console.log(error);
			if (error && error.response) {
				showError(error.response);
			}
		},
	});
}
// postbyquery
const postByQuery = (method, data, callback, hideLoading) => {
	//请求头header信息
	var postDataHeader = {
		tokenId: uni.getStorageSync("userToken")
	};
	// 判断token是否存在
	if (methodsToken.indexOf(method) >= 0) {
		// 获取用户token
		let userToken = uni.getStorageSync("userToken");
		if (!userToken) {
			uni.reLaunch({
				url: '/pages/public/login'
			})
			return false;
		} else {
			//将tokenId置于请求头信息
			postDataHeader.tokenId = userToken;
		}
	}
	//如果调用接口不明确指明不显示loading
	if (!hideLoading) {
		uni.showLoading({
			//title: '加载中'
		});
	}
	uni.request({
		url: apiBaseUrl + method,
		data: data,
		header: {
			'Authorization': postDataHeader.tokenId,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		method: 'POST',
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
	});
}
// 封装get请求
const get = (method, data, callback, hideLoading) => {
	//请求头header信息
	var postDataHeader = {
		tokenId: uni.getStorageSync("userToken")
	};
	//请求头body信息
	var postDataBody = data;
	// 判断token是否存在
	if (methodsToken.indexOf(method) >= 0) {
		// 获取用户token
		let userToken = uni.getStorageSync("userToken");
		if (!userToken) {
			uni.reLaunch({
				url: '/pages/public/login'
			})
			return false;
		} else {
			//将tokenId置于请求头信息
			postDataHeader.tokenId = userToken;
		}
	}

	//如果调用接口不明确指明不显示loading
	if (!hideLoading) {
		uni.showLoading({
			title: '加载中'
		});
	}
	uni.request({
		url: apiBaseUrl + method,
		data: data,
		method: 'GET',
		header: {
			'Authorization': postDataHeader.tokenId
		},
		success: (response) => {
			if (!hideLoading)
				uni.hideLoading();
			const result = response.data
			callback(result);
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
	});

}
// 专门用户获取管理端api的get请求
const getByAdmin = (method, data, callback, hideLoading) => {
	//请求头header信息
	var postDataHeader = {
		tokenId: uni.getStorageSync("userToken")
	};
	//请求头body信息
	var postDataBody = data;
	// 判断token是否存在
	if (methodsToken.indexOf(method) >= 0) {
		// 获取用户token
		let userToken = uni.getStorageSync("userToken");
		if (!userToken) {
			uni.navigateTo({
				url: '/pages/public/login'
			})
			return false;
		} else {
			//将tokenId置于请求头信息
			postDataHeader.tokenId = userToken;
		}
	}

	//如果调用接口不明确指明不显示loading
	if (!hideLoading) {
		uni.showLoading({
			title: '加载中'
		});
	}
	uni.request({
		url: apiByAdmin + method,
		data: data,
		method: 'GET',
		header: {
			'Authorization': postDataHeader.tokenId
		},
		success: (response) => {
			if (!hideLoading)
				uni.hideLoading();
			const result = response.data
			callback(result);
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
	});
}

const showError = error => {
	let errorMsg = ''
	switch (error.status) {
		case 400:
			errorMsg = '请求参数错误'
			break
		case 401:
			errorMsg = '未授权，请登录'
			break
		case 403:
			errorMsg = '跨域拒绝访问'
			break
		case 404:
			errorMsg = `请求地址出错: ${error.config.url}`
			break
		case 408:
			errorMsg = '请求超时'
			break
		case 500:
			errorMsg = '服务器内部错误'
			break
		case 501:
			errorMsg = '服务未实现'
			break
		case 502:
			errorMsg = '网关错误'
			break
		case 503:
			errorMsg = '服务不可用'
			break
		case 504:
			errorMsg = '网关超时'
			break
		case 505:
			errorMsg = 'HTTP版本不受支持'
			break
		default:
			errorMsg = error.msg
			break
	}

	uni.showToast({
		title: errorMsg,
		icon: 'none',
		duration: 1000,
		complete: function() {
			setTimeout(function() {
				uni.hideToast();
			}, 1000);
		}
	});
}

// 文件上传
export const uploadFiles = (callback) => {
	uni.chooseImage({
		success: (chooseImageRes) => {
			uni.showLoading({
				title: '上传中...'
			});
			const tempFilePaths = chooseImageRes.tempFilePaths;
			const uploadTask = uni.uploadFile({
				url: apiBaseUrl + 'api.html', //仅为示例，非真实的接口地址
				filePath: tempFilePaths[0],
				fileType: 'image',
				name: 'file',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'multipart/form-data',
				},
				formData: {
					'method': 'images.upload',
					'upfile': tempFilePaths[0]
				},
				success: (uploadFileRes) => {
					callback(JSON.parse(uploadFileRes.data));
				},
				fail: (error) => {
					if (error && error.response) {
						showError(error.response);
					}
				},
				complete: () => {
					setTimeout(function() {
						uni.hideLoading();
					}, 250);
				}
			});
			// 					uploadTask.onProgressUpdate((res) => {
			//             console.log('上传进度' + res.progress);
			//             console.log('已经上传的数据长度' + res.totalBytesSent);
			//             console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
			//
			//             // 测试条件，取消上传任务。
			//             if (res.progress > 50) {
			//                 uploadTask.abort();
			//             }
			// 					});
		}
	});
}

// 上传图片
export const uploadImage = (num, callback) => {
	uni.chooseImage({
		count: num,
		success: (res) => {
			uni.showLoading({
				title: '上传中...'
			});
			let tempFilePaths = res.tempFilePaths
			for (var i = 0; i < tempFilePaths.length; i++) {
				uni.uploadFile({
					url: apiBaseUrl + 'uploadMediaFile',
					filePath: tempFilePaths[i],
					fileType: 'image',
					name: 'files',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'multipart/form-data',
					},
					formData: {
						'method': 'images.upload',
						'upfile': tempFilePaths[i]
					},
					success: (uploadFileRes) => {
						callback(JSON.parse(uploadFileRes.data));
					},
					fail: (error) => {
						if (error && error.response) {
							showError(error.response);
						}
					},
					complete: () => {
						setTimeout(function() {
							uni.hideLoading();
						}, 250);
					},
				});
			}
		}
	});
}
export const test = (data, callback, hideLoading) => post(
	"consumer/loginUser?password=123456&username=%E5%B0%8F%E6%98%8E1", data, callback, hideLoading);


// 获取参数
export const getParameter = (data, callback, hideLoading) => post('inquiryParameter', data, callback, hideLoading);

// 微信公众号通过code换取open id
export const getOpenIdByCode4OfficialAccount = (data, callback, hideLoading) => post(
	'consumer/getOpenIdByCode4OfficialAccount', data, callback, hideLoading);

// 用户注册
export const reg = (data, callback, hideLoading) => post('consumer/registerUser', data, callback, hideLoading);

// 用户微信登录
export const login = (method, data, callback, hideLoading) => post(method, data, callback, hideLoading);

// 用户信息
export const userInfo = (data, callback, hideLoading) => get('consumer/inquiryUser', data, callback, hideLoading);

// 会员升级需要的会员数和销售额
export const nextUserLevel = (data, callback, hideLoading) => post('consumer/nextUserLevelData', data, callback,
	hideLoading);

// 获取邀请的会员
export const invitedUser = (data, callback, hideLoading) => post('consumer/inquiryInvitedUsers', data, callback,
	hideLoading);

// 编辑用户信息
export const editInfo = (data, callback, hideLoading) => post('consumer/updateUserField', data, callback, hideLoading);

// 发送短信验证码
export const sms = (data, callback, hideLoading) => post('consumer/sendVerificationCode', data, callback, hideLoading);

// 校验短信验证码
export const verifyCode = (data, callback, hideLoading) => post('consumer/verifyCode', data, callback, hideLoading);

// 重置登录密码
export const resetPassword = (data, callback, hideLoading) => post('resetPassword', data, callback, hideLoading);

// 修改登录密码
export const changePassword = (data, callback, hideLoading) => post('changePassword', data, callback, hideLoading);

// 打开消息推送
export const enableNotification = (data, callback, hideLoading) => post('consumer/enableNotification', data, callback,
	hideLoading);

// 关闭消息推送
export const disableNotification = (data, callback, hideLoading) => post('consumer/disableNotification', data, callback,
	hideLoading);

// 获取首页数据
export const home = (data, callback, hideLoading) => post('public/home', data, callback, hideLoading);

// 获取城市
export const inquiryCity = (data, callback, hideLoading) => post('public/searchCity', data, callback, hideLoading);

// 获取首页幻灯片
export const slider = (data, callback, hideLoading) => post('inquirySwiper', data, callback, hideLoading);

// 获取广告
export const advert = (data, callback, hideLoading) => post('inquiryAd', data, callback, hideLoading);

// 获取首页商品类目
export const homeProductCate = (data, callback, hideLoading) => post('public/getHomeProductCate', data, callback,
	hideLoading);

// 获取商品类目下的品牌和广告
export const productCateAddInfo = (data, callback, hideLoading) => post('public/getProductCateAddInfo', data, callback,
	hideLoading);

// 获取秒杀商品
export const secKill = (data, callback, hideLoading) => post('public/inquirySecKill', data, callback, hideLoading);

// 秒杀商品详情
export const secKillDetail = (data, callback, hideLoading) => post('public/inquirySecKill', data, callback,
	hideLoading);

// 获取团购商品
export const groupBuy = (data, callback, hideLoading) => post('public/inquiryGroupBuy', data, callback, hideLoading);

// 团购商品详情
export const groupBuyDetail = (data, callback, hideLoading) => post('consumer/groupBuyDetail', data, callback,
	hideLoading);
// 提交药食同源认证审核
export const approveApplication = (data, callback, hideLoading) => post('product/isApprove', data, callback,
	hideLoading);
// 获取药食同源认证产品列表
export const proveProductList = (data, callback, hideLoading) => getByAdmin('product/list', data, callback,
	hideLoading);
// 根据商品获取正在进行中的拼团
export const getGroupBuyByProduct = (data, callback, hideLoading) => post('public/getGroupBuyByProduct', data, callback,
	hideLoading);

// 抢秒杀资格
export const seckillQuanId = (data, callback, hideLoading) => post('consumer/seckillQuanId', data, callback,
	hideLoading);

// 获取首页商品组
export const productGroup = (data, callback, hideLoading) => post('public/inquiryProductGroup', data, callback,
	hideLoading);

// 获取会员注册专用商品组
export const productGroupForRegister = (data, callback, hideLoading) => post('public/inquiryProductGroupForRegister',
	data, callback, hideLoading);

// 获取商品分类
export const productCate = (data, callback, hideLoading) => get('product/categoryTreeList', data, callback,
	hideLoading);
// 根据分类获取商品数据
export const searchProduct = (data, callback, hideLoading) => post('product/list2c', data, callback, hideLoading)
// 获取文章标签
export const inquiryTag = (data, callback, hideLoading) => post('public/inquiryTag', data, callback, hideLoading);

// 获取文章详情
export const articleInfo = (method, data, callback, hideLoading) => getByAdmin(method, data, callback, hideLoading);

// 获取活动详情
export const acitivityInfo = (method, data, callback, hideLoading) => getByAdmin(method, data, callback,
	hideLoading);

// 获取文章列表
export const articleList = (data, callback, hideLoading) => getByAdmin('knowledge/list', data, callback,
	hideLoading);

//搜索热门问题
export const hotQaList = (data, callback, hideLoading) => post('public/inquiryHotQa', data, callback, hideLoading);

//根据标签搜索问题
export const qaList = (data, callback, hideLoading) => post('public/inquiryQa', data, callback, hideLoading);

// 获取商品列表
export const goodsList = (data, callback, hideLoading) => get('product/list', data, callback, hideLoading);

// 综合搜索、筛选、排序
export const searchProductList = (data, callback, hideLoading) => get('product/search', data, callback, hideLoading);


// 获取商品详情
export const goodsDetail = (method, data, callback, hideLoading) => get(method, data, callback, hideLoading);

// 前台获取商品详情
export const fetchProductDetail = (method, data, callback, hideLoading) => get(method, data, callback, hideLoading);


// 计算运费
export const calculateFreightAmount = (data, callback, hideLoading) => post('consumer/calculateFreightAmount', data,
	callback, hideLoading);

// 获取商品海报
export const goodsPoster = (data, callback, hideLoading) => post('consumer/createPoster', data, callback, hideLoading);

// 查询收藏的商品
export const fetchProductCollectionList = (data, callback, hideLoading) => get('consumer/product/list', data,
	callback, hideLoading);

// 商品收藏详情
export const productCollectionDetail = (data, callback, hideLoading) => get('consumer/product/detail', data,
	callback,
	hideLoading);

// 收藏商品
export const collectProduct = (data, callback, hideLoading) => post('consumer/product/collectProduct', data, callback,
	hideLoading);

// 取消收藏商品
export const cancelCollectProduct = (data, callback, hideLoading) => postByQuery('member/productCollection/delete',
	data,
	callback, hideLoading);

// 清空当前用户商品收藏列表
export const clearProductCollection = (data, callback, hideLoading) => post('member/productCollection/clear', data,
	callback, hideLoading);

// 评论订单
export const commentOrder = (data, callback, hideLoading) => post('consumer/changeProductComment', data, callback,
	hideLoading);

// 获取商品评论信息
export const goodsComment = (data, callback, hideLoading) => post('public/searchProductComment', data, callback,
	hideLoading);

// 添加购物车
export const addCart = (data, callback, hideLoading) => post('consumer/addProductToCart', data, callback, hideLoading);

// 根据购物车每条记录查询商品
export const productByCardIds = (data, callback, hideLoading) => post('consumer/inquiryCartProductByIds', data,
	callback, hideLoading);

// 移除购物车
export const removeCart = (method, data, callback, hideLoading) => post(method, data,
	callback, hideLoading);

// 清空购物车
export const clearCart = (data, callback, hideLoading) => post('consumer/clear', data, callback,
	hideLoading);

// 获取购物车列表
export const cartList = (data, callback, hideLoading) => get('consumer/inquiryCartProduct', data, callback,
	hideLoading);

// 设置购物车商品数量saveUserShip
export const setCartNum = (data, callback, hideLoading) => post('consumer/updateShoppingCartProductNum', data, callback,
	hideLoading);

// 获取购物车数量
export const getCartNum = (method, data, callback, hideLoading) => post('cart/getCartProductNum', data, callback,
	hideLoading);

// 修改购物车中指定商品的数量
export const updateQuantity = (data, callback, hideLoading) => get('consumer/update/quantity', data, callback,
	hideLoading);

// 获取用户的收货地址列表
export const userShip = (data, callback, hideLoading) => get('consumer/address/inquiryUserDeliveryAddress', data,
	callback,
	hideLoading);

// 存储用户收货地址
export const saveUserShip = (data, callback, hideLoading) => post('consumer/address/changeUserDeliveryAddress', data,
	callback,
	hideLoading);

// 收货地址删除
export const removeShip = (method, data, callback, hideLoading) => post(method, data, callback,
	hideLoading);

// 修改收货地址
export const updateAddress = (data, callback, hideLoading) => post(data, callback,
	hideLoading);

// 获取收货地址详情 
export const fetchAddressDetail = (method, data, callback, hideLoading) => get(method, data, callback,
	hideLoading);

// 添加收货地址
export const addAddress = (data, callback, hideLoading) => post('consumer/address/addUserDeliveryAddress', data,
	callback,
	hideLoading);

// 生成订单
export const generateConfirmOrder = (data, callback, hideLoading) => post('consumer/generateConfirmOrder', data,
	callback,
	hideLoading);

// 根据购物车信息生成订单
export const createOrder = (data, callback, hideLoading) => post('consumer/generateOrder', data, callback, hideLoading);

// 取消订单
export const cancelOrder = (data, callback, hideLoading) => postByQuery('order/cancelUserOrder', data, callback,
	hideLoading);

// 删除订单
export const delOrder = (method, data, callback, hideLoading) => post(method, data, callback, hideLoading);

// 获取订单详情
export const orderDetail = (method, data, callback, hideLoading) => post(method, data, callback, hideLoading);

// 获取订单列表
export const fetchOrderList = (data, callback, hideLoading) => get('consumer/list', data, callback,
	hideLoading);

// 获取拆分后订单的总支付金额
export const orderPaymentAmount = (data, callback, hideLoading) => post('consumer/inquiryPaymentAmount', data, callback,
	hideLoading);

// 确认收货
export const confirmOrder = (data, callback, hideLoading) => postByQuery('order/confirmReceiveOrder', data, callback,
	hideLoading);

// 搜索订单
export const searchOrder = (data, callback, hideLoading) => post('order/list', data, callback, hideLoading);

// 查询订单数量
export const searchOrderTotal = (data, callback, hideLoading) => post('order/list', data, callback, hideLoading);


// 申请售后单
export const applyAfterSale = (data, callback, hideLoading) => post('consumer/applyOrderAfterSale', data, callback,
	hideLoading);

// 撤销售后单
export const cancelAfterSale = (data, callback, hideLoading) => post('consumer/cancelOrderAfterSale', data, callback,
	hideLoading);

// 更新售后单
export const updateAfterSale = (data, callback, hideLoading) => post('consumer/updateOrderAfterSale', data, callback,
	hideLoading);

// 填写售后单物流
export const courierAfterSale = (data, callback, hideLoading) => post('consumer/courierOrderAfterSale', data, callback,
	hideLoading);

// 分页查询售后单
export const searchAfterSale = (data, callback, hideLoading) => post('consumer/searchOrderAfterSale', data, callback,
	hideLoading);

// 查询售后单数量
export const searchAfterSaleTotal = (data, callback, hideLoading) => post('consumer/searchOrderAfterSaleTotal', data,
	callback, hideLoading);

// 查询系统通知
export const inquiryNotes = (data, callback, hideLoading) => post('inquiryNotes', data, callback, hideLoading);

// 标记系统通知为已读
export const markNoteRead = (data, callback, hideLoading) => post('markNoteRead', data, callback, hideLoading);

// 查询活动公告
export const inquiryArticle = (data, callback, hideLoading) => post('public/inquiryArticle', data, callback,
	hideLoading);

// 售后单详情
export const afterSalesInfo = (data, callback, hideLoading) => post('consumer/inquiryOrderAfterSaleDetail', data,
	callback, hideLoading);
// 根据id获取订单详情
export const fetchOrderDetail = (method, data, callback, hideLoading) => post(method, data,
	callback, hideLoading);
// 用户支付成功回调
export const payOrderSuccess = (method, data, callback, hideLoading) => post(method, data, callback, hideLoading);
// 小程序微信支付接口
export const wechatPay = (data, callback, hideLoading) => post('consumer/initWechatPay', data, callback, hideLoading);

// 公众号微信支付接口
export const wechatPayH5 = (data, callback, hideLoading) => post('consumer/initWechatPayH5', data, callback,
	hideLoading);

// APP微信支付接口
export const wechatPayApp = (data, callback, hideLoading) => post('consumer/initWechatPayApp', data, callback,
	hideLoading);

// 获取微信支付签名
export const getSignature = (data, callback, hideLoading) => post('consumer/getSignature', data, callback, hideLoading);

// 支付宝H5端接口
export const alipay = (data, callback, hideLoading) => post('consumer/initAlipay', data, callback, hideLoading);

// 支付宝APP端接口
export const alipayApp = (data, callback, hideLoading) => post('consumer/initAlipayApp', data, callback, hideLoading);

// 模拟支付成功接口
export const balancePay = (data, callback, hideLoading) => post('consumer/balancePay', data, callback, hideLoading);



// 获取用户余额明细
export const getStatementList = (data, callback, hideLoading) => post('consumer/searchUserStatement', data, callback,
	hideLoading);

// 获取团队业绩明细
export const getPerformanceList = (data, callback, hideLoading) => post('consumer/searchUserPerformance', data,
	callback, hideLoading);
// 用户提现
export const userToCash = (data, callback, hideLoading) => post('consumer/applyWithdraw', data, callback, hideLoading);

// 用户提现列表
export const cashList = (data, callback, hideLoading) => post('consumer/searchUserWithdraw', data, callback,
	hideLoading);

// 查询提现详情
export const withdrawDetail = (data, callback, hideLoading) => post('consumer/inquiryUserWithdraw', data, callback,
	hideLoading);

// 查询商家
export const merchantList = (data, callback, hideLoading) => post('public/searchMerchant', data, callback, hideLoading);

// 查询商家优惠券
export const merchantCouponList = (data, callback, hideLoading) => post('public/searchMerchantCoupon', data, callback,
	hideLoading);

// 获取商家详情
export const getBrandDetail = (method, data, callback, hideLoading) => get(method, data, callback,
	hideLoading);

// 获取商家相关产品
export const fetchBrandProductList = (data, callback, hideLoading) => get("brand/productList", data, callback,
	hideLoading);

// 商家列表
export const nearbyMerchant = (data, callback, hideLoading) => post('consumer/inquiryNearMerchant', data, callback,
	hideLoading);

// 商家详情
export const merchantDetail = (data, callback, hideLoading) => post('public/inquiryMerchant', data, callback,
	hideLoading);

// 查询是否关注商家
export const isMerchantFollowed = (data, callback, hideLoading) => post('consumer/isMerchantFollowed', data, callback,
	hideLoading);

// 关注商家
export const followMerchant = (data, callback, hideLoading) => post('consumer/followMerchant', data, callback,
	hideLoading);

// 查询关注的商家
export const followedMerchant = (data, callback, hideLoading) => post('consumer/inquiryFollowedMerchant', data,
	callback, hideLoading);

// 取消关注商家
export const cancelFollowMerchant = (data, callback, hideLoading) => post('consumer/cancelFollowMerchant', data,
	callback, hideLoading);

// 微信订阅消息
export const wxSuscribeMsg = (data, callback, hideLoading) => post('public/inquirySuscribeMsg', data, callback,
	hideLoading);

//查询新人福利
export const inquiryProfitWelfare = (data, callback, hideLoading) => post('consumer/inquiryProfitWelfare', data,
	callback, hideLoading);

//领取新人福利
export const receiveProfitWelfare = (data, callback, hideLoading) => post('consumer/receiveProfitWelfare', data,
	callback, hideLoading);

//获取积分签到设置
export const signSetting = (data, callback, hideLoading) => post('public/getSignSetting', data, callback, hideLoading);

//是否签到
export const isPointSigned = (data, callback, hideLoading) => post('consumer/isPointSigned', data, callback,
	hideLoading);

//连续签到天数
export const signDateNum = (data, callback, hideLoading) => post('consumer/getSignDateNum', data, callback,
	hideLoading);

//积分签到
export const signPoint = (data, callback, hideLoading) => post('consumer/signPoint', data, callback, hideLoading);

//积分明细
export const pointStatementList = (data, callback, hideLoading) => post('consumer/searchUserPointStatement', data,
	callback, hideLoading);

//专家指导列表
export const activityList = (data, callback, hideLoading) => getByAdmin('activity/list', data, callback, hideLoading);

// 创建浏览记录
export const createReadHistory = (data, callback, hideLoading) => post('member/readHistory/create', data, callback,
	hideLoading)