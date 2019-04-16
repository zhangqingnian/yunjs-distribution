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

    //领取任务
    getTask(data){
        return this.request({
            url:'m/mini/task/saveTeamByCode',
            data,
            method: 'POST'
        })
    }

    //馆卡详情
    getCardsDetail(data, entry, received = 0) {
        // let url = entry == 1 ? 'm/mini/venueGoods/front/getCardsDetail' :
        //     'm/mini/venueGoods/getCardsDetail';

        var url = '';
        if (entry == 1) {
            if (received == 1) {
                url = 'm/mini/venueGoods/getCardsDetail';
            } else {
                url = 'm/mini/venueGoods/front/getCardsDetail';
            }
        } else {
            url = 'm/mini/venueGoods/getCardsDetail';
        }      
        return this.request({
            url,
            data,
            method: 'POST'
        })
    }
    //课程详情
    getCourseDetail(data, entry, received = 0) {
        // let url = entry == 1 ? 'm/mini/venueGoods/front/getCourseDetail' :
        //                         'm/mini/venueGoods/getCourseDetail';
        var url = '';
        if(entry == 1){
            if (received == 1){
                url = 'm/mini/venueGoods/getCourseDetail';
            }else{
                url = 'm/mini/venueGoods/front/getCourseDetail';
            }
        }else{
            url = 'm/mini/venueGoods/getCourseDetail';
        }                        
        
        return this.request({
            url,
            data,
            method: 'POST'
        })
    }

    //课程详情 - 班级
    getClass(id) {
        return this.request({
            url: 'm/crm/venueClass/front/venueClassDetail?classId=' + id,
        })
    }

    
}