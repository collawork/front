import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

function SocialCallback() {
    const history = useHistory();

    useEffect(() => {
        const hash = window.location.hash;
        const token = new URLSearchParams(hash.substring(1)).get('access_token');

        if (token) {
            axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register/social`, {
                token
            })
            .then(() => {
                alert("소셜 로그인 및 회원가입 성공");
                history.push("/");
            })
            .catch(() => {
                alert("소셜 로그인 실패");
            });
        }
    }, [history]);

    return <div>로그인 처리 중...</div>;
}

export default SocialCallback;
