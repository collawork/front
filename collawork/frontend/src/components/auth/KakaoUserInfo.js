import React, { useEffect, useState } from 'react';
import axios from 'axios';

function KakaoUserInfo() {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(`${process.env.REACT_APP_API_URL}/api/kakao/user-info`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                setUserInfo(response.data); // 사용자 정보 저장
                console.log("User Info:", response.data);
            })
            .catch(error => {
                console.error("Failed to fetch user info:", error);
            });
        }
    }, []);

    if (!userInfo) return <div>Loading user information...</div>;

    return (
        <div>
            <h1>카카오 사용자 정보</h1>
            <p>이름: {userInfo.properties?.nickname}</p>
            <p>이메일: {userInfo.kakao_account?.email}</p>
        </div>
    );
}

export default KakaoUserInfo;
