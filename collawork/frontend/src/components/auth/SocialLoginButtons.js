import React from 'react';

function SocialLoginButtons() {
    const handleSocialLogin = (provider) => {
        // console.log("provider : ", provider);
        const authUrl = {
            google: `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_API_URL}/login/oauth2/code/google&response_type=code&scope=profile%20email&state=${provider}`,
            kakao: `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_API_URL}/login/oauth2/code/kakao&response_type=code&scope=profile&state=${provider}`,
            naver: `https://nid.naver.com/oauth2.0/authorize?client_id=${process.env.REACT_APP_NAVER_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_API_URL}/login/oauth2/code/naver&response_type=code&state=${provider}`
        };
        window.location.href = authUrl[provider];
    };

    return (
        <div>
            <button onClick={() => handleSocialLogin('google')}>Google로 로그인</button>
            <button onClick={() => handleSocialLogin('kakao')}>Kakao로 로그인</button>
            <button onClick={() => handleSocialLogin('naver')}>Naver로 로그인</button>
        </div>
    );
}

export default SocialLoginButtons;
