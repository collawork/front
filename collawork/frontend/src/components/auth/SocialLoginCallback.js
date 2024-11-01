import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SocialLoginCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        console.log("SocialLoginCallback 컴포넌트가 렌더링됨");

        const params = new URLSearchParams(window.location.search);
        const token = params.get('token'); 
        const provider = params.get('provider');

        if (token) {
            localStorage.setItem('token', token);
            console.log("저장된 JWT 토큰:", localStorage.getItem('token'));
        } else {
            console.error("URL에 토큰이 없습니다.");
        }

        const handleSocialAuth = async () => {
            if (!token || !provider) {
                console.error("Authorization token 또는 provider가 없음");
                alert("로그인에 필요한 정보가 부족합니다.");
                navigate('/login');
                return;
            }

            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/api/auth/social/${provider}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                const { jwtToken, kakaoAccessToken, googleAccsessToken, NaverAccessToken } = response.data;
                if (jwtToken) localStorage.setItem('token', jwtToken);
                if (kakaoAccessToken) localStorage.setItem('kakaoAccessToken', kakaoAccessToken);
                if (googleAccsessToken) localStorage.setItem('googleAccsessToken', googleAccsessToken);
                if (NaverAccessToken) localStorage.setItem('NaverAccessToken', NaverAccessToken);

                localStorage.setItem('provider', provider);
                console.log("모든 토큰 저장 완료 후 리디렉션 시작");
                navigate('/');
            } catch (error) {
                console.error("소셜 로그인 실패:", error);
                console.log("에러 응답 데이터:", error.response ? error.response.data : "응답 없음");
                alert("소셜 로그인 실패");
                navigate('/login');
            }
        };

        handleSocialAuth();
    }, [navigate]);

    return <div>소셜 로그인 중입니다...</div>;
}

export default SocialLoginCallback;
