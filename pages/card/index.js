// pages/card/index.js
import {
    config
} from '../../config.js';
import {
    CardModel
} from '../../models/card.js';
let cardModel = new CardModel();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: config.base_img_url,
        userInfo:{},
        customerId: '', //分销员用户ID 
        goods:[],
        isLoading: true,
        share:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        
    },
    onShow(){
        let token = wx.getStorageSync('token')
        let isBindMobile = token.bindingMobile;
        let accessToken = token.accessToken;
        if (!accessToken) {
            wx.showModal({
                title: '提示',
                content: '您还未登录,去登录!',
                showCancel: false,
                success: (res) => {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/authorize/index',
                        })
                    }
                }
            })
            return
        }

        if (!isBindMobile) {
            wx.showModal({
                title: '提示',
                content: '您还未绑定手机,去绑定!',
                showCancel: false,
                success: (res) => {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/bindMobile/index',
                        })
                    }
                }
            })

            return;
        }

        this._getCard();
    },
    onHide(){
        this.setData({
            goods:[]
        })
    },
    onReviseGoods(e){
        let item = e.currentTarget.dataset.item;
        console.log(item)
        wx.navigateTo({
            url: '/pages/card/shop/reviseGoods/index?item=' + JSON.stringify(item),
        })
    },
    onGoShop(){
        wx.navigateTo({
            url: '/pages/card/shop/index',
        })
    },
    onGodetail(e){
        let item = e.currentTarget.dataset.item;
        let entry = 2;  //名片详情的标志
        let { customerId, nickName} = this.data.userInfo;
        //type 1 课程  
        if (item.cardsOrCourseType  == 1) {
            let url = '/pages/venueCourse/index?packageId=' + item.packageId + '&venueGoodsId=' + item.venueGoodsId + '&entry=' + entry + '&type=' + item.type + '&id=' + item.id + '&customerId=' + customerId + '&nickName=' + nickName;
            wx.navigateTo({
                url
            })
        }
        //type 2 馆卡
        if (item.cardsOrCourseType  == 2) {
            let url = '/pages/venueCard/index?packageId=' + item.packageId + '&venueGoodsId=' + item.venueGoodsId + '&entry=' + entry + '&type=' + item.type + '&id=' + item.id+'&customerId=' + customerId + '&nickName=' + nickName;
            wx.navigateTo({
                url
            })
        }
    },
    onLoadMore(){
        let start = this.data.goods.length;
        let total = this.data.total;
        if (start >= total) {
            return
        }
        if (this.data.isLoading) {
            this.data.isLoading = false;
            this._recommendList({ start })
        }
    },
    onRevise(){
        wx.navigateTo({
            url: '/pages/card/reviseCard/index'
        })
    },
    onNavigateToMiniProgram(){
        let customerId = this.data.customerId;
        console.log(customerId)
        wx.navigateToMiniProgram({
            appId: 'wx58248eb6a6468f9c', // 要跳转的小程序的appid
            path: 'pages/share/card/index?customerId=' + customerId, // 跳转的目标页面
            envVersion: 'trial',
            success(res) {
                // 打开成功  
                console.log(res);
            },
            fail(res){
                console.log(res);
            }
        })
    },
    _getCard(customerId=''){

        cardModel.getCard({
            customerId
        }).then(res => {
            console.log(res.data)
            if(!res.data.success){
                wx.showToast({
                    title: res.data.msg
                })
                return;
            }
            this._recommendList({}); //成功后在请求
            this.setData({
                userInfo:res.data.data,
                color: res.data.data.color || '',
                customerId: res.data.data.customerId 
            })
        })
    },
    _recommendList({shop = 1, start = 0, limit = 10}) {
        wx.showLoading();
        cardModel.recommendList({
            shop,
            start,
            limit
        }).then(res => {
            console.log(res.data.data)
            wx.hideLoading();
            this.data.isLoading = true;
            if (!res.data.success) {
                wx.showToast({
                    title: res.data.msg
                })
                return;
            }
            let temArr = this.data.goods.concat(res.data.data.items)
            this.setData({
                goods: temArr,
                total:res.data.data.total
            })
            
        })
    }
})