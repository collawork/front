/*
작성자: 서현준
작성일: 2024.10.31
마이 페이지 겸 헤더랑 네비가 없는 메인 페이지
날씨 API
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
import {calendarUserStore} from '../store';
import MyProfileIcon from '../pages/MyProfileIcon'

const MyPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: '' });
    const { userId, setUserId } = useUser();
    const [currentDate, setCurrentDate] = useState('');
    const [greeting, setGreeting] = useState("어서오세요.");
    const [currentView, setCurrentView] = useState('dayGridMonth');
    const [eventCRUDModal, setEventCRUDModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜 상태
    

    // 달력 관련 변수들..

    // const setStart = calendarUserStore(state => state.setStart);
    // 
    const {
        title, start, end, allDay, description, createdBy,
        setTitle, setStart, setEnd, setAllDay, setDescription, setCreatedBy
    } = calendarUserStore(); 

    // // let formData; // fullcalendar에서 지원해 주는 기능.
    // const [title, setTitle] = useState("");
    // const [start, setStart] = useState("");
    // const [end, setEnd] = useState("");
    // const [allDay, setAllDay] = useState(true);
    // // let extendedProps; // fullcalendar에서 지원해주지 않는 기능.
    // const [description , setDescription] = useState("");
    // // const [projectId, setProjectId] = useState("");
    // const [createdBy, setCreatedBy] = useState("");
    // const [createdAt, setCreatedAt] = useState("");
    // // const [projectName, setProjectName] = useState([]);


    const [errors, setErrors] = useState({});
    const [validations, setValidations] = useState({});
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
            localStorage.setItem('token', token);
        }

        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            console.log("userId"+userId);
            if (token) {
                try {
                    const response = await axios.get('http://localhost:8080/api/user/info', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    setUser({ username: response.data.username });
                    setUserId(response.data.id);
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
        let defaultStrZ = arg.date;
        let defaultDate = new Date(defaultStrZ)
        const options = {
            timeZone: 'Asia/Seoul',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false // 24시간 형식
        };
        let localKoreanTime = defaultDate.toLocaleString('ko-KR', options); // "2024. 11. 13. 00:00:00"
        
        setStart(localKoreanTime);
    };
    console.log("아무것도 입력하지 않고 모달 창을 띄우기만 했을때의 초기값 : "+start);
    // 모달 창을 띄우기만 했을때의 초기값 : Thu Nov 21 2024 00:00:00 GMT+0900 (한국 표준시)

    const closeModal = () => {
        setEventCRUDModal(false);
        return setAllDay(true);
    }

    const handleChange = e => {
        setTitle(e.target.value);
        console.log(title);
    };

    const handleAllDayChange = () => {
        setAllDay(!allDay);
    }

    const handleStartChange = e => {
        setStart(e.target.value);
        console.log(e.target.value);
        console.log("핸들 체인지 이후 일정 시작일의 변화 : "+start);        
    };

    const handleEndChange = e => {
        setEnd(e.target.value);
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
            let response = await CalendarService.registerSchedule(title, allDay, start, end, description, /*projectId,*/ createdBy);
            
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


    // 친구 목록 새로고침 함수 추가
    const fetchFriends = async () => {
        try {
            const token = localStorage.getItem('token');
            const userIdValue = typeof userId === 'object' && userId !== null ? userId.userId : userId;
            
            const response = await axios.get(`http://localhost:8080/api/friends/list`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                params: { userId: userIdValue },
            });
            setFriends(response.data);
        } catch (error) {
            console.error('친구 목록을 불러오는 중 오류 발생:', error);
        }
    };

    const go = ()=>{
        navigate('/chattingServer/6');
    }

    return (
        <>
            <div className="header">
                <span className="hi-user-name">
                    안녕하세요 {user.username || '사용자'}님, {greeting}
                </span>
                
                {/* 사용자 정보 컴포넌트 */}
                <MyProfileIcon profileImage={user?.profileImage} user={user} />

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
                    {userId && <FriendList userId={userId} fetchFriends={fetchFriends} />}

                    {/* 알림 컴포넌트 */}
                    {userId && <NotificationList userId={userId} fetchFriends={fetchFriends} />}
                </div>
            </div>
        </>
    );
};

export default MyPage;
