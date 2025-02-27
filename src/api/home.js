// 主要负责首页
import { request } from '@/utils/request'

// 首页轮播图
export function getHomeSwiper(params) {
    return request({
        url: '/home/swiper',
        method: 'get',
        params: params
    })
}

// 租房小组
export function getHomeGroups(params) {
    return request({
        url: '/home/groups',
        method: 'get',
        params: params
    })
}

// 咨询
export function getHomeNews(params) {
    return request({
        url: '/home/news',
        method: 'get',
        params: params
    })
}

