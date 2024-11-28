import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import NotificationList from "../components/NotificationList/NotificationList";
import FriendList from "../components/Friend/FriendList";
import ProjectList from "../components/project/ProjectList";
import { MyCalendar } from "../components/calendar/MyCalendar";
import ChatList from "../components/Chat/ChatList";
import WeatherBackground from "./WeatherBackground";
import MyProfileIcon from "../pages/MyProfileIcon";
import Search from "./Search";
import "../components/assest/css/MyPage.css";
import Temperature from "../components/assest/images/temperature.png";
import Weather from "../components/assest/images/weather.png";
import Wind from "../components/assest/images/wind.png";

const MyPage = () => {
  const [sections, setSections] = useState([
    { id: "calendar", content: <MyCalendar />, size: "large" },
    { id: "project", content: <ProjectList userId={1} />, size: "small" },
    { id: "notifications", content: <NotificationList userId={1} />, size: "small" },
    { id: "friends", content: <FriendList userId={1} />, size: "small" },
    { id: "chat", content: <ChatList userId={1} />, size: "small" },
  ]);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState({ username: "" });
  const [currentDate, setCurrentDate] = useState("");
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
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
        console.error("사용자 정보를 불러오는 중 에러 발생:", error);
      }
    };

    fetchUserData();

    const date = new Date();
    const formattedDate = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    setCurrentDate(formattedDate);
  }, []);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const reorderedSections = Array.from(sections);
    const [movedSection] = reorderedSections.splice(source.index, 1);
    reorderedSections.splice(destination.index, 0, movedSection);

    setSections(reorderedSections);
  };

  return (
    <>
      <div className="mypage-header">
        <div className="mypage-header-content">
          <span className="hi-user-name">
            안녕하세요 {user.username || "사용자"}님, 좋은 아침이에요!
          </span>
          <span className="today">{currentDate}</span>
        </div>
        <div className="search-wrapper">
          <Search />
        </div>
        <div className="profile-weather-container">
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
          <MyProfileIcon profileImage={user?.profileImage} user={user} />
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="sections" direction="vertical">
          {(provided) => (
            <div
              className="mypage-container"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {sections.map((section, index) => (
                <Draggable key={section.id} draggableId={section.id} index={index}>
                  {(provided) => (
                    <div
                      className={`mypage-section ${
                        section.size === "large" ? "large-section" : "small-section"
                      }`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <div className="drag-handle" {...provided.dragHandleProps}>
                        ≡
                      </div>
                      {section.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

export default MyPage;
