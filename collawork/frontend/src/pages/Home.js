import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../components/assest/css/Home.css"

function Home() {
    
    const navigate = useNavigate();

    const handleStartClick = () => {
        navigate('/login');
    };

    return (
        <div className="container-home">
            <div className="text-container-home">
                <h1 className="title-home">쉬운 협업툴<br />팀 업무관리에<br />메신저를 더하다.</h1>
                <p className="subtitle-home">일정관리로 업무의 효율을 높이기</p>
                <button className="button-home" onClick={handleStartClick}>시작하기</button>
            </div>
            <div className="image-container-home">
               
            </div>
        </div>
    )
}

export default Home;
