// pages/my/cashApply/index.js

import { MyModel } from '../../../models/my.js';
let myModel = new MyModel();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        nameShow:false,
        info:{},
        scottare:-1,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let settlement = options.settlement;
        this.setData({ settlement})
        this._cashInfo();
    },
    onShow(){
        this._getBank()
    },
    onMoney(e){
        let cashMoney = e.detail.value.trim();
        if (!cashMoney) {
            wx.showToast({
                title: '请输入提现金额!',
                icon: 'none'
            })
            return
        }
       
        if (Number(cashMoney) > this.data.info.withdrawCash) {
            wx.showModal({
                title: '提示',
                content: '您输入的提现金额已超出可提现金额',
                showCancel:false
            })
            return
        }
        console.log(cashMoney)
        this.setData({
            cashMoney
        })
        this._cashTax(cashMoney)
    },
    onName(e){
        let realName = e.detail.value.trim();
        if (!realName){
            wx.showToast({
                title:'请输入真实姓名!',
                icon:'none'
            })
            return
        }
        this.setData({
            realName
        })
    },
    onChangName(){
        this.setData({
            nameShow: !this.data.nameShow
        })
    },
    onRule(){
        wx.navigateTo({
            url: './rule/index',
        })
    },
    onSubmit(){
        let { scottare, cashMoney } = this.data;
        let cashType = 1; //1 微信 2银行卡  
        if (cashMoney > 5000){
            cashType = 2
            wx.showModal({
                title: '提示',
                content: '提现金额超过5000只能银行卡提现',
                success: r => {
                    if(r.confirm){
                        this._cash(scottare, cashMoney, cashType)
                    }
                }
            })
            return
        }
        this._cash(scottare, cashMoney, cashType)
        
    },
    onBank(){
        wx.navigateTo({
            url: '/pages/my/bank/index',
        })
    },
    //提现
    _cash(scottare, cashMoney, cashType){
        wx.showLoading();
        myModel.cash({
            scottare,     //税
            cashMoney,    //提现金额
            cashType      //1 微信 2银行卡  
        }).then(res => {
            wx.hideLoading()
            console.log(res)
            wx.showModal({
                title: '提示',
                content: res.data.msg,
                showCancel: false,
                confirmText: '知道了',
                success: r => {
                    if (r.confirm) {

                        wx.navigateBack({
                            delta: 1
                        })
                    }

                }
            })
        })
    },
    //提现信息
    _cashInfo() {
        myModel.cashInfo().then(res => {
            console.log(res)
            if (!res.data.success){
                wx.showModal({
                    title: '提示',
                    showCancel:false,
                    confirmText:'知道了',
                    content: res.data.msg,
                    success:r => {
                        if (r.confirm){
                            //未完成实名认证
                            if (res.data.code == 'NOT_REAL_NAME_AUTHENTICATION') {
                                wx.navigateTo({
                                    url: '/pages/my/reviseInfo/index',
                                })
                                return
                            }

                            wx.navigateBack({
                                delta: 1
                            })
                        }
                        
                    }
                })
                return
            }
            this.setData({
                info:res.data.data,
                realName: res.data.data.realName
            })
        })
    },
    //提现纳税额
    _cashTax(cashMoney) {
        myModel.cashTax({
            cashMoney
        }).then(res => {
            this.setData({
                scottare: res.data.data.scottare
            })
        })
    },
    //银行卡
    _getBank() {
        myModel.getBank({}).then(res => {
            console.log(res.data.items)
            var bankNum = ''
            res.data.items.forEach((item, i) => {
                if (item.defaultChoice == 1){
                    bankNum = item.bankNum
                }
            })
            console.log(bankNum)
            if(!bankNum){
                bankNum = res.data.items[0].bankNum || '添加或更换银行卡';
            }

            console.log(bankNum)
            this.setData({
                bankNum
            })

        })
    },
})