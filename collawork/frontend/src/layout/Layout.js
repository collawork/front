import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Aside from "../components/Aside";
import Search from "../pages/Search";
import FriendList from "../components/Friend/FriendList";
import PendingInvitations from "../components/project/PendingInvitations";
import axios from "axios";
import "../components/assest/css/Layout.css";
import { useUser } from "../context/UserContext";
import { stateValue } from "../store";
import InviteModal from "./InviteModal"; // 초대 모달 컴포넌트
import { useNavigate } from "react-router-dom";
import { projectStore, calendarEvents } from "../store";
import WeatherBackground from "../pages/WeatherBackground";
import gearIcon from "../components/assest/images/gear.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

const Layout = () => {
  const { userId } = useUser();
  const [activeTab, setActiveTab] = useState("friends");
  const [participants, setParticipants] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const { setHomeShow, setChatShow, setCalShow, setNotiShow, setVotig } = stateValue();
  const [userRole, setUserRole] = useState(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [opacity, setOpacity] = useState(1); // 초기값
  const [bgColor, setBgColor] = useState("#ffffff"); // 초기값
  const navigate = useNavigate();
  const { projectData, PlusProjectData } = projectStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  const toggleSettings = () => {
    setIsSettingsOpen((prev) => !prev);
  };

  // 저장된 설정 불러오기
  useEffect(() => {
    const savedOpacity = localStorage.getItem("layoutOpacity");
    const savedBgColor = localStorage.getItem("layoutBgColor");

    if (savedOpacity) setOpacity(parseFloat(savedOpacity));
    if (savedBgColor) setBgColor(savedBgColor);
  }, []);

  // 투명도 변경 처리
  const handleOpacityChange = (e) => {
    const newOpacity = parseFloat(e.target.value);
    setOpacity(newOpacity);
    localStorage.setItem("layoutOpacity", newOpacity); // 저장
  };

  // 배경색 변경 처리
  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setBgColor(newColor);
    localStorage.setItem("layoutBgColor", newColor); // 저장
  };

  const fetchAcceptedParticipants = async () => {
    if (!selectedProject || !selectedProject.id) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get(
        `${API_URL}/api/user/projects/${selectedProject.id}/participants/accepted`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setParticipants(
        response.data.map((participant) => ({
          name: participant.username || "이름 없음",
          email: participant.email || "이메일 없음",
        }))
      );
    } catch (error) {
      console.error("참여자 목록을 가져오는 중 오류 발생:", error);
    }
  };

  const fetchUserRole = async () => {
    if (!selectedProject?.id) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get(
        `${API_URL}/api/user/projects/${selectedProject.id}/role`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { userId },
        }
      );
      setUserRole(response.data.role);
    } catch (error) {
      console.error("사용자 역할을 가져오는 중 오류 발생:", error);
      setUserRole(null);
    }
  };

  useEffect(() => {
    if (activeTab === "participants") fetchAcceptedParticipants();
  }, [activeTab]);

  useEffect(() => {
    if (selectedProject && activeTab === "participants") {
      fetchAcceptedParticipants();
      fetchUserRole();
    }
  }, [selectedProject]);

  const moveToMypage = () => {
    navigate("/main");
    PlusProjectData("");
    setHomeShow("");
    setChatShow("");
    setCalShow("");
    setNotiShow("");
    setVotig("");
  };

  const renderList = () => {
    if (activeTab === "friends") {
      return <FriendList userId={userId} />;
    } else if (activeTab === "participants") {
      return participants.length ? (
        <ul>
          {participants.map((participant, index) => (
            <li key={index}>
              <strong>{participant.name}</strong> - {participant.email}
            </li>
          ))}
        </ul>
      ) : (
        <p>참여자가 없습니다.</p>
      );
    } else if (activeTab === "pending") {
      return (
        <PendingInvitations
          projectId={selectedProject?.id || null}
          onInvitationChange={fetchAcceptedParticipants}
        />
      );
    }
  };

  return (
    <div className="layout-container">
      <WeatherBackground />
      <div className="settings-container">
        {/* 설정 아이콘 */}
        <img
          src={gearIcon}
          alt="설정 아이콘"
          className="settings-icon"
          onClick={toggleSettings}
        />
        {/* 설정 모달 */}
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
                value={opacity}
                onChange={handleOpacityChange}
              />
            </div>
            <div className="color-control">
              <label htmlFor="color-picker">배경색</label>
              <input
                type="color"
                id="color-picker"
                value={bgColor}
                onChange={handleColorChange}
              />
            </div>
          </div>
        )}
      </div>
      <button className="button-to-main" onClick={moveToMypage}>  <FontAwesomeIcon icon={faHouse} /> </button>
      <Search currentUser={{ id: userId }} />
      <div className="main-content">
        <div
          className="aside"
          style={{
            background: `rgba(${parseInt(bgColor.slice(1, 3), 16)}, ${parseInt(
              bgColor.slice(3, 5),
              16
            )}, ${parseInt(bgColor.slice(5, 7), 16)}, ${opacity})`,
          }}
        >
          <Aside
            currentUser={{ id: userId }}
            onProjectSelect={(project) => setSelectedProject(project)}
          />
        </div>
        <div
          className="outlet-content"
          style={{
            background: `rgba(${parseInt(bgColor.slice(1, 3), 16)}, ${parseInt(
              bgColor.slice(3, 5),
              16
            )}, ${parseInt(bgColor.slice(5, 7), 16)}, ${opacity})`,
          }}
        >
          <Outlet />
        </div>
        <div
          className="participants"
          style={{
            background: `rgba(${parseInt(bgColor.slice(1, 3), 16)}, ${parseInt(
              bgColor.slice(3, 5),
              16
            )}, ${parseInt(bgColor.slice(5, 7), 16)}, ${opacity})`,
          }}
        >
          <div className="tab-buttons">
            <button
              onClick={() => setActiveTab("friends")}
              className={activeTab === "friends" ? "active" : ""}
            >
              친구 목록
            </button>
            <button
              onClick={() => setActiveTab("participants")}
              className={activeTab === "participants" ? "active" : ""}
            >
              참여자 목록
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={activeTab === "pending" ? "active" : ""}
            >
              초대 목록
            </button>
          </div>
          {userRole === "ADMIN" && (
            <button
              className="invite-button"
              onClick={() => setIsInviteModalOpen(true)}
            >
              초대하기
            </button>
          )}
          <div className="friend-list-modal">{renderList()}</div>
        </div>
      </div>
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        selectedProject={selectedProject}
        userId={userId}
      />
    </div>
  );
};

export default Layout;
