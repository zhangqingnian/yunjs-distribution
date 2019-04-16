// pages/my/code/index.js
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
        isShow:false,
        isOn:false,
        on: '/images/my/icon-on.png',
        off: '/images/my/icon-off.png',
        imgUrl: config.base_img_url,   //图片前缀
        base_disImg_url: config.base_disImg_url,
        src:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let baseInfo = JSON.parse(options.baseInfo);
        this.setData({ baseInfo});
        //scene 只能放三个字符
    },
    onShow(){
        let baseInfo = this.data.baseInfo;
        if (baseInfo.teamCodeImg) {
            this.setData({
                src: this.data.base_disImg_url + baseInfo.teamCodeImg
            })
            return
        }
        this._code()
    },

    onSelect(){
        this.setData({
            isOn:!this.data.isOn
        })
    },
    onKeep(){
        wx.showLoading()
        wx.downloadFile({
            url: this.data.src,
            success: (res) => {
                wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    complete(res) {
                        wx.hideLoading()
                        if (res.errMsg == "saveImageToPhotosAlbum:ok"){
                            wx.showToast({
                                title: '保存成功',
                            })
                        }
                    }
                })
            }
        })
    },
    
    _code(){
        let teamCode =  wx.getStorageSync('teamCode');
        if(!teamCode){
            wx.showToast({
                title: '首次请先从个人中心进入',
                icon:'none'
            })
            return;
        }
        let scene = teamCode,
            page = 'pages/addTeam/index';
        wx.showLoading({
            title: '',
        })
        myModel.code({
            scene,
            page
        }).then(res =>{
            console.log(res)
            let src = res.data.data;
            wx.hideLoading()
            this.setData({
                src: this.data.base_disImg_url + src
            })
           
        })
    }
})