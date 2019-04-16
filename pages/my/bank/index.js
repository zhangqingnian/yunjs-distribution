// pages/my/bank/index.js
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
        imgUrl: config.base_img_url,   //图片前缀
        bankList:[],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    onShow(){
        this._getBank();
    },
    onRemove(e){
        let id = e.currentTarget.dataset.id;
        wx.showModal({
            title: '提示',
            content: '是否将该银行卡设为默认银行卡!',
            success: res => {
                if (res.confirm) {
                    this._removeBank(id)
                }
            }
        })
        
    },
    onUpdata(e){
        let item = e.currentTarget.dataset.item;
        wx.navigateTo({
            url: './updataBank/index?item='+JSON.stringify(item),
        })
    },
    onDefault(e){
        let item = e.currentTarget.dataset.item;
        if (item.defaultChoice == 1)return
        wx.showModal({
            title: '提示',
            content: '是否将该银行卡设为默认银行卡!',
            success:res => {
                if(res.confirm){
                    this._defaultBank(item.id)
                }
            }
        })
        
    },
    onAddBank(){
        wx.navigateTo({
            url: './addBank/index',
        })
    },
    _getBank(){
        myModel.getBank({}).then(res => {
            this.setData({
                bankList: res.data.items
            })
           
        })
    },
    _defaultBank(id){
        wx.showLoading()
        myModel.defaultBank({
            id
        }).then(res => {
            wx.hideLoading()
            console.log(res)
            wx.showToast({
                title: res.data.msg,
            })
            if(res.data.success){
                this._getBank()
            }
        })
    },
    _removeBank(id){
        wx.showLoading()
        myModel.removeBank({
            id
        }).then(res => {
            wx.hideLoading()
            wx.showToast({
                title: res.data.msg,
            })
            if (res.data.success) {
                this._getBank()
            }
        })
    }
})