import { NavBar } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getUserHousesList } from '@/api/user'
import HousesList from "@/components/houses-list";
import './index.scss'
import NoHouse from '@/components/nohouse';
import { Link } from 'react-router-dom'


// 我的出租主体模块
const Rental = (props) => {

    const navigate = useNavigate()
    const [dataList, setDataList] = useState([])

    useEffect(() => {
        getHousesList()
    }, [])

    // 获取已发布房源的列表
    const getHousesList = async () => {
        try {
            let res = await getUserHousesList()

            setDataList(res.data.body)
        } catch (err) { }
    }

    // 判断是否有房源信息
    const hasHouses = dataList.length > 0
    if (!hasHouses) {
        return (
            <div className='rental_box flex_col'>
                <NavBar onBack={() => navigate(-1)}>房屋管理</NavBar>
                <NoHouse >
                    您还没有房源，
                    <Link to="/user/publish" className='link'>
                        去发布房源
                    </Link>
                    吧~
                </NoHouse>
            </div>

        )
    }
    return (
        <div className='rental_box flex_col'>
            <NavBar onBack={() => navigate(-1)} right={<span onClick={() => navigate('/user/publish')} style={{ color: '#33be85' }}>发布房源</span>}>房屋管理</NavBar>
            <div className='list_box pd-lr-10'>
                <HousesList list={dataList}></HousesList>
            </div>
        </div>
    )
}

export default Rental