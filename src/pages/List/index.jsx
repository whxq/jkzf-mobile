import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DownFill, SearchOutline, EnvironmentOutline } from 'antd-mobile-icons'
import { Dropdown, Selector, Button, SideBar, InfiniteScroll, Toast } from 'antd-mobile'
import Storage from '@/utils/storage'
import { getAreaChildList, getAreaInfo } from '@/api/area'
import { getHousesList } from '@/api/house'
import paramsData from "./params";
import HousesList from "@/components/houses-list";
import './index.scss'
import getCityId from '@/utils/getCityId'
const List = () => {
    const navigate = useNavigate()
    // 获取本地缓存定位数据
    const cityName = Storage.get('location').label
    const processedCityName = cityName.replace("市", ""); //和城市列表里面的城市名对应，都不要加“市”字
    let cityId = Storage.get('location').value
    const [activeKey, setActiveKey] = useState('roomType')
    // 城市区域列表
    const [areaList, setAreaList] = useState([])
    // 搜索表单数据
    const [paramForm, setParamForm] = useState({
        cityId: Storage.get('location').value,             // 地区的id
        area: null,               // 地区
        subway: null,             // 地铁
        rentType: null,           // 整租
        price: null,              // 价格
        roomType: '',           // 房屋类型
        oriented: '',           // 朝向
        characteristic: '',     // 标签 房屋亮点
        floor: '',              // 楼层
        start: 1,               // 开始项
        end: 20                 // 结束项
    })
    // 定义预筛选的值
    const [paramFormText, setParamFormText] = useState({})
    // 房源数据列表
    const [housesList, setHousesList] = useState([])
    // 定义下拉菜单属性
    const refDrop = useRef(Dropdown)
    // 上拉加载是否还有更多内容
    const [hasMore, setHasMore] = useState(false)

    useEffect(() => {
        getAreaList()
        console.log(cityId);
        getSearchList()
    }, [cityId]) //这里需要传入参数，这样切换城市后会自动刷新城市区域列表

    const getAreaList = async () => {
        try {
            if (!cityId) {
                //根据定位获取城市id为空，所以加了个判断如果id为空则根据城市名查找对应id，再根据id查找城市区域信息
                cityId = await getCityId();
                let res = await getAreaChildList({ id: cityId })
                setAreaList(res.data.body)
            } else {
                let res = await getAreaChildList({ id: cityId })
                // const testCityId = 'AREA|ceb9b4d6-c3dc-e4da';
                // const res = await getAreaChildList({ id: testCityId })
                setAreaList(res.data.body)
            }
        } catch (err) {
            console.log('获取城市区域列表失败', err);
        }
    }

    // 获取搜索房源列表
    const getSearchList = async (val) => {
        try {
            Toast.show({ icon: 'loading', content: '加载中…' })

            let res = await getHousesList(val ? val : paramForm)

            setHousesList(res.data.body.list)
            // 重置预筛选的值
            setParamFormText({})
            setHasMore(res.data.body.list.length > 0)
            Toast.clear()
        } catch (err) {
            console.log('获取搜索列表失败');
        }
    }
    // 下拉筛选操作回调
    const handlerDropdown = (e, val) => {
        let data = Object.assign({}, paramFormText, paramForm)
        data[e] = val[0]
        // 保存预筛选的值
        setParamFormText(data)
        console.log(1111, data)
    }
    // 确认筛选
    const handlerConfirm = () => {
        let data = Object.assign({}, paramFormText, { start: 1 })
        setHasMore(true)
        // 把预筛选的值更新到请求表单里
        setParamForm(data)
        getSearchList(data)
        // 关闭下拉菜单
        refDrop.current?.close()
    }
    // 上拉加载更多回调函数
    const loadMore = async () => {
        try {
            let data = Object.assign({}, paramForm)
            data.start = paramForm.start + 1
            let res = await getHousesList(data)

            setParamForm(data)
            setHousesList((val) => [...val, ...res.data.body.list])
            setHasMore(res.data.body.list.length > 0)
        } catch (err) { }
    }

    const DropdownItem = [
        { key: 'area', title: '区域', option: '' },
        { key: 'rentType', title: '方式', option: 'line' },
        { key: 'price', title: '租金', option: 'price' }
    ]

    return (
        <div className="find_list_box flex_col">
            <div className="search_box flex_ctr">
                <div className="left_ flex_ctr mg-r-10">
                    <span className="mg-r-3" onClick={() => navigate('/cityList')}>{processedCityName}</span>
                    {/* <span className="mg-r-3" onClick={() => navigate('/cityList')}>武汉</span> */}
                    <DownFill fontSize={10} />
                    <div className="click_search flex_">
                        <SearchOutline fontSize={18} />
                        <span className="mg-l-5" onClick={() => navigate('/search')}>请输入小区或地址</span>
                    </div>
                </div>
                <EnvironmentOutline fontSize={25} color='#1677ff' onClick={() => navigate('/map')} />
            </div>
            <div className="find_content flex_col">
                <Dropdown ref={refDrop}>
                    {DropdownItem.map(item => (
                        <Dropdown.Item key={item.key} title={item.title}>
                            <div className="find_dropdown_content pd-10">
                                <Selector options={item.option ? paramsData[item.option] : areaList}
                                    columns={3} defaultValue={[paramForm[item.key]]}
                                    onChange={(arr) => handlerDropdown(item.key, arr)} />
                            </div>
                            <div className="dropdown_btn flex_">
                                <div style={{ width: 120 }}><Button block shape='rectangular' onClick={() => refDrop.current?.close()}>取消</Button></div>
                                <div style={{ flex: 1 }}>
                                    <Button block color='primary' shape='rectangular' onClick={handlerConfirm}>确认</Button>
                                </div>
                            </div>
                        </Dropdown.Item>
                    ))}
                    <Dropdown.Item key='activeKey' title='筛选'>
                        <div className="find_dropdown_content flex_" style={{ height: 350, overflow: 'hidden' }}>
                            <SideBar activeKey={activeKey} defaultValue={[paramForm[activeKey]]} onChange={setActiveKey} style={{ '--width': '90px' }}>
                                {paramsData.tabsList.map(item => (
                                    <SideBar.Item key={item.key} title={item.title} />
                                ))}
                            </SideBar>
                            <div style={{ flex: 1, overflowY: 'scroll' }} className='pd-10'>
                                {paramsData.tabsList.map(item => (
                                    <div key={item.key} style={{ display: activeKey === item.key ? 'block' : 'none' }}>
                                        <Selector options={paramsData[item.key]}
                                            defaultValue={[paramForm[item.key]]}
                                            columns={item.key === 'characteristic' ? 2 : 3}
                                            onChange={(arr) => handlerDropdown(item.key, arr)} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="dropdown_btn flex_">
                            <div style={{ width: 120 }}><Button block shape='rectangular' onClick={() => refDrop.current?.close()}>取消</Button></div>
                            <div style={{ flex: 1 }}>
                                <Button block color='primary' shape='rectangular' onClick={handlerConfirm}>确认</Button>
                            </div>
                        </div>
                    </Dropdown.Item>
                </Dropdown>
                <div className="houses_content">
                    <HousesList list={housesList}></HousesList>
                    <InfiniteScroll loadMore={loadMore} hasMore={hasMore} threshold={100}></InfiniteScroll>
                </div>
            </div>
        </div>
    )
}

export default List