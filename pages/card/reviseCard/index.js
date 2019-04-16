// pages/card/reviseCard/index.js
import {
    config
} from '../../../config.js';
import {
    CardModel
} from '../../../models/card.js';
let cardModel = new CardModel();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: config.base_img_url,
        userInfo:{},
        
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this._getCard()
    },
    onNickName(e){
        let nickName = e.detail.value.trim();
        // if(!nickName){
        //     wx.showToast({
        //         title: '请填写正确的昵称！',
        //         icon:'none'
        //     })
        //     return
        // }
        this.setData({
            nickName
        })
    },
    onMobile(e) {
        let mobile = e.detail.value.trim();
        // if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(mobile))){
        //     wx.showToast({
        //         title: '请填写合法的手机号码！',
        //         icon: 'none'
        //     })
        //     return
        // }
        this.setData({
            mobile
        })
    },
    onEmail(e) {
        let email = e.detail.value.trim();
        // if (!(/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(email))) {
        //     wx.showToast({
        //         title: '请填写合法的邮箱！',
        //         icon: 'none'
        //     })
        //     return
        // }
        this.setData({
            email
        })
    },
    onAddress(e) {
        let address = e.detail.value.trim();
        // if (!address) {
        //     wx.showToast({
        //         title: '请填写正确的地址！',
        //         icon: 'none'
        //     })
        //     return
        // }
        this.setData({
            address
        })
    },
    //头像
    onImg() {
        let that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths[0];
                this.setData({
                    img: tempFilePaths
                })

                wx.uploadFile({
                    url: config.api_base_url + 'm/file/front/upload',
                    filePath: tempFilePaths,
                    name: 'files',
                    success(res) {
                        console.log(res);
                        let reslut = res.data && JSON.parse(res.data);
                        that.setData({
                            iconUrl: reslut.data
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
    //修改(保存)
    onRevise(e){
        let color = e.currentTarget.dataset.color;
        let { nickName,
            email,
            address,
            iconUrl,
            id} = this.data;
        cardModel.reviseCard({
            nickName,
            email,
            address,
            iconUrl: iconUrl || '',
            color,
            id
        }).then(res => {
            console.log(res.data)
            if (!res.data.success) {
                wx.showToast({
                    title: res.data.msg
                })
                return;
            }
            wx.navigateBack({
                delta:1
            })
        })
    },

    

    _getCard(userId = '') {
        cardModel.getCard({
            userId
        }).then(res => {
            console.log(res.data)
            if (!res.data.success) {
                wx.showToast({
                    title: res.data.msg
                })
                return;
            }
            this.setData({
                userInfo: res.data.data,
                img: config.base_img_url + res.data.data.iconUrl,
                nickName: res.data.data.nickName,
                email: res.data.data.email || '无',
                address: res.data.data.address || '无',
                id:res.data.data.id
            })
        })
    }
    
})