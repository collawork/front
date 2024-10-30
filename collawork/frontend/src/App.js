import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SocialLoginCallback from './pages/SocialLoginCallback';
import KakaoUserInfo from './components/Auth/KakaoUserInfo';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/social-login" element={<SocialLoginCallback />} />
                <Route path="/register" element={<Register />} />
                <Route path='/api/kakao/user-info' element={<KakaoUserInfo/>}/>
            </Routes>
        </Router>
    );
}

export default App;
