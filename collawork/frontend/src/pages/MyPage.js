/*
작성자: 서현준
작성일: 2024.10.31

마이 페이지 겸 헤더랑 네비가 없는 메인 페이지

날씨 AIP
fullcalendar API를 사용할 예정
*/
import { useNavigate } from "react-router-dom"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useState, useEffect } from "react"
import axios from "axios"

import '../components/assest/css/MyPage.css' ;

const MyPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: '', name: '', greeting: '' });
    const [greeting, setGreeting] = useState("어서오세요.");


    // 인사말을 설정하는 useEffect
    useEffect(() => {
        const date = new Date();
        const currentHour = date.getHours();

        if (currentHour < 11) {
            setGreeting("좋은 아침이예요!");
        } else {
            setGreeting("어서오세요.");
        }
    }, []); // 빈 배열을 전달하여 컴포넌트가 처음 렌더링될 때만 실행


    // 캘린더로 이동
    const moveToCalender = () => {
        navigate('/calender');
    };

    // 프로젝트로 이동
    const moveToProject = () => {
        navigate('/project');
    }

    // 친구 페이지로 이동
    const moveToFirend = () => {
        navigate('/friend');
    }

    const handleDateClick = (arg) => {
        alert(arg.dateStr) // 클릭한 헤당 날짜를 알러트로..
    }

    function renderEventContent(eventInfo) {
        return (
            <>
                {/* 이벤트의 시작과 종료 시간 출력. event4를 참고 */}
                <b>{eventInfo.timeText}</b> 
                {/* 이벤트 타이틀 */}
                <i>{eventInfo.event.title}</i>
            </>
        )
    }

    useEffect(() => {
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
                        username: response.data.username,
                        name: response.data.username,
                    });
                } catch (error) {
                    console.error('사용자 정보를 불러오는 중 에러 발생 : ', error);
                }
            }
        };
        fetchUserData();
    }, []);


    /*
    사용자가 달력에서 요구하는 기능 목록을 뽑아내 보자..!
    1. 클릭으로 특정 날을 지정할 수 있는 기능
        - 드래그를 통해 기간도 특정할 수 있도록 한다.
    2. 특정 날 또는 기간에 기록을 남기는 기능
        - text(title만 가질 수도 있고, title과 context를 둘다 가질 수도 있도록..),
          아이콘, 중요도 설정, 체크박스, 
    */


    return (
        <>
            <div className="나름 헤더">
                <span className="hi-user-name">안녕하세요 {user.name}님, {greeting}</span>
                {/* 로그인 정보를 바탕으로 이름을 조회하고 접속한 시간을 조회해서 해당하는 적당한 인사말을 넣어준다.*/}

                <span className="tpday">2024년 10월 30일</span>
                <image className="weather-icon" src="../image/icon/해당하는.png" />
            </div>

            <div className="종으로 가운데 정렬 flex?">
                <div className="calender-mypage">
                    <span className="text">달력</span>
                    <image className="mypage-icon" src='../image/icon/calender.png' />
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                        dateClick={handleDateClick} // 
                        eventContent={renderEventContent}
                        initialView="dayGridMonth" // 달력을 보여준다. // "timeGridWeek" 주별로 시간을 나눠 보여준다.
                        views={{
                            timeGridWeek:{
                                duration: {week:1}, // 한번에 보여줄 주의 단위를 정한다. 
                                buttonText: '주간 계획' //  주별로 화면을 전환시켜준다.
                            }
                        }}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'timeGridWeek' // 달력 화면 전환 버튼
                        }}

                        weekends={true}

                        events={[ // 이벤트 객체들.. 여기 쌓이면 달력에 반영된다.
                            { title: '현욱이 생일', date: '2024-11-05' },
                            { title: 'event 2', date: '2024-11-01', start: '2024-11-10', end: '2024-11-12' },
                            { title: 'event 3', date: '2024-11-06' },
                            { title: 'event 4', start: '2024-11-05T10:00:00+09:00', end: '2024-11-06T08:00:00+09:00' }
                        ]}
                    />
                </div>


                <div className="횡으로 나란히 정렬">
                    <div className="projects-mypage">
                        <span className="text">프로젝트</span>
                        <image className="mypage-icon" src='../image/icon/project.png' />
                        <div className="project-list">
                            <span>Collawork 프로젝트</span>
                            <span>현준의 두 번째 프로젝트</span>
                            <span>현준의 첫 번째 프로젝트</span>
                        </div>
                    </div>

                    <div className="friends-mypage">
                        <span className="text">친구</span>
                        <image className="mypage-icon" src='../image/icon/friend.png' />
                        <div className="friend-list">
                            <span>카리스마.동규</span>
                            <span>애착인형.진우</span>
                            <span>똘똘핑프.서연</span>
                        </div>
                    </div>
                </div>
            </div>
        </>


    )

}
export default MyPage;

