import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../components/assest/css/Home.css"

function Home() {
    
    const navigate = useNavigate();

    const handleStartClick = () => {
        navigate('/login');
    };

    return (
        <div className="container">
            <div className="text-container">
                <h1 className="title">쉬운 협업툴<br />팀 업무관리에<br />메신저를 더하다.</h1>
                <p className="subtitle">일정관리로 업무의 효율을 높이기</p>
                <button className="button" onClick={handleStartClick}>시작하기</button>
            </div>
            <div className="image-container">
               
            </div>
        </div>
    )
}

export default Home;
