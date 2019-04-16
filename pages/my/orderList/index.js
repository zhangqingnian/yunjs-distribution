// pages/team/oderList/index.js
import {
    config
} from '../../../config.js';
import { MyModel } from '../../../models/my.js';
let myModel = new MyModel();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        nav:[
            { name: '全部', tab: '', id: 0, isOn:true, msg: '' },
            { name: '未支付', tab: '0', id: 1, isOn: false, msg: '' },
            { name: '已结算', tab: '1', id: 2, isOn: false, msg: '' },
            { name: '已支付', tab: '2', id: 3, isOn: false, msg: '结算中' },
            { name: '已失效', tab: '3', id: 4, isOn: false, msg: '' },
        ],
        imgUrl: config.base_img_url,   //图片前缀
        orderList:[],
        isLoading: true,
        tab:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        let tab = options.tab || '';
        console.log(tab)
        this.data.nav.forEach(item => {
            item.tab === tab ? item.isOn = true : item.isOn = false
        })
        this.setData({ tab,nav:this.data.nav });
        this._orderList({tab})
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        
    },
    onDeatil(e){
        let { id } = e.currentTarget.dataset.item;
        wx.navigateTo({
            url: './orderDetail/index?id='+id,
        })
    },
    onNav(e){
        let {tab,id} = e.currentTarget.dataset.item;
        this.data.nav.forEach(item => {
            item.id == id ? item.isOn = true : item.isOn = false
        })
        this.setData({
            nav:this.data.nav,
            tab,
            orderList:[]
        })
        this._orderList({ tab })
    },
    onReachBottom: function () {
        let total = this.data.total;
        let start = this.data.orderList.length;
        let tab = this.data.tab;
        if (start >= total) return;

        if (this.data.isLoading) {
            this.data.isLoading = false;
            this._orderList({ start, tab })
        }
    },

    _orderList({tab = '',start = 0}){
        wx.showLoading();
        myModel.orderList({
            tab,      //全部'' 未支付0 已结算1 已支付（结算中）2, 已失效 3
            start,
            limit:10
        }).then(res =>{
            wx.hideLoading()
            this.data.isLoading = true;
            let temArr = this.data.orderList.concat(res.data.items);
            console.log(res.data) 
            this.setData({
                total:res.data.total,
                orderList: temArr
            })
        })
    }
})