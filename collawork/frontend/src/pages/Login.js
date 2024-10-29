import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import "../components/assest/css/Login.css"; // 경로 수정

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState(''); // email 상태 정의
    const [password, setPassword] = useState(''); // password 상태 정의
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.login({ email, password });
            navigate('/'); // 로그인 성공 시 메인 페이지로 이동
        } catch (error) {
            setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
        }
    };

    return (
        <div className="login-container">
            <h2>로그인</h2>
            <form onSubmit={handleSubmit} className="login-form"> {/* 로그인 폼에 클래스 추가 */}
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
                <button type="submit" className="submit-button">로그인</button> {/* 클래스 추가 */}
                <button type="button" className="register-button" onClick={() => navigate('/register')}>회원가입</button> {/* 클래스 추가 */}
            </form>
        </div>
    );
}

export default Login;
