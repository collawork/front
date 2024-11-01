import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../components/assest/css/Dashboard.css';

function Dashboard() {
    const [user, setUser] = useState({ username: '', name: '', greeting: '' });
    const [projectReport, setProjectReport] = useState([]);
    const [projects, setProjects] = useState([]);
    const [friends, setFriends] = useState([]);
    const [schedule, setSchedule] = useState([]);

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
                        name: response.data.username
                    });
                } catch (error) {
                    console.error('사용자 정보를 불러오는 중 에러 발생 : ', error);
                }
            }
        };

        fetchUserData();
    }, []); // 컴포넌트가 마운트될 때 한 번만 실행

    return (
        <div className="dashboard">
            <header className="header">
                <h2>안녕하세요! {user.name || '사용자'}님 좋은 아침이에요.</h2>
                <p>{user.greeting}</p>
            </header>

            <section className="quick-links">
                <a href='https://google.com'>Google</a>
                <a href='https://mail.google.com/'>Gmail</a>
            </section>

            <section className="project-report">
                <h3>프로젝트 리포트</h3>
                <div className="report-grid">
                    {projectReport.map((report, index) => (
                        <div key={index} className="report-card" style={{ backgroundColor: report.color }}>
                            <span>{report.title}</span>
                            <p>{report.value}</p>
                            <p>{report.percentage}%</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="calendar">
                <h3>스케줄</h3>
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={schedule}
                />
            </section>

            <section className="projects">
                <h3>내 프로젝트</h3>
                <ul>
                    {projects.map((project, index) => (
                        <li key={index} className="project-item">
                            <span>{project.icon}</span>
                            <span>{project.name}</span>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="reminders">
                <h3>나를 위한 알림</h3>
                <ul>
                    {friends.map((friend, index) => (
                        <li key={index} className="friend-item">
                            <span>{friend.reminderIcon}</span>
                            <span>{friend.reminderText}</span>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}

export default Dashboard;
