// import React, { useState, useEffect } from 'react';
// import { SearchBar } from 'antd-mobile';
// import { useNavigate } from 'react-router-dom';
// import { getAreaCommunity } from '@/api/area';  // 修改路径为实际文件路径
// import styles from './index.module.css';
// import Storage from '@/utils/storage';

// // const Search = () => {
// //   const navigate = useNavigate();
// //   const [searchTxt, setSearchTxt] = useState('');
// //   const [tipsList, setTipsList] = useState([]);
// //   let timerId = null;

// //   // 从 localStorage 获取当前城市的 ID
// //   const getCityId = () => {
// //     const locationData = Storage.get('location')
// //     console.log(locationData);

// //     // const location = JSON.parse(window.localStorage.getItem('location')) || {};
// //     return locationData.value || null; // 如果没有获取到城市ID，默认返回 null
// //   };

// //   const handleSearchTxt = (value) => {
// //     setSearchTxt(value);

// //     if (!value) {
// //       setTipsList([]);  // 清空提示列表
// //       return;
// //     }

// //     clearTimeout(timerId);

// //     timerId = setTimeout(async () => {
// //       try {
// //         const cityId = getCityId();  // 获取城市 ID

// //         if (!cityId) {
// //           console.error('未找到城市ID');
// //           return;
// //         }

// //         // 获取小区数据
// //         const res = await getAreaCommunity({ name: value, id: cityId });

// //         setTipsList(res.data.body);  // 设置小区数据
// //       } catch (err) {
// //         console.error('获取小区数据失败:', err);
// //       }
// //     }, 500); // 500ms 防抖
// //   };

// //   const handleSelect = (item) => {
// //     navigate('/rent/add', { state: { name: item.communityName, id: item.community } });
// //   };

// //   return (
// //     <div className={styles.root}>
// //       {/* 搜索框 */}
// //       <SearchBar
// //         placeholder="请输入小区或地址"
// //         value={searchTxt}
// //         onChange={handleSearchTxt}
// //         showCancelButton={true}
// //         onCancel={() => navigate('/home/list')}
// //       />
// //       {/* 搜索结果列表 */}
// //       <ul className={styles.tips}>
// //         {tipsList.map(item => (
// //           <li key={item.community} className={styles.tip} onClick={() => handleSelect(item)}>
// //             {item.communityName}
// //           </li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // };

// // export default Search;
// const Search = () => {
//   // 获取城市数据
//   const locationData = Storage.get('location');
//   const cityId = locationData.label;
//   console.log(cityId);


//   // 状态管理
//   const [searchTxt, setSearchTxt] = useState('');
//   const [tipsList, setTipsList] = useState([]);

//   // 定时器
//   const [timerId, setTimerId] = useState(null); // 去掉 TypeScript 类型定义

//   // 路由跳转
//   const navigate = useNavigate();

//   const onTipsClick = (item) => {
//     navigate('/user/rental', {
//       state: {
//         name: item.communityName,
//         id: item.community
//       }
//     });
//   };

//   // 渲染搜索结果列表
//   const renderTips = () => {
//     return tipsList.map((item) => (
//       <li
//         key={item.community}
//         className={styles.tip}
//         onClick={() => onTipsClick(item)}
//       >
//         {item.communityName}
//       </li>
//     ));
//   };

//   // 搜索小区信息
//   const handleSearchTxt = (value) => {
//     setSearchTxt(value);

//     if (!value) {
//       setTipsList([]);
//       return;
//     }

//     // 清除上一次的定时器
//     if (timerId !== null) {
//       clearTimeout(timerId);
//     }

//     const newTimerId = setTimeout(async () => {
//       try {
//         const res = await getAreaCommunity({ name: value, id: cityId });
//         setTipsList(res.data.body);
//         console.log(res.data.body);

//       } catch (error) {
//         console.error('获取小区数据失败:', error);
//       }
//     }, 500);

//     setTimerId(newTimerId);
//   };

//   // 清理定时器
//   useEffect(() => {
//     return () => {
//       if (timerId !== null) {
//         clearTimeout(timerId);
//       }
//     };
//   }, [timerId]);

//   return (
//     <div className={styles.root}>
//       <SearchBar
//         placeholder="请输入小区或地址"
//         value={searchTxt}
//         onChange={handleSearchTxt}
//         showCancelButton={() => true}
//         onCancel={() => navigate('/home/list')}
//       />
//       <ul className={styles.tips}>{renderTips()}</ul>
//     </div>
//   );
// };

// export default Search;
import React, { useState, useCallback } from 'react';
import { SearchBar, Dialog } from 'antd-mobile';
import { getAreaCommunity } from '@/api/area';
import Storage from '@/utils/storage';
import styles from './index.module.css';
import { useNavigate } from 'react-router-dom'; // 使用 useNavigate 钩子
// import params from '../List/params';
import getCityId from '@/utils/getCityId'


const Search = () => {
  // 获取存储中的城市 ID
  const res = Storage.get('location');
  let cityId = res?.value; // 确保 res 不是 undefined 时才访问 .value

  // 状态管理
  const [searchTxt, setSearchTxt] = useState('');
  const [tipsList, setTipsList] = useState([]);
  const [timerId, setTimerId] = useState(null);

  // 获取 navigate 函数
  const navigate = useNavigate();

  //定义城市id
  // let cityId = Storage.get('location').value
  // const cityName = Storage.get('location').label
  // const processedCityName = cityName.replace("市", ""); //和城市列表里面的城市名对应，都不要加“市”字

  // 处理搜索文本框的变化
  const handleSearchTxt = useCallback((value) => {
    setSearchTxt(value);

    if (!value) {
      // 清空搜索提示列表
      setTipsList([]);
      return;
    }

    // 清除上一次的定时器
    if (timerId) {
      clearTimeout(timerId);
    }

    // 设置新的定时器
    setTimerId(setTimeout(async () => {
      try {
        //这里cityId也是为空的
        if (!cityId) {
          cityId = await getCityId();
        }
        const response = await getAreaCommunity({ name: value, id: cityId });
        setTipsList(response.data.body);
        console.log(response.data.body);
      } catch (error) {
        console.error('搜索小区信息失败:', error);
      }
    }, 500));
  }, [cityId, timerId]);

  // 处理搜索提示项的点击事件
  const onTipsClick = useCallback((item) => {
    // 使用 navigate 进行路由跳转，并传递 state
    // console.log(item);//拿到该小区信息
    if (!Storage.get('token')) {
      Dialog.confirm({
        content: '您还未登录，是否确认去登录？',
        onConfirm: async () => {
          navigate('/login', { state: { type: 'back' } })
        },
      })
      // return //这里的return 表示退出onTipsClick函数
    } 
      navigate('/user/rental', {
        state: {
          name: item.communityName,
          id: item.community,
        },
      });
  }, [navigate]);

  // 渲染搜索提示列表
  const renderTips = () => (
    <ul className={styles.tips}>
      {tipsList.map((item) => (
        <li
          key={item.community}
          className={styles.tip}
          onClick={() => onTipsClick(item)}
        >
          {item.communityName}
        </li>
      ))}
    </ul>
  );

  return (
    <div className={styles.root}>
      {/* 搜索框 */}
      <SearchBar
        placeholder="请输入小区或地址"
        value={searchTxt}
        onChange={handleSearchTxt}
        showCancelButton={() => true}
        onCancel={() => navigate('/home/list')} // 使用 navigate 替代 history.replace
      />

      {/* 搜索提示列表 */}
      {renderTips()}
    </div>
  );
};

export default Search;