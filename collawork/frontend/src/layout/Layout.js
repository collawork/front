import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Aside from '../components/Aside';
import Search from '../pages/Search';
import FriendList from '../components/Friend/FriendList';
import '../components/assest/css/Layout.css';
import { useUser } from '../context/UserContext';

const Layout = () => {
    const { userId } = useUser();
    const [activeTab, setActiveTab] = useState('friends');

    const renderList = () => {
        if (!userId) {
            console.warn("userId가 아직 초기화되지 않았습니다.");
            return <p>로딩 중...</p>;
        }
        console.log("activeTab : " + activeTab);
        if (activeTab === 'friends') {
            return <FriendList userId={userId} />;
        } else {
            return <p>참여자 목록 준비 중...</p>;
        }
    };

    useEffect(() => {
        console.log("Layout에서의 userId:", userId);
    }, [userId]);

    return (
        <div className="layout-container">
            <Search currentUser={{ id: userId }} />
            <div className="main-content">
                <Aside currentUser={{ id: userId }} />
                <div className="outlet-content">
                    <Outlet />
                </div>
                <div className="participants">
                    <div className="tab-buttons">
                        <button 
                            onClick={() => setActiveTab('friends')} 
                            className={activeTab === 'friends' ? 'active' : ''}
                        >
                            친구 목록
                        </button>
                        <button 
                            onClick={() => setActiveTab('participants')} 
                            className={activeTab === 'participants' ? 'active' : ''}
                        >
                            참여자 목록
                        </button>
                    </div>
                    <div className="friend-list-modal">{renderList()}</div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
