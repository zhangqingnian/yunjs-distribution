// pages/my/index.js
let orderType = [
    { name: '未支付', src: '/images/my/unpay.png', msg: "",id:1},
    { name: '已结算', src: '/images/my/paying.png', msg: "",id:2 },
    { name: '已支付', src: '/images/my/payed.png', msg: "(结算中)",id:3 },
    { name: '未支付', src: '/images/my/invalid.png', msg: "",id:4 },
]
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderType: orderType
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    //订单跳转
    onOrder(e){
        let id = e.currentTarget.dataset.id;
        //0全部 1未支付 2已结算 3已支付 4未支付
        wx.navigateTo({
            url: '',
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
            '我的任务':'',
            '分析商品管理':'',
            '银行卡':'./bank/index',
            '公众号':''
        }
        let url = _router[name];
        console.log(url)
        wx.navigateTo({
            url
        })
    },
   
})