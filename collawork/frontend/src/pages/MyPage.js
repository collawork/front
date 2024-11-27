/*
작성자: 서현준
작성일: 2024.10.31
마이 페이지 겸 헤더랑 네비가 없는 메인 페이지
날씨 API 예정
fullcalendar API
*/

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import NotificationList from '../components/NotificationList/NotificationList';
import FriendList from '../components/Friend/FriendList';
import '../components/assest/css/MyPage.css';
import { useUser } from '../context/UserContext';
import ProjectList from '../components/project/ProjectList'
import MyProfileIcon from '../pages/MyProfileIcon'
import { Calendar } from '../components/calendar/Calendar';
import ChatList from '../components/Chat/ChatList';

const MyPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: '' });
    const { userId, setUserId } = useUser();
    const [currentDate, setCurrentDate] = useState('');
    const [greeting, setGreeting] = useState("어서오세요.");
   
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
            localStorage.setItem('token', token);
        }

        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('토큰이 존재하지 않습니다. 로그인 후 다시 시도하세요.');
                return;
            }
        
            try {
                const response = await axios.get('http://localhost:8080/api/user/info', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.data) {
                    setUser({ username: response.data.username });
                    setUserId(response.data.id);
                    console.log("Fetched userId:", response.data.id);
                } else {
                    console.error('서버로부터 사용자 정보를 가져오지 못했습니다.');
                }
            } catch (error) {
                if (error.response?.status === 403) {
                    console.error('인증 오류: 토큰이 만료되었거나 권한이 없습니다.');
                } else {
                    console.error('사용자 정보를 불러오는 중 에러 발생:', error);
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


    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };




    

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
                    {/* 달력 컴포넌트 */}
                    <Calendar/>
                </div>

                <div className="horizontal-alignment">
                    {/* 프로젝트 목록 컴포넌트 */}
                    {userId && <ProjectList userId={userId} />}

                    {/* 친구 목록 컴포넌트 */}
                    {userId && <FriendList userId={userId} fetchFriends={fetchFriends} />}


                    {/* 알림 컴포넌트 */}
                    {userId && <NotificationList userId={userId} fetchFriends={fetchFriends} />}
                </div>
                <div className='chatList'>
                    {/* 채팅방 목록 컴포넌트*/}
                    {userId && <ChatList userId ={userId}/>}
                </div>
            </div>
        </>
    );
};

export default MyPage;
