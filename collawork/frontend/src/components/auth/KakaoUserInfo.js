import React, { useEffect, useState } from 'react';
import axios from 'axios';

function KakaoUserInfo() {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const kakaoAccessToken = localStorage.getItem('kakaoAccessToken');
        
        // 액세스 토큰 확인용 로그
        console.log("카카오 액세스 토큰:", kakaoAccessToken);
        
        if (!kakaoAccessToken) {
            console.error("카카오 액세스 토큰이 없습니다.");
            return;
        }

        axios.get(`${process.env.REACT_APP_API_URL}/api/kakao/user-info`, {
            headers: {
                Authorization: `Bearer ${kakaoAccessToken}`
            }
        })
        .then(response => {
            setUserInfo(response.data);
            console.log("User Info:", response.data);
        })
        .catch(error => {
            console.error("Failed to fetch user info:", error);
        });
    }, []);

    if (!userInfo) return <div>Loading user information...</div>;

    return (
        <div>
            <h1>카카오 사용자 정보</h1>
            <p>이름: {userInfo.properties?.nickname}</p>
            <p>이메일: {userInfo.kakao_account?.email}</p>
            <p>테스트 ㅁㄴㅇㅁㄴㅇㅁㄴㅇㅁㄴㅇㅁㄴㅇㅁㄴㅇ</p>
        </div>
    );
}

export default KakaoUserInfo;
