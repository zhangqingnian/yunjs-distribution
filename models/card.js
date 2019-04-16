import {
    Http
} from '../utils/http.js';

export class CardModel extends Http {

    //名片
    getCard(data) {
        return this.request({
            url: 'm/mini/saleUser/getSaleUser',
            data,
            method: 'POST'
        })
    }

    //修改名片
    reviseCard(data){
        return this.request({
            url: 'm/mini/saleUser/updateSaleUser',
            data,
            method: 'POST'
        })
    }

    //推荐商品列表(我的店铺)
    recommendList(data){
        return this.request({
            url: 'm/mini/goodsSort/getAllGoodsForSale',
            data,
            method: 'POST'
        })
    }

    //我的店铺数量
    shopNum(data) {
        return this.request({
            url: 'm/mini/goodsSort/getShopGoodsCount',
            data,
            method: 'POST'
        })
    }

    //店铺商品修改
    reviseGoods(data) {
        return this.request({
            url: 'm/mini/taskGoods/updateTaskGoodsSalePrice',
            data,
            method: 'POST'
        })
    }
}