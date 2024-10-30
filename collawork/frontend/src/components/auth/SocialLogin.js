import React from 'react';

function SocialLogin() {
    const handleSocialLogin = (provider) => {
        window.location.href = `${process.env.REACT_APP_API_URL}/oauth2/authorize/${provider}?redirect_uri=${window.location.origin}/social-login`;
    };

    return (
        <div>
            <button onClick={() => handleSocialLogin('google')}>Google 로그인</button>
            <button onClick={() => handleSocialLogin('facebook')}>Facebook 로그인</button>
        </div>
    );
}

export default SocialLogin;
