import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import NotificationList from '../components/NotificationList/NotificationList';
import '../components/assest/css/MyPage.css';

const MyPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: '' });
    const [userId, setUserId] = useState(null); // 유저 ID 저장
    const [currentDate, setCurrentDate] = useState('');
    const [greeting, setGreeting] = useState("어서오세요.");
    const [currentView, setCurrentView] = useState('dayGridMonth');

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
                        dateClick={() => {}}
                        eventContent={() => {}}
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
                            { title: '현욱이 생일', date: '2024-11-05', textColor: 'red' }
                        ]}
                    />
                </div>

                <div className="horizontal-alignment">
                    <div className="projects-mypage" onClick={moveToProject} style={{ cursor: 'pointer' }}>
                        <span className="text">프로젝트</span>
                        <div className="project-list">
                            <span>Collawork 프로젝트</span>
                            <span>현준의 두 번째 프로젝트</span>
                            <span>현준의 첫 번째 프로젝트</span>
                        </div>
                    </div>

                    {/* Notification Component */}
                    <NotificationList userId={userId} />
                </div>
            </div>
        </>
    );
};

export default MyPage;
