/*
작성자: 서현준
작성일: 2024.10.31

마이 페이지 겸 헤더랑 네비가 없는 메인 페이지

날씨 AIP
fullcalendar API를 사용할 예정
*/

import { useNavigate } from "react-router-dom"

const MyPage =()=>{
    const navigate = useNavigate();

    // 캘린더로 이동
    const moveToCalender = ()=>{
        navigate('/calender');
    };

    // 프로젝트로 이동
    const moveToProject =()=>{
        navigate('/project');
    }

    // 친구 페이지로 이동
    const moveToFirend =()=>{
        navigate('/friend');
    }
    
    return(
        <>

        </>
    )   
}
export default MyPage;