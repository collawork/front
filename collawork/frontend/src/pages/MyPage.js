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
import ReactModal from "react-modal";
import '../components/assest/css/MyPage.css';

const MyPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: '' });
    const [currentDate, setCurrentDate] = useState('');
    const [greeting, setGreeting] = useState("어서오세요.");
    const [currentView, setCurrentView] = useState('dayGridMonth');
    const [eventCRUDModal, setEventCRUDModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜 상태
    const [formData, setFormData] = useState({
        scheduleId: '', pjId: '', scheduleTilte: '', scheduleDesc: '',
        scheduleStart: '', scheduleEnd: '', scheduleCreate: '', createdBy: '', createdAt: ''
    });

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

        // 인사말을 설정하는 useEffect
        const currentHour = date.getHours();

        if (currentHour < 11) {
            setGreeting("좋은 아침이예요!");
        } else {
            setGreeting("어서오세요.");
        }

    }, []);

    const changeView = (view) => {
        setCurrentView(view);
    };

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

        // 날짜를 클릭하면 해당하는 날짜의 모달창이 뜨고, 그 안에서 이벤트를 입력할 수 있도록 한다.
        setSelectedDate(arg.dateStr); // 클릭한 날짜 저장
        setEventCRUDModal(true); // 모달창 오픈
    };

    const closeModal =()=>{
        setEventCRUDModal(false);
    }

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
                <span className="hi-user-name">안녕하세요 {user.username || '사용자'}님, {greeting}</span>
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
                        key={currentView} // currentView가 변경될 때마다 FullCalendar를 다시 렌더링하기 위함.. 
                        initialView={currentView} // 초기 달력 화면
                        // views={{
                        //     timeGridWeek: {
                        //         duration: { weeks: 1 }, // 한번에 보여줄 주의 단위를 설정
                        //         buttonText: '주간 계획' // 주별로 화면 전환 버튼 텍스트
                        //     }
                        // }}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'custom,custom2' // 사용자 정의 버튼 추가
                        }}
                        customButtons={{
                            custom: {
                                text: '주간 보기',
                                click: () => changeView('timeGridWeek') // 주간 뷰로 변경
                            },
                            custom2: {
                                text: '월간 보기',
                                click: () => changeView('dayGridMonth') // 월간 뷰로 변경
                            }
                        }}
                        weekends={true}
                        events={[ 

                            /* 출력부 */
                            
                            // 이벤트 객체들, 예시..
                            { title: '현욱이 생일', date: '2024-11-05', textColor: 'red' },
                            { title: 'event 2', date: '2024-11-01', start: '2024-11-10', end: '2024-11-12' },
                            { title: 'event 3', date: '2024-11-06' },
                            { title: 'event 4', start: '2024-11-05T10:00:00+09:00', end: '2024-11-06T08:00:00+09:00' }

                            // CREATE TABLE calendar_events (
                            //     id BIGINT AUTO_INCREMENT PRIMARY KEY,        -- 일정 고유 ID
                            //     project_id BIGINT NOT NULL,                  -- 프로젝트 ID (projects 테이블 참조)
                            //     title VARCHAR(255),                          -- 일정 제목
                            //     description TEXT,                            -- 일정 설명
                            //     start_time TIMESTAMP,                        -- 일정 시작 시간
                            //     end_time TIMESTAMP,                          -- 일정 종료 시간
                            //     created_by BIGINT,                           -- 일정 생성자 ID (users 테이블 참조)
                            //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 일정 생성일
                            //     FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE, -- 프로젝트 삭제 시 일정도 삭제
                            //     FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL -- 생성자 삭제 시 NULL로 설정
                            // );
                            
                        ]}
                    />
                    <ReactModal className={"event-CRUD-modal"}
                        isOpen={eventCRUDModal}
                        contentLabel="일정 조회 등록 수정 삭제"
                       
                    >
                        <h2>{selectedDate}의 일정</h2>
                        {/* 입력부 */}
                        <form>
                            제목: <input type='text' name='title' placeholder='일정의 제목'/>
                            설명: <input type='text' name='description' placeholder='상세한 내용'/>
                            기간 설정: <input type='date' name='startDate' placeholder='시작 시점'/>
                                      <input type='date' name='endDate' placeholder='종료 시점'/>
                            
                        </form>
                        <button></button>
                        <button onClick={closeModal}>닫기</button>
                    </ReactModal>
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
