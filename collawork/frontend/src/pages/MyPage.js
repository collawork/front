/*
작성자: 서현준
작성일: 2024.10.31

마이 페이지 겸 헤더랑 네비가 없는 메인 페이지

날씨 AIP
fullcalendar API를 사용할 예정
*/
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../components/assest/css/MyPage.css';

const MyPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: '' });
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        // URL에서 토큰 추출 및 저장
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
    
        if (token) {
            localStorage.setItem('token', token);
        }
    
        // 사용자 정보 가져오기
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:8080/api/user/info', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    console.log('반환된 유저 정보 :', response.data);
                    setUser({
                        username: response.data.username
                    });
                } catch (error) {
                    console.error('사용자 정보를 불러오는 중 에러 발생 : ', error);
                }
            }
        };
    
        fetchUserData();

        // 현재 날짜 설정
        const date = new Date();
        const formattedDate = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
        setCurrentDate(formattedDate);
    }, []);

    // 캘린더로 이동
    const moveToCalender = () => {
        navigate('/calender');
    };

    // 프로젝트로 이동
    const moveToProject = () => {
        navigate('/project');
    };

    // 친구 페이지로 이동
    const moveToFirend = () => {
        navigate('/friend');
    };

    const handleDateClick = (arg) => {
        alert(arg.dateStr); // 클릭한 해당 날짜를 알러트로 표시
    };

    function renderEventContent(eventInfo) {
        return (
            <>
                {/* 이벤트의 시작과 종료 시간 출력 */}
                <b>{eventInfo.timeText}</b>
                {/* 이벤트 타이틀 */}
                <i>{eventInfo.event.title}</i>
            </>
        );
    }

    return (
        <>
            <div className="header">
                <span className="hi-user-name">안녕하세요 {user.username || '사용자'}님, 좋은 아침이예요!</span>
                {/* 로그인 정보를 바탕으로 이름을 조회하고 접속한 시간을 조회해서 해당하는 적당한 인사말을 넣어준다.*/}

                <span className="today">{currentDate}</span>
                {/* 현재 날짜를 표시 */}
                <img className="weather-icon" alt="날씨 아이콘" src="../image/icon/해당하는.png" />
            </div>

            <div className="centered-vertically">
                <div className="calender-mypage">
                    <span className="text">달력</span>
                    <img className="mypage-icon" alt="달력 아이콘" src='../image/icon/calender.png' />
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                        dateClick={handleDateClick} // 날짜 클릭 이벤트
                        eventContent={renderEventContent}
                        initialView="dayGridMonth" // 초기 달력 화면
                        views={{
                            timeGridWeek: {
                                duration: { weeks: 1 }, // 한번에 보여줄 주의 단위를 설정
                                buttonText: '주간 계획' // 주별로 화면 전환 버튼 텍스트
                            }
                        }}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'timeGridWeek' // 달력 화면 전환 버튼
                        }}
                        weekends={true}
                        events={[ // 이벤트 객체들
                            { title: '현욱이 생일', date: '2024-11-05', textColor: 'red' },
                            { title: 'event 2', date: '2024-11-01', start: '2024-11-10', end: '2024-11-12' },
                            { title: 'event 3', date: '2024-11-06' },
                            { title: 'event 4', start: '2024-11-05T10:00:00+09:00', end: '2024-11-06T08:00:00+09:00' }
                        ]}
                    />
                </div>

                <div className="horizontal-alignment">
                    <div className="projects-mypage">
                        <span className="text">프로젝트</span>
                        <img className="mypage-icon" alt="프로젝트 아이콘" src='../image/icon/project.png' />
                        <div className="project-list">
                            <span>Collawork 프로젝트</span>
                            <span>현준의 두 번째 프로젝트</span>
                            <span>현준의 첫 번째 프로젝트</span>
                        </div>
                    </div>

                    <div className="friends-mypage">
                        <span className="text">친구</span>
                        <img className="mypage-icon" alt="친구 아이콘" src='../image/icon/friend.png' />
                        <div className="friend-list">
                            <span>카리스마.동규</span>
                            <span>애착인형.진우</span>
                            <span>똘똘핑프.서연</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyPage;
