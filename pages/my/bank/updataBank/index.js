// pages/my/bank/updataBank/index.js
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
        let item =JSON.parse(options.item);
        let { bankName,
            bankNum,
            id} = item;
        this.setData({
            bankName,
            bankNum,
            id
        })
    },
    onBankName(e) {
        let bankName = e.detail.value.trim();
        this.setData({
            bankName
        })
    },
    onBankNum(e) {
        let bankNum = e.detail.value.trim();
        this.setData({
            bankNum
        })
    },
    
    onSubmit() {
        let { bankName, bankNum, id } = this.data;
        this._updateBank(id,bankName,bankNum)
        
    },
    _updateBank(id,
        bankName,
        bankNum){
        myModel.updateBank({
            id,
            bankName,
            bankNum
        }).then(res => {
            wx.showToast({
                title: res.data.msg,
                success: () => {
                    if (res.data.success) {
                        wx.navigateBack({
                            delta: 1
                        })
                    }
                }
            })
        })
    }
})