import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Project from './pages/Project';
import Layout from './layout/Layout';
import Register from './pages/Register';
import SocialLoginCallback from './components/Auth/SocialLoginCallback';
import KakaoUserInfo from './components/Auth/KakaoUserInfo';
import MyPage from './pages/MyPage';
import UserProfile from './pages/Test';
import Dashboard from './pages/Dashboard';
import ChatRoom from './components/Chat/ChatRoom';
import { UserProvider } from './context/UserContext';
import { Calendar } from './components/calendar/Calendar';
import NoticeList from './components/project/notice/NoticeList';
import CreateNotice from './components/project/notice/CreateNotice';

function App() {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />                                           {/* 메인 컴포넌트 */}                            
                    <Route path="/login" element={<Login />} />                                     {/* 로그인 컴포넌트 */}
                    <Route path="/social-login" element={<SocialLoginCallback />} />                {/* 소셜 로그인 컴포넌트 */}
                    <Route path="/register" element={<Register />} />                               {/* 회원가입 컴포넌트 */}
                    <Route path="/project" element={<Layout />}>                                    {/* 레이아웃 컴포넌트 */}
                        <Route index element={<Project />} />                                       {/* 프로젝트 컴포넌트 */}
                    </Route>
                    <Route path="/projects/:projectId/notices" element={<NoticeList />} />          {/* 공지사항 목록 컴포넌트*/}
                    <Route path="/projects/:projectId/notices/new" element={<CreateNotice />} />    {/* 공지사항 작성 컴포넌트*/}
                    <Route path="/api/kakao/user-info" element={<KakaoUserInfo />} />               {/* 카카오 사용자 정보 목록 테스트 컴포넌트 */}
                    <Route path="/main" element={<MyPage />} />                                     {/* 마이페이지 컴포넌트 */}
                    <Route path="/info" element={<UserProfile />} />                                {/* 사용자 프로필 컴포넌트 */}
                    <Route path="/chattingServer/:chatRoomId" element={<ChatRoom/>} />              {/* 채팅방 컴포넌트*/}
                    <Route path="/calendar" element={<Calendar/>}/>
                    {/* <Route path="/*" element={<ErrorPage/>}/> */}
                </Routes>
            </Router>
        </UserProvider>
    );
}

export default App;
