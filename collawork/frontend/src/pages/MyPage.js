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
import gearIcon from "../components/assest/images/gear.png";

const MyPage = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleSettings = () => {
    setIsSettingsOpen((prev) => !prev);
  };

  const fetchProjectList = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("토큰이 없습니다. API 호출을 중단합니다.");
      return;
    }

    axios.post(
      `/api/user/projects/selectAll`,
      { userId },
      {
        baseURL: process.env.REACT_APP_API_URL,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (Array.isArray(response.data)) {
          setProjects(response.data);
        }
      })
      .catch((error) => {
        console.error("프로젝트 목록 조회 중 오류 발생:", error);
      });
  };

  const defaultSections = [
    { id: "calendar", content: <MyCalendar />, size: "large" },
    { id: "project", content: <ProjectList fetchProjects={fetchProjectList} />, size: "small" },
    { id: "notifications", content: <NotificationList fetchProjectList={fetchProjectList} />, size: "small" },
    { id: "friends", content: <FriendList />, size: "small" },
    { id: "chat", content: <ChatList />, size: "small" },
  ];

  const [sections, setSections] = useState(() => {
    const savedData = localStorage.getItem("mypagePreferences");
    if (savedData) {
      const { sections } = JSON.parse(savedData);
      return sections.map((savedSection) => ({
        ...defaultSections.find((section) => section.id === savedSection.id),
        size: savedSection.size,
      }));
    }
    return defaultSections;
  });

  const [globalOpacity, setGlobalOpacity] = useState(() => {
    const savedData = localStorage.getItem("mypagePreferences");
    return savedData ? JSON.parse(savedData).opacity : 1;
  });

  const [sectionColor, setSectionColor] = useState(() => {
    const savedData = localStorage.getItem("mypagePreferences");
    return savedData ? JSON.parse(savedData).color : "#ffffff";
  });

  const [gradientColors, setGradientColors] = useState({
    color1: "#ffffff",
    color2: "#000000",
  });

  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState({ username: "" });
  const [currentDate, setCurrentDate] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [greetingMessage, setGreetingMessage] = useState("안녕하세요!");
  const [projects, setProjects] = useState([]);

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
          setUserId(response.data.id);
          setUser({ username: response.data.username });
          setSections((prevSections) =>
            prevSections.map((section) => ({
              ...section,
              content: React.cloneElement(section.content, { userId: response.data.id }),
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

    setGreetingMessage(getGreetingMessage());

  }, []);

  const getGreetingMessage = () => {
    const now = new Date();
    const hours = now.getHours();

    if (hours >= 6 && hours < 12) {
      return "좋은 아침이에요! 👋";
    } else if (hours >= 12 && hours < 14) {
      return "점심식사 맛있게 하세요! 🍙";
    } else if (hours >= 14 && hours < 18) {
      return "오후에도 힘내보아요! 💪";
    } else if (hours >= 18 && hours < 20) {
      return "저녁식사 맛있게 하세요! 🍖";
    } else if (hours >= 20 && hours < 24) {
      return "오늘도 고생하셨어요! 🥂";
    } else {
      return "새벽 공기가 쌀쌀하네요! 🌙";
    }
  };

  const savePreferences = (updatedSections = sections, opacity = globalOpacity, color = sectionColor) => {
    const simplifiedSections = updatedSections.map((section) => ({
      id: section.id,
      size: section.size,
    }));

    const preferences = {
      sections: simplifiedSections,
      opacity,
      color,
    };

    localStorage.setItem("mypagePreferences", JSON.stringify(preferences));
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const reorderedSections = Array.from(sections);
    const [movedSection] = reorderedSections.splice(source.index, 1);
    reorderedSections.splice(destination.index, 0, movedSection);

    setSections(reorderedSections);
    savePreferences(reorderedSections);
  };

  const handleOpacityChange = (e) => {
    const newOpacity = parseFloat(e.target.value);
    setGlobalOpacity(newOpacity);
    savePreferences(sections, newOpacity, sectionColor);
  };

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setSectionColor(newColor);
    savePreferences(sections, globalOpacity, newColor);
  };

  const handleGradientChange = (e, colorKey) => {
    const newColors = {
      ...gradientColors,
      [colorKey]: e.target.value,
    };
    setGradientColors(newColors);

    setSectionColor(`linear-gradient(135deg, ${newColors.color1}, ${newColors.color2})`);
  };

  return (
    <>
      <div className="mypage-header">
        <div className="mypage-header-content">
          <span className="hi-user-name">
            <MyProfileIcon profileImage={user?.profileImage} user={user} />
            안녕하세요 {user.username || "사용자"}님, {greetingMessage}
          </span>
          <span className="today">{currentDate}</span>
        </div>

          <Search />

        <div className="profile-weather-container">
          {/* 설정 아이콘 */}
      <div className="settings-icon-container">
        <img
          src={gearIcon}
          alt="설정 아이콘"
          className="settings-icon"
          onClick={toggleSettings}
        />
        {/* 모달 */}
        {isSettingsOpen && (
          <div className="settings-modal">
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
            {/* 그라데이션 설정 */}
            {/* <div className="gradient-control">
                <label>그라데이션 색상 1</label>
                <input
                  type="color"
                  value={gradientColors.color1}
                  onChange={(e) => handleGradientChange(e, "color1")}
                />
                <label>그라데이션 색상 2</label>
                <input
                  type="color"
                  value={gradientColors.color2}
                  onChange={(e) => handleGradientChange(e, "color2")}
                />
              </div> */}
          </div>
        )}
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
                        className={`mypage-section ${section.size === "large" ? "large-section" : "small-section"
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
