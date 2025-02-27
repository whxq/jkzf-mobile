import React from "react";
import SwiperModul from "./swiper";
import Groups from './groups'
import News from './news'
import { Image, Dialog } from 'antd-mobile'
import NavImg1 from '@/assets/image/nav-1.png'
import NavImg2 from '@/assets/image/nav-2.png'
import NavImg3 from '@/assets/image/nav-3.png'
import NavImg4 from '@/assets/image/nav-4.png'
import './index.scss'
import { useNavigate } from "react-router-dom"
import Storage from '@/utils/storage'

//获取浏览器地理位置信息
navigator.geolocation.getCurrentPosition(position => {
    console.log('当前位置信息：', position)
    //latitude: 30.440956533701563  经度
    // longitude: 114.25893380532446 纬度
})


// 首页菜单模块
const Navbtn = () => {
    const list = [
        { name: '整租', imgSrc: NavImg1, path: '/home/list', needLogin: true },
        { name: '合租', imgSrc: NavImg2, path: '/home/list', needLogin: true },
        { name: '地图找房', imgSrc: NavImg3, path: '/map', needLogin: false },
        { name: '去出租', imgSrc: NavImg4, path: '/user/rental', needLogin: true },
    ]
    const navigate = useNavigate()

    const handlerGrid = (val, needLogin) => {
        if (needLogin && !Storage.get('token')) {
            Dialog.confirm({
                content: '您还未登录，是否确认去登录？',
                onConfirm: async () => {
                    navigate('/login', { state: { type: 'back' } })
                },
            })
            return
        } else navigate(val)
    }
    return (
        <div className="menu_box flex_ctr">
            {list.map(item => (
                <div className="flex_col" key={item.name} onClick={() => handlerGrid(item.path, item.needLogin)}>
                    <Image src={item.imgSrc} lazy width={48} height={48} style={{ borderRadius: 24 }} />
                    <span className="mg-t-3">{item.name}</span>
                </div>
            ))}
        </div>
    )
}


// 首页主体模块
const Home = () => {
    return (
        <div className="home_box">
            <SwiperModul></SwiperModul>
            <Navbtn></Navbtn>
            <Groups></Groups>
            <News></News>
        </div>
    )
}

export default Home