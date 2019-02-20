import {
    Http
} from '../utils/http.js';

export class IndexModel extends Http {
    
    //获取轮播图
    getBannerAndActivity(data) {
        return this.request({
            url: 'm/mini/activity/front/pageActivity',
            data
        })
    }

    //列表
    getList(data){
        return this.request({
            url: 'm/mini/commodityPackage/front/listCommodityPackageForType',
            data,
            method: 'POST'
        })
    }

    //任务列表 已登录-未登录 
    getTaskList(data){
        let token = wx.getStorageSync('token').accessToken;
        let url = token ? 'm/mini/commodityPackage/getCommodityPackageDetail' :
            'm/mini/commodityPackage/front/getCommodityPackageDetail'
        return this.request({
            url,
            data,
            method: 'POST'
        })
    }

    //领取
    getTask(data){
        return this.request({
            url:'m/mini/task/saveTeamByCode',
            data,
            method: 'POST'
        })
    }

    //馆卡详情
    getCardsDetail(data) {
        return this.request({
            url: 'm/mini/venueGoods/getCardsDetail',
            data,
            method: 'POST'
        })
    }
    //课程详情
    getCourseDetail(data) {
        return this.request({
            url: 'm/mini/venueGoods/getCourseDetail',
            data,
            method: 'POST'
        })
    }
}