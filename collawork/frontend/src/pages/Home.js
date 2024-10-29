import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    const handleStartClick = () => {
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            <div style={styles.textContainer}>
                <h1 style={styles.title}>쉬운 협업툴<br />팀 업무관리에<br />메신저를 더하다.</h1>
                <p style={styles.subtitle}>모든 팀이 플로우로 모이면 더 큰 목표를 얻을 수 있습니다.</p>
                <button style={styles.button} onClick={handleStartClick}>시작하기</button>
            </div>
            <div style={styles.imageContainer}>
               
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#2C1A47',
        color: '#F3F3F3',
    },
    textContainer: {
        maxWidth: '500px',
        marginRight: '50px',
    },
    title: {
        fontSize: '3rem',
        fontWeight: 'bold',
        lineHeight: '1.2',
    },
    subtitle: {
        fontSize: '1.2rem',
        marginBottom: '20px',
    },
    button: {
        backgroundColor: '#7C3AED',
        color: '#FFF',
        padding: '15px 30px',
        fontSize: '1rem',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    imageContainer: {
    },
};

export default Home;
