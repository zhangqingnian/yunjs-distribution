// pages/my/index.js
import {
    config
} from '../../config.js';
import {MyModel} from '../../models/my.js';
let myModel = new MyModel();

let orderType = [
    { name: '未支付', src: '/images/my/unpay.png', msg: "",id:1,tab:0},
    { name: '已结算', src: '/images/my/paying.png', msg: "", id: 2, tab: 1 },
    { name: '已支付', src: '/images/my/payed.png', msg: "(结算中)", id: 3, tab: 2 },
    { name: '已失效', src: '/images/my/invalid.png', msg: "", id: 4, tab: 3 },
]
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: config.base_img_url,   //图片前缀
        orderType: orderType,
        baseInfo:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
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
        this._getBaseInfo()
    },
    //订单跳转
    onOrder(e){
        let tab = e.currentTarget.dataset.tab;
        //''全部 0未支付 1已结算 2已支付 3已失效
        wx.navigateTo({
            url: '/pages/my/orderList/index?tab=' + tab,
        })
    },
    //页面跳转
    onSkip(e){
        let name = e.currentTarget.dataset.name;
        let _router = {
            '修改个人资料': './reviseInfo/index',
            '二维码': './code/index',
            '设置': './set/index',
            '提现记录':'./cashRecord/index',
            '提现':'./cashApply/index',
            '我的任务':'./task/index',
            '分析商品管理':'/pages/card/shop/index',
            '银行卡':'./bank/index',
            '公众号':''
        }
        let url = _router[name];
        console.log(url)
        if(name == '二维码'){
            url = './code/index?baseInfo=' + JSON.stringify(this.data.baseInfo)
        }
        if (name == '提现') {
            url = './cashApply/index?settlement=' + this.data.baseInfo.settlement
        }

        wx.navigateTo({
            url
        })
    },
    _getBaseInfo(){
        myModel.getBaseInfo().then(res => {
            console.log(res.data.data)
            wx.setStorageSync('teamCode', res.data.data.teamCode)
            if(res.data.success){
                this.setData({
                    baseInfo:res.data.data
                })
            }
        })
    }
})