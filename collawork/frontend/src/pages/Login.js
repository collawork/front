import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { useUser } from '../context/UserContext';
import "../components/assest/css/Login.css";

function Login() {
    const navigate = useNavigate();
    const { setUserId } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userId = await authService.login({ email, password });
            setUserId(userId); // 로그인 후 userId 설정
            navigate('/main');
        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else if (error.request) {
                setError('이메일 또는 비밀번호를 확인해 주세요.');
            } else {
                setError(error.message || '로그인 요청 중 오류가 발생했습니다.');
            }
        }
    };

    const handleSocialLogin = (provider) => {
        const providerUrls = {
            google: `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&redirect_uri=http://localhost:8080/login/oauth2/code/google&response_type=code&scope=email%20profile`,
            kakao: `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_CLIENT_ID}&redirect_uri=http://localhost:8080/login/oauth2/code/kakao&response_type=code`,
            naver: `https://nid.naver.com/oauth2.0/authorize?client_id=${process.env.REACT_APP_NAVER_CLIENT_ID}&redirect_uri=http://localhost:8080/login/oauth2/code/naver&response_type=code`,
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
