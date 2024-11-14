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
import ProjectList from '../components/project/ProjectList';
import {calendarUser} from '../store';

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

    // 달력 관련 변수들..
    // let formData; // fullcalendar에서 지원해 주는 기능.
    const [title, setTitle] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [allDay, setAllDay] = useState(true);
    // let extendedProps; // fullcalendar에서 지원해주지 않는 기능.
    const [description , setDescription] = useState("");
    // const [projectId, setProjectId] = useState("");
    const [createdBy, setCreatedBy] = useState("");
    const [createdAt, setCreatedAt] = useState("");
    // const [projectName, setProjectName] = useState([]);


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

        setEventCRUDModal(true); // 모달창 오픈
         // 개인 달력..
        // setProjectId(); // mypage의 달력은 개인용 달력이니 여기선 받을 프로젝트아이디가 없다..
        setCreatedBy(userId);
        const interval = setInterval(() => {
            setCreatedAt(new Date);
        }, 1000*60); // 1분마다 현재 시간을 업데이트
        setStart(arg.Date) // 사용자가 클릭한 날짜를 스케쥴의 시작일로 담는다.
        console.log("달력을 클릭할 때 클릭한 날짜가 최초에 담기는지 확인: "+arg.date);

        return () => clearInterval(interval);
    };

    const closeModal = () => {
        setEventCRUDModal(false);
        return setAllDay(true);
    }

    // useEffect(()=>{
    //     // 개인 달력..
    //     // setProjectId(); // mypage의 달력은 개인용 달력이니 여기선 받을 프로젝트아이디가 없다..
    //     setCreateBy(userId);
    //     console.log("유저 아이디!!!! 이거 뭐야? 타입이 뭐야?? 읭????!!! "+userId);
    //     const interval = setInterval(() => {
    //         setCreatedAt(new Date);
    //     }, 1000); // 1초마다 현재 시간을 업데이트

    //     return () => clearInterval(interval); // 컴포넌트 언마운트 시 클리어

        
    // },[createdBy, createdAt]);

    const handleTitleChange = e =>{
        setTitle(e.target.value);
    };

    const handleAllDayChange = () => {
        setAllDay(!allDay);
    }

    const handleStartChange = e =>{
        console.log("handleStartChange 이 함수 실행 되고 있는가?" );
        let newStartStr = e.target.value; 
        console.log("newStartStr 시작일 입력하면 바뀌는지 확인: "+newStartStr);
        function hasTime(dateString) {
            console.log("1 dateString: "+dateString);
            const dateObject = new Date(dateString);
            console.log("2 dateString: "+dateString);
            return !isNaN(dateObject.getTime()) && dateObject.toTimeString().includes(':');
        }
        if(!hasTime(newStartStr)){
            setStart(`${newStartStr}T00:00`)
        }else{
            setStart(newStartStr)
        }
    };

    const handleEndChange = e => {
        const newEndStr = e.target.value; 
        function hasTime(dateString) {
            const dateObject = new Date(dateString);
            return !isNaN(dateObject.getTime()) && dateObject.toTimeString().includes(':');
        }
        if(!hasTime(newEndStr)){
            setEnd(`${newEndStr}T00:00`)
        }else{
            setEnd(newEndStr)
        }
    };

    const handleDescriptionChange = e => {
        setDescription(e.target.value);
    };

    const handleSubmit = async (e) => {

        e.preventDefault();        
        console.log("시분이 없는 스트링 형식 날짜에 씨붕을 붙였다! : "+start);

        if (title === '') { 
            alert('일정의 타이틀을 입력해 주세요.');
            return;
        } 

        try{
            let response = await CalendarService.registerSchedule(title, allDay, start, end, description, /*projectId,*/ createdBy, createdAt);
            
            if(response != null){
                alert('일정이 등록되었습니다.');
                console.log("응답: "+response);
            };

        }catch(error){
            console.error("에러: "+error);
            alert('일정등록에 실패하였습니다.');
        };

        return (setAllDay(true));
        
        
            
        
    };

    // function renderEventContent(eventInfo) {
    //     return (
    //         <>
    //             {/* 이벤트의 시작과 종료 시간 출력 */}
    //             <b>{eventInfo.timeText}</b>
    //             {/* 이벤트 타이틀 */}
    //             <i>{eventInfo.event.title}</i>
    //         </>
    //     );
    // }

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
                        // eventContent={renderEventContent}
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
                            { title: 'event 4', start: '2024-11-05T10:00:00', end: '2024-11-06T08:00:00' },
                            { title: 'event 5', date:'2024-11-05', start: '2024-11-05T09:00:00+09:00', end: '2024-11-06T07:00:00+09:00' },
                            { title: 'event 6', date:'2024-11-13', start: '2024-11-08', end: '2024-11-13T00:00:00+09:00' }

                        ]}
                    />
                    <ReactModal className={"event-CRUD-modal"}
                        isOpen={eventCRUDModal}
                        contentLabel="일정 조회 등록 수정 삭제"

                    >
                        <h2>일정등록</h2>
                        {/* 입력부 */}
                        <form onSubmit={handleSubmit}>
                            제목: <input type='text' name='tilte' placeholder='일정의 제목' onChange={handleTitleChange}/>
                            설명: <input type='text' name='description' placeholder='일정의 내용' onChange={handleDescriptionChange }/>
                            세부 시간 설정: <input type='checkbox' name='allDay' onChange={handleAllDayChange}/>
                            시작: <input type={allDay ? 'date' : 'datetime-local'} name='start' placeholder='시작일' onChange={handleStartChange}/>
                            종료: <input type={allDay ? 'date' : 'datetime-local'} name='end' placeholder='종료일' onChange={handleEndChange}/>
                            <button onClick={closeModal}>닫기</button>
                            <button type='submit'>일정등록</button>
                        </form>
                    </ReactModal>
                </div>

                <div className="horizontal-alignment">
                    {/* 프로젝트 목록 컴포넌트 */}
                    {userId && <ProjectList userId={userId} />}

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
