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

    const moveToCalender = ()=>{
        navigate('/calender');
    };

    const moveToProject =()=>{
        navigate('/project');
    }

    const moveToFirend =()=>{
        navigate('/friend');
    }
    
    return(
        <>
            
        </>
    )   
}
export default MyPage;