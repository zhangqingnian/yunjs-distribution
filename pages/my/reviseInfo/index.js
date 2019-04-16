// pages/my/reviseInfo/index.js
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
        userInfo:{},
        portrait:'',  //身份证人像面
        emble:''      //身份证国徽面     
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this._getCustomerInfo()
    },
    //真实姓名
    onrealName(e){
        let realName = e.detail.value.trim();
        if(!realName){
            wx.showToast({
                title: '请输入真实姓名!',
                icon:'none'
            })
            return
        }
        this.setData({
            realName
        })
    },
    //身份证号
    onidCard(e){
        let idCard = e.detail.value.trim();
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (!(reg.test(idCard))) {
            wx.showToast({
                title: '请输入正确的身份证号码!',
                icon: 'none'
            })
            return
        }
        this.setData({
            idCard
        })  
    },
    //手机号码
    onmobile(e){
        let mobile = e.detail.value.trim();
        if (!(/^1[34578]\d{9}$/.test(mobile))) {
            wx.showToast({
                title: '请输入正确的手机号码!',
                icon: 'none'
            })
            return
        } 
        this.setData({
            mobile
        })
    },
    //联系邮箱
    onemail(e){
        let email = e.detail.value.trim();
        var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        if (!(reg.test(email))) {
            wx.showToast({
                title: '请输入正确的邮箱!',
                icon: 'none'
            })
            return
        }
        this.setData({
            email
        })
    },
    //收款账户
    onwechatAccount(e){
        let wechatAccount = e.detail.value.trim();
        if (!wechatAccount) {
            wx.showToast({
                title: '请输入收款账户!',
                icon:'none'
            })
            return
        }
        this.setData({
            wechatAccount
        })
    },
    //身份证人像
    onR(){
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths[0];
                console.log(tempFilePaths)
                this.setData({
                    portrait: tempFilePaths
                })
                wx.uploadFile({
                    url: config.api_base_url + 'm/file/front/upload',
                    filePath: tempFilePaths,
                    name: 'files',
                    success:res => {
                        console.log(res);
                        let reslut = res.data && JSON.parse(res.data);
                        this.setData({
                            idCardsReverse : reslut.data
                        })
                        wx.showToast({
                            title: reslut.msg,
                            icon: 'none',
                            duration: 500
                        })
                    }
                })

            }
        })
    },
    //身份证国徽
    onG() {
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths[0];
                this.setData({
                    emble: tempFilePaths
                })
                wx.uploadFile({
                    url: config.api_base_url + 'm/file/front/upload',
                    filePath: tempFilePaths,
                    name: 'files',
                    success:res => {
                        console.log(res);
                        let reslut = res.data && JSON.parse(res.data);
                        this.setData({
                            idCardsFront : reslut.data
                        })
                        wx.showToast({
                            title: reslut.msg,
                            icon: 'none',
                            duration: 500
                        })
                    }
                })

            }
        })
    },
    onOpenImg(e) {
        let src = e.currentTarget.dataset.src;
        //let url = this.data.imgUrl + name;
        wx.previewImage({
            current: src, // 当前显示图片的http链接
            urls: [src] // 需要预览的图片http链接列表
        })
    },
    //提交修改
    onSubmit(){
        console.log(this.data)
        let { realName,
            idCard,
            idCardsFront,
            idCardsReverse,
            email} = this.data;
        if (realName && idCard && idCardsFront && idCardsReverse){
            this._updateCustomerInfo({
                realName,
                idCard,
                idCardsFront,
                idCardsReverse,
                email
            })
        }else{
            wx.showToast({
                title: '请填写修改的内容!',
                icon:'none'
            })
        }    
        
    },
    //跳转示例
    onExample(){
        wx.navigateTo({
            url: './eg/index',
        })
    },
    _getCustomerInfo(){
        myModel.getCustomerInfo().then(res => {
            console.log(res)
            if(res.data.success){
                this.setData({
                    userInfo:res.data.data,
                    realName: res.data.data.realName || '',
                    idCard: res.data.data.idCard || '',
                    mobile: res.data.data.mobile || '',
                    email: res.data.data.email || '',
                    portrait: res.data.data.idCardsReverse ? config.base_img_url + res.data.data.idCardsReverse : '',  //身份证人像面
                    emble: res.data.data.idCardsFront ? config.base_img_url + res.data.data.idCardsFront : ''    //身份证国徽面    
                })
            }
        })
    },
    _updateCustomerInfo({
        realName,
        idCard,
        idCardsFront,
        idCardsReverse,
        email=''
    }) {
        myModel.updateCustomerInfo({
            realName,
            idCard,
            idCardsFront,
            idCardsReverse,
            email
        }).then(res => {
            console.log(res.data)
            wx.showToast({
                title: res.data.msg,
                icon:'none'
            })
            if (res.data.success) {
                wx.navigateTo({
                    url: '/pages/my/index',
                    
                })
            }
        })
    }
})