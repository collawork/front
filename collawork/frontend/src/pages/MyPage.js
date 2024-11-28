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
  const defaultSections = [
    { id: "calendar", content: <MyCalendar />, size: "large" },
    { id: "project", content: <ProjectList />, size: "small" },
    { id: "notifications", content: <NotificationList />, size: "small" },
    { id: "friends", content: <FriendList />, size: "small" },
    { id: "chat", content: <ChatList />, size: "small" },
  ];

  const [sections, setSections] = useState(defaultSections);
  const [userId, setUserId] = useState(null); // 로그인된 사용자 ID
  const [user, setUser] = useState({ username: "" });
  const [currentDate, setCurrentDate] = useState("");
  const [weatherData, setWeatherData] = useState(null);

  const [globalOpacity, setGlobalOpacity] = useState(1);
  const [sectionColor, setSectionColor] = useState("#ffffff");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("토큰이 없습니다. 로그인 후 다시 시도해주세요.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:8080/api/user/info", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          setUserId(response.data.id); // 사용자 ID 설정
          setUser({ username: response.data.username });
          setSections((prevSections) =>
            prevSections.map((section) => ({
              ...section,
              content: React.cloneElement(section.content, { userId: response.data.id }), // userId 전달
            }))
          );
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

    loadPreferences(); // 로컬스토리지에서 설정 불러오기
  }, []);

  const savePreferences = () => {
    const simplifiedSections = sections.map((section) => ({
      id: section.id,
      size: section.size,
    }));

    const preferences = {
      sections: simplifiedSections,
      opacity: globalOpacity,
      color: sectionColor,
    };

    localStorage.setItem("mypagePreferences", JSON.stringify(preferences));
  };

  const loadPreferences = () => {
    try {
      const savedData = JSON.parse(localStorage.getItem("mypagePreferences"));
      if (savedData) {
        const restoredSections = savedData.sections.map((savedSection) => {
          const originalSection = defaultSections.find(
            (section) => section.id === savedSection.id
          );
          return {
            ...originalSection,
            size: savedSection.size,
          };
        });

        setSections(restoredSections);
        setGlobalOpacity(savedData.opacity || 1);
        setSectionColor(savedData.color || "#ffffff");
      } else {
        setSections(defaultSections);
      }
    } catch (error) {
      console.error("설정을 로드하는 중 오류 발생:", error);
      setSections(defaultSections);
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const reorderedSections = Array.from(sections);
    const [movedSection] = reorderedSections.splice(source.index, 1);
    reorderedSections.splice(destination.index, 0, movedSection);

    setSections(reorderedSections);
    savePreferences(); // 드래그 후 설정 저장
  };

  const handleOpacityChange = (e) => {
    setGlobalOpacity(parseFloat(e.target.value));
    savePreferences(); // 투명도 변경 후 설정 저장
  };

  const handleColorChange = (e) => {
    setSectionColor(e.target.value);
    savePreferences(); // 배경색 변경 후 설정 저장
  };

  return (
    <>
      <div className="mypage-header">
        <div className="mypage-header-content">
          <span className="hi-user-name">
            <MyProfileIcon profileImage={user?.profileImage} user={user} />안녕하세요 {user.username || "사용자"}님, 좋은 아침이에요!
          </span>
          <span className="today">{currentDate}</span>
        </div>
        <div className="search-wrapper">
          <Search />
        </div>
        <div className="profile-weather-container">
          <div className="opacity-control">
            <label htmlFor="opacity-slider">투명도</label>
            <input
              type="range"
              id="opacity-slider"
              min="0.1"
              max="1"
              step="0.1"
              value={globalOpacity}
              onChange={handleOpacityChange}
            />
          </div>
          <div className="color-control">
            <label htmlFor="color-picker">색상</label>
            <input
              type="color"
              id="color-picker"
              value={sectionColor}
              onChange={handleColorChange}
            />
          </div>
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
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="mypage-section-wrapper"
                    >
                      <div
                        className="mypage-section-background"
                        style={{
                          backgroundColor: sectionColor,
                          opacity: globalOpacity,
                        }}
                      ></div>
                      <div
                        className={`mypage-section ${
                          section.size === "large" ? "large-section" : "small-section"
                        }`}
                      >
                        <div className="drag-handle" {...provided.dragHandleProps}>
                          ≡
                        </div>
                        {section.content}
                      </div>
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
