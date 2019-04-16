// pages/card/shop/reviseGoods/index.js
import {
    config
} from '../../../../config.js';
import {
    CardModel
} from '../../../../models/card.js';
let cardModel = new CardModel();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: config.base_img_url,
        taskPrice:'',        //分销价
        salePrice:'',        //销售价
        discountPrice:0,     //优惠券
        recommend:0,         //推荐
        sort:'',             //排序
        shop:0 ,              //收藏
        commisionMoney:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let item =JSON.parse(options.item);
        console.log(item)
        this.setData({
            item,
            id:item.id,
            taskPrice: item.taskPrice || '',        //分销价
            salePrice: item.salePrice + (item.discountPrice || 0),        //销售价
            discountPrice: item.discountPrice || 0,     //优惠券
            recommend: item.recommend,         //推荐
            sort: item.sort || '',             //排序
            shop: item.shop ,              //收藏
            commisionMoney:item.salePrice - item.basePrice
            
        })
        this._getCard();
    },
    onKeep(){
        let discountPrice = this.data.discountPrice;
        let miniSalePrice = this.data.item.miniSalePrice;
        let salePrice = this.data.salePrice;
        let taskPrice = this.data.taskPrice;
        if (discountPrice > (salePrice - miniSalePrice)) {
            wx.showToast({
                title: '优惠券不能高于最大优惠金额！',
                icon: 'none',
            })
            return;
        }

        if (!taskPrice){
            wx.showToast({
                title: '请输入分销价格！',
                icon: 'none',
            })
            return;
        }
        this._reviseGoods();
    },
    onRecommend(){
        this.setData({
            recommend: !this.data.recommend
        })
    },
    onShop(){
        this.setData({
            shop: !this.data.shop
        })
    },
    onDiscountPrice(e){
        let discountPrice = Number(e.detail.value) ;
        let item = this.data.item;
        let salePrice = this.data.salePrice;
        let actrualPrice = salePrice;
        let miniSalePrice = item.miniSalePrice;
        if (discountPrice > (salePrice - item.miniSalePrice)) {
            wx.showToast({
                title: '设定优惠券高于最大优惠金额！',
                icon: 'none',
            })
            return;
        }
        //item.type == 1 ? (salePrice - discountPrice - basePrice) : 
        //(salePrice - discountPrice - taskPrice)
        
        this.setData({
            discountPrice,
            actrualPrice,
            commisionMoney:salePrice - discountPrice - item.basePrice
        })
    },
    onSalePrice(e){
        let salePrice = Number(e.detail.value);
        let discountPrice = this.data.discountPrice;
        let actrualPrice = salePrice;
        let item = this.data.item;
        
        if (salePrice < item.miniSalePrice){
            wx.showToast({
                title: '设定的销售价格不能低于最低销售价！',
                icon: 'none',
            })
            return;
        }
        this.setData({
            salePrice,
            actrualPrice,
            commisionMoney:salePrice - discountPrice - item.basePrice
        })
    },
    onTaskPrice(e){
        let taskPrice = Number(e.detail.value);
        let item = this.data.item;
        if (taskPrice < item.basePrice){
            wx.showToast({
                title: '分销价不能低于出馆价！',
                icon: 'none',
            })
            return;
        }
        this.setData({
            taskPrice
        })
    },
    onSort(e){
        this.setData({
            sort: Number(e.detail.value)
        })
    },
    onGodetail(){
        let item = this.data.item;
        let entry = 2;  //名片详情的标志
        let { customerId, nickName} = this.data.userInfo;
        //type 1 课程  
        if (item.cardsOrCourseType == 1) {
            let url = '/pages/venueCourse/index?packageId=' + item.packageId + '&id=' + item.id + '&entry=' + entry + '&venueGoodsId=' + item.venueGoodsId + '&type=' + item.type + '&customerId=' + customerId + '&nickName=' + nickName; 
            wx.navigateTo({
                url
            })
        }
        //type 2 馆卡
        if (item.cardsOrCourseType == 2) {
            let url = '/pages/venueCard/index?packageId=' + item.packageId + '&id=' + item.id + '&entry=' + entry + '&venueGoodsId=' + item.venueGoodsId + '&type=' + item.type + '&customerId=' + customerId + '&nickName=' + nickName; 
            wx.navigateTo({
                url
            })
        }
    },
    _reviseGoods(){
        let { id,
            taskPrice,
            salePrice,
            discountPrice,
            recommend,
            sort,
            shop } = this.data;
            wx.showLoading()
        cardModel.reviseGoods({
            id,
            taskPrice,
            salePrice,
            discountPrice,
            recommend : Number(recommend),
            sort,
            shop : Number(shop)
        }).then(res => {
            wx.hideLoading();
            wx.showToast({
                title: res.data.msg,
                icon:'none',
                complete(){
                    if (res.data.success) {
                        wx.navigateBack({
                            delta:1
                        })
                    }
                }
            })
        })
    },
    _getCard(customerId = '') {

        cardModel.getCard({
            customerId
        }).then(res => {
            if (!res.data.success) {
                wx.showToast({
                    title: res.data.msg
                })
                return;
            }
            this.setData({
                userInfo: res.data.data,
            })
        })
    },
})