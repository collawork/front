import React from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();

    const handleSignupClick = () => {
        navigate('/register');
    };

    return (
        <div style={styles.container}>
            <h2>로그인 페이지</h2>
            <button onClick={handleSignupClick} style={styles.button}>회원가입</button>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '50px',
    },
    button: {
        marginTop: '20px',
        padding: '10px 20px',
        fontSize: '1rem',
        cursor: 'pointer',
    },
};

export default Login;
