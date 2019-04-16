// pages/card/shop/index.js
import {
    config
} from '../../../config.js';
import {
    CardModel
} from '../../../models/card.js';
let cardModel = new CardModel();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: config.base_img_url,
        customerId: '', //分销员用户ID 
        goods: [],
        isLoading: true,
        nav:[],
        shop:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
    },
    onShow(){
        this.setData({ goods:[]})
        this._shopNum();
        this._recommendList({});
    },
    onRevise(e){    
        let item = e.currentTarget.dataset.item;
        wx.navigateTo({
            url: '/pages/card/shop/reviseGoods/index?item='+JSON.stringify(item),
        })
    },
    onNav(e){
        let item = e.currentTarget.dataset.item;
        
        this.data.nav.forEach(e => {
            e.id == item.id ? e.isOn = true : e.isOn = false;
        })
        this.setData({
            shop:item.shop,
            nav:this.data.nav,
            goods:[]
        })
        this._recommendList({shop:item.shop})
    },
    onReachBottom(){
        let start = this.data.goods.length;
        let total = this.data.total;
        let shop = this.data.shop;
        if (start >= total) {
            return
        }
        if (this.data.isLoading) {
            this.data.isLoading = false;
            this._recommendList({ start, shop })
        }
    },
    _shopNum(){
        cardModel.shopNum({
            customerId:''
        }).then(res => {
            let reslut = res.data.data;
            let nav = [{ name: '全部('+reslut.allCount+')', shop: '', isOn: true,id:1 },
                { name: '店铺内(' + reslut.inCount +')', shop: 1, isOn: false,id:2 },
                { name: '店铺外(' + reslut.outCount + ')', shop: 0, isOn: false,id:3 }]
            this.setData({
                nav
            })
        })
    },
    _recommendList({ shop = '', start = 0, limit = 10 }) {
        wx.showLoading();
        let { latitude, longitude } = wx.getStorageSync('currentLocation');
        cardModel.recommendList({
            lat: latitude,
            lon: longitude,
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
                total: res.data.data.total
            })
        })
    }
})