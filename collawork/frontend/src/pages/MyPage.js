/*
작성자: 서현준
작성일: 2024.10.31
마이 페이지 겸 헤더랑 네비가 없는 메인 페이지
날씨 API 예정
fullcalendar API
*/
import React, { useEffect, useState } from "react";
import axios from "axios";
import NotificationList from "../components/NotificationList/NotificationList";
import FriendList from "../components/Friend/FriendList";
import "../components/assest/css/MyPage.css";
import ProjectList from "../components/project/ProjectList";
import { MyCalendar } from "../components/calendar/MyCalendar";
import ChatList from '../components/Chat/ChatList';
import WeatherBackground from "./WeatherBackground";
import MyProfileIcon from "../pages/MyProfileIcon";
import Search from "./Search";
import Temperature from '../components/assest/images/temperature.png'
import Weather from '../components/assest/images/weather.png'
import Wind from '../components/assest/images/wind.png'
import { projectStore } from '../store';


const MyPage = () => {
    const [userId, setUserId] = useState(null);
    const [user, setUser] = useState({ username: "" });
    const [currentDate, setCurrentDate] = useState("");
    const [greeting, setGreeting] = useState("어서오세요.");
    const [weatherData, setWeatherData] = useState(null);
    const {projectData, PlusProjectData} = projectStore();

    useEffect(() => {
        console.log("마이페이지에서 확인하는 projectData :::::::::: ",projectData.id);
        PlusProjectData('');
        console.log("마이페이지에서 확인하는 projectData :::::::::: ",projectData.id);
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            localStorage.setItem("token", token);
        }

        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("토큰이 존재하지 않습니다. 로그인 후 다시 시도하세요.");
                return;
            }

            try {
                const response = await axios.get("http://localhost:8080/api/user/info", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data) {
                    setUserId(response.data.id);
                    setUser({ username: response.data.username });
                } else {
                    console.error("서버로부터 사용자 정보를 가져오지 못했습니다.");
                }
            } catch (error) {
                if (error.response?.status === 403) {
                    console.error("인증 오류: 토큰이 만료되었거나 권한이 없습니다.");
                } else {
                    console.error("사용자 정보를 불러오는 중 에러 발생:", error);
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
    console.log("마이페이지에서 확인하는 projectData :::::::::: ",projectData.id);

    console.log("weatherData : ",weatherData);

    return (
        <>
            {/* 헤더 */}
            <div className="mypage-header">
                <div className="mypage-header-content">
                    <span className="hi-user-name">
                        안녕하세요 {user.username || "사용자"}님, {greeting}
                    </span>
                    <span className="today">{currentDate}</span>
                </div>
                {/* 검색 컴포넌트 */}
                <div className="search-wrapper">
                <Search currentUser={{ id: userId }} />
                </div>
                <div className="profile-weather-container">
                {/* 날씨 정보 */}
                <WeatherBackground setWeatherData={setWeatherData} />
                {weatherData && (
                    <div className="weather-summary">
                    <div className="weather-item">
                        <img src={Weather} alt="Weather icon" className="weather-icon" />
                        <span>{weatherData.condition}</span>
                    </div>
                    <div className="weather-item">
                        <img src={Temperature} alt="Temperature icon" className="weather-icon" />
                        <span>{weatherData.temperature}°C</span>
                    </div>
                    <div className="weather-item">
                        <img src={Wind} alt="Wind icon" className="weather-icon" />
                        <span>{weatherData.windSpeed}m/s</span>
                    </div>
                </div>
                
                )}
                {/* 프로필 아이콘 */}
                <MyProfileIcon profileImage={user?.profileImage} user={user} />
            </div>
        </div>

            {/* 주요 섹션 */}
            <div className="mypage-container">
                {/* 캘린더 */}
                <div className="mypage-calendar-section">
                    <MyCalendar />
                </div>

                {/* 프로젝트 */}
                <div className="mypage-section mypage-project-section">
                    {userId && <ProjectList userId={userId} />}
                </div>

                {/* 알림 */}
                <div className="mypage-section mypage-notification-section">
                    {userId && <NotificationList userId={userId} />}
                </div>

                {/* 친구 목록 */}
                <div className="mypage-section mypage-friend-section">
                    {userId && <FriendList userId={userId} />}
                </div>

                {/* 채팅방 목록 컴포넌트*/}
                <div className='mypage-section mypage-chatList'>
                    {userId && <ChatList userId ={userId}/>}
                </div>
            </div>
        </>
    );
};

export default MyPage;
