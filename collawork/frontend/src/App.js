import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Project from './pages/Project';
import Layout from './layout/Layout';
import Register from './pages/Register';
import SocialLoginCallback from './components/auth/SocialLoginCallback';
import KakaoUserInfo from './components/auth/KakaoUserInfo';
import MyPage from './pages/MyPage';
import UserProfile from './pages/Test';
import Dashboard from './pages/Dashboard';
import ChatRoom from './components/Chat/ChatRoom';
import { UserProvider } from './context/UserContext';

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
                </Routes>
            </Router>
        </UserProvider>
    );
}

export default App;
