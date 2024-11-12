import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Aside from '../components/Aside';
import Search from '../pages/Search';
import FriendList from '../components/Friend/FriendList';
import '../components/assest/css/Layout.css';
import { useUser } from '../context/UserContext';

const Layout = () => {
    const { userId } = useUser();
    const [activeTab, setActiveTab] = useState('friends'); // friends 또는 participants 으로 설정 해야됨

    const renderList = () => {
        if (activeTab === 'friends') {
            return <FriendList userId={userId} />;
        } else {
            // return <ParticipantList projectId={/* 프로젝트 ID 값 설정 */} />;    프로젝트 만드록 이거 수정 해야됨 저기에 프로젝트 id 값 가져와서 넣어야됨
        }
    };

    return (
        <div className="layout-container">
            <Search currentUser={{ id: userId }} />
            <div className="main-content">
                <Aside currentUser={{ id: userId }} />
                <div className="outlet-content">
                    <Outlet />
                </div>
                
                <div className="participants">
                    {/* 탭 버튼 */}
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

                    {/* 선택된 탭에 따라 렌더링되는 컴포넌트 */}
                    <div className="friend-list-modal">
                        {renderList()}
                    </div>
                    
                    <div>Pagination or other content here</div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
