import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleStartClick = () => {
        navigate('/login');
    };

    return (
        <div className="landing-page">
            <div className="intro-text">
                <h1>쉬운 협업툴<br />팀 업무관리에<br />메신저를 더하다.</h1>
                <p>Colla-Work와 함게 높은 목표로.</p>
                <button className="start-button" onClick={handleStartClick}>
                    시작하기
                </button>
            </div>
            <div className="background-image">
                {/* !!!!!!!!!! src에 페이지 이미지 추가하기 !!!!!!!!!! */}
                <img src="/path/to/첫 페이지.png" alt="첫 페이지 이미지" />
            </div>
        </div>
    );
};

export default LandingPage;