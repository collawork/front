import React from 'react';
import { Outlet } from 'react-router-dom';
import Aside from '../components/Aside';
import Search from '../pages/Search';
import '../components/assest/css/Layout.css';
import { useUser } from '../context/UserContext';

const Layout = () => {
    const { userId } = useUser();
    console.log('Layout 페이지의 userId:', userId);

    return (
        <div className="layout-container">
            <Search currentUser={{ id: userId }} />
            <div className="main-content">
                <Aside currentUser={{ id: userId }}/>
                <div className="outlet-content">
                    <Outlet />
                </div>
                <div className="participants">
                    <div>참여자 목록 / 친구 목록</div>
                    <div className="friend-list-modal">
                        <ul>
                            <li>a</li>
                            <li>b</li>
                            <li>c</li>
                            <li>d</li>
                            <li>e</li>
                        </ul>
                    </div>
                    <div>Pagination or other content here</div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
