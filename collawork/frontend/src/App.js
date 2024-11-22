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
import { TestCalendar } from './calendarTest/TestCalendar';
import { MiniCalendar } from './calendarTest/MiniCalendar';

function App() {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/social-login" element={<SocialLoginCallback />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/project" element={<Layout />}>
                        <Route index element={<Project />} />
                    </Route>
                    <Route path="/api/kakao/user-info" element={<KakaoUserInfo />} />
                    <Route path="/main" element={<MyPage />} />
                    <Route path="/info" element={<UserProfile />} />
                    <Route path="/chattingServer/:chatRoomId" element={<ChatRoom/>} />
                    <Route path="/testcalendar" element={<TestCalendar/>}/>
                    <Route path="/testcalendar1" element={<MiniCalendar/>}/>
                </Routes>
            </Router>
        </UserProvider>
    );
}

export default App;
