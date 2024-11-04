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

        console.log("받은 토큰:", token);
        console.log("Provider:", provider);

        const isValidToken = (token) => {
            return token && token.length > 20;
        };
        
        if (!isValidToken(token)) {
            console.error("유효하지 않은 토큰");
            alert("유효하지 않은 인증 정보");
            navigate('/login');
            return;
        }

        localStorage.setItem('token', token);
        console.log("저장된 JWT 토큰:", localStorage.getItem('token'));

        const handleSocialAuth = async () => {
            try {
                console.log("토큰과 제공자:", token, provider);
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/api/auth/social/${provider}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        withCredentials: true
                    }
                );

                console.log("응답 데이터:", response.data);

                const { jwtToken, kakaoAccessToken, googleAccsessToken, NaverAccessToken } = response.data;
                console.log("받은 토큰들:", { jwtToken, kakaoAccessToken, googleAccsessToken, NaverAccessToken });
                if (jwtToken) localStorage.setItem('token', jwtToken);
                if (kakaoAccessToken) localStorage.setItem('kakaoAccessToken', kakaoAccessToken);
                if (googleAccsessToken) localStorage.setItem('googleAccsessToken', googleAccsessToken);
                if (NaverAccessToken) localStorage.setItem('NaverAccessToken', NaverAccessToken);

                localStorage.setItem('provider', provider);
                console.log("모든 토큰 저장 완료 후 리디렉션 시작");
                navigate('/main');  // 소셜 로그인 후 /main으로 리디렉션
            } catch (error) {
                console.error("소셜 로그인 실패:", error);
                if (error.response) {
                    console.log("상태:", error.response.status);
                    console.log("헤더:", error.response.headers);
                    console.log("데이터:", error.response.data);
                } else if (error.request) {
                    console.log("요청은 전송됐으나 응답을 받지 못함:", error.request);
                } else {
                    console.log("에러 메시지:", error.message);
                }
                
                alert(`소셜 로그인 실패: ${error.response?.data?.message || error.message}`);
                navigate('/login');
            }
        };

        handleSocialAuth();
    }, [navigate]);

    return <div>소셜 로그인 중입니다...</div>;
}

export default SocialLoginCallback;
