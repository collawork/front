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

    // 달력 관련 변수들..
    // let formData; // fullcalendar에서 지원해 주는 기능.
    const [title, setTitle] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("")
    // let extendedProps; // fullcalendar에서 지원해주지 않는 기능.
    const [description , setDescription] = useState("");
    const [projectId, setProjectId] = useState("");
    const [createBy, setCreateBy] = useState("");
    // const [projectName, setProjectName] = useState([]);
    // 스케쥴 생성일 & 스케쥴 고유 아이디는 DB에서 부여


    // const []

    // const [formData, setFormData] = useState({
    //     scheduleId: '', pjId: '', scheduleTilte: '', scheduleDesc: '',
    //     scheduleStart: '', scheduleEnd: '', createdBy: '', createdAt: ''
    // });

    // function selectProjectName(){
    //     axios(
    //         {
    //             url:`${API_URL}/api/user/projects/selectAll`,
    //             headers: {
    //               'Authorization': `Bearer ${localStorage.getItem('token')}`
    //         },
    //         method: 'post',
    //         params: {userId},
    //         baseURL:'http://localhost:8080',
    //           withCredentials: true,
    //     }
    //     ).then(function(response){
    //         console.log(response);
    //         setProjectName(response.data);
    //         console.log("Aside : " + response.data);
    //     }
    // )
    // }


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

        setEventCRUDModal(true); // 모달창 오픈
    };

    const closeModal = () => {
        setEventCRUDModal(false);
    }

    useEffect(()=>{
        // 개인 달력..
        setProjectId(userId); // mypage의 달력은 개인용 달력이니 여기선 받을 프로젝트아이디가 없다..
        setCreateBy(userId);
    },[projectId, createBy]);

    const handleTitleChange = e =>{
        setTitle(e.target.value);
    };

    const handleStartChange = e =>{
        setStart(e.target.value);
    };

    const handleEndChange = e => {
        setEnd(e.target.value);
    };

    const handleDescriptionChange = e => {
        setDescription(e.target.value);
    };

    const handleSubmit = async (e) => {
        
        // extendedProps = {description, projectId, createBy}
        // formData = {title , start, end, extendedProps};

        e.preventDefault();
      
        if (title === '') { 
            alert('일정의 타이틀을 입력해 주세요.');
            return;
        } 

        try{
            await CalendarService.registerSchedule(title, start, end, description, projectId, createBy);
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
                            { title: 'event 4', start: '2024-11-05T10:00:00+09:00', end: '2024-11-06T08:00:00+09:00' },
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
                            설명: <input type='date' name='start' placeholder='시작일' onChange={handleStartChange}/>
                            설명: <input type='date' name='end' placeholder='종료일' onChange={handleEndChange}/>
                            {/* 스케쥴의 그룹인 프로젝트 아이디와 일정을 등록한 이의 아이디는 입력받지 않고 자동으로 */}
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
