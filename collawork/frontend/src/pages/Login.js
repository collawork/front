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
            localStorage.setItem('token', response.data.token);
            navigate('/');
        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else if (error.request) {
                setError('서버와의 통신에 실패했습니다.');
            } else {
                setError('로그인 요청 중 오류가 발생했습니다.');
            }
        }
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
                {/* 에러 메시지 출력 */}
                {error && <p className="error-text">{typeof error === 'string' ? error : JSON.stringify(error)}</p>}
                <button type="submit" className="submit-button">로그인</button>
                <button type="button" className="register-button" onClick={() => navigate('/register')}>회원가입</button>
            </form>
        </div>
    );
}

export default Login;
