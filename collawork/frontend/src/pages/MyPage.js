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
import ProjectList from '../components/project/ProjectList'
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
    let formData; // fullcalendar에서 지원해 주는 기능.
    const [title, setTitle] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("")
    let extendedProps; // fullcalendar에서 지원해주지 않는 기능.
    const [description , setDescription] = useState("");
    const [projectId, setProjectId] = useState("");
    const [createBy, setCreateBy] = useState("");
    // 스케쥴 생성일 & 스케쥴 고유 아이디는 DB에서 부여

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
    };

    const closeModal = () => {
        setEventCRUDModal(false);
    }

    const handleChange = e => {
        setTitle(e.target.value);
        setDescription("1234");
        console.log(e.target.value);
    };

    const handleSubmit = async (e) => {
        extendedProps = {description, projectId, createBy};
        formData = {title , start, end, extendedProps};

        e.preventDefault();
      
        if (formData.title === '') { // title: 'sdf'
            alert('일정의 타이틀을 입력해 주세요.');
            return;
        } 

        try {
            await CalendarService.registerSchedule(formData);
            alert('일정이 등록되었습니다.');
        } catch (error) {
            console.error(error);
            alert('일정등록에 실패하였습니다.');
        }
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
                    />
                    <ReactModal className={"event-CRUD-modal"}
                        isOpen={eventCRUDModal}
                        contentLabel="일정 조회 등록 수정 삭제"
                    >
                        <h2>일정등록</h2>
                        <form onSubmit={handleSubmit}>
                            제목: <input type='text' name='Tilte' placeholder='일정의 제목' onChange={handleChange}/>
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
