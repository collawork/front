import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SocialLoginCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('access_token');
        const provider = params.get('provider'); // Google, Facebook 등

        if (token && provider) {
            axios.post(`${process.env.REACT_APP_API_URL}/api/auth/social/${provider}`, { token })
                .then((response) => {
                    localStorage.setItem('token', response.data.token);
                    navigate('/');
                })
                .catch(() => {
                    alert("소셜 로그인 실패");
                });
        }
    }, [navigate]);

    return <div>소셜 로그인 중입니다...</div>;
}

export default SocialLoginCallback;
