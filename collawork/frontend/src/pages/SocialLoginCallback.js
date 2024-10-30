import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SocialLoginCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const url = window.location.href;
        console.log("Current URL:", url); // 현재 URL 출력

        const params = new URLSearchParams(window.location.search);
        let token = params.get('token'); // URL에서 token 파라미터 추출
        console.log("Extracted Token:", token); // token 값 출력

        if (!token) {
            // URL에 토큰이 없으면 localStorage에서 가져오기
            token = localStorage.getItem('token');
            console.log("Token from localStorage:", token);
        }

        if (token) {
            // token이 존재하면 로컬 스토리지에 저장 후 리디렉션
            localStorage.setItem('token', token);
            console.log("Token stored in localStorage");
            navigate('/');
        } else {
            console.error("Missing token in URL and localStorage");
            alert("로그인에 필요한 정보가 부족합니다.");
            navigate('/login');
        }
    }, [navigate]);

    return <div>소셜 로그인 중입니다...</div>;
}

export default SocialLoginCallback;
