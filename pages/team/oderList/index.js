// pages/team/oderList/index.js
import {
    config
} from '../../../config.js';
import {
    TeamModel
} from '../../../models/team.js';
let teamModel = new TeamModel();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        nav: [
            { name: '全部', tab: '', id: 0, isOn: true, msg: '' },
            { name: '未支付', tab: 0, id: 1, isOn: false, msg: '' },
            { name: '已结算', tab: 1, id: 2, isOn: false, msg: '' },
            { name: '已支付', tab: 2, id: 3, isOn: false, msg: '结算中' },
            { name: '已失效', tab: 3, id: 4, isOn: false, msg: '' },
        ],
        imgUrl: config.base_img_url,   //图片前缀
        orderList: [],
        isLoading: true,
        tab: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let saleUser = JSON.parse(options.item)
        console.log(saleUser)
        let teamId = saleUser.teamId;
        let saleId = saleUser.saleUserId;
        this.setData({
            teamId, saleId, saleUser
        })
        this._orderList({teamId, saleId});

        
    },
    onDel(){
        let { teamId, saleId } = this.data;
        this._del(teamId, saleId)
    },
    onDeatil(e) {
        let { orderId } = e.currentTarget.dataset.item;
        wx.navigateTo({
            url: './oderDetail/index?id=' + orderId,
        })
    },
    onNav(e) {
        let { tab, id } = e.currentTarget.dataset.item;
        let { teamId, saleId} = this.data;
        this.data.nav.forEach(item => {
            item.id == id ? item.isOn = true : item.isOn = false
        })
        this.setData({
            nav: this.data.nav,
            tab,
            orderList: []
        })
        this._orderList({ tab, teamId, saleId })
    },
    onReachBottom: function () {
        let { tab, total, teamId, saleId} = this.data;
        let start = this.data.orderList.length;
        if (start >= total) return;

        if (this.data.isLoading) {
            this.data.isLoading = false;
            this._orderList({ start, tab, teamId, saleId })
        }
    },
    _orderList({teamId,saleId,tab='',start = 0, limit = 10}){
        wx.showLoading();
        teamModel.getSaleAllOrder({
            teamId,
            saleId,
            tab,      //全部'' 未支付0 已结算1 已支付（结算中）2, 已失效 3
            start,
            limit: 10
        }).then(res => {
            wx.hideLoading()
            this.data.isLoading = true;
            let temArr = this.data.orderList.concat(res.data.items);
            console.log(res.data)
            this.setData({
                total: res.data.total,
                orderList: temArr
            })
            
        })
    },
    _del(teamId,saleUserId){
        wx.showLoading()
        teamModel.delSale({
            teamId,
            saleUserId
        }).then(res =>{
            wx.hideLoading()
            console.log(res);
            wx.showToast({
                title: res.data.msg,
                icon:'none'
            })

            if(res.data.success){
                
            }
        })
    }
})