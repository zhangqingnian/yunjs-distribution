import {
    Http
} from '../utils/http.js';

export class TeamModel extends Http {

    //获取我所在的团队
    teamList(data) {
        return this.request({
            url: 'm/mini/team/pageMyTeam',
            data,
            method: 'POST'
        })
    }

    //团队分销员列表
    saleUser(data) {
        return this.request({
            url: 'm/mini/teamSaleUser/getAllSaleToTeam',
            data,
            method: 'POST'
        })
    }

    //获取分销员总订单
    getSaleAllOrder(data) {
        return this.request({
            url: 'm/mini/teamSaleUser/getSaleAllOrder',
            data,
            method: 'POST'
        })
    }

    //删除分销员
    delSale(data) {
        return this.request({
            url: 'm/mini/teamSaleUser/delSale',
            data,
            method: 'POST'
        })
    }

    //加入团队
    joinTeam(data) {
        return this.request({
            url: 'm/mini/team/joinTeam',
            data,
            method: 'POST'
        })
    }
    
}