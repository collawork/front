import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SocialLoginCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        console.log("SocialLoginCallback 컴포넌트가 렌더링됨");
        const params = new URLSearchParams(window.location.search);
        const token = localStorage.getItem('token');
        const provider = params.get('provider');

        const handleSocialAuth = async () => {
            console.log("현재 URL:", window.location.href);
            console.log("받은 token:", token);
            console.log("받은 provider:", provider);

            if (!token || !provider) {
                console.error("Authorization token or provider가 없음");
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