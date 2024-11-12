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
import NotificationList from '../components/NotificationList/NotificationList';
import FriendList from '../components/Friend/FriendList';
import '../components/assest/css/MyPage.css';
import { useUser } from '../context/UserContext';
import CalendarService from '../services/CalendarService';

const MyPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: '' });
    // const [userId, setUserId] = useState(null); // 유저 ID 저장
    const { userId, setUserId } = useUser();
    const [currentDate, setCurrentDate] = useState('');
    const [greeting, setGreeting] = useState("어서오세요.");
    const [currentView, setCurrentView] = useState('dayGridMonth');
    const [eventCRUDModal, setEventCRUDModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜 상태

    // const [start,setStart] =use
    // setformdata.scheduleStart(start);

    // const [formData, setFormData] = useState({});

    const [title, setTitle] = useState("");
    const [start, setStart] = useState(new Date);
    const [end, setEnd] = useState("")

    const [description , setDescription] = useState("");


    // const []

    // const [formData, setFormData] = useState({
    //     scheduleId: '', pjId: '', scheduleTilte: '', scheduleDesc: '',
    //     scheduleStart: '', scheduleEnd: '', createdBy: '', createdAt: ''
    // });


    const [errors, setErrors] = useState({});
    const [validations, setValidations] = useState({});

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
            localStorage.setItem('token', token);
        }

        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:8080/api/user/info', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    setUser({ username: response.data.username });
                    setUserId(response.data.id); // 유저 ID 저장
                    console.log("Fetched userId:", response.data.id);
                } catch (error) {
                    console.error('사용자 정보를 불러오는 중 에러 발생 : ', error);
                }
            }
        };

        fetchUserData();

        const date = new Date();
        const formattedDate = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
        setCurrentDate(formattedDate);

        const currentHour = date.getHours();
        setGreeting(currentHour < 11 ? "좋은 아침이예요!" : "어서오세요.");
    }, []);

    const changeView = (view) => {
        setCurrentView(view);
    };

    const moveToProject = () => {
        navigate('/project');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleDateClick = (arg) => {
        
        // setFormData({...formData, scheduleStart:arg.dateStr}) // 클릭한 날짜를 일정의 시작일로 박아둔다. 물론 수정 가능!

        // 날짜를 클릭하면 해당하는 날짜의 모달창이 뜨고, 그 안에서 이벤트를 입력할 수 있도록 한다.
        // setSelectedDate(arg.dateStr); // 클릭한 날짜 저장
       
        setEventCRUDModal(true); // 모달창 오픈
    };

    const closeModal = () => {
        setEventCRUDModal(false);
    }

    // const handleChange = (e) => {
    //     const nowDateTime = new Date();
    //     const {name, value} = e.target;
    //     console.log(value);
    //     setFormData({...formData, [name] : value})
    //     setFormData({...formData, createdBy: userId})
    //     setFormData({...formData, createdAt: nowDateTime})
    //     console.log(nowDateTime);
    //     if(formData.scheduleId){
    //         setFormData({...formData, pjId:/*프로젝트 아이디 가져와서 넣기*/ "pjId"})
    //     }
        
        

    //     // if(name === "scheduleTilte"){
    //     //     setFormData({scheduleTilte: value})
    //     // } else if(name === "scheduleDesc"){
    //     //     setFormData({scheduleDesc: value})
    //     // } else if(name === "scheduleStart"){
    //     //     setFormData({scheduleStart: value})
    //     // }
    // }

    // const [formData, setFormData] = useState({
    //     scheduleId: '', pjId: '', scheduleTilte: '', scheduleDesc: '',
    //     scheduleStart: '', scheduleEnd: '', scheduleCreate: '', createdBy: '', createdAt: ''
    // });

    const handleChange = e =>{
        setTitle(e.target.value);
        setDescription("1234");
        console.log(e.target.value);

    };

    const handleSubmit = async (e) => {
        
        let formData = {title , description};
        
        
        

        e.preventDefault();
      
        if (formData.title === '') { // title: 'sdf'
            alert('일정의 타이틀을 입력해 주세요.');
            return;
        } 

        try{
            await CalendarService.registerSchedule(formData);
            alert('일정이 등록되었습니다.');
        }catch(error){
            console.error(error);
            alert('일정등록에 실패하였습니다.');
        };
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
                <span className="hi-user-name">
                    안녕하세요 {user.username || '사용자'}님, {greeting}
                </span>
                <button className="logout-button" onClick={handleLogout}>
                    로그아웃
                </button>
                <span className="today">{currentDate}</span>
            </div>

            <div className="centered-vertically">
                <div className="calender-mypage">
                    <span className="text">달력</span>
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                        dateClick={handleDateClick}
                        eventContent={renderEventContent}
                        key={currentView}
                        initialView={currentView}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'custom,custom2'
                        }}
                        customButtons={{
                            custom: {
                                text: '주간 보기',
                                click: () => changeView('timeGridWeek')
                            },
                            custom2: {
                                text: '월간 보기',
                                click: () => changeView('dayGridMonth')
                            }
                        }}
                        weekends={true}
                        events={[

                            /* 출력부 */

                            // 이벤트 객체들, 예시..
                            { title: '현욱이 생일', date: '2024-11-05', textColor: 'red', groupId:'1', extendedProps: {
                                department: 'BioChemistry'
                              }, description: '메롱~!!! 이거시가 설명이다~!!! 근데, 아무데서도 볼 수가 없네..' },
                            { title: 'event 1', start: '2024-11-15T23:00:00+09:00'},
                            { title: 'event 2', date: '2024-11-01', start: '2024-11-10', end: '2024-11-12', groupId:'1'},
                            { title: 'event 3', date: '2024-11-06' },
                            { title: 'event 4', start: '2024-11-05T10:00:00+09:00', end: '2024-11-06T08:00:00+09:00' }

                            // CREATE TABLE calendar_events (
                            //     id BIGINT AUTO_INCREMENT PRIMARY KEY,        -- 일정 고유 ID
                            //     project_id BIGINT,                           -- 프로젝트 ID (projects 테이블 참조)
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
                        <h2>일정등록</h2>
                        {/* 입력부 */}
                        <form onSubmit={handleSubmit}>
                            제목: <input type='text' name='Tilte' placeholder='일정의 제목' onChange={handleChange}/>
                         
                            {/* 설명: <input type='text' name='scheduleDesc' placeholder='상세한 내용' onChange={handleChange}/>
                            기간 설정: 
                            <input type='date' name='scheduleStart' placeholder='시작 시점' onChange={handleChange}/>
                            <input type='date' name='scheduleEnd' placeholder='종료 시점' onChange={handleChange}/> */}
                            <button onClick={closeModal}>닫기</button>
                            <button type='submit'>일정등록</button>
                        </form>
                    </ReactModal>
                </div>

                <div className="horizontal-alignment">
                    {/* <div className="projects-mypage" onClick={moveToProject} style={{ cursor: 'pointer' }}>
                        <span className="text">프로젝트</span>
                        <div className="project-list">
                            <span>Collawork 프로젝트</span>
                            <span>현준의 두 번째 프로젝트</span>
                            <span>현준의 첫 번째 프로젝트</span>
                        </div>
                    </div> */}
                    <div className="projects-mypage" onClick={moveToProject} style={{ cursor: 'pointer' }}>
                        <span className="text">프로젝트</span>  
                    </div>
                    {/* <div className="friends-mypage">
                        <span className="text">친구</span>
                        <img className="mypage-icon" alt="친구 아이콘" src='../image/icon/friend.png' />
                        <div className="friend-list">
                            <span>카리스마.동규</span>
                            <span>애착인형.진우</span>
                            <span>똘똘핑프.서연</span>
                        </div>
                    </div> */}

                    {/* 친구 목록 컴포넌트 */}
                    {userId && <FriendList userId={userId} />}

                    {/* 알림 컴포넌트 */}
                    {userId && <NotificationList userId={userId} />}
                </div>
            </div>
        </>
    );
};

export default MyPage;
