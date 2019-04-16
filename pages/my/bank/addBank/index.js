// pages/my/bank/addBank/index.js
import { MyModel } from '../../../../models/my.js';
let myModel = new MyModel();
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
    onBankName(e){
        let bankName = e.detail.value.trim();
        this.setData({
            bankName
        })
    },
    onBankNum(e){
        let bankNum = e.detail.value.trim();
        this.setData({
            bankNum
        })
    },
    onRealName(e){
        let realName = e.detail.value.trim();
        this.setData({
            realName
        })
    },
    onSubmit(){
        let { realName, bankName, bankNum } = this.data;
        if (!realName || !bankName || !bankNum){
            wx.showToast({
                title: '请输入有效信息!',
                icon:'none'
            })
            return
        }

        this._addBank(realName, bankName, bankNum)
    },
    _addBank(realName, bankName, bankNum){
        myModel.addBank({
            realName,   //真实姓名
            bankName,   //银行
            bankNum     //卡号
        }).then(res => {
            console.log(res)
            wx.showToast({
                title: res.data.msg,
                success:() => {
                    if(res.data.success){
                        wx.navigateBack({
                            delta:1
                        })
                    }
                }
            })
        })
    }
})