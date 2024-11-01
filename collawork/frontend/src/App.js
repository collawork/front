import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Project from './pages/Project';
import Layout from './layout/Layout';
import Register from './pages/Register';
import SocialLoginCallback from './pages/SocialLoginCallback';
import KakaoUserInfo from './components/Auth/KakaoUserInfo';
import WeatherBackground from './pages/WeatherBackground';
import UserProfile from './pages/Test';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/social-login" element={<SocialLoginCallback />} />
                <Route path="/register" element={<Register />} />

                <Route path="/project" element={<Layout />}>
                    <Route index element={<Project/>} />
                </Route>

                <Route path='/api/kakao/user-info' element={<KakaoUserInfo/>}/>
                <Route path='/home' element={<WeatherBackground/>}/>
                <Route path='/info' element={<UserProfile/>} />
            </Routes>
        </Router>
    );
}

export default App;
