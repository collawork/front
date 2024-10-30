import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import "../components/assest/css/Login.css";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await authService.login({ email, password });
            localStorage.setItem('token', response.token);
            navigate('/');
        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else if (error.request) {
                setError('서버와의 통신에 실패했습니다.');
            } else {
                setError(error.message || '로그인 요청 중 오류가 발생했습니다.');
            }
        }
    };

    const handleSocialLogin = (provider) => {
        const redirectUri = `${window.location.origin}/social-login`; // 소셜 로그인 후 리다이렉션될 URI
        const providerUrls = {
            google: `${process.env.REACT_APP_API_URL}/oauth2/authorize/google?redirect_uri=${redirectUri}`,
            kakao: `${process.env.REACT_APP_API_URL}/oauth2/authorize/kakao?redirect_uri=${redirectUri}`,
            naver: `${process.env.REACT_APP_API_URL}/oauth2/authorize/naver?redirect_uri=${redirectUri}`
        };
        window.location.href = providerUrls[provider];
    };

    return (
        <div className="login-container">
            <h2>로그인</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="input-group">
                    <label>이메일</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>비밀번호</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error-text">{error}</p>}
                <button type="submit" className="submit-button">로그인</button>
                <button type="button" className="register-button" onClick={() => navigate('/register')}>회원가입</button>

                <div className="separator">또는</div>

                <div className="social-login-buttons">
                    <button 
                        type="button" 
                        className="social-button google-button" 
                        onClick={() => handleSocialLogin('google')}>
                        Google로 로그인
                    </button>
                    <button 
                        type="button" 
                        className="social-button kakao-button" 
                        onClick={() => handleSocialLogin('kakao')}>
                        Kakao로 로그인
                    </button>
                    <button 
                        type="button" 
                        className="social-button naver-button" 
                        onClick={() => handleSocialLogin('naver')}>
                        Naver로 로그인
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Login;
